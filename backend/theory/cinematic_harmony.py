"""
Cinematic Harmony & Improvisation module.

Harmonic patterns, improvisation guides, and composition techniques
inspired by Joe Hisaishi (Studio Ghibli), Nobuo Uematsu (Final Fantasy),
and cinematic/jazz harmony with classical orientation.

Includes:
- Cinematic chord progressions by style
- Chord-scale relationships for improvisation
- Guide tones, tensions, and avoid notes
- Chromatic mediant relationships
- Composition techniques and tips
"""

from .notes import note_to_pc, pc_to_note, CHROMATIC_SHARPS, CHROMATIC_FLATS
from .scales import generate_scale, SCALE_PATTERNS
from .chords import build_chord, CHORD_TYPES, get_chord_midi
from .tonality import get_diatonic_chords, get_diatonic_seventh_chords


def _use_flats(key: str) -> bool:
    return key in {"F", "Bb", "Eb", "Ab", "Db", "Gb"} or "b" in key


def _spell(pc: int, key: str) -> str:
    return CHROMATIC_FLATS[pc % 12] if _use_flats(key) else CHROMATIC_SHARPS[pc % 12]


# ──────────────────────────────────────────────
# Cinematic Progressions
# ──────────────────────────────────────────────

CINEMATIC_PROGRESSIONS = {
    "ghibli": {
        "label": "Studio Ghibli / Joe Hisaishi",
        "description": (
            "Hisaishi combina la dulzura del modo Lidio con progresiones Royal Road, "
            "acordes maj7 flotantes, intercambio modal suave (bVI, bVII, iv), "
            "y resoluciones que evocan nostalgia y maravilla. "
            "Frecuente uso de pedal en la tonica y movimiento de voces por grado conjunto."
        ),
        "techniques": [
            "Modo Lidio (#4) para crear sensacion de vuelo y asombro",
            "Acordes maj7 y add9 para textura eterea",
            "Royal Road (IVmaj7 - V7 - iii7 - vi) como base emocional",
            "Intercambio modal suave: bVI y iv del menor paralelo",
            "Pedal de tonica mientras la armonia se mueve arriba",
            "Cadencias suspendidas (evitar V-I directo, preferir V-vi o IV-I)",
            "Planing: acordes paralelos por grado conjunto (influencia Debussy)",
            "Contrastes mayor/menor para evocar nostalgia",
        ],
        "progressions": [
            {
                "name": "Royal Road (Odo Shinko)",
                "numerals": ["IVmaj7", "V7", "iii7", "vi"],
                "degrees": [(3, "major7"), (4, "dominant7"), (2, "minor7"), (5, "minor")],
                "description": "La progresion mas iconica del anime y J-pop. Movimiento epico y emotivo.",
                "usage": "Temas principales, momentos de revelacion, escenas emotivas",
                "examples": [
                    {"title": "Merry-Go-Round of Life", "source": "Howl's Moving Castle"},
                    {"title": "One Summer's Day", "source": "Spirited Away"},
                    {"title": "Kimi wo Nosete", "source": "Castle in the Sky"},
                ],
            },
            {
                "name": "Lydian Ascendente",
                "numerals": ["I", "II", "IVmaj7", "I"],
                "degrees": [(0, "major"), (1, "major"), (3, "major7"), (0, "major")],
                "description": "El II mayor (no diatonico) sugiere modo Lidio. Sensacion de vuelo y asombro.",
                "usage": "Escenas de vuelo, descubrimiento, paisajes abiertos",
                "examples": [
                    {"title": "Path of the Wind", "source": "My Neighbor Totoro"},
                    {"title": "Carrying You", "source": "Castle in the Sky"},
                ],
            },
            {
                "name": "Nostalgia Ghibli",
                "numerals": ["I", "iii", "vi", "IV"],
                "degrees": [(0, "major"), (2, "minor"), (5, "minor"), (3, "major")],
                "description": "Movimiento suave T-T-T-SD. La ausencia de dominante crea nostalgia sin tension.",
                "usage": "Momentos de recuerdo, despedidas suaves, paisajes",
                "examples": [
                    {"title": "The Name of Life", "source": "Spirited Away"},
                ],
            },
            {
                "name": "Ghibli Waltz",
                "numerals": ["Imaj7", "vi7", "IVmaj7", "V7"],
                "degrees": [(0, "major7"), (5, "minor7"), (3, "major7"), (4, "dominant7")],
                "description": "Waltz con acordes de septima. Fluido y elegante, tipico de Hisaishi.",
                "usage": "Escenas de baile, momentos magicos, temas principales",
                "examples": [
                    {"title": "Merry-Go-Round of Life", "source": "Howl's Moving Castle"},
                    {"title": "A Town with an Ocean View", "source": "Kiki's Delivery Service"},
                ],
            },
            {
                "name": "Plagal Cinematica",
                "numerals": ["I", "IV", "iv", "I"],
                "degrees": [(0, "major"), (3, "major"), (3, "minor"), (0, "major")],
                "description": "IV mayor a iv menor (intercambio modal). La transformacion crea emocion contenida.",
                "usage": "Momentos de ternura que se tornan agridulces",
                "examples": [
                    {"title": "Summer (tema)", "source": "Kikujiro"},
                ],
            },
            {
                "name": "Ascenso Ghibli",
                "numerals": ["vi", "VII", "I", "IVmaj7"],
                "degrees": [(5, "minor"), (6, "major"), (0, "major"), (3, "major7")],
                "description": "Desde vi menor, sube cromaticamente hasta la luminosidad del IVmaj7.",
                "usage": "Transiciones de tristeza a esperanza, amaneceres",
                "examples": [
                    {"title": "Ashitaka and San", "source": "Princess Mononoke"},
                ],
            },
            {
                "name": "Hisaishi Menor Epico",
                "numerals": ["i", "bVI", "bVII", "i"],
                "degrees": [(0, "minor"), (-3, "major"), (-2, "major"), (0, "minor")],
                "description": "Movimiento epico en menor con acordes prestados. Grandioso y dramatico.",
                "usage": "Temas de batalla, determinacion, momentos heroicos",
                "examples": [
                    {"title": "Ashitaka Sekki", "source": "Princess Mononoke"},
                    {"title": "Legend of Ashitaka", "source": "Princess Mononoke"},
                ],
            },
            {
                "name": "Deceptiva Soñadora",
                "numerals": ["IVmaj7", "V7", "vi", "Imaj7"],
                "degrees": [(3, "major7"), (4, "dominant7"), (5, "minor"), (0, "major7")],
                "description": "Royal Road simplificada: V resuelve a vi (deceptiva) y luego a Imaj7 (dulce).",
                "usage": "Momentos de reflexion, escenas de atardecer",
                "examples": [
                    {"title": "The Rain", "source": "Spirited Away"},
                ],
            },
        ],
    },
    "final_fantasy": {
        "label": "Final Fantasy / Nobuo Uematsu",
        "description": (
            "Uematsu mezcla rock progresivo, musica clasica romantica, y armonias modales. "
            "Usa mediantes cromaticas (movimiento por 3ras), progresiones menores epicas, "
            "modos Eolio/Dorico para temas heroicos, y modulaciones dramaticas. "
            "Los temas emocionales usan ii-V-I con extensiones y el acorde napolitano (bII)."
        ),
        "techniques": [
            "Mediantes cromaticas: saltos de 3ra mayor/menor (C-Ab, C-E, Am-F, Am-Db)",
            "Modo Eolio para temas heroicos oscuros",
            "Modo Dorico para temas de aventura (6ta mayor en contexto menor)",
            "Acorde Napolitano (bII) para drama y tension",
            "Progresiones ciclicas con ostinato en el bajo",
            "Modulaciones abruptas (subir medio tono o tono entero)",
            "Contrastes dinamicos extremos (piano subito → fortissimo)",
            "Armonias de 6ta aumentada (Italiana, Francesa, Alemana)",
        ],
        "progressions": [
            {
                "name": "Preludio FF (Arpeggio)",
                "numerals": ["I", "ii", "iii", "IV", "V", "vi", "V", "I"],
                "degrees": [(0, "major"), (1, "minor"), (2, "minor"), (3, "major"), (4, "major"), (5, "minor"), (4, "major"), (0, "major")],
                "description": "Subida diatonica completa. El famoso arpegio del preludio FF.",
                "usage": "Titulos, pantallas de inicio, momentos de esperanza",
                "examples": [
                    {"title": "Prelude", "source": "Final Fantasy (serie)"},
                ],
            },
            {
                "name": "Tema Heroico Menor",
                "numerals": ["i", "bVII", "bVI", "V"],
                "degrees": [(0, "minor"), (-2, "major"), (-3, "major"), (4, "major")],
                "description": "Eolio descendente con dominante al final. Heroismo oscuro y determinacion.",
                "usage": "Temas de batalla, confrontacion, heroismo",
                "examples": [
                    {"title": "Those Who Fight", "source": "Final Fantasy VII"},
                    {"title": "Battle Theme", "source": "Final Fantasy VI"},
                ],
            },
            {
                "name": "Aventura Dorica",
                "numerals": ["i", "IV", "bVII", "i"],
                "degrees": [(0, "minor"), (3, "major"), (-2, "major"), (0, "minor")],
                "description": "El IV mayor en contexto menor sugiere modo Dorico. Aventura con luz.",
                "usage": "Exploracion, mundo abierto, viaje",
                "examples": [
                    {"title": "Terra's Theme", "source": "Final Fantasy VI"},
                    {"title": "Main Theme", "source": "Final Fantasy"},
                ],
            },
            {
                "name": "Mediante Cromatica Epica",
                "numerals": ["i", "bVI", "bIII", "bVII"],
                "degrees": [(0, "minor"), (-3, "major"), (3, "major"), (-2, "major")],
                "description": "Movimiento por 3ras: cada acorde esta a distancia de 3ra. Grandioso e inesperado.",
                "usage": "Revelaciones, escenas epicas, momentos de asombro",
                "examples": [
                    {"title": "Liberi Fatali", "source": "Final Fantasy VIII"},
                ],
            },
            {
                "name": "Napolitano Dramatico",
                "numerals": ["i", "bII", "V", "i"],
                "degrees": [(0, "minor"), (-1, "major"), (4, "major"), (0, "minor")],
                "description": "El bII (Napolitano) crea tension extrema antes del V. Muy dramatico.",
                "usage": "Momentos de peligro, villanos, tension maxima",
                "examples": [
                    {"title": "One-Winged Angel", "source": "Final Fantasy VII"},
                    {"title": "Dancing Mad", "source": "Final Fantasy VI"},
                ],
            },
            {
                "name": "Emocional FF",
                "numerals": ["I", "vi", "ii7", "V7", "Imaj7"],
                "degrees": [(0, "major"), (5, "minor"), (1, "minor7"), (4, "dominant7"), (0, "major7")],
                "description": "Pop-jazz emotivo con ii-V-I. Los temas emocionales mas recordados de la saga.",
                "usage": "Temas de amor, despedidas, momentos emotivos",
                "examples": [
                    {"title": "Eyes On Me", "source": "Final Fantasy VIII"},
                    {"title": "Aerith's Theme", "source": "Final Fantasy VII"},
                    {"title": "Zanarkand", "source": "Final Fantasy X"},
                ],
            },
            {
                "name": "Boss Battle Cromatico",
                "numerals": ["i", "bii", "i", "V"],
                "degrees": [(0, "minor"), (-1, "minor"), (0, "minor"), (4, "major")],
                "description": "Cromatismo amenazante: el bii menor un semitono arriba crea tension extrema.",
                "usage": "Batallas de jefe, villanos, peligro inminente",
                "examples": [
                    {"title": "Battle on the Big Bridge", "source": "Final Fantasy V"},
                    {"title": "The Decisive Battle", "source": "Final Fantasy VI"},
                ],
            },
            {
                "name": "Cristal / Fantasia",
                "numerals": ["Imaj7", "bVImaj7", "IVmaj7", "bIImaj7"],
                "degrees": [(0, "major7"), (-3, "major7"), (3, "major7"), (-1, "major7")],
                "description": "Acordes maj7 a distancia cromatica. Onírico y magico como los cristales FF.",
                "usage": "Musica de cristales, magia, mundos fantasticos",
                "examples": [
                    {"title": "The Crystal Theme", "source": "Final Fantasy (serie)"},
                    {"title": "Prelude (version lenta)", "source": "Final Fantasy"},
                ],
            },
        ],
    },
    "cinematic": {
        "label": "Cinematico General / Banda Sonora",
        "description": (
            "Tecnicas compartidas por grandes compositores de cine (Williams, Zimmer, "
            "Morricone, Sakamoto). Incluye modulacion por mediantes, progresiones epicas, "
            "uso de modos y acordes extendidos para crear atmosferas."
        ),
        "techniques": [
            "Modulacion por mediantes cromaticas (3ras mayores/menores)",
            "Ostinato ritmico con armonia cambiante (estilo Zimmer)",
            "Escalas modales para cada emocion (Lidio=asombro, Dorico=aventura, Frigio=misterio)",
            "Acordes suspendidos (sus2, sus4) para ambiguedad",
            "Uso extensivo de pedal (tonica o dominante)",
            "Doble armonica y escalas exoticas para lo oriental/misterioso",
            "Contrapunto melodico (estilo Williams)",
            "Armonias de cluster para tension moderna (estilo Zimmer)",
        ],
        "progressions": [
            {
                "name": "Epica Cinematica",
                "numerals": ["i", "bVI", "bIII", "bVII", "i"],
                "degrees": [(0, "minor"), (-3, "major"), (3, "major"), (-2, "major"), (0, "minor")],
                "description": "Ciclo de mediantes en menor. El sonido 'epico de Hollywood'.",
                "usage": "Trailers, momentos heroicos, escenas de accion",
                "examples": [
                    {"title": "He's a Pirate", "source": "Pirates of the Caribbean"},
                    {"title": "Duel of the Fates", "source": "Star Wars"},
                ],
            },
            {
                "name": "Amanecer / Esperanza",
                "numerals": ["IV", "I", "V", "vi", "IV", "I"],
                "degrees": [(3, "major"), (0, "major"), (4, "major"), (5, "minor"), (3, "major"), (0, "major")],
                "description": "Comienza en subdominante (no en tonica). Sensacion de despertar gradual.",
                "usage": "Amaneceres, nuevos comienzos, momentos esperanzadores",
                "examples": [
                    {"title": "Now We Are Free", "source": "Gladiator"},
                ],
            },
            {
                "name": "Misterio Modal",
                "numerals": ["i", "bII", "bVII", "i"],
                "degrees": [(0, "minor"), (-1, "major"), (-2, "major"), (0, "minor")],
                "description": "Frigio con movimiento cromatico. Misterio y lo desconocido.",
                "usage": "Misterio, suspenso, exploración de lo desconocido",
                "examples": [
                    {"title": "Hedwig's Theme", "source": "Harry Potter"},
                ],
            },
            {
                "name": "Romance Cinematico",
                "numerals": ["Imaj7", "vi7", "ii7", "V7"],
                "degrees": [(0, "major7"), (5, "minor7"), (1, "minor7"), (4, "dominant7")],
                "description": "Jazz romantico con septimas. Elegante y sofisticado.",
                "usage": "Escenas romanticas, momentos intimos, nostalgia",
                "examples": [
                    {"title": "Cinema Paradiso", "source": "Cinema Paradiso"},
                    {"title": "Merry Christmas Mr. Lawrence", "source": "Merry Christmas Mr. Lawrence"},
                ],
            },
            {
                "name": "Tension Zimmer",
                "numerals": ["i", "i/bVII", "bVI", "V"],
                "degrees": [(0, "minor"), (-2, "minor"), (-3, "major"), (4, "major")],
                "description": "Bajo descendente sobre acorde menor. Tension acumulativa moderna.",
                "usage": "Suspenso, countdown, accion creciente",
                "examples": [
                    {"title": "Time", "source": "Inception"},
                    {"title": "Cornfield Chase", "source": "Interstellar"},
                ],
            },
            {
                "name": "Final Epico",
                "numerals": ["bVI", "bVII", "I"],
                "degrees": [(-3, "major"), (-2, "major"), (0, "major")],
                "description": "Resolucion epica: dos acordes prestados suben cromaticamente al I. Triunfo.",
                "usage": "Finales triunfantes, victorias, revelaciones gloriosas",
                "examples": [
                    {"title": "Binary Sunset", "source": "Star Wars"},
                    {"title": "Superman Theme", "source": "Superman"},
                ],
            },
        ],
    },
}


