"""
Tonality module: key detection, diatonic chords, harmonic functions.
"""

from .notes import note_to_pc, CHROMATIC_SHARPS, CHROMATIC_FLATS
from .scales import generate_scale, MAJOR_SCALE_SPELLINGS
from .chords import build_chord, CHORD_SYMBOLS

# Diatonic chord qualities for major key: I ii iii IV V vi vii°
DIATONIC_QUALITIES = [
    "major", "minor", "minor", "major", "major", "minor", "diminished"
]

# Roman numeral labels
ROMAN_NUMERALS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"]

# Harmonic functions
HARMONIC_FUNCTIONS = {
    "I":    "Tonic",
    "ii":   "Subdominant",
    "iii":  "Tonic (mediant)",
    "IV":   "Subdominant",
    "V":    "Dominant",
    "vi":   "Tonic (submediant)",
    "vii°": "Dominant",
}

# === Minor Key Diatonic Chords ===

# Natural minor: i ii° III iv v VI VII
MINOR_DIATONIC_QUALITIES = [
    "minor", "diminished", "major", "minor", "minor", "major", "major"
]
MINOR_ROMAN_NUMERALS = ["i", "ii°", "III", "iv", "v", "VI", "VII"]
MINOR_HARMONIC_FUNCTIONS = {
    "i":   "Tonic",
    "ii°": "Subdominant",
    "III": "Tonic (mediant)",
    "iv":  "Subdominant",
    "v":   "Dominant",
    "VI":  "Subdominant (submediant)",
    "VII": "Subtonic",
}

# Harmonic minor: i ii° III+ iv V VI vii°
HARMONIC_MINOR_QUALITIES = [
    "minor", "diminished", "augmented", "minor", "major", "major", "diminished"
]
HARMONIC_MINOR_NUMERALS = ["i", "ii°", "III+", "iv", "V", "VI", "vii°"]
HARMONIC_MINOR_FUNCTIONS = {
    "i":    "Tonic",
    "ii°":  "Subdominant",
    "III+": "Tonic (mediant)",
    "iv":   "Subdominant",
    "V":    "Dominant",
    "VI":   "Subdominant (submediant)",
    "vii°": "Dominant",
}

# Seventh chords for natural minor
MINOR_SEVENTH_QUALITIES = [
    "minor7", "half_diminished7", "major7", "minor7", "minor7", "major7", "dominant7"
]
MINOR_SEVENTH_NUMERALS = ["i7", "iiø7", "IIImaj7", "iv7", "v7", "VImaj7", "VII7"]

# Seventh chords for harmonic minor
HARMONIC_MINOR_SEVENTH_QUALITIES = [
    "minor_major7", "half_diminished7", "augmented_major7", "minor7", "dominant7", "major7", "diminished7"
]
HARMONIC_MINOR_SEVENTH_NUMERALS = ["i(maj7)", "iiø7", "III+maj7", "iv7", "V7", "VImaj7", "vii°7"]

# Mode diatonic qualities
MODE_DIATONIC_DATA = {
    "dorian": {
        "qualities": ["minor", "minor", "major", "major", "minor", "diminished", "major"],
        "numerals": ["i", "ii", "III", "IV", "v", "vi°", "VII"],
        "functions": {"i": "Tonic", "ii": "Subdominant", "III": "Tonic (mediant)", "IV": "Subdominant", "v": "Dominant", "vi°": "Dominant", "VII": "Subtonic"},
    },
    "phrygian": {
        "qualities": ["minor", "major", "major", "minor", "diminished", "major", "minor"],
        "numerals": ["i", "II", "III", "iv", "v°", "VI", "vii"],
        "functions": {"i": "Tonic", "II": "Neapolitan", "III": "Tonic (mediant)", "iv": "Subdominant", "v°": "Dominant", "VI": "Subdominant", "vii": "Subtonic"},
    },
    "lydian": {
        "qualities": ["major", "major", "minor", "diminished", "major", "minor", "minor"],
        "numerals": ["I", "II", "iii", "iv°", "V", "vi", "vii"],
        "functions": {"I": "Tonic", "II": "Subdominant", "iii": "Tonic (mediant)", "iv°": "Subdominant", "V": "Dominant", "vi": "Tonic (submediant)", "vii": "Dominant"},
    },
    "mixolydian": {
        "qualities": ["major", "minor", "diminished", "major", "minor", "minor", "major"],
        "numerals": ["I", "ii", "iii°", "IV", "v", "vi", "VII"],
        "functions": {"I": "Tonic", "ii": "Subdominant", "iii°": "Tonic (mediant)", "IV": "Subdominant", "v": "Dominant", "vi": "Tonic (submediant)", "VII": "Subtonic"},
    },
    "locrian": {
        "qualities": ["diminished", "major", "minor", "minor", "major", "major", "minor"],
        "numerals": ["i°", "II", "iii", "iv", "V", "VI", "vii"],
        "functions": {"i°": "Tonic", "II": "Subdominant", "iii": "Tonic (mediant)", "iv": "Subdominant", "V": "Dominant", "VI": "Subdominant", "vii": "Subtonic"},
    },
}

