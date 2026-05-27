"""
Advanced Harmony module: cadences, tritone substitution, modal interchange,
negative harmony, Chopin bass, melody-based chord suggestions.
"""

from .notes import note_to_pc, pc_to_note, CHROMATIC_SHARPS, CHROMATIC_FLATS
from .scales import generate_scale
from .chords import build_chord, CHORD_TYPES, get_chord_midi
from .tonality import get_diatonic_chords, get_diatonic_seventh_chords


def _use_flats(key: str) -> bool:
    return key in {"F", "Bb", "Eb", "Ab", "Db", "Gb"} or "b" in key


def _spell(pc: int, key: str) -> str:
    return CHROMATIC_FLATS[pc % 12] if _use_flats(key) else CHROMATIC_SHARPS[pc % 12]


# ──────────────────────────────────────────────
# Cadences
# ──────────────────────────────────────────────

CADENCE_DEFINITIONS = [
    {
        "name": "Auténtica perfecta",
        "numerals": "V → I",
        "degrees": [(4, "dominant7"), (0, "major")],
        "category": "conclusiva",
        "description": "La cadencia más fuerte. Resuelve toda la tensión del dominante hacia la tónica."
    },
    {
        "name": "Plagal",
        "numerals": "IV → I",
        "degrees": [(3, "major"), (0, "major")],
        "category": "conclusiva",
        "description": "Cadencia 'Amén'. Resolución suave desde la subdominante."
    },
    {
        "name": "Rota (Deceptiva)",
        "numerals": "V → vi",
        "degrees": [(4, "dominant7"), (5, "minor")],
        "category": "suspensiva",
        "description": "Engaño armónico: el V resuelve al vi en vez del I esperado."
    },
    {
        "name": "Media (Semicadencia)",
        "numerals": "I → V",
        "degrees": [(0, "major"), (4, "major")],
        "category": "suspensiva",
        "description": "Termina en el dominante, creando suspensión y necesidad de continuar."
    },
    {
        "name": "Frigia",
        "numerals": "bII → I",
        "degrees": [(-1, "major"), (0, "major")],  # -1 = special: bII (Neapolitan)
        "category": "conclusiva",
        "description": "Resolución desde el acorde napolitano (bII). Sonido modal intenso."
    },
    {
        "name": "ii-V-I (Jazz)",
        "numerals": "ii7 → V7 → Imaj7",
        "degrees": [(1, "minor7"), (4, "dominant7"), (0, "major7")],
        "category": "conclusiva",
        "description": "La cadencia fundamental del jazz. Movimiento de 4tas descendentes."
    },
    {
        "name": "Royal Road (Ōdo shinkō)",
        "numerals": "IVmaj7 → V7 → iii7 → vi",
        "degrees": [(3, "major7"), (4, "dominant7"), (2, "minor7"), (5, "minor")],
        "category": "progresion",
        "description": "Progresión épica japonesa. Muy usada en anime, J-pop y videojuegos."
    },
    {
        "name": "Andaluza",
        "numerals": "i → bVII → bVI → V",
        "degrees": [(0, "minor"), (-2, "major"), (-3, "major"), (4, "major")],
        "category": "progresion",
        "description": "Cadencia flamenca. Movimiento descendente cromático hacia el dominante."
    },
    {
        "name": "Cadena de dominantes",
        "numerals": "V/V/V → V/V → V → I",
        "degrees": [(-4, "dominant7"), (-3, "dominant7"), (4, "dominant7"), (0, "major")],
        "category": "progresion",
        "description": "Cada acorde es dominante del siguiente. Crea tensión acumulativa."
    },
    {
        "name": "Plagal menor",
        "numerals": "iv → I",
        "degrees": [(3, "minor"), (0, "major")],
        "category": "conclusiva",
        "description": "Variante dramática de la plagal usando el iv menor prestado."
    },
    {
        "name": "Backdoor (Jazz)",
        "numerals": "bVII7 → I",
        "degrees": [(-2, "dominant7"), (0, "major7")],
        "category": "conclusiva",
        "description": "Resolución inesperada desde el bVII7. Suave y sofisticada."
    },
]