def _resolve_degree(degree, root_pc, scale, key):
    """Resolve a degree (positive = scale index, negative = special) to a chord root note."""
    if isinstance(degree, int):
        if 0 <= degree < len(scale):
            return scale[degree]
        elif degree == -1:  # bII
            return _spell((root_pc + 1) % 12, key)
        elif degree == -2:  # bVII
            return _spell((root_pc + 10) % 12, key)
        elif degree == -3:  # bVI
            return _spell((root_pc + 8) % 12, key)
        elif degree == -4:  # bIII (in minor context this is diatonic, in major it's borrowed)
            return _spell((root_pc + 3) % 12, key)
        else:
            return _spell((root_pc + degree) % 12, key)
    return _spell(root_pc, key)


def get_cinematic_progressions(key: str, style: str = None) -> dict:
    """
    Get cinematic chord progressions realized in the given key.
    style: 'ghibli', 'final_fantasy', 'cinematic', or None for all.
    """
    root_pc = note_to_pc(key)
    scale = generate_scale(key, "major")
    minor_scale = generate_scale(key, "natural_minor")

    styles_to_process = {}
    if style and style in CINEMATIC_PROGRESSIONS:
        styles_to_process[style] = CINEMATIC_PROGRESSIONS[style]
    else:
        styles_to_process = CINEMATIC_PROGRESSIONS

    result = {}
    for style_key, style_data in styles_to_process.items():
        realized_progs = []
        for prog in style_data["progressions"]:
            chords_info = []
            for degree, quality in prog["degrees"]:
                # Determine if we should use major or minor scale context
                is_minor_context = any(
                    n in prog["numerals"] for n in ["i", "bVI", "bVII", "bIII", "bII"]
                )

                if degree >= 0 and degree < 7:
                    if is_minor_context and degree < len(minor_scale):
                        chord_root = minor_scale[degree]
                    else:
                        chord_root = scale[degree] if degree < len(scale) else _spell((root_pc + degree) % 12, key)
                else:
                    chord_root = _resolve_degree(degree, root_pc, scale, key)

                chord = build_chord(chord_root, quality)
                chords_info.append({
                    "symbol": chord["symbol"],
                    "notes": chord["notes"],
                    "root": chord_root,
                    "quality": quality,
                })

            realized_progs.append({
                "name": prog["name"],
                "numerals": prog["numerals"],
                "description": prog["description"],
                "usage": prog["usage"],
                "examples": prog.get("examples", []),
                "chords": chords_info,
            })

        result[style_key] = {
            "label": style_data["label"],
            "description": style_data["description"],
            "techniques": style_data["techniques"],
            "progressions": realized_progs,
        }

    return {
        "key": key,
        "styles": result,
    }


