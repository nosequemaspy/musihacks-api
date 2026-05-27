"""
Circle of fifths module: circle generation, neighbor keys, relationships.
"""

from .notes import note_to_pc
from .tonality import get_key_signature, KEY_SIGNATURES

# Circle of fifths order (clockwise from top)
CIRCLE_MAJOR = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"]

# Relative minors (inner circle)
CIRCLE_MINOR = ["Am", "Em", "Bm", "F#m", "C#m", "G#m", "Ebm", "Bbm", "Fm", "Cm", "Gm", "Dm"]

# Map major -> relative minor
RELATIVE_MINOR_MAP = dict(zip(CIRCLE_MAJOR, CIRCLE_MINOR))

# Map minor -> relative major
RELATIVE_MAJOR_MAP = dict(zip(CIRCLE_MINOR, CIRCLE_MAJOR))


def get_circle_of_fifths() -> dict:
    """Return the complete circle of fifths data."""
    entries = []
    for i, (major, minor) in enumerate(zip(CIRCLE_MAJOR, CIRCLE_MINOR)):
        sig = get_key_signature(major)
        entries.append({
            "position": i,
            "angle": i * 30,  # 360/12 = 30 degrees per position
            "major": major,
            "minor": minor,
            "key_signature": sig,
        })

    return {
        "entries": entries,
        "major_keys": CIRCLE_MAJOR,
        "minor_keys": CIRCLE_MINOR,
    }


def get_circle_for_key(key: str) -> dict:
    """
    Get circle of fifths focused on a specific key.
    Returns the key, its neighbors (subdominant/dominant), and relative minor.
    """
    # Find position in circle
    if key in CIRCLE_MAJOR:
        idx = CIRCLE_MAJOR.index(key)
        mode = "major"
    else:
        # Try as minor key
        minor_key = key if key.endswith("m") else key + "m"
        if minor_key in CIRCLE_MINOR:
            idx = CIRCLE_MINOR.index(minor_key)
            mode = "minor"
            key = CIRCLE_MAJOR[idx]  # Use relative major for calculations
        else:
            raise ValueError(f"Key {key} not found in circle of fifths")

    # Neighbors
    dominant_idx = (idx + 1) % 12  # clockwise = dominant
    subdominant_idx = (idx - 1) % 12  # counter-clockwise = subdominant

    return {
        "key": key,
        "mode": mode,
        "position": idx,
        "subdominant": {
            "major": CIRCLE_MAJOR[subdominant_idx],
            "minor": CIRCLE_MINOR[subdominant_idx],
        },
        "tonic": {
            "major": CIRCLE_MAJOR[idx],
            "minor": CIRCLE_MINOR[idx],
        },
        "dominant": {
            "major": CIRCLE_MAJOR[dominant_idx],
            "minor": CIRCLE_MINOR[dominant_idx],
        },
        "relative_minor": CIRCLE_MINOR[idx],
        "relative_major": CIRCLE_MAJOR[idx],
        "key_signature": get_key_signature(key),
        "neighbor_keys": [
            CIRCLE_MAJOR[(idx - 1) % 12],
            CIRCLE_MAJOR[idx],
            CIRCLE_MAJOR[(idx + 1) % 12],
        ],
    }
