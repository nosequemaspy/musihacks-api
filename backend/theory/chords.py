"""
Chords module: chord types, construction, detection, inversions.
"""

from .notes import (
    note_to_pc, pc_to_note, CHROMATIC_SHARPS, CHROMATIC_FLATS,
    midi_to_note,
)

# Chord types with interval formulas (semitones from root)
CHORD_TYPES = {
    # Triads
    "major":      [0, 4, 7],
    "minor":      [0, 3, 7],
    "augmented":  [0, 4, 8],
    "diminished": [0, 3, 6],
    "sus2":       [0, 2, 7],
    "sus4":       [0, 5, 7],

    # Seventh chords
    "major7":     [0, 4, 7, 11],
    "minor7":     [0, 3, 7, 10],
    "dominant7":  [0, 4, 7, 10],
    "diminished7":[0, 3, 6, 9],
    "half_diminished7": [0, 3, 6, 10],
    "minor_major7": [0, 3, 7, 11],
    "augmented_major7": [0, 4, 8, 11],
    "augmented7": [0, 4, 8, 10],

    # Added tone chords
    "add2":       [0, 2, 4, 7],
    "add4":       [0, 4, 5, 7],
    "add9":       [0, 4, 7, 14],
    "6":          [0, 4, 7, 9],
    "minor6":     [0, 3, 7, 9],

    # Extended chords
    "major9":     [0, 4, 7, 11, 14],
    "minor9":     [0, 3, 7, 10, 14],
    "dominant9":  [0, 4, 7, 10, 14],
    "major11":    [0, 4, 7, 11, 14, 17],
    "minor11":    [0, 3, 7, 10, 14, 17],
    "dominant11": [0, 4, 7, 10, 14, 17],
    "major13":    [0, 4, 7, 11, 14, 17, 21],
    "minor13":    [0, 3, 7, 10, 14, 17, 21],
    "dominant13": [0, 4, 7, 10, 14, 17, 21],

    # Sus7
    "7sus4":      [0, 5, 7, 10],
    "7sus2":      [0, 2, 7, 10],
}

# Human-readable interval names for chord formulas
INTERVAL_NAMES = {
    0: "R", 1: "2m", 2: "2M", 3: "3m", 4: "3M", 5: "4J", 6: "5d", 7: "5J",
    8: "5A", 9: "6M", 10: "7m", 11: "7M", 14: "9M", 17: "11J", 21: "13M",
}

# Display symbols for chord types
CHORD_SYMBOLS = {
    "major": "", "minor": "m", "augmented": "aug", "diminished": "dim",
    "sus2": "sus2", "sus4": "sus4",
    "major7": "maj7", "minor7": "m7", "dominant7": "7",
    "diminished7": "dim7", "half_diminished7": "m7b5",
    "minor_major7": "mMaj7", "augmented_major7": "augMaj7", "augmented7": "aug7",
    "add2": "add2", "add4": "add4", "add9": "add9",
    "6": "6", "minor6": "m6",
    "major9": "maj9", "minor9": "m9", "dominant9": "9",
    "major11": "maj11", "minor11": "m11", "dominant11": "11",
    "major13": "maj13", "minor13": "m13", "dominant13": "13",
    "7sus4": "7sus4", "7sus2": "7sus2",
}

# Priority for chord detection (prefer simpler chords)
DETECTION_PRIORITY = [
    "major", "minor", "dominant7", "minor7", "major7",
    "diminished", "augmented", "sus4", "sus2",
    "half_diminished7", "diminished7", "minor_major7", "augmented7",
    "6", "minor6", "7sus4", "7sus2",
    "add2", "add4", "add9",
    "dominant9", "minor9", "major9",
    "dominant11", "minor11", "major11",
    "dominant13", "minor13", "major13",
]


def _use_flats(root: str) -> bool:
    return "b" in root


# Keys/roots where flat spelling is conventional for accidentals
_FLAT_ROOTS = {"F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"}


def build_chord(root: str, chord_type: str) -> dict:
    """Build a chord from root note and type."""
    if chord_type not in CHORD_TYPES:
        raise ValueError(f"Unknown chord type: {chord_type}. Available: {list(CHORD_TYPES.keys())}")

    root_pc = note_to_pc(root)
    intervals = CHORD_TYPES[chord_type]
    use_flats = _use_flats(root) or root in _FLAT_ROOTS

    # Intervals that conventionally use flat spelling (b3, b5, b7)
    # regardless of whether the root is a sharp-key root
    FLAT_INTERVALS = {3, 6, 10}  # b3, b5/dim5, b7

    notes = []
    for interval in intervals:
        pc = (root_pc + interval) % 12
        semis = interval % 12
        if use_flats or semis in FLAT_INTERVALS:
            name = CHROMATIC_FLATS[pc]
        else:
            name = CHROMATIC_SHARPS[pc]
        notes.append(name)

    symbol = root + CHORD_SYMBOLS.get(chord_type, chord_type)

    formula = [INTERVAL_NAMES.get(i, str(i)) for i in intervals]

    return {
        "root": root,
        "type": chord_type,
        "symbol": symbol,
        "notes": notes,
        "intervals": intervals,
        "formula": formula,
        "midi_notes": [note_to_pc(n) for n in notes],
    }