# ──────────────────────────────────────────────
# Chord-Scale Relationships for Improvisation
# ──────────────────────────────────────────────

# Maps chord quality to recommended scales, guide tones, tensions, avoid notes
CHORD_SCALE_MAP = {
    "major": {
        "scales": [
            {"name": "Jonica (Mayor)", "type": "major", "context": "Acorde I en tonalidad mayor. Sonido estable y brillante."},
            {"name": "Lidia", "type": "lydian", "context": "Alternativa al Jonico. El #4 agrega brillo y flotacion (sonido Ghibli/cinematico)."},
        ],
        "guide_tones": [0, 4, 7],  # root, 3rd, 5th (semitones from root)
        "tensions": [
            {"interval": 2, "name": "9", "effect": "Color. Muy usado en voicings cinematicos."},
            {"interval": 6, "name": "#11", "effect": "Tension Lidia. Sonido soñador, flotante (Hisaishi)."},
            {"interval": 9, "name": "13", "effect": "Dulzura. Expande el acorde con calidez."},
        ],
        "avoid": [
            {"interval": 5, "name": "4 (11)", "reason": "Choca con la 3ra mayor. Usar #11 en su lugar."},
        ],
    },
    "minor": {
        "scales": [
            {"name": "Eolica (Menor natural)", "type": "natural_minor", "context": "Sonido menor estandar. Melancólico."},
            {"name": "Dorica", "type": "dorian", "context": "Menor con 6ta mayor. Aventura y movimiento (temas de viaje FF)."},
            {"name": "Frigia", "type": "phrygian", "context": "Menor con b2. Misterio, tension, exotismo."},
        ],
        "guide_tones": [0, 3, 7],
        "tensions": [
            {"interval": 2, "name": "9", "effect": "Color menor suave."},
            {"interval": 9, "name": "13 (dorica)", "effect": "La 6ta mayor que define el modo Dorico. Calidez en lo oscuro."},
            {"interval": 5, "name": "11", "effect": "Tension natural. Muy expresiva en contexto menor."},
        ],
        "avoid": [],
    },
    "major7": {
        "scales": [
            {"name": "Jonica", "type": "major", "context": "Sobre Imaj7. Sonido calmado y resolutivo."},
            {"name": "Lidia", "type": "lydian", "context": "Sobre IVmaj7 (y cualquier maj7). El sonido 'Ghibli' por excelencia."},
        ],
        "guide_tones": [0, 4, 7, 11],
        "tensions": [
            {"interval": 2, "name": "9", "effect": "Esencial para voicings de jazz y cinematico."},
            {"interval": 6, "name": "#11", "effect": "La tension Lidia. Clave para sonido Hisaishi/cinematico."},
            {"interval": 9, "name": "13", "effect": "Expande la armonia con calidez."},
        ],
        "avoid": [
            {"interval": 5, "name": "4 (11)", "reason": "Choca con la 3ra. Preferir #11."},
        ],
    },
    "minor7": {
        "scales": [
            {"name": "Dorica", "type": "dorian", "context": "Sobre ii7 (mas comun). Suave y con movimiento."},
            {"name": "Eolica", "type": "natural_minor", "context": "Sobre vi7 o iii7. Mas oscuro y melancolico."},
            {"name": "Frigia", "type": "phrygian", "context": "Sobre iii7 en mayor. Exotico y misterioso."},
        ],
        "guide_tones": [0, 3, 7, 10],
        "tensions": [
            {"interval": 2, "name": "9", "effect": "Color esencial. Muy usado en ii7-V7-I."},
            {"interval": 5, "name": "11", "effect": "Tension natural. Expresiva y segura."},
            {"interval": 9, "name": "13 (dorica)", "effect": "Define el color Dorico. Aventura."},
        ],
        "avoid": [],
    },
    "dominant7": {
        "scales": [
            {"name": "Mixolidia", "type": "mixolydian", "context": "Sobre V7 diatonico. El sonido dominante clasico."},
            {"name": "Lidia b7 (Lidia Dominante)", "type": "lydian", "context": "Sobre V7 con #11. Sofisticado, moderno. Escala del 4to grado de melodica menor.", "modified": True},
            {"name": "Alterada", "type": "melodic_minor", "context": "Sobre V7alt. Maxima tension antes de resolver a I. Escala del 7mo grado de melodica menor.", "modified": True},
            {"name": "Disminuida (HW)", "type": "double_harmonic", "context": "Sobre V7b9. Tension simetrica. Util en dominantes secundarios.", "modified": True},
        ],
        "guide_tones": [0, 4, 7, 10],
        "tensions": [
            {"interval": 2, "name": "9", "effect": "Tension natural. Suaviza el dominante."},
            {"interval": 1, "name": "b9", "effect": "Tension fuerte. Urgencia, drama (Uematsu, Williams)."},
            {"interval": 3, "name": "#9", "effect": "Tension blues/jazz. Color hendrix."},
            {"interval": 6, "name": "#11", "effect": "Lidia dominante. Sofisticado y flotante."},
            {"interval": 8, "name": "b13", "effect": "Tension alterada. Muy expresivo."},
            {"interval": 9, "name": "13", "effect": "Color natural. Menos tenso."},
        ],
        "avoid": [],
    },
    "diminished": {
        "scales": [
            {"name": "Disminuida (tono-semitono)", "type": "whole_tone", "context": "Sobre acordes disminuidos. Patron simetrico tono-semitono."},
        ],
        "guide_tones": [0, 3, 6],
        "tensions": [
            {"interval": 1, "name": "b9 (como nota de paso)", "effect": "Cromatismo."},
            {"interval": 9, "name": "bb7 (6ta mayor)", "effect": "Colorea el acorde disminuido."},
        ],
        "avoid": [],
    },
    "augmented": {
        "scales": [
            {"name": "Tono entero", "type": "whole_tone", "context": "Sobre acordes aumentados. Sonido flotante, onírico (Debussy)."},
        ],
        "guide_tones": [0, 4, 8],
        "tensions": [
            {"interval": 2, "name": "9", "effect": "Color natural."},
        ],
        "avoid": [],
    },
    "half_diminished7": {
        "scales": [
            {"name": "Locria", "type": "locrian", "context": "Sobre viiø7 diatonico. Inestable por naturaleza."},
            {"name": "Locria #2", "type": "melodic_minor", "context": "Sobre iiø7 en menor. Locria con 2da mayor: menos aspera.", "modified": True},
        ],
        "guide_tones": [0, 3, 6, 10],
        "tensions": [
            {"interval": 5, "name": "11", "effect": "Tension natural. Segura."},
            {"interval": 1, "name": "b9 (locria)", "effect": "Aspera pero caracteristica."},
            {"interval": 2, "name": "9 (locria #2)", "effect": "Mas suave. Preferida en jazz."},
        ],
        "avoid": [],
    },
    "sus4": {
        "scales": [
            {"name": "Mixolidia", "type": "mixolydian", "context": "Sobre Vsus4. Ambiguedad mayor/menor."},
            {"name": "Dorica", "type": "dorian", "context": "Sobre iisus4. Color menor suave."},
        ],
        "guide_tones": [0, 5, 7],
        "tensions": [
            {"interval": 2, "name": "9", "effect": "Muy compatible. Agrega color sin definir mayor/menor."},
            {"interval": 10, "name": "b7", "effect": "Convierte en 7sus4. Tension suspendida."},
        ],
        "avoid": [
            {"interval": 4, "name": "3", "reason": "Destruye la suspension. Reservar para la resolucion."},
        ],
    },
    "sus2": {
        "scales": [
            {"name": "Mayor", "type": "major", "context": "Sonido abierto y luminoso."},
        ],
        "guide_tones": [0, 2, 7],
        "tensions": [
            {"interval": 5, "name": "4/11", "effect": "Compatible. Agrega profundidad."},
            {"interval": 9, "name": "6/13", "effect": "Dulzura pentatonica."},
        ],
        "avoid": [
            {"interval": 3, "name": "b3 o 3", "reason": "Define mayor/menor, destruye la suspension."},
        ],
    },
}


