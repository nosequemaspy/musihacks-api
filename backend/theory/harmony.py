"""
Harmony module: secondary dominants, suggestions, common progressions.
"""

from .notes import note_to_pc, pc_to_note, CHROMATIC_SHARPS, CHROMATIC_FLATS
from .scales import generate_scale
from .chords import build_chord, CHORD_SYMBOLS
from .tonality import (
    get_diatonic_chords, get_diatonic_chords_minor, DIATONIC_QUALITIES,
    MINOR_DIATONIC_QUALITIES, MINOR_ROMAN_NUMERALS, MINOR_HARMONIC_FUNCTIONS,
    HARMONIC_MINOR_QUALITIES, HARMONIC_MINOR_NUMERALS, HARMONIC_MINOR_FUNCTIONS,
)


def _use_flats(key: str) -> bool:
    return key in {"F", "Bb", "Eb", "Ab", "Db", "Gb"} or "b" in key


def _minor_sec_targets(mode: str) -> list[tuple[int, str]]:
    """Return (degree_index, numeral) targets for secondary dominants/subdominants in minor."""
    if mode == "harmonic_minor":
        # i ii° III+ iv V VI vii° — skip ii° (dim) and vii° (dim)
        return [
            (2, "III+"),
            (3, "iv"),
            (4, "V"),
            (5, "VI"),
        ]
    else:
        # natural minor: i ii° III iv v VI VII — skip ii° (dim)
        return [
            (2, "III"),
            (3, "iv"),
            (4, "v"),
            (5, "VI"),
            (6, "VII"),
        ]


def get_secondary_dominants(key: str, mode: str = "major") -> list[dict]:
    """
    Get all secondary dominants for a key.
    For major: V/ii, V/iii, V/IV, V/V, V/vi (skip V/vii°)
    For minor: targets depend on natural vs harmonic minor.
    """
    scale_type = mode if mode != "major" else "major"
    scale = generate_scale(key, scale_type)
    use_flats = _use_flats(key)

    if mode == "major":
        targets = [
            (1, "ii"),
            (2, "iii"),
            (3, "IV"),
            (4, "V"),
            (5, "vi"),
        ]
    else:
        targets = _minor_sec_targets(mode)

    results = []
    for degree_idx, target_name in targets:
        target_root = scale[degree_idx]
        target_pc = note_to_pc(target_root)

        # V of target = note a perfect 5th above target (7 semitones)
        dom_pc = (target_pc + 7) % 12
        dom_root = CHROMATIC_FLATS[dom_pc] if use_flats else CHROMATIC_SHARPS[dom_pc]

        dom_chord = build_chord(dom_root, "major")
        dom7_chord = build_chord(dom_root, "dominant7")

        results.append({
            "label": f"V/{target_name}",
            "root": dom_root,
            "target": target_root,
            "target_degree": target_name,
            "chord": dom_chord["symbol"],
            "notes": dom_chord["notes"],
            "chord7": dom7_chord["symbol"],
            "notes7": dom7_chord["notes"],
        })

    return results


def get_dominant_chains(key: str, max_depth: int = 3) -> list[dict]:
    """
    Generate chains of secondary dominants for each diatonic target.
    E.g. in C: A7 → D7 → G7 → C (V/V/V → V/V → V → I)
    """
    scale = generate_scale(key, "major")
    use_flats = _use_flats(key)

    # Targets: ii through vi + I
    targets = [
        (0, "I"), (1, "ii"), (2, "iii"), (3, "IV"), (4, "V"), (5, "vi"),
    ]

    results = []
    for degree_idx, target_name in targets:
        target_root = scale[degree_idx]
        chain = []
        current_pc = note_to_pc(target_root)

        for depth in range(max_depth):
            # V of current target = 7 semitones above
            dom_pc = (current_pc + 7) % 12
            dom_root = CHROMATIC_FLATS[dom_pc] if use_flats else CHROMATIC_SHARPS[dom_pc]
            dom7 = build_chord(dom_root, "dominant7")

            # Build label: V, V/V, V/V/V for target I; V/ii, V/V/ii, V/V/V/ii for others
            if target_name == "I":
                label = "V/" * depth + "V" if depth > 0 else "V"
            else:
                label = "V/" * (depth + 1) + target_name

            chain.insert(0, {
                "symbol": dom7["symbol"],
                "root": dom_root,
                "notes": dom7["notes"],
                "label": label,
            })
            current_pc = dom_pc

        results.append({
            "target": target_root,
            "target_degree": target_name,
            "chain": chain,
        })

    return results


