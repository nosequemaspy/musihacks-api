"""
Audio Analyzer: Downloads YouTube audio and detects chords per beat.
Uses yt-dlp for download, librosa for audio analysis, and template-based
cosine similarity for chord detection.
"""

import os
import re
import shutil
import subprocess
import tempfile
import time
import traceback
from collections import Counter

import numpy as np

TEMP_DIR = "/tmp/musihacks_chordify"
MAX_DURATION = 600  # 10 minutes
SAMPLE_RATE = 22050
HOP_LENGTH = 512
MIN_CHORD_DURATION = 0.6  # Reducido para capturar acordes más rápidos y adornos
APPROACH_NOTE_DURATION = 0.3  # Duración típica de approach notes
CONFIDENCE_THRESHOLD = 0.55  # Reducido ligeramente para capturar más acordes
MAX_CHORD_BARS = 8  # Max bars before forcing a new chord segment

# ─── Chord templates for cosine-similarity detection ───────────────

NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

# Chord types as semitone intervals from root
AUDIO_CHORD_TYPES = {
    'major':      [0, 4, 7],
    'minor':      [0, 3, 7],
    'dominant7':  [0, 4, 7, 10],
    'minor7':     [0, 3, 7, 10],
    'major7':     [0, 4, 7, 11],
    'diminished': [0, 3, 6],
    'augmented':  [0, 4, 8],
}

# Simplicity bonus: triads get a small boost to break ties, but not enough
# to override a clearly better 7th chord match (e.g. Am7, Fmaj7, E7)
_TRIAD_TYPES = {'major', 'minor'}
SIMPLICITY_BONUS = 0.02

# Beats per bar for bar-level grouping
BEATS_PER_BAR = 4