def get_improvisation_guide(key: str, mode: str = "major") -> dict:
    """
    Get a complete improvisation guide for a key.
    For each diatonic chord, returns recommended scales, guide tones,
    available tensions, and avoid notes.
    """
    root_pc = note_to_pc(key)

    if mode in ("natural_minor", "harmonic_minor"):
        from .tonality import get_diatonic_chords_minor
        diatonic = get_diatonic_chords_minor(key, mode)
    else:
        diatonic = get_diatonic_chords(key)

    diatonic7 = get_diatonic_seventh_chords(key) if mode == "major" else []

    guide = []
    for i, chord_info in enumerate(diatonic):
        symbol = chord_info["symbol"]
        numeral = chord_info["numeral"]
        function = chord_info["function"]

        # Determine chord quality for scale lookup
        # Parse quality from symbol
        root = chord_info["notes"][0]
        chord_root_pc = note_to_pc(root)

        # Find the matching chord quality
        quality = _detect_quality_from_notes(chord_info["notes"])

        # Get improv data for this quality
        improv_data = CHORD_SCALE_MAP.get(quality, CHORD_SCALE_MAP.get("major", {}))

        # Realize guide tones as actual notes
        guide_tone_notes = []
        for st in improv_data.get("guide_tones", []):
            pc = (chord_root_pc + st) % 12
            guide_tone_notes.append(_spell(pc, key))

        # Realize tensions as actual notes
        tension_notes = []
        for t in improv_data.get("tensions", []):
            pc = (chord_root_pc + t["interval"]) % 12
            tension_notes.append({
                "note": _spell(pc, key),
                "name": t["name"],
                "effect": t["effect"],
            })

        # Realize avoid notes
        avoid_notes = []
        for a in improv_data.get("avoid", []):
            pc = (chord_root_pc + a["interval"]) % 12
            avoid_notes.append({
                "note": _spell(pc, key),
                "name": a["name"],
                "reason": a["reason"],
            })

        # Generate recommended scales with actual notes
        recommended_scales = []
        for sc in improv_data.get("scales", []):
            try:
                scale_notes = generate_scale(root, sc["type"])
                recommended_scales.append({
                    "name": sc["name"],
                    "type": sc["type"],
                    "notes": scale_notes,
                    "context": sc["context"],
                })
            except (ValueError, KeyError):
                recommended_scales.append({
                    "name": sc["name"],
                    "type": sc["type"],
                    "notes": [],
                    "context": sc["context"],
                })

        # Get the seventh chord version if available
        seventh_symbol = None
        if i < len(diatonic7):
            seventh_symbol = diatonic7[i]["symbol"]

        guide.append({
            "chord": symbol,
            "seventh": seventh_symbol,
            "numeral": numeral,
            "function": function,
            "root": root,
            "quality": quality,
            "guide_tones": guide_tone_notes,
            "recommended_scales": recommended_scales,
            "tensions": tension_notes,
            "avoid_notes": avoid_notes,
        })

    # Add general improvisation tips for the style
    tips = _get_improv_tips(mode)

    return {
        "key": key,
        "mode": mode,
        "chords": guide,
        "general_tips": tips,
    }


