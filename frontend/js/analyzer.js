/**
 * Analyzer module: sends recorded data to API and displays analysis results
 */

const Analyzer = (() => {

    async function analyzeRecording() {
        const midiNotes = Recorder.getMidiNumbers();
        if (midiNotes.length < 2) {
            showError('Necesitas al menos 2 notas diferentes para analizar. Graba algo primero.');
            return null;
        }

        const section = document.getElementById('analysis-section');
        if (section) section.classList.remove('hidden');

        try {
            // Detect key
            const keyResult = await apiPost('/api/tonality/detect', { notes: midiNotes });
            displayKey(keyResult);

            // Detect chords from groups
            const chordGroups = Recorder.detectChordGroups();
            const detectedChords = [];

            for (const group of chordGroups) {
                if (group.midiNotes.length >= 2) {
                    const result = await apiPost('/api/chords/detect', { notes: group.midiNotes });
                    if (result.detected) {
                        detectedChords.push({
                            ...result.best,
                            time: group.start,
                        });
                    }
                }
            }

            displayChords(detectedChords);

            const bestKey = keyResult.results[0]?.key || 'C';
            displayFunctions(detectedChords, bestKey);

            return { key: bestKey, chords: detectedChords };
        } catch (err) {
            showError('Error en el análisis: ' + err.message);
            return null;
        }
    }

    function displayKey(data) {
        const el = document.querySelector('#detected-key .result');
        if (!el) return;

        if (!data.results || data.results.length === 0) {
            el.innerHTML = '<em>No se pudo detectar la tonalidad</em>';
            return;
        }

        const best = data.results[0];
        let html = `<strong style="font-size:1.3em">${best.key} Mayor</strong>`;
        if (best.relative_minor) {
            html += ` <span style="color:var(--text-muted)">/ ${best.relative_minor} menor</span>`;
        }
        html += `<br><span style="color:var(--text-muted)">Confianza: ${best.confidence}%</span>`;

        if (data.results.length > 1) {
            html += '<br><small>Otras posibilidades: ';
            html += data.results.slice(1, 3).map(r => `${r.key} (${r.confidence}%)`).join(', ');
            html += '</small>';
        }

        el.innerHTML = html;

        // Update key selector
        const keySelect = document.getElementById('keySelect');
        if (keySelect) {
            for (const opt of keySelect.options) {
                if (opt.value === best.key) {
                    keySelect.value = best.key;
                    keySelect.dispatchEvent(new Event('change'));
                    break;
                }
            }
        }
    }

    function displayChords(chords) {
        const el = document.querySelector('#detected-chords .result');
        if (!el) return;

        if (chords.length === 0) {
            el.innerHTML = '<em>No se detectaron acordes (intenta tocar notas simultáneamente)</em>';
            return;
        }

        el.innerHTML = chords.map(c => {
            return `<span class="chord-tag" style="background:var(--bg-card)">${c.symbol}</span>`;
        }).join(' ');
    }

    function displayFunctions(chords, key) {
        const el = document.querySelector('#harmonic-functions .result');
        if (!el) return;

        if (chords.length === 0) {
            el.innerHTML = `<em>Tonalidad: ${key} Mayor</em>`;
            return;
        }

        fetch(`/api/tonality/${encodeURIComponent(key)}`)
            .then(r => r.json())
            .then(data => {
                const diatonic = data.diatonic_triads || [];
                let html = '';

                for (const chord of chords) {
                    const match = diatonic.find(d =>
                        d.root === chord.root ||
                        d.symbol === chord.symbol
                    );

                    let functionClass = '';
                    if (match) {
                        const fn = match.function;
                        if (fn.includes('Tonic')) functionClass = 'tonic';
                        else if (fn.includes('Subdominant')) functionClass = 'subdominant';
                        else if (fn.includes('Dominant')) functionClass = 'dominant';
                    }

                    html += `<span class="chord-tag ${functionClass}">${chord.symbol}`;
                    if (match) html += ` <small>(${match.numeral})</small>`;
                    html += `</span> `;
                }

                el.innerHTML = html || '<em>No se detectaron funciones armónicas</em>';
            })
            .catch(() => {
                el.innerHTML = '<em>No se pudieron analizar las funciones</em>';
            });
    }

    function showError(msg) {
        const section = document.getElementById('analysis-section');
        if (section) section.classList.remove('hidden');
        const el = document.querySelector('#detected-key .result');
        if (el) el.innerHTML = `<em style="color:var(--accent)">${msg}</em>`;
    }

    async function apiPost(url, body) {
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.detail || resp.statusText);
        }
        return resp.json();
    }

    return {
        analyzeRecording,
    };
})();
