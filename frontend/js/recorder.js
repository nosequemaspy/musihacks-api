/**
 * Recorder module: captures note events during recording
 */

const Recorder = (() => {
    let events = [];        // {midi, velocity, time, type: 'on'|'off'}
    let recording = false;
    let startTime = 0;
    let noteStarts = {};    // midi -> start time (for computing durations)

    function start() {
        events = [];
        noteStarts = {};
        recording = true;
        startTime = Tone.now();
        updateStatus('Recording...');
    }

    function stop() {
        recording = false;
        updateStatus(`Recorded ${getNotes().length} notes`);
    }

    function clear() {
        events = [];
        noteStarts = {};
        recording = false;
        updateStatus('');
    }

    function onNoteOn(midi, velocity, time) {
        if (!recording) return;
        const relTime = time - startTime;
        events.push({ midi, velocity, time: relTime, type: 'on' });
        noteStarts[midi] = relTime;
    }

    function onNoteOff(midi, time) {
        if (!recording) return;
        const relTime = time - startTime;
        events.push({ midi, time: relTime, type: 'off' });
        delete noteStarts[midi];
    }

    function getEvents() {
        return [...events];
    }

    function getNotes() {
        // Convert on/off pairs to note objects with duration
        const notes = [];
        const onEvents = {};

        for (const evt of events) {
            if (evt.type === 'on') {
                onEvents[evt.midi] = evt;
            } else if (evt.type === 'off' && onEvents[evt.midi]) {
                const on = onEvents[evt.midi];
                notes.push({
                    midi: on.midi,
                    velocity: on.velocity,
                    start: on.time,
                    duration: evt.time - on.time,
                    note: Piano.midiToName(on.midi),
                });
                delete onEvents[evt.midi];
            }
        }

        // Handle notes still "on" at end
        const endTime = events.length > 0 ? events[events.length - 1].time : 0;
        for (const midi in onEvents) {
            const on = onEvents[midi];
            notes.push({
                midi: on.midi,
                velocity: on.velocity,
                start: on.time,
                duration: Math.max(0.5, endTime - on.time),
                note: Piano.midiToName(on.midi),
            });
        }

        return notes.sort((a, b) => a.start - b.start);
    }

    function getMidiNumbers() {
        // Get unique MIDI numbers used
        return [...new Set(events.filter(e => e.type === 'on').map(e => e.midi))];
    }

    function getDuration() {
        if (events.length === 0) return 0;
        return events[events.length - 1].time - events[0].time;
    }

    function hasData() {
        return events.some(e => e.type === 'on');
    }

    async function playBack() {
        const notes = getNotes();
        if (notes.length === 0) return;

        const now = Tone.now();
        for (const note of notes) {
            Piano.playNote(note.note, note.duration, now + note.start, note.velocity);
        }
    }

    /**
     * Detect chords by grouping simultaneous notes.
     * Notes within `threshold` seconds are considered simultaneous.
     */
    function detectChordGroups(threshold = 0.08) {
        const notes = getNotes();
        if (notes.length === 0) return [];

        const groups = [];
        let currentGroup = [notes[0]];

        for (let i = 1; i < notes.length; i++) {
            if (notes[i].start - currentGroup[0].start < threshold) {
                currentGroup.push(notes[i]);
            } else {
                groups.push(currentGroup);
                currentGroup = [notes[i]];
            }
        }
        groups.push(currentGroup);

        return groups.map(g => ({
            midiNotes: g.map(n => n.midi),
            start: g[0].start,
            notes: g.map(n => n.note),
        }));
    }

    function updateStatus(text) {
        const el = document.getElementById('recordingStatus');
        if (el) el.textContent = text;
    }

    return {
        start,
        stop,
        clear,
        onNoteOn,
        onNoteOff,
        getEvents,
        getNotes,
        getMidiNumbers,
        getDuration,
        hasData,
        playBack,
        detectChordGroups,
        get isRecording() { return recording; },
    };
})();