def _detect_quality_from_notes(note_list: list[str]) -> str:
    """Detect chord quality from note list for scale mapping."""
    if len(note_list) < 3:
        return "major"

    root_pc = note_to_pc(note_list[0])
    intervals = sorted(set((note_to_pc(n) - root_pc) % 12 for n in note_list))

    # Check known patterns
    for quality, pattern in CHORD_TYPES.items():
        pattern_set = set(i % 12 for i in pattern)
        if set(intervals) == pattern_set:
            return quality

    # Fallback: check if minor or major based on 3rd
    if 3 in intervals:
        if 10 in intervals:
            return "minor7"
        return "minor"
    if 4 in intervals:
        if 11 in intervals:
            return "major7"
        if 10 in intervals:
            return "dominant7"
        return "major"

    return "major"


def _get_improv_tips(mode: str) -> list[dict]:
    """General improvisation tips."""
    return [
        {
            "title": "Notas guia (Guide Tones)",
            "tip": (
                "La 3ra y 7ma de cada acorde son las notas que definen su caracter. "
                "Al improvisar, busca resolver HACIA estas notas. "
                "El movimiento de la 7ma de un acorde a la 3ra del siguiente "
                "crea lineas melodicas naturales y conectadas."
            ),
        },
        {
            "title": "Aproximacion cromatica",
            "tip": (
                "Llega a las notas guia desde un semitono arriba o abajo. "
                "Ejemplo: para llegar a la 3ra de Cmaj7 (E), toca Eb→E o F→E. "
                "Esto crea tension-resolucion a nivel melodico."
            ),
        },
        {
            "title": "Enclosure (Encerramiento)",
            "tip": (
                "Rodea la nota objetivo: toca la nota UN semitono arriba, "
                "luego UN semitono abajo, luego la nota objetivo. "
                "Ej: para llegar a E: F→Eb→E. Tecnica de bebop muy efectiva."
            ),
        },
        {
            "title": "Pentatonica como base segura",
            "tip": (
                "La pentatonica mayor/menor de la tonalidad siempre suena bien. "
                "Usala como 'base segura' y agrega cromatismos y tensiones desde ahi. "
                "Hisaishi usa muchas melodias pentatonicas sobre armonias complejas."
            ),
        },
        {
            "title": "Desarrollo motivico",
            "tip": (
                "Toma un motivo corto (3-5 notas) y transformalo: "
                "transpone, invierte, aumenta/disminuye ritmo, cambia una nota. "
                "La repeticion con variacion es la base de la composicion "
                "(Beethoven, Uematsu, Williams, Hisaishi)."
            ),
        },
        {
            "title": "Respira y deja espacio",
            "tip": (
                "Los silencios son tan importantes como las notas. "
                "Hisaishi y Uematsu dejan que las melodias respiren. "
                "Una nota larga bien colocada vale mas que 20 notas rapidas."
            ),
        },
        {
            "title": "Canta lo que tocas",
            "tip": (
                "Si puedes cantarlo, puedes tocarlo con mas intencion. "
                "La voz interna guia la improvisacion musical. "
                "Intenta cantar una melodia primero, luego tocala."
            ),
        },
        {
            "title": "Estilo Hisaishi: Melodia sobre Lidio",
            "tip": (
                "Para el sonido Ghibli: toca la escala Lidia (mayor con #4) "
                "sobre acordes maj7. Enfatiza el #4 como nota de paso o apoyo. "
                "Usa intervalos de 4ta y 5ta en la melodia para amplitud."
            ),
        },
        {
            "title": "Estilo Uematsu: Modal + Cromatismo",
            "tip": (
                "Para el sonido FF: alterna entre modo Eolio y Dorico. "
                "Usa la 6ta mayor (Dorico) para momentos heroicos "
                "y la 6ta menor (Eolio) para momentos oscuros. "
                "Agrega cromatismos para drama (semitonos descendentes)."
            ),
        },
    ]


