"""
Notes module: chromatic notes, MIDI mapping, enharmonics.
All in American notation (C, D, E, F, G, A, B).
"""

# Canonical sharp names for the 12 chromatic pitch classes
CHROMATIC_SHARPS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

# Flat equivalents
CHROMATIC_FLATS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

# Enharmonic pairs: sharp -> flat
ENHARMONIC_MAP = {
    "C": "C", "C#": "Db", "Db": "C#",
    "D": "D", "D#": "Eb", "Eb": "D#",
    "E": "E", "Fb": "E", "E#": "F",
    "F": "F", "F#": "Gb", "Gb": "F#",
    "G": "G", "G#": "Ab", "Ab": "G#",
    "A": "A", "A#": "Bb", "Bb": "A#",
    "B": "B", "Cb": "B", "B#": "C",
}

# Note name -> pitch class (0-11, C=0)
NOTE_TO_PC = {
    "C": 0, "B#": 0,
    "C#": 1, "Db": 1,
    "D": 2,
    "D#": 3, "Eb": 3,
    "E": 4, "Fb": 4,
    "F": 5, "E#": 5,
    "F#": 6, "Gb": 6,
    "G": 7,
    "G#": 8, "Ab": 8,
    "A": 9,
    "A#": 10, "Bb": 10,
    "B": 11, "Cb": 11,
}

# Letter names in order
LETTERS = ["C", "D", "E", "F", "G", "A", "B"]

# Semitone value of each natural letter
LETTER_TO_SEMITONE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def note_to_pc(name: str) -> int:
    """Convert note name to pitch class (0-11). E.g., 'C#' -> 1, 'Bb' -> 10."""
    name = name.strip()
    if name not in NOTE_TO_PC:
        raise ValueError(f"Unknown note: {name}")
    return NOTE_TO_PC[name]


def pc_to_note(pc: int, prefer_flat: bool = False) -> str:
    """Convert pitch class to note name."""
    pc = pc % 12
    return CHROMATIC_FLATS[pc] if prefer_flat else CHROMATIC_SHARPS[pc]


def midi_to_note(midi: int) -> tuple[str, int]:
    """Convert MIDI number to (note_name, octave). C4 = 60."""
    octave = (midi // 12) - 1
    pc = midi % 12
    return CHROMATIC_SHARPS[pc], octave


def note_to_midi(name: str, octave: int) -> int:
    """Convert note name + octave to MIDI number. C4 -> 60."""
    return (octave + 1) * 12 + note_to_pc(name)


def enharmonic(name: str) -> str:
    """Return enharmonic equivalent. C# -> Db, Db -> C#."""
    return ENHARMONIC_MAP.get(name, name)


def semitone_distance(note1: str, note2: str) -> int:
    """Ascending semitone distance from note1 to note2 (0-11)."""
    return (note_to_pc(note2) - note_to_pc(note1)) % 12


def all_notes() -> list[dict]:
    """Return all 12 chromatic notes with their pitch class and names."""
    result = []
    for i in range(12):
        sharp = CHROMATIC_SHARPS[i]
        flat = CHROMATIC_FLATS[i]
        entry = {"pc": i, "name": sharp}
        if sharp != flat:
            entry["enharmonic"] = flat
        result.append(entry)
    return result


def normalize_note(name: str) -> str:
    """Normalize a note name to its canonical sharp form."""
    return pc_to_note(note_to_pc(name))


def spell_note_in_key(pc: int, key_root: str, use_flats: bool) -> str:
    """
    Given a pitch class and key context, return properly spelled note name.
    Keys with flats use flat names; keys with sharps use sharp names.
    """
    if use_flats:
        return CHROMATIC_FLATS[pc % 12]
    return CHROMATIC_SHARPS[pc % 12]
