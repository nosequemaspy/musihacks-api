"""
Scales module: scale patterns, generation, and proper enharmonic spelling.
"""

from .notes import (
    note_to_pc, pc_to_note, LETTERS, LETTER_TO_SEMITONE,
    CHROMATIC_SHARPS, CHROMATIC_FLATS, NOTE_TO_PC,
)

# Scale patterns as semitone intervals between consecutive notes
SCALE_PATTERNS = {
    "major":            [2, 2, 1, 2, 2, 2, 1],
    "natural_minor":    [2, 1, 2, 2, 1, 2, 2],
    "harmonic_minor":   [2, 1, 2, 2, 1, 3, 1],
    "melodic_minor":    [2, 1, 2, 2, 2, 2, 1],
    "pentatonic_major": [2, 2, 3, 2, 3],
    "pentatonic_minor": [3, 2, 2, 3, 2],
    "blues":            [3, 2, 1, 1, 3, 2],
    "dorian":           [2, 1, 2, 2, 2, 1, 2],
    "phrygian":         [1, 2, 2, 2, 1, 2, 2],
    "lydian":           [2, 2, 2, 1, 2, 2, 1],
    "mixolydian":       [2, 2, 1, 2, 2, 1, 2],
    "locrian":          [1, 2, 2, 1, 2, 2, 2],
    "double_harmonic":  [1, 3, 1, 2, 1, 3, 1],
    "whole_tone":       [2, 2, 2, 2, 2, 2],
    "chromatic":        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
}

# Keys that should use flats for proper spelling
FLAT_KEYS = {"F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb",
             "Dm", "Gm", "Cm", "Fm", "Bbm", "Ebm", "Abm"}

# Proper major scale spellings for all keys (using each letter once)
MAJOR_SCALE_SPELLINGS = {
    "C":  ["C", "D", "E", "F", "G", "A", "B"],
    "G":  ["G", "A", "B", "C", "D", "E", "F#"],
    "D":  ["D", "E", "F#", "G", "A", "B", "C#"],
    "A":  ["A", "B", "C#", "D", "E", "F#", "G#"],
    "E":  ["E", "F#", "G#", "A", "B", "C#", "D#"],
    "B":  ["B", "C#", "D#", "E", "F#", "G#", "A#"],
    "F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
    "Gb": ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],
    "Db": ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
    "Ab": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
    "Eb": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
    "Bb": ["Bb", "C", "D", "Eb", "F", "G", "A"],
    "F":  ["F", "G", "A", "Bb", "C", "D", "E"],
}

# Minor scale spellings (natural minor)
MINOR_SCALE_SPELLINGS = {
    "A":  ["A", "B", "C", "D", "E", "F", "G"],
    "E":  ["E", "F#", "G", "A", "B", "C", "D"],
    "B":  ["B", "C#", "D", "E", "F#", "G", "A"],
    "F#": ["F#", "G#", "A", "B", "C#", "D", "E"],
    "C#": ["C#", "D#", "E", "F#", "G#", "A", "B"],
    "G#": ["G#", "A#", "B", "C#", "D#", "E", "F#"],
    "Eb": ["Eb", "F", "Gb", "Ab", "Bb", "Cb", "Db"],
    "Bb": ["Bb", "C", "Db", "Eb", "F", "Gb", "Ab"],
    "F":  ["F", "G", "Ab", "Bb", "C", "Db", "Eb"],
    "C":  ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
    "G":  ["G", "A", "Bb", "C", "D", "Eb", "F"],
    "D":  ["D", "E", "F", "G", "A", "Bb", "C"],
}


def _use_flats(root: str) -> bool:
    """Determine if a key should use flats based on root note."""
    return root in FLAT_KEYS or "b" in root


def generate_scale(root: str, scale_type: str) -> list[str]:
    """
    Generate a scale from root note using the specified pattern.
    Tries to use proper enharmonic spelling.
    """
    if scale_type not in SCALE_PATTERNS:
        raise ValueError(f"Unknown scale type: {scale_type}. Available: {list(SCALE_PATTERNS.keys())}")

    # For major scales, use pre-defined spellings if available
    if scale_type == "major" and root in MAJOR_SCALE_SPELLINGS:
        return MAJOR_SCALE_SPELLINGS[root]

    # For natural minor, use pre-defined spellings if available
    if scale_type == "natural_minor" and root in MINOR_SCALE_SPELLINGS:
        return MINOR_SCALE_SPELLINGS[root]

    # Generic generation
    pattern = SCALE_PATTERNS[scale_type]
    use_flats = _use_flats(root)
    root_pc = note_to_pc(root)

    notes = [root]
    current_pc = root_pc
    for interval in pattern[:-1]:  # Don't include the note that would complete the octave
        current_pc = (current_pc + interval) % 12
        if use_flats:
            notes.append(CHROMATIC_FLATS[current_pc])
        else:
            notes.append(CHROMATIC_SHARPS[current_pc])

    return notes


def get_scale_info(root: str, scale_type: str) -> dict:
    """Get full scale information including notes and intervals."""
    notes = generate_scale(root, scale_type)
    pattern = SCALE_PATTERNS[scale_type]

    return {
        "root": root,
        "type": scale_type,
        "notes": notes,
        "intervals": pattern,
        "num_notes": len(notes),
    }


def available_scales() -> list[str]:
    """Return list of available scale types."""
    return list(SCALE_PATTERNS.keys())
