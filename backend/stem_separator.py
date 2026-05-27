"""
Stem Separator: Uses Demucs (Meta) to separate audio into stems.
Produces 4 stems: vocals, drums, bass, other (piano/guitar/etc).
"""

import os
import shutil
import subprocess
import tempfile
import time

STEMS_DIR = "/tmp/musihacks_stems"
STEM_NAMES = ["vocals", "drums", "bass", "other"]
STEM_LABELS = {
    "vocals": "Voz",
    "drums": "Batería",
    "bass": "Bajo",
    "other": "Otros (piano/guitarra)",
}


def _ensure_stems_dir():
    os.makedirs(STEMS_DIR, exist_ok=True)
    # Cleanup old stems (>2 hours)
    now = time.time()
    for entry in os.listdir(STEMS_DIR):
        fp = os.path.join(STEMS_DIR, entry)
        try:
            if os.path.isdir(fp) and now - os.path.getmtime(fp) > 7200:
                shutil.rmtree(fp)
            elif os.path.isfile(fp) and now - os.path.getmtime(fp) > 7200:
                os.remove(fp)
        except OSError:
            pass


def check_demucs_available() -> bool:
    """Check if demucs is installed and available."""
    try:
        result = subprocess.run(
            ["python3", "-m", "demucs", "--help"],
            capture_output=True, timeout=10
        )
        return result.returncode == 0
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return False


def separate_stems(audio_path: str, task_id: str, progress_cb=None) -> dict:
    """
    Separate an audio file into 4 stems using Demucs.
    Returns dict mapping stem name to file path.
    """
    _ensure_stems_dir()

    output_dir = os.path.join(STEMS_DIR, task_id)
    os.makedirs(output_dir, exist_ok=True)

    if progress_cb:
        progress_cb(10, "Iniciando separación de stems...")

    # Run demucs - use htdemucs model (best quality/speed ratio)
    cmd = [
        "python3", "-m", "demucs",
        "--two-stems", "vocals",  # First pass: vocals vs rest
        "-n", "htdemucs",
        "-o", output_dir,
        "--mp3",  # Output as MP3 for smaller files
        audio_path,
    ]

    # Actually, htdemucs 4-stem is better - separate into all 4 stems
    cmd = [
        "python3", "-m", "demucs",
        "-n", "htdemucs",
        "-o", output_dir,
        "--mp3",
        "--mp3-bitrate", "192",
        audio_path,
    ]

    if progress_cb:
        progress_cb(20, "Separando con Demucs (puede tardar unos minutos)...")

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=600,  # 10 min timeout
        )
        if result.returncode != 0:
            raise RuntimeError(f"Demucs error: {result.stderr[:300]}")
    except subprocess.TimeoutExpired:
        raise RuntimeError("Separación tomó demasiado tiempo (>10min)")

    if progress_cb:
        progress_cb(90, "Organizando stems...")

    # Demucs outputs to: output_dir/htdemucs/<filename_without_ext>/
    # Find the stem files
    audio_basename = os.path.splitext(os.path.basename(audio_path))[0]
    demucs_out = os.path.join(output_dir, "htdemucs", audio_basename)

    if not os.path.isdir(demucs_out):
        # Try finding any subdirectory
        htdemucs_dir = os.path.join(output_dir, "htdemucs")
        if os.path.isdir(htdemucs_dir):
            subdirs = os.listdir(htdemucs_dir)
            if subdirs:
                demucs_out = os.path.join(htdemucs_dir, subdirs[0])

    stems = {}
    for stem_name in STEM_NAMES:
        # Check for mp3 or wav
        for ext in (".mp3", ".wav"):
            stem_path = os.path.join(demucs_out, stem_name + ext)
            if os.path.exists(stem_path):
                # Move to a clean path
                clean_path = os.path.join(output_dir, f"{stem_name}{ext}")
                shutil.move(stem_path, clean_path)
                stems[stem_name] = clean_path
                break

    # Clean up demucs intermediate directory
    htdemucs_dir = os.path.join(output_dir, "htdemucs")
    if os.path.isdir(htdemucs_dir):
        shutil.rmtree(htdemucs_dir, ignore_errors=True)

    if progress_cb:
        progress_cb(100, "Separación completada")

    return stems


def cleanup_stems(task_id: str):
    """Remove stem files for a task."""
    task_dir = os.path.join(STEMS_DIR, task_id)
    if os.path.isdir(task_dir):
        shutil.rmtree(task_dir, ignore_errors=True)