def get_cadences(key: str) -> list[dict]:
    """Get all cadences realized in the given key."""
    scale = generate_scale(key, "major")
    root_pc = note_to_pc(key)
    use_flats = _use_flats(key)

    results = []
    for cad in CADENCE_DEFINITIONS:
        chords_info = []
        for degree, quality in cad["degrees"]:
            if degree >= 0 and degree < 7:
                chord_root = scale[degree]
            elif degree == -1:
                # bII (Neapolitan)
                bii_pc = (root_pc + 1) % 12
                chord_root = _spell(bii_pc, key)
            elif degree == -2:
                # bVII
                bvii_pc = (root_pc + 10) % 12
                chord_root = _spell(bvii_pc, key)
            elif degree == -3:
                # bVI
                bvi_pc = (root_pc + 8) % 12
                chord_root = _spell(bvi_pc, key)
            elif degree == -4:
                # V/V/V = note a 5th above V/V = root + 14st = root + 2st
                pc = (root_pc + 2) % 12
                chord_root = _spell(pc, key)
            else:
                chord_root = _spell((root_pc + degree) % 12, key)

            chord = build_chord(chord_root, quality)
            chords_info.append({
                "symbol": chord["symbol"],
                "notes": chord["notes"],
                "root": chord_root,
                "quality": quality,
            })

        results.append({
            "name": cad["name"],
            "numerals": cad["numerals"],
            "category": cad["category"],
            "description": cad["description"],
            "chords": chords_info,
        })

    return results


# ──────────────────────────────────────────────
# Tritone Substitution
# ──────────────────────────────────────────────

def get_tritone_substitution(chord_root: str, chord_type: str = "dominant7") -> dict:
    """
    Calculate the tritone substitution for a dominant chord.
    The tritone sub replaces a dom7 with another dom7 whose root
    is a tritone (6 semitones) away.
    """
    root_pc = note_to_pc(chord_root)
    sub_pc = (root_pc + 6) % 12

    # Tritone subs conventionally use flat spelling (Db7 not C#7)
    sub_root = CHROMATIC_FLATS[sub_pc]

    original = build_chord(chord_root, chord_type)
    substitution = build_chord(sub_root, "dominant7")

    # Shared notes (the tritone interval - 3rd and 7th swap)
    orig_pcs = set(note_to_pc(n) for n in original["notes"])
    sub_pcs = set(note_to_pc(n) for n in substitution["notes"])
    shared_pcs = orig_pcs & sub_pcs
    # Use original chord's note spellings for shared notes
    shared_notes = [n for n in original["notes"] if note_to_pc(n) in shared_pcs]

    # Resolution target (semitone below sub root = key)
    resolution_pc = (sub_pc - 1) % 12
    resolution_root = _spell(resolution_pc, chord_root)

    return {
        "original": original,
        "substitution": substitution,
        "shared_tones": len(shared_pcs),
        "shared_notes": shared_notes,
        "resolution": resolution_root,
        "explanation": (
            f"{original['symbol']} puede sustituirse por {substitution['symbol']}. "
            f"Comparten {' y '.join(shared_notes)} (la 3era y 7ma, el tritono interno), "
            f"lo que permite una resolución cromática descendente: "
            f"{sub_root} → {resolution_root} (semitono)."
        ),
    }


def get_all_tritone_subs() -> list[dict]:
    """Get tritone substitution for all 12 dominant7 chords."""
    ALL_ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
    results = []
    for root in ALL_ROOTS:
        sub = get_tritone_substitution(root, "dominant7")
        results.append(sub)
    return results


# ──────────────────────────────────────────────
# Modal Interchange
# ──────────────────────────────────────────────

BORROWED_CHORDS_INFO = [
    {"degree": "bIII", "semitones": 3, "quality": "major", "usage": "Color mayor, expansión. Muy común en pop/rock."},
    {"degree": "bVI", "semitones": 8, "quality": "major", "usage": "Dramático, épico. Común en bandas sonoras."},
    {"degree": "bVII", "semitones": 10, "quality": "major", "usage": "Rock, blues, resolución plagal. Muy versátil."},
    {"degree": "iv", "semitones": 5, "quality": "minor", "usage": "Cadencia plagal menor. Melancólico y emotivo."},
    {"degree": "bII", "semitones": 1, "quality": "major", "usage": "Acorde napolitano. Tensión dramática."},
    {"degree": "viio7/V", "semitones": 11, "quality": "diminished7", "usage": "Función dominante secundaria. Tensión intensa."},
]


BORROWED_FROM_MAJOR_INFO = [
    {"degree": "I", "semitones": 0, "quality": "major", "usage": "Acorde mayor sobre la tónica. Brillo y resolución mayor (Picardía)."},
    {"degree": "IV", "semitones": 5, "quality": "major", "usage": "Subdominante mayor. Claridad y luminosidad."},
    {"degree": "V", "semitones": 7, "quality": "major", "usage": "Dominante mayor (en vez de menor). Resolución más fuerte."},
    {"degree": "V7", "semitones": 7, "quality": "dominant7", "usage": "Dominante con 7ma. El V7 'clásico' prestado del mayor."},
    {"degree": "#VII", "semitones": 11, "quality": "major", "usage": "VII mayor natural. Color brillante inesperado."},
    {"degree": "II", "semitones": 2, "quality": "major", "usage": "Segundo grado mayor (en vez de disminuido). Sonido dórico."},
]


