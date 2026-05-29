"""
Audio Analyzer: Downloads YouTube audio and detects chords per beat.
Uses yt-dlp for download, librosa for audio analysis, and template-based
cosine similarity for chord detection.
"""

import os
import re
import subprocess
import time
import traceback

import numpy as np

TEMP_DIR = "/tmp/musihacks_chordify"
MAX_DURATION = 600  # 10 minutes
SAMPLE_RATE = 22050
HOP_LENGTH = 512
CONFIDENCE_THRESHOLD = 0.55
MAX_CHORD_BARS = 8  # Max bars before forcing a new chord segment

# ─── Per-beat analysis and merging parameters ──────────────────────
MIN_PERSISTENCE_TIME = 0.8   # Seconds: minimum time a chord change must persist to be real
CHANGE_SIGNIFICANCE_THRESHOLD = 0.08  # Diferencia minima de similitud coseno para cambio real
CHROMA_SIMILARITY_THRESHOLD = 0.92    # Similitud coseno entre chromas para considerarlos iguales
DIATONIC_BONUS = 0.03        # Bonus para acordes con raiz diatonica
PRIMARY_DIATONIC_BONUS = 0.05  # Bonus para acordes I, IV, V, vi

# ─── Chord templates for cosine-similarity detection ───────────────

NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

# Sharp-to-flat mapping for post-processing chord names
_SHARP_TO_FLAT = {'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'}

# Keys that conventionally use flat names (root pitch classes)
# F(5), Bb(10), Eb(3), Ab(8), Db(1), Gb(6) major + Dm(2), Gm(7), Cm(0), Fm(5), Bbm(10), Ebm(3) minor
_FLAT_KEY_PCS = {1, 3, 5, 6, 8, 10}  # PCs whose keys prefer flats

# Chord types as semitone intervals from root (15 types)
AUDIO_CHORD_TYPES = {
    'major':      [0, 4, 7],
    'minor':      [0, 3, 7],
    'sus2':       [0, 2, 7],
    'sus4':       [0, 5, 7],
    '5':          [0, 7],           # power chord
    'dominant7':  [0, 4, 7, 10],
    'minor7':     [0, 3, 7, 10],
    'major7':     [0, 4, 7, 11],
    'diminished': [0, 3, 6],
    'augmented':  [0, 4, 8],
    'dim7':       [0, 3, 6, 9],
    'half_dim7':  [0, 3, 6, 10],
    'add9':       [0, 2, 4, 7],
    '6':          [0, 4, 7, 9],
    'm6':         [0, 3, 7, 9],
}

# Tiered simplicity bonus: simpler chords get a boost to break ties.
# Power chord ('5') gets a PENALTY because its 2-note template has unfair
# cosine similarity advantage — only wins when the 3rd is truly absent.
_SIMPLICITY_BONUS = {
    'major': 0.05, 'minor': 0.05,                          # Tier 1: triads
    'sus2': 0.02, 'sus4': 0.02,                             # Tier 2: suspended
    'dominant7': 0.01, 'minor7': 0.01, 'major7': 0.01,     # Tier 3: 7ths
    'diminished': 0.0, 'augmented': 0.0, 'dim7': 0.0,      # Tier 4: complex
    'half_dim7': 0.0, 'add9': 0.0, '6': 0.0, 'm6': 0.0,
    '5': -0.05,                                              # Penalty: 2-note template
}

# Display symbols per chord type
AUDIO_CHORD_SYMBOLS = {
    'major':      '',
    'minor':      'm',
    'sus2':       'sus2',
    'sus4':       'sus4',
    '5':          '5',
    'dominant7':  '7',
    'minor7':     'm7',
    'major7':     'maj7',
    'diminished': 'dim',
    'augmented':  'aug',
    'dim7':       'dim7',
    'half_dim7':  'm7b5',
    'add9':       'add9',
    '6':          '6',
    'm6':         'm6',
}

# Pre-compute normalized chroma template vectors: (root, type) -> unit vector
_TEMPLATES = {}

def _build_templates():
    for root_idx in range(12):
        for ctype, intervals in AUDIO_CHORD_TYPES.items():
            vec = np.zeros(12)
            for iv in intervals:
                vec[(root_idx + iv) % 12] = 1.0
            # Normalize to unit length
            vec /= np.linalg.norm(vec)
            _TEMPLATES[(root_idx, ctype)] = vec

_build_templates()

# ─── Krumhansl-Kessler key profiles for key detection ──────────────
# Each profile represents the expected chroma energy distribution for
# a key. We correlate the observed global chroma against all 24 profiles
# (12 major + 12 minor) and pick the best match.

_KK_MAJOR = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
_KK_MINOR = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])

# Display names: prefer flats for certain keys for conventional spelling
_KEY_DISPLAY = {
    0: ('C', 'Cm'),   1: ('C#', 'C#m'),  2: ('D', 'Dm'),
    3: ('Eb', 'Ebm'),  4: ('E', 'Em'),    5: ('F', 'Fm'),
    6: ('F#', 'F#m'),  7: ('G', 'Gm'),    8: ('Ab', 'G#m'),
    9: ('A', 'Am'),   10: ('Bb', 'Bbm'), 11: ('B', 'Bm'),
}