# Minor key signatures
MINOR_KEY_SIGNATURES = {
    "A": 0, "E": 1, "B": 2, "F#": 3, "C#": 4, "G#": 5, "D#": 6,
    "Eb": -6, "Bb": -5, "F": -4, "C": -3, "G": -2, "D": -1,
}


def get_diatonic_chords_minor(key: str, scale_type: str = "natural_minor") -> list[dict]:
    """Generate diatonic chords for a minor key."""
    scale = generate_scale(key, scale_type)

    if scale_type == "harmonic_minor":
        qualities = HARMONIC_MINOR_QUALITIES
        numerals = HARMONIC_MINOR_NUMERALS
        functions = HARMONIC_MINOR_FUNCTIONS
    else:
        qualities = MINOR_DIATONIC_QUALITIES
        numerals = MINOR_ROMAN_NUMERALS
        functions = MINOR_HARMONIC_FUNCTIONS

    chords = []
    for i, (note, quality, numeral) in enumerate(zip(scale, qualities, numerals)):
        chord = build_chord(note, quality)
        chords.append({
            "degree": i + 1,
            "numeral": numeral,
            "root": note,
            "quality": quality,
            "symbol": chord["symbol"],
            "notes": chord["notes"],
            "formula": chord.get("formula"),
            "function": functions.get(numeral, ""),
        })

    return chords


def get_diatonic_seventh_chords_minor(key: str, scale_type: str = "natural_minor") -> list[dict]:
    """Generate diatonic seventh chords for a minor key."""
    scale = generate_scale(key, scale_type)

    if scale_type == "harmonic_minor":
        qualities = HARMONIC_MINOR_SEVENTH_QUALITIES
        numerals = HARMONIC_MINOR_SEVENTH_NUMERALS
    else:
        qualities = MINOR_SEVENTH_QUALITIES
        numerals = MINOR_SEVENTH_NUMERALS

    chords = []
    for i, (note, quality, numeral) in enumerate(zip(scale, qualities, numerals)):
        try:
            chord = build_chord(note, quality)
            chords.append({
                "degree": i + 1,
                "numeral": numeral,
                "root": note,
                "quality": quality,
                "symbol": chord["symbol"],
                "notes": chord["notes"],
                "formula": chord.get("formula"),
            })
        except (ValueError, KeyError):
            # Skip chord types not supported (e.g. minor_major7, augmented_major7)
            pass

    return chords


def get_diatonic_chords_for_mode(key: str, mode: str) -> list[dict]:
    """Generate diatonic chords for a mode (dorian, phrygian, lydian, mixolydian, locrian)."""
    if mode not in MODE_DIATONIC_DATA:
        raise ValueError(f"Unknown mode: {mode}")

    scale = generate_scale(key, mode)
    mode_data = MODE_DIATONIC_DATA[mode]

    chords = []
    for i, (note, quality, numeral) in enumerate(
        zip(scale, mode_data["qualities"], mode_data["numerals"])
    ):
        chord = build_chord(note, quality)
        chords.append({
            "degree": i + 1,
            "numeral": numeral,
            "root": note,
            "quality": quality,
            "symbol": chord["symbol"],
            "notes": chord["notes"],
            "formula": chord.get("formula"),
            "function": mode_data["functions"].get(numeral, ""),
        })

    return chords


# Key signatures: number of sharps (+) or flats (-)
KEY_SIGNATURES = {
    "C": 0, "G": 1, "D": 2, "A": 3, "E": 4, "B": 5, "F#": 6,
    "Gb": -6, "Db": -5, "Ab": -4, "Eb": -3, "Bb": -2, "F": -1,
}

# Sharp order and flat order for key signatures
SHARP_ORDER = ["F#", "C#", "G#", "D#", "A#", "E#", "B#"]
FLAT_ORDER = ["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"]