# Display symbols per chord type
AUDIO_CHORD_SYMBOLS = {
    'major':      '',
    'minor':      'm',
    'dominant7':  '7',
    'minor7':     'm7',
    'major7':     'maj7',
    'diminished': 'dim',
    'augmented':  'aug',
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
    Returns dict with key name, mode, and confidence (0-100).
    """
    # Average chroma across all frames
    chroma_mean = np.mean(chroma, axis=1)

    # Avoid division by zero
    if np.max(chroma_mean) < 1e-8:
        return {"key": "C", "mode": "major", "confidence": 0}

    best_corr = -2.0
    best_root = 0
    best_mode = "major"

    for root in range(12):
        # Rotate profile so index 0 = the candidate root
        major_profile = np.roll(_KK_MAJOR, root)
        minor_profile = np.roll(_KK_MINOR, root)

        corr_maj = float(np.corrcoef(chroma_mean, major_profile)[0, 1])
        corr_min = float(np.corrcoef(chroma_mean, minor_profile)[0, 1])

        if corr_maj > best_corr:
            best_corr = corr_maj
            best_root = root
            best_mode = "major"
        if corr_min > best_corr:
            best_corr = corr_min
            best_root = root
            best_mode = "minor"

    # Map to display name
    maj_name, min_name = _KEY_DISPLAY[best_root]
    key_name = min_name if best_mode == "minor" else maj_name

    # Confidence: map correlation (typically 0.3-0.9) to 0-100
    confidence = int(max(0, min(100, (best_corr - 0.3) / 0.6 * 100)))

    return {"key": key_name, "mode": best_mode, "confidence": confidence}


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
        progress_cb(55, "Detectando acordes por compás...")

    # Detect chords per bar (group BEATS_PER_BAR beats into one analysis)
    raw_chords = []
    total_beats = len(beat_times)
    total_bars = max(1, (total_beats + BEATS_PER_BAR - 1) // BEATS_PER_BAR)

    for bar in range(total_bars):
        first_beat = bar * BEATS_PER_BAR
        last_beat = min(first_beat + BEATS_PER_BAR - 1, total_beats - 1)

        if first_beat >= total_beats:
            break

        start_frame = beat_frames[first_beat]
        end_frame = beat_frames[last_beat + 1] if last_beat + 1 < total_beats else chroma.shape[1]

        if end_frame <= start_frame:
            continue

        bar_start = float(beat_times[first_beat])
        bar_end = float(beat_times[last_beat + 1]) if last_beat + 1 < total_beats else float(len(y) / sr)

        # Per-frame normalization: each frame votes equally regardless of volume
        # This prevents loud vocal sections from dominating the chord detection
        chroma_bar = chroma[:, start_frame:end_frame].copy()
        frame_norms = np.linalg.norm(chroma_bar, axis=0, keepdims=True)
        frame_norms[frame_norms < 1e-6] = 1.0
        chroma_bar /= frame_norms
        chroma_avg = np.mean(chroma_bar, axis=1)

        bass_bar = bass_chroma[:, start_frame:end_frame].copy()
        bass_norms = np.linalg.norm(bass_bar, axis=0, keepdims=True)
        bass_norms[bass_norms < 1e-6] = 1.0
        bass_bar /= bass_norms
        bass_avg = np.mean(bass_bar, axis=1)
        chord_info = _detect_chord_from_chroma(chroma_avg, bass_avg)
        raw_chords.append({
            "time": round(bar_start, 2),
            "duration": round(bar_end - bar_start, 2),
            **chord_info,
        })

        if progress_cb and bar % max(1, total_bars // 10) == 0:
            pct = 55 + int((bar / total_bars) * 25)
            progress_cb(pct, f"Analizando acordes ({bar}/{total_bars})...")

    if progress_cb:
        progress_cb(82, "Detectando tonalidad...")

    key_info = _detect_key_from_chroma(chroma)

    if progress_cb:
        progress_cb(85, "Optimizando timeline...")

    # Smooth timeline (majority vote + merge + orphan removal)
    smoothed = _smooth_timeline(raw_chords)

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
    pre-computed templates. Restricted to 7 chord types (major, minor,
    dom7, min7, maj7, dim, aug) to avoid overly complex labels.
    """
    empty = {"chord": "-", "notes": [], "bass": None, "inversion": 0, "confidence": 0}

    # Check for silence
    norm = np.linalg.norm(chroma_avg)
    if norm < 0.01:
        return empty

    # Normalize observed chroma to unit vector
    chroma_unit = chroma_avg / norm

    # Find best matching template by cosine similarity
    # Triads get a simplicity bonus so they win over 7ths when similarity is close
    best_score = -1.0
    best_sim = -1.0
    best_root = 0
    best_type = 'major'

    for (root_idx, ctype), template in _TEMPLATES.items():
        sim = float(np.dot(chroma_unit, template))
        score = sim + (SIMPLICITY_BONUS if ctype in _TRIAD_TYPES else 0)
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


def _majority_vote_smooth(raw_chords: list, window: int = 3) -> list:
    """
    Sliding-window majority vote with window=3: only fix single-bar
    glitches without destroying real chord progressions.
    """
    if len(raw_chords) < window:
        return raw_chords

    smoothed = []
    half = window // 2

    for i in range(len(raw_chords)):
        lo = max(0, i - half)
        hi = min(len(raw_chords), i + half + 1)
        labels = [raw_chords[j]["chord"] for j in range(lo, hi)]
        most_common = Counter(labels).most_common(1)[0][0]

        entry = dict(raw_chords[i])
        # Only override if the original differs AND there is a clear majority
        count = labels.count(most_common)
        if most_common != "-" and count > 1 and entry["chord"] != most_common:
            for j in range(lo, hi):
                if raw_chords[j]["chord"] == most_common:
                    entry["chord"] = most_common
                    entry["notes"] = raw_chords[j]["notes"]
                    entry["bass"] = raw_chords[j]["bass"]
                    entry["inversion"] = raw_chords[j]["inversion"]
                    entry["confidence"] = raw_chords[j]["confidence"]
                    break
        smoothed.append(entry)

    return smoothed


def _smooth_timeline(raw_chords: list) -> list:
    """
    Pipeline: majority-vote (window=3) → merge consecutive identical →
    remove orphan chords (single short chords between longer ones) →
    filter low confidence.
    """
    if not raw_chords:
        return []

    # Step 1: gentle majority vote (only fix single-bar glitches)
    voted = _majority_vote_smooth(raw_chords)

    # Step 2: merge consecutive identical chords (with max duration cap)
    # Estimate bar duration for capping
    avg_seg_dur = np.mean([c["duration"] for c in voted if c["duration"] > 0]) if voted else 1.0
    max_merge_dur = avg_seg_dur * MAX_CHORD_BARS  # Don't merge beyond MAX_CHORD_BARS segments

    merged = []
    current = dict(voted[0])

    for i in range(1, len(voted)):
        chord = voted[i]
        current_dur = round(chord["time"] + chord["duration"] - current["time"], 2)

        if (chord["chord"] == current["chord"] and chord["chord"] != "-"
                and current_dur <= max_merge_dur):
            current["duration"] = current_dur
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

    # Step 3: remove orphan chords — pero preservar bajadas cromáticas y approach notes
    # Solo eliminar si es MUY corto (< APPROACH_NOTE_DURATION) y no forma parte de patrón cromático
    if len(merged) > 2:
        consolidated = [merged[0]]
        for i in range(1, len(merged) - 1):
            c = merged[i]
            prev = merged[i - 1]
            nxt = merged[i + 1]

            # Detectar si es parte de patrón cromático (acordes con roots adyacentes)
            is_chromatic_pattern = False
            try:
                from .theory.notes import note_to_pc
                prev_root = prev["chord"].split('/')[0].rstrip('0123456789').replace('maj', '').replace('m', '').replace('dim', '').replace('aug', '').replace('sus', '')[:2]
                curr_root = c["chord"].split('/')[0].rstrip('0123456789').replace('maj', '').replace('m', '').replace('dim', '').replace('aug', '').replace('sus', '')[:2]
                next_root = nxt["chord"].split('/')[0].rstrip('0123456789').replace('maj', '').replace('m', '').replace('dim', '').replace('aug', '').replace('sus', '')[:2]

                prev_pc = note_to_pc(prev_root) if len(prev_root) > 0 and prev_root[0].isalpha() else None
                curr_pc = note_to_pc(curr_root) if len(curr_root) > 0 and curr_root[0].isalpha() else None
                next_pc = note_to_pc(next_root) if len(next_root) > 0 and next_root[0].isalpha() else None

                # Patrón cromático: movimiento de semitono entre 3 acordes consecutivos
                if prev_pc is not None and curr_pc is not None and next_pc is not None:
                    diff1 = abs((curr_pc - prev_pc) % 12)
                    diff2 = abs((next_pc - curr_pc) % 12)
                    # Semitono (1 o 11 en módulo 12) o tono (2 o 10)
                    if (diff1 in (1, 2, 10, 11)) and (diff2 in (1, 2, 10, 11)):
                        is_chromatic_pattern = True
            except:
                pass

            # Solo eliminar si es MUY corto Y NO es patrón cromático
            if c["duration"] < APPROACH_NOTE_DURATION and not is_chromatic_pattern:
                # Absorb into the previous chord (extend its duration)
                consolidated[-1]["duration"] = round(
                    merged[i + 1]["time"] - consolidated[-1]["time"], 2
                )
            else:
                consolidated.append(c)
        consolidated.append(merged[-1])
        merged = consolidated

    # Step 4: filter low confidence
    merged = [c for c in merged if c.get("confidence", 0) >= CONFIDENCE_THRESHOLD]

    # Step 5: recalculate durations to fill gaps after filtering
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