def _detect_key_from_chroma(chroma: np.ndarray) -> dict:
    """
    Detect key from a full chroma matrix using Krumhansl-Kessler profiles.
    Correlates mean chroma energy against all 24 major/minor key profiles.
    Returns dict with key name, mode, confidence (0-100), and top candidates
    for chord-informed refinement.
    """
    # Average chroma across all frames
    chroma_mean = np.mean(chroma, axis=1)

    # Avoid division by zero
    if np.max(chroma_mean) < 1e-8:
        return {"key": "C", "mode": "major", "confidence": 0, "_candidates": []}

    candidates = []
    for root in range(12):
        major_profile = np.roll(_KK_MAJOR, root)
        minor_profile = np.roll(_KK_MINOR, root)

        corr_maj = float(np.corrcoef(chroma_mean, major_profile)[0, 1])
        corr_min = float(np.corrcoef(chroma_mean, minor_profile)[0, 1])

        maj_name, min_name = _KEY_DISPLAY[root]
        candidates.append({"root": root, "key": maj_name, "mode": "major", "corr": corr_maj})
        candidates.append({"root": root, "key": min_name, "mode": "minor", "corr": corr_min})

    candidates.sort(key=lambda c: c["corr"], reverse=True)
    best = candidates[0]

    confidence = int(max(0, min(100, (best["corr"] - 0.3) / 0.6 * 100)))

    return {
        "key": best["key"],
        "mode": best["mode"],
        "confidence": confidence,
        "_candidates": candidates[:6],  # Top 6 for refinement
    }


def _refine_key_with_chords(key_info: dict, chords: list) -> dict:
    """
    Refine key detection using the distribution of detected chord roots.
    If a closely-correlated key candidate has significantly better chord-root
    coverage, switch to it. Fixes common confusions like Eb vs Ab.
    """
    candidates = key_info.get("_candidates", [])
    if len(candidates) < 2 or not chords:
        return key_info

    # Build duration-weighted root pitch class histogram
    root_weight = {}
    for c in chords:
        pc = _parse_root_pc(c["chord"])
        if pc is not None:
            root_weight[pc] = root_weight.get(pc, 0) + c.get("duration", 1.0)

    total_weight = sum(root_weight.values()) or 1.0

    # Score each candidate: what fraction of chord-root weight is diatonic?
    # Key insight: the tonic (I chord) should have the most weight
    best_combined = -1.0
    best_candidate = candidates[0]

    for cand in candidates[:6]:
        diatonic_pcs, primary_pcs = _build_diatonic_set(cand["key"], cand["mode"])
        if not diatonic_pcs:
            continue

        diatonic_weight = sum(w for pc, w in root_weight.items() if pc in diatonic_pcs)
        primary_weight = sum(w for pc, w in root_weight.items() if pc in primary_pcs)
        tonic_weight = root_weight.get(cand["root"], 0)

        diatonic_ratio = diatonic_weight / total_weight
        primary_ratio = primary_weight / total_weight
        tonic_ratio = tonic_weight / total_weight

        # Combined: K-K correlation + diatonic fit + tonic presence
        kk_score = (cand["corr"] - 0.3) / 0.6  # 0-1 range
        chord_score = 0.3 * diatonic_ratio + 0.3 * primary_ratio + 0.4 * tonic_ratio
        combined = 0.4 * kk_score + 0.6 * chord_score

        if combined > best_combined:
            best_combined = combined
            best_candidate = cand

    confidence = int(max(0, min(100, (best_candidate["corr"] - 0.3) / 0.6 * 100)))

    return {
        "key": best_candidate["key"],
        "mode": best_candidate["mode"],
        "confidence": confidence,
    }


def _ensure_temp_dir():
    os.makedirs(TEMP_DIR, exist_ok=True)
    # Cleanup old files (>1 hour)
    now = time.time()
    for f in os.listdir(TEMP_DIR):
        fp = os.path.join(TEMP_DIR, f)
        try:
            if now - os.path.getmtime(fp) > 3600:
                os.remove(fp)
        except OSError:
            pass


def extract_video_id(url: str) -> str:
    """Extract YouTube video ID from various URL formats."""
    patterns = [
        r'(?:v=|/v/|youtu\.be/)([a-zA-Z0-9_-]{11})',
        r'(?:embed/)([a-zA-Z0-9_-]{11})',
        r'^([a-zA-Z0-9_-]{11})$',
    ]
    for pat in patterns:
        m = re.search(pat, url)
        if m:
            return m.group(1)
    raise ValueError("No se pudo extraer el ID del video")