def get_diatonic_chords(key: str) -> list[dict]:
    """
    Generate the 7 diatonic chords for a major key.
    Pattern: Major, minor, minor, Major, Major, minor, diminished
    """
    scale = generate_scale(key, "major")

    chords = []
    for i, (note, quality, numeral) in enumerate(
        zip(scale, DIATONIC_QUALITIES, ROMAN_NUMERALS)
    ):
        chord = build_chord(note, quality)
        chords.append({
            "degree": i + 1,
            "numeral": numeral,
            "root": note,
            "quality": quality,
            "symbol": chord["symbol"],
            "notes": chord["notes"],
            "formula": chord.get("formula"),
            "function": HARMONIC_FUNCTIONS[numeral],
        })

    return chords


def get_diatonic_seventh_chords(key: str) -> list[dict]:
    """
    Generate 7th chord versions of diatonic chords.
    Pattern: Imaj7, ii7, iii7, IVmaj7, V7, vi7, viim7b5
    """
    seventh_qualities = [
        "major7", "minor7", "minor7", "major7", "dominant7", "minor7", "half_diminished7"
    ]
    seventh_numerals = ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7", "viiø7"]

    scale = generate_scale(key, "major")

    chords = []
    for i, (note, quality, numeral) in enumerate(
        zip(scale, seventh_qualities, seventh_numerals)
    ):
        chord = build_chord(note, quality)
        chords.append({
            "degree": i + 1,
            "numeral": numeral,
            "root": note,
            "quality": quality,
            "symbol": chord["symbol"],
            "notes": chord["notes"],
            "formula": chord.get("formula"),
        })

    return chords


def get_key_signature(key: str) -> dict:
    """Get key signature information for a major key."""
    sig = KEY_SIGNATURES.get(key, 0)

    if sig > 0:
        accidentals = SHARP_ORDER[:sig]
        accidental_type = "sharps"
    elif sig < 0:
        accidentals = FLAT_ORDER[:abs(sig)]
        accidental_type = "flats"
    else:
        accidentals = []
        accidental_type = "none"

    return {
        "key": key,
        "accidentals": accidentals,
        "accidental_type": accidental_type,
        "count": abs(sig),
    }


def detect_key(notes: list[int] | list[str]) -> list[dict]:
    """
    Detect the most likely key(s) from a set of notes.
    Accepts MIDI numbers or note names.
    Returns scored list of possible keys, best match first.

    Algorithm: for each major key, count how many input notes
    belong to that key's scale. Higher match = more likely key.
    """
    # Convert to pitch classes
    if notes and isinstance(notes[0], int):
        pcs = [n % 12 for n in notes]
    else:
        pcs = [note_to_pc(n) for n in notes]

    unique_pcs = set(pcs)
    # Weight: notes that appear more frequently are more important
    pc_weights = {}
    for pc in pcs:
        pc_weights[pc] = pc_weights.get(pc, 0) + 1

    results = []

    # Test all 12 major keys
    all_keys = list(MAJOR_SCALE_SPELLINGS.keys())

    for key in all_keys:
        scale_notes = generate_scale(key, "major")
        scale_pcs = set(note_to_pc(n) for n in scale_notes)

        # Count weighted matches
        weighted_match = sum(
            pc_weights.get(pc, 0) for pc in unique_pcs if pc in scale_pcs
        )
        match_count = len(unique_pcs & scale_pcs)
        total = len(unique_pcs)

        # Non-diatonic notes (penalty)
        outside = len(unique_pcs - scale_pcs)

        # Bonus for having tonic and dominant in the notes
        tonic_pc = note_to_pc(key)
        dominant_pc = (tonic_pc + 7) % 12
        bonus = 0
        if tonic_pc in unique_pcs:
            bonus += 2
        if dominant_pc in unique_pcs:
            bonus += 1

        score = weighted_match + bonus - (outside * 3)

        # Also consider relative minor
        minor_root_idx = 5  # vi degree
        minor_scale = generate_scale(key, "major")
        relative_minor = minor_scale[minor_root_idx] if len(minor_scale) > 5 else None

        results.append({
            "key": key,
            "mode": "major",
            "match_count": match_count,
            "total_notes": total,
            "score": score,
            "confidence": round(match_count / max(total, 1) * 100),
            "relative_minor": relative_minor,
        })

    # Sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)

    return results[:5]  # Return top 5 candidates
