/**
 * Player module: chord playback in different styles (block, arpeggio, waltz, ballad, pop)
 */

const Player = (() => {
    let bpm = 120;
    let currentStyle = 'block';
    let isPlaying = false;
    let scheduledEvents = [];

    function setBpm(val) {
        bpm = Math.max(40, Math.min(200, val));
    }

    function setStyle(style) {
        currentStyle = style;
    }

    function beatDuration() {
        return 60 / bpm;
    }

    /**
     * Play a chord with the given notes (note names like 'C4', 'E4', 'G4')
     * in the selected style.
     */
    function playChord(noteNames, style = null) {
        if (isPlaying) return;
        const s = style || currentStyle;

        if (Tone.context.state !== 'running') Tone.start();

        switch (s) {
            case 'block': playBlock(noteNames); break;
            case 'arpeggio_up': playArpeggio(noteNames, false); break;
            case 'arpeggio_down': playArpeggio(noteNames, true); break;
            case 'waltz': playWaltz(noteNames); break;
            case 'ballad': playBallad(noteNames); break;
            case 'pop': playPop(noteNames); break;
            default: playBlock(noteNames);
        }
    }

    /**
     * Play chord from note names (e.g., ['C', 'E', 'G']) at a given octave.
     */
    function playChordByNames(notes, octave = 4, style = null) {
        // Convert note names to full note names with octaves
        const noteNames = [];
        let currentOctave = octave;

        for (let i = 0; i < notes.length; i++) {
            const noteName = notes[i] + currentOctave;
            noteNames.push(noteName);

            // If next note would be lower in pitch class, bump octave
            if (i < notes.length - 1) {
                const currentPC = noteToPC(notes[i]);
                const nextPC = noteToPC(notes[i + 1]);
                if (nextPC <= currentPC) {
                    currentOctave++;
                }
            }
        }

        playChord(noteNames, style);
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

    // --- Playback Styles ---

    function playBlock(notes) {
        const dur = beatDuration() * 2;
        for (const n of notes) {
            Piano.playNote(n, dur, null, 0.7);
        }
    }

    function playArpeggio(notes, descending) {
        const ordered = descending ? [...notes].reverse() : notes;
        const interval = beatDuration() / 2;
        const now = Tone.now();

        isPlaying = true;
        for (let i = 0; i < ordered.length; i++) {
            const time = now + i * interval;
            Piano.playNote(ordered[i], beatDuration(), time, 0.65);
        }

        setTimeout(() => { isPlaying = false; }, ordered.length * interval * 1000 + 200);
    }

    function playWaltz(notes) {
        // Waltz: Bass(1) - Chord(2) - Chord(3) in 3/4 time
        if (notes.length < 2) { playBlock(notes); return; }

        const bass = notes[0]; // Root note
        const chord = notes.slice(1); // Rest of chord (or all for thin chords)
        const bt = beatDuration();
        const now = Tone.now();

        isPlaying = true;

        // Beat 1: bass note (strong)
        Piano.playNote(bass, bt * 0.9, now, 0.8);

        // Beat 2: chord (lighter)
        for (const n of chord) {
            Piano.playNote(n, bt * 0.8, now + bt, 0.5);
        }

        // Beat 3: chord again (lighter)
        for (const n of chord) {
            Piano.playNote(n, bt * 0.8, now + bt * 2, 0.45);
        }

        setTimeout(() => { isPlaying = false; }, bt * 3 * 1000 + 200);
    }

    function playBallad(notes) {
        // Ballad: slow arpeggio root-5th-3rd-5th pattern with sustain
        if (notes.length < 3) { playArpeggio(notes, false); return; }

        const bt = beatDuration();
        const now = Tone.now();
        const pattern = [0, 2, 1, 2]; // root, 5th, 3rd, 5th (indices into chord notes)

        isPlaying = true;
        for (let i = 0; i < pattern.length; i++) {
            const idx = Math.min(pattern[i], notes.length - 1);
            Piano.playNote(notes[idx], bt * 1.5, now + i * bt, 0.55);
        }

        setTimeout(() => { isPlaying = false; }, bt * pattern.length * 1000 + 200);
    }

    function playPop(notes) {
        // Pop: root-5th-octave-5th pattern
        if (notes.length < 2) { playBlock(notes); return; }

        const bt = beatDuration() * 0.5;
        const now = Tone.now();

        // root, fifth (or 2nd note), octave of root, fifth again
        const root = notes[0];
        const fifth = notes.length > 2 ? notes[2] : notes[1];

        // Create octave by shifting root name
        const rootMatch = root.match(/([A-G][#b]?)(\d+)/);
        const octaveNote = rootMatch
            ? rootMatch[1] + (parseInt(rootMatch[2]) + 1)
            : root;

        const pattern = [root, fifth, octaveNote, fifth];

        isPlaying = true;
        for (let i = 0; i < pattern.length; i++) {
            Piano.playNote(pattern[i], bt * 0.9, now + i * bt, 0.6);
        }

        setTimeout(() => { isPlaying = false; }, bt * pattern.length * 1000 + 200);
    }

    /**
     * Play a full progression (array of chord note-name arrays)
     * @param {string[][]} chordsList - Array of chord note-name arrays
     * @param {Object} [opts] - Options
     * @param {number[]} [opts.beatsPerChord] - Beats for each chord (default: 4 each)
     * @param {Function} [opts.onChordChange] - Callback(chordIndex) called when each chord starts
     * @param {Function} [opts.onDone] - Callback called when playback finishes
     */
    async function playProgression(chordsList, opts) {
        const bt = beatDuration();
        const now = Tone.now();
        isPlaying = true;

        const beatsArr = opts?.beatsPerChord || null;
        const onChordChange = opts?.onChordChange || null;
        const onDone = opts?.onDone || null;

        let totalBeatsOffset = 0;

        for (let c = 0; c < chordsList.length; c++) {
            const chordNotes = chordsList[c];
            const beats = beatsArr ? beatsArr[c] : 4;
            const chordDur = beats * bt;
            const offset = totalBeatsOffset * bt;

            // Schedule chord change callback
            if (onChordChange) {
                const idx = c;
                setTimeout(() => { onChordChange(idx); }, offset * 1000);
            }

            switch (currentStyle) {
                case 'block':
                    for (const n of chordNotes) {
                        Piano.playNote(n, chordDur * 0.85, now + offset, 0.7);
                    }
                    break;
                case 'arpeggio_up': {
                    const stagger = (chordDur * 0.8) / chordNotes.length;
                    for (let i = 0; i < chordNotes.length; i++) {
                        Piano.playNote(chordNotes[i], chordDur * 0.3, now + offset + i * stagger, 0.65);
                    }
                    break;
                }
                default:
                    for (const n of chordNotes) {
                        Piano.playNote(n, chordDur * 0.85, now + offset, 0.7);
                    }
            }

            totalBeatsOffset += beats;
        }

        const totalDuration = totalBeatsOffset * bt;
        setTimeout(() => {
            isPlaying = false;
            if (onChordChange) onChordChange(-1); // Signal end
            if (onDone) onDone();
        }, totalDuration * 1000 + 500);
    }

    return {
        setBpm,
        setStyle,
        playChord,
        playChordByNames,
        playProgression,
        get isPlaying() { return isPlaying; },
        get bpm() { return bpm; },
    };
})();