def download_audio(url: str, progress_cb=None) -> dict:
    """
    Download audio from YouTube URL using yt-dlp.
    Returns dict with video_id, title, filepath, duration.
    """
    _ensure_temp_dir()

    video_id = extract_video_id(url)
    output_path = os.path.join(TEMP_DIR, f"{video_id}.%(ext)s")

    if progress_cb:
        progress_cb(5, "Descargando audio...")

    # Get metadata first
    meta_cmd = [
        "yt-dlp", "--no-download", "--print", "%(title)s\n%(duration)s",
        "--no-warnings", url
    ]
    try:
        meta_result = subprocess.run(
            meta_cmd, capture_output=True, text=True, timeout=30
        )
        lines = meta_result.stdout.strip().split('\n')
        title = lines[0] if lines else "Sin título"
        duration = float(lines[1]) if len(lines) > 1 else 0
    except Exception:
        title = "Sin título"
        duration = 0

    if duration > MAX_DURATION:
        raise ValueError(f"Video muy largo ({duration:.0f}s). Máximo {MAX_DURATION}s (10 min).")

    if progress_cb:
        progress_cb(10, "Descargando audio...")

    # Download audio only
    dl_cmd = [
        "yt-dlp",
        "-x",  # Extract audio
        "--audio-format", "wav",
        "--audio-quality", "5",  # Medium quality (smaller file)
        "-o", output_path,
        "--no-playlist",
        "--no-warnings",
        url
    ]

    result = subprocess.run(dl_cmd, capture_output=True, text=True, timeout=120)
    if result.returncode != 0:
        raise RuntimeError(f"Error descargando: {result.stderr[:200]}")

    # Find the downloaded file
    audio_path = None
    for f in os.listdir(TEMP_DIR):
        if f.startswith(video_id) and not f.endswith('.part'):
            audio_path = os.path.join(TEMP_DIR, f)
            break

    if not audio_path or not os.path.exists(audio_path):
        raise RuntimeError("No se pudo descargar el audio")

    return {
        "video_id": video_id,
        "title": title,
        "duration": duration,
        "filepath": audio_path,
    }


