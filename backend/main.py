"""
Music Theory API - FastAPI application.
Serves the API endpoints and static frontend files.
"""

import os
import uuid
from pathlib import Path
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from .theory import notes, intervals, scales, chords, tonality, circle_of_fifths, harmony
from .theory import advanced_harmony
from .theory import cinematic_harmony
from . import audio_analyzer
from . import stem_separator
from . import midi_generator

app = FastAPI(
    title="MusiHacks - Music Theory API",
    description="A comprehensive music theory engine with interactive piano",
    version="2.0.0",
)

# --- Pydantic models for request bodies ---

class DetectChordRequest(BaseModel):
    notes: list[int]  # MIDI note numbers

class DetectKeyRequest(BaseModel):
    notes: list[int]  # MIDI note numbers or pitch classes

class HarmonySuggestRequest(BaseModel):
    key: str
    chords: list[str] | None = None

class MelodySuggestRequest(BaseModel):
    notes: list[int]  # MIDI note numbers

class ChopinBassRequest(BaseModel):
    root: str
    chord_type: str = "major"

class TritoneSubRequest(BaseModel):
    root: str
    chord_type: str = "dominant7"

class SuggestionsRequest(BaseModel):
    key: str
    mode: str = "major"
    current_chord_root: str | None = None
    current_chord_type: str | None = None

class EnrichRequest(BaseModel):
    key: str
    chords: list[str]

class BuilderSuggestRequest(BaseModel):
    key: str
    mode: str = "major"
    chords: list[str] = []

class ChordImprovRequest(BaseModel):
    root: str
    chord_type: str = "major"

class ChordifyRequest(BaseModel):
    url: str

class MidiAccompRequest(BaseModel):
    pattern: str = "block"


# --- API Endpoints ---

@app.get("/api/notes")
def api_all_notes():
    """Get all 12 chromatic notes."""
    return notes.all_notes()


@app.get("/api/intervals")
def api_all_intervals():
    """Get all intervals within an octave."""
    return intervals.all_intervals()


@app.get("/api/scales")
def api_scale_types():
    """Get all available scale types."""
    return scales.available_scales()