def get_modal_interchange(key: str, mode: str = "major") -> dict:
    """
    Get borrowed chords from the parallel key.
    mode='major': borrow from parallel minor.
    mode='minor': borrow from parallel major.
    """
    root_pc = note_to_pc(key)
    use_flats = _use_flats(key)

    if mode == "minor":
        source_info = BORROWED_FROM_MAJOR_INFO
        source_label = "mayor paralelo"
        parallel = _spell(root_pc, key)
    else:
        source_info = BORROWED_CHORDS_INFO
        source_label = "menor paralelo"
        parallel = _spell(root_pc, key) + "m"

    borrowed = []
    for info in source_info:
        chord_pc = (root_pc + info["semitones"]) % 12
        chord_root = _spell(chord_pc, key)

        # Use flats for borrowed chords from minor
        if mode != "minor" and not use_flats and info["semitones"] in [1, 3, 8, 10]:
            chord_root = CHROMATIC_FLATS[chord_pc]

        chord = build_chord(chord_root, info["quality"])

        borrowed.append({
            "degree": info["degree"],
            "symbol": chord["symbol"],
            "notes": chord["notes"],
            "root": chord_root,
            "quality": info["quality"],
            "usage": info["usage"],
            "source": source_label,
        })

    if mode == "minor":
        explanation = (
            f"Acordes prestados del modo mayor paralelo ({parallel}) "
            f"usados en contexto de {key} menor. Agregan brillo y resolución."
        )
    else:
        explanation = (
            f"Acordes prestados del modo menor paralelo ({parallel}) "
            f"usados en contexto de {key} mayor. Agregan color y dramatismo."
        )

    return {
        "key": key,
        "mode": mode,
        "parallel_minor" if mode != "minor" else "parallel_major": parallel,
        "borrowed_chords": borrowed,
        "explanation": explanation,
    }


# ──────────────────────────────────────────────
# Negative Harmony
# ──────────────────────────────────────────────

def get_negative_harmony(key: str) -> dict:
    """
    Calculate negative harmony mappings for a key.
    The axis of symmetry in a major key falls between the 3rd and b3rd degrees
    (between E and Eb in C major, i.e., at pitch class 4.5 from root).

    Each note is reflected: note → axis_mirror - (note - axis)
    Formula: negative_pc = (2 * axis - pc) % 12
    where axis = root_pc + 3.5 (midpoint between 3rd and b3rd)

    Since we work with integers, we use: negative_pc = (2*root_pc + 7 - pc) % 12
    """
    root_pc = note_to_pc(key)
    use_flats = _use_flats(key)

    # The axis is between scale degrees 3 and b3
    # In semitones from root: between 4 and 3, so axis = 3.5
    # Mirror formula: neg = (2 * (root + 3.5) - note) % 12
    # = (2*root + 7 - note) % 12

    mappings = []
    note_names = CHROMATIC_SHARPS if not use_flats else CHROMATIC_FLATS

    for pc in range(12):
        neg_pc = (2 * root_pc + 7 - pc) % 12
        original = note_names[pc]
        negative = note_names[neg_pc]
        mappings.append({
            "original": original,
            "negative": negative,
            "original_pc": pc,
            "negative_pc": neg_pc,
        })

    # Map diatonic chords to their negative equivalents
    scale = generate_scale(key, "major")
    diatonic = get_diatonic_chords(key)

    chord_mappings = []
    for chord_info in diatonic:
        chord_notes = chord_info["notes"]
        neg_pcs = []
        for note in chord_notes:
            pc = note_to_pc(note)
            neg_pc = (2 * root_pc + 7 - pc) % 12
            neg_pcs.append(neg_pc)

        # Try each negative PC as potential root to find chord type
        neg_symbol = "-".join(_spell(p, key) for p in neg_pcs)
        neg_notes_result = [_spell(p, key) for p in neg_pcs]
        found = False

        for candidate_root_pc in neg_pcs:
            intervals = sorted([(p - candidate_root_pc) % 12 for p in neg_pcs])
            for ct_name, ct_intervals in CHORD_TYPES.items():
                ct_pcs = set(i % 12 for i in ct_intervals)
                if set(intervals) == ct_pcs:
                    candidate_root = _spell(candidate_root_pc, key)
                    # Prefer flat spelling for chromatic notes
                    if not use_flats and candidate_root_pc in [1, 3, 6, 8, 10]:
                        candidate_root = CHROMATIC_FLATS[candidate_root_pc]
                    neg_chord = build_chord(candidate_root, ct_name)
                    neg_symbol = neg_chord["symbol"]
                    neg_notes_result = neg_chord["notes"]
                    found = True
                    break
            if found:
                break

        chord_mappings.append({
            "original": chord_info["symbol"],
            "original_numeral": chord_info["numeral"],
            "original_function": chord_info["function"],
            "negative": neg_symbol,
            "negative_notes": neg_notes_result,
        })

    return {
        "key": key,
        "axis": f"entre {_spell((root_pc + 3) % 12, key)} y {_spell((root_pc + 4) % 12, key)}",
        "note_mappings": mappings,
        "chord_mappings": chord_mappings,
        "explanation": (
            "La armonía negativa refleja notas y acordes sobre el eje de simetría "
            f"de {key} mayor (entre los grados 3 y b3). "
            "Acordes mayores se convierten en menores y viceversa, "
            "creando un espejo armónico con las mismas tensiones pero diferente color."
        ),
    }


