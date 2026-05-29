"""
MIDI Generator: Creates MIDI accompaniment from detected chords and
transcribes audio to MIDI using basic-pitch (Spotify).
"""

import os
import time

from midiutil import MIDIFile

MIDI_DIR = "/tmp/musihacks_midi"
DEFAULT_VELOCITY = 90
BASS_VELOCITY = 80
DEFAULT_OCTAVE = 4
BASS_OCTAVE = 3
ACCOMPANIMENT_PATTERNS = ["block", "arpeggio_up", "arpeggio_down", "pop_ballad"]

# Note name -> pitch class
_NOTE_TO_PC = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'Fb': 4, 'E#': 5, 'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11, 'Cb': 11, 'B#': 0,
}

# Chord type -> semitone intervals (matches audio_analyzer.py)
_CHORD_INTERVALS = {
    'major':      [0, 4, 7],
    'minor':      [0, 3, 7],
    'sus2':       [0, 2, 7],
    'sus4':       [0, 5, 7],
    '5':          [0, 7],
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

# Symbol suffix -> chord type key
_SYMBOL_TO_TYPE = {
    '': 'major', 'm': 'minor', 'dim': 'diminished', 'aug': 'augmented',
    'maj7': 'major7', 'm7': 'minor7', '7': 'dominant7',
    'dim7': 'dim7', 'm7b5': 'half_dim7',
    'sus2': 'sus2', 'sus4': 'sus4',
    'add9': 'add9', '6': '6', 'm6': 'm6', '5': '5',
}


def _ensure_midi_dir():
    """Create temp directory and clean files older than 1 hour."""
    os.makedirs(MIDI_DIR, exist_ok=True)
    now = time.time()
    for f in os.listdir(MIDI_DIR):
        fp = os.path.join(MIDI_DIR, f)
        try:
            if os.path.isfile(fp) and now - os.path.getmtime(fp) > 3600:
                os.remove(fp)
        except OSError:
            pass


def _note_name_to_midi(name: str, octave: int) -> int:
    """Convert note name + octave to MIDI number. E.g. 'C#', 4 -> 61."""
    pc = _NOTE_TO_PC.get(name)
    if pc is None:
        return 60  # fallback to middle C
    return (octave + 1) * 12 + pc


def _parse_chord_symbol(symbol: str) -> tuple:
    """
    Parse a chord symbol like 'Am7', 'Bbdim', 'F#m7b5/E' into
    (root_name, chord_type_key, bass_name_or_None).
    """
    if not symbol or symbol == '-':
        return ('C', 'major', None)

    # Split slash bass
    parts = symbol.split('/')
    base = parts[0]
    bass_name = parts[1] if len(parts) > 1 else None

    # Extract root
    root = base[0].upper()
    rest = base[1:]
    if rest and rest[0] in ('#', 'b'):
        root += rest[0]
        rest = rest[1:]

    # Match suffix to chord type (longest match first)
    chord_type = 'major'
    for suffix in sorted(_SYMBOL_TO_TYPE.keys(), key=len, reverse=True):
        if rest == suffix:
            chord_type = _SYMBOL_TO_TYPE[suffix]
            break

    return (root, chord_type, bass_name)


def _chord_to_midi_notes(chord: dict, octave: int = DEFAULT_OCTAVE) -> list:
    """
    Convert a chord dict (from analysis) to MIDI note numbers.
    Uses chord['notes'] if available, otherwise parses chord['chord'] symbol.
    Returns list of MIDI note numbers with proper octave wrapping.
    """
    notes_names = chord.get('notes', [])
    if not notes_names:
        root, ctype, _ = _parse_chord_symbol(chord.get('chord', 'C'))
        intervals = _CHORD_INTERVALS.get(ctype, [0, 4, 7])
        root_pc = _NOTE_TO_PC.get(root, 0)
        return [(octave + 1) * 12 + (root_pc + iv) % 12 +
                (12 if (root_pc + iv) % 12 < root_pc and iv > 0 else 0)
                for iv in intervals]

    midi_notes = []
    prev_pc = -1
    oct = octave
    for name in notes_names:
        pc = _NOTE_TO_PC.get(name)
        if pc is None:
            continue
        if prev_pc >= 0 and pc <= prev_pc:
            oct += 1
        midi_notes.append((oct + 1) * 12 + pc)
        prev_pc = pc

    return midi_notes


def _chord_root_midi(chord: dict, octave: int = BASS_OCTAVE) -> int:
    """Get the root/bass note MIDI number in low octave."""
    bass = chord.get('bass')
    if bass and chord.get('inversion', 0) > 0:
        return _note_name_to_midi(bass, octave)

    notes = chord.get('notes', [])
    if notes:
        return _note_name_to_midi(notes[0], octave)

    root, _, _ = _parse_chord_symbol(chord.get('chord', 'C'))
    return _note_name_to_midi(root, octave)


def _chord_fifth_midi(chord: dict, octave: int = BASS_OCTAVE) -> int:
    """Get the fifth of the chord in the bass octave."""
    root, ctype, _ = _parse_chord_symbol(chord.get('chord', 'C'))
    root_pc = _NOTE_TO_PC.get(root, 0)
    intervals = _CHORD_INTERVALS.get(ctype, [0, 4, 7])
    # Find the fifth (interval closest to 7 semitones)
    fifth_iv = 7
    for iv in intervals:
        if 5 <= iv <= 8:
            fifth_iv = iv
            break
    fifth_pc = (root_pc + fifth_iv) % 12
    midi = (octave + 1) * 12 + fifth_pc
    # Ensure it's above the root
    root_midi = _note_name_to_midi(root, octave)
    if midi < root_midi:
        midi += 12
    return midi


# ─── Pattern functions ────────────────────────────────────

def _pattern_block(midi_file, track, channel, chord, start_beat, duration_beats, tempo):
    """Block chord: bass + all chord tones sustained together."""
    note_events = []

    # Bass note
    bass = _chord_root_midi(chord)
    midi_file.addNote(track, channel, bass, start_beat, duration_beats, BASS_VELOCITY)
    note_events.append({
        'time': start_beat * 60.0 / tempo,
        'duration': duration_beats * 60.0 / tempo,
        'midi': bass,
        'velocity': BASS_VELOCITY,
    })

    # Chord tones
    for midi_note in _chord_to_midi_notes(chord):
        midi_file.addNote(track, channel, midi_note, start_beat, duration_beats, DEFAULT_VELOCITY)
        note_events.append({
            'time': start_beat * 60.0 / tempo,
            'duration': duration_beats * 60.0 / tempo,
            'midi': midi_note,
            'velocity': DEFAULT_VELOCITY,
        })

    return note_events


def _pattern_arpeggio(midi_file, track, channel, chord, start_beat, duration_beats, tempo, direction=1):
    """Arpeggio: cycle through bass + chord tones, one note per beat."""
    note_events = []

    bass = _chord_root_midi(chord)
    chord_notes = _chord_to_midi_notes(chord)
    all_notes = [bass] + chord_notes

    if direction < 0:
        all_notes = list(reversed(all_notes))

    num_notes = len(all_notes)
    total_beats = max(1, int(round(duration_beats)))
    note_dur = 0.9  # Slight gap for articulation

    for i in range(total_beats):
        note_idx = i % num_notes
        midi_note = all_notes[note_idx]
        beat_pos = start_beat + i
        vel = BASS_VELOCITY if (note_idx == 0 and direction > 0) else DEFAULT_VELOCITY

        midi_file.addNote(track, channel, midi_note, beat_pos, note_dur, vel)
        note_events.append({
            'time': beat_pos * 60.0 / tempo,
            'duration': note_dur * 60.0 / tempo,
            'midi': midi_note,
            'velocity': vel,
        })

    return note_events


def _pattern_pop_ballad(midi_file, track, channel, chord, start_beat, duration_beats, tempo):
    """
    Pop ballad pattern:
    Beat 1: root (bass)
    Beat 2: full chord (short stab, 0.5 beats)
    Beat 3: root + fifth (bass)
    Beat 4: full chord (short stab)
    """
    note_events = []

    bass = _chord_root_midi(chord)
    fifth = _chord_fifth_midi(chord)
    chord_notes = _chord_to_midi_notes(chord)
    total_beats = max(1, int(round(duration_beats)))

    for i in range(total_beats):
        beat_pos = start_beat + i
        beat_in_pattern = i % 4

        if beat_in_pattern == 0:
            # Beat 1: bass root
            midi_file.addNote(track, channel, bass, beat_pos, 0.9, BASS_VELOCITY)
            note_events.append({
                'time': beat_pos * 60.0 / tempo,
                'duration': 0.9 * 60.0 / tempo,
                'midi': bass,
                'velocity': BASS_VELOCITY,
            })

        elif beat_in_pattern == 1:
            # Beat 2: chord stab
            for mn in chord_notes:
                midi_file.addNote(track, channel, mn, beat_pos, 0.5, DEFAULT_VELOCITY - 10)
                note_events.append({
                    'time': beat_pos * 60.0 / tempo,
                    'duration': 0.5 * 60.0 / tempo,
                    'midi': mn,
                    'velocity': DEFAULT_VELOCITY - 10,
                })

        elif beat_in_pattern == 2:
            # Beat 3: root + fifth
            midi_file.addNote(track, channel, bass, beat_pos, 0.9, BASS_VELOCITY)
            note_events.append({
                'time': beat_pos * 60.0 / tempo,
                'duration': 0.9 * 60.0 / tempo,
                'midi': bass,
                'velocity': BASS_VELOCITY,
            })
            midi_file.addNote(track, channel, fifth, beat_pos, 0.9, BASS_VELOCITY - 10)
            note_events.append({
                'time': beat_pos * 60.0 / tempo,
                'duration': 0.9 * 60.0 / tempo,
                'midi': fifth,
                'velocity': BASS_VELOCITY - 10,
            })

        else:
            # Beat 4: chord stab
            for mn in chord_notes:
                midi_file.addNote(track, channel, mn, beat_pos, 0.5, DEFAULT_VELOCITY - 10)
                note_events.append({
                    'time': beat_pos * 60.0 / tempo,
                    'duration': 0.5 * 60.0 / tempo,
                    'midi': mn,
                    'velocity': DEFAULT_VELOCITY - 10,
                })

    return note_events


# ─── Main generation function ────────────────────────────

def generate_accompaniment_midi(chords: list, tempo: float, pattern: str, task_id: str) -> dict:
    """
    Generate a MIDI file from detected chords with the specified pattern.

    Args:
        chords: List of chord dicts from analysis (with time, duration, chord, notes, etc.)
        tempo: BPM
        pattern: One of ACCOMPANIMENT_PATTERNS
        task_id: Task identifier for file naming

    Returns:
        dict with filepath, filename, note_events list
    """
    _ensure_midi_dir()

    if pattern not in ACCOMPANIMENT_PATTERNS:
        pattern = 'block'

    midi = MIDIFile(1)  # 1 track
    track = 0
    channel = 0
    midi.addTempo(track, 0, tempo)
    midi.addTrackName(track, 0, f"Accompaniment ({pattern})")

    all_note_events = []

    for chord in chords:
        if chord.get('chord', '-') == '-':
            continue

        # Convert time (seconds) to beat position
        start_beat = chord['time'] * tempo / 60.0
        duration_beats = chord['duration'] * tempo / 60.0

        if duration_beats <= 0:
            continue

        if pattern == 'block':
            events = _pattern_block(midi, track, channel, chord, start_beat, duration_beats, tempo)
        elif pattern == 'arpeggio_up':
            events = _pattern_arpeggio(midi, track, channel, chord, start_beat, duration_beats, tempo, direction=1)
        elif pattern == 'arpeggio_down':
            events = _pattern_arpeggio(midi, track, channel, chord, start_beat, duration_beats, tempo, direction=-1)
        elif pattern == 'pop_ballad':
            events = _pattern_pop_ballad(midi, track, channel, chord, start_beat, duration_beats, tempo)
        else:
            events = _pattern_block(midi, track, channel, chord, start_beat, duration_beats, tempo)

        all_note_events.extend(events)

    # Write MIDI file
    filename = f"{task_id}_accomp_{pattern}.mid"
    filepath = os.path.join(MIDI_DIR, filename)
    with open(filepath, 'wb') as f:
        midi.writeFile(f)

    return {
        'filepath': filepath,
        'filename': filename,
        'note_events': all_note_events,
    }


# ─── Audio-to-MIDI Transcription ────────────────────────

def check_basic_pitch_available() -> bool:
    """Check if basic-pitch is installed."""
    try:
        import basic_pitch  # noqa: F401
        return True
    except ImportError:
        return False


def transcribe_audio_to_midi(audio_path: str, task_id: str, progress_cb=None, use_accompaniment: bool = True) -> dict:
    """
    Transcribe audio to MIDI using basic-pitch.

    Args:
        audio_path: Path to audio file
        task_id: Task identifier
        progress_cb: Optional callback(pct, msg)
        use_accompaniment: If True, apply HPSS to remove vocals before transcription

    Returns:
        dict with midi_filepath, filename, note_events, num_notes
    """
    _ensure_midi_dir()

    if progress_cb:
        progress_cb(10, "Cargando audio para transcripción...")

    import numpy as np

    input_path = audio_path

    # Optionally separate accompaniment (remove vocals) for cleaner transcription
    if use_accompaniment:
        try:
            import librosa
            if progress_cb:
                progress_cb(15, "Separando armónicos (HPSS)...")

            y, sr = librosa.load(audio_path, sr=22050, mono=True)
            y_harmonic, _ = librosa.effects.hpss(y)

            # Write harmonic-only audio to temp file
            import soundfile as sf
            input_path = os.path.join(MIDI_DIR, f"{task_id}_harmonic.wav")
            sf.write(input_path, y_harmonic, sr)

            if progress_cb:
                progress_cb(25, "Audio preparado, iniciando transcripción...")
        except Exception as e:
            print(f"[midi-transcribe] HPSS failed: {e}, using original audio")
            input_path = audio_path

    if progress_cb:
        progress_cb(30, "Ejecutando basic-pitch (modelo de IA)...")

    from basic_pitch.inference import predict

    # predict returns (model_output, midi_data, note_events)
    model_output, midi_data, note_events_bp = predict(input_path)

    if progress_cb:
        progress_cb(80, "Procesando resultados...")

    # midi_data is a PrettyMIDI object - write to .mid
    filename = f"{task_id}_transcription.mid"
    filepath = os.path.join(MIDI_DIR, filename)
    midi_data.write(filepath)

    # Convert note_events to JSON-serializable format
    # note_events_bp is a list of tuples: (start_time_s, end_time_s, pitch_midi, velocity, confidence)
    note_events = []
    for ev in note_events_bp:
        start_t, end_t, pitch, velocity, confidence = ev
        note_events.append({
            'time': round(float(start_t), 3),
            'duration': round(float(end_t - start_t), 3),
            'midi': int(pitch),
            'velocity': int(velocity),
            'confidence': round(float(confidence), 3),
        })

    # Cleanup temp harmonic file
    if input_path != audio_path and os.path.exists(input_path):
        try:
            os.remove(input_path)
        except OSError:
            pass

    if progress_cb:
        progress_cb(95, "Transcripción completada")

    return {
        'midi_filepath': filepath,
        'filename': filename,
        'note_events': note_events,
        'num_notes': len(note_events),
    }
