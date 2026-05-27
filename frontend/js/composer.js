/**
 * Composer module: musical notepad, audio recorder, and project management.
 * All data persisted in localStorage.
 */

const Composer = (() => {
    const STORAGE_KEYS = {
        notes: 'musihacks_notes',
        recordings: 'musihacks_recordings',
        projects: 'musihacks_projects',
    };

    let mediaRecorder = null;
    let audioChunks = [];
    let isRecordingAudio = false;

    function init() {
        setupNotepad();
        setupAudioRecorder();
        setupProjects();
        loadAllData();
    }

    // ─── Musical Notepad ────────────────────────

    function setupNotepad() {
        const btnSave = document.getElementById('btnSaveNotes');
        const btnClear = document.getElementById('btnClearNotes');

        if (btnSave) {
            btnSave.addEventListener('click', saveNote);
        }
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                const textarea = document.getElementById('musicalNotepad');
                if (textarea) textarea.value = '';
            });
        }
    }

    function saveNote() {
        const textarea = document.getElementById('musicalNotepad');
        if (!textarea || !textarea.value.trim()) return;

        const notes = loadFromStorage(STORAGE_KEYS.notes) || [];
        notes.unshift({
            id: Date.now(),
            text: textarea.value.trim(),
            date: new Date().toISOString(),
        });

        saveToStorage(STORAGE_KEYS.notes, notes);
        textarea.value = '';
        renderNotes();
    }

    function renderNotes() {
        const container = document.getElementById('saved-notes-list');
        if (!container) return;

        const notes = loadFromStorage(STORAGE_KEYS.notes) || [];
        if (notes.length === 0) {
            container.innerHTML = '<p style="color:var(--text-dim);font-size:0.85rem">No hay notas guardadas</p>';
            return;
        }

        container.innerHTML = notes.map(note => `
            <div class="saved-note-item">
                <div class="note-text">${escapeHtml(note.text)}</div>
                <span class="note-date">${formatDate(note.date)}</span>
                <button class="note-delete" onclick="Composer.deleteNote(${note.id})" title="Eliminar">x</button>
            </div>
        `).join('');
    }

    function deleteNote(id) {
        let notes = loadFromStorage(STORAGE_KEYS.notes) || [];
        notes = notes.filter(n => n.id !== id);
        saveToStorage(STORAGE_KEYS.notes, notes);
        renderNotes();
    }

    // ─── Audio Recorder ────────────────────────

    function setupAudioRecorder() {
        const btnRecord = document.getElementById('btnAudioRecord');
        const btnStop = document.getElementById('btnAudioStop');

        if (btnRecord) {
            btnRecord.addEventListener('click', startAudioRecording);
        }
        if (btnStop) {
            btnStop.addEventListener('click', stopAudioRecording);
        }
    }

    async function startAudioRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: 'audio/webm' });
                saveAudioRecording(blob);
                stream.getTracks().forEach(t => t.stop());
            };

            mediaRecorder.start();
            isRecordingAudio = true;

            const btnRecord = document.getElementById('btnAudioRecord');
            const btnStop = document.getElementById('btnAudioStop');
            const status = document.getElementById('audioRecordStatus');

            if (btnRecord) { btnRecord.disabled = true; btnRecord.classList.add('recording'); }
            if (btnStop) btnStop.disabled = false;
            if (status) status.textContent = 'Grabando...';
        } catch (e) {
            const status = document.getElementById('audioRecordStatus');
            if (status) status.textContent = 'Error: no se pudo acceder al micrófono';
        }
    }

    function stopAudioRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        isRecordingAudio = false;

        const btnRecord = document.getElementById('btnAudioRecord');
        const btnStop = document.getElementById('btnAudioStop');
        const status = document.getElementById('audioRecordStatus');

        if (btnRecord) { btnRecord.disabled = false; btnRecord.classList.remove('recording'); }
        if (btnStop) btnStop.disabled = true;
        if (status) status.textContent = 'Grabación guardada';
    }

    function saveAudioRecording(blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const recordings = loadFromStorage(STORAGE_KEYS.recordings) || [];
            recordings.unshift({
                id: Date.now(),
                data: reader.result,
                date: new Date().toISOString(),
            });

            // Keep max 20 recordings to avoid localStorage limits
            if (recordings.length > 20) recordings.pop();

            saveToStorage(STORAGE_KEYS.recordings, recordings);
            renderRecordings();
        };
        reader.readAsDataURL(blob);
    }

    function renderRecordings() {
        const container = document.getElementById('audio-recordings-list');
        if (!container) return;

        const recordings = loadFromStorage(STORAGE_KEYS.recordings) || [];
        if (recordings.length === 0) {
            container.innerHTML = '<p style="color:var(--text-dim);font-size:0.85rem">No hay grabaciones</p>';
            return;
        }

        container.innerHTML = recordings.map(rec => `
            <div class="audio-recording-item">
                <audio controls src="${rec.data}"></audio>
                <span class="rec-date">${formatDate(rec.date)}</span>
                <button class="rec-delete" onclick="Composer.deleteRecording(${rec.id})" title="Eliminar">x</button>
            </div>
        `).join('');
    }

    function deleteRecording(id) {
        let recordings = loadFromStorage(STORAGE_KEYS.recordings) || [];
        recordings = recordings.filter(r => r.id !== id);
        saveToStorage(STORAGE_KEYS.recordings, recordings);
        renderRecordings();
    }

    // ─── Projects ────────────────────────────────

    function setupProjects() {
        const btn = document.getElementById('btnCreateProject');
        if (btn) {
            btn.addEventListener('click', createProject);
        }
    }

    function createProject() {
        const input = document.getElementById('projectName');
        if (!input || !input.value.trim()) return;

        const projects = loadFromStorage(STORAGE_KEYS.projects) || [];
        projects.unshift({
            id: Date.now(),
            name: input.value.trim(),
            date: new Date().toISOString(),
            notes: '',
            chords: [],
        });

        saveToStorage(STORAGE_KEYS.projects, projects);
        input.value = '';
        renderProjects();
    }

    function renderProjects() {
        const container = document.getElementById('projects-list');
        if (!container) return;

        const projects = loadFromStorage(STORAGE_KEYS.projects) || [];
        if (projects.length === 0) {
            container.innerHTML = '<p style="color:var(--text-dim);font-size:0.85rem">No hay proyectos</p>';
            return;
        }

        container.innerHTML = projects.map(proj => `
            <div class="project-item">
                <h4>${escapeHtml(proj.name)}</h4>
                <span class="project-date">Creado: ${formatDate(proj.date)}</span>
                <div class="project-actions">
                    <button class="btn btn-accent" style="font-size:0.75rem;padding:4px 10px"
                        onclick="Composer.editProject(${proj.id})">Abrir</button>
                    <button class="btn btn-clear" style="font-size:0.75rem;padding:4px 10px"
                        onclick="Composer.deleteProject(${proj.id})">Eliminar</button>
                </div>
            </div>
        `).join('');
    }

    function editProject(id) {
        const projects = loadFromStorage(STORAGE_KEYS.projects) || [];
        const project = projects.find(p => p.id === id);
        if (!project) return;

        // Load project notes into notepad
        const textarea = document.getElementById('musicalNotepad');
        if (textarea) {
            textarea.value = project.notes || `Proyecto: ${project.name}\n\n`;
            textarea.focus();
        }
    }

    function deleteProject(id) {
        let projects = loadFromStorage(STORAGE_KEYS.projects) || [];
        projects = projects.filter(p => p.id !== id);
        saveToStorage(STORAGE_KEYS.projects, projects);
        renderProjects();
    }

    // ─── Storage helpers ────────────────────────

    function loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    function saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('localStorage save failed:', e);
        }
    }

    function loadAllData() {
        renderNotes();
        renderRecordings();
        renderProjects();
    }

    // ─── Utility ────────────────────────────────

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(iso) {
        try {
            const d = new Date(iso);
            return d.toLocaleDateString('es-CL', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
        } catch (e) {
            return iso;
        }
    }

    return {
        init,
        deleteNote,
        deleteRecording,
        createProject,
        editProject,
        deleteProject,
    };
})();