def analyze_audio(filepath: str, progress_cb=None) -> dict:
    """
    Analyze audio file: extract beats, chroma features, detect chords.
    Returns dict with tempo, beats, chords timeline.
    Each stage has timeout protection and error handling.
    """
    import librosa

    analysis_start = time.time()
    STAGE_TIMEOUT = 90  # max seconds per stage
    TOTAL_TIMEOUT = 300  # 5 minutes total

    def _check_timeout(stage_name):
        elapsed = time.time() - analysis_start
        if elapsed > TOTAL_TIMEOUT:
            raise TimeoutError(f"Análisis excedió {TOTAL_TIMEOUT}s en etapa: {stage_name}")

    if progress_cb:
        progress_cb(25, "Cargando audio...")

    # Load audio
    y, sr = librosa.load(filepath, sr=SAMPLE_RATE, mono=True)
    _check_timeout("load")

    if progress_cb:
        progress_cb(28, "Separando armónicos...")

    # HPSS: separate harmonic content from percussive
    try:
        t0 = time.time()
        y_harmonic, _ = librosa.effects.hpss(y)
        if time.time() - t0 > STAGE_TIMEOUT:
            print(f"[chordify] HPSS tardó {time.time()-t0:.1f}s")
    except Exception as e:
        print(f"[chordify] HPSS falló: {e}, usando señal original")
        y_harmonic = y
    _check_timeout("hpss")

    if progress_cb:
        progress_cb(33, "Separando voz del acompañamiento...")

    # Vocal/accompaniment separation using median filtering
    try:
        t0 = time.time()
        S_full, phase = librosa.magphase(librosa.stft(y_harmonic))
        S_filter = librosa.decompose.nn_filter(
            S_full, aggregate=np.median, metric='cosine',
            width=int(librosa.time_to_frames(2, sr=sr, hop_length=HOP_LENGTH)),
        )
        S_filter = np.minimum(S_full, S_filter)
        margin_i, margin_v = 2, 10
        mask_bg = librosa.util.softmask(S_filter, margin_v * (S_full - S_filter), power=2)
        S_background = mask_bg * S_full
        y_accomp = librosa.istft(S_background * phase)
        if time.time() - t0 > STAGE_TIMEOUT:
            print(f"[chordify] Separación vocal tardó {time.time()-t0:.1f}s")
    except Exception as e:
        print(f"[chordify] Separación vocal falló: {e}, usando armónicos directos")
        y_accomp = y_harmonic
    _check_timeout("vocal_sep")

    if progress_cb:
        progress_cb(40, "Detectando ritmo...")

    # Beat detection (use original signal which includes percussive)
    try:
        tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr, hop_length=HOP_LENGTH)
        beat_times = librosa.frames_to_time(beat_frames, sr=sr, hop_length=HOP_LENGTH)
    except Exception as e:
        print(f"[chordify] Beat tracking falló: {e}, usando tempo por defecto")
        tempo = 120.0
        # Generate evenly spaced beats
        duration = len(y) / sr
        beat_interval = 60.0 / 120.0
        beat_times = np.arange(0, duration, beat_interval)
        beat_frames = librosa.time_to_frames(beat_times, sr=sr, hop_length=HOP_LENGTH)

    # If tempo is an array, take first value
    if hasattr(tempo, '__len__'):
        tempo = float(tempo[0]) if len(tempo) > 0 else 120.0
    else:
        tempo = float(tempo)
    _check_timeout("beat_track")

    if progress_cb:
        progress_cb(48, "Analizando armonía...")

    # Chroma features from accompaniment signal (vocals removed)
    # Use CENS (Energy Normalized Statistics) for robustness against timbre/volume changes
    chroma_raw = librosa.feature.chroma_cqt(y=y_accomp, sr=sr, hop_length=HOP_LENGTH)
    # Also compute from harmonic-only signal as fallback for vocal-heavy sections
    chroma_harm = librosa.feature.chroma_cqt(y=y_harmonic, sr=sr, hop_length=HOP_LENGTH)
    # Blend: accompaniment is preferred but harmonic helps when vocal sep fails
    chroma = 0.7 * chroma_raw + 0.3 * chroma_harm

    # Also compute low-frequency spectrum for bass detection (accompaniment only)
    try:
        S_bass = np.abs(librosa.cqt(y=y_accomp, sr=sr, hop_length=HOP_LENGTH,
                                    fmin=librosa.midi_to_hz(24), n_bins=36, bins_per_octave=12))
        bass_chroma = np.zeros((12, S_bass.shape[1]))
        for i in range(min(24, S_bass.shape[0])):
            bass_chroma[i % 12] += S_bass[i]
    except Exception as e:
        print(f"[chordify] Bass CQT falló: {e}, sin detección de inversiones")
        bass_chroma = np.zeros((12, chroma.shape[1]))
    _check_timeout("chroma")

    if progress_cb:
        progress_cb(55, "Detectando acordes por beat...")

    # Detect chords per individual beat (not per bar)
    beat_chords = []
    beat_chromas = []  # Store chroma vectors for significance testing
    total_beats = len(beat_times)

    for beat_idx in range(total_beats):
        start_frame = beat_frames[beat_idx]
        end_frame = beat_frames[beat_idx + 1] if beat_idx + 1 < total_beats else chroma.shape[1]

        if end_frame <= start_frame:
            continue

        beat_start = float(beat_times[beat_idx])
        beat_end = float(beat_times[beat_idx + 1]) if beat_idx + 1 < total_beats else float(len(y) / sr)

        # Per-frame normalization: each frame votes equally regardless of volume
        chroma_beat = chroma[:, start_frame:end_frame].copy()
        frame_norms = np.linalg.norm(chroma_beat, axis=0, keepdims=True)
        frame_norms[frame_norms < 1e-6] = 1.0
        chroma_beat /= frame_norms
        chroma_avg = np.mean(chroma_beat, axis=1)

        bass_beat = bass_chroma[:, start_frame:end_frame].copy()
        bass_norms = np.linalg.norm(bass_beat, axis=0, keepdims=True)
        bass_norms[bass_norms < 1e-6] = 1.0
        bass_beat /= bass_norms
        bass_avg = np.mean(bass_beat, axis=1)

        chord_info = _detect_chord_from_chroma(chroma_avg, bass_avg)
        beat_chords.append({
            "time": round(beat_start, 2),
            "duration": round(beat_end - beat_start, 2),
            "beat_idx": beat_idx,
            **chord_info,
        })
        beat_chromas.append(chroma_avg)

        if progress_cb and beat_idx % max(1, total_beats // 10) == 0:
            pct = 55 + int((beat_idx / total_beats) * 20)
            progress_cb(pct, f"Analizando acordes ({beat_idx}/{total_beats})...")

    if progress_cb:
        progress_cb(76, "Fusionando beats en segmentos...")

    # Adaptive persistence: at fast tempos, require more beats for a change to be real
    # e.g. 60 BPM -> 2 beats (0.8s), 120 BPM -> 2 beats, 160 BPM -> 3 beats
    import math
    persistence_beats = max(2, math.ceil(MIN_PERSISTENCE_TIME * tempo / 60.0))

    # Merge beats into segments with persistence and significance filters
    raw_chords = _merge_beats_to_segments(beat_chords, beat_chromas, persistence_beats)

    if progress_cb:
        progress_cb(82, "Detectando tonalidad...")

    key_info = _detect_key_from_chroma(chroma)

    if progress_cb:
        progress_cb(84, "Aplicando scoring diatónico...")

    # Re-evaluate non-diatonic chords using detected key
    raw_chords = _apply_diatonic_scoring(
        raw_chords, key_info, chroma, bass_chroma, beat_frames, beat_times,
        total_beats, len(y), sr
    )

    if progress_cb:
        progress_cb(87, "Optimizando timeline...")

    # Adaptive parameters based on tempo
    min_chord_dur = 60.0 / tempo * 1.0   # 1 beat
    approach_note_dur = 60.0 / tempo * 0.5  # half beat

    # Smooth timeline (merge + orphan removal + adaptive duration filter)
    smoothed = _smooth_timeline(raw_chords, min_chord_dur, approach_note_dur)

    if progress_cb:
        progress_cb(90, "Refinando tonalidad...")

    # Refine key using chord root distribution (fixes Eb vs Ab, etc.)
    key_info = _refine_key_with_chords(key_info, smoothed)

    # Re-run diatonic scoring with refined key if it changed
    smoothed = _apply_diatonic_scoring(
        smoothed, key_info, chroma, bass_chroma, beat_frames, beat_times,
        total_beats, len(y), sr
    )

    # Respell chord names for flat keys (A# -> Bb, D# -> Eb, etc.)
    smoothed = _respell_chords_for_key(smoothed, key_info["key"])

    return {
        "tempo": round(tempo, 1),
        "key": key_info["key"],
        "key_mode": key_info["mode"],
        "key_confidence": key_info["confidence"],
        "chords": smoothed,
    }


def _detect_chord_from_chroma(chroma_avg: np.ndarray, bass_avg: np.ndarray) -> dict:
    """
    Detect chord from chroma vector using cosine similarity against
    pre-computed templates (15 chord types with tiered simplicity bonus).
    """
    empty = {"chord": "-", "notes": [], "bass": None, "inversion": 0, "confidence": 0}

    # Check for silence
    norm = np.linalg.norm(chroma_avg)
    if norm < 0.01:
        return empty

    # Normalize observed chroma to unit vector
    chroma_unit = chroma_avg / norm

    # Find best matching template by cosine similarity (tiered simplicity bonus)
    best_score = -1.0
    best_sim = -1.0
    best_root = 0
    best_type = 'major'

    for (root_idx, ctype), template in _TEMPLATES.items():
        sim = float(np.dot(chroma_unit, template))
        score = sim + _SIMPLICITY_BONUS.get(ctype, 0.0)
        if score > best_score:
            best_score = score
            best_sim = sim
            best_root = root_idx
            best_type = ctype

    confidence = best_sim

    # Build chord symbol and note names
    root_name = NOTE_NAMES[best_root]
    symbol = root_name + AUDIO_CHORD_SYMBOLS[best_type]
    intervals = AUDIO_CHORD_TYPES[best_type]
    notes = [NOTE_NAMES[(best_root + iv) % 12] for iv in intervals]

    # Determine bass note and inversion from low-frequency chroma
    bass_note = None
    inversion = 0
    bass_norm = bass_avg / (np.max(bass_avg) + 1e-8)
    bass_pc = int(np.argmax(bass_norm)) if np.max(bass_norm) > 0.65 else None

    if bass_pc is not None and bass_pc != best_root and confidence >= 0.75:
        # Only show slash chord if bass is a chord tone and confidence is high
        chord_note_pcs = [(best_root + iv) % 12 for iv in intervals]
        if bass_pc in chord_note_pcs:
            inversion = chord_note_pcs.index(bass_pc)
            bass_note = NOTE_NAMES[bass_pc]

    if bass_note and inversion > 0:
        symbol = f"{symbol}/{bass_note}"

    return {
        "chord": symbol,
        "notes": notes,
        "bass": bass_note,
        "inversion": inversion,
        "confidence": round(float(confidence), 2),
    }


def _merge_beats_to_segments(beat_chords: list, beat_chromas: list, persistence_beats: int = 2) -> list:
    """
    Merge per-beat chord detections into segments using:
    1. Persistence filter: a chord change must last >= persistence_beats
    2. Significance filter: adjacent chromas must differ enough (cosine sim < threshold)
    3. Consecutive merge: identical adjacent chords become one segment
    """
    if not beat_chords:
        return []

    n = len(beat_chords)

    # Step 1: Apply persistence filter - mark real changes
    # A change is "real" only if the new chord persists for >= MIN_PERSISTENCE_BEATS
    filtered_labels = [beat_chords[0]["chord"]] * n
    current_chord = beat_chords[0]["chord"]
    run_start = 0

    for i in range(1, n):
        if beat_chords[i]["chord"] != current_chord:
            # Look ahead: how many consecutive beats have this new chord?
            run_len = 1
            for j in range(i + 1, n):
                if beat_chords[j]["chord"] == beat_chords[i]["chord"]:
                    run_len += 1
                else:
                    break

            if run_len >= persistence_beats:
                # Also check significance: is the chroma actually different?
                if i < len(beat_chromas) and run_start < len(beat_chromas):
                    norm_a = np.linalg.norm(beat_chromas[run_start])
                    norm_b = np.linalg.norm(beat_chromas[i])
                    if norm_a > 1e-6 and norm_b > 1e-6:
                        cos_sim = float(np.dot(beat_chromas[run_start], beat_chromas[i]) / (norm_a * norm_b))
                        if cos_sim > CHROMA_SIMILARITY_THRESHOLD:
                            # Chromas too similar — not a real change
                            filtered_labels[i] = current_chord
                            continue

                # Real change
                current_chord = beat_chords[i]["chord"]
                run_start = i
                filtered_labels[i] = current_chord
            else:
                # Not persistent enough — keep previous chord
                filtered_labels[i] = current_chord
        else:
            filtered_labels[i] = current_chord

    # Step 2: Build segments from filtered labels
    segments = []
    seg_start = 0

    for i in range(1, n):
        if filtered_labels[i] != filtered_labels[seg_start]:
            # Find the best beat_chord entry for this segment's chord info
            best_entry = None
            best_conf = -1
            for j in range(seg_start, i):
                if beat_chords[j]["chord"] == filtered_labels[seg_start]:
                    if beat_chords[j].get("confidence", 0) > best_conf:
                        best_conf = beat_chords[j].get("confidence", 0)
                        best_entry = beat_chords[j]

            if best_entry is None:
                best_entry = beat_chords[seg_start]

            seg_end_time = beat_chords[i]["time"]
            segments.append({
                "time": round(beat_chords[seg_start]["time"], 2),
                "duration": round(seg_end_time - beat_chords[seg_start]["time"], 2),
                "chord": filtered_labels[seg_start],
                "notes": best_entry.get("notes", []),
                "bass": best_entry.get("bass"),
                "inversion": best_entry.get("inversion", 0),
                "confidence": best_entry.get("confidence", 0),
            })
            seg_start = i

    # Last segment
    if seg_start < n:
        best_entry = None
        best_conf = -1
        for j in range(seg_start, n):
            if beat_chords[j]["chord"] == filtered_labels[seg_start]:
                if beat_chords[j].get("confidence", 0) > best_conf:
                    best_conf = beat_chords[j].get("confidence", 0)
                    best_entry = beat_chords[j]
        if best_entry is None:
            best_entry = beat_chords[seg_start]

        last_beat = beat_chords[n - 1]
        seg_end_time = last_beat["time"] + last_beat["duration"]
        segments.append({
            "time": round(beat_chords[seg_start]["time"], 2),
            "duration": round(seg_end_time - beat_chords[seg_start]["time"], 2),
            "chord": filtered_labels[seg_start],
            "notes": best_entry.get("notes", []),
            "bass": best_entry.get("bass"),
            "inversion": best_entry.get("inversion", 0),
            "confidence": best_entry.get("confidence", 0),
        })

    return segments


# ─── Enharmonic note name to pitch class mapping ──────────────────
_NOTE_TO_PC = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'Fb': 4, 'E#': 5, 'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11, 'Cb': 11, 'B#': 0,
}