def get_chord_improvisation(chord_root: str, chord_type: str) -> dict:
    """
    Get detailed improvisation guide for a specific chord.
    Returns scales, guide tones, tensions, avoid notes, and tips.
    """
    root_pc = note_to_pc(chord_root)
    key = chord_root  # Use chord root as reference key for spelling

    # Map chord type to scale lookup key
    scale_key = chord_type
    if chord_type in ("major", "minor", "major7", "minor7", "dominant7",
                      "diminished", "augmented", "half_diminished7",
                      "sus4", "sus2"):
        scale_key = chord_type
    elif chord_type in ("diminished7",):
        scale_key = "diminished"
    elif chord_type in ("minor_major7",):
        scale_key = "minor"
    elif chord_type in ("augmented_major7", "augmented7"):
        scale_key = "augmented"
    elif chord_type in ("major9", "major11", "major13"):
        scale_key = "major7"
    elif chord_type in ("minor9", "minor11", "minor13"):
        scale_key = "minor7"
    elif chord_type in ("dominant9", "dominant11", "dominant13"):
        scale_key = "dominant7"
    elif chord_type in ("7sus4", "7sus2"):
        scale_key = "sus4"
    elif chord_type in ("add2", "add4", "add9", "6"):
        scale_key = "major"
    elif chord_type in ("minor6",):
        scale_key = "minor"
    else:
        scale_key = "major"

    improv_data = CHORD_SCALE_MAP.get(scale_key, CHORD_SCALE_MAP["major"])

    chord = build_chord(chord_root, chord_type)

    # Realize guide tones
    guide_tone_notes = []
    for st in improv_data.get("guide_tones", []):
        pc = (root_pc + st) % 12
        guide_tone_notes.append({
            "note": _spell(pc, key),
            "interval_semitones": st,
        })

    # Realize tensions
    tension_notes = []
    for t in improv_data.get("tensions", []):
        pc = (root_pc + t["interval"]) % 12
        tension_notes.append({
            "note": _spell(pc, key),
            "name": t["name"],
            "effect": t["effect"],
            "interval_semitones": t["interval"],
        })

    # Realize avoid notes
    avoid_notes = []
    for a in improv_data.get("avoid", []):
        pc = (root_pc + a["interval"]) % 12
        avoid_notes.append({
            "note": _spell(pc, key),
            "name": a["name"],
            "reason": a["reason"],
        })

    # Generate recommended scales
    recommended_scales = []
    for sc in improv_data.get("scales", []):
        try:
            scale_notes = generate_scale(chord_root, sc["type"])
            recommended_scales.append({
                "name": sc["name"],
                "type": sc["type"],
                "notes": scale_notes,
                "context": sc["context"],
            })
        except (ValueError, KeyError):
            recommended_scales.append({
                "name": sc["name"],
                "type": sc["type"],
                "notes": [],
                "context": sc["context"],
            })

    return {
        "chord": chord,
        "quality_group": scale_key,
        "guide_tones": guide_tone_notes,
        "recommended_scales": recommended_scales,
        "tensions": tension_notes,
        "avoid_notes": avoid_notes,
    }


# ──────────────────────────────────────────────
# Chromatic Mediants
# ──────────────────────────────────────────────