def get_chord_midi(root: str, chord_type: str, octave: int = 4) -> list[int]:
    """Get MIDI note numbers for a chord in a specific octave."""
    root_midi = (octave + 1) * 12 + note_to_pc(root)
    intervals = CHORD_TYPES[chord_type]
    return [root_midi + i for i in intervals]


def get_inversion(root: str, chord_type: str, inversion: int = 0) -> dict:
    """Get chord notes in a specific inversion (0=root, 1=first, 2=second, etc.)."""
    chord = build_chord(root, chord_type)
    notes = chord["notes"]
    n = len(notes)

    if inversion >= n:
        inversion = inversion % n

    inverted = notes[inversion:] + notes[:inversion]
    bass = inverted[0]

    result = chord.copy()
    result["notes"] = inverted
    result["inversion"] = inversion
    result["bass"] = bass
    if inversion > 0:
        result["symbol"] = f"{chord['symbol']}/{bass}"

    return result


def detect_chord(midi_notes: list[int]) -> list[dict]:
    """
    Detect chord name from a set of MIDI notes.
    Returns list of possible chords, best match first.
    Handles inversions, slash chords, and subset matching
    (e.g. 5 notes where 3 form a triad).
    """
    if len(midi_notes) < 2:
        return []

    # Get unique pitch classes
    pcs = sorted(set(n % 12 for n in midi_notes))
    if len(pcs) < 2:
        return []

    # Find bass note (lowest MIDI note)
    bass_midi = min(midi_notes)
    bass_pc = bass_midi % 12

    results = []

    # Try each pitch class as potential root (prefer those actually played)
    for root_pc in range(12):
        root_in_played = root_pc in pcs
        # Calculate intervals from this root
        intervals_set = set((pc - root_pc) % 12 for pc in pcs)

        # Try to match against chord types
        for chord_type in DETECTION_PRIORITY:
            chord_intervals = CHORD_TYPES[chord_type]
            chord_pcs_set = set(i % 12 for i in chord_intervals)

            exact = intervals_set == chord_pcs_set
            # Subset: all chord notes are present in played notes (extra notes played)
            subset = (not exact) and chord_pcs_set.issubset(intervals_set)

            if not exact and not subset:
                continue

            # Skip subset matches for tiny chords when we have many notes
            # (e.g. don't match a power chord from 5 notes)
            if subset and len(chord_pcs_set) < 3 and len(pcs) > 3:
                continue

            root_name_sharp = CHROMATIC_SHARPS[root_pc]
            root_name_flat = CHROMATIC_FLATS[root_pc]

            # Determine inversion
            inversion = 0
            if bass_pc != root_pc and bass_pc in pcs:
                try:
                    bass_idx = chord_intervals.index((bass_pc - root_pc) % 12)
                    inversion = bass_idx
                except ValueError:
                    pass

            extra_notes = len(intervals_set) - len(chord_pcs_set) if subset else 0

            # Build result for both sharp and flat naming
            for root_name in set([root_name_sharp, root_name_flat]):
                symbol = root_name + CHORD_SYMBOLS.get(chord_type, chord_type)
                bass_name = CHROMATIC_SHARPS[bass_pc]

                # Build notes list for the detected chord
                use_flats = _use_flats(root_name)
                chromatic = CHROMATIC_FLATS if use_flats else CHROMATIC_SHARPS
                chord_notes = [chromatic[(root_pc + iv) % 12] for iv in chord_intervals]

                entry = {
                    "root": root_name,
                    "type": chord_type,
                    "symbol": symbol,
                    "notes": chord_notes,
                    "inversion": inversion,
                }

                if inversion > 0:
                    if use_flats:
                        bass_name = CHROMATIC_FLATS[bass_pc]
                    entry["bass"] = bass_name
                    entry["symbol"] = f"{symbol}/{bass_name}"

                # Score: exact matches ALWAYS beat subset matches.
                # Within each category, prefer simpler chords, root position.
                if exact:
                    score = DETECTION_PRIORITY.index(chord_type) * 10
                else:
                    # Subset: base 500, prefer fewer extra notes (= larger chord coverage)
                    score = 500 + extra_notes * 40 + DETECTION_PRIORITY.index(chord_type) * 3
                if inversion > 0:
                    score += 5
                if not root_in_played:
                    score += 30
                if "b" in root_name:
                    score += 1

                entry["_score"] = score
                results.append(entry)

    # Sort by score, remove duplicates
    results.sort(key=lambda x: x["_score"])

    # Remove score from results and deduplicate
    seen = set()
    unique = []
    for r in results:
        del r["_score"]
        key = r["symbol"]
        if key not in seen:
            seen.add(key)
            unique.append(r)

    return unique


def available_chord_types() -> list[dict]:
    """Return all available chord types with their symbols and intervals."""
    return [
        {
            "type": ct,
            "symbol": CHORD_SYMBOLS.get(ct, ct),
            "intervals": CHORD_TYPES[ct],
            "num_notes": len(CHORD_TYPES[ct]),
        }
        for ct in CHORD_TYPES
    ]