def _parse_root_pc(chord_symbol: str) -> int | None:
    """
    Extract pitch class of the root from a chord symbol.
    E.g. "C#m7" -> 1, "Bbdim" -> 10, "G" -> 7
    Handles enharmonics (Bb, Eb, etc).
    """
    if not chord_symbol or chord_symbol == '-':
        return None

    # Strip slash bass note
    base = chord_symbol.split('/')[0]
    if not base or not base[0].isalpha():
        return None

    # Extract root: first letter + optional # or b
    root = base[0].upper()
    if len(base) > 1 and base[1] in ('#', 'b'):
        root += base[1]

    return _NOTE_TO_PC.get(root)


def _should_use_flats(key_name: str) -> bool:
    """Determine if a key conventionally uses flat note names."""
    # If the key name itself contains a flat, definitely use flats
    if 'b' in key_name:
        return True
    pc = _parse_root_pc(key_name)
    if pc is None:
        return False
    # Check if it's a minor key by looking for 'm' after the root
    is_minor = key_name.endswith('m') and not key_name.endswith('#m')
    if is_minor:
        # Minor keys with flats: Dm(2), Gm(7), Cm(0), Fm(5), Bbm(10), Ebm(3)
        return pc in {0, 2, 3, 5, 7, 10}
    # Major keys with flats: F(5), Bb(10), Eb(3), Ab(8), Db(1), Gb(6)
    return pc in _FLAT_KEY_PCS