@app.get("/api/scales/{root}/{scale_type}")
def api_get_scale(root: str, scale_type: str):
    """Get notes of a scale."""
    try:
        return scales.get_scale_info(root, scale_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/chords/types")
def api_chord_types():
    """Get all available chord types."""
    return chords.available_chord_types()


@app.get("/api/chords/{root}/all")
def api_all_chords_for_root(root: str):
    """Get all possible chords for a root note, grouped by category."""
    CATEGORIES = {
        "triad": ["major", "minor", "augmented", "diminished", "sus2", "sus4"],
        "seventh": [
            "major7", "minor7", "dominant7", "diminished7",
            "half_diminished7", "minor_major7", "augmented_major7", "augmented7",
        ],
        "added": ["add2", "add4", "add9", "6", "minor6"],
        "extended": [
            "major9", "minor9", "dominant9",
            "major11", "minor11", "dominant11",
            "major13", "minor13", "dominant13",
        ],
        "sus": ["7sus4", "7sus2"],
    }
    try:
        result = []
        for category, types in CATEGORIES.items():
            for ct in types:
                chord_data = chords.build_chord(root, ct)
                chord_data["category"] = category
                result.append(chord_data)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/chords/{root}/{chord_type}")
def api_get_chord(root: str, chord_type: str, inversion: int = 0):
    """Get notes of a chord, optionally in a specific inversion."""
    try:
        if inversion > 0:
            return chords.get_inversion(root, chord_type, inversion)
        return chords.build_chord(root, chord_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/chords/{root}/{chord_type}/midi")
def api_get_chord_midi(root: str, chord_type: str, octave: int = 4):
    """Get MIDI note numbers for a chord."""
    try:
        midi_notes = chords.get_chord_midi(root, chord_type, octave)
        chord_info = chords.build_chord(root, chord_type)
        return {**chord_info, "midi_notes": midi_notes, "octave": octave}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/chords/detect")
def api_detect_chord(req: DetectChordRequest):
    """Detect chord from MIDI notes."""
    if len(req.notes) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 notes")
    results = chords.detect_chord(req.notes)
    if not results:
        return {"detected": False, "results": []}
    return {"detected": True, "best": results[0], "results": results}


@app.get("/api/tonality/{key}")
def api_get_tonality(key: str):
    """Get all diatonic chords and functions for a key."""
    try:
        diatonic = tonality.get_diatonic_chords(key)
        diatonic7 = tonality.get_diatonic_seventh_chords(key)
        sig = tonality.get_key_signature(key)
        return {
            "key": key,
            "key_signature": sig,
            "diatonic_triads": diatonic,
            "diatonic_sevenths": diatonic7,
        }
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/tonality/{key}/{mode}")
def api_get_tonality_mode(key: str, mode: str):
    """Get diatonic chords for a key in a specific mode."""
    try:
        if mode == "major":
            diatonic = tonality.get_diatonic_chords(key)
            diatonic7 = tonality.get_diatonic_seventh_chords(key)
            sig = tonality.get_key_signature(key)
        elif mode in ("natural_minor", "harmonic_minor"):
            diatonic = tonality.get_diatonic_chords_minor(key, mode)
            diatonic7 = tonality.get_diatonic_seventh_chords_minor(key, mode)
            sig_val = tonality.MINOR_KEY_SIGNATURES.get(key, 0)
            if sig_val > 0:
                accidentals = tonality.SHARP_ORDER[:sig_val]
                acc_type = "sharps"
            elif sig_val < 0:
                accidentals = tonality.FLAT_ORDER[:abs(sig_val)]
                acc_type = "flats"
            else:
                accidentals = []
                acc_type = "none"
            sig = {"key": key, "accidentals": accidentals, "accidental_type": acc_type, "count": abs(sig_val)}
        elif mode in ("dorian", "phrygian", "lydian", "mixolydian", "locrian"):
            diatonic = tonality.get_diatonic_chords_for_mode(key, mode)
            diatonic7 = []  # Modes don't have standard seventh chord patterns
            sig = tonality.get_key_signature(key)
        else:
            raise ValueError(f"Unknown mode: {mode}")
        return {
            "key": key,
            "mode": mode,
            "key_signature": sig,
            "diatonic_triads": diatonic,
            "diatonic_sevenths": diatonic7,
        }
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/tonality/detect")
def api_detect_key(req: DetectKeyRequest):
    """Detect key from a set of notes."""
    if len(req.notes) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 notes")
    results = tonality.detect_key(req.notes)
    return {"results": results}


@app.get("/api/key-signature/{key}")
def api_key_signature(key: str):
    """Get key signature (sharps/flats) for a key."""
    try:
        return tonality.get_key_signature(key)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/circle-of-fifths")
def api_circle():
    """Get the complete circle of fifths."""
    return circle_of_fifths.get_circle_of_fifths()


@app.get("/api/circle-of-fifths/{key}")
def api_circle_key(key: str):
    """Get circle of fifths focused on a specific key."""
    try:
        return circle_of_fifths.get_circle_for_key(key)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/secondary-dominants/{key}")
def api_secondary_dominants(key: str, mode: str = "major"):
    """Get all secondary dominants for a key."""
    try:
        return harmony.get_secondary_dominants(key, mode)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/secondary-subdominants/{key}")
def api_secondary_subdominants(key: str, mode: str = "major"):
    """Get all secondary subdominants for a key."""
    try:
        return harmony.get_secondary_subdominants(key, mode)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/progressions/{key}")
def api_progressions(key: str, mode: str = "major"):
    """Get common chord progressions in a key."""
    try:
        return harmony.get_common_progressions(key, mode)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/progressions/enrich")
def api_enrich_progression(req: EnrichRequest):
    """Suggest enrichments for a chord progression."""
    try:
        return harmony.enrich_progression(req.key, req.chords)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/harmony/suggest")
def api_harmony_suggest(req: HarmonySuggestRequest):
    """Get harmony suggestions for a key."""
    try:
        return harmony.suggest_next_chords(req.key, req.chords)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/builder/suggestions")
def api_builder_suggestions(req: BuilderSuggestRequest):
    """Get smart builder suggestions grouped by harmonic function."""
    try:
        return harmony.suggest_next_chords_builder(req.key, req.mode, req.chords)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


# --- Advanced Harmony Endpoints ---

@app.get("/api/cadences/{key}")
def api_cadences(key: str):
    """Get all cadences realized in the given key."""
    try:
        return advanced_harmony.get_cadences(key)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/tritone-sub")
def api_tritone_sub(req: TritoneSubRequest):
    """Calculate tritone substitution for a dominant chord."""
    try:
        return advanced_harmony.get_tritone_substitution(req.root, req.chord_type)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/tritone-subs")
def api_all_tritone_subs():
    """Get tritone substitutions for all 12 dominant7 chords."""
    return advanced_harmony.get_all_tritone_subs()


@app.get("/api/modal-interchange/{key}")
def api_modal_interchange(key: str, mode: str = "major"):
    """Get borrowed chords from the parallel key (major borrows from minor, minor from major)."""
    try:
        return advanced_harmony.get_modal_interchange(key, mode)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/negative-harmony/{key}")
def api_negative_harmony(key: str):
    """Calculate negative harmony mappings for a key."""
    try:
        return advanced_harmony.get_negative_harmony(key)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/chopin-bass")
def api_chopin_bass(req: ChopinBassRequest):
    """Get Chopin-style bass voicing for a chord."""
    try:
        return advanced_harmony.get_chopin_bass(req.root, req.chord_type)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/suggest-from-melody")
def api_suggest_from_melody(req: MelodySuggestRequest):
    """Suggest chords based on a melody."""
    try:
        return advanced_harmony.suggest_from_melody(req.notes)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


# --- Smart Suggestions Endpoint ---

@app.post("/api/suggestions")
def api_suggestions(req: SuggestionsRequest):
    """Get comprehensive chord suggestions for a key, grouped by category."""
    try:
        # Diatonic chords
        if req.mode == "major":
            diatonic = tonality.get_diatonic_chords(req.key)
        elif req.mode in ("natural_minor", "harmonic_minor"):
            diatonic = tonality.get_diatonic_chords_minor(req.key, req.mode)
        else:
            diatonic = tonality.get_diatonic_chords(req.key)

        # Diatonic seventh chords (incl. m7b5)
        if req.mode == "major":
            diatonic7 = tonality.get_diatonic_seventh_chords(req.key)
        elif req.mode in ("natural_minor", "harmonic_minor"):
            diatonic7 = tonality.get_diatonic_seventh_chords_minor(req.key, req.mode)
        else:
            diatonic7 = tonality.get_diatonic_seventh_chords(req.key)

        # Secondary dominants & subdominants
        sec_dom = harmony.get_secondary_dominants(req.key, req.mode)
        sec_sub = harmony.get_secondary_subdominants(req.key, req.mode)

        # Dominant chains
        dom_chains = harmony.get_dominant_chains(req.key)

        # Modal interchange
        modal = advanced_harmony.get_modal_interchange(req.key)

        # Functional ordering if current chord provided
        recommended = []
        if req.current_chord_root:
            current_symbol = req.current_chord_root
            if req.current_chord_type and req.current_chord_type != "major":
                from .theory.chords import build_chord as _bc
                c = _bc(req.current_chord_root, req.current_chord_type)
                current_symbol = c["symbol"]
            result = harmony.suggest_next_chords(req.key, [current_symbol])
            recommended = result.get("recommended", [])

        return {
            "key": req.key,
            "mode": req.mode,
            "diatonic": [
                {
                    "symbol": c["symbol"],
                    "numeral": c["numeral"],
                    "function": c["function"],
                    "notes": c["notes"],
                    "formula": c.get("formula"),
                }
                for c in diatonic
            ],
            "diatonic_sevenths": [
                {
                    "symbol": c["symbol"],
                    "numeral": c["numeral"],
                    "function": c["function"],
                    "notes": c["notes"],
                    "formula": c.get("formula"),
                }
                for c in diatonic7
            ],
            "secondary_dominants": [
                {
                    "symbol": sd["chord7"],
                    "label": sd["label"],
                    "target": sd["target"],
                    "notes": sd["notes7"],
                }
                for sd in sec_dom
            ],
            "secondary_subdominants": [
                {
                    "symbol": ss["chord7"],
                    "label": ss["label"],
                    "target": ss["target"],
                    "notes": ss["notes7"],
                }
                for ss in sec_sub
            ],
            "dominant_chains": [
                {
                    "target": ch["target"],
                    "target_degree": ch["target_degree"],
                    "chain": ch["chain"],
                }
                for ch in dom_chains
            ],
            "modal_interchange": modal.get("borrowed_chords", []),
            "recommended": recommended,
        }
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


# --- Cinematic Harmony & Improvisation Endpoints ---

@app.get("/api/cinematic/{key}")
def api_cinematic_progressions(key: str, style: str = None):
    """Get cinematic chord progressions (Ghibli, Final Fantasy, cinematic) in a key."""
    try:
        return cinematic_harmony.get_cinematic_progressions(key, style)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/improvisation/{key}")
def api_improvisation_guide(key: str, mode: str = "major"):
    """Get improvisation guide for each diatonic chord in a key."""
    try:
        return cinematic_harmony.get_improvisation_guide(key, mode)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/improvisation/chord")
def api_chord_improvisation(req: ChordImprovRequest):
    """Get improvisation guide for a specific chord."""
    try:
        return cinematic_harmony.get_chord_improvisation(req.root, req.chord_type)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/chromatic-mediants/{key}")
def api_chromatic_mediants(key: str):
    """Get chromatic mediant relationships for a key."""
    try:
        return cinematic_harmony.get_chromatic_mediants(key)
    except (ValueError, KeyError) as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/composition-guide")
def api_composition_guide(style: str = None):
    """Get composition guide for a style (ghibli, final_fantasy, cinematic)."""
    return cinematic_harmony.get_composition_guide(style)


# --- Chordify Endpoints ---

_chordify_tasks: dict = {}


@app.post("/api/chordify/analyze")
def api_chordify_analyze(req: ChordifyRequest, background_tasks: BackgroundTasks):
    """Start YouTube chord analysis in background."""
    # Validate URL
    if not ("youtube.com" in req.url or "youtu.be" in req.url):
        raise HTTPException(400, "URL inválido. Usa un enlace de YouTube.")

    try:
        video_id = audio_analyzer.extract_video_id(req.url)
    except ValueError as e:
        raise HTTPException(400, str(e))

    task_id = str(uuid.uuid4())[:8]
    _chordify_tasks[task_id] = {
        "status": "processing",
        "progress": 0,
        "message": "Iniciando...",
        "result": None,
        "error": None,
    }

    def run_analysis():
        import traceback

        def progress_cb(pct, msg):
            print(f"[chordify:{task_id}] {pct}% - {msg}")
            _chordify_tasks[task_id]["progress"] = pct
            _chordify_tasks[task_id]["message"] = msg

        try:
            result = audio_analyzer.analyze_youtube(req.url, progress_cb)
            _chordify_tasks[task_id]["status"] = "completed"
            _chordify_tasks[task_id]["progress"] = 100
            _chordify_tasks[task_id]["result"] = result
            print(f"[chordify:{task_id}] Completado: {len(result.get('chords', []))} acordes")
        except Exception as e:
            print(f"[chordify:{task_id}] ERROR: {traceback.format_exc()}")
            _chordify_tasks[task_id]["status"] = "error"
            _chordify_tasks[task_id]["error"] = str(e)

    background_tasks.add_task(run_analysis)
    return {"task_id": task_id, "video_id": video_id}


@app.get("/api/chordify/status/{task_id}")
def api_chordify_status(task_id: str):
    """Poll chord analysis status."""
    if task_id not in _chordify_tasks:
        raise HTTPException(404, "Tarea no encontrada")
    return _chordify_tasks[task_id]


# --- Stem Separation Endpoints ---

_stem_tasks: dict = {}


@app.post("/api/chordify/separate/{task_id}")
def api_separate_stems(task_id: str, background_tasks: BackgroundTasks):
    """Start stem separation for a previously analyzed song."""
    if task_id not in _chordify_tasks:
        raise HTTPException(404, "Tarea de análisis no encontrada")

    chordify_task = _chordify_tasks[task_id]
    if chordify_task["status"] != "completed" or not chordify_task["result"]:
        raise HTTPException(400, "El análisis aún no está completo")

    if not stem_separator.check_demucs_available():
        raise HTTPException(503, "Demucs no está disponible. Instala con: pip install demucs")

    # We need to re-download the audio for stem separation
    video_id = chordify_task["result"]["video_id"]
    url = f"https://www.youtube.com/watch?v={video_id}"

    _stem_tasks[task_id] = {
        "status": "processing",
        "progress": 0,
        "message": "Iniciando...",
        "stems": None,
        "error": None,
    }

    def run_separation():
        import traceback
        try:
            def progress_cb(pct, msg):
                print(f"[stems:{task_id}] {pct}% - {msg}")
                _stem_tasks[task_id]["progress"] = pct
                _stem_tasks[task_id]["message"] = msg

            progress_cb(5, "Descargando audio para separación...")
            dl_info = audio_analyzer.download_audio(url, lambda p, m: progress_cb(min(15, p), m))

            progress_cb(15, "Separando stems con Demucs...")
            stems = stem_separator.separate_stems(dl_info["filepath"], task_id, progress_cb)

            # Cleanup downloaded audio
            try:
                os.remove(dl_info["filepath"])
            except OSError:
                pass

            _stem_tasks[task_id]["status"] = "completed"
            _stem_tasks[task_id]["progress"] = 100
            _stem_tasks[task_id]["stems"] = {
                name: f"/api/stems/{task_id}/{name}"
                for name in stems
            }
            print(f"[stems:{task_id}] Completado: {list(stems.keys())}")
        except Exception as e:
            print(f"[stems:{task_id}] ERROR: {traceback.format_exc()}")
            _stem_tasks[task_id]["status"] = "error"
            _stem_tasks[task_id]["error"] = str(e)

    background_tasks.add_task(run_separation)
    return {"task_id": task_id, "message": "Separación iniciada"}


@app.get("/api/chordify/stems-status/{task_id}")
def api_stems_status(task_id: str):
    """Poll stem separation status."""
    if task_id not in _stem_tasks:
        raise HTTPException(404, "Tarea de separación no encontrada")
    return _stem_tasks[task_id]


@app.get("/api/stems/{task_id}/{stem_name}")
def api_get_stem(task_id: str, stem_name: str):
    """Serve a stem audio file."""
    if stem_name not in stem_separator.STEM_NAMES:
        raise HTTPException(400, f"Stem inválido. Opciones: {stem_separator.STEM_NAMES}")

    stem_dir = os.path.join(stem_separator.STEMS_DIR, task_id)

    # Look for mp3 or wav
    for ext in (".mp3", ".wav"):
        path = os.path.join(stem_dir, f"{stem_name}{ext}")
        if os.path.exists(path):
            media_type = "audio/mpeg" if ext == ".mp3" else "audio/wav"
            return FileResponse(path, media_type=media_type, filename=f"{stem_name}{ext}")

    raise HTTPException(404, "Stem no encontrado")


# --- MIDI Accompaniment & Transcription Endpoints ---

_midi_transcription_tasks: dict = {}


@app.post("/api/chordify/midi-accompaniment/{task_id}")
def api_midi_accompaniment(task_id: str, req: MidiAccompRequest):
    """Generate MIDI accompaniment from detected chords."""
    if task_id not in _chordify_tasks:
        raise HTTPException(404, "Tarea de análisis no encontrada")

    chordify_task = _chordify_tasks[task_id]
    if chordify_task["status"] != "completed" or not chordify_task["result"]:
        raise HTTPException(400, "El análisis aún no está completo")

    result = chordify_task["result"]
    chords = result.get("chords", [])
    tempo = result.get("tempo", 120)

    if not chords:
        raise HTTPException(400, "No hay acordes para generar MIDI")

    if req.pattern not in midi_generator.ACCOMPANIMENT_PATTERNS:
        raise HTTPException(400, f"Patrón inválido. Opciones: {midi_generator.ACCOMPANIMENT_PATTERNS}")

    try:
        midi_result = midi_generator.generate_accompaniment_midi(
            chords, tempo, req.pattern, task_id
        )
        return {
            "download_url": f"/api/midi/{task_id}/accompaniment/{req.pattern}",
            "note_events": midi_result["note_events"],
            "pattern": req.pattern,
        }
    except Exception as e:
        raise HTTPException(500, f"Error generando MIDI: {str(e)}")


@app.get("/api/midi/{task_id}/accompaniment/{pattern}")
def api_midi_accompaniment_file(task_id: str, pattern: str):
    """Serve MIDI accompaniment file for download."""
    filename = f"{task_id}_accomp_{pattern}.mid"
    filepath = os.path.join(midi_generator.MIDI_DIR, filename)

    if not os.path.exists(filepath):
        raise HTTPException(404, "Archivo MIDI no encontrado")

    return FileResponse(
        filepath,
        media_type="audio/midi",
        filename=filename,
    )


@app.post("/api/chordify/transcribe/{task_id}")
def api_transcribe_midi(task_id: str, background_tasks: BackgroundTasks):
    """Start audio-to-MIDI transcription using basic-pitch."""
    if task_id not in _chordify_tasks:
        raise HTTPException(404, "Tarea de análisis no encontrada")

    chordify_task = _chordify_tasks[task_id]
    if chordify_task["status"] != "completed" or not chordify_task["result"]:
        raise HTTPException(400, "El análisis aún no está completo")

    if not midi_generator.check_basic_pitch_available():
        raise HTTPException(503, "basic-pitch no está disponible. Instala con: pip install basic-pitch")

    video_id = chordify_task["result"]["video_id"]
    url = f"https://www.youtube.com/watch?v={video_id}"

    _midi_transcription_tasks[task_id] = {
        "status": "processing",
        "progress": 0,
        "message": "Iniciando...",
        "result": None,
        "error": None,
    }

    def run_transcription():
        import traceback
        try:
            def progress_cb(pct, msg):
                print(f"[midi-transcribe:{task_id}] {pct}% - {msg}")
                _midi_transcription_tasks[task_id]["progress"] = pct
                _midi_transcription_tasks[task_id]["message"] = msg

            progress_cb(5, "Descargando audio para transcripción...")
            dl_info = audio_analyzer.download_audio(url, lambda p, m: progress_cb(min(10, p), m))

            progress_cb(10, "Audio descargado, iniciando transcripción...")
            result = midi_generator.transcribe_audio_to_midi(
                dl_info["filepath"], task_id, progress_cb
            )

            # Cleanup downloaded audio
            try:
                os.remove(dl_info["filepath"])
            except OSError:
                pass

            _midi_transcription_tasks[task_id]["status"] = "completed"
            _midi_transcription_tasks[task_id]["progress"] = 100
            _midi_transcription_tasks[task_id]["result"] = {
                "download_url": f"/api/midi/{task_id}/transcription",
                "note_events": result["note_events"],
                "num_notes": result["num_notes"],
            }
            print(f"[midi-transcribe:{task_id}] Completado: {result['num_notes']} notas")
        except Exception as e:
            print(f"[midi-transcribe:{task_id}] ERROR: {traceback.format_exc()}")
            _midi_transcription_tasks[task_id]["status"] = "error"
            _midi_transcription_tasks[task_id]["error"] = str(e)

    background_tasks.add_task(run_transcription)
    return {"task_id": task_id, "message": "Transcripción iniciada"}


@app.get("/api/chordify/transcribe-status/{task_id}")
def api_transcribe_status(task_id: str):
    """Poll transcription status."""
    if task_id not in _midi_transcription_tasks:
        raise HTTPException(404, "Tarea de transcripción no encontrada")
    return _midi_transcription_tasks[task_id]


@app.get("/api/midi/{task_id}/transcription")
def api_midi_transcription_file(task_id: str):
    """Serve MIDI transcription file for download."""
    filename = f"{task_id}_transcription.mid"
    filepath = os.path.join(midi_generator.MIDI_DIR, filename)

    if not os.path.exists(filepath):
        raise HTTPException(404, "Archivo MIDI no encontrado")

    return FileResponse(
        filepath,
        media_type="audio/midi",
        filename=filename,
    )


@app.get("/api/reference-images")
def api_reference_images():
    """List available reference images."""
    ref_dir = Path(__file__).parent.parent / "reference"
    if not ref_dir.exists():
        return []
    images = []
    for f in sorted(ref_dir.iterdir()):
        if f.suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp', '.gif'):
            images.append({
                "filename": f.name,
                "url": f"/reference/{f.name}",
                "size": f.stat().st_size,
            })
    return images


# --- Serve static frontend files ---

FRONTEND_DIR = Path(__file__).parent.parent / "frontend"
REFERENCE_DIR = Path(__file__).parent.parent / "reference"


@app.api_route("/health", methods=["GET", "HEAD"])
def health_check():
    """Health check endpoint for uptime monitors."""
    return {"status": "ok"}


@app.get("/")
def serve_index():
    """Serve the main HTML page."""
    return FileResponse(FRONTEND_DIR / "index.html")


# Mount static files (CSS, JS) after API routes
app.mount("/css", StaticFiles(directory=FRONTEND_DIR / "css"), name="css")
app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")

# Mount reference images
if REFERENCE_DIR.exists():
    app.mount("/reference", StaticFiles(directory=REFERENCE_DIR), name="reference")