def get_chromatic_mediants(key: str) -> dict:
    """
    Get all chromatic mediant relationships for a key.
    Chromatic mediants are chords whose roots are a major or minor 3rd apart
    and share at least one common tone. Used extensively in cinematic music
    (Williams, Uematsu, Hisaishi).
    """
    root_pc = note_to_pc(key)
    scale = generate_scale(key, "major")

    tonic = build_chord(key, "major")
    tonic_pcs = set(note_to_pc(n) for n in tonic["notes"])

    mediants = []
    mediant_intervals = [
        (3, "minor 3rd abajo", "Mediante inferior menor"),
        (4, "major 3rd abajo", "Mediante inferior mayor"),
        (8, "minor 3rd arriba", "Mediante superior menor"),
        (9, "major 3rd arriba", "Mediante superior mayor"),
    ]

    for semitones, direction, label in mediant_intervals:
        for quality in ("major", "minor"):
            med_pc = (root_pc + semitones) % 12
            # Use flat spelling for chromatic mediants (conventional)
            med_root = CHROMATIC_FLATS[med_pc]
            med_chord = build_chord(med_root, quality)
            med_pcs = set(note_to_pc(n) for n in med_chord["notes"])

            common = tonic_pcs & med_pcs
            common_notes = [_spell(pc, key) for pc in common]

            # Only include if at least one common tone
            if len(common) >= 1:
                mediants.append({
                    "from_chord": tonic["symbol"],
                    "to_chord": med_chord["symbol"],
                    "root": med_root,
                    "quality": quality,
                    "direction": direction,
                    "label": label,
                    "common_tones": common_notes,
                    "common_count": len(common),
                    "effect": _mediant_effect(semitones, quality),
                })

    return {
        "key": key,
        "tonic": tonic["symbol"],
        "mediants": mediants,
        "explanation": (
            "Las mediantes cromaticas son acordes cuya raiz esta a distancia de 3ra "
            "mayor o menor de la tonica. Crean cambios de color dramaticos manteniendo "
            "notas comunes, lo que permite transiciones suaves pero sorprendentes. "
            "Son fundamentales en la musica cinematica (Williams, Uematsu, Hisaishi)."
        ),
    }


def _mediant_effect(semitones: int, quality: str) -> str:
    """Describe the emotional effect of a chromatic mediant."""
    effects = {
        (3, "major"): "Oscurecimiento dramatico. Muy usado en musica de cine para giros oscuros.",
        (3, "minor"): "Cambio sutil a menor. Nostalgico y melancolico.",
        (4, "major"): "Descenso brillante. Grandioso y epico (estilo Williams/Uematsu).",
        (4, "minor"): "Descenso oscuro. Misterioso y tenso.",
        (8, "major"): "Ascenso brillante. Esperanzador y luminoso.",
        (8, "minor"): "Ascenso agridulce. Emotivo con un toque de tristeza.",
        (9, "major"): "Ascenso grandioso. Triunfal y epico (estilo Uematsu).",
        (9, "minor"): "Ascenso con sombra. Heroismo con costo.",
    }
    return effects.get((semitones, quality), "Cambio de color armonico.")


# ──────────────────────────────────────────────
# Composition Guide by Style
# ──────────────────────────────────────────────