def _respell_sharp_to_flat(name: str) -> str:
    """Convert a single sharp note name to flat equivalent: 'A#' -> 'Bb'."""
    return _SHARP_TO_FLAT.get(name, name)


def _respell_chords_for_key(chords: list, key_name: str) -> list:
    """
    Post-process chord list: if the key uses flats, rename all sharp notes
    to their flat equivalents (A# -> Bb, D# -> Eb, etc).
    """
    if not _should_use_flats(key_name):
        return chords

    result = []
    for c in chords:
        c = dict(c)

        # Respell chord symbol
        symbol = c["chord"]
        # Handle slash chords: "A#m7/D#" -> "Bbm7/Eb"
        parts = symbol.split('/')
        respelled_parts = []
        for part in parts:
            # Extract root (1-2 chars) and suffix
            if len(part) > 1 and part[1] == '#':
                root = part[:2]
                suffix = part[2:]
                respelled_parts.append(_respell_sharp_to_flat(root) + suffix)
            else:
                respelled_parts.append(part)
        c["chord"] = '/'.join(respelled_parts)

        # Respell note names
        c["notes"] = [_respell_sharp_to_flat(n) for n in c.get("notes", [])]

        # Respell bass note
        if c.get("bass"):
            c["bass"] = _respell_sharp_to_flat(c["bass"])

        result.append(c)
    return result