def get_secondary_subdominants(key: str, mode: str = "major") -> list[dict]:
    """
    Get secondary subdominants (ii/X) for a key.
    """
    scale_type = mode if mode != "major" else "major"
    scale = generate_scale(key, scale_type)
    use_flats = _use_flats(key)

    if mode == "major":
        targets = [
            (1, "ii"), (2, "iii"), (3, "IV"), (4, "V"), (5, "vi"),
        ]
    else:
        targets = _minor_sec_targets(mode)

    results = []
    for degree_idx, target_name in targets:
        target_root = scale[degree_idx]
        target_pc = note_to_pc(target_root)

        # ii of target = minor chord a whole step above target (2 semitones)
        # Actually, ii of a key is built on the 2nd degree, which is 2 semitones above the root
        sub_pc = (target_pc + 2) % 12
        sub_root = CHROMATIC_FLATS[sub_pc] if use_flats else CHROMATIC_SHARPS[sub_pc]

        chord = build_chord(sub_root, "minor")
        chord7 = build_chord(sub_root, "minor7")

        results.append({
            "label": f"ii/{target_name}",
            "root": sub_root,
            "target": target_root,
            "target_degree": target_name,
            "chord": chord["symbol"],
            "notes": chord["notes"],
            "chord7": chord7["symbol"],
            "notes7": chord7["notes"],
        })

    return results


# Song examples for each progression template
PROGRESSION_EXAMPLES = {
    "Classic": [
        {"title": "Himno a la Alegría", "artist": "Beethoven", "genre": "Clásica"},
        {"title": "Twist and Shout", "artist": "The Beatles", "genre": "Rock"},
        {"title": "La Bamba", "artist": "Ritchie Valens", "genre": "Latin rock"},
        {"title": "Wild Thing", "artist": "The Troggs", "genre": "Rock"},
    ],
    "Pop": [
        {"title": "Let It Be", "artist": "The Beatles", "genre": "Pop/Rock"},
        {"title": "Someone Like You", "artist": "Adele", "genre": "Pop"},
        {"title": "No Woman No Cry", "artist": "Bob Marley", "genre": "Reggae"},
        {"title": "With or Without You", "artist": "U2", "genre": "Rock"},
    ],
    "Jazz ii-V-I": [
        {"title": "Fly Me to the Moon", "artist": "Jazz standard", "genre": "Jazz"},
        {"title": "Autumn Leaves", "artist": "Jazz standard", "genre": "Jazz"},
        {"title": "All The Things You Are", "artist": "Jerome Kern", "genre": "Jazz"},
    ],
    "50s": [
        {"title": "Stand By Me", "artist": "Ben E. King", "genre": "Soul"},
        {"title": "Earth Angel", "artist": "The Penguins", "genre": "Doo-wop"},
        {"title": "Unchained Melody", "artist": "Righteous Brothers", "genre": "Pop"},
        {"title": "Every Breath You Take", "artist": "The Police", "genre": "Rock"},
    ],
    "Andalusian": [
        {"title": "Hit the Road Jack", "artist": "Ray Charles", "genre": "R&B"},
        {"title": "Malagueña", "artist": "Tradicional española", "genre": "Flamenco"},
        {"title": "Hava Nagila", "artist": "Tradicional judía", "genre": "Folk"},
        {"title": "Asturias", "artist": "Albéniz", "genre": "Clásica"},
    ],
    "Canon": [
        {"title": "Canon en D", "artist": "Pachelbel", "genre": "Clásica (Barroco)"},
        {"title": "Basket Case", "artist": "Green Day", "genre": "Punk rock"},
        {"title": "Don't Stop Believin'", "artist": "Journey", "genre": "Rock"},
    ],
    "12-bar blues": [
        {"title": "Johnny B. Goode", "artist": "Chuck Berry", "genre": "Rock & Roll"},
        {"title": "Sweet Home Chicago", "artist": "Robert Johnson", "genre": "Blues"},
        {"title": "Hound Dog", "artist": "Elvis Presley", "genre": "Rock & Roll"},
        {"title": "Pride and Joy", "artist": "Stevie Ray Vaughan", "genre": "Blues"},
    ],
    "Sad": [
        {"title": "Despacito", "artist": "Luis Fonsi", "genre": "Latin pop"},
        {"title": "Numb", "artist": "Linkin Park", "genre": "Rock"},
        {"title": "Complicated", "artist": "Avril Lavigne", "genre": "Pop rock"},
        {"title": "Africa", "artist": "Toto", "genre": "Pop rock"},
    ],
    "Rock": [
        {"title": "Sweet Child O'Mine", "artist": "Guns N' Roses", "genre": "Rock"},
        {"title": "Hey Jude (outro)", "artist": "The Beatles", "genre": "Rock"},
        {"title": "Sympathy for the Devil", "artist": "Rolling Stones", "genre": "Rock"},
    ],
    "Ballad": [
        {"title": "Let Her Go", "artist": "Passenger", "genre": "Folk pop"},
        {"title": "Claro de Luna", "artist": "Beethoven", "genre": "Clásica"},
        {"title": "Yesterday", "artist": "The Beatles", "genre": "Pop"},
    ],
}

