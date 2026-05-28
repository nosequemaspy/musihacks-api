/**
 * App module: main controller, wiring all modules together.
 * Handles tab navigation, piano controls, home dashboard, chord palette,
 * progression builder, scale browser, MIDI recordings, and module initialization.
 */

(async function() {
    'use strict';

    // --- Initialize Piano ---
    await Piano.init();

    // Wire piano events to recorder + live chord detection
    let chordDetectTimer = null;
    let liveChordHideTimer = null;
    // Buffer to accumulate recently-played notes for chord detection (500ms window)
    let recentNotes = new Map(); // midi -> timestamp

    Piano.onNoteOn = (midi, velocity, time) => {
        Recorder.onNoteOn(midi, velocity, time);
        recentNotes.set(midi, Date.now());
        scheduleLiveChordDetect();
    };
    Piano.onNoteOff = (midi, time) => {
        Recorder.onNoteOff(midi, time);
        // Don't remove from recentNotes immediately — keep for 500ms
        setTimeout(() => {
            recentNotes.delete(midi);
            scheduleLiveChordDetect();
        }, 500);
        scheduleLiveChordDetect();
    };

    function scheduleLiveChordDetect() {
        clearTimeout(chordDetectTimer);
        chordDetectTimer = setTimeout(detectLiveChord, 60);
    }

    function getDetectionNotes() {
        // Combine currently active notes + recently played notes (within 500ms)
        const active = Piano.getActiveNotes();
        const now = Date.now();
        const recent = [];
        for (const [midi, ts] of recentNotes) {
            if (now - ts < 500) recent.push(midi);
        }
        return [...new Set([...active, ...recent])];
    }

    async function detectLiveChord() {
        const panel = document.getElementById('live-chord-panel');
        const symbolEl = document.getElementById('liveChordSymbol');
        const numeralEl = document.getElementById('liveChordNumeral');
        const functionEl = document.getElementById('liveChordFunction');
        const notesEl = document.getElementById('liveChordNotes');
        const suggestEl = document.getElementById('liveChordSuggestions');
        if (!panel) return;

        const active = getDetectionNotes();
        if (active.length < 2) {
            // Hide after a delay so it doesn't flicker
            clearTimeout(liveChordHideTimer);
            liveChordHideTimer = setTimeout(() => {
                if (getDetectionNotes().length < 2) {
                    panel.classList.remove('active');
                }
            }, 600);
            return;
        }

        clearTimeout(liveChordHideTimer);

        try {
            const resp = await fetch('/api/chords/detect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: active }),
            });
            const data = await resp.json();
            if (!data.detected) {
                symbolEl.textContent = '?';
                numeralEl.textContent = '';
                functionEl.textContent = '';
                functionEl.className = 'live-chord-function';
                notesEl.textContent = active.map(m => Piano.midiToName(m)).join(', ');
                suggestEl.innerHTML = '';
                panel.classList.add('active');
                return;
            }

            const best = data.best;
            symbolEl.textContent = best.symbol || `${best.root}${best.type || ''}`;
            notesEl.textContent = (best.notes || []).join(' - ');
            panel.classList.add('active');

            // Match against current key diatonic chords for function
            let numeral = '';
            let fn = '';
            let fnClass = '';
            if (currentKeyData) {
                const allChords = [...(currentKeyData.diatonic_triads || []), ...(currentKeyData.diatonic_sevenths || [])];
                const detectedPC = Piano.noteToPC(best.root);
                for (const dc of allChords) {
                    if (Piano.noteToPC(dc.root) === detectedPC) {
                        numeral = dc.numeral;
                        const func = dc.function || '';
                        if (func.includes('Tonic')) { fn = 'T'; fnClass = 'fn-t'; }
                        else if (func.includes('Subdominant')) { fn = 'SD'; fnClass = 'fn-sd'; }
                        else if (func.includes('Dominant')) { fn = 'D'; fnClass = 'fn-d'; }
                        break;
                    }
                }
            }
            numeralEl.textContent = numeral;
            functionEl.textContent = fn;
            functionEl.className = 'live-chord-function ' + fnClass;

            // Render old inline suggestion chips (compact fallback)
            suggestEl.innerHTML = '';

            // Render categorized suggestions grid
            if (currentSuggestions) {
                // Update recommendations based on current chord
                try {
                    const sugResp = await fetch('/api/suggestions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            key: currentSuggestions.key,
                            mode: currentSuggestions.mode,
                            current_chord_root: best.root,
                            current_chord_type: best.type || 'major',
                        }),
                    });
                    const freshSug = await sugResp.json();
                    currentSuggestions.recommended = freshSug.recommended;
                } catch (e) {}
                renderSuggestionsGrid(best.symbol || best.root);
            }
        } catch (e) {
            // Detection failed silently
        }
    }

    /**
     * Show chord info in the live panel from a palette button click
     * (doesn't require notes to be physically held on piano)
     */
    function showChordInLivePanel(symbol, notes, chordNotes, formula) {
        const panel = document.getElementById('live-chord-panel');
        const symbolEl = document.getElementById('liveChordSymbol');
        const numeralEl = document.getElementById('liveChordNumeral');
        const functionEl = document.getElementById('liveChordFunction');
        const notesEl = document.getElementById('liveChordNotes');
        const formulaEl = document.getElementById('liveChordFormula');
        const suggestEl = document.getElementById('liveChordSuggestions');
        if (!panel) return;

        symbolEl.textContent = symbol;
        notesEl.textContent = (chordNotes || []).join(' - ');
        if (formulaEl) formulaEl.textContent = formula ? formula.join(' - ') : '';
        panel.classList.add('active');

        // Match against diatonic chords
        let numeral = '';
        let fn = '';
        let fnClass = '';
        if (currentKeyData && chordNotes && chordNotes.length > 0) {
            const allChords = [...(currentKeyData.diatonic_triads || []), ...(currentKeyData.diatonic_sevenths || [])];
            const rootPC = Piano.noteToPC(chordNotes[0]);
            for (const dc of allChords) {
                if (Piano.noteToPC(dc.root) === rootPC) {
                    numeral = dc.numeral;
                    const func = dc.function || '';
                    if (func.includes('Tonic')) { fn = 'T'; fnClass = 'fn-t'; }
                    else if (func.includes('Subdominant')) { fn = 'SD'; fnClass = 'fn-sd'; }
                    else if (func.includes('Dominant')) { fn = 'D'; fnClass = 'fn-d'; }
                    break;
                }
            }
        }
        numeralEl.textContent = numeral;
        functionEl.textContent = fn;
        functionEl.className = 'live-chord-function ' + fnClass;

        // Clear inline suggestions
        if (suggestEl) suggestEl.innerHTML = '';

        // Show categorized suggestions grid
        if (currentSuggestions && chordNotes && chordNotes.length > 0) {
            renderSuggestionsGrid(symbol);
        }

        // Auto-hide (longer when grid is shown)
        clearTimeout(liveChordHideTimer);
        liveChordHideTimer = setTimeout(() => {
            panel.classList.remove('active');
        }, currentSuggestions ? 8000 : 3000);
    }

    /**
     * Render categorized suggestions grid based on cached suggestions data
     */
    function renderSuggestionsGrid(currentChordSymbol) {
        const grid = document.getElementById('liveChordSuggestionsGrid');
        const keyDetect = document.getElementById('liveKeyDetect');
        if (!grid || !currentSuggestions) return;

        const sugDiatonic = document.getElementById('sugDiatonic');
        const sugDiatonic7 = document.getElementById('sugDiatonic7');
        const sugSecDom = document.getElementById('sugSecDom');
        const sugChains = document.getElementById('sugChains');
        const sugModal = document.getElementById('sugModal');

        // Helper: create a chord chip
        function makeChip(symbol, notes, cssClass, badge) {
            const chip = document.createElement('button');
            chip.className = 'suggestion-chip ' + (cssClass || '');
            let html = symbol;
            if (badge) html += `<span class="chip-badge">${badge}</span>`;
            chip.innerHTML = html;
            chip.addEventListener('click', async () => {
                if (Tone.context.state !== 'running') await Tone.start();
                highlightPianoForChord(notes);
                playChordWithSettings(notes);
                showChordInLivePanel(symbol, null, notes);
                renderSuggestionsGrid(symbol);
            });
            return chip;
        }

        // Get recommended ordering
        const recommended = new Set(currentSuggestions.recommended || []);

        // --- Row 1: Diatonic ---
        sugDiatonic.innerHTML = '<span class="sug-label">Diat.</span>';
        const diatonics = currentSuggestions.diatonic || [];
        // Sort: recommended first
        const sortedDiat = [...diatonics].sort((a, b) => {
            const ar = recommended.has(a.symbol) ? 0 : 1;
            const br = recommended.has(b.symbol) ? 0 : 1;
            return ar - br;
        });
        for (const d of sortedDiat) {
            if (d.symbol === currentChordSymbol) continue;
            let cls = 'sug-diatonic';
            const f = (d.function || '').toLowerCase();
            if (f.startsWith('tonic')) cls += ' fn-t';
            else if (f.startsWith('subdominant')) cls += ' fn-sd';
            else if (f.startsWith('dominant')) cls += ' fn-d';
            sugDiatonic.appendChild(makeChip(d.symbol, d.notes, cls, d.numeral));
        }
        sugDiatonic.style.display = sortedDiat.length ? '' : 'none';

        // --- Row 1b: Diatonic Sevenths (incl. m7b5) ---
        sugDiatonic7.innerHTML = '<span class="sug-label">7as</span>';
        const diatonic7s = currentSuggestions.diatonic_sevenths || [];
        for (const d of diatonic7s) {
            if (d.symbol === currentChordSymbol) continue;
            let cls = 'sug-diatonic7';
            const f = (d.function || '').toLowerCase();
            if (f.startsWith('tonic')) cls += ' fn-t';
            else if (f.startsWith('subdominant')) cls += ' fn-sd';
            else if (f.startsWith('dominant')) cls += ' fn-d';
            sugDiatonic7.appendChild(makeChip(d.symbol, d.notes, cls, d.numeral));
        }
        sugDiatonic7.style.display = diatonic7s.length ? '' : 'none';

        // --- Row 2: Secondary Dominants ---
        sugSecDom.innerHTML = '<span class="sug-label">V7/X</span>';
        const secDoms = currentSuggestions.secondary_dominants || [];
        for (const sd of secDoms) {
            sugSecDom.appendChild(makeChip(sd.symbol, sd.notes, 'sug-secdom', '→' + sd.target));
        }
        sugSecDom.style.display = secDoms.length ? '' : 'none';

        // --- Row 3: Dominant Chains ---
        sugChains.innerHTML = '<span class="sug-label">Cadena</span>';
        const chains = currentSuggestions.dominant_chains || [];
        // Show 2-3 most useful chains (to I, to V, to IV)
        const priorityTargets = ['I', 'V', 'IV', 'ii', 'vi'];
        const shownChains = chains
            .filter(c => priorityTargets.includes(c.target_degree))
            .slice(0, 4);
        for (const ch of shownChains) {
            const chainStr = ch.chain.map(c => c.symbol).join('→');
            const allNotes = ch.chain[0]?.notes || [];
            const chip = document.createElement('button');
            chip.className = 'suggestion-chip sug-chain';
            chip.innerHTML = `${chainStr}<span class="chip-badge">→${ch.target}</span>`;
            chip.addEventListener('click', async () => {
                if (Tone.context.state !== 'running') await Tone.start();
                // Play chain sequentially
                for (let i = 0; i < ch.chain.length; i++) {
                    setTimeout(() => {
                        highlightPianoForChord(ch.chain[i].notes);
                        playChordWithSettings(ch.chain[i].notes);
                    }, i * 800);
                }
            });
            sugChains.appendChild(chip);
        }
        sugChains.style.display = shownChains.length ? '' : 'none';

        // --- Row 4: Modal Interchange ---
        sugModal.innerHTML = '<span class="sug-label">Modal</span>';
        const modals = currentSuggestions.modal_interchange || [];
        for (const m of modals) {
            sugModal.appendChild(makeChip(m.symbol, m.notes, 'sug-modal', m.degree));
        }
        sugModal.style.display = modals.length ? '' : 'none';

        grid.style.display = '';

        // Key detection
        if (keyDetect) {
            const k = currentSuggestions.key || '';
            const mode = currentSuggestions.mode || 'major';
            const modeLabel = mode === 'major' ? 'Mayor' : mode === 'natural_minor' ? 'Menor' : mode;
            keyDetect.textContent = `Tonalidad: ${k} ${modeLabel}`;
            keyDetect.style.display = '';
        }
    }

    // --- Initialize Circle of Fifths ---
    await CircleOfFifths.init();

    // --- Initialize new modules ---
    Theory.init();
    HarmonyTools.init();
    Composer.init();
    Chordify.init();

    // --- UI Elements ---
    const btnRecord = document.getElementById('btnRecord');
    const btnStop = document.getElementById('btnStop');
    const btnPlay = document.getElementById('btnPlay');
    const btnAnalyze = document.getElementById('btnAnalyze');
    const btnClear = document.getElementById('btnClear');
    const volumeSlider = document.getElementById('volume');
    const showNoteNames = document.getElementById('showNoteNames');
    const sustainPedal = document.getElementById('sustainPedal');
    const keySelect = document.getElementById('keySelect');
    const modeSelect = document.getElementById('modeSelect');
    const playStyle = document.getElementById('playStyle');
    const bpmInput = document.getElementById('bpmInput');
    const reverbSelect = document.getElementById('reverbSelect');
    const octaveUp = document.getElementById('octaveUp');
    const octaveDown = document.getElementById('octaveDown');
    const octaveLabel = document.getElementById('octaveLabel');
    const inversionSelect = document.getElementById('inversionSelect');
    const scaleOverlay = document.getElementById('scaleOverlay');
    const builderModeToggle = document.getElementById('builderModeToggle');

    // --- State ---
    let currentOctave = 4;
    let currentInversion = 0;
    let builderMode = false;
    let builderChords = []; // [{symbol, notes, numeral, beats}]
    let builderInsertIndex = null; // active insert position (null = append)
    let builderSelectedIdx = null; // selected chord in timeline
    let viewerProg = null; // currently viewed saved progression
    let currentKeyData = null; // last tonality data
    let currentSuggestions = null; // cached suggestions data from /api/suggestions

    // Fifth root mapping (for SUS4 table computation)
    const FIFTH_MAP = {
        'C': 'G', 'G': 'D', 'D': 'A', 'A': 'E', 'E': 'B', 'B': 'F#',
        'F#': 'C#', 'Gb': 'Db', 'Db': 'Ab', 'Ab': 'Eb', 'Eb': 'Bb', 'Bb': 'F', 'F': 'C'
    };

    // --- Tab Navigation ---
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // Home shortcut buttons + back buttons
    document.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => {
            // Theory back button has dynamic behavior managed by Theory module
            if (btn.id === 'theory-back-btn') {
                if (typeof Theory !== 'undefined') {
                    const view = Theory.getCurrentView();
                    if (view === 'lesson') {
                        const unit = Theory.getCurrentUnit();
                        if (unit) { Theory.showUnit(unit); return; }
                    } else if (view === 'unit') {
                        Theory.showDashboard();
                        return;
                    }
                }
            }
            const goto = btn.getAttribute('data-goto');
            if (goto) switchTab(goto);
        });
    });

    function switchTab(targetId) {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        const navTab = document.querySelector(`.nav-tab[data-tab="${targetId}"]`);
        if (navTab) navTab.classList.add('active');

        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');

        // Refresh home stats when switching to home
        if (targetId === 'tab-home') {
            updateHomeStats();
        }
    }

    // --- Studio Sub-navigation ---
    const studioSubnav = document.getElementById('studioSubnav');
    if (studioSubnav) {
        studioSubnav.querySelectorAll('.subnav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sectionId = btn.dataset.section;
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                // Update active state
                studioSubnav.querySelectorAll('.subnav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // IntersectionObserver to highlight active section
        const sectionIds = Array.from(studioSubnav.querySelectorAll('.subnav-btn')).map(b => b.dataset.section);
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    studioSubnav.querySelectorAll('.subnav-btn').forEach(b => {
                        b.classList.toggle('active', b.dataset.section === id);
                    });
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) sectionObserver.observe(el);
        });
    }

    // --- Harmony TOC smooth scroll ---
    document.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Recording Controls ---
    btnRecord.addEventListener('click', async () => {
        if (Tone.context.state !== 'running') await Tone.start();
        Recorder.start();
        btnRecord.classList.add('recording');
        btnRecord.disabled = true;
        btnStop.disabled = false;
        btnPlay.disabled = true;
        btnAnalyze.disabled = true;
        // Enable MIDI save button
        const midiSaveBtn = document.getElementById('btnSaveMidiRec');
        if (midiSaveBtn) midiSaveBtn.disabled = true;
    });

    btnStop.addEventListener('click', () => {
        Recorder.stop();
        btnRecord.classList.remove('recording');
        btnRecord.disabled = false;
        btnStop.disabled = true;
        btnPlay.disabled = !Recorder.hasData();
        btnAnalyze.disabled = !Recorder.hasData();
        // Enable MIDI save button
        const midiSaveBtn = document.getElementById('btnSaveMidiRec');
        if (midiSaveBtn) midiSaveBtn.disabled = !Recorder.hasData();
        const midiStatus = document.getElementById('midiRecStatus');
        if (midiStatus && Recorder.hasData()) {
            midiStatus.textContent = `${Recorder.getNotes().length} notas grabadas - lista para guardar`;
        }
    });

    btnPlay.addEventListener('click', async () => {
        if (Tone.context.state !== 'running') await Tone.start();
        Recorder.playBack();
    });

    btnAnalyze.addEventListener('click', async () => {
        const result = await Analyzer.analyzeRecording();
        if (result) {
            loadChordsForKey(result.key);
        }
    });

    btnClear.addEventListener('click', () => {
        Recorder.clear();
        btnPlay.disabled = true;
        btnAnalyze.disabled = true;
        btnRecord.classList.remove('recording');
        btnRecord.disabled = false;
        btnStop.disabled = true;
        document.getElementById('analysis-section').classList.add('hidden');
        const midiSaveBtn = document.getElementById('btnSaveMidiRec');
        if (midiSaveBtn) midiSaveBtn.disabled = true;
        const midiStatus = document.getElementById('midiRecStatus');
        if (midiStatus) midiStatus.textContent = '';
    });

    // --- Volume ---
    volumeSlider.addEventListener('input', (e) => {
        Piano.setVolume(parseInt(e.target.value));
    });

    // --- Note Names ---
    showNoteNames.addEventListener('change', (e) => {
        Piano.toggleNoteNames(e.target.checked);
    });

    // --- Sustain ---
    sustainPedal.addEventListener('change', (e) => {
        Piano.setSustain(e.target.checked);
    });

    // --- Reverb ---
    if (reverbSelect) {
        reverbSelect.addEventListener('change', (e) => {
            Piano.setReverb(parseFloat(e.target.value));
        });
    }

    // --- Key Selector ---
    keySelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const isMinor = val.endsWith('m');
        // Auto-set mode when selecting a minor key
        if (isMinor && modeSelect && modeSelect.value === 'auto') {
            // auto mode: minor key → natural_minor
        }
        loadChordsForKey(val);
        const circleKey = isMinor ? val.slice(0, -1) : val;
        CircleOfFifths.setKey(circleKey);
        updateScaleOverlay();
    });

    // --- Mode Selector ---
    if (modeSelect) {
        modeSelect.addEventListener('change', () => {
            loadChordsForKey(keySelect.value);
        });
    }

    // --- Play Style ---
    playStyle.addEventListener('change', (e) => {
        Player.setStyle(e.target.value);
    });

    // --- BPM ---
    bpmInput.addEventListener('change', (e) => {
        Player.setBpm(parseInt(e.target.value));
    });

    // --- Octave buttons ---
    function updateOctaveLabel() {
        if (octaveLabel) octaveLabel.textContent = `C${currentOctave}`;
    }
    if (octaveUp) {
        octaveUp.addEventListener('click', () => {
            if (currentOctave < 6) { currentOctave++; updateOctaveLabel(); }
        });
    }
    if (octaveDown) {
        octaveDown.addEventListener('click', () => {
            if (currentOctave > 2) { currentOctave--; updateOctaveLabel(); }
        });
    }

    // --- Inversion selector ---
    if (inversionSelect) {
        inversionSelect.addEventListener('change', (e) => {
            currentInversion = parseInt(e.target.value);
        });
    }

    // --- Scale overlay ---
    if (scaleOverlay) {
        scaleOverlay.addEventListener('change', () => {
            updateScaleOverlay();
        });
    }

    function updateScaleOverlay() {
        const scaleType = scaleOverlay ? scaleOverlay.value : '';
        const key = keySelect.value;

        if (!scaleType) {
            Piano.clearHighlights();
            return;
        }

        fetch(`/api/scales/${encodeURIComponent(key)}/${encodeURIComponent(scaleType)}`)
            .then(r => r.json())
            .then(data => {
                if (data.notes) {
                    Piano.highlightScale(key, data.notes);
                }
            })
            .catch(() => Piano.clearHighlights());
    }

    // --- Circle of Fifths key selection ---
    CircleOfFifths.onKeySelect = (key) => {
        // Try to set the key in the selector (may be major or minor)
        if ([...keySelect.options].some(o => o.value === key)) {
            keySelect.value = key;
        }
        loadChordsForKey(key);
        updateScaleOverlay();
    };

    // ============================================================
    // === BUILDER MODE (Custom Progressions) =====================
    // ============================================================

    if (builderModeToggle) {
        builderModeToggle.addEventListener('change', (e) => {
            builderMode = e.target.checked;
            const hint = document.getElementById('builderHint');
            const strip = document.getElementById('builderStrip');
            if (hint) hint.classList.toggle('hidden', !builderMode);
            if (strip) strip.classList.toggle('hidden', !builderMode);
            updateBuilderInfoBar();
        });
    }

    function updateBuilderInfoBar() {
        const keyDisplay = document.getElementById('builder-key-display');
        const tempoDisplay = document.getElementById('builder-tempo-display');
        if (keyDisplay) {
            const k = keySelect.value;
            const isMinor = k.endsWith('m');
            const rootKey = isMinor ? k.slice(0, -1) : k;
            const modeName = isMinor ? 'Menor' : (MODE_NAMES[modeSelect.value] || 'Mayor');
            keyDisplay.textContent = `${rootKey} ${modeName}`;
        }
        if (tempoDisplay) tempoDisplay.textContent = `${bpmInput.value} BPM`;
    }

    document.getElementById('btnBuilderPlay')?.addEventListener('click', async () => {
        if (builderChords.length === 0) return;
        if (Tone.context.state !== 'running') await Tone.start();
        playBuilderProgression('builder-timeline');
    });

    document.getElementById('btnBuilderSave')?.addEventListener('click', () => {
        if (builderChords.length === 0) return;
        const name = prompt('Nombre de la progresión:');
        if (!name) return;

        const k = keySelect.value;
        const isMinor = k.endsWith('m');
        const rootKey = isMinor ? k.slice(0, -1) : k;
        const mode = isMinor ? 'natural_minor' : modeSelect.value;

        const saved = JSON.parse(localStorage.getItem('musihacks_custom_progressions') || '[]');

        // Check if editing existing
        const editId = builderEditingId || null;
        if (editId) {
            const idx = saved.findIndex(p => p.id === editId);
            if (idx >= 0) {
                saved[idx] = {
                    ...saved[idx],
                    name,
                    key: rootKey,
                    mode,
                    tempo: parseInt(bpmInput.value) || 120,
                    chords: builderChords.map(c => ({
                        symbol: c.symbol,
                        notes: c.notes,
                        numeral: c.numeral || c.symbol,
                        beats: c.beats || 4,
                    })),
                    date: new Date().toLocaleDateString(),
                };
            }
            builderEditingId = null;
        } else {
            saved.push({
                id: Date.now(),
                name,
                key: rootKey,
                mode,
                tempo: parseInt(bpmInput.value) || 120,
                chords: builderChords.map(c => ({
                    symbol: c.symbol,
                    notes: c.notes,
                    numeral: c.numeral || c.symbol,
                    beats: c.beats || 4,
                })),
                date: new Date().toLocaleDateString(),
            });
        }
        localStorage.setItem('musihacks_custom_progressions', JSON.stringify(saved));
        renderSavedProgressions();
        clearBuilder();
    });

    let builderEditingId = null; // id of progression being edited

    document.getElementById('btnBuilderClear')?.addEventListener('click', clearBuilder);

    // Viewer panel buttons
    document.getElementById('btn-viewer-play')?.addEventListener('click', async () => {
        if (!viewerProg) return;
        if (Tone.context.state !== 'running') await Tone.start();
        playViewerProgression();
    });
    document.getElementById('btn-viewer-edit')?.addEventListener('click', () => {
        if (!viewerProg) return;
        editProgressionInBuilder(viewerProg);
    });
    document.getElementById('btn-viewer-close')?.addEventListener('click', closeViewer);

    // Toggle para sugerencias del builder
    document.getElementById('toggle-builder-suggestions')?.addEventListener('click', function() {
        const content = document.getElementById('builder-suggestions-content');
        const icon = this.querySelector('.toggle-icon');
        if (content.style.display === 'none') {
            content.style.display = '';
            icon.textContent = '▼';
        } else {
            content.style.display = 'none';
            icon.textContent = '▶';
        }
    });

    // Cerrar sugerencias dinámicas
    document.getElementById('close-dynamic-suggestions')?.addEventListener('click', function() {
        const panel = document.getElementById('dynamic-suggestions-panel');
        if (panel) panel.style.display = 'none';
    });

    function addToBuilder(symbol, notes, numeral) {
        const chord = { symbol, notes, numeral: numeral || symbol, beats: 4 };
        if (builderInsertIndex !== null && builderInsertIndex >= 0 && builderInsertIndex <= builderChords.length) {
            builderChords.splice(builderInsertIndex, 0, chord);
            builderInsertIndex = null;
        } else {
            builderChords.push(chord);
        }
        renderBuilderTimeline();
    }

    async function renderSecondarySus4(rootKey, mode = 'major') {
        const container = document.getElementById('secondary-sus4');
        if (!container) return;
        container.innerHTML = '';

        try {
            // Obtener subdominantes secundarias para saber los targets
            const secSubResp = await fetch(`/api/secondary-subdominants/${encodeURIComponent(rootKey)}?mode=${encodeURIComponent(mode)}`);
            const secSubData = await secSubResp.json();

            for (const ss of secSubData) {
                // Calcular V7sus4/target
                const targetPc = Piano.noteToPC(ss.target);
                const vPc = (targetPc + 7) % 12;
                const vRoot = Piano.pcToNote(vPc, false);

                try {
                    const sus4Resp = await fetch(`/api/chords/${encodeURIComponent(vRoot)}/7sus4`);
                    const sus4 = await sus4Resp.json();

                    const btn = document.createElement('button');
                    btn.className = 'chord-btn chord-with-arrow';
                    btn.innerHTML = `
                        <span class="chord-main">${sus4.symbol}</span>
                        <span class="chord-arrow">→</span>
                        <span class="chord-target">${ss.target} (${ss.target_degree})</span>
                    `;
                    btn.title = `V7sus4/${ss.target_degree}: ${sus4.symbol} → ${ss.target}`;

                    btn.addEventListener('click', async (e) => {
                        if (Tone.context.state !== 'running') await Tone.start();
                        highlightPianoForChord(sus4.notes);
                        playChordWithSettings(sus4.notes);
                        showDynamicSuggestions(sus4.symbol, sus4.notes);

                        if (e.shiftKey || e.ctrlKey) {
                            addToBuilder(sus4.symbol, sus4.notes, `V7sus4/${ss.target_degree}`);
                        }
                    });

                    container.appendChild(btn);
                } catch (e) {}
            }
        } catch (e) {
            console.warn('Error loading secondary sus4:', e);
        }
    }

    async function renderSus4Palette(rootKey, mode = 'major') {
        const container = document.getElementById('sus4-palette-grid');
        if (!container) return;
        container.innerHTML = '';

        try {
            const tonResp = await fetch(`/api/tonality/${encodeURIComponent(rootKey)}/${encodeURIComponent(mode)}`);
            const tonData = await tonResp.json();
            const diatonic = tonData.diatonic_triads || [];

            // Targets: grados diatónicos (marcar I como principal, sin duplicados)
            const seen = new Set();
            const targets = [];
            // Primero el I
            targets.push({ root: rootKey, symbol: rootKey, numeral: 'I', isMain: true });
            seen.add(rootKey);
            for (const ch of diatonic) {
                const r = ch.notes[0];
                if (!seen.has(r)) {
                    seen.add(r);
                    targets.push({ root: r, symbol: ch.symbol, numeral: ch.numeral, isMain: false });
                }
            }

            for (const target of targets) {
                const targetPc = Piano.noteToPC(target.root);
                const vPc = (targetPc + 7) % 12;
                const vRoot = Piano.pcToNote(vPc, false);

                try {
                    // Fetch los 3 acordes de la cadena: V7sus4, V7, target
                    const [sus4Resp, dom7Resp] = await Promise.all([
                        fetch(`/api/chords/${encodeURIComponent(vRoot)}/7sus4`),
                        fetch(`/api/chords/${encodeURIComponent(vRoot)}/dominant7`)
                    ]);
                    const sus4Data = await sus4Resp.json();
                    const dom7Data = await dom7Resp.json();

                    const row = document.createElement('div');
                    row.className = 'sus4-chain' + (target.isMain ? ' main-v' : '');

                    // 3 botones: V7sus4 → V7 → target
                    const chainItems = [
                        { sym: sus4Data.symbol, notes: sus4Data.notes, label: 'sus4' },
                        { sym: dom7Data.symbol, notes: dom7Data.notes, label: 'V7' },
                        { sym: target.symbol, notes: null, label: target.numeral }
                    ];

                    chainItems.forEach((item, i) => {
                        if (i > 0) {
                            const arrow = document.createElement('span');
                            arrow.className = 'chain-arrow';
                            arrow.textContent = '→';
                            row.appendChild(arrow);
                        }
                        const btn = document.createElement('button');
                        btn.className = 'chain-btn' + (i === 0 ? ' chain-sus4' : i === 1 ? ' chain-dom' : ' chain-tonic');
                        btn.innerHTML = `<span class="cb-sym">${item.sym}</span>`;
                        btn.title = item.label;

                        if (item.notes) {
                            btn.addEventListener('click', async (e) => {
                                if (Tone.context.state !== 'running') await Tone.start();
                                highlightPianoForChord(item.notes);
                                playChordWithSettings(item.notes);
                                if (builderMode) showDynamicSuggestions(item.sym, item.notes);
                                if (e.shiftKey || e.ctrlKey) addToBuilder(item.sym, item.notes, item.label);
                            });
                        }
                        row.appendChild(btn);
                    });

                    // Botón play secuencia completa
                    const playBtn = document.createElement('button');
                    playBtn.className = 'chain-play-btn';
                    playBtn.textContent = '▶';
                    playBtn.title = 'Reproducir cadena completa';
                    playBtn.addEventListener('click', async () => {
                        if (Tone.context.state !== 'running') await Tone.start();
                        const bt = 60 / (parseInt(document.getElementById('bpmInput')?.value) || 120);
                        const now = Tone.now();
                        const oct = currentOctave;
                        function buildN(notes) {
                            const r = []; let o = oct, prev = -1;
                            for (const n of notes) {
                                const pc = Piano.noteToPC(n);
                                if (prev >= 0 && pc <= prev) o++;
                                r.push(n + o); prev = pc;
                            }
                            return r;
                        }
                        // sus4
                        highlightPianoForChord(sus4Data.notes);
                        for (const n of buildN(sus4Data.notes)) Piano.playNote(n, bt * 1.8, now, 0.7);
                        // V7
                        setTimeout(() => highlightPianoForChord(dom7Data.notes), bt * 2 * 1000);
                        for (const n of buildN(dom7Data.notes)) Piano.playNote(n, bt * 1.8, now + bt * 2, 0.7);
                        // Target (fetch on the fly)
                        setTimeout(async () => {
                            try {
                                // Determine target chord type
                                const tType = target.symbol.includes('dim') ? 'diminished' :
                                              target.symbol.includes('m') && !target.symbol.includes('maj') ? 'minor' : 'major';
                                const tResp = await fetch(`/api/chords/${encodeURIComponent(target.root)}/${tType}`);
                                const tData = await tResp.json();
                                highlightPianoForChord(tData.notes);
                                for (const n of buildN(tData.notes)) Piano.playNote(n, bt * 3, Tone.now(), 0.8);
                            } catch (e) {}
                        }, bt * 4 * 1000);
                    });
                    row.appendChild(playBtn);

                    container.appendChild(row);
                } catch (e) {}
            }
        } catch (e) {
            console.warn('Error loading sus4 palette:', e);
        }
    }

    async function renderChopinBassChords(rootKey, mode = 'major') {
        const container = document.getElementById('chopin-bass-chords');
        if (!container) return;
        container.innerHTML = '';

        try {
            // Obtener acordes diatónicos para generar bajo Chopin de cada uno
            const tonResp = await fetch(`/api/tonality/${encodeURIComponent(rootKey)}/${encodeURIComponent(mode)}`);
            const tonData = await tonResp.json();
            const diatonic = tonData.diatonic_triads || [];

            for (const chord of diatonic) {
                const root = chord.notes[0];

                try {
                    const chopinResp = await fetch(`/api/harmony/chopin-bass/${encodeURIComponent(root)}`);
                    const chopinData = await chopinResp.json();

                    if (chopinData.bass_chord) {
                        const btn = document.createElement('button');
                        btn.className = 'chord-btn chopin-btn';
                        btn.innerHTML = `
                            <span>${chopinData.bass_chord.symbol}</span>
                            <span class="numeral">Bajo ${chord.numeral}</span>
                        `;
                        btn.title = `Bajo Chopin para ${chord.symbol}`;

                        btn.addEventListener('click', async (e) => {
                            if (Tone.context.state !== 'running') await Tone.start();
                            highlightPianoForChord(chopinData.bass_chord.notes);
                            playChordWithSettings(chopinData.bass_chord.notes);
                            showDynamicSuggestions(chopinData.bass_chord.symbol, chopinData.bass_chord.notes);

                            if (e.shiftKey || e.ctrlKey) {
                                addToBuilder(chopinData.bass_chord.symbol, chopinData.bass_chord.notes, `Chopin/${chord.numeral}`);
                            }
                        });

                        container.appendChild(btn);
                    }
                } catch (e) {}
            }
        } catch (e) {
            console.warn('Error loading Chopin bass:', e);
        }
    }

    async function showDynamicSuggestions(chordSymbol, chordNotes) {
        const panel = document.getElementById('dynamic-suggestions-panel');
        const grid = document.getElementById('dynamic-suggestions-grid');
        const chordLabel = document.getElementById('suggest-for-chord');

        if (!panel || !grid || !chordLabel) return;

        chordLabel.textContent = chordSymbol;
        panel.style.display = '';
        grid.innerHTML = '';

        const k = keySelect.value;
        const isMinor = k.endsWith('m');
        const rootKey = isMinor ? k.slice(0, -1) : k;
        const mode = isMinor ? 'natural_minor' : modeSelect.value;

        try {
            const resp = await fetch('/api/builder/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: rootKey, mode, chords: [chordSymbol] }),
            });
            const data = await resp.json();

            if (!data.groups) return;

            // Organizar por función
            const functionGroups = [
                { key: 'resolution', label: '✓ Resolución (Reposo)', color: '#4caf50' },
                { key: 'movement', label: '→ Movimiento (Preparación)', color: '#2196f3' },
                { key: 'tension', label: '⚡ Tensión (Dominante)', color: '#e94560' },
                { key: 'color', label: '✨ Color (Modal)', color: '#9c27b0' },
                { key: 'chromatic', label: '♯♭ Cromático', color: '#ff9800' },
            ];

            for (const fg of functionGroups) {
                const items = data.groups[fg.key];
                if (!items || items.length === 0) continue;

                const section = document.createElement('div');
                section.className = 'suggestion-function-group';
                section.innerHTML = `<h5 style="color:${fg.color};font-size:0.75rem;margin-bottom:4px">${fg.label}</h5>`;

                const btnContainer = document.createElement('div');
                btnContainer.className = 'chord-buttons';
                btnContainer.style.gap = '4px';

                for (const sug of items.slice(0, 6)) { // Max 6 por grupo
                    const btn = document.createElement('button');
                    btn.className = 'chord-btn suggestion-chord-btn';
                    btn.style.borderColor = fg.color;
                    btn.innerHTML = `
                        <span>${sug.symbol}</span>
                        <span class="numeral">${sug.numeral}</span>
                    `;
                    btn.title = sug.usage_hint || sug.reason;

                    btn.addEventListener('click', async (e) => {
                        if (Tone.context.state !== 'running') await Tone.start();
                        if (sug.notes && sug.notes.length > 0) {
                            highlightPianoForChord(sug.notes);
                            playChordWithSettings(sug.notes);
                        }
                        if (e.shiftKey || e.ctrlKey) {
                            addToBuilder(sug.symbol, sug.notes, sug.numeral);
                        }
                    });

                    btnContainer.appendChild(btn);
                }

                section.appendChild(btnContainer);
                grid.appendChild(section);
            }
        } catch (e) {
            console.warn('Error loading dynamic suggestions:', e);
        }
    }

    function renderBuilderTimeline() {
        const container = document.getElementById('builder-timeline');
        if (!container) return;

        container.innerHTML = '';
        updateBuilderInfoBar();

        if (builderChords.length === 0) {
            container.innerHTML = '<div style="padding:12px;color:var(--text-dim);font-size:0.82rem;text-align:center">Haz click en acordes de la paleta para agregarlos</div>';
            document.getElementById('builder-pianos').style.display = 'none';
        }

        // Insert button at start
        container.appendChild(_createTimelineInsertBtn(0));

        builderChords.forEach((chord, idx) => {
            const btn = document.createElement('button');
            btn.className = 'timeline-chord' + (builderSelectedIdx === idx ? ' builder-chord-selected' : '');
            btn.dataset.index = idx;

            // Proportional width: 1 beat = ~22px
            const beats = chord.beats || 4;
            const width = Math.round(beats * 22);
            btn.style.minWidth = width + 'px';
            btn.style.width = width + 'px';

            // Beat dividers
            let dividersHtml = '<div class="beat-dividers">';
            for (let b = 0; b < beats; b++) dividersHtml += '<div class="beat-divider"></div>';
            dividersHtml += '</div>';

            // Numeral label
            const numHtml = chord.numeral ? `<span class="chord-numeral">${_escHtml(chord.numeral)}</span>` : '';

            // Symbol with superscript
            let symbolHtml = _escHtml(chord.symbol);
            symbolHtml = symbolHtml.replace(/(maj7|m7b5|m7|m|7|dim|aug|sus[24]|add9|6)$/i, '<sup>$1</sup>');

            // Beats control
            const beatsCtrl = `<div class="chord-beats-control">
                <button data-action="beats-down" title="Reducir duración">&minus;</button>
                <button data-action="beats-up" title="Aumentar duración">+</button>
            </div>`;

            // Delete button
            const deleteBtn = `<button class="chord-delete-btn" data-action="delete" title="Eliminar">&times;</button>`;

            btn.innerHTML = `${dividersHtml}${numHtml}<span class="chord-symbol">${symbolHtml}</span>${beatsCtrl}${deleteBtn}`;

            // Drag-and-drop
            btn.draggable = true;
            btn.addEventListener('dragstart', (e) => {
                btn.classList.add('dragging');
                e.dataTransfer.setData('text/plain', idx);
                e.dataTransfer.effectAllowed = 'move';
            });
            btn.addEventListener('dragend', () => {
                btn.classList.remove('dragging');
                container.querySelectorAll('.timeline-chord').forEach(p => p.classList.remove('drag-over'));
            });
            btn.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                btn.classList.add('drag-over');
            });
            btn.addEventListener('dragleave', () => btn.classList.remove('drag-over'));
            btn.addEventListener('drop', (e) => {
                e.preventDefault();
                btn.classList.remove('drag-over');
                const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
                const toIdx = parseInt(btn.dataset.index);
                if (fromIdx !== toIdx && !isNaN(fromIdx)) {
                    const [moved] = builderChords.splice(fromIdx, 1);
                    builderChords.splice(toIdx, 0, moved);
                    builderSelectedIdx = toIdx;
                    renderBuilderTimeline();
                }
            });

            // Click to select
            btn.addEventListener('click', (e) => {
                if (e.target.dataset.action) return; // handled below
                builderSelectedIdx = (builderSelectedIdx === idx) ? null : idx;
                renderBuilderTimeline();
                updateBuilderMiniPianos();
            });

            // Action buttons
            btn.querySelectorAll('[data-action]').forEach(ab => {
                ab.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = ab.dataset.action;
                    if (action === 'delete') {
                        builderChords.splice(idx, 1);
                        if (builderSelectedIdx === idx) builderSelectedIdx = null;
                        else if (builderSelectedIdx > idx) builderSelectedIdx--;
                        renderBuilderTimeline();
                        updateBuilderMiniPianos();
                    } else if (action === 'beats-up') {
                        chord.beats = Math.min(16, (chord.beats || 4) + 1);
                        renderBuilderTimeline();
                    } else if (action === 'beats-down') {
                        chord.beats = Math.max(1, (chord.beats || 4) - 1);
                        renderBuilderTimeline();
                    }
                });
            });

            container.appendChild(btn);
            container.appendChild(_createTimelineInsertBtn(idx + 1));
        });

        const playBtn = document.getElementById('btnBuilderPlay');
        const saveBtn = document.getElementById('btnBuilderSave');
        if (playBtn) playBtn.disabled = builderChords.length === 0;
        if (saveBtn) saveBtn.disabled = builderChords.length === 0;

        fetchAndRenderBuilderSuggestions();
        fetchAndRenderEnrichments();
    }

    function _createTimelineInsertBtn(idx) {
        const btn = document.createElement('button');
        btn.className = 'timeline-insert-btn' + (builderInsertIndex === idx ? ' active' : '');
        btn.textContent = '+';
        btn.title = `Insertar acorde en posición ${idx + 1}`;
        btn.addEventListener('click', () => {
            if (builderInsertIndex === idx) {
                builderInsertIndex = null;
            } else {
                builderInsertIndex = idx;
            }
            document.querySelectorAll('.timeline-insert-btn').forEach(b => b.classList.remove('active'));
            if (builderInsertIndex !== null) btn.classList.add('active');
        });
        return btn;
    }

    function _escHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function updateBuilderMiniPianos() {
        const pianos = document.getElementById('builder-pianos');
        if (!pianos) return;

        if (builderSelectedIdx === null || builderChords.length === 0) {
            pianos.style.display = 'none';
            return;
        }

        pianos.style.display = '';
        const chord = builderChords[builderSelectedIdx];
        const nextChord = builderSelectedIdx + 1 < builderChords.length ? builderChords[builderSelectedIdx + 1] : null;

        // Current chord
        if (chord && chord.notes && chord.notes.length > 0) {
            const chordObj = { notes: chord.notes, inversion: 0, bass: null };
            const { midiNotes, rootMidi } = Chordify.chordToMidiNotes(chordObj);
            Chordify.renderMiniPiano('builder-piano-current', midiNotes, rootMidi);
            const nameEl = document.getElementById('builder-piano-chord-name');
            if (nameEl) nameEl.textContent = chord.symbol;
        } else {
            Chordify.renderMiniPiano('builder-piano-current', [], null);
            const nameEl = document.getElementById('builder-piano-chord-name');
            if (nameEl) nameEl.textContent = '-';
        }

        // Next chord
        if (nextChord && nextChord.notes && nextChord.notes.length > 0) {
            const chordObj = { notes: nextChord.notes, inversion: 0, bass: null };
            const { midiNotes, rootMidi } = Chordify.chordToMidiNotes(chordObj);
            Chordify.renderMiniPiano('builder-piano-next', midiNotes, rootMidi);
            const nameEl = document.getElementById('builder-piano-next-name');
            if (nameEl) nameEl.textContent = nextChord.symbol;
        } else {
            Chordify.renderMiniPiano('builder-piano-next', [], null);
            const nameEl = document.getElementById('builder-piano-next-name');
            if (nameEl) nameEl.textContent = '-';
        }
    }

    async function playBuilderProgression(timelineId) {
        const chordNotes = [];
        const beatsArr = [];
        for (const chord of builderChords) {
            chordNotes.push(buildChordNoteNames(chord.notes, currentOctave));
            beatsArr.push(chord.beats || 4);
        }
        await Player.playProgression(chordNotes, {
            beatsPerChord: beatsArr,
            onChordChange: (idx) => {
                // Highlight active chord in timeline
                const container = document.getElementById(timelineId);
                if (!container) return;
                container.querySelectorAll('.timeline-chord.active').forEach(el => el.classList.remove('active'));
                if (idx >= 0) {
                    const el = container.querySelector(`.timeline-chord[data-index="${idx}"]`);
                    if (el) el.classList.add('active');
                    // Update mini pianos too
                    builderSelectedIdx = idx;
                    updateBuilderMiniPianos();
                }
            },
        });
    }

    async function fetchAndRenderBuilderSuggestions() {
        const container = document.getElementById('builderSuggestions');
        if (!container) return;
        container.innerHTML = '';

        if (builderChords.length === 0) return;

        const k = keySelect.value;
        const isMinor = k.endsWith('m');
        const rootKey = isMinor ? k.slice(0, -1) : k;
        const mode = isMinor ? 'natural_minor' : modeSelect.value;
        const chordSymbols = builderChords.map(c => c.symbol);

        try {
            const resp = await fetch('/api/builder/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: rootKey, mode, chords: chordSymbols }),
            });
            const data = await resp.json();
            if (!data.groups) return;

            const groupConfig = [
                { key: 'resolution', label: 'Resolución', cssClass: 'sug-resolution' },
                { key: 'movement', label: 'Movimiento', cssClass: 'sug-movement' },
                { key: 'tension', label: 'Tensión', cssClass: 'sug-tension' },
                { key: 'color', label: 'Color', cssClass: 'sug-color' },
                { key: 'chromatic', label: 'Cromatismo', cssClass: 'sug-chromatic' },
            ];

            for (const gc of groupConfig) {
                const items = data.groups[gc.key];
                if (!items || items.length === 0) continue;

                const row = document.createElement('div');
                row.className = 'builder-sug-row';

                const label = document.createElement('span');
                label.className = `builder-sug-label ${gc.cssClass}`;
                label.textContent = gc.label;
                row.appendChild(label);

                for (const sug of items) {
                    const chip = document.createElement('button');
                    chip.className = `builder-sug-chip ${gc.cssClass}`;
                    chip.textContent = sug.symbol;

                    // Build tooltip with usage hint
                    let tooltipText = `${sug.numeral} — ${sug.reason}`;
                    if (sug.usage_hint) {
                        tooltipText += `\n💡 ${sug.usage_hint}`;
                    }
                    chip.title = tooltipText;

                    chip.addEventListener('click', async (e) => {
                        if (Tone.context.state !== 'running') await Tone.start();
                        if (sug.notes && sug.notes.length > 0) {
                            highlightPianoForChord(sug.notes);
                            playChordWithSettings(sug.notes);
                        }
                        // Solo agregar con Shift/Ctrl+Click
                        if (e.shiftKey || e.ctrlKey) {
                            addToBuilder(sug.symbol, sug.notes, sug.numeral);
                        }
                    });
                    row.appendChild(chip);
                }

                container.appendChild(row);
            }
        } catch (e) {
            // Suggestion fetch failed silently
        }
    }

    async function fetchAndRenderEnrichments() {
        const container = document.getElementById('builderEnrichments');
        if (!container) return;
        container.innerHTML = '';

        if (builderChords.length < 2) return;

        const rootKey = keySelect.value.endsWith('m') ? keySelect.value.slice(0, -1) : keySelect.value;
        const chordSymbols = builderChords.map(c => c.symbol);

        try {
            const resp = await fetch('/api/progressions/enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: rootKey, chords: chordSymbols }),
            });
            const data = await resp.json();
            if (!Array.isArray(data)) return;

            const typeColors = {
                secondary_dominant: 'enrich-dominant',
                secondary_subdominant: 'enrich-subdominant',
                tritone_sub: 'enrich-tritone',
                chopin_bass: 'enrich-chopin',
                passing_dim: 'enrich-dim',
            };

            for (let itemIdx = 0; itemIdx < data.length; itemIdx++) {
                const item = data[itemIdx];
                if (!item.enrichments || item.enrichments.length === 0) continue;

                const row = document.createElement('div');
                row.className = 'enrich-row';

                const label = document.createElement('span');
                label.className = 'enrich-chord-label';
                label.textContent = item.chord;
                row.appendChild(label);

                for (const en of item.enrichments) {
                    const chip = document.createElement('button');
                    chip.className = `enrich-chip ${typeColors[en.type] || ''}`;
                    chip.textContent = `${en.label}: ${en.symbol}`;
                    chip.title = en.description;
                    chip.addEventListener('click', async () => {
                        if (Tone.context.state !== 'running') await Tone.start();
                        if (en.notes && en.notes.length > 0) {
                            highlightPianoForChord(en.notes);
                            playChordWithSettings(en.notes);
                        }
                    });
                    row.appendChild(chip);

                    // [+] insert button for each enrichment
                    const insertBtn = document.createElement('button');
                    insertBtn.className = 'enrich-insert-btn';
                    insertBtn.textContent = '[+]';
                    insertBtn.title = `Insertar ${en.symbol} en la progresión`;
                    const capturedIdx = itemIdx;
                    const capturedEn = en;
                    insertBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        if (Tone.context.state !== 'running') await Tone.start();
                        if (capturedEn.notes && capturedEn.notes.length > 0) {
                            highlightPianoForChord(capturedEn.notes);
                            playChordWithSettings(capturedEn.notes);
                        }
                        // Insert based on enrichment position
                        const insertAt = capturedEn.position === 'before' ? capturedIdx : capturedIdx + 1;
                        builderChords.splice(insertAt, 0, {
                            symbol: capturedEn.symbol,
                            notes: capturedEn.notes,
                            numeral: capturedEn.label || capturedEn.symbol,
                            beats: 4,
                        });
                        renderBuilderTimeline();
                    });
                    row.appendChild(insertBtn);
                }

                container.appendChild(row);
            }
        } catch (e) {
            // Enrichment fetch failed silently
        }
    }

    function clearBuilder() {
        builderChords = [];
        builderInsertIndex = null;
        builderSelectedIdx = null;
        builderEditingId = null;
        renderBuilderTimeline();
        updateBuilderMiniPianos();
    }

    // --- Saved Progressions (enhanced) ---

    function _normalizeSavedProg(prog) {
        // Handle both new and legacy save formats
        if (Array.isArray(prog.chords) && prog.chords.length > 0 && typeof prog.chords[0] === 'object') {
            return prog; // new format
        }
        // Legacy format: chords is array of symbols, notes is array of note-arrays
        const chords = [];
        const symbols = prog.chords || [];
        const noteArrays = prog.notes || [];
        const numerals = prog.numerals || symbols;
        for (let i = 0; i < symbols.length; i++) {
            chords.push({
                symbol: symbols[i],
                notes: noteArrays[i] || [],
                numeral: numerals[i] || symbols[i],
                beats: 4,
            });
        }
        return {
            ...prog,
            chords,
            key: prog.key || 'C',
            mode: prog.mode || 'major',
            tempo: prog.tempo || 120,
        };
    }

    function renderSavedProgressions() {
        const container = document.getElementById('saved-progressions');
        if (!container) return;

        const saved = JSON.parse(localStorage.getItem('musihacks_custom_progressions') || '[]');
        container.innerHTML = '';

        if (saved.length === 0) return;

        for (const rawProg of saved) {
            const prog = _normalizeSavedProg(rawProg);

            const card = document.createElement('div');
            card.className = 'saved-prog-card';

            const chordsStr = prog.chords.map(c => c.numeral || c.symbol).join(' - ');
            const modeName = prog.mode === 'natural_minor' ? 'menor' :
                             prog.mode === 'harmonic_minor' ? 'arm.' :
                             prog.mode === 'major' ? 'Mayor' : (prog.mode || 'Mayor');
            const metaStr = `${prog.key || 'C'} ${modeName} | ${prog.tempo || 120} BPM`;

            card.innerHTML = `
                <div class="prog-name">${_escHtml(prog.name)}</div>
                <div class="prog-meta">${_escHtml(metaStr)}</div>
                <div class="prog-chords">${_escHtml(chordsStr)}</div>
                <button class="prog-delete" data-id="${prog.id}">&times;</button>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('prog-delete')) {
                    e.stopPropagation();
                    const filtered = saved.filter(p => p.id !== prog.id);
                    localStorage.setItem('musihacks_custom_progressions', JSON.stringify(filtered));
                    renderSavedProgressions();
                    closeViewer();
                    return;
                }
                openProgressionViewer(prog);
            });

            container.appendChild(card);
        }
    }

    // --- Viewer Panel ---

    function openProgressionViewer(prog) {
        viewerProg = prog;
        const viewer = document.getElementById('progression-viewer');
        if (!viewer) return;
        viewer.classList.remove('hidden');

        const modeName = prog.mode === 'natural_minor' ? 'menor' :
                         prog.mode === 'harmonic_minor' ? 'arm.' :
                         prog.mode === 'major' ? 'Mayor' : (prog.mode || 'Mayor');

        document.getElementById('viewer-title').textContent = prog.name;
        document.getElementById('viewer-key').textContent = `${prog.key || 'C'} ${modeName}`;
        document.getElementById('viewer-tempo').textContent = `${prog.tempo || 120} BPM`;

        renderViewerTimeline(prog);
        updateViewerMiniPianos(0);
    }

    function renderViewerTimeline(prog) {
        const container = document.getElementById('viewer-timeline');
        if (!container) return;
        container.innerHTML = '';

        const chords = prog.chords;
        chords.forEach((chord, idx) => {
            const btn = document.createElement('button');
            btn.className = 'timeline-chord';
            btn.dataset.index = idx;

            const beats = chord.beats || 4;
            const width = Math.round(beats * 22);
            btn.style.minWidth = width + 'px';
            btn.style.width = width + 'px';

            let dividersHtml = '<div class="beat-dividers">';
            for (let b = 0; b < beats; b++) dividersHtml += '<div class="beat-divider"></div>';
            dividersHtml += '</div>';

            const numHtml = chord.numeral ? `<span class="chord-numeral">${_escHtml(chord.numeral)}</span>` : '';
            let symbolHtml = _escHtml(chord.symbol);
            symbolHtml = symbolHtml.replace(/(maj7|m7b5|m7|m|7|dim|aug|sus[24]|add9|6)$/i, '<sup>$1</sup>');

            btn.innerHTML = `${dividersHtml}${numHtml}<span class="chord-symbol">${symbolHtml}</span>`;

            btn.addEventListener('click', () => {
                updateViewerMiniPianos(idx);
                // Highlight selected
                container.querySelectorAll('.timeline-chord.builder-chord-selected').forEach(el => el.classList.remove('builder-chord-selected'));
                btn.classList.add('builder-chord-selected');
            });

            container.appendChild(btn);
        });
    }

    function updateViewerMiniPianos(idx) {
        if (!viewerProg) return;
        const chords = viewerProg.chords;
        const chord = chords[idx];
        const nextChord = idx + 1 < chords.length ? chords[idx + 1] : null;

        if (chord && chord.notes && chord.notes.length > 0) {
            const chordObj = { notes: chord.notes, inversion: 0, bass: null };
            const { midiNotes, rootMidi } = Chordify.chordToMidiNotes(chordObj);
            Chordify.renderMiniPiano('viewer-piano-current', midiNotes, rootMidi);
            const nameEl = document.getElementById('viewer-piano-chord-name');
            if (nameEl) nameEl.textContent = chord.symbol;
        } else {
            Chordify.renderMiniPiano('viewer-piano-current', [], null);
            const nameEl = document.getElementById('viewer-piano-chord-name');
            if (nameEl) nameEl.textContent = '-';
        }

        if (nextChord && nextChord.notes && nextChord.notes.length > 0) {
            const chordObj = { notes: nextChord.notes, inversion: 0, bass: null };
            const { midiNotes, rootMidi } = Chordify.chordToMidiNotes(chordObj);
            Chordify.renderMiniPiano('viewer-piano-next', midiNotes, rootMidi);
            const nameEl = document.getElementById('viewer-piano-next-name');
            if (nameEl) nameEl.textContent = nextChord.symbol;
        } else {
            Chordify.renderMiniPiano('viewer-piano-next', [], null);
            const nameEl = document.getElementById('viewer-piano-next-name');
            if (nameEl) nameEl.textContent = '-';
        }
    }

    async function playViewerProgression() {
        if (!viewerProg) return;
        const chords = viewerProg.chords;
        const chordNotes = [];
        const beatsArr = [];

        for (const chord of chords) {
            if (chord.notes && chord.notes.length > 0) {
                chordNotes.push(buildChordNoteNames(chord.notes, currentOctave));
            } else {
                // Try to fetch notes for legacy chords
                try {
                    const parsed = parseChordSymbol(chord.symbol);
                    const resp = await fetch(`/api/chords/${encodeURIComponent(parsed.root)}/${encodeURIComponent(parsed.type)}`);
                    const data = await resp.json();
                    chordNotes.push(buildChordNoteNames(data.notes, currentOctave));
                } catch (e) {
                    chordNotes.push([]);
                }
            }
            beatsArr.push(chord.beats || 4);
        }

        const tempo = viewerProg.tempo || 120;
        Player.setBpm(tempo);

        await Player.playProgression(chordNotes, {
            beatsPerChord: beatsArr,
            onChordChange: (idx) => {
                const container = document.getElementById('viewer-timeline');
                if (!container) return;
                container.querySelectorAll('.timeline-chord.active').forEach(el => el.classList.remove('active'));
                container.querySelectorAll('.timeline-chord.builder-chord-selected').forEach(el => el.classList.remove('builder-chord-selected'));
                if (idx >= 0) {
                    const el = container.querySelector(`.timeline-chord[data-index="${idx}"]`);
                    if (el) el.classList.add('active');
                    updateViewerMiniPianos(idx);
                }
            },
            onDone: () => {
                // Restore original BPM
                Player.setBpm(parseInt(bpmInput.value) || 120);
            },
        });
    }

    function editProgressionInBuilder(prog) {
        // Load into builder
        builderEditingId = prog.id;
        builderChords = prog.chords.map(c => ({
            symbol: c.symbol,
            notes: c.notes || [],
            numeral: c.numeral || c.symbol,
            beats: c.beats || 4,
        }));
        builderSelectedIdx = null;
        builderInsertIndex = null;

        // Set key/mode/tempo
        if (prog.key) {
            const k = prog.mode === 'natural_minor' ? prog.key + 'm' : prog.key;
            if ([...keySelect.options].some(o => o.value === k)) {
                keySelect.value = k;
            }
        }
        if (prog.tempo) bpmInput.value = prog.tempo;

        // Show builder
        builderMode = true;
        if (builderModeToggle) builderModeToggle.checked = true;
        const hint = document.getElementById('builderHint');
        const strip = document.getElementById('builderStrip');
        if (hint) hint.classList.toggle('hidden', false);
        if (strip) strip.classList.toggle('hidden', false);

        renderBuilderTimeline();
        updateBuilderMiniPianos();
        closeViewer();

        // Scroll to builder section
        document.getElementById('sect-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function closeViewer() {
        viewerProg = null;
        const viewer = document.getElementById('progression-viewer');
        if (viewer) viewer.classList.add('hidden');
    }

    // ============================================================
    // === CHORD PALETTE ==========================================
    // ============================================================

    const MODE_NAMES = {
        'major': 'Mayor', 'natural_minor': 'Menor natural', 'harmonic_minor': 'Menor armónica',
        'dorian': 'Dórica', 'mixolydian': 'Mixolidia', 'lydian': 'Lidia',
        'phrygian': 'Frigia', 'locrian': 'Locria',
    };

    const RELATIVE_MINOR_MAP = {
        'C': 'A', 'G': 'E', 'D': 'B', 'A': 'F#', 'E': 'C#', 'B': 'G#',
        'F#': 'D#', 'Gb': 'Eb', 'F': 'D', 'Bb': 'G', 'Eb': 'C', 'Ab': 'F',
        'Db': 'Bb', 'Cb': 'Ab',
    };

    async function loadChordsForKey(key) {
        const isMinorKey = key.endsWith('m');
        const rootKey = isMinorKey ? key.slice(0, -1) : key;

        // Determine mode
        let mode = modeSelect ? modeSelect.value : 'auto';
        if (mode === 'auto') {
            mode = isMinorKey ? 'natural_minor' : 'major';
        }

        try {
            // Fetch tonality data (mode-aware endpoint for non-major, legacy for major)
            let tonResp;
            if (mode === 'major') {
                tonResp = await fetch(`/api/tonality/${encodeURIComponent(rootKey)}`);
            } else {
                tonResp = await fetch(`/api/tonality/${encodeURIComponent(rootKey)}/${encodeURIComponent(mode)}`);
            }
            const tonData = await tonResp.json();
            currentKeyData = tonData;

            // Secondary dominants & progressions (mode-aware)
            const secResp = await fetch(`/api/secondary-dominants/${encodeURIComponent(rootKey)}?mode=${encodeURIComponent(mode)}`);
            const secData = await secResp.json();

            const progResp = await fetch(`/api/progressions/${encodeURIComponent(rootKey)}?mode=${encodeURIComponent(mode)}`);
            const progData = await progResp.json();

            // Update header with mode info
            const header = document.querySelector('.chord-header h2');
            if (header) {
                if (mode !== 'major') {
                    header.textContent = `Paleta de acordes (${rootKey} ${MODE_NAMES[mode] || mode})`;
                } else {
                    header.textContent = 'Paleta de acordes';
                }
            }

            // Fetch secondary subdominants (mode-aware)
            let secSubData = [];
            try {
                const secSubResp = await fetch(`/api/secondary-subdominants/${encodeURIComponent(rootKey)}?mode=${encodeURIComponent(mode)}`);
                secSubData = await secSubResp.json();
            } catch (e) {}

            // Fetch and cache smart suggestions
            try {
                const sugResp = await fetch('/api/suggestions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: rootKey, mode }),
                });
                currentSuggestions = await sugResp.json();
            } catch (e) {
                currentSuggestions = null;
            }

            renderSus4Palette(rootKey, mode); // PALETA COMPLETA SUS4 - arriba
            renderChordButtons('#diatonic-chords .chord-buttons', tonData.diatonic_triads, true);
            renderChordButtons('#diatonic-sevenths .chord-buttons', tonData.diatonic_sevenths || [], false);
            renderSecondaryDominants('#secondary-dominants .chord-buttons', secData);
            renderSecondarySubdominants(secSubData);
            renderSecondarySus4(rootKey, mode); // NUEVO - con modo
            renderChopinBassChords(rootKey, mode); // NUEVO - con modo
            renderSus4Resolution(rootKey);
            renderProgressions('#common-progressions .progression-buttons', progData, rootKey);
            renderSavedProgressions();
            renderExtendedChords(rootKey);
            renderNegativeHarmonyStudio(rootKey);
            renderChopinBassStudio(rootKey);

            // Relative minor chords (only when mode is major)
            const relMinorContainer = document.getElementById('relative-minor-chords');
            const relMinor7Container = document.getElementById('relative-minor-sevenths');
            if (mode === 'major' && RELATIVE_MINOR_MAP[rootKey]) {
                const relKey = RELATIVE_MINOR_MAP[rootKey];
                try {
                    const relResp = await fetch(`/api/tonality/${encodeURIComponent(relKey)}/natural_minor`);
                    const relData = await relResp.json();
                    document.getElementById('relative-minor-title').textContent = `Relativa menor (${relKey}m)`;
                    document.getElementById('relative-minor-7th-title').textContent = `Relativa menor – séptimas (${relKey}m)`;
                    renderChordButtons('#relative-minor-chords .chord-buttons', relData.diatonic_triads, true);
                    renderChordButtons('#relative-minor-sevenths .chord-buttons', relData.diatonic_sevenths || [], false);
                    relMinorContainer.style.display = '';
                    relMinor7Container.style.display = '';
                } catch (e) {
                    console.warn('Could not load relative minor chords:', e);
                    relMinorContainer.style.display = 'none';
                    relMinor7Container.style.display = 'none';
                }
            } else {
                if (relMinorContainer) relMinorContainer.style.display = 'none';
                if (relMinor7Container) relMinor7Container.style.display = 'none';
            }

            // Borrowed chords (modal interchange) - only for major keys
            const borrowedContainer = document.getElementById('borrowed-chords');
            if (mode === 'major') {
                try {
                    const miResp = await fetch(`/api/modal-interchange/${encodeURIComponent(rootKey)}`);
                    const miData = await miResp.json();
                    renderBorrowedChords('#borrowed-chords .chord-buttons', miData.borrowed_chords || []);
                    const borrowedKeyEl = document.getElementById('borrowed-from-key');
                    if (borrowedKeyEl) borrowedKeyEl.textContent = rootKey + 'm';
                    borrowedContainer.style.display = '';
                } catch (e) {
                    console.warn('Could not load borrowed chords:', e);
                    borrowedContainer.style.display = 'none';
                }
            } else {
                if (borrowedContainer) borrowedContainer.style.display = 'none';
            }
        } catch (err) {
            console.error('Failed to load chords for key:', key, err);
        }
    }

    let chordHighlightTimer = null;

    function highlightPianoForChord(notes) {
        // Clear any previous auto-clear timer
        clearTimeout(chordHighlightTimer);
        Piano.clearChordHighlights();

        // Convert note names to specific MIDI notes at currentOctave
        // (same logic as Player.playChordByNames)
        const midiNotes = [];
        let oct = currentOctave;
        for (let i = 0; i < notes.length; i++) {
            const pc = Piano.noteToPC(notes[i]);
            const midi = (oct + 1) * 12 + pc;
            midiNotes.push(midi);
            // If next note's PC is lower/equal, bump octave
            if (i < notes.length - 1) {
                const nextPC = Piano.noteToPC(notes[i + 1]);
                if (nextPC <= pc) oct++;
            }
        }

        // Highlight only the specific keys that will sound
        const rootMidi = midiNotes[0];
        for (const midi of midiNotes) {
            const keyEl = document.querySelector(`[data-midi="${midi}"]`);
            if (keyEl) {
                keyEl.classList.add(midi === rootMidi ? 'chord-root' : 'chord-hl');
            }
        }

        // Auto-clear chord highlights after 2 seconds
        chordHighlightTimer = setTimeout(() => {
            Piano.clearChordHighlights();
        }, 2000);
    }

    // Track currently playing chord button to clear it
    let activeChordBtn = null;

    function setActiveChordBtn(btn) {
        if (activeChordBtn && activeChordBtn !== btn) {
            activeChordBtn.classList.remove('playing');
        }
        activeChordBtn = btn;
    }

    function renderChordButtons(selector, chords, showFunction) {
        const container = document.querySelector(selector);
        if (!container) return;
        container.innerHTML = '';

        for (const chord of chords) {
            const btn = document.createElement('button');
            btn.className = 'chord-btn';

            // Color por función armónica (estilo MusiHacks)
            if (chord.function) {
                if (chord.function.includes('Tonic')) btn.classList.add('fn-tonic');
                else if (chord.function.includes('Subdominant')) btn.classList.add('fn-subdominant');
                else if (chord.function.includes('Dominant')) btn.classList.add('fn-dominant');
            }

            let html = `<span>${chord.symbol}</span>`;
            if (chord.numeral) {
                html += `<span class="numeral">${chord.numeral}</span>`;
            }
            btn.innerHTML = html;
            // Fórmula y función en tooltip
            const tips = [];
            if (chord.numeral) tips.push(chord.numeral);
            if (chord.function) tips.push(chord.function);
            if (chord.formula) tips.push(chord.formula.join(' - '));
            if (tips.length) btn.title = tips.join(' | ');

            btn.addEventListener('click', async (e) => {
                if (Tone.context.state !== 'running') await Tone.start();

                // Solo agregar al builder si se hace Shift+Click o Ctrl+Click
                if (builderMode && (e.shiftKey || e.ctrlKey)) {
                    addToBuilder(chord.symbol, chord.notes, chord.numeral);
                }

                setActiveChordBtn(btn);
                btn.classList.add('playing');
                highlightPianoForChord(chord.notes);
                playChordWithSettings(chord.notes);
                showChordInLivePanel(chord.symbol, chord.notes, chord.notes, chord.formula);

                // Mostrar sugerencias dinámicas si modo constructor está activo
                if (builderMode) {
                    showDynamicSuggestions(chord.symbol, chord.notes);
                }

                setTimeout(() => btn.classList.remove('playing'), 800);
            });

            container.appendChild(btn);
        }
    }

    function renderBorrowedChords(selector, chords) {
        const container = document.querySelector(selector);
        if (!container) return;
        container.innerHTML = '';

        for (const chord of chords) {
            const btn = document.createElement('button');
            btn.className = 'chord-btn borrowed-chord';
            btn.title = chord.usage || 'Acorde prestado del menor paralelo';

            btn.innerHTML = `
                <span class="chord-main">${chord.symbol}</span>
                <span class="numeral">${chord.degree || ''}</span>
            `;

            btn.addEventListener('click', async (e) => {
                if (Tone.context.state !== 'running') await Tone.start();
                if (builderMode && (e.shiftKey || e.ctrlKey)) {
                    addToBuilder(chord.symbol, chord.notes, chord.degree);
                }
                if (builderMode) showDynamicSuggestions(chord.symbol, chord.notes);
                setActiveChordBtn(btn);
                btn.classList.add('playing');
                highlightPianoForChord(chord.notes);
                playChordWithSettings(chord.notes);
                showChordInLivePanel(chord.symbol, chord.notes, chord.notes);
                setTimeout(() => btn.classList.remove('playing'), 800);
            });

            container.appendChild(btn);
        }
    }

    function renderSecondaryDominants(selector, dominants) {
        const container = document.querySelector(selector);
        if (!container) return;
        container.innerHTML = '';

        for (const dom of dominants) {
            const wrapper = document.createElement('div');
            wrapper.className = 'chord-btn-wrapper';

            const btn = document.createElement('button');
            btn.className = 'chord-btn chord-with-arrow';
            btn.innerHTML = `
                <span class="chord-main">${dom.chord7}</span>
                <span class="chord-arrow">→</span>
                <span class="chord-target">${dom.target} (${dom.label})</span>
            `;
            btn.title = `${dom.label}: ${dom.chord7} → ${dom.target}`;

            btn.addEventListener('click', async (e) => {
                if (Tone.context.state !== 'running') await Tone.start();
                highlightPianoForChord(dom.notes7);
                playChordWithSettings(dom.notes7);
                showChordInLivePanel(dom.chord7, dom.notes7, dom.notes7);
                if (builderMode) showDynamicSuggestions(dom.chord7, dom.notes7);
                if (e.shiftKey || e.ctrlKey) addToBuilder(dom.chord7, dom.notes7, dom.label);
                setActiveChordBtn(btn);
                btn.classList.add('playing');
                setTimeout(() => btn.classList.remove('playing'), 800);
            });

            wrapper.appendChild(btn);

            // Tritone substitution badge
            const ttBadge = document.createElement('button');
            ttBadge.className = 'tritone-badge';
            ttBadge.textContent = 'TT';
            ttBadge.title = 'Sustitución tritonal';
            ttBadge.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (Tone.context.state !== 'running') await Tone.start();
                try {
                    // Extract root from chord7 symbol (e.g. "D7" → "D", "Bb7" → "Bb")
                    const m = dom.chord7.match(/^([A-G][#b]?)/);
                    if (!m) return;
                    const resp = await fetch('/api/tritone-sub', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ root: m[1], chord_type: 'dominant7' }),
                    });
                    const data = await resp.json();
                    if (data.substitution) {
                        highlightPianoForChord(data.substitution.notes);
                        playChordWithSettings(data.substitution.notes);
                        ttBadge.classList.add('active');
                        setTimeout(() => ttBadge.classList.remove('active'), 800);
                    }
                } catch (err) {}
            });
            wrapper.appendChild(ttBadge);

            container.appendChild(wrapper);
        }
    }

    function renderSecondarySubdominants(subdominants) {
        const container = document.getElementById('secondary-subdominants');
        if (!container) return;
        container.innerHTML = '';

        if (!subdominants || subdominants.length === 0) return;

        for (const sub of subdominants) {
            const btn = document.createElement('button');
            btn.className = 'chord-btn chord-with-arrow';
            btn.innerHTML = `
                <span class="chord-main">${sub.chord7 || sub.chord || ''}</span>
                <span class="chord-arrow">→</span>
                <span class="chord-target">${sub.target || ''} (${sub.target_degree || ''})</span>
            `;
            btn.title = `${sub.label}: Setup → ${sub.target}`;

            const notes = sub.notes7 || sub.notes || [];
            btn.addEventListener('click', async (e) => {
                if (Tone.context.state !== 'running') await Tone.start();

                highlightPianoForChord(notes);
                playChordWithSettings(notes);
                showChordInLivePanel(sub.chord7 || sub.chord, notes, notes);
                if (builderMode) showDynamicSuggestions(sub.chord7 || sub.chord, notes);

                if (e.shiftKey || e.ctrlKey) {
                    addToBuilder(sub.chord7 || sub.chord, notes, sub.label);
                }

                setActiveChordBtn(btn);
                btn.classList.add('playing');
                setTimeout(() => btn.classList.remove('playing'), 800);
            });

            container.appendChild(btn);
        }
    }

    function renderProgressions(selector, progressions, key) {
        const container = document.querySelector(selector);
        if (!container) return;
        container.innerHTML = '';

        for (const prog of progressions) {
            const wrapper = document.createElement('div');
            wrapper.className = 'progression-wrapper';

            const btn = document.createElement('button');
            btn.className = 'progression-btn';
            btn.innerHTML = `
                <span class="prog-name">${prog.name}</span>
                <span class="prog-chords">${prog.numerals.join(' - ')}</span>
            `;

            btn.addEventListener('click', async () => {
                if (Tone.context.state !== 'running') await Tone.start();
                btn.classList.add('playing');

                const chordNotes = [];
                for (const symbol of prog.chords) {
                    try {
                        const parsed = parseChordSymbol(symbol);
                        let url = `/api/chords/${encodeURIComponent(parsed.root)}/${encodeURIComponent(parsed.type)}`;
                        if (currentInversion > 0) url += `?inversion=${currentInversion}`;
                        const resp = await fetch(url);
                        const data = await resp.json();
                        const notes = buildChordNoteNames(data.notes, currentOctave);
                        chordNotes.push(notes);
                    } catch (e) {
                        console.warn('Could not load chord:', symbol, e);
                    }
                }

                if (chordNotes.length > 0) {
                    await Player.playProgression(chordNotes);
                }

                setTimeout(() => btn.classList.remove('playing'),
                    chordNotes.length * (60 / Player.bpm) * 4 * 1000 + 500);
            });

            wrapper.appendChild(btn);

            // Examples toggle
            const examples = prog.examples || [];
            if (examples.length > 0) {
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'prog-examples-toggle';
                toggleBtn.textContent = 'Ejemplos';
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const grid = wrapper.querySelector('.song-examples-grid');
                    if (grid) {
                        grid.classList.toggle('hidden');
                        toggleBtn.classList.toggle('active');
                    }
                });
                wrapper.appendChild(toggleBtn);

                const grid = document.createElement('div');
                grid.className = 'song-examples-grid hidden';
                for (const ex of examples) {
                    const card = document.createElement('div');
                    card.className = 'song-example';
                    card.innerHTML = `
                        <div class="song-example-name">"${ex.title}"</div>
                        <div class="song-example-artist">${ex.artist}</div>
                        <div class="song-example-desc">${ex.genre}</div>
                    `;
                    grid.appendChild(card);
                }
                wrapper.appendChild(grid);
            }

            container.appendChild(wrapper);
        }
    }

    // ============================================================
    // === EXTENDED CHORDS ========================================
    // ============================================================

    async function renderSus4Resolution(key) {
        const container = document.getElementById('sus4-resolution-buttons');
        if (!container) return;
        container.innerHTML = '';

        // Get the V root (5th degree) for the current key
        const FIFTH_MAP = {
            'C': 'G', 'Db': 'Ab', 'D': 'A', 'Eb': 'Bb', 'E': 'B', 'F': 'C',
            'F#': 'C#', 'Gb': 'Db', 'G': 'D', 'Ab': 'Eb', 'A': 'E', 'Bb': 'F', 'B': 'F#'
        };
        const V = FIFTH_MAP[key] || 'G';

        try {
            const [sus4Resp, dom7Resp, tonicResp] = await Promise.all([
                fetch(`/api/chords/${encodeURIComponent(V)}/7sus4`),
                fetch(`/api/chords/${encodeURIComponent(V)}/dominant7`),
                fetch(`/api/chords/${encodeURIComponent(key)}/major`),
            ]);

            const sus4Data = await sus4Resp.json();
            const dom7Data = await dom7Resp.json();
            const tonicData = await tonicResp.json();

            // V7sus4 button
            const btnSus4 = createChordButton(sus4Data.symbol, sus4Data.notes);
            btnSus4.innerHTML = `<span>${sus4Data.symbol}</span><span class="numeral">V7sus4</span><span class="function-label dominant">Retardo</span>`;

            // Arrow
            const arrow1 = document.createElement('span');
            arrow1.className = 'sus4-resolution-arrow';
            arrow1.textContent = '\u2192';

            // V7 button
            const btnDom7 = createChordButton(dom7Data.symbol, dom7Data.notes);
            btnDom7.innerHTML = `<span>${dom7Data.symbol}</span><span class="numeral">V7</span><span class="function-label dominant">Dominante</span>`;

            // Arrow
            const arrow2 = document.createElement('span');
            arrow2.className = 'sus4-resolution-arrow';
            arrow2.textContent = '\u2192';

            // I button
            const btnTonic = createChordButton(tonicData.symbol, tonicData.notes);
            btnTonic.innerHTML = `<span>${tonicData.symbol}</span><span class="numeral">I</span><span class="function-label tonic">T\u00f3nica</span>`;

            // Play full sequence button
            const btnSeq = document.createElement('button');
            btnSeq.className = 'chord-btn';
            btnSeq.innerHTML = '<span>Secuencia</span><span class="numeral">V7sus4\u2192V7\u2192I</span>';
            btnSeq.style.borderLeft = '3px solid var(--accent)';
            btnSeq.addEventListener('click', async () => {
                if (Tone.context.state !== 'running') await Tone.start();
                btnSeq.classList.add('playing');

                const bt = 60 / (parseInt(bpmInput?.value) || 120);
                const now = Tone.now();
                const oct = currentOctave;

                // Helper to build note names with octave
                function buildNames(notes) {
                    const result = [];
                    let o = oct;
                    let prevPC = -1;
                    for (const n of notes) {
                        const pc = Piano.noteToPC(n);
                        if (prevPC >= 0 && pc <= prevPC) o++;
                        result.push(n + o);
                        prevPC = pc;
                    }
                    return result;
                }

                // Play V7sus4
                highlightPianoForChord(sus4Data.notes);
                for (const n of buildNames(sus4Data.notes)) Piano.playNote(n, bt * 1.8, now, 0.7);

                // Play V7
                setTimeout(() => highlightPianoForChord(dom7Data.notes), bt * 2 * 1000);
                for (const n of buildNames(dom7Data.notes)) Piano.playNote(n, bt * 1.8, now + bt * 2, 0.7);

                // Play I
                setTimeout(() => highlightPianoForChord(tonicData.notes), bt * 4 * 1000);
                for (const n of buildNames(tonicData.notes)) Piano.playNote(n, bt * 3, now + bt * 4, 0.8);

                setTimeout(() => btnSeq.classList.remove('playing'), 3500);
            });

            const row = document.createElement('div');
            row.className = 'sus4-resolution-row';
            row.appendChild(btnSus4);
            row.appendChild(arrow1);
            row.appendChild(btnDom7);
            row.appendChild(arrow2);
            row.appendChild(btnTonic);
            row.appendChild(btnSeq);
            container.appendChild(row);
        } catch (e) {
            container.innerHTML = '<span style="color:var(--text-muted);font-size:0.82rem">No disponible</span>';
        }
    }

    async function renderExtendedChords(key) {
        const susAddContainer = document.getElementById('sus-add-chords');
        const extContainer = document.getElementById('extended-chords');
        if (!susAddContainer && !extContainer) return;

        // Get diatonic roots from current key
        const roots = currentKeyData ? currentKeyData.diatonic_triads.map(c => {
            // Extract root from symbol (e.g., "Am" -> "A", "Bdim" -> "B")
            const m = c.symbol.match(/^([A-G][#b]?)/);
            return m ? m[1] : c.symbol;
        }) : ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

        // SUS and ADD chords
        if (susAddContainer) {
            susAddContainer.innerHTML = '';
            const susTypes = ['sus2', 'sus4', 'add9'];
            for (const root of roots) {
                for (const type of susTypes) {
                    try {
                        const resp = await fetch(`/api/chords/${encodeURIComponent(root)}/${type}`);
                        if (!resp.ok) continue;
                        const data = await resp.json();
                        const btn = createChordButton(data.symbol, data.notes);
                        susAddContainer.appendChild(btn);
                    } catch (e) {}
                }
            }
        }

        // Extended chords (9th, 11th, 13th) - just for the key root and common roots
        if (extContainer) {
            extContainer.innerHTML = '';
            const extTypes = ['major9', 'minor9', 'dominant9'];
            const extRoots = [roots[0], roots[3], roots[4]]; // I, IV, V roots
            for (const root of extRoots) {
                for (const type of extTypes) {
                    try {
                        const resp = await fetch(`/api/chords/${encodeURIComponent(root)}/${type}`);
                        if (!resp.ok) continue;
                        const data = await resp.json();
                        const btn = createChordButton(data.symbol, data.notes);
                        extContainer.appendChild(btn);
                    } catch (e) {}
                }
            }
        }
    }

    // ============================================================
    // === NEGATIVE HARMONY IN STUDIO =============================
    // ============================================================

    async function renderNegativeHarmonyStudio(key) {
        const container = document.querySelector('#negative-harmony-studio .chord-buttons');
        if (!container) return;
        container.innerHTML = '';

        try {
            const resp = await fetch(`/api/negative-harmony/${encodeURIComponent(key)}`);
            const data = await resp.json();

            for (const m of data.chord_mappings) {
                const btn = document.createElement('button');
                btn.className = 'chord-btn';
                btn.innerHTML = `<span>${m.negative}</span><span class="sub-label">neg(${m.original})</span>`;

                btn.addEventListener('click', async () => {
                    if (Tone.context.state !== 'running') await Tone.start();
                    if (builderMode) addToBuilder(m.negative, m.negative_notes, m.negative);
                    setActiveChordBtn(btn);
                    btn.classList.add('playing');
                    highlightPianoForChord(m.negative_notes);
                    playChordWithSettings(m.negative_notes);
                    showChordInLivePanel(m.negative, m.negative_notes, m.negative_notes);
                    setTimeout(() => btn.classList.remove('playing'), 800);
                });

                container.appendChild(btn);
            }
        } catch (e) {
            console.error('Failed to load negative harmony for studio:', e);
        }
    }

    // ============================================================
    // === CHOPIN BASS IN STUDIO ==================================
    // ============================================================

    async function renderChopinBassStudio(key) {
        const container = document.querySelector('#chopin-bass-studio .chord-buttons');
        if (!container) return;
        container.innerHTML = '';

        if (!currentKeyData || !currentKeyData.diatonic_triads) return;

        for (const chord of currentKeyData.diatonic_triads) {
            // Extract root and type from diatonic chord
            const rootMatch = chord.symbol.match(/^([A-G][#b]?)/);
            if (!rootMatch) continue;
            const root = rootMatch[1];
            // Determine type from symbol suffix
            let chordType = 'major';
            if (chord.symbol.includes('dim')) chordType = 'diminished';
            else if (chord.symbol.includes('aug')) chordType = 'augmented';
            else if (chord.symbol.endsWith('m') || chord.symbol.match(/[A-G][#b]?m$/)) chordType = 'minor';

            try {
                const resp = await fetch('/api/chopin-bass', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ root, chord_type: chordType }),
                });
                const data = await resp.json();

                const btn = document.createElement('button');
                btn.className = 'chord-btn';
                btn.innerHTML = `<span>${data.notation}</span><span class="sub-label">${chord.symbol}</span>`;

                btn.addEventListener('click', async () => {
                    if (Tone.context.state !== 'running') await Tone.start();
                    if (builderMode) addToBuilder(data.notation, data.voicing, data.notation);
                    setActiveChordBtn(btn);
                    btn.classList.add('playing');
                    // Play Chopin voicing: bass in octave 2, chord in octave 4
                    highlightPianoForChord(data.voicing);
                    const now = Tone.now();
                    Piano.playNote(data.bass_note + '2', 2, now, 0.65);
                    setTimeout(() => {
                        const chordNotes = buildChordNoteNames(data.chord.notes, 4);
                        for (const n of chordNotes) {
                            Piano.playNote(n, 1.8, null, 0.6);
                        }
                    }, 200);
                    showChordInLivePanel(data.notation, data.voicing, data.voicing);
                    setTimeout(() => btn.classList.remove('playing'), 800);
                });

                container.appendChild(btn);
            } catch (e) {}
        }
    }

    // ============================================================
    // === CHORD EXPLORER =========================================
    // ============================================================

    const CATEGORY_LABELS = {
        triad: 'Tríadas',
        seventh: 'Séptimas',
        added: 'Add / 6',
        extended: 'Extendidos (9, 11, 13)',
        sus: 'Sus7',
    };

    function setupChordExplorer() {
        const select = document.getElementById('chordExplorerRoot');
        if (!select) return;

        select.addEventListener('change', () => {
            loadChordExplorer(select.value);
        });

        // Load default
        loadChordExplorer(select.value);
    }

    async function loadChordExplorer(root) {
        const container = document.getElementById('chordExplorerResults');
        if (!container) return;
        container.innerHTML = '<span style="color:var(--text-muted);font-size:0.82rem">Cargando...</span>';

        try {
            const resp = await fetch(`/api/chords/${encodeURIComponent(root)}/all`);
            const allChords = await resp.json();
            container.innerHTML = '';

            let currentCategory = '';

            for (const chord of allChords) {
                // Add category separator
                if (chord.category !== currentCategory) {
                    currentCategory = chord.category;
                    const label = document.createElement('div');
                    label.className = 'chord-explorer-category';
                    label.textContent = CATEGORY_LABELS[currentCategory] || currentCategory;
                    container.appendChild(label);
                }

                const btn = createChordButton(chord.symbol, chord.notes);
                container.appendChild(btn);
            }
        } catch (e) {
            container.innerHTML = '<span style="color:var(--dominant);font-size:0.82rem">Error al cargar acordes</span>';
        }
    }

    function createChordButton(symbol, notes) {
        const btn = document.createElement('button');
        btn.className = 'chord-btn';
        btn.innerHTML = `<span>${symbol}</span>`;

        btn.addEventListener('click', async () => {
            if (Tone.context.state !== 'running') await Tone.start();

            if (builderMode) {
                addToBuilder(symbol, notes, symbol);
            }

            setActiveChordBtn(btn);
            btn.classList.add('playing');
            highlightPianoForChord(notes);
            playChordWithSettings(notes);
            showChordInLivePanel(symbol, notes, notes);
            setTimeout(() => btn.classList.remove('playing'), 800);
        });

        return btn;
    }

    // ============================================================
    // === PLAY CHORD WITH SETTINGS ===============================
    // ============================================================

    async function playChordWithSettings(notes) {
        if (currentInversion > 0) {
            try {
                const inverted = [...notes];
                for (let i = 0; i < currentInversion && i < inverted.length; i++) {
                    inverted.push(inverted.shift());
                }
                Player.playChordByNames(inverted, currentOctave);
            } catch {
                Player.playChordByNames(notes, currentOctave);
            }
        } else {
            Player.playChordByNames(notes, currentOctave);
        }
    }

    // ============================================================
    // === SCALE BROWSER ==========================================
    // ============================================================

    const ALL_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const MINI_PIANO_KEYS = [
        { note: 'C', type: 'white' }, { note: 'C#', type: 'black' },
        { note: 'D', type: 'white' }, { note: 'D#', type: 'black' },
        { note: 'E', type: 'white' },
        { note: 'F', type: 'white' }, { note: 'F#', type: 'black' },
        { note: 'G', type: 'white' }, { note: 'G#', type: 'black' },
        { note: 'A', type: 'white' }, { note: 'A#', type: 'black' },
        { note: 'B', type: 'white' },
    ];

    // Scale type button handlers
    document.querySelectorAll('.scale-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.scale-type-btn').forEach(b => {
                b.classList.remove('active');
                b.classList.add('btn-clear');
                b.classList.remove('btn-accent');
            });
            btn.classList.add('active');
            btn.classList.remove('btn-clear');
            btn.classList.add('btn-accent');
            loadScaleBrowser(btn.dataset.scaleType);
        });
    });

    // Build diatonic triads from scale notes (works for any 7-note scale)
    function buildScaleTriads(scaleNotes) {
        if (scaleNotes.length < 7) return []; // pentatonic/blues: skip chords
        const triads = [];
        const romanUpper = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
        const romanLower = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

        for (let i = 0; i < 7; i++) {
            const root = scaleNotes[i];
            const third = scaleNotes[(i + 2) % 7];
            const fifth = scaleNotes[(i + 4) % 7];
            const rootPC = noteToPC(root);
            const thirdPC = noteToPC(third);
            const fifthPC = noteToPC(fifth);
            const interval3 = ((thirdPC - rootPC) + 12) % 12;
            const interval5 = ((fifthPC - rootPC) + 12) % 12;

            let quality = '';
            let suffix = '';
            let numeral = '';
            if (interval3 === 4 && interval5 === 7) {
                quality = 'major'; numeral = romanUpper[i];
            } else if (interval3 === 3 && interval5 === 7) {
                quality = 'minor'; suffix = 'm'; numeral = romanLower[i];
            } else if (interval3 === 3 && interval5 === 6) {
                quality = 'dim'; suffix = 'dim'; numeral = romanLower[i] + '°';
            } else if (interval3 === 4 && interval5 === 8) {
                quality = 'aug'; suffix = 'aug'; numeral = romanUpper[i] + '+';
            } else {
                quality = 'other'; suffix = '?'; numeral = romanUpper[i] + '?';
            }

            triads.push({
                symbol: root + suffix,
                notes: [root, third, fifth],
                quality,
                numeral,
                degree: i + 1,
            });
        }
        return triads;
    }

    async function loadScaleBrowser(scaleType) {
        const grid = document.getElementById('scale-browser-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const scaleNames = {
            'major': 'Mayor', 'natural_minor': 'Menor', 'harmonic_minor': 'Menor armónica',
            'melodic_minor': 'Menor melódica', 'dorian': 'Dórica', 'phrygian': 'Frigia',
            'lydian': 'Lidia', 'mixolydian': 'Mixolidia', 'locrian': 'Locria',
            'pentatonic_major': 'Pentatónica', 'pentatonic_minor': 'Pent. menor',
            'blues': 'Blues', 'whole_tone': 'Tono entero', 'double_harmonic': 'Doble armónica',
            'chromatic': 'Cromática',
        };

        for (const key of ALL_KEYS) {
            try {
                const resp = await fetch(`/api/scales/${encodeURIComponent(key)}/${encodeURIComponent(scaleType)}`);
                if (!resp.ok) continue;
                const data = await resp.json();

                const card = document.createElement('div');
                card.className = 'scale-card';

                const header = document.createElement('div');
                header.className = 'scale-card-header';
                header.textContent = `${key} ${scaleNames[scaleType] || scaleType}`;
                header.addEventListener('click', (e) => {
                    e.stopPropagation();
                    Piano.highlightScale(key, data.notes);
                });
                card.appendChild(header);

                const notesLabel = document.createElement('div');
                notesLabel.className = 'scale-card-notes';
                notesLabel.textContent = data.notes.join(' - ');
                card.appendChild(notesLabel);

                // Mini piano
                const piano = document.createElement('div');
                piano.className = 'mini-piano';
                piano.addEventListener('click', (e) => {
                    e.stopPropagation();
                    Piano.highlightScale(key, data.notes);
                });
                const scaleNotes = data.notes;
                const scalePCs = new Set(scaleNotes.map(n => noteToPC(n)));
                const rootPC = noteToPC(key);

                for (const k of MINI_PIANO_KEYS) {
                    const keyDiv = document.createElement('div');
                    keyDiv.className = `mini-key ${k.type}`;
                    const pc = noteToPC(k.note);

                    if (pc === rootPC) {
                        keyDiv.classList.add('scale-root-active');
                    } else if (scalePCs.has(pc)) {
                        keyDiv.classList.add('scale-active');
                    }

                    if (k.type === 'white') {
                        keyDiv.textContent = k.note.replace('#', '');
                    }
                    piano.appendChild(keyDiv);
                }
                card.appendChild(piano);

                // Diatonic triads (only for 7-note scales)
                const triads = buildScaleTriads(scaleNotes);
                if (triads.length > 0) {
                    const chordsRow = document.createElement('div');
                    chordsRow.className = 'scale-card-chords';
                    for (const triad of triads) {
                        const chordBtn = document.createElement('button');
                        chordBtn.className = `scale-chord-btn quality-${triad.quality}`;
                        chordBtn.innerHTML = `<span class="sc-symbol">${triad.symbol}</span><span class="sc-numeral">${triad.numeral}</span>`;
                        chordBtn.title = `${triad.notes.join(' - ')}`;
                        chordBtn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            if (Tone.context.state !== 'running') await Tone.start();
                            chordBtn.classList.add('playing');
                            highlightPianoForChord(triad.notes);
                            playChordWithSettings(triad.notes);
                            setTimeout(() => chordBtn.classList.remove('playing'), 800);
                        });
                        chordsRow.appendChild(chordBtn);
                    }
                    card.appendChild(chordsRow);
                }

                // Click on card header/piano to play scale
                const playArea = document.createElement('div');
                playArea.className = 'scale-card-play';
                playArea.textContent = 'Escuchar escala';
                playArea.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (Tone.context.state !== 'running') await Tone.start();
                    Piano.highlightScale(key, scaleNotes);
                    const now = Tone.now();
                    const bt = 0.25;
                    for (let i = 0; i < scaleNotes.length; i++) {
                        Piano.playNote(scaleNotes[i] + '4', bt * 1.5, now + i * bt, 0.6);
                    }
                    Piano.playNote(scaleNotes[0] + '5', bt * 3, now + scaleNotes.length * bt, 0.7);
                });
                card.appendChild(playArea);

                grid.appendChild(card);
            } catch (e) {}
        }
    }

    // ============================================================
    // === MIDI RECORDINGS ========================================
    // ============================================================

    const btnSaveMidiRec = document.getElementById('btnSaveMidiRec');
    if (btnSaveMidiRec) {
        btnSaveMidiRec.addEventListener('click', () => {
            if (!Recorder.hasData()) return;
            const name = prompt('Nombre de la grabación:');
            if (!name) return;

            const notes = Recorder.getNotes();
            const saved = JSON.parse(localStorage.getItem('musihacks_midi_recordings') || '[]');
            saved.push({
                id: Date.now(),
                name,
                notes,
                date: new Date().toLocaleDateString(),
            });
            localStorage.setItem('musihacks_midi_recordings', JSON.stringify(saved));
            renderMidiRecordings();

            const status = document.getElementById('midiRecStatus');
            if (status) status.textContent = `"${name}" guardada`;
        });
    }

    function renderMidiRecordings() {
        const container = document.getElementById('midi-recordings-list');
        if (!container) return;

        const saved = JSON.parse(localStorage.getItem('musihacks_midi_recordings') || '[]');
        container.innerHTML = '';

        if (saved.length === 0) {
            container.innerHTML = '<p style="color:var(--text-dim);font-size:0.82rem">Sin grabaciones guardadas</p>';
            return;
        }

        for (const rec of saved) {
            const item = document.createElement('div');
            item.className = 'saved-note-item';
            item.innerHTML = `
                <span class="note-text">${rec.name} (${rec.notes.length} notas)</span>
                <span class="note-date">${rec.date}</span>
                <button class="example-btn" style="padding:3px 8px;font-size:0.75rem" data-action="play">Play</button>
                <button class="example-btn" style="padding:3px 8px;font-size:0.75rem" data-action="analyze">Analizar</button>
                <button class="note-delete" data-action="delete">&times;</button>
            `;

            // Play
            item.querySelector('[data-action="play"]').addEventListener('click', async () => {
                if (Tone.context.state !== 'running') await Tone.start();
                const now = Tone.now();
                for (const note of rec.notes) {
                    Piano.playNote(note.note, note.duration, now + note.start, note.velocity);
                }
            });

            // Analyze
            item.querySelector('[data-action="analyze"]').addEventListener('click', async () => {
                const midiNotes = [...new Set(rec.notes.map(n => n.midi))];
                if (midiNotes.length < 2) return;

                try {
                    const resp = await fetch('/api/suggest-from-melody', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ notes: midiNotes }),
                    });
                    const data = await resp.json();
                    alert(`Tonalidad detectada: ${data.detected_key} Mayor\nAcordes compatibles: ${data.compatible_chords.map(c => c.symbol).join(', ')}`);
                } catch (e) {
                    alert('Error al analizar');
                }
            });

            // Delete
            item.querySelector('[data-action="delete"]').addEventListener('click', () => {
                const filtered = saved.filter(r => r.id !== rec.id);
                localStorage.setItem('musihacks_midi_recordings', JSON.stringify(filtered));
                renderMidiRecordings();
            });

            container.appendChild(item);
        }
    }

    // ============================================================
    // === REFERENCE IMAGES =======================================
    // ============================================================

    loadReferenceImages();

    async function loadReferenceImages() {
        try {
            const resp = await fetch('/api/reference-images');
            const images = await resp.json();

            // Display name mapping for known images
            const nameMap = {
                '1.webp': 'Referencia musical',
                '359786ad56a841dbf79cae64686d90e4.jpg': 'Clave de Sol y Fa',
                '481794025_921968040128563_3765322021253533212_n.jpg': 'Teoría MusiHacks',
                '6-circulo-completo_ezgl9-1024x729.jpg': 'Círculo de quintas completo',
                'dominantes-tabla-1.jpg': 'Tabla de dominantes',
                'dominantes-sus4.png': 'Dominantes SUS4 (V7sus4 → V7 → I)',
                'recursos-melodia.png': 'Recursos de composición de melodías',
                'escalas-mayores.png': 'Todas las escalas mayores',
                'escalas-menores.png': 'Todas las escalas menores',
                'acordes-diatonicos-funciones.png': 'Acordes diatónicos y funciones',
            };

            const renderGallery = (containerId) => {
                const gallery = document.getElementById(containerId);
                if (!gallery || images.length === 0) return;

                gallery.innerHTML = images.map(img => {
                    const label = nameMap[img.filename] || img.filename.replace(/\.[^.]+$/, '');
                    return `
                        <div class="reference-img-card" onclick="openImageModal('${img.url}')">
                            <img src="${img.url}" alt="${label}" loading="lazy">
                            <div class="img-label">${label}</div>
                        </div>
                    `;
                }).join('');
            };

            // Render in both home and reference tabs
            renderGallery('home-reference-gallery');
            renderGallery('reference-gallery');
        } catch (e) {
            // Reference images are optional
        }
    }

    // --- Image modal (global function) ---
    window.openImageModal = function(url) {
        const modal = document.createElement('div');
        modal.className = 'img-modal';
        modal.innerHTML = `<img src="${url}" alt="Referencia">`;
        modal.addEventListener('click', () => modal.remove());
        document.body.appendChild(modal);
    };

    // ============================================================
    // === HOME DASHBOARD STATS ===================================
    // ============================================================

    function updateHomeStats() {
        // Theory progress
        try {
            const progress = JSON.parse(localStorage.getItem('musihacks_theory_progress') || '[]');
            const completed = Array.isArray(progress) ? progress.length : Object.values(progress).filter(v => v === true).length;
            const total = (typeof Theory !== 'undefined' && Theory.lessons) ? Theory.lessons.length : 24;
            const unitCount = (typeof Theory !== 'undefined' && Theory.units) ? Theory.units.length : 8;
            const el = document.getElementById('homeTheoryProgress');
            if (el) el.textContent = `${completed} / ${total}`;
        } catch (e) {}

        // Notes count
        try {
            const notes = JSON.parse(localStorage.getItem('musihacks_notes') || '[]');
            const el = document.getElementById('homeNotesCount');
            if (el) el.textContent = notes.length;
        } catch (e) {}

        // Recordings count (audio + midi)
        try {
            const audioRecs = JSON.parse(localStorage.getItem('musihacks_recordings') || '[]');
            const midiRecs = JSON.parse(localStorage.getItem('musihacks_midi_recordings') || '[]');
            const el = document.getElementById('homeRecordingsCount');
            if (el) el.textContent = audioRecs.length + midiRecs.length;
        } catch (e) {}

        // Projects count
        try {
            const projs = JSON.parse(localStorage.getItem('musihacks_projects') || '[]');
            const el = document.getElementById('homeProjectsCount');
            if (el) el.textContent = projs.length;
        } catch (e) {}
    }

    // ============================================================
    // === HELPERS ================================================
    // ============================================================

    function parseChordSymbol(symbol) {
        let root = '';
        let rest = '';

        if (symbol.length > 1 && (symbol[1] === '#' || symbol[1] === 'b')) {
            root = symbol.substring(0, 2);
            rest = symbol.substring(2);
        } else {
            root = symbol[0];
            rest = symbol.substring(1);
        }

        const typeMap = {
            '': 'major', 'm': 'minor', 'dim': 'diminished', 'aug': 'augmented',
            'maj7': 'major7', 'm7': 'minor7', '7': 'dominant7',
            'dim7': 'diminished7', 'm7b5': 'half_diminished7',
            'sus2': 'sus2', 'sus4': 'sus4', '7sus4': '7sus4',
            'add9': 'add9', '6': '6', 'm6': 'minor6',
            'maj9': 'major9', 'm9': 'minor9', '9': 'dominant9',
        };

        const type = typeMap[rest] || 'major';
        return { root, type };
    }

    function buildChordNoteNames(notes, baseOctave) {
        const noteNames = [];
        let octave = baseOctave;
        let prevPC = -1;

        for (const note of notes) {
            const pc = noteToPC(note);
            if (prevPC >= 0 && pc <= prevPC) {
                octave++;
            }
            noteNames.push(note + octave);
            prevPC = pc;
        }

        return noteNames;
    }

    function noteToPC(name) {
        const map = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4, 'Fb': 4, 'F': 5, 'E#': 5, 'F#': 6, 'Gb': 6,
            'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10,
            'B': 11, 'Cb': 11
        };
        return map[name] ?? 0;
    }

    // ============================================================
    // === INITIAL LOAD ===========================================
    // ============================================================

    loadChordsForKey('C');
    setupChordExplorer();
    updateHomeStats();
    renderMidiRecordings();
    loadScaleBrowser('major');

})();
