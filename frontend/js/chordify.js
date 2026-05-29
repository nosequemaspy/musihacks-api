/**
 * Chordify module: YouTube chord analysis with video sync,
 * mini piano visualization (Chordify-style), preset save/load,
 * and chord timeline editing.
 */

const Chordify = (() => {
    let player = null;       // YouTube IFrame Player
    let analysis = null;     // Current analysis result
    let syncInterval = null;
    let currentIdx = -1;
    let ytReady = false;
    let editMode = false;
    let currentTaskId = null; // For stem separation
    let currentVoicing = 0;  // Voicing index for current chord

    const POLL_INTERVAL = 2000;
    const SYNC_FPS = 100; // ms between sync updates
    const BEATS_PER_BAR = 4;
    const STORAGE_KEY = 'musihacks_chordify_presets';

    // Mini piano range: C3 (MIDI 48) to B4 (MIDI 71) = 2 octaves
    const MINI_START = 48; // C3
    const MINI_END = 71;   // B4
    const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const WHITE_PCS = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B
    const BLACK_PCS = [1, 3, 6, 8, 10];        // C# D# F# G# A#

    function init() {
        const btn = document.getElementById('btn-chordify-analyze');
        if (btn) {
            btn.addEventListener('click', () => {
                const url = document.getElementById('chordify-url').value.trim();
                if (url) startAnalysis(url);
            });
        }

        // Enter key on input
        const input = document.getElementById('chordify-url');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const url = input.value.trim();
                    if (url) startAnalysis(url);
                }
            });
        }

        // Play current chord button
        const playBtn = document.getElementById('btn-play-current-chord');
        if (playBtn) {
            playBtn.addEventListener('click', playCurrentChord);
        }

        // Save preset button
        const saveBtn = document.getElementById('btn-chordify-save-preset');
        if (saveBtn) {
            saveBtn.addEventListener('click', savePreset);
        }

        // Edit mode toggle
        const editToggle = document.getElementById('chordifyEditMode');
        if (editToggle) {
            editToggle.addEventListener('change', (e) => {
                editMode = e.target.checked;
                if (analysis) renderTimeline();
            });
        }

        // Voicing arrows
        document.getElementById('btn-voicing-prev')?.addEventListener('click', () => changeVoicing(-1));
        document.getElementById('btn-voicing-next')?.addEventListener('click', () => changeVoicing(1));

        // Stem separation
        const stemBtn = document.getElementById('btn-separate-stems');
        if (stemBtn) {
            stemBtn.addEventListener('click', requestStemSeparation);
        }

        // Stem solo/mute controls
        document.querySelectorAll('.stem-card').forEach(card => {
            card.querySelector('.stem-solo')?.addEventListener('click', () => toggleStemSolo(card.dataset.stem));
            card.querySelector('.stem-mute')?.addEventListener('click', () => toggleStemMute(card.dataset.stem));
        });

        loadYouTubeAPI();
        renderPresets();
        // Render empty mini pianos on init
        renderMiniPiano('mini-piano-current', [], null);
        renderMiniPiano('mini-piano-next', [], null);
    }

    // ─── Mini Piano Keyboard ────────────────────────

    function renderMiniPiano(containerId, midiNotes, rootMidi, bassMidi = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const activeSet = new Set(midiNotes);

        // Build keyboard HTML
        const keyboard = document.createElement('div');
        keyboard.className = 'mini-keyboard';

        // Calculate white key positions first
        const whiteKeys = [];
        const blackKeys = [];

        for (let midi = MINI_START; midi <= MINI_END; midi++) {
            const pc = midi % 12;
            if (WHITE_PCS.includes(pc)) {
                whiteKeys.push(midi);
            } else {
                blackKeys.push(midi);
            }
        }

        const whiteKeyWidth = 26;
        const totalWidth = whiteKeys.length * whiteKeyWidth;
        keyboard.style.width = totalWidth + 'px';

        // Render white keys
        whiteKeys.forEach((midi, i) => {
            const key = document.createElement('div');
            key.className = 'mini-key white';
            key.style.left = (i * whiteKeyWidth) + 'px';
            key.style.position = 'absolute';

            if (activeSet.has(midi)) {
                const dot = document.createElement('span');
                dot.className = 'key-dot';
                if (midi === rootMidi) key.classList.add('root');
                else if (bassMidi != null && midi === bassMidi) key.classList.add('bass');
                key.appendChild(dot);
            }

            keyboard.appendChild(key);
        });

        // Render black keys at correct positions
        blackKeys.forEach(midi => {
            const pc = midi % 12;
            // Find which white key this black key sits between
            const prevWhiteMidi = midi - 1; // The white key just below
            const whiteIdx = whiteKeys.indexOf(prevWhiteMidi);
            if (whiteIdx < 0) return;

            const key = document.createElement('div');
            key.className = 'mini-key black';
            // Position black key overlapping two white keys
            const leftPos = (whiteIdx + 1) * whiteKeyWidth - 9;
            key.style.left = leftPos + 'px';
            key.style.position = 'absolute';

            if (activeSet.has(midi)) {
                const dot = document.createElement('span');
                dot.className = 'key-dot';
                if (midi === rootMidi) key.classList.add('root');
                else if (bassMidi != null && midi === bassMidi) key.classList.add('bass');
                key.appendChild(dot);
            }

            keyboard.appendChild(key);
        });

        container.innerHTML = '';
        container.appendChild(keyboard);
    }

    function chordToMidiNotes(chord) {
        if (!chord || !chord.notes || chord.notes.length === 0) return { midiNotes: [], rootMidi: null, bassMidi: null };

        const midiNotes = [];
        let octave = 4;
        let prevPC = -1;
        let bassMidi = null;

        // Bass note in octave 3 if inversion
        if (chord.bass && chord.inversion > 0) {
            const bassPC = Piano.noteToPC(chord.bass);
            const bm = 48 + bassPC; // octave 3 (C3=48)
            // Only include if in mini piano range
            if (bm >= MINI_START && bm <= MINI_END) {
                midiNotes.push(bm);
                bassMidi = bm;
            }
        }

        const rootPC = Piano.noteToPC(chord.notes[0]);
        let rootMidi = null;

        for (const note of chord.notes) {
            const pc = Piano.noteToPC(note);
            if (prevPC >= 0 && pc <= prevPC) octave++;
            const midi = (octave + 1) * 12 + pc;
            // Shift down to fit in mini piano range if needed
            let m = midi;
            while (m > MINI_END) m -= 12;
            while (m < MINI_START) m += 12;
            midiNotes.push(m);
            if (pc === rootPC && rootMidi === null) rootMidi = m;
            prevPC = pc;
        }

        return { midiNotes, rootMidi, bassMidi };
    }

    function updateMiniPianos(chord, nextChord) {
        // Current chord piano
        if (chord) {
            const { midiNotes, rootMidi, bassMidi } = chordToMidiNotes(chord);
            renderMiniPiano('mini-piano-current', midiNotes, rootMidi, bassMidi);
            const nameEl = document.getElementById('mini-piano-chord-name');
            if (nameEl) nameEl.innerHTML = formatChordSymbol(chord, true); // Show bass label
        } else {
            renderMiniPiano('mini-piano-current', [], null);
            const nameEl = document.getElementById('mini-piano-chord-name');
            if (nameEl) nameEl.innerHTML = '-';
        }

        // Next chord piano
        if (nextChord) {
            const { midiNotes, rootMidi, bassMidi } = chordToMidiNotes(nextChord);
            renderMiniPiano('mini-piano-next', midiNotes, rootMidi, bassMidi);
            const nameEl = document.getElementById('mini-piano-next-name');
            if (nameEl) nameEl.innerHTML = formatChordSymbol(nextChord, true); // Show bass label
        } else {
            renderMiniPiano('mini-piano-next', [], null);
            const nameEl = document.getElementById('mini-piano-next-name');
            if (nameEl) nameEl.innerHTML = '-';
        }
    }

    function formatChordSymbol(chord, showBassLabel = false) {
        if (!chord) return '-';
        let name = escapeHtml(chord.chord.split('/')[0]);
        // Format type suffixes as superscript (order matters: longest first)
        name = name.replace(/(dim7|m7b5|maj7|add9|sus[24]|m7|m6|m|7|6|dim|aug|5)$/i, '<sup>$1</sup>');

        // Determine bass note: either explicit bass or first note
        let bassNote = chord.bass;
        if (!bassNote && chord.notes && chord.notes.length > 0) {
            bassNote = chord.notes[0]; // Lowest note is bass
        }

        // Show bass if inverted
        if (chord.inversion > 0 && bassNote) {
            name += `<span style="font-size:0.6em;color:var(--text-muted)">/${escapeHtml(bassNote)}</span>`;
        }

        // Optionally add explicit bass label
        if (showBassLabel && bassNote) {
            name += `<br><span style="font-size:0.65em;color:var(--text-dim)">Bajo: ${escapeHtml(bassNote)}</span>`;
        }

        return name;
    }

    function changeVoicing(dir) {
        if (!analysis || currentIdx < 0) return;
        const chord = analysis.chords[currentIdx];
        if (!chord || !chord.notes || chord.notes.length < 2) return;

        // Rotate notes for different voicings
        currentVoicing += dir;
        const notes = [...chord.notes];
        const rotations = ((currentVoicing % notes.length) + notes.length) % notes.length;
        const rotated = [...notes.slice(rotations), ...notes.slice(0, rotations)];

        // Temporarily use rotated voicing for display
        const tempChord = { ...chord, notes: rotated };
        const nextChord = (currentIdx + 1 < analysis.chords.length) ? analysis.chords[currentIdx + 1] : null;

        const { midiNotes, rootMidi, bassMidi } = chordToMidiNotes(tempChord);
        renderMiniPiano('mini-piano-current', midiNotes, rootMidi, bassMidi);

        // Also update the main piano highlights
        updatePianoHighlight(tempChord);
    }

    // ─── Presets ────────────────────────

    function getPresets() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    }

    function savePresets(presets) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    }

    function savePreset() {
        if (!analysis) return;

        const name = prompt('Nombre del preset:', analysis.title || 'Sin título');
        if (!name) return;

        const presets = getPresets();
        presets.push({
            id: Date.now(),
            name,
            title: analysis.title,
            key: analysis.key,
            key_mode: analysis.key_mode,
            key_confidence: analysis.key_confidence,
            tempo: analysis.tempo,
            video_id: analysis.video_id,
            chords: analysis.chords,
            date: new Date().toLocaleDateString(),
        });
        savePresets(presets);
        renderPresets();
        showNotification(`Preset "${name}" guardado`);
    }

    function showNotification(msg) {
        const existing = document.querySelector('.chordify-notification');
        if (existing) existing.remove();

        const el = document.createElement('div');
        el.className = 'chordify-notification';
        el.textContent = msg;
        document.body.appendChild(el);

        requestAnimationFrame(() => el.classList.add('show'));

        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 300);
        }, 2500);
    }

    function renderPresets() {
        const container = document.getElementById('chordify-presets-list');
        const section = document.getElementById('chordify-presets');
        if (!container || !section) return;

        const presets = getPresets();
        if (presets.length === 0) {
            section.classList.add('hidden');
            return;
        }

        section.classList.remove('hidden');
        container.innerHTML = '';

        for (const preset of presets) {
            const card = document.createElement('div');
            card.className = 'preset-card';
            card.innerHTML = `
                <span class="preset-title">${preset.name}</span>
                <span class="preset-meta">${preset.key || '?'} &bull; ${preset.tempo || '?'} BPM &bull; ${preset.chords.length} acordes &bull; ${preset.date}</span>
                <div class="preset-actions">
                    <button class="example-btn" style="padding:3px 8px;font-size:0.72rem" data-action="load">Cargar</button>
                    <button class="preset-delete" data-action="delete">&times;</button>
                </div>
            `;

            card.querySelector('[data-action="load"]').addEventListener('click', (e) => {
                e.stopPropagation();
                loadPreset(preset);
            });

            card.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
                e.stopPropagation();
                const filtered = presets.filter(p => p.id !== preset.id);
                savePresets(filtered);
                renderPresets();
            });

            container.appendChild(card);
        }
    }

    function loadPreset(preset) {
        analysis = {
            title: preset.title || preset.name,
            key: preset.key,
            key_mode: preset.key_mode || 'major',
            key_confidence: preset.key_confidence,
            tempo: preset.tempo,
            video_id: preset.video_id,
            chords: preset.chords,
        };
        currentIdx = -1;
        currentVoicing = 0;
        renderResults();
    }

    // ─── YouTube API ────────────────────────

    function loadYouTubeAPI() {
        if (window.YT && window.YT.Player) {
            ytReady = true;
            return;
        }

        window.onYouTubeIframeAPIReady = () => {
            ytReady = true;
        };

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
    }

    function createPlayer(videoId) {
        if (player && player.destroy) {
            try { player.destroy(); } catch(e) {}
        }

        const container = document.getElementById('chordify-video');
        if (!container) return;

        container.innerHTML = '<div id="chordify-yt-player"></div>';

        player = new YT.Player('chordify-yt-player', {
            videoId: videoId,
            playerVars: {
                autoplay: 0,
                controls: 1,
                modestbranding: 1,
                rel: 0,
            },
            events: {
                'onStateChange': onPlayerStateChange,
            }
        });
    }

    function onPlayerStateChange(event) {
        startSync();
    }

    // ─── Analysis ────────────────────────

    async function startAnalysis(url) {
        analysis = null;
        currentIdx = -1;
        currentVoicing = 0;
        stopSync();

        showElement('chordify-progress');
        hideElement('chordify-results');
        updateProgress(0, 'Enviando solicitud...');

        const btn = document.getElementById('btn-chordify-analyze');
        if (btn) btn.disabled = true;

        try {
            const resp = await fetch('/api/chordify/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                throw new Error(err.detail || 'Error al iniciar análisis');
            }

            const data = await resp.json();
            const taskId = data.task_id;
            currentTaskId = taskId;

            await pollStatus(taskId);

        } catch (e) {
            updateProgress(0, `Error: ${e.message}`);
            const fill = document.querySelector('#chordify-progress .progress-fill');
            if (fill) fill.style.background = 'var(--dominant)';
        } finally {
            if (btn) btn.disabled = false;
        }
    }

    async function pollStatus(taskId) {
        return new Promise((resolve, reject) => {
            const poll = setInterval(async () => {
                try {
                    const resp = await fetch(`/api/chordify/status/${taskId}`);
                    const data = await resp.json();

                    updateProgress(data.progress, data.message || 'Procesando...');

                    if (data.status === 'completed') {
                        clearInterval(poll);
                        analysis = data.result;
                        renderResults();
                        resolve();
                    } else if (data.status === 'error') {
                        clearInterval(poll);
                        throw new Error(data.error || 'Error desconocido');
                    }
                } catch (e) {
                    clearInterval(poll);
                    updateProgress(0, `Error: ${e.message}`);
                    const fill = document.querySelector('#chordify-progress .progress-fill');
                    if (fill) fill.style.background = 'var(--dominant)';
                    reject(e);
                }
            }, POLL_INTERVAL);
        });
    }

    function updateProgress(pct, msg) {
        const fill = document.querySelector('#chordify-progress .progress-fill');
        const text = document.querySelector('#chordify-progress .progress-text');

        if (fill) {
            fill.style.width = `${pct}%`;
            fill.style.background = '';
        }
        if (text) text.textContent = msg;
    }

    // ─── Render Results ────────────────────────

    function renderResults() {
        if (!analysis) return;

        hideElement('chordify-progress');
        showElement('chordify-results');

        // Title and key
        const titleEl = document.getElementById('chordify-title');
        if (titleEl) titleEl.textContent = analysis.title;

        const keyEl = document.getElementById('chordify-key');
        if (keyEl) {
            const mode = analysis.key_mode === 'minor' ? 'menor' : 'Mayor';
            keyEl.textContent = `${analysis.key} ${mode} (${analysis.key_confidence}%)`;
        }

        const tempoEl = document.getElementById('chordify-tempo');
        if (tempoEl) tempoEl.textContent = `${analysis.tempo} BPM`;

        // Render timeline
        renderTimeline();

        // Load YouTube video
        if (ytReady && analysis.video_id) {
            createPlayer(analysis.video_id);
        }

        // Update mini pianos (empty initially)
        updateMiniPianos(null, analysis.chords.length > 0 ? analysis.chords[0] : null);

        // Show stems section if task_id is available
        const stemsSection = document.getElementById('chordify-stems-section');
        if (stemsSection && currentTaskId) {
            stemsSection.classList.remove('hidden');
        }
    }

    function renderTimeline() {
        const container = document.getElementById('chord-timeline');
        if (!container || !analysis) return;

        container.innerHTML = '';

        const tempo = analysis.tempo || 120;
        const barDuration = (60 / tempo) * BEATS_PER_BAR;

        analysis.chords.forEach((chord, idx) => {
            const btn = document.createElement('button');
            btn.className = 'timeline-chord' + (editMode ? ' edit-mode' : '');
            btn.dataset.index = idx;

            // Proportional width: 1 bar = 90px base
            const bars = Math.max(0.5, chord.duration / barDuration);
            const width = Math.round(bars * 90);
            btn.style.minWidth = width + 'px';
            btn.style.width = width + 'px';

            // Beat division lines
            const numBeats = Math.max(1, Math.round(chord.duration / (60 / tempo)));
            let dividersHtml = '<div class="beat-dividers">';
            for (let b = 0; b < numBeats; b++) {
                dividersHtml += '<div class="beat-divider"></div>';
            }
            dividersHtml += '</div>';

            // Build chord symbol
            let symbolHtml = escapeHtml(chord.chord.split('/')[0]);
            // Format type suffixes as superscript (order matters: longest first)
            symbolHtml = symbolHtml.replace(/(dim7|m7b5|maj7|add9|sus[24]|m7|m6|m|7|6|dim|aug|5)$/i, '<sup>$1</sup>');

            if (chord.inversion > 0 && chord.bass) {
                symbolHtml += `<span style="font-size:0.7em;opacity:0.6">/${escapeHtml(chord.bass)}</span>`;
            }

            let editActionsHtml = '';
            if (editMode) {
                editActionsHtml = `
                    <div class="chord-edit-actions">
                        <button class="chord-edit-btn" data-action="edit" title="Editar">&#9998;</button>
                        <button class="chord-edit-btn" data-action="move-left" title="Mover izq">&larr;</button>
                        <button class="chord-edit-btn" data-action="move-right" title="Mover der">&rarr;</button>
                        <button class="chord-edit-btn delete-btn" data-action="delete" title="Eliminar">&times;</button>
                    </div>
                `;
            }

            btn.innerHTML = `
                ${dividersHtml}
                <span class="chord-symbol">${symbolHtml}</span>
                <span class="chord-time">${formatTime(chord.time)}</span>
                ${editActionsHtml}
            `;

            if (editMode) {
                btn.querySelectorAll('.chord-edit-btn').forEach(editBtn => {
                    editBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        handleEditAction(editBtn.dataset.action, idx);
                    });
                });
            }

            btn.addEventListener('click', (e) => {
                if (editMode && e.target.classList.contains('chord-edit-btn')) return;
                seekToChord(idx);
            });

            container.appendChild(btn);
        });

        // Add "+" button at end in edit mode
        if (editMode) {
            const addBtn = document.createElement('button');
            addBtn.className = 'timeline-add-btn visible';
            addBtn.textContent = '+';
            addBtn.title = 'Agregar acorde';
            addBtn.addEventListener('click', () => addChord());
            container.appendChild(addBtn);
        }
    }

    // ─── Edit Actions ────────────────────────

    function handleEditAction(action, idx) {
        switch (action) {
            case 'edit':
                editChord(idx);
                break;
            case 'delete':
                deleteChord(idx);
                break;
            case 'move-left':
                moveChord(idx, -1);
                break;
            case 'move-right':
                moveChord(idx, 1);
                break;
        }
    }

    function editChord(idx) {
        if (!analysis || !analysis.chords[idx]) return;

        const chord = analysis.chords[idx];
        const newName = prompt('Nombre del acorde:', chord.chord);
        if (newName === null) return;

        const newTime = prompt('Tiempo (segundos):', chord.time.toFixed(1));
        if (newTime === null) return;

        chord.chord = newName.trim() || chord.chord;
        chord.time = parseFloat(newTime) || chord.time;

        const parsed = parseChordForEdit(newName.trim());
        if (parsed) {
            fetch(`/api/chords/${encodeURIComponent(parsed.root)}/${encodeURIComponent(parsed.type)}`)
                .then(r => r.json())
                .then(data => {
                    chord.notes = data.notes;
                    chord.inversion = 0;
                    chord.bass = null;
                    renderTimeline();
                })
                .catch(() => {
                    renderTimeline();
                });
        } else {
            renderTimeline();
        }
    }

    function deleteChord(idx) {
        if (!analysis || !analysis.chords[idx]) return;
        analysis.chords.splice(idx, 1);
        renderTimeline();
    }

    function moveChord(idx, direction) {
        if (!analysis) return;
        const newIdx = idx + direction;
        if (newIdx < 0 || newIdx >= analysis.chords.length) return;

        const temp = analysis.chords[idx];
        analysis.chords[idx] = analysis.chords[newIdx];
        analysis.chords[newIdx] = temp;

        const tempTime = analysis.chords[idx].time;
        analysis.chords[idx].time = analysis.chords[newIdx].time;
        analysis.chords[newIdx].time = tempTime;

        renderTimeline();
    }

    function addChord() {
        if (!analysis) return;

        const name = prompt('Nombre del acorde (ej: C, Am, G7):');
        if (!name) return;

        const lastChord = analysis.chords[analysis.chords.length - 1];
        const lastTime = lastChord ? lastChord.time + (lastChord.duration || 2) : 0;

        const newChord = {
            chord: name.trim(),
            time: lastTime,
            duration: 2,
            notes: [],
            inversion: 0,
            bass: null,
        };

        const parsed = parseChordForEdit(name.trim());
        if (parsed) {
            fetch(`/api/chords/${encodeURIComponent(parsed.root)}/${encodeURIComponent(parsed.type)}`)
                .then(r => r.json())
                .then(data => {
                    newChord.notes = data.notes;
                    analysis.chords.push(newChord);
                    renderTimeline();
                })
                .catch(() => {
                    analysis.chords.push(newChord);
                    renderTimeline();
                });
        } else {
            analysis.chords.push(newChord);
            renderTimeline();
        }
    }

    function parseChordForEdit(symbol) {
        if (!symbol) return null;
        let root = '';
        let rest = '';

        if (symbol.length > 1 && (symbol[1] === '#' || symbol[1] === 'b')) {
            root = symbol.substring(0, 2);
            rest = symbol.substring(2);
        } else if (symbol.length > 0) {
            root = symbol[0];
            rest = symbol.substring(1);
        } else {
            return null;
        }

        const typeMap = {
            '': 'major', 'm': 'minor', 'dim': 'diminished', 'aug': 'augmented',
            'maj7': 'major7', 'm7': 'minor7', '7': 'dominant7',
            'dim7': 'diminished7', 'm7b5': 'half_diminished7',
            'sus2': 'sus2', 'sus4': 'sus4', '7sus4': '7sus4',
            'add9': 'add9', '6': '6', 'm6': 'minor6',
        };

        return { root, type: typeMap[rest] || 'major' };
    }

    // ─── Sync ────────────────────────

    function startSync() {
        if (syncInterval) return;
        syncInterval = setInterval(() => {
            if (!player || !analysis) return;
            try {
                const state = player.getPlayerState();
                if (state !== YT.PlayerState.PLAYING) return;

                const t = player.getCurrentTime();
                updateCurrentChord(t);
            } catch (e) {
                // Player might not be ready
            }
        }, SYNC_FPS);
    }

    function stopSync() {
        if (syncInterval) {
            clearInterval(syncInterval);
            syncInterval = null;
        }
    }

    function updateCurrentChord(videoTime) {
        if (!analysis || !analysis.chords.length) return;

        // Find chord at current time
        let idx = -1;
        for (let i = 0; i < analysis.chords.length; i++) {
            const c = analysis.chords[i];
            if (videoTime >= c.time && videoTime < c.time + c.duration) {
                idx = i;
                break;
            }
        }

        // If between chords, show the last one
        if (idx === -1) {
            for (let i = analysis.chords.length - 1; i >= 0; i--) {
                if (videoTime >= analysis.chords[i].time) {
                    idx = i;
                    break;
                }
            }
        }

        if (idx !== currentIdx) {
            currentIdx = idx;
            currentVoicing = 0; // Reset voicing on chord change
            highlightTimelineChord(idx);

            const chord = idx >= 0 ? analysis.chords[idx] : null;
            const nextChord = (idx >= 0 && idx + 1 < analysis.chords.length) ? analysis.chords[idx + 1] : null;

            updateMiniPianos(chord, nextChord);
            updatePianoHighlight(chord);
        }

        // Update progress bar continuously
        if (idx >= 0) {
            const chord = analysis.chords[idx];
            const elapsed = videoTime - chord.time;
            const progress = Math.min(1, Math.max(0, elapsed / chord.duration));
            updateChordProgress(progress);
        }
    }

    function updateChordProgress(progress) {
        // Update the inline progress on the active timeline chord
        const activeEl = document.querySelector('.timeline-chord.active');
        if (activeEl) {
            activeEl.style.setProperty('--chord-progress', `${progress * 100}%`);
        }
    }

    function highlightTimelineChord(idx) {
        document.querySelectorAll('.timeline-chord.active').forEach(el => {
            el.classList.remove('active');
            el.style.setProperty('--chord-progress', '0%');
        });

        if (idx < 0) return;

        const el = document.querySelector(`.timeline-chord[data-index="${idx}"]`);
        if (el) {
            el.classList.add('active');
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    function updatePianoHighlight(chord) {
        Piano.clearHighlights();

        if (!chord || !chord.notes || chord.notes.length === 0) return;

        const midiNotes = [];
        let octave = 4;
        let prevPC = -1;

        if (chord.bass && chord.inversion > 0) {
            const bassPC = Piano.noteToPC(chord.bass);
            const bassMidi = 48 + bassPC;
            midiNotes.push({ midi: bassMidi, type: 'bass' });
        }

        const rootPC = Piano.noteToPC(chord.notes[0]);

        for (const note of chord.notes) {
            const pc = Piano.noteToPC(note);
            if (prevPC >= 0 && pc <= prevPC) octave++;
            const midi = (octave + 1) * 12 + pc;
            midiNotes.push({ midi, type: pc === rootPC ? 'root' : 'tone' });
            prevPC = pc;
        }

        for (const { midi, type } of midiNotes) {
            const keyEl = document.querySelector(`[data-midi="${midi}"]`);
            if (!keyEl) continue;

            if (type === 'root') {
                keyEl.classList.add('scale-root');
            } else if (type === 'bass') {
                keyEl.classList.add('highlight-tonic');
            } else {
                keyEl.classList.add('scale-highlight');
            }
        }
    }

    function seekToChord(idx) {
        if (!player || !analysis || idx < 0) return;

        const chord = analysis.chords[idx];
        try {
            player.seekTo(chord.time, true);
            if (player.getPlayerState && player.getPlayerState() !== 1) {
                player.playVideo();
            }
        } catch (e) {
            // Player not ready
        }

        // Immediately update display
        currentIdx = idx;
        currentVoicing = 0;
        highlightTimelineChord(idx);

        const nextChord = (idx + 1 < analysis.chords.length) ? analysis.chords[idx + 1] : null;
        updateMiniPianos(chord, nextChord);
        updatePianoHighlight(chord);
    }

    async function playCurrentChord() {
        if (!analysis || currentIdx < 0) return;

        const chord = analysis.chords[currentIdx];
        if (!chord || !chord.notes) return;

        if (Tone.context.state !== 'running') await Tone.start();

        const noteNames = [];
        let octave = 4;
        let prevPC = -1;

        for (const note of chord.notes) {
            const pc = Piano.noteToPC(note);
            if (prevPC >= 0 && pc <= prevPC) octave++;
            noteNames.push(note + octave);
            prevPC = pc;
        }

        if (chord.bass && chord.inversion > 0) {
            const bassNote = chord.bass + '3';
            Piano.playNote(bassNote, 1.5, null, 0.65);
        }

        for (const n of noteNames) {
            Piano.playNote(n, 1.5, null, 0.6);
        }
    }

    // ─── Helpers ────────────────────────

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function showElement(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('hidden');
    }

    function hideElement(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    }

    // ─── Stem Separation ────────────────────────

    async function requestStemSeparation() {
        if (!currentTaskId) {
            showNotification('Primero analiza una canción');
            return;
        }

        const btn = document.getElementById('btn-separate-stems');
        if (btn) btn.disabled = true;

        showElement('stems-progress');
        hideElement('stems-grid');
        updateStemsProgress(0, 'Iniciando separación...');

        try {
            const resp = await fetch(`/api/chordify/separate/${currentTaskId}`, { method: 'POST' });
            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                throw new Error(err.detail || 'Error al iniciar separación');
            }

            await pollStemsStatus(currentTaskId);
        } catch (e) {
            updateStemsProgress(0, `Error: ${e.message}`);
            const fill = document.querySelector('#stems-progress .progress-fill');
            if (fill) fill.style.background = 'var(--dominant)';
        } finally {
            if (btn) btn.disabled = false;
        }
    }

    async function pollStemsStatus(taskId) {
        return new Promise((resolve, reject) => {
            const poll = setInterval(async () => {
                try {
                    const resp = await fetch(`/api/chordify/stems-status/${taskId}`);
                    const data = await resp.json();

                    updateStemsProgress(data.progress, data.message || 'Procesando...');

                    if (data.status === 'completed') {
                        clearInterval(poll);
                        renderStems(data.stems);
                        resolve();
                    } else if (data.status === 'error') {
                        clearInterval(poll);
                        throw new Error(data.error || 'Error desconocido');
                    }
                } catch (e) {
                    clearInterval(poll);
                    updateStemsProgress(0, `Error: ${e.message}`);
                    const fill = document.querySelector('#stems-progress .progress-fill');
                    if (fill) fill.style.background = 'var(--dominant)';
                    reject(e);
                }
            }, 3000);
        });
    }

    function updateStemsProgress(pct, msg) {
        const fill = document.querySelector('#stems-progress .progress-fill');
        const text = document.querySelector('#stems-progress .progress-text');
        if (fill) { fill.style.width = `${pct}%`; fill.style.background = ''; }
        if (text) text.textContent = msg;
    }

    function renderStems(stems) {
        hideElement('stems-progress');
        showElement('stems-grid');

        for (const [name, url] of Object.entries(stems)) {
            const card = document.querySelector(`.stem-card[data-stem="${name}"]`);
            if (!card) continue;

            const audio = card.querySelector('.stem-audio');
            if (audio) {
                audio.src = url;
                audio.load();
            }
        }
    }

    function toggleStemSolo(stemName) {
        const cards = document.querySelectorAll('.stem-card');
        const card = document.querySelector(`.stem-card[data-stem="${stemName}"]`);
        if (!card) return;

        const isSoloed = card.classList.contains('soloed');

        cards.forEach(c => {
            const audio = c.querySelector('.stem-audio');
            c.classList.remove('soloed', 'muted');
            if (audio) audio.muted = false;
        });

        if (!isSoloed) {
            card.classList.add('soloed');
            cards.forEach(c => {
                if (c.dataset.stem !== stemName) {
                    c.classList.add('muted');
                    const audio = c.querySelector('.stem-audio');
                    if (audio) audio.muted = true;
                }
            });
        }
    }

    function toggleStemMute(stemName) {
        const card = document.querySelector(`.stem-card[data-stem="${stemName}"]`);
        if (!card) return;

        const audio = card.querySelector('.stem-audio');
        const isMuted = card.classList.toggle('muted');
        if (audio) audio.muted = isMuted;
    }

    return {
        init,
        renderMiniPiano,
        chordToMidiNotes,
        MINI_START,
        MINI_END,
        WHITE_PCS,
    };
})();