def _build_diatonic_set(key_name: str, mode: str) -> tuple:
    """
    Build the set of diatonic pitch classes for a key, plus the set of
    primary degree roots (I, IV, V, vi for major; i, iv, v, VI for minor).
    Returns (all_diatonic_pcs: set, primary_pcs: set).
    """
    root_pc = _NOTE_TO_PC.get(key_name.replace('m', ''))
    if root_pc is None:
        # Try stripping trailing 'm' for minor keys like "Cm" -> "C"
        clean = key_name
        if clean.endswith('m') and len(clean) > 1:
            clean = clean[:-1]
        root_pc = _NOTE_TO_PC.get(clean)
    if root_pc is None:
        return set(), set()

    if mode == 'major':
        # Major scale intervals: W W H W W W H
        scale_intervals = [0, 2, 4, 5, 7, 9, 11]
        # Primary degrees: I(0), IV(5), V(7), vi(9)
        primary_intervals = [0, 5, 7, 9]
    else:
        # Natural minor scale intervals: W H W W H W W
        scale_intervals = [0, 2, 3, 5, 7, 8, 10]
        # Primary degrees: i(0), iv(5), v(7), VI(8)
        primary_intervals = [0, 5, 7, 8]

    all_pcs = {(root_pc + iv) % 12 for iv in scale_intervals}
    primary_pcs = {(root_pc + iv) % 12 for iv in primary_intervals}

    return all_pcs, primary_pcs


def _apply_diatonic_scoring(
    segments: list, key_info: dict,
    chroma: np.ndarray, bass_chroma: np.ndarray,
    beat_frames: np.ndarray, beat_times: np.ndarray,
    total_beats: int, audio_len: int, sr: int,
) -> list:
    """
    Re-evaluate chords that are NOT diatonic to the detected key.
    If a diatonic chord has competitive similarity, prefer it.
    Only applies when key confidence >= 30%.
    """
    if key_info["confidence"] < 30:
        return segments

    diatonic_pcs, primary_pcs = _build_diatonic_set(key_info["key"], key_info["mode"])
    if not diatonic_pcs:
        return segments

    result = []
    for seg in segments:
        root_pc = _parse_root_pc(seg["chord"])

        # If already diatonic or undetectable, keep as-is
        if root_pc is None or root_pc in diatonic_pcs:
            result.append(seg)
            continue

        # Non-diatonic chord — re-run template matching with diatonic bonuses
        # Find approximate frame range for this segment
        seg_start_time = seg["time"]
        seg_end_time = seg["time"] + seg["duration"]

        # Find beat frames covering this segment
        start_frame = None
        end_frame = None
        for bi in range(total_beats):
            bt = float(beat_times[bi])
            if bt >= seg_start_time and start_frame is None:
                start_frame = int(beat_frames[bi])
            if bt >= seg_end_time:
                end_frame = int(beat_frames[bi])
                break
        if start_frame is None:
            start_frame = 0
        if end_frame is None:
            end_frame = chroma.shape[1]
        if end_frame <= start_frame:
            result.append(seg)
            continue

        # Compute chroma for this segment
        chroma_seg = chroma[:, start_frame:end_frame].copy()
        frame_norms = np.linalg.norm(chroma_seg, axis=0, keepdims=True)
        frame_norms[frame_norms < 1e-6] = 1.0
        chroma_seg /= frame_norms
        chroma_avg = np.mean(chroma_seg, axis=1)

        norm = np.linalg.norm(chroma_avg)
        if norm < 0.01:
            result.append(seg)
            continue
        chroma_unit = chroma_avg / norm

        # Re-run matching with diatonic bonuses
        best_score = -1.0
        best_sim = -1.0
        best_root = 0
        best_type = 'major'

        for (root_idx, ctype), template in _TEMPLATES.items():
            sim = float(np.dot(chroma_unit, template))
            score = sim + _SIMPLICITY_BONUS.get(ctype, 0.0)

            # Diatonic bonuses
            if root_idx in primary_pcs:
                score += PRIMARY_DIATONIC_BONUS
            elif root_idx in diatonic_pcs:
                score += DIATONIC_BONUS

            if score > best_score:
                best_score = score
                best_sim = sim
                best_root = root_idx
                best_type = ctype

        # Only override if the diatonic candidate is reasonably close
        # (don't override if original had much better raw similarity)
        original_conf = seg.get("confidence", 0)
        if best_sim >= original_conf - 0.08:
            root_name = NOTE_NAMES[best_root]
            symbol = root_name + AUDIO_CHORD_SYMBOLS[best_type]
            intervals = AUDIO_CHORD_TYPES[best_type]
            notes = [NOTE_NAMES[(best_root + iv) % 12] for iv in intervals]

            # Recompute bass
            bass_seg = bass_chroma[:, start_frame:end_frame].copy()
            bn = np.linalg.norm(bass_seg, axis=0, keepdims=True)
            bn[bn < 1e-6] = 1.0
            bass_seg /= bn
            bass_avg = np.mean(bass_seg, axis=1)
            bass_norm = bass_avg / (np.max(bass_avg) + 1e-8)
            bass_pc = int(np.argmax(bass_norm)) if np.max(bass_norm) > 0.65 else None

            bass_note = None
            inversion = 0
            if bass_pc is not None and bass_pc != best_root and best_sim >= 0.75:
                chord_pcs = [(best_root + iv) % 12 for iv in intervals]
                if bass_pc in chord_pcs:
                    inversion = chord_pcs.index(bass_pc)
                    bass_note = NOTE_NAMES[bass_pc]

            if bass_note and inversion > 0:
                symbol = f"{symbol}/{bass_note}"

            result.append({
                "time": seg["time"],
                "duration": seg["duration"],
                "chord": symbol,
                "notes": notes,
                "bass": bass_note,
                "inversion": inversion,
                "confidence": round(float(best_sim), 2),
            })
        else:
            result.append(seg)

    return result