COMPOSITION_GUIDES = {
    "ghibli": {
        "title": "Composicion estilo Studio Ghibli / Hisaishi",
        "overview": (
            "Joe Hisaishi crea musica que evoca asombro infantil, nostalgia y naturaleza. "
            "Su estilo combina melodias pentatonicas simples con armonias complejas de jazz/clasico, "
            "usando el modo Lidio como su herramienta principal de color."
        ),
        "harmonic_palette": [
            "Imaj7, IVmaj7, vi7, ii7 (base de septimas mayor/menor)",
            "II mayor (Lidio, no diatonico) para sensacion de vuelo",
            "iv menor (intercambio modal) para momentos agridulces",
            "bVI y bVII (prestados del menor) para drama suave",
            "Cadencia plagal (IV-I o iv-I) en vez de V-I para suavidad",
        ],
        "melody_tips": [
            "Melodias pentatonicas (5 notas) como base: la, do, re, mi, sol",
            "Intervalos de 4ta y 5ta justa para amplitud y espacio abierto",
            "Movimiento por grado conjunto (notas vecinas) para pasajes liricos",
            "Repeticion del motivo principal con pequeñas variaciones",
            "Dejar que las notas largas respiren - el silencio es expresivo",
            "La melodia debe poder cantarse: si la cantas, funciona",
        ],
        "rhythm_tips": [
            "Valses (3/4) para escenas magicas y de vuelo",
            "Compas de 4/4 con subdivison de corcheas para temas principales",
            "Rubato (libertad ritmica) en pasajes emotivos",
            "Acompañamiento de arpegio en la mano izquierda (patron Alberti)",
        ],
        "voicing_tips": [
            "Usar acordes abiertos (notas separadas por octava) para amplitud",
            "Doblar la melodia a la octava para momentos climáticos",
            "Arpegio lento en la mano izquierda, melodia en la derecha",
            "Pedal de tonica (nota grave sostenida) mientras la armonia se mueve",
        ],
        "form_structure": [
            "Intro con motivo simple (4-8 compases)",
            "Tema A: melodia principal, tonalidad mayor",
            "Tema B: desarrollo, quizas modulacion a relativa menor",
            "Vuelta al Tema A con variacion o instrumentacion diferente",
            "Coda: motivo del intro, desvanecer (fade) o cadencia plagal",
        ],
        "reference_pieces": [
            {"title": "Merry-Go-Round of Life", "source": "Howl's Moving Castle", "lesson": "Waltz con Royal Road y cromatismos"},
            {"title": "One Summer's Day", "source": "Spirited Away", "lesson": "Melodia pentatonica sobre armonia de septimas"},
            {"title": "Path of the Wind", "source": "My Neighbor Totoro", "lesson": "Color Lidio y simpleza melodica"},
            {"title": "Ashitaka and San", "source": "Princess Mononoke", "lesson": "Contraste mayor/menor, climax epico"},
            {"title": "Summer", "source": "Kikujiro", "lesson": "Minimalismo melodico, IV-iv-I"},
            {"title": "A Town with an Ocean View", "source": "Kiki's Delivery Service", "lesson": "Waltz brillante con voicings abiertos"},
        ],
    },
    "final_fantasy": {
        "title": "Composicion estilo Final Fantasy / Uematsu",
        "overview": (
            "Nobuo Uematsu fusiona rock progresivo, musica clasica romantica, y melodias pop japonesas. "
            "Sus temas de batalla son modales y energicos; sus temas emocionales son "
            "baladas con ii-V-I y extensiones de jazz. Usa modulaciones dramaticas "
            "y mediantes cromaticas para crear momentos epicos."
        ),
        "harmonic_palette": [
            "Menor natural (Eolio) para temas heroicos oscuros",
            "Dorico (menor con 6ta mayor) para aventura y exploracion",
            "bVI, bVII, bIII (mediantes cromaticas) para momentos epicos",
            "bII (Napolitano) para drama y tension extrema",
            "ii7-V7-Imaj7 con extensiones (9, 13) para temas emocionales",
            "Ostinato en el bajo con armonia cambiante arriba",
            "Modulacion subita (subir medio tono) para climax",
        ],
        "melody_tips": [
            "Frases de 4 compases con antecedente-consecuente",
            "Arpegio del acorde como base melodica (Preludio FF)",
            "Saltos de 4ta y 5ta para heroismo",
            "Cromatismo descendente para villanos y tension",
            "Melodias modales: usar las notas caracteristicas del modo",
            "En Dorico, enfatizar la 6ta mayor",
            "En Eolio, enfatizar la b6 y b7 para oscuridad",
        ],
        "rhythm_tips": [
            "4/4 con corcheas constantes para temas de batalla",
            "6/8 para temas epicos y marciales",
            "Balada en 4/4 lento para temas emocionales",
            "Ostinato ritmico (patron repetido) en temas de tension",
            "Cambios de compas para sorpresa dramatica",
        ],
        "voicing_tips": [
            "Acordes en bloque para poder orquestal",
            "Octavas en el bajo para fundamento",
            "Acordes de 5ta (power chords) para momentos de rock",
            "Arpegios rapidos para la textura de cristal FF",
            "Contrapunto: dos melodias simultaneas",
        ],
        "form_structure": [
            "Intro atmosferico o motivo repetido",
            "Tema A: establecer el caracter (heroico, emotivo, misterioso)",
            "Tema B: contraste (cambio de modo, tempo, o textura)",
            "Desarrollo: variaciones, modulaciones, climax",
            "Recapitulacion: vuelta al Tema A, quizas en tonalidad diferente",
            "Coda: resolucion o transicion (en juegos, loop back al inicio)",
        ],
        "reference_pieces": [
            {"title": "Zanarkand (To Zanarkand)", "source": "Final Fantasy X", "lesson": "Balada con arpegio, ii-V-I emocional"},
            {"title": "Aerith's Theme", "source": "Final Fantasy VII", "lesson": "Melodia simple sobre armonia rica, cadencia deceptiva"},
            {"title": "Terra's Theme", "source": "Final Fantasy VI", "lesson": "Dorico heroico, modulacion dramatica"},
            {"title": "One-Winged Angel", "source": "Final Fantasy VII", "lesson": "Menor cromatico, ostinato, orquestacion masiva"},
            {"title": "Eyes On Me", "source": "Final Fantasy VIII", "lesson": "Balada pop con ii-V-I y tensiones de jazz"},
            {"title": "Prelude", "source": "Final Fantasy (serie)", "lesson": "Arpegio diatonico ascendente/descendente"},
        ],
    },
    "cinematic": {
        "title": "Composicion Cinematica General",
        "overview": (
            "La musica de cine combina tecnicas de multiples tradiciones: "
            "orquestacion clasica, armonias de jazz, minimalismo, y electronica. "
            "El objetivo es servir a la narrativa visual con emocion y atmosfera."
        ),
        "harmonic_palette": [
            "Mediantes cromaticas (movimiento por 3ras) para cambios de escena",
            "Modos para emociones especificas: Lidio=asombro, Dorico=aventura, Frigio=misterio",
            "Acordes suspendidos (sus2, sus4) para ambiguedad",
            "Pedal de tonica o dominante para tension sostenida",
            "Cadena de dominantes para urgencia acumulativa",
            "Intercambio modal (bVI, bVII, iv) para drama",
            "Cluster chords (notas cercanas) para tension moderna",
        ],
        "melody_tips": [
            "Motivo corto y memorable (3-5 notas) como leitmotif",
            "Intervalos grandes (6ta, 7ma, 8va) para drama y emocion",
            "Melodia por grado conjunto para intimidad",
            "Repeticion del leitmotif en diferentes contextos armonicos",
            "Transformar el motivo: mayor→menor, rapido→lento, etc.",
        ],
        "rhythm_tips": [
            "Ostinato ritmico para tension (estilo Zimmer)",
            "Pulso lento con subdivisiones para momentum",
            "Rubato para emocion y libertad",
            "Sincopa para energia y movimiento",
            "Silencio dramatico antes de climax",
        ],
        "voicing_tips": [
            "Voicings abiertos para amplitud orquestal",
            "Doblajes a la octava para potencia",
            "Armonicos naturales y sobretonos para textura",
            "Cuartas apiladas (quartal harmony) para sonido moderno",
            "Acordes con pedal (una nota comun mantenida)",
        ],
        "form_structure": [
            "Adaptar la forma a la escena: no imponer estructura rigida",
            "Leitmotif recurrente para unidad",
            "Crescendo gradual para acumulacion",
            "Contraste subito para sorpresa",
            "Codetta o tag para cierre natural",
        ],
        "reference_pieces": [
            {"title": "Time", "source": "Inception (Zimmer)", "lesson": "Ostinato con crescendo, armonia minima pero efectiva"},
            {"title": "Hedwig's Theme", "source": "Harry Potter (Williams)", "lesson": "Leitmotif, modo menor, mediantes cromaticas"},
            {"title": "Binary Sunset", "source": "Star Wars (Williams)", "lesson": "bVI-bVII-I resolucion epica"},
            {"title": "Cinema Paradiso", "source": "Cinema Paradiso (Morricone)", "lesson": "Melodia simple, armonia de septimas"},
            {"title": "Merry Christmas Mr. Lawrence", "source": "(Sakamoto)", "lesson": "Minimalismo armonico, emocion con poco"},
            {"title": "Cornfield Chase", "source": "Interstellar (Zimmer)", "lesson": "Ostinato con variacion armonica gradual"},
        ],
    },
}


def get_composition_guide(style: str = None) -> dict:
    """
    Get a composition guide for a specific style.
    style: 'ghibli', 'final_fantasy', 'cinematic', or None for all.
    """
    if style and style in COMPOSITION_GUIDES:
        return {
            "style": style,
            "guide": COMPOSITION_GUIDES[style],
        }

    return {
        "style": "all",
        "guides": COMPOSITION_GUIDES,
    }
