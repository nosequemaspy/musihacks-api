/**
 * HarmonyTools module: cadences, tritone substitution, modal interchange,
 * negative harmony, Chopin bass, melody-based suggestions, SUS4 dominants,
 * melody resource examples.
 */

const HarmonyTools = (() => {

    const ALL_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    const FIFTH_MAP = {
        'C': 'G', 'Db': 'Ab', 'D': 'A', 'Eb': 'Bb', 'E': 'B', 'F': 'C',
        'F#': 'C#', 'G': 'D', 'Ab': 'Eb', 'A': 'E', 'Bb': 'F', 'B': 'F#'
    };

    function init() {
        setupCadences();
        setupTritone();
        setupModalInterchange();
        setupNegativeHarmony();
        setupChopinBass();
        setupMelodySuggestions();
        setupSus4Table();
        setupCinematic();
        setupImprovisation();
        setupMediants();
        setupComposition();
    }

    // ─── SUS4 Dominants Table ──────────────────────

    async function setupSus4Table() {
        const container = document.getElementById('sus4-table-container');
        if (!container) return;

        let html = `
            <table class="sus4-table">
                <thead>
                    <tr>
                        <th>Tonalidad</th>
                        <th>V7sus4</th>
                        <th>&rarr;</th>
                        <th>V7</th>
                        <th>&rarr;</th>
                        <th>I</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (const key of ALL_KEYS) {
            const V = FIFTH_MAP[key];
            html += `
                <tr data-key="${key}" data-v="${V}">
                    <td><strong>${key} Mayor</strong></td>
                    <td><button class="sus4-chord-btn fn-dominant-bg" data-root="${V}" data-type="7sus4">${V}7sus4</button></td>
                    <td>&rarr;</td>
                    <td><button class="sus4-chord-btn fn-dominant-bg" data-root="${V}" data-type="dominant7">${V}7</button></td>
                    <td>&rarr;</td>
                    <td><button class="sus4-chord-btn fn-tonic-bg" data-root="${key}" data-type="major">${key}</button></td>
                </tr>
            `;
        }

        html += '</tbody></table>';
        container.innerHTML = html;

        // Click on individual chord buttons
        container.querySelectorAll('.sus4-chord-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const root = btn.dataset.root;
                const type = btn.dataset.type;
                try {
                    const resp = await fetch(`/api/chords/${encodeURIComponent(root)}/${type}`);
                    const data = await resp.json();
                    if (Tone.context.state !== 'running') await Tone.start();
                    highlightChordOnPiano(data.notes);
                    const noteNames = buildChordNoteNames(data.notes, 4);
                    for (const n of noteNames) {
                        Piano.playNote(n, 1.5, null, 0.7);
                    }
                } catch (err) {}
            });
        });

        // Click on row to play full sequence
        container.querySelectorAll('tbody tr').forEach(row => {
            row.addEventListener('click', async () => {
                const key = row.dataset.key;
                const V = row.dataset.v;
                row.classList.add('playing');

                try {
                    if (Tone.context.state !== 'running') await Tone.start();

                    // Fetch all three chords
                    const [sus4Resp, dom7Resp, tonicResp] = await Promise.all([
                        fetch(`/api/chords/${encodeURIComponent(V)}/7sus4`),
                        fetch(`/api/chords/${encodeURIComponent(V)}/dominant7`),
                        fetch(`/api/chords/${encodeURIComponent(key)}/major`),
                    ]);

                    const sus4Data = await sus4Resp.json();
                    const dom7Data = await dom7Resp.json();
                    const tonicData = await tonicResp.json();

                    const bt = 60 / 120;
                    const now = Tone.now();

                    // Play V7sus4
                    highlightChordOnPiano(sus4Data.notes);
                    const sus4Notes = buildChordNoteNames(sus4Data.notes, 4);
                    for (const n of sus4Notes) Piano.playNote(n, bt * 1.8, now, 0.7);

                    // Play V7
                    const dom7Notes = buildChordNoteNames(dom7Data.notes, 4);
                    for (const n of dom7Notes) Piano.playNote(n, bt * 1.8, now + bt * 2, 0.7);
                    setTimeout(() => highlightChordOnPiano(dom7Data.notes), bt * 2 * 1000);

                    // Play I
                    const tonicNotes = buildChordNoteNames(tonicData.notes, 4);
                    for (const n of tonicNotes) Piano.playNote(n, bt * 3, now + bt * 4, 0.8);
                    setTimeout(() => highlightChordOnPiano(tonicData.notes), bt * 4 * 1000);

                } catch (err) {}

                setTimeout(() => row.classList.remove('playing'), 3500);
            });
        });
    }

    // ─── Cadences ────────────────────────────────

    function setupCadences() {
        const btn = document.getElementById('btnLoadCadences');
        if (btn) {
            btn.addEventListener('click', () => {
                const key = document.getElementById('cadenceKeySelect').value;
                loadCadences(key);
            });
        }
    }

    async function loadCadences(key) {
        const container = document.getElementById('cadences-container');
        if (!container) return;

        try {
            const resp = await fetch(`/api/cadences/${encodeURIComponent(key)}`);
            const cadences = await resp.json();

            container.innerHTML = '';
            for (const cad of cadences) {
                const card = document.createElement('div');
                card.className = 'cadence-card';

                const categoryClass = cad.category === 'conclusiva' ? 'conclusiva' :
                    cad.category === 'suspensiva' ? 'suspensiva' : 'progresion';

                card.innerHTML = `
                    <span class="cadence-category ${categoryClass}">${cad.category}</span>
                    <div class="cadence-name">${cad.name}</div>
                    <div class="cadence-chords">${cad.chords.map(c => c.symbol).join(' → ')}</div>
                    <div class="cadence-numerals">${cad.numerals}</div>
                    <div class="cadence-desc">${cad.description}</div>
                `;

                card.addEventListener('click', () => {
                    playCadence(cad, card);
                });

                container.appendChild(card);
            }
        } catch (e) {
            container.innerHTML = '<p style="color:var(--dominant)">Error al cargar cadencias</p>';
        }
    }

    async function playCadence(cadence, card) {
        if (Tone.context.state !== 'running') await Tone.start();

        card.classList.add('playing');
        const bt = 60 / 120;
        const now = Tone.now();

        for (let i = 0; i < cadence.chords.length; i++) {
            const chord = cadence.chords[i];
            const noteNames = buildChordNoteNames(chord.notes, 4);

            for (const n of noteNames) {
                Piano.playNote(n, bt * 1.8, now + i * bt * 2, 0.7);
            }

            // Highlight each chord on the piano as it plays
            const delay = i * bt * 2 * 1000;
            setTimeout(() => highlightChordOnPiano(chord.notes), delay);
        }

        const totalTime = cadence.chords.length * bt * 2 * 1000 + 500;
        setTimeout(() => card.classList.remove('playing'), totalTime);
    }

    // ─── Tritone Substitution ────────────────────

    function setupTritone() {
        const btn = document.getElementById('btnTritone');
        const input = document.getElementById('tritoneInput');
        if (btn) {
            btn.addEventListener('click', () => {
                const val = input ? input.value.trim() : '';
                if (val) calculateTritone(val);
            });
        }
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const val = input.value.trim();
                    if (val) calculateTritone(val);
                }
            });
        }

        const btnAll = document.getElementById('btnTritoneAll');
        if (btnAll) {
            btnAll.addEventListener('click', loadAllTritoneSubs);
        }
    }

    async function calculateTritone(chordStr) {
        const result = document.getElementById('tritone-result');
        if (!result) return;

        const parsed = parseChordSymbol(chordStr);

        try {
            const resp = await fetch('/api/tritone-sub', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ root: parsed.root, chord_type: 'dominant7' }),
            });

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                result.innerHTML = `<p style="color:var(--dominant)">Error: ${err.detail || 'acorde no válido'}. Usa formato como G7, Db7, A7.</p>`;
                return;
            }

            const data = await resp.json();

            result.innerHTML = `
                <div class="result-card">
                    <h4>Resultado</h4>
                    <div class="tritone-comparison">
                        <div class="tritone-side">
                            <div class="tritone-label">Original</div>
                            <div class="tritone-symbol">${data.original.symbol}</div>
                            <div class="tritone-notes">${data.original.notes.join(' - ')}</div>
                            <button class="example-btn" onclick="HarmonyTools.playChordFromNotes(${JSON.stringify(data.original.notes)})">Escuchar</button>
                        </div>
                        <div class="tritone-arrow">
                            <span>&#8596;</span>
                            <span style="font-size:0.75rem;color:var(--text-muted)">tritono</span>
                        </div>
                        <div class="tritone-side">
                            <div class="tritone-label">Sustitución</div>
                            <div class="tritone-symbol">${data.substitution.symbol}</div>
                            <div class="tritone-notes">${data.substitution.notes.join(' - ')}</div>
                            <button class="example-btn" onclick="HarmonyTools.playChordFromNotes(${JSON.stringify(data.substitution.notes)})">Escuchar</button>
                        </div>
                    </div>
                    <p style="margin-top:10px"><strong>Notas compartidas:</strong> ${data.shared_notes ? data.shared_notes.join(' y ') : data.shared_tones + ' notas'} (3era y 7ma = tritono interno)</p>
                    <p><strong>Resolución cromática:</strong> ${data.substitution.symbol} → ${data.resolution || '?'} (bajo desciende por semitono)</p>
                    <p style="color:var(--text-muted);margin-top:8px">${data.explanation}</p>
                    <div style="margin-top:10px">
                        <button class="example-btn" onclick="HarmonyTools.playTritoneResolution(${JSON.stringify(data)})">Escuchar resolución completa</button>
                    </div>
                </div>
            `;
        } catch (e) {
            result.innerHTML = '<p style="color:var(--dominant)">Error: verifica que el acorde sea válido (ej: G7, D7, Eb7)</p>';
        }
    }

    async function loadAllTritoneSubs() {
        const container = document.getElementById('tritone-all-keys');
        if (!container) return;

        container.classList.remove('hidden');
        container.innerHTML = '<p style="color:var(--text-muted)">Cargando...</p>';

        try {
            const resp = await fetch('/api/tritone-subs');
            if (!resp.ok) { container.innerHTML = '<p style="color:var(--dominant)">Error al cargar</p>'; return; }
            const subs = await resp.json();

            let html = `
                <div class="result-card">
                    <h4>Sustituciones tritonales - Todas las tonalidades</h4>
                    <table class="neg-harmony-table">
                        <tr><th>Original</th><th>Notas</th><th>&#8596;</th><th>Sustitución</th><th>Notas</th><th>Compartidas</th><th></th></tr>
            `;

            for (const sub of subs) {
                html += `
                    <tr>
                        <td><strong>${sub.original.symbol}</strong></td>
                        <td style="color:var(--text-muted);font-size:0.8rem">${sub.original.notes.join(', ')}</td>
                        <td>&#8596;</td>
                        <td><strong style="color:var(--accent-blue)">${sub.substitution.symbol}</strong></td>
                        <td style="color:var(--text-muted);font-size:0.8rem">${sub.substitution.notes.join(', ')}</td>
                        <td style="font-size:0.8rem">${sub.shared_notes ? sub.shared_notes.join(', ') : sub.shared_tones}</td>
                        <td>
                            <button class="example-btn" style="padding:2px 8px;font-size:0.75rem"
                                onclick="HarmonyTools.playTritoneResolution(${JSON.stringify(sub).replace(/"/g, '&quot;')})">
                                Escuchar
                            </button>
                        </td>
                    </tr>
                `;
            }

            html += '</table></div>';
            container.innerHTML = html;
        } catch (e) {
            container.innerHTML = '<p style="color:var(--dominant)">Error al cargar sustituciones tritonales</p>';
        }
    }

    async function playTritoneResolution(data) {
        if (Tone.context.state !== 'running') await Tone.start();
        const bt = 60 / 120;
        const now = Tone.now();

        // Play substitution chord
        highlightChordOnPiano(data.substitution.notes);
        const subNotes = buildChordNoteNames(data.substitution.notes, 4);
        for (const n of subNotes) Piano.playNote(n, bt * 1.8, now, 0.7);

        // Resolve to target (semitone below sub root = tonic major chord)
        if (data.resolution) {
            try {
                const resp = await fetch(`/api/chords/${encodeURIComponent(data.resolution)}/major`);
                const tonicData = await resp.json();
                const tonicNotes = buildChordNoteNames(tonicData.notes, 4);
                for (const n of tonicNotes) Piano.playNote(n, bt * 3, now + bt * 2, 0.8);
                setTimeout(() => highlightChordOnPiano(tonicData.notes), bt * 2 * 1000);
            } catch (e) {}
        }
    }

    // ─── Modal Interchange ────────────────────────

    function setupModalInterchange() {
        const btn = document.getElementById('btnModalInterchange');
        if (btn) {
            btn.addEventListener('click', () => {
                const key = document.getElementById('modalInterchangeKey').value;
                const mode = document.getElementById('modalInterchangeMode')?.value || 'major';
                loadModalInterchange(key, mode);
            });
        }
    }

    async function loadModalInterchange(key, mode = 'major') {
        const result = document.getElementById('modal-interchange-result');
        if (!result) return;

        try {
            const resp = await fetch(`/api/modal-interchange/${encodeURIComponent(key)}?mode=${mode}`);
            const data = await resp.json();

            const parallelLabel = data.parallel_minor || data.parallel_major || '?';
            let html = `
                <div class="result-card">
                    <h4>Acordes prestados de ${parallelLabel}</h4>
                    <p style="color:var(--text-muted);margin-bottom:12px">${data.explanation}</p>
                </div>
            `;

            for (const chord of data.borrowed_chords) {
                html += `
                    <div class="borrowed-chord-card" onclick="HarmonyTools.playChordFromNotes(${JSON.stringify(chord.notes)})">
                        <span class="bc-symbol">${chord.symbol}</span>
                        <span class="bc-numeral">${chord.degree}</span>
                        <div class="bc-usage">${chord.usage}</div>
                    </div>
                `;
            }

            result.innerHTML = html;
        } catch (e) {
            result.innerHTML = '<p style="color:var(--dominant)">Error al cargar intercambio modal</p>';
        }
    }

    // ─── Negative Harmony ────────────────────────

    function setupNegativeHarmony() {
        const btn = document.getElementById('btnNegativeHarmony');
        if (btn) {
            btn.addEventListener('click', () => {
                const key = document.getElementById('negativeHarmonyKey').value;
                loadNegativeHarmony(key);
            });
        }
    }

    async function loadNegativeHarmony(key) {
        const result = document.getElementById('negative-harmony-result');
        if (!result) return;

        try {
            const resp = await fetch(`/api/negative-harmony/${encodeURIComponent(key)}`);
            const data = await resp.json();

            let html = `
                <div class="result-card">
                    <h4>Armonía negativa en ${key} mayor</h4>
                    <p style="color:var(--text-muted)">Eje de simetría: ${data.axis}</p>
                    <p style="color:var(--text-muted);margin-bottom:12px">${data.explanation}</p>
                </div>

                <div class="result-card">
                    <h4>Mapeo de acordes diatónicos</h4>
                    <table class="neg-harmony-table">
                        <tr><th>Original</th><th>Numeral</th><th>Función</th><th>→</th><th>Negativo</th></tr>
            `;

            for (const m of data.chord_mappings) {
                html += `
                    <tr>
                        <td><strong>${m.original}</strong></td>
                        <td>${m.original_numeral}</td>
                        <td>${m.original_function}</td>
                        <td>→</td>
                        <td>
                            <strong>${m.negative}</strong>
                            <button class="example-btn" style="margin-left:8px;padding:2px 8px;font-size:0.75rem"
                                onclick="HarmonyTools.playChordFromNotes(${JSON.stringify(m.negative_notes)})">
                                Tocar
                            </button>
                        </td>
                    </tr>
                `;
            }

            html += '</table></div>';

            // Note mappings
            html += `
                <div class="result-card">
                    <h4>Mapeo de notas individuales</h4>
                    <div style="display:flex;flex-wrap:wrap;gap:6px">
            `;
            for (const m of data.note_mappings) {
                html += `<span class="chord-tag" style="background:var(--bg-card)">${m.original} → ${m.negative}</span>`;
            }
            html += '</div></div>';

            result.innerHTML = html;
        } catch (e) {
            result.innerHTML = '<p style="color:var(--dominant)">Error al calcular armonía negativa</p>';
        }
    }

    // ─── Chopin Bass ────────────────────────────

    function setupChopinBass() {
        const btn = document.getElementById('btnChopin');
        if (btn) {
            btn.addEventListener('click', () => {
                const input = document.getElementById('chopinInput').value.trim();
                if (input) calculateChopin(input);
            });
        }

        // "Ver todas las tonalidades" button
        const btnAll = document.getElementById('btnChopinAll');
        if (btnAll) {
            btnAll.addEventListener('click', loadChopinAllKeys);
        }
    }

    async function calculateChopin(chordStr) {
        const result = document.getElementById('chopin-result');
        if (!result) return;

        const parsed = parseChordSymbol(chordStr);

        try {
            const resp = await fetch('/api/chopin-bass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ root: parsed.root, chord_type: parsed.type }),
            });
            const data = await resp.json();

            // Update diagram
            const rootEl = document.getElementById('chopinDiagramRoot');
            const bassEl = document.getElementById('chopinDiagramBass');
            if (rootEl) rootEl.textContent = data.chord.root;
            if (bassEl) bassEl.textContent = data.bass_note;

            result.innerHTML = `
                <div class="result-card">
                    <h4>${data.notation}</h4>
                    <p>Bajo: <strong>${data.bass_note}</strong> (3era menor debajo de ${data.chord.root})</p>
                    <p>Voicing completo: ${data.voicing.join(' - ')}</p>
                    <p style="color:var(--text-muted);margin-top:8px">${data.explanation}</p>
                    <div style="margin-top:10px">
                        <button class="example-btn" onclick="HarmonyTools.playChopinVoicing(${JSON.stringify(data)})">Escuchar</button>
                    </div>
                </div>
            `;
        } catch (e) {
            result.innerHTML = '<p style="color:var(--dominant)">Error: verifica el acorde (ej: C, Am, G7)</p>';
        }
    }

    async function loadChopinAllKeys() {
        const container = document.getElementById('chopin-all-keys');
        if (!container) return;

        container.classList.remove('hidden');
        container.innerHTML = '<p style="color:var(--text-muted)">Cargando...</p>';

        let html = `
            <div class="result-card">
                <h4>Bajo de Chopin - Todas las tonalidades</h4>
                <table class="neg-harmony-table">
                    <tr><th>Acorde</th><th>Bajo</th><th>Notación</th><th></th></tr>
        `;

        for (const key of ALL_KEYS) {
            try {
                const resp = await fetch('/api/chopin-bass', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ root: key, chord_type: 'major' }),
                });
                const data = await resp.json();

                html += `
                    <tr>
                        <td><strong>${key}</strong></td>
                        <td><strong style="color:var(--accent-blue)">${data.bass_note}</strong></td>
                        <td>${data.notation}</td>
                        <td>
                            <button class="example-btn" style="padding:2px 8px;font-size:0.75rem"
                                onclick="HarmonyTools.playChopinVoicing(${JSON.stringify(data).replace(/"/g, '&quot;')})">
                                Escuchar
                            </button>
                        </td>
                    </tr>
                `;
            } catch (e) {}
        }

        html += '</table></div>';
        container.innerHTML = html;
    }

    // ─── Melody Suggestions ────────────────────

    function setupMelodySuggestions() {
        const btn = document.getElementById('btnSuggestFromMelody');
        if (btn) {
            btn.addEventListener('click', suggestFromMelody);
        }
    }

    async function suggestFromMelody() {
        const result = document.getElementById('melody-suggest-result');
        if (!result) return;

        const midiNotes = Recorder.getMidiNumbers();
        if (midiNotes.length < 2) {
            result.innerHTML = '<p style="color:var(--subdominant)">Primero graba una melodía en el piano (tab "Piano & Estudio")</p>';
            return;
        }

        try {
            const resp = await fetch('/api/suggest-from-melody', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: midiNotes }),
            });
            const data = await resp.json();

            let html = `
                <div class="result-card">
                    <h4>Tonalidad detectada: ${data.detected_key} Mayor (${data.key_confidence}%)</h4>
                    <p>Notas de la melodía: ${data.melody_notes.join(', ')}</p>
                </div>
            `;

            if (data.compatible_chords && data.compatible_chords.length > 0) {
                html += '<div class="result-card"><h4>Acordes compatibles</h4>';
                for (const chord of data.compatible_chords) {
                    html += `
                        <div class="borrowed-chord-card" onclick="HarmonyTools.playChordFromNotes(${JSON.stringify(chord.notes)})">
                            <span class="bc-symbol">${chord.symbol}</span>
                            <span class="bc-numeral">${chord.numeral}</span>
                            <span style="color:var(--text-muted);font-size:0.78rem;margin-left:8px">${chord.function} (${chord.match_ratio}% coincidencia)</span>
                        </div>
                    `;
                }
                html += '</div>';
            }

            if (data.compatible_secondary_dominants && data.compatible_secondary_dominants.length > 0) {
                html += '<div class="result-card"><h4>Dominantes secundarios compatibles</h4>';
                for (const sd of data.compatible_secondary_dominants) {
                    html += `
                        <div class="borrowed-chord-card" onclick="HarmonyTools.playChordFromNotes(${JSON.stringify(sd.notes)})">
                            <span class="bc-symbol">${sd.symbol}</span>
                            <span class="bc-numeral">${sd.label} → ${sd.target}</span>
                        </div>
                    `;
                }
                html += '</div>';
            }

            result.innerHTML = html;
        } catch (e) {
            result.innerHTML = '<p style="color:var(--dominant)">Error al analizar melodía</p>';
        }
    }

    // ─── Melody Resource Examples ──────────────

    function playMelodyExample(type) {
        if (Tone.context.state !== 'running') Tone.start();
        const now = Tone.now();
        const bt = 0.35;

        switch (type) {
            case 'passing':
                // C major chord: C-E-G. Passing notes between C and E: C→D→E then E→F→G
                Piano.playNote('C4', bt * 1.5, now, 0.65);
                Piano.playNote('D4', bt * 1.5, now + bt, 0.5);      // passing tone
                Piano.playNote('E4', bt * 1.5, now + bt * 2, 0.65);
                Piano.playNote('F4', bt * 1.5, now + bt * 3, 0.5);  // passing tone
                Piano.playNote('G4', bt * 2, now + bt * 4, 0.7);
                // Play C chord underneath
                Piano.playNote('C3', bt * 6, now, 0.4);
                Piano.playNote('E3', bt * 6, now, 0.35);
                Piano.playNote('G3', bt * 6, now, 0.35);
                break;

            case 'anticipation':
                // Playing in C: end of F chord, anticipate G chord
                // F chord + melody on A4, then G4 arrives early (anticipation), then G chord
                Piano.playNote('F3', bt * 4, now, 0.4);
                Piano.playNote('A3', bt * 4, now, 0.35);
                Piano.playNote('C4', bt * 4, now, 0.35);
                Piano.playNote('A4', bt * 2, now, 0.6);
                Piano.playNote('G4', bt * 3, now + bt * 3, 0.65); // anticipation of G chord
                // G chord arrives
                Piano.playNote('G3', bt * 4, now + bt * 4, 0.45);
                Piano.playNote('B3', bt * 4, now + bt * 4, 0.4);
                Piano.playNote('D4', bt * 4, now + bt * 4, 0.4);
                Piano.playNote('G4', bt * 4, now + bt * 4, 0.6);  // now it's a chord tone
                break;

            case 'floreo':
                // E4 → F4 (floreo superior) → E4, over C chord
                Piano.playNote('C3', bt * 6, now, 0.4);
                Piano.playNote('E3', bt * 6, now, 0.35);
                Piano.playNote('G3', bt * 6, now, 0.35);
                Piano.playNote('E4', bt * 1.5, now, 0.65);
                Piano.playNote('F4', bt * 1.2, now + bt, 0.5);    // upper neighbor (floreo)
                Piano.playNote('E4', bt * 2, now + bt * 2, 0.65);
                // Then: G4 → Ab4 (floreo) → G4
                Piano.playNote('G4', bt * 1.5, now + bt * 3.5, 0.65);
                Piano.playNote('Ab4', bt * 1.2, now + bt * 4.5, 0.5); // upper neighbor
                Piano.playNote('G4', bt * 2, now + bt * 5.5, 0.65);
                break;
        }
    }

    // ─── Cinematic Progressions ────────────────────

    function setupCinematic() {
        const btn = document.getElementById('btnLoadCinematic');
        if (btn) {
            btn.addEventListener('click', () => {
                const key = document.getElementById('cinematicKeySelect').value;
                const style = document.getElementById('cinematicStyleSelect').value;
                loadCinematic(key, style);
            });
        }
    }

    async function loadCinematic(key, style) {
        const container = document.getElementById('cinematic-container');
        if (!container) return;

        container.innerHTML = '<p style="color:var(--text-muted)">Cargando...</p>';

        try {
            let url = `/api/cinematic/${encodeURIComponent(key)}`;
            if (style) url += `?style=${encodeURIComponent(style)}`;
            const resp = await fetch(url);
            const data = await resp.json();

            let html = '';
            for (const [styleKey, styleData] of Object.entries(data.styles)) {
                html += `
                    <div class="cinematic-style-section">
                        <h4 class="cinematic-style-title">${styleData.label}</h4>
                        <p class="cinematic-style-desc">${styleData.description}</p>
                        <div class="cinematic-techniques">
                            <strong>Tecnicas clave:</strong>
                            <ul>${styleData.techniques.map(t => `<li>${t}</li>`).join('')}</ul>
                        </div>
                        <div class="cinematic-progs-grid">
                `;

                for (const prog of styleData.progressions) {
                    const chordsStr = prog.chords.map(c => c.symbol).join(' &rarr; ');
                    const numeralsStr = prog.numerals.join(' &rarr; ');
                    const examplesHtml = prog.examples.length > 0
                        ? `<div class="cinematic-examples">${prog.examples.map(ex =>
                            `<span class="cinematic-example-tag">${ex.title} <em>(${ex.source})</em></span>`
                        ).join('')}</div>`
                        : '';

                    html += `
                        <div class="cadence-card cinematic-prog-card" data-chords='${JSON.stringify(prog.chords)}'>
                            <div class="cadence-name">${prog.name}</div>
                            <div class="cadence-chords">${chordsStr}</div>
                            <div class="cadence-numerals">${numeralsStr}</div>
                            <div class="cadence-desc">${prog.description}</div>
                            <div class="cinematic-usage"><strong>Uso:</strong> ${prog.usage}</div>
                            ${examplesHtml}
                        </div>
                    `;
                }

                html += '</div></div>';
            }

            container.innerHTML = html;

            // Click to play progression
            container.querySelectorAll('.cinematic-prog-card').forEach(card => {
                card.addEventListener('click', () => {
                    const chords = JSON.parse(card.dataset.chords);
                    playCinematicProgression(chords, card);
                });
            });
        } catch (e) {
            container.innerHTML = '<p style="color:var(--dominant)">Error al cargar progresiones</p>';
        }
    }

    async function playCinematicProgression(chords, card) {
        if (Tone.context.state !== 'running') await Tone.start();
        card.classList.add('playing');

        const bt = 60 / 90; // Slightly slower tempo for cinematic feel
        const now = Tone.now();

        for (let i = 0; i < chords.length; i++) {
            const chord = chords[i];
            const noteNames = buildChordNoteNames(chord.notes, 4);

            for (const n of noteNames) {
                Piano.playNote(n, bt * 1.8, now + i * bt * 2, 0.65);
            }

            const delay = i * bt * 2 * 1000;
            setTimeout(() => highlightChordOnPiano(chord.notes), delay);
        }

        const totalTime = chords.length * bt * 2 * 1000 + 500;
        setTimeout(() => card.classList.remove('playing'), totalTime);
    }

    // ─── Improvisation Guide ────────────────────

    function setupImprovisation() {
        const btn = document.getElementById('btnLoadImprov');
        if (btn) {
            btn.addEventListener('click', () => {
                const key = document.getElementById('improvKeySelect').value;
                loadImprovisation(key);
            });
        }
    }

    async function loadImprovisation(key) {
        const container = document.getElementById('improv-container');
        if (!container) return;

        container.innerHTML = '<p style="color:var(--text-muted)">Cargando...</p>';

        try {
            const resp = await fetch(`/api/improvisation/${encodeURIComponent(key)}`);
            const data = await resp.json();

            let html = '';

            // General tips
            html += '<div class="improv-tips-section">';
            html += '<h4>Consejos generales de improvisacion</h4>';
            html += '<div class="improv-tips-grid">';
            for (const tip of data.general_tips) {
                html += `
                    <div class="improv-tip-card">
                        <div class="improv-tip-title">${tip.title}</div>
                        <div class="improv-tip-text">${tip.tip}</div>
                    </div>
                `;
            }
            html += '</div></div>';

            // Per-chord guide
            html += '<h4 style="margin-top:1.5rem">Guia por acorde diatonico</h4>';
            html += '<div class="improv-chords-grid">';

            for (const chord of data.chords) {
                const fnClass = chord.function.toLowerCase().startsWith('tonic') ? 'fn-tonic-bg' :
                    chord.function.toLowerCase().startsWith('dominant') ? 'fn-dominant-bg' : 'fn-subdominant-bg';

                // Guide tones
                const guideTones = chord.guide_tones.join(', ');

                // Tensions
                const tensionsHtml = chord.tensions.length > 0
                    ? chord.tensions.map(t =>
                        `<span class="improv-tension-tag" title="${t.effect}">${t.note} (${t.name})</span>`
                    ).join('')
                    : '<span class="improv-no-data">-</span>';

                // Avoid notes
                const avoidHtml = chord.avoid_notes.length > 0
                    ? chord.avoid_notes.map(a =>
                        `<span class="improv-avoid-tag" title="${a.reason}">${a.note} (${a.name})</span>`
                    ).join('')
                    : '<span class="improv-no-data">Sin notas a evitar</span>';

                // Scales
                const scalesHtml = chord.recommended_scales.map(s =>
                    `<div class="improv-scale-item" data-notes='${JSON.stringify(s.notes)}'>
                        <strong>${s.name}</strong>: ${s.notes.join(' - ')}
                        <div class="improv-scale-context">${s.context}</div>
                    </div>`
                ).join('');

                html += `
                    <div class="improv-chord-card">
                        <div class="improv-chord-header ${fnClass}">
                            <span class="improv-chord-symbol">${chord.chord}</span>
                            <span class="improv-chord-numeral">${chord.numeral}</span>
                            ${chord.seventh ? `<span class="improv-chord-seventh">(${chord.seventh})</span>` : ''}
                        </div>
                        <div class="improv-chord-body">
                            <div class="improv-section">
                                <div class="improv-label">Notas guia</div>
                                <div class="improv-guide-tones">${guideTones}</div>
                            </div>
                            <div class="improv-section">
                                <div class="improv-label">Tensiones disponibles</div>
                                <div class="improv-tensions">${tensionsHtml}</div>
                            </div>
                            <div class="improv-section">
                                <div class="improv-label">Notas a evitar</div>
                                <div class="improv-avoid">${avoidHtml}</div>
                            </div>
                            <div class="improv-section">
                                <div class="improv-label">Escalas recomendadas</div>
                                <div class="improv-scales">${scalesHtml}</div>
                            </div>
                        </div>
                    </div>
                `;
            }

            html += '</div>';

            container.innerHTML = html;

            // Click on scale items to play them
            container.querySelectorAll('.improv-scale-item').forEach(item => {
                item.addEventListener('click', () => {
                    const notes = JSON.parse(item.dataset.notes);
                    if (notes.length > 0) playScale(notes);
                });
                item.style.cursor = 'pointer';
                item.title = 'Click para escuchar la escala';
            });
        } catch (e) {
            container.innerHTML = '<p style="color:var(--dominant)">Error al cargar guia de improvisacion</p>';
        }
    }

    async function playScale(notes) {
        if (Tone.context.state !== 'running') await Tone.start();
        const now = Tone.now();
        const bt = 0.25;

        const noteNames = [];
        let octave = 4;
        let prevPC = -1;
        for (const note of notes) {
            const pc = Piano.noteToPC(note);
            if (prevPC >= 0 && pc <= prevPC) octave++;
            noteNames.push(note + octave);
            prevPC = pc;
        }

        for (let i = 0; i < noteNames.length; i++) {
            Piano.playNote(noteNames[i], bt * 1.5, now + i * bt, 0.6);
        }
    }

    // ─── Chromatic Mediants ────────────────────

    function setupMediants() {
        const btn = document.getElementById('btnLoadMediants');
        if (btn) {
            btn.addEventListener('click', () => {
                const key = document.getElementById('mediantsKeySelect').value;
                loadMediants(key);
            });
        }
    }

    async function loadMediants(key) {
        const container = document.getElementById('mediants-container');
        if (!container) return;

        container.innerHTML = '<p style="color:var(--text-muted)">Cargando...</p>';

        try {
            const resp = await fetch(`/api/chromatic-mediants/${encodeURIComponent(key)}`);
            const data = await resp.json();

            let html = `
                <p class="mediants-explanation">${data.explanation}</p>
                <div class="mediants-grid">
            `;

            for (const m of data.mediants) {
                html += `
                    <div class="cadence-card mediants-card" data-notes='${JSON.stringify(m)}'>
                        <div class="mediants-pair">
                            <span class="mediants-from">${m.from_chord}</span>
                            <span class="mediants-arrow">&rarr;</span>
                            <span class="mediants-to">${m.to_chord}</span>
                        </div>
                        <div class="mediants-direction">${m.label}</div>
                        <div class="mediants-common">Notas comunes: ${m.common_tones.join(', ')} (${m.common_count})</div>
                        <div class="cadence-desc">${m.effect}</div>
                    </div>
                `;
            }

            html += '</div>';
            container.innerHTML = html;

            // Click to play mediant pair
            container.querySelectorAll('.mediants-card').forEach(card => {
                card.addEventListener('click', () => {
                    const m = JSON.parse(card.dataset.notes);
                    playMediantPair(key, m, card);
                });
            });
        } catch (e) {
            container.innerHTML = '<p style="color:var(--dominant)">Error al cargar mediantes cromaticas</p>';
        }
    }

    async function playMediantPair(key, mediant, card) {
        if (Tone.context.state !== 'running') await Tone.start();
        card.classList.add('playing');

        const bt = 60 / 80;
        const now = Tone.now();

        // Play tonic chord
        try {
            const resp1 = await fetch(`/api/chords/${encodeURIComponent(key)}/major`);
            const tonic = await resp1.json();

            const parsed = parseChordSymbol(mediant.to_chord);
            const resp2 = await fetch(`/api/chords/${encodeURIComponent(parsed.root)}/${parsed.type}`);
            const target = await resp2.json();

            // Play tonic
            highlightChordOnPiano(tonic.notes);
            const tonicNames = buildChordNoteNames(tonic.notes, 4);
            for (const n of tonicNames) Piano.playNote(n, bt * 1.8, now, 0.7);

            // Play mediant
            const targetNames = buildChordNoteNames(target.notes, 4);
            for (const n of targetNames) Piano.playNote(n, bt * 2.5, now + bt * 2, 0.7);
            setTimeout(() => highlightChordOnPiano(target.notes), bt * 2 * 1000);

        } catch (err) {}

        setTimeout(() => card.classList.remove('playing'), 4000);
    }

    // ─── Composition Guide ────────────────────

    function setupComposition() {
        const btn = document.getElementById('btnLoadCompose');
        if (btn) {
            btn.addEventListener('click', () => {
                const style = document.getElementById('composeStyleSelect').value;
                loadComposition(style);
            });
            // Auto-load ghibli on init
            loadComposition('ghibli');
        }
    }

    async function loadComposition(style) {
        const container = document.getElementById('compose-container');
        if (!container) return;

        container.innerHTML = '<p style="color:var(--text-muted)">Cargando...</p>';

        try {
            const resp = await fetch(`/api/composition-guide?style=${encodeURIComponent(style)}`);
            const data = await resp.json();
            const guide = data.guide;

            let html = `
                <div class="compose-guide">
                    <h4>${guide.title}</h4>
                    <p class="compose-overview">${guide.overview}</p>

                    <div class="compose-section">
                        <h5>Paleta armonica</h5>
                        <ul class="compose-list">${guide.harmonic_palette.map(p => `<li>${p}</li>`).join('')}</ul>
                    </div>

                    <div class="compose-section">
                        <h5>Consejos de melodia</h5>
                        <ul class="compose-list">${guide.melody_tips.map(t => `<li>${t}</li>`).join('')}</ul>
                    </div>

                    <div class="compose-section">
                        <h5>Consejos de ritmo</h5>
                        <ul class="compose-list">${guide.rhythm_tips.map(t => `<li>${t}</li>`).join('')}</ul>
                    </div>

                    <div class="compose-section">
                        <h5>Consejos de voicing</h5>
                        <ul class="compose-list">${guide.voicing_tips.map(t => `<li>${t}</li>`).join('')}</ul>
                    </div>

                    <div class="compose-section">
                        <h5>Estructura / Forma</h5>
                        <ol class="compose-list">${guide.form_structure.map(s => `<li>${s}</li>`).join('')}</ol>
                    </div>

                    <div class="compose-section">
                        <h5>Piezas de referencia</h5>
                        <div class="compose-references-grid">
                            ${guide.reference_pieces.map(p => `
                                <div class="compose-ref-card">
                                    <div class="compose-ref-title">${p.title}</div>
                                    <div class="compose-ref-source">${p.source}</div>
                                    <div class="compose-ref-lesson">${p.lesson}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML = html;
        } catch (e) {
            container.innerHTML = '<p style="color:var(--dominant)">Error al cargar guia de composicion</p>';
        }
    }

    // ─── Helpers ────────────────────────────────

    function highlightChordOnPiano(notes) {
        Piano.highlightChord(notes, false);
    }

    function playChordFromNotes(notes) {
        if (Tone.context.state !== 'running') Tone.start();
        highlightChordOnPiano(notes);
        const noteNames = buildChordNoteNames(notes, 4);
        for (const n of noteNames) {
            Piano.playNote(n, 1.5, null, 0.7);
        }
    }

    function playChopinVoicing(data) {
        if (Tone.context.state !== 'running') Tone.start();
        const now = Tone.now();

        // Highlight bass + chord notes on piano
        const allNotes = [data.bass_note, ...data.chord.notes];
        highlightChordOnPiano(allNotes);

        // Bass note in octave 2
        Piano.playNote(data.bass_note + '2', 2, now, 0.65);

        // Chord notes in octave 4
        setTimeout(() => {
            const chordNotes = buildChordNoteNames(data.chord.notes, 4);
            for (const n of chordNotes) {
                Piano.playNote(n, 1.8, null, 0.6);
            }
        }, 200);
    }

    function buildChordNoteNames(notes, baseOctave) {
        const noteNames = [];
        let octave = baseOctave;
        let prevPC = -1;

        for (const note of notes) {
            const pc = Piano.noteToPC(note);
            if (prevPC >= 0 && pc <= prevPC) octave++;
            noteNames.push(note + octave);
            prevPC = pc;
        }

        return noteNames;
    }

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
            'sus2': 'sus2', 'sus4': 'sus4',
            '7sus4': '7sus4', '7sus2': '7sus2',
            'add9': 'add9', 'add2': 'add2',
            '6': '6', 'm6': 'minor6',
            'maj9': 'major9', 'm9': 'minor9', '9': 'dominant9',
            'maj11': 'major11', '11': 'dominant11',
            'maj13': 'major13', '13': 'dominant13',
        };

        return { root, type: typeMap[rest] || 'major' };
    }

    return {
        init,
        playChordFromNotes,
        playChopinVoicing,
        playMelodyExample,
        playTritoneResolution,
        loadCadences,
        loadCinematic,
        loadImprovisation,
        loadMediants,
        loadComposition,
    };
})();