def _smooth_timeline(raw_chords: list, min_chord_dur: float, approach_note_dur: float) -> list:
    """
    Improved smoothing pipeline:
    1. Merge consecutive identical chords (with max duration cap)
    2. Remove orphans using harmonic distance analysis
    3. Adaptive minimum duration filter (tempo-based)
    4. Filter low confidence
    """
    if not raw_chords:
        return []

    # Step 1: merge consecutive identical chords (with max duration cap)
    avg_seg_dur = np.mean([c["duration"] for c in raw_chords if c["duration"] > 0]) if raw_chords else 1.0
    max_merge_dur = avg_seg_dur * MAX_CHORD_BARS

    merged = []
    current = dict(raw_chords[0])

    for i in range(1, len(raw_chords)):
        chord = raw_chords[i]
        current_dur = round(chord["time"] + chord["duration"] - current["time"], 2)

        if (chord["chord"] == current["chord"] and chord["chord"] != "-"
                and current_dur <= max_merge_dur):
            current["duration"] = current_dur
            # Keep the higher confidence entry's details
            if chord.get("confidence", 0) > current.get("confidence", 0):
                current["notes"] = chord["notes"]
                current["bass"] = chord["bass"]
                current["inversion"] = chord["inversion"]
                current["confidence"] = chord["confidence"]
        else:
            if current["chord"] != "-":
                merged.append(current)
            elif merged:
                # Extend previous chord over silence gap
                merged[-1]["duration"] = round(
                    chord["time"] - merged[-1]["time"], 2
                )
            current = dict(chord)

    if current["chord"] != "-":
        merged.append(current)

    # Step 2: remove orphans with harmonic distance analysis
    # Preserve: chromatic patterns, same-root-different-quality, significant changes
    # Remove: very short chords without harmonic context
    if len(merged) > 2:
        consolidated = [merged[0]]
        for i in range(1, len(merged) - 1):
            c = merged[i]
            prev_chord = consolidated[-1]
            nxt = merged[i + 1]

            # If duration is reasonable, always keep
            if c["duration"] >= min_chord_dur:
                consolidated.append(c)
                continue

            # Short chord — check if it's musically meaningful
            keep = False

            prev_pc = _parse_root_pc(prev_chord["chord"])
            curr_pc = _parse_root_pc(c["chord"])
            next_pc = _parse_root_pc(nxt["chord"])

            if prev_pc is not None and curr_pc is not None and next_pc is not None:
                # Chromatic pattern: stepwise root motion (semitone or tone)
                diff1 = min((curr_pc - prev_pc) % 12, (prev_pc - curr_pc) % 12)
                diff2 = min((next_pc - curr_pc) % 12, (curr_pc - next_pc) % 12)
                if diff1 <= 2 and diff2 <= 2:
                    keep = True

                # Same root, different quality (e.g., C -> Cm -> C7) — keep
                if curr_pc == prev_pc or curr_pc == next_pc:
                    keep = True

                # Common harmonic motion (4th/5th) — keep
                if diff1 in (5, 7) or diff2 in (5, 7):
                    keep = True

            # Very short and no harmonic justification — absorb into previous
            if not keep and c["duration"] < approach_note_dur:
                consolidated[-1]["duration"] = round(
                    nxt["time"] - consolidated[-1]["time"], 2
                )
            else:
                consolidated.append(c)

        consolidated.append(merged[-1])
        merged = consolidated

    # Step 3: filter low confidence
    merged = [c for c in merged if c.get("confidence", 0) >= CONFIDENCE_THRESHOLD]

    # Step 4: recalculate durations to fill gaps after filtering
    for i in range(len(merged) - 1):
        gap_end = merged[i + 1]["time"]
        merged[i]["duration"] = round(gap_end - merged[i]["time"], 2)

    return merged


def analyze_youtube(url: str, progress_cb=None) -> dict:
    """
    Full pipeline: download + analyze + cleanup.
    Returns complete analysis result.
    """
    filepath = None
    try:
        # Download
        dl_info = download_audio(url, progress_cb)
        filepath = dl_info["filepath"]

        if progress_cb:
            progress_cb(20, "Audio descargado, analizando...")

        # Analyze
        analysis = analyze_audio(filepath, progress_cb)

        if progress_cb:
            progress_cb(95, "Finalizando...")

        result = {
            "video_id": dl_info["video_id"],
            "title": dl_info["title"],
            "duration": dl_info["duration"],
            "tempo": analysis["tempo"],
            "key": analysis["key"],
            "key_mode": analysis.get("key_mode", "major"),
            "key_confidence": analysis["key_confidence"],
            "chords": analysis["chords"],
        }

        if progress_cb:
            progress_cb(100, "Listo")

        return result

    except TimeoutError as e:
        print(f"[chordify] Timeout: {e}")
        raise RuntimeError(f"El análisis tardó demasiado: {e}")
    except Exception as e:
        print(f"[chordify] Error en análisis: {traceback.format_exc()}")
        raise
    finally:
        # Always cleanup
        if filepath and os.path.exists(filepath):
            try:
                os.remove(filepath)
            except OSError:
                pass
