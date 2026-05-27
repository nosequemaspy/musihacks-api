"""
Intervals module: semitone-based interval calculation and naming.
"""

from .notes import note_to_pc, semitone_distance

# Interval names by semitone count
INTERVAL_NAMES = {
    0: "Unison",
    1: "Minor 2nd",
    2: "Major 2nd",
    3: "Minor 3rd",
    4: "Major 3rd",
    5: "Perfect 4th",
    6: "Tritone",
    7: "Perfect 5th",
    8: "Minor 6th",
    9: "Major 6th",
    10: "Minor 7th",
    11: "Major 7th",
    12: "Octave",
    13: "Minor 9th",
    14: "Major 9th",
    15: "Minor 10th",
    16: "Major 10th",
    17: "Perfect 11th",
    18: "Augmented 11th",
    19: "Perfect 12th",
    20: "Minor 13th",
    21: "Major 13th",
}

# Short names for display
INTERVAL_SHORT = {
    0: "1", 1: "b2", 2: "2", 3: "b3", 4: "3", 5: "4",
    6: "b5", 7: "5", 8: "b6", 9: "6", 10: "b7", 11: "7",
    12: "8", 13: "b9", 14: "9", 15: "#9", 16: "10",
    17: "11", 18: "#11", 19: "12", 20: "b13", 21: "13",
}


def interval_name(semitones: int) -> str:
    """Get interval name from semitone count."""
    semitones = semitones % 24
    return INTERVAL_NAMES.get(semitones, f"{semitones} semitones")


def interval_short(semitones: int) -> str:
    """Get short interval name."""
    return INTERVAL_SHORT.get(semitones % 22, str(semitones))


def interval_between(note1: str, note2: str) -> dict:
    """Calculate interval between two notes (ascending)."""
    st = semitone_distance(note1, note2)
    return {
        "semitones": st,
        "name": interval_name(st),
        "short": interval_short(st),
    }


def all_intervals() -> list[dict]:
    """Return all intervals within an octave."""
    return [
        {"semitones": i, "name": INTERVAL_NAMES[i], "short": INTERVAL_SHORT[i]}
        for i in range(13)
    ]
