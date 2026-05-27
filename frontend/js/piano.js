/**
 * Piano module: Virtual keyboard with Yamaha P-125B style sound.
 * Uses Salamander Grand Piano samples processed through EQ + Compression + Reverb
 * to emulate the bright, clear tone of the Yamaha P-125B / Smart Pianist.
 */

const Piano = (() => {
    // Piano range: C2 (MIDI 36) to C6 (MIDI 84)
    const START_NOTE = 36; // C2
    const END_NOTE = 84;   // C6

    const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const WHITE_NOTES = [0, 2, 4, 5, 7, 9, 11];
    const BLACK_NOTES = [1, 3, 6, 8, 10];

    let sampler = null;
    let isLoaded = false;
    let activeNotes = new Map();
    let onNoteOn = null;
    let onNoteOff = null;
    let sustainActive = false;
    let sustainedNotes = new Set();
    let volume = -6;

    // Audio processing chain
    let reverb = null;
    let eq = null;
    let compressor = null;
    let outputNode = null; // What the sampler connects to

    // Keyboard mapping
    const KEY_MAP_LOWER = {
        'z': 48, 's': 49, 'x': 50, 'd': 51, 'c': 52, 'v': 53,
        'g': 54, 'b': 55, 'h': 56, 'n': 57, 'j': 58, 'm': 59,
    };
    const KEY_MAP_UPPER = {
        'q': 60, '2': 61, 'w': 62, '3': 63, 'e': 64, 'r': 65,
        '5': 66, 't': 67, '6': 68, 'y': 69, '7': 70, 'u': 71,
        'i': 72, '9': 73, 'o': 74, '0': 75, 'p': 76,
    };

    const keyboardMap = { ...KEY_MAP_LOWER, ...KEY_MAP_UPPER };
    const pressedKeys = new Set();

    function midiToName(midi) {
        const octave = Math.floor(midi / 12) - 1;
        const note = NOTE_NAMES[midi % 12];
        return `${note}${octave}`;
    }

    function isBlack(midi) {
        return BLACK_NOTES.includes(midi % 12);
    }

    async function init() {
        renderKeyboard();
        setupKeyboardListeners();

        // Set up audio chain with fallback
        try {
            await setupAudioChain();
        } catch (e) {
            console.warn('Audio chain failed, using direct connection:', e);
            outputNode = Tone.getDestination();
        }

        await loadSampler();
    }

    async function setupAudioChain() {
        // === Yamaha P-125B Sound Processing Chain ===

        // 1. EQ: Bright, present tone (Yamaha characteristic)
        eq = new Tone.EQ3({
            low: -2,
            mid: 0,
            high: 3,
            lowFrequency: 250,
            highFrequency: 3200,
        });

        // 2. Compressor: Even dynamics (digital piano characteristic)
        compressor = new Tone.Compressor({
            threshold: -18,
            ratio: 3,
            attack: 0.005,
            release: 0.15,
            knee: 6,
        });

        // 3. Reverb: Room/Hall simulation
        reverb = new Tone.Reverb({
            decay: 2.5,
            wet: 0.4,
        });

        // Generate impulse response (this can fail)
        await reverb.generate();

        // Chain: EQ → Compressor → Reverb → Destination
        eq.chain(compressor, reverb, Tone.getDestination());
        outputNode = eq;

        console.log('Yamaha P-125B audio chain ready');
    }

    async function loadSampler() {
        const baseUrl = 'https://tonejs.github.io/audio/salamander/';

        return new Promise((resolve) => {
            sampler = new Tone.Sampler({
                urls: {
                    A0: 'A0.mp3', C1: 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3',
                    A1: 'A1.mp3', C2: 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3',
                    A2: 'A2.mp3', C3: 'C3.mp3', 'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3',
                    A3: 'A3.mp3', C4: 'C4.mp3', 'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3',
                    A4: 'A4.mp3', C5: 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
                    A5: 'A5.mp3', C6: 'C6.mp3', 'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3',
                    A6: 'A6.mp3', C7: 'C7.mp3', 'D#7': 'Ds7.mp3',
                    A7: 'A7.mp3', C8: 'C8.mp3',
                },
                release: 0.8,
                baseUrl: baseUrl,
                onload: () => {
                    isLoaded = true;
                    console.log('Piano samples loaded');
                    // Update loading indicator
                    const indicator = document.getElementById('pianoLoadStatus');
                    if (indicator) {
                        indicator.textContent = 'Piano listo';
                        indicator.classList.add('loaded');
                        setTimeout(() => indicator.style.display = 'none', 2000);
                    }
                    resolve();
                },
                onerror: (e) => {
                    console.error('Failed to load piano samples:', e);
                    resolve(); // Don't block the app
                }
            });

            // Connect to output node (effects chain or direct)
            if (outputNode) {
                sampler.connect(outputNode);
            } else {
                sampler.toDestination();
            }

            sampler.volume.value = volume;
        });
    }

    function renderKeyboard() {
        const container = document.getElementById('piano');
        if (!container) return;
        container.innerHTML = '';

        const showLabels = document.getElementById('showNoteNames')?.checked ?? true;

        for (let midi = START_NOTE; midi <= END_NOTE; midi++) {
            const pc = midi % 12;
            const octave = Math.floor(midi / 12) - 1;
            const name = NOTE_NAMES[pc];
            const isBlackKey = isBlack(midi);

            const key = document.createElement('div');
            key.className = `piano-key ${isBlackKey ? 'black' : 'white'}`;
            key.dataset.midi = midi;
            key.dataset.note = `${name}${octave}`;

            const label = document.createElement('span');
            label.className = `note-label ${showLabels ? '' : 'hidden'}`;
            label.textContent = isBlackKey ? name : `${name}${octave}`;
            key.appendChild(label);

            // Mouse events
            key.addEventListener('mousedown', (e) => {
                e.preventDefault();
                noteOn(midi);
            });
            key.addEventListener('mouseup', () => noteOff(midi));
            key.addEventListener('mouseleave', () => {
                if (activeNotes.has(midi)) noteOff(midi);
            });

            // Touch events
            key.addEventListener('touchstart', (e) => {
                e.preventDefault();
                noteOn(midi);
            });
            key.addEventListener('touchend', (e) => {
                e.preventDefault();
                noteOff(midi);
            });

            container.appendChild(key);
        }
    }

    function setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.repeat || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
            const midi = keyboardMap[e.key.toLowerCase()];
            if (midi !== undefined && !pressedKeys.has(e.key.toLowerCase())) {
                pressedKeys.add(e.key.toLowerCase());
                noteOn(midi);
            }
            if (e.key === ' ') {
                e.preventDefault();
                setSustain(true);
            }
        });

        document.addEventListener('keyup', (e) => {
            const k = e.key.toLowerCase();
            const midi = keyboardMap[k];
            if (midi !== undefined) {
                pressedKeys.delete(k);
                noteOff(midi);
            }
            if (e.key === ' ') {
                setSustain(false);
            }
        });
    }

    async function noteOn(midi, velocity = 0.8) {
        if (!sampler) return;

        // Ensure audio context is running (requires user gesture)
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }

        const noteName = midiToName(midi);

        try {
            sampler.triggerAttack(noteName, Tone.now(), velocity);
        } catch (e) {
            console.warn('triggerAttack failed:', e);
        }

        // Visual feedback
        const keyEl = document.querySelector(`[data-midi="${midi}"]`);
        if (keyEl) {
            keyEl.classList.add('active');
            activeNotes.set(midi, keyEl);
        }

        if (onNoteOn) onNoteOn(midi, velocity, Tone.now());
    }

    function noteOff(midi) {
        if (!sampler) return;

        if (sustainActive) {
            sustainedNotes.add(midi);
            return;
        }

        const noteName = midiToName(midi);
        try {
            sampler.triggerRelease(noteName, Tone.now());
        } catch (e) {
            // ignore
        }

        const keyEl = activeNotes.get(midi);
        if (keyEl) {
            keyEl.classList.remove('active');
            activeNotes.delete(midi);
        }

        if (onNoteOff) onNoteOff(midi, Tone.now());
    }

    function setSustain(active) {
        sustainActive = active;
        const pedal = document.getElementById('sustainPedal');
        if (pedal) pedal.checked = active;

        if (!active) {
            for (const midi of sustainedNotes) {
                const noteName = midiToName(midi);
                try { sampler.triggerRelease(noteName, Tone.now()); } catch(e) {}
                const keyEl = activeNotes.get(midi);
                if (keyEl) {
                    keyEl.classList.remove('active');
                    activeNotes.delete(midi);
                }
                if (onNoteOff) onNoteOff(midi, Tone.now());
            }
            sustainedNotes.clear();
        }
    }

    function setVolume(val) {
        volume = Tone.gainToDb(val / 100);
        if (sampler) sampler.volume.value = volume;
    }

    function setReverb(wetLevel) {
        if (reverb) reverb.wet.value = parseFloat(wetLevel);
    }

    async function playNote(noteName, duration = '8n', time = null, velocity = 0.7) {
        if (!sampler || !isLoaded) return;
        if (Tone.context.state !== 'running') await Tone.start();
        try {
            sampler.triggerAttackRelease(noteName, duration, time || Tone.now(), velocity);
        } catch (e) {
            console.warn('playNote failed:', e);
        }
    }

    function playMidi(midi, duration = 0.5, time = null, velocity = 0.7) {
        const noteName = midiToName(midi);
        playNote(noteName, duration, time, velocity);

        const keyEl = document.querySelector(`[data-midi="${midi}"]`);
        if (keyEl) {
            keyEl.classList.add('active');
            const dur = typeof duration === 'number' ? duration * 1000 : 400;
            setTimeout(() => keyEl.classList.remove('active'), dur);
        }
    }

    function toggleNoteNames(show) {
        document.querySelectorAll('.note-label').forEach(el => {
            el.classList.toggle('hidden', !show);
        });
    }

    function highlightKeys(midiNotes, className = 'highlight-scale') {
        clearHighlights();
        for (const midi of midiNotes) {
            const keyEl = document.querySelector(`[data-midi="${midi}"]`);
            if (keyEl) keyEl.classList.add(className);
        }
    }

    const HL_CLASSES = [
        'highlight-scale', 'highlight-tonic',
        'scale-highlight', 'scale-root',
        'chord-hl', 'chord-root',
        'scale-hl', 'scale-hl-root',
    ];

    function clearHighlights() {
        document.querySelectorAll('.piano-key').forEach(el => {
            el.classList.remove(...HL_CLASSES);
        });
    }

    // Clear only chord highlights (keep scale)
    function clearChordHighlights() {
        document.querySelectorAll('.piano-key').forEach(el => {
            el.classList.remove('chord-hl', 'chord-root');
        });
    }

    function showScaleOverlay(rootNote, scaleNotes) {
        clearHighlights();
        if (!scaleNotes || scaleNotes.length === 0) return;

        const rootPC = noteToPC(rootNote);
        const scalePCs = new Set(scaleNotes.map(n => noteToPC(n)));

        for (let midi = START_NOTE; midi <= END_NOTE; midi++) {
            const pc = midi % 12;
            const keyEl = document.querySelector(`[data-midi="${midi}"]`);
            if (!keyEl) continue;

            if (pc === rootPC) {
                keyEl.classList.add('scale-root');
            } else if (scalePCs.has(pc)) {
                keyEl.classList.add('scale-highlight');
            }
        }
    }

    /**
     * Highlight chord notes across ALL octaves on the keyboard.
     * Root = red translucent, other notes = blue translucent.
     * Pass clearScale=false to keep scale highlights underneath.
     */
    function highlightChord(notes, clearScale) {
        if (clearScale !== false) clearHighlights();
        else clearChordHighlights();

        if (!notes || notes.length === 0) return;

        const rootPC = noteToPC(notes[0]);
        const pcSet = new Set(notes.map(n => noteToPC(n)));

        for (let midi = START_NOTE; midi <= END_NOTE; midi++) {
            const pc = midi % 12;
            const keyEl = document.querySelector(`[data-midi="${midi}"]`);
            if (!keyEl) continue;

            if (pc === rootPC) {
                keyEl.classList.add('chord-root');
            } else if (pcSet.has(pc)) {
                keyEl.classList.add('chord-hl');
            }
        }
    }

    /**
     * Highlight scale notes across ALL octaves on the keyboard.
     * Root = gold translucent, other notes = green translucent.
     */
    function highlightScale(rootNote, scaleNotes) {
        clearHighlights();
        if (!scaleNotes || scaleNotes.length === 0) return;

        const rootPC = noteToPC(rootNote);
        const scalePCs = new Set(scaleNotes.map(n => noteToPC(n)));

        for (let midi = START_NOTE; midi <= END_NOTE; midi++) {
            const pc = midi % 12;
            const keyEl = document.querySelector(`[data-midi="${midi}"]`);
            if (!keyEl) continue;

            if (pc === rootPC) {
                keyEl.classList.add('scale-hl-root');
            } else if (scalePCs.has(pc)) {
                keyEl.classList.add('scale-hl');
            }
        }
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

    function pcToNote(pc, useSharps = true) {
        const sharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const flats  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        return useSharps ? sharps[pc % 12] : flats[pc % 12];
    }

    function getActiveNotes() {
        return [...new Set([...activeNotes.keys(), ...sustainedNotes])];
    }

    return {
        init,
        noteOn,
        noteOff,
        playNote,
        playMidi,
        midiToName,
        setVolume,
        setReverb,
        setSustain,
        toggleNoteNames,
        highlightKeys,
        clearHighlights,
        clearChordHighlights,
        showScaleOverlay,
        highlightChord,
        highlightScale,
        noteToPC,
        pcToNote,
        getActiveNotes,
        get isLoaded() { return isLoaded; },
        get sampler() { return sampler; },
        set onNoteOn(fn) { onNoteOn = fn; },
        set onNoteOff(fn) { onNoteOff = fn; },
        NOTE_NAMES,
        START_NOTE,
        END_NOTE,
    };
})();
