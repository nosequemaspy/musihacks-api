/**
 * Circle of Fifths module: interactive SVG visualization
 */

const CircleOfFifths = (() => {
    const COLORS = [
        '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db',
        '#9b59b6', '#e84393', '#fd79a8', '#00cec9', '#6c5ce7', '#fdcb6e'
    ];

    const HIGHLIGHT_COLORS = {
        tonic: '#4CAF50',
        subdominant: '#FF9800',
        dominant: '#f44336',
    };

    // Circle-of-fifths positions relative to tonic for all 7 diatonic degrees
    // Position offset in the circle: I=0, V=+1, ii=+2, vi=-2, iii=+3, IV=-1, vii°=+5
    const DIATONIC_CIRCLE_OFFSETS = [
        { offset: 0,  numeral: 'I',    fn: 'tonic',       opacity: 1.0 },
        { offset: +1, numeral: 'V',    fn: 'dominant',    opacity: 1.0 },
        { offset: -1, numeral: 'IV',   fn: 'subdominant', opacity: 1.0 },
        { offset: +2, numeral: 'ii',   fn: 'subdominant', opacity: 0.85 },
        { offset: -2, numeral: 'vi',   fn: 'tonic',       opacity: 0.85 },
        { offset: +3, numeral: 'iii',  fn: 'tonic',       opacity: 0.7 },
        { offset: +5, numeral: 'vii°', fn: 'dominant',    opacity: 0.7 },
    ];

    let data = null;
    let selectedKey = null;
    let currentMode = 'major';
    let onKeySelect = null;

    async function init() {
        try {
            const resp = await fetch('/api/circle-of-fifths');
            data = await resp.json();
            render();
        } catch (err) {
            console.error('Failed to load circle of fifths:', err);
        }
    }

    function render() {
        if (!data) return;

        const svg = document.getElementById('circle-svg');
        if (!svg) return;
        svg.innerHTML = '';

        const cx = 250, cy = 250;
        const outerR = 200;
        const innerR = 140;
        const minorR = 95;
        const centerR = 55;

        // Background circle
        addCircle(svg, cx, cy, outerR + 15, '#1a1a2e', 'none');

        const entries = data.entries;
        const n = entries.length;
        const angleStep = (2 * Math.PI) / n;

        // Draw outer ring (major keys)
        for (let i = 0; i < n; i++) {
            const entry = entries[i];
            const startAngle = -Math.PI / 2 + i * angleStep - angleStep / 2;
            const endAngle = startAngle + angleStep;

            let color = COLORS[i];
            let opacity = 0.7;

            if (selectedKey) {
                const keyData = getKeyHighlight(entry.major);
                if (keyData) {
                    color = keyData.color;
                    opacity = 1;
                } else {
                    opacity = 0.3;
                }
            }

            const slice = createArcSlice(cx, cy, innerR, outerR, startAngle, endAngle, color, opacity);
            slice.classList.add('circle-slice');
            slice.dataset.key = entry.major;
            slice.addEventListener('click', () => selectKey(entry.major));
            svg.appendChild(slice);

            // Major key label
            const labelAngle = -Math.PI / 2 + i * angleStep;
            const labelR = (innerR + outerR) / 2;
            const lx = cx + labelR * Math.cos(labelAngle);
            const ly = cy + labelR * Math.sin(labelAngle);

            const text = createText(lx, ly, entry.major, 'circle-text', 14);
            svg.appendChild(text);

            // Degree label (numeral + function) when key is selected
            if (selectedKey) {
                const keyData = getKeyHighlight(entry.major);
                if (keyData && keyData.numeral) {
                    const degR = outerR + 22;
                    const dx = cx + degR * Math.cos(labelAngle);
                    const dy = cy + degR * Math.sin(labelAngle);
                    const degText = createText(dx, dy, keyData.numeral, 'circle-degree-label', 10);
                    degText.setAttribute('fill', keyData.color);
                    svg.appendChild(degText);
                }
            }
        }

        // Draw inner ring (minor keys)
        for (let i = 0; i < n; i++) {
            const entry = entries[i];
            const startAngle = -Math.PI / 2 + i * angleStep - angleStep / 2;
            const endAngle = startAngle + angleStep;

            let color = COLORS[i];
            let opacity = 0.4;

            if (selectedKey) {
                const keyData = getKeyHighlight(entry.major);
                if (keyData) {
                    opacity = 0.7;
                } else {
                    opacity = 0.15;
                }
            }

            const slice = createArcSlice(cx, cy, centerR, innerR, startAngle, endAngle, color, opacity);
            slice.classList.add('circle-slice');
            slice.dataset.key = entry.minor;
            slice.addEventListener('click', () => {
                // Select the relative major
                selectKey(entry.major);
            });
            svg.appendChild(slice);

            // Minor key label
            const labelAngle = -Math.PI / 2 + i * angleStep;
            const labelR = (centerR + innerR) / 2;
            const lx = cx + labelR * Math.cos(labelAngle);
            const ly = cy + labelR * Math.sin(labelAngle);

            const text = createText(lx, ly, entry.minor, 'circle-text-minor', 11);
            svg.appendChild(text);
        }

        // Center circle
        addCircle(svg, cx, cy, centerR, '#1a1a2e', '#333', 2);

        // Center text
        if (selectedKey) {
            const text = createText(cx, cy - 14, selectedKey, 'circle-text', 22);
            svg.appendChild(text);

            const modeLabel = currentMode === 'major' ? 'Mayor' : currentMode;
            const subtext = createText(cx, cy + 6, modeLabel, 'circle-text-minor', 11);
            svg.appendChild(subtext);

            // Find relative minor from data
            const entry = data.entries.find(e => e.major === selectedKey);
            if (entry) {
                const relText = createText(cx, cy + 22, `rel: ${entry.minor}`, 'circle-text-minor', 9);
                relText.setAttribute('fill', '#888');
                svg.appendChild(relText);
            }
        } else {
            const text = createText(cx, cy, '5ths', 'circle-text-minor', 14);
            svg.appendChild(text);
        }
    }

    function getKeyHighlight(majorKey) {
        if (!selectedKey) return null;

        const idx = data.major_keys.indexOf(selectedKey);
        if (idx === -1) return null;

        const n = data.major_keys.length;
        const targetIdx = data.major_keys.indexOf(majorKey);
        if (targetIdx === -1) return null;

        for (const deg of DIATONIC_CIRCLE_OFFSETS) {
            const expectedIdx = (idx + deg.offset + n) % n;
            if (targetIdx === expectedIdx) {
                return {
                    color: HIGHLIGHT_COLORS[deg.fn],
                    role: deg.fn,
                    numeral: deg.numeral,
                    opacity: deg.opacity,
                };
            }
        }

        return null;
    }

    function selectKey(key) {
        selectedKey = selectedKey === key ? null : key;
        render();
        updateInfo();
        if (onKeySelect && selectedKey) onKeySelect(selectedKey);
    }

    function setKey(key) {
        selectedKey = key;
        render();
        updateInfo();
    }

    function setMode(mode) {
        currentMode = mode || 'major';
        if (selectedKey) render();
    }

    async function updateInfo() {
        const infoEl = document.getElementById('circle-info');
        const detailEl = infoEl?.querySelector('.circle-detail');
        if (!infoEl || !detailEl) return;

        if (!selectedKey) {
            infoEl.classList.add('hidden');
            return;
        }

        infoEl.classList.remove('hidden');

        try {
            const [circleResp, tonResp] = await Promise.all([
                fetch(`/api/circle-of-fifths/${encodeURIComponent(selectedKey)}`),
                fetch(`/api/tonality/${encodeURIComponent(selectedKey)}`),
            ]);
            const info = await circleResp.json();
            const tonData = await tonResp.json();

            const sig = info.key_signature;
            const sigText = sig.count === 0
                ? 'Sin alteraciones'
                : `${sig.count} ${sig.accidental_type === 'sharps' ? 'sostenidos' : 'bemoles'}: ${sig.accidentals.join(', ')}`;

            // Build diatonic chords display
            let chordsHtml = '';
            if (tonData.diatonic_triads) {
                chordsHtml = '<div class="circle-chords-row">';
                for (const c of tonData.diatonic_triads) {
                    const func = c.function || '';
                    let fnColor = '#888';
                    if (func.includes('Tonic')) fnColor = HIGHLIGHT_COLORS.tonic;
                    else if (func.includes('Subdominant')) fnColor = HIGHLIGHT_COLORS.subdominant;
                    else if (func.includes('Dominant')) fnColor = HIGHLIGHT_COLORS.dominant;
                    chordsHtml += `<span class="circle-chord-chip" style="border-color:${fnColor}"><strong>${c.symbol}</strong><br><span style="font-size:0.7rem;color:${fnColor}">${c.numeral}</span></span>`;
                }
                chordsHtml += '</div>';
            }

            detailEl.innerHTML = `
                <strong>${selectedKey} Mayor</strong> / ${info.relative_minor}m &mdash; ${sigText}
                ${chordsHtml}
            `;
        } catch (err) {
            detailEl.innerHTML = `<strong>${selectedKey}</strong>`;
        }
    }

    // SVG helpers

    function createArcSlice(cx, cy, r1, r2, startAngle, endAngle, fill, opacity) {
        const x1Inner = cx + r1 * Math.cos(startAngle);
        const y1Inner = cy + r1 * Math.sin(startAngle);
        const x2Inner = cx + r1 * Math.cos(endAngle);
        const y2Inner = cy + r1 * Math.sin(endAngle);
        const x1Outer = cx + r2 * Math.cos(startAngle);
        const y1Outer = cy + r2 * Math.sin(startAngle);
        const x2Outer = cx + r2 * Math.cos(endAngle);
        const y2Outer = cy + r2 * Math.sin(endAngle);

        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

        const d = [
            `M ${x1Inner} ${y1Inner}`,
            `A ${r1} ${r1} 0 ${largeArc} 1 ${x2Inner} ${y2Inner}`,
            `L ${x2Outer} ${y2Outer}`,
            `A ${r2} ${r2} 0 ${largeArc} 0 ${x1Outer} ${y1Outer}`,
            'Z'
        ].join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', fill);
        path.setAttribute('opacity', opacity);
        path.setAttribute('stroke', '#1a1a2e');
        path.setAttribute('stroke-width', '2');
        return path;
    }

    function addCircle(svg, cx, cy, r, fill, stroke, strokeWidth = 0) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', fill);
        if (stroke && stroke !== 'none') {
            circle.setAttribute('stroke', stroke);
            circle.setAttribute('stroke-width', strokeWidth);
        }
        svg.appendChild(circle);
    }

    function createText(x, y, content, className, size) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('class', className);
        text.setAttribute('font-size', size);
        text.textContent = content;
        return text;
    }

    return {
        init,
        selectKey,
        setKey,
        setMode,
        set onKeySelect(fn) { onKeySelect = fn; },
        get selectedKey() { return selectedKey; },
    };
})();