# Common chord progressions with names
COMMON_PROGRESSIONS = [
    {"name": "Classic", "numerals": ["I", "IV", "V", "I"], "degrees": [0, 3, 4, 0]},
    {"name": "Pop", "numerals": ["I", "V", "vi", "IV"], "degrees": [0, 4, 5, 3]},
    {"name": "Jazz ii-V-I", "numerals": ["ii", "V", "I"], "degrees": [1, 4, 0]},
    {"name": "50s", "numerals": ["I", "vi", "IV", "V"], "degrees": [0, 5, 3, 4]},
    {"name": "Andalusian", "numerals": ["vi", "V", "IV", "III"], "degrees": [5, 4, 3, 2]},
    {"name": "Canon", "numerals": ["I", "V", "vi", "iii", "IV", "I", "IV", "V"], "degrees": [0, 4, 5, 2, 3, 0, 3, 4]},
    {"name": "12-bar blues", "numerals": ["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "V"], "degrees": [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4]},
    {"name": "Sad", "numerals": ["vi", "IV", "I", "V"], "degrees": [5, 3, 0, 4]},
    {"name": "Rock", "numerals": ["I", "bVII", "IV", "I"], "degrees": [0, -1, 3, 0]},  # -1 = special
    {"name": "Ballad", "numerals": ["I", "iii", "IV", "V"], "degrees": [0, 2, 3, 4]},
]


MINOR_PROGRESSIONS = [
    {"name": "Menor natural", "numerals": ["i", "iv", "v", "i"], "degrees": [0, 3, 4, 0]},
    {"name": "Andaluza", "numerals": ["i", "VII", "VI", "V"], "degrees": [0, 6, 5, -2]},
    {"name": "Pop menor", "numerals": ["i", "VI", "III", "VII"], "degrees": [0, 5, 2, 6]},
    {"name": "Dramática", "numerals": ["i", "iv", "VII", "III"], "degrees": [0, 3, 6, 2]},
    {"name": "Triste", "numerals": ["i", "v", "VI", "iv"], "degrees": [0, 4, 5, 3]},
    {"name": "Rock menor", "numerals": ["i", "VII", "iv", "i"], "degrees": [0, 6, 3, 0]},
    {"name": "Blues menor", "numerals": ["i", "i", "iv", "i", "v", "iv", "i", "v"], "degrees": [0, 0, 3, 0, 4, 3, 0, 4]},
]

MINOR_PROGRESSION_EXAMPLES = {
    "Menor natural": [
        {"title": "House of the Rising Sun", "artist": "The Animals", "genre": "Folk rock"},
        {"title": "Stairway to Heaven (intro)", "artist": "Led Zeppelin", "genre": "Rock"},
    ],
    "Andaluza": [
        {"title": "Hit the Road Jack", "artist": "Ray Charles", "genre": "R&B"},
        {"title": "Malagueña", "artist": "Tradicional española", "genre": "Flamenco"},
        {"title": "Hava Nagila", "artist": "Tradicional judía", "genre": "Folk"},
        {"title": "Asturias", "artist": "Albéniz", "genre": "Clásica"},
    ],
    "Pop menor": [
        {"title": "Zombie", "artist": "The Cranberries", "genre": "Rock"},
        {"title": "Numb", "artist": "Linkin Park", "genre": "Rock"},
    ],
    "Dramática": [
        {"title": "My Heart Will Go On", "artist": "Celine Dion", "genre": "Pop"},
    ],
    "Triste": [
        {"title": "Someone Like You", "artist": "Adele", "genre": "Pop"},
        {"title": "Mad World", "artist": "Gary Jules", "genre": "Alternative"},
    ],
    "Rock menor": [
        {"title": "All Along the Watchtower", "artist": "Jimi Hendrix", "genre": "Rock"},
        {"title": "Smoke on the Water", "artist": "Deep Purple", "genre": "Rock"},
    ],
    "Blues menor": [
        {"title": "The Thrill Is Gone", "artist": "B.B. King", "genre": "Blues"},
        {"title": "Black Magic Woman", "artist": "Fleetwood Mac / Santana", "genre": "Blues rock"},
    ],
}


def get_common_progressions(key: str, mode: str = "major") -> list[dict]:
    """Get common chord progressions realized in the given key and mode."""
    use_flats = _use_flats(key)

    if mode == "major":
        scale = generate_scale(key, "major")
        qualities = DIATONIC_QUALITIES
        prog_list = COMMON_PROGRESSIONS
        examples_map = PROGRESSION_EXAMPLES
    else:
        scale_type = mode if mode in ("natural_minor", "harmonic_minor") else "natural_minor"
        scale = generate_scale(key, scale_type)
        qualities = MINOR_DIATONIC_QUALITIES
        prog_list = MINOR_PROGRESSIONS
        examples_map = MINOR_PROGRESSION_EXAMPLES

    results = []
    for prog in prog_list:
        chords = []
        for degree in prog["degrees"]:
            if degree == -1:
                # bVII: flat seventh (whole step below root)
                root_pc = note_to_pc(key)
                bvii_pc = (root_pc + 10) % 12
                bvii_root = CHROMATIC_FLATS[bvii_pc] if use_flats else CHROMATIC_SHARPS[bvii_pc]
                chord = build_chord(bvii_root, "major")
                chords.append(chord["symbol"])
            elif degree == -2:
                # V (major) in minor context — harmonic dominant
                root_pc = note_to_pc(key)
                v_pc = (root_pc + 7) % 12
                v_root = CHROMATIC_FLATS[v_pc] if use_flats else CHROMATIC_SHARPS[v_pc]
                chord = build_chord(v_root, "major")
                chords.append(chord["symbol"])
            else:
                root = scale[degree]
                quality = qualities[degree]
                chord = build_chord(root, quality)
                chords.append(chord["symbol"])

        results.append({
            "name": prog["name"],
            "numerals": prog["numerals"],
            "chords": chords,
            "examples": examples_map.get(prog["name"], []),
        })

    return results


def _classify_function(func_str):
    """Classify a harmonic function string into T/SD/D."""
    if not func_str:
        return None
    f = func_str.lower()
    if f.startswith("tonic"):
        return "T"
    elif f.startswith("subdominant"):
        return "SD"
    elif f.startswith("dominant"):
        return "D"
    return None


_FUNCTION_LABELS = {
    "T": "Reposo",
    "SD": "Preparación",
    "D": "Tensión",
    "MI": "Color",
    "CR": "Cromatismo",
}


def suggest_next_chords(key: str, current_chords: list[str] = None, mode: str = "major") -> dict:
    """
    Given a key and optionally the chords played so far,
    suggest possible next chords including diatonic and secondary dominants.
    Ordered by functional harmonic relevance when current chord is given.
    """
    from .advanced_harmony import get_modal_interchange, get_tritone_substitution

    if mode != "major" and mode in ("natural_minor", "harmonic_minor"):
        diatonic = get_diatonic_chords_minor(key, mode)
    else:
        diatonic = get_diatonic_chords(key)
    secondary_doms = get_secondary_dominants(key, mode)

    # Diatonic suggestions
    diatonic_suggestions = [
        {
            "symbol": c["symbol"],
            "numeral": c["numeral"],
            "function": c["function"],
            "notes": c["notes"],
            "category": "diatonic",
        }
        for c in diatonic
    ]

    # Secondary dominant suggestions
    secondary_suggestions = [
        {
            "symbol": sd["chord7"],
            "label": sd["label"],
            "notes": sd["notes7"],
            "target": sd["target"],
            "category": "secondary_dominant",
        }
        for sd in secondary_doms
    ]

    # Functional ordering based on last chord
    recommended = []
    if current_chords and len(current_chords) > 0:
        last = current_chords[-1]
        # Find function of last chord
        last_func = None
        last_numeral = None
        for c in diatonic:
            if c["symbol"] == last:
                last_func = c["function"]
                last_numeral = c["numeral"]
                break

        last_class = _classify_function(last_func)

        # Functional movement: T→SD/D, SD→D/T, D→T/SD
        preferred_classes = []
        if last_class == "T":
            preferred_classes = ["SD", "D"]
        elif last_class == "SD":
            preferred_classes = ["D", "T"]
        elif last_class == "D":
            preferred_classes = ["T", "SD"]

        for pc in preferred_classes:
            for d in diatonic_suggestions:
                if _classify_function(d["function"]) == pc and d["symbol"] != last:
                    recommended.append(d["symbol"])

        # Also recommend sec.dom that resolve TO the current chord
        for sd in secondary_doms:
            if sd["target"] == last:
                recommended.append(sd["chord7"])

    # Compatible scales
    from .scales import generate_scale as gen_scale
    if mode != "major" and mode in ("natural_minor", "harmonic_minor"):
        scale_notes = generate_scale(key, mode)
        compatible = [
            {"type": mode, "root": key, "notes": scale_notes},
            {"type": "pentatonic_minor", "root": key, "notes": gen_scale(key, "pentatonic_minor")},
        ]
    else:
        scale_notes = generate_scale(key, "major")
        compatible = [
            {"type": "major", "root": key, "notes": scale_notes},
            {"type": "pentatonic_major", "root": key, "notes": gen_scale(key, "pentatonic_major")},
        ]
        minor_root = scale_notes[5] if len(scale_notes) > 5 else None
        if minor_root:
            compatible.append({
                "type": "pentatonic_minor",
                "root": minor_root,
                "notes": gen_scale(minor_root, "pentatonic_minor"),
            })

    return {
        "key": key,
        "diatonic": diatonic_suggestions,
        "secondary_dominants": secondary_suggestions,
        "recommended": recommended,
        "compatible_scales": compatible,
        "common_progressions": get_common_progressions(key, mode),
    }


def suggest_next_chords_builder(key: str, mode: str = "major", chords: list[str] = None) -> dict:
    """
    Enhanced suggestions for the builder panel.
    Returns structured recommendations grouped by harmonic function.
    Each suggestion has: symbol, notes, numeral, function_label, function_class, category, reason.
    """
    from .advanced_harmony import get_modal_interchange, get_tritone_substitution

    if mode != "major" and mode in ("natural_minor", "harmonic_minor"):
        diatonic = get_diatonic_chords_minor(key, mode)
        scale = generate_scale(key, mode)
    else:
        diatonic = get_diatonic_chords(key)
        scale = generate_scale(key, "major")
    use_flats = _use_flats(key)

    suggestions = []
    seen_symbols = set()

    last = chords[-1] if chords and len(chords) > 0 else None

    # Find function of last chord
    last_func = None
    last_numeral = None
    last_class = None
    if last:
        for c in diatonic:
            if c["symbol"] == last:
                last_func = c["function"]
                last_numeral = c["numeral"]
                break
        last_class = _classify_function(last_func)

    def _add(symbol, notes, numeral, func_class, category, reason, usage_hint=""):
        if symbol not in seen_symbols and symbol != last:
            seen_symbols.add(symbol)
            suggestions.append({
                "symbol": symbol,
                "notes": notes,
                "numeral": numeral,
                "function_label": _FUNCTION_LABELS.get(func_class, ""),
                "function_class": func_class,
                "category": category,
                "reason": reason,
                "usage_hint": usage_hint,
            })

    # --- 1. Diatonic chords ordered by functional movement ---
    preferred_classes = []
    if last_class == "T":
        preferred_classes = ["SD", "D", "T"]
    elif last_class == "SD":
        preferred_classes = ["D", "T", "SD"]
    elif last_class == "D":
        preferred_classes = ["T", "SD", "D"]
    else:
        preferred_classes = ["T", "SD", "D"]

    for pc in preferred_classes:
        for c in diatonic:
            fc = _classify_function(c["function"])
            if fc == pc:
                cat_map = {"T": "resolution", "SD": "movement", "D": "tension"}
                hint_map = {
                    "T": "Usar para resolver o establecer tónica",
                    "SD": "Usar antes de V para crear movimiento → V → I",
                    "D": "Usar antes de I para crear tensión y resolución"
                }
                _add(c["symbol"], c["notes"], c["numeral"], fc,
                     cat_map.get(fc, "resolution"),
                     f"Diatónico ({c['function']})",
                     hint_map.get(fc, ""))

    # --- 2. Modal interchange: bVI, iv, bVII, bIII ---
    try:
        mi = get_modal_interchange(key)
        mi_target_degrees = {"bVI", "iv", "bVII", "bIII"}
        for bc in mi.get("borrowed_chords", []):
            if bc["degree"] in mi_target_degrees:
                _add(bc["symbol"], bc["notes"], bc["degree"], "MI", "color",
                     f"Intercambio modal ({bc['degree']} del menor paralelo)",
                     "Usar para añadir color dramático o nostálgico")
    except Exception:
        pass

    # --- 3. V7sus4 retardation ---
    if last_numeral == "V" or (last and last_class == "D"):
        root_pc = note_to_pc(key)
        v_pc = (root_pc + 7) % 12
        v_root = CHROMATIC_FLATS[v_pc] if use_flats else CHROMATIC_SHARPS[v_pc]
        try:
            sus4_chord = build_chord(v_root, "sus4")
            _add(sus4_chord["symbol"], sus4_chord["notes"], "Vsus4", "CR", "chromatic",
                 "Retardo: suspende la 3ra del V",
                 "ANTES de V7: Crea tensión suspendida → luego V7 → I")
        except Exception:
            pass

    # If last chord IS a sus4, suggest V7 resolution
    if last and "sus4" in last:
        if len(last) > 1 and last[1] in ('#', 'b'):
            sus_root = last[:2]
        else:
            sus_root = last[0]
        try:
            v7_chord = build_chord(sus_root, "dominant7")
            _add(v7_chord["symbol"], v7_chord["notes"], "V7", "D", "tension",
                 "Resolución del retardo sus4 → V7",
                 "DESPUÉS de sus4: Resolver la suspensión → luego I")
        except Exception:
            pass

    # --- 3b. Secondary subdominants (ii/V) and sus4 versions ---
    # For each diatonic chord, suggest its ii/V and V7sus4/V
    sec_subs = get_secondary_subdominants(key)
    for ss in sec_subs:
        target_pc = note_to_pc(ss["target"])
        # Find if any chord in progression matches target
        is_relevant = False
        if last:
            if len(last) > 1 and last[1] in ('#', 'b'):
                last_root = last[:2]
            else:
                last_root = last[0]
            if note_to_pc(last_root) == target_pc:
                is_relevant = True

        # Also add top ii/V pairs regardless (user requested these)
        if is_relevant or ss["label"] in ("ii/V", "ii/vi", "ii/IV", "ii/ii"):
            _add(ss["chord7"], ss["notes7"], ss["label"], "SD", "movement",
                 f"Subdom. secundaria → {ss['target']}",
                 f"ANTES de V/{ss['target']}: Progresión ii → V → {ss['target']}")

            # Also add V7sus4/target
            try:
                v_pc = (target_pc + 7) % 12
                v_root = CHROMATIC_FLATS[v_pc] if use_flats else CHROMATIC_SHARPS[v_pc]
                sus4 = build_chord(v_root, "sus4")
                _add(sus4["symbol"], sus4["notes"], f"Vsus4/{ss['target']}", "CR", "chromatic",
                     f"V7sus4 → {ss['target']}",
                     f"ANTES de {ss['target']}: Crea tensión sus4 → V7 → {ss['target']}")
            except Exception:
                pass

    # --- 4. Tritone substitution for dominant suggestions ---
    dom_suggestions = [s for s in suggestions if s["function_class"] == "D"]
    for ds in dom_suggestions:
        root_sym = ds["symbol"]
        # Parse root
        if len(root_sym) > 1 and root_sym[1] in ('#', 'b'):
            d_root = root_sym[:2]
        else:
            d_root = root_sym[0]
        try:
            tt = get_tritone_substitution(d_root, "dominant7")
            sub = tt["substitution"]
            target_note = tt.get("resolves_to", "I")
            _add(sub["symbol"], sub["notes"], "subTT", "CR", "chromatic",
                 f"Sub. tritonal de {ds['symbol']}",
                 f"EN LUGAR de {ds['symbol']}: Mismo tritono, bajo cromático descendente")
        except Exception:
            pass

    # Also add tritone sub for V7 specifically if not already there
    root_pc = note_to_pc(key)
    v_pc = (root_pc + 7) % 12
    v_root = CHROMATIC_FLATS[v_pc] if use_flats else CHROMATIC_SHARPS[v_pc]
    try:
        tt = get_tritone_substitution(v_root, "dominant7")
        sub = tt["substitution"]
        _add(sub["symbol"], sub["notes"], "subTT/V", "CR", "chromatic",
             f"Sub. tritonal del V7 ({v_root}7)",
             "EN LUGAR de V7: Movimiento de bajo b2 → I (muy jazz)")
    except Exception:
        pass

    # Group by category
    groups = {
        "resolution": [s for s in suggestions if s["category"] == "resolution"],
        "movement": [s for s in suggestions if s["category"] == "movement"],
        "tension": [s for s in suggestions if s["category"] == "tension"],
        "color": [s for s in suggestions if s["category"] == "color"],
        "chromatic": [s for s in suggestions if s["category"] == "chromatic"],
    }

    return {
        "key": key,
        "last_chord": last,
        "suggestions": suggestions,
        "groups": groups,
    }


def enrich_progression(key: str, chords: list[str]) -> list[dict]:
    """
    For each chord in the progression, suggest enrichments:
    secondary dominant, secondary subdominant, tritone substitution,
    Chopin bass, and passing diminished.
    """
    from .advanced_harmony import get_tritone_substitution, get_chopin_bass

    scale = generate_scale(key, "major")
    use_flats = _use_flats(key)
    sec_doms = get_secondary_dominants(key)
    sec_subs = get_secondary_subdominants(key)

    results = []
    for idx, chord_symbol in enumerate(chords):
        enrichments = []

        # Parse chord root from symbol
        if len(chord_symbol) > 1 and chord_symbol[1] in ('#', 'b'):
            chord_root = chord_symbol[:2]
        else:
            chord_root = chord_symbol[0]

        chord_pc = note_to_pc(chord_root)

        # 1) Secondary dominant (V7/X) — dominant that resolves TO this chord
        for sd in sec_doms:
            if note_to_pc(sd["target"]) == chord_pc:
                enrichments.append({
                    "type": "secondary_dominant",
                    "label": sd["label"],
                    "symbol": sd["chord7"],
                    "notes": sd["notes7"],
                    "position": "before",
                    "description": f"Dominante secundario que resuelve a {chord_symbol}",
                })
                break

        # 2) Secondary subdominant (ii/X) — prepares this chord
        for ss in sec_subs:
            if note_to_pc(ss["target"]) == chord_pc:
                enrichments.append({
                    "type": "secondary_subdominant",
                    "label": ss["label"],
                    "symbol": ss["chord7"],
                    "notes": ss["notes7"],
                    "position": "before",
                    "description": f"Subdominante secundario que prepara {chord_symbol}",
                })
                break

        # 3) Tritone substitution (only for dominant7 chords)
        is_dom7 = chord_symbol.endswith('7') and not chord_symbol.endswith('m7') and not chord_symbol.endswith('maj7')
        if is_dom7:
            try:
                tt = get_tritone_substitution(chord_root, "dominant7")
                sub = tt["substitution"]
                enrichments.append({
                    "type": "tritone_sub",
                    "label": "SubTT",
                    "symbol": sub["symbol"],
                    "notes": sub["notes"],
                    "position": "replace",
                    "description": f"Sustitución tritonal de {chord_symbol}",
                })
            except Exception:
                pass

        # 4) Chopin bass
        try:
            # Determine chord quality for Chopin bass
            rest = chord_symbol[len(chord_root):]
            quality_map = {
                '': 'major', 'm': 'minor', 'dim': 'diminished',
                'aug': 'augmented', 'maj7': 'major7', 'm7': 'minor7',
                '7': 'dominant7',
            }
            quality = quality_map.get(rest, 'major')
            cb = get_chopin_bass(chord_root, quality)
            enrichments.append({
                "type": "chopin_bass",
                "label": "Chopin",
                "symbol": cb["notation"],
                "notes": cb["voicing"],
                "position": "replace",
                "description": f"Bajo de Chopin: {cb['bass_note']} bajo {chord_symbol}",
            })
        except Exception:
            pass

        # 5) Passing diminished (dim chord one semitone below the target root)
        if idx < len(chords) - 1:
            # Target is the next chord
            next_symbol = chords[idx + 1]
            if len(next_symbol) > 1 and next_symbol[1] in ('#', 'b'):
                next_root = next_symbol[:2]
            else:
                next_root = next_symbol[0]
            next_pc = note_to_pc(next_root)
            dim_pc = (next_pc - 1) % 12
            dim_root = CHROMATIC_FLATS[dim_pc] if use_flats else CHROMATIC_SHARPS[dim_pc]
            dim_chord = build_chord(dim_root, "diminished")
            enrichments.append({
                "type": "passing_dim",
                "label": "dim paso",
                "symbol": dim_chord["symbol"],
                "notes": dim_chord["notes"],
                "position": "before",
                "description": f"Disminuido de paso hacia {next_symbol}",
            })

        results.append({
            "chord": chord_symbol,
            "enrichments": enrichments,
        })

    return results