# ──────────────────────────────────────────────
# Chopin Bass (3rd minor below root)
# ──────────────────────────────────────────────

def get_chopin_bass(chord_root: str, chord_type: str = "major") -> dict:
    """
    Suggest a Chopin-style bass voicing.
    The left hand plays the root a minor 3rd below (3 semitones down).
    This creates a romantic, deep sound characteristic of Chopin's style.
    """
    root_pc = note_to_pc(chord_root)
    use_flats = _use_flats(chord_root)

    # Minor 3rd below root
    bass_pc = (root_pc - 3) % 12
    bass_note = _spell(bass_pc, chord_root)

    chord = build_chord(chord_root, chord_type)

    # The voicing: bass (3rd minor below) + chord tones
    return {
        "chord": chord,
        "bass_note": bass_note,
        "voicing": [bass_note] + chord["notes"],
        "explanation": (
            f"Bajo de Chopin para {chord['symbol']}: toca {bass_note} como bajo "
            f"(3era menor por debajo de {chord_root}), luego las notas del acorde "
            f"({', '.join(chord['notes'])}). Crea una sonoridad profunda y romántica."
        ),
        "notation": f"{chord['symbol']}/{bass_note}",
    }


# ──────────────────────────────────────────────
# Suggest Chords from Melody
# ──────────────────────────────────────────────

def suggest_from_melody(notes: list[int]) -> dict:
    """
    Given a set of MIDI notes (melody), suggest compatible chords,
    possible cadences, and secondary dominants that could work.
    """
    from .tonality import detect_key

    if len(notes) < 2:
        return {"error": "Se necesitan al menos 2 notas"}

    # Detect key
    key_results = detect_key(notes)
    best_key = key_results[0]["key"] if key_results else "C"

    # Get unique pitch classes
    pcs = list(set(n % 12 for n in notes))

    # Get diatonic chords for detected key
    diatonic = get_diatonic_chords(best_key)

    # Score each diatonic chord by how many melody notes it contains
    chord_scores = []
    for chord_info in diatonic:
        chord_pcs = set(note_to_pc(n) for n in chord_info["notes"])
        matching = len(set(pcs) & chord_pcs)
        if matching > 0:
            chord_scores.append({
                "symbol": chord_info["symbol"],
                "numeral": chord_info["numeral"],
                "function": chord_info["function"],
                "notes": chord_info["notes"],
                "match_score": matching,
                "match_ratio": round(matching / len(chord_pcs) * 100),
            })

    chord_scores.sort(key=lambda x: x["match_score"], reverse=True)

    # Suggest secondary dominants
    from .harmony import get_secondary_dominants
    sec_doms = get_secondary_dominants(best_key)

    compatible_sec_doms = []
    for sd in sec_doms:
        sd_pcs = set(note_to_pc(n) for n in sd["notes7"])
        matching = len(set(pcs) & sd_pcs)
        if matching >= 2:
            compatible_sec_doms.append({
                "symbol": sd["chord7"],
                "label": sd["label"],
                "target": sd["target"],
                "notes": sd["notes7"],
                "match_score": matching,
            })

    # Suggest cadences
    cadences = get_cadences(best_key)
    suggested_cadences = cadences[:5]

    return {
        "detected_key": best_key,
        "key_confidence": key_results[0]["confidence"] if key_results else 0,
        "melody_notes": [CHROMATIC_SHARPS[pc] for pc in pcs],
        "compatible_chords": chord_scores,
        "compatible_secondary_dominants": compatible_sec_doms,
        "suggested_cadences": [
            {"name": c["name"], "numerals": c["numerals"]}
            for c in suggested_cadences
        ],
    }
