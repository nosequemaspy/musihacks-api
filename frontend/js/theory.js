/**
 * Theory module: Interactive music theory lessons with examples and quizzes.
 */

const Theory = (() => {
    const lessons = [
        {
            id: 'notes',
            title: '1. Las notas del piano',
            content: `
                <div class="lesson-section">
                    <h3>Las 7 notas naturales</h3>
                    <div class="edu-img" onclick="openImageModal('/reference/359786ad56a841dbf79cae64686d90e4.jpg')">
                        <img src="/reference/359786ad56a841dbf79cae64686d90e4.jpg" alt="Teclado y notas" loading="lazy">
                        <div class="edu-img-caption">El teclado del piano, las claves y las notas en el pentagrama</div>
                    </div>
                    <p>La música occidental se basa en <strong>7 notas naturales</strong> que se repiten en diferentes octavas:</p>
                    <p><strong>Do - Re - Mi - Fa - Sol - La - Si</strong></p>
                    <p>En el sistema americano/inglés (usado internacionalmente):</p>
                    <p><strong>C - D - E - F - G - A - B</strong></p>
                    <p>Las notas se ordenan de grave (izquierda del piano) a agudo (derecha). Después de Si (B), vuelve a empezar con Do (C) una octava más aguda.</p>
                    <div class="lesson-example">
                        <h4>Escucha las notas naturales (octava 4)</h4>
                        <button class="example-btn" data-play-notes="C4,D4,E4,F4,G4,A4,B4,C5">Tocar escala de Do</button>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Cuál es la nota "G" en el sistema español?',
                options: ['Fa', 'Sol', 'La', 'Si'],
                correct: 1,
            }
        },
        {
            id: 'sharps-flats',
            title: '2. Sostenidos y bemoles',
            content: `
                <div class="lesson-section">
                    <h3>Las teclas negras</h3>
                    <p>Entre la mayoría de las notas naturales hay <strong>teclas negras</strong> que representan notas alteradas:</p>
                    <ul>
                        <li><strong>Sostenido (#)</strong>: sube la nota medio tono. Ej: C# está entre C y D.</li>
                        <li><strong>Bemol (b)</strong>: baja la nota medio tono. Ej: Db está entre C y D.</li>
                    </ul>
                    <p><strong>C# y Db son la misma tecla</strong> (enarmónicos). El nombre depende del contexto armónico.</p>
                    <p>Nota: entre <strong>Mi-Fa</strong> y <strong>Si-Do</strong> NO hay tecla negra (solo hay medio tono natural).</p>
                    <div class="lesson-example">
                        <h4>Escucha la escala cromática (todos los semitonos)</h4>
                        <button class="example-btn" data-play-notes="C4,C#4,D4,D#4,E4,F4,F#4,G4,G#4,A4,A#4,B4,C5">Escala cromática</button>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Entre qué notas NO hay tecla negra (semitono natural)?',
                options: ['Do-Re y Sol-La', 'Mi-Fa y Si-Do', 'Re-Mi y La-Si', 'Fa-Sol y Do-Re'],
                correct: 1,
            }
        },
        {
            id: 'english-notes',
            title: '3. Notas en inglés',
            content: `
                <div class="lesson-section">
                    <h3>Tabla de conversión</h3>
                    <table class="ref-table" style="max-width:400px">
                        <tr><th>Español</th><th>Inglés</th><th>Nota</th></tr>
                        <tr><td>Do</td><td>C</td><td><button class="example-btn" data-play-notes="C4">C</button></td></tr>
                        <tr><td>Re</td><td>D</td><td><button class="example-btn" data-play-notes="D4">D</button></td></tr>
                        <tr><td>Mi</td><td>E</td><td><button class="example-btn" data-play-notes="E4">E</button></td></tr>
                        <tr><td>Fa</td><td>F</td><td><button class="example-btn" data-play-notes="F4">F</button></td></tr>
                        <tr><td>Sol</td><td>G</td><td><button class="example-btn" data-play-notes="G4">G</button></td></tr>
                        <tr><td>La</td><td>A</td><td><button class="example-btn" data-play-notes="A4">A</button></td></tr>
                        <tr><td>Si</td><td>B</td><td><button class="example-btn" data-play-notes="B4">B</button></td></tr>
                    </table>
                    <p style="margin-top:12px">Truco: la serie en inglés empieza en <strong>A (La)</strong> porque la nota de referencia universal es La = 440 Hz.</p>
                </div>
            `,
            quiz: {
                question: '¿Qué nota es "E" en español?',
                options: ['Re', 'Mi', 'Fa', 'La'],
                correct: 1,
            }
        },
        {
            id: 'semitone-tone',
            title: '4. El semitono y el tono',
            content: `
                <div class="lesson-section">
                    <h3>Las distancias mínimas</h3>
                    <p>El <strong>semitono</strong> (ST) es la distancia más pequeña entre dos notas adyacentes en el piano (de una tecla a la siguiente, sin saltar).</p>
                    <p>El <strong>tono</strong> (T) equivale a <strong>2 semitonos</strong>.</p>
                    <ul>
                        <li>De C a C# = 1 semitono</li>
                        <li>De C a D = 1 tono (2 semitonos)</li>
                        <li>De E a F = 1 semitono (no hay tecla negra entre ellos)</li>
                        <li>De B a C = 1 semitono</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>Escucha la diferencia</h4>
                        <button class="example-btn" data-play-notes="C4,C#4">Semitono: C → C#</button>
                        <button class="example-btn" data-play-notes="C4,D4">Tono: C → D</button>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Cuántos semitonos hay en un tono?',
                options: ['1', '2', '3', '4'],
                correct: 1,
            }
        },
        {
            id: 'scales',
            title: '5. Escalas',
            content: `
                <div class="lesson-section">
                    <h3>La escala mayor</h3>
                    <div class="edu-img-row">
                        <div class="edu-img" onclick="openImageModal('/reference/escalas-mayores.png')">
                            <img src="/reference/escalas-mayores.png" alt="Escalas mayores" loading="lazy">
                            <div class="edu-img-caption">Todas las escalas mayores en el teclado</div>
                        </div>
                        <div class="edu-img" onclick="openImageModal('/reference/escalas-menores.png')">
                            <img src="/reference/escalas-menores.png" alt="Escalas menores" loading="lazy">
                            <div class="edu-img-caption">Todas las escalas menores en el teclado</div>
                        </div>
                    </div>
                    <p>Una escala es una serie de notas ordenadas por altura. La <strong>escala mayor</strong> sigue el patrón:</p>
                    <p><strong>T - T - ST - T - T - T - ST</strong></p>
                    <p>(Tono - Tono - Semitono - Tono - Tono - Tono - Semitono)</p>
                    <p>Ejemplo en Do mayor: C D E F G A B C</p>
                    <h3 style="margin-top:16px">La escala menor natural</h3>
                    <p>Patrón: <strong>T - ST - T - T - ST - T - T</strong></p>
                    <p>Ejemplo en La menor: A B C D E F G A</p>
                    <div class="lesson-example">
                        <h4>Compara mayor vs menor</h4>
                        <button class="example-btn" data-play-scale="C,major">Do Mayor</button>
                        <button class="example-btn" data-play-scale="A,natural_minor">La menor</button>
                        <button class="example-btn" data-play-scale="C,pentatonic_major">Pentatónica mayor</button>
                        <button class="example-btn" data-play-scale="A,pentatonic_minor">Pentatónica menor</button>
                        <button class="example-btn" data-play-scale="C,blues">Blues</button>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Cuál es el patrón de la escala mayor?',
                options: ['T-ST-T-T-ST-T-T', 'T-T-ST-T-T-T-ST', 'T-T-T-ST-T-T-ST', 'ST-T-T-T-ST-T-T'],
                correct: 1,
            }
        },
        {
            id: 'triads',
            title: '6. Acordes de 3 notas',
            content: `
                <div class="lesson-section">
                    <h3>Las tríadas</h3>
                    <p>Un acorde de 3 notas (tríada) se forma apilando <strong>terceras</strong>:</p>
                    <ul>
                        <li><strong>Mayor</strong>: 4 + 3 semitonos → Ej: C E G (suena alegre)</li>
                        <li><strong>Menor</strong>: 3 + 4 semitonos → Ej: C Eb G (suena triste)</li>
                        <li><strong>Aumentado</strong>: 4 + 4 semitonos → Ej: C E G# (suena misterioso)</li>
                        <li><strong>Disminuido</strong>: 3 + 3 semitonos → Ej: C Eb Gb (suena tenso)</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>Escucha cada tipo</h4>
                        <button class="example-btn" data-play-chord="C,major">C Mayor</button>
                        <button class="example-btn" data-play-chord="C,minor">C menor</button>
                        <button class="example-btn" data-play-chord="C,augmented">C aumentado</button>
                        <button class="example-btn" data-play-chord="C,diminished">C disminuido</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>En canciones reales</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Let It Be" - Beatles</div>
                            <div class="song-example-artist">Progresión: C - G - Am - F (I-V-vi-IV)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C3,E4,G4|G3,B3,D4|A3,C4,E4|F3,A3,C4">Escuchar progresión</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Clocks" - Coldplay</div>
                            <div class="song-example-artist">Arpegio: Eb - Bbm - Fm (I-v-ii en Eb)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="Eb4,G4,Bb4|Bb3,Db4,F4|F3,Ab3,C4">Escuchar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Cuál es la fórmula del acorde menor en semitonos?',
                options: ['4 + 3', '3 + 4', '4 + 4', '3 + 3'],
                correct: 1,
            }
        },
        {
            id: 'inversions',
            title: '7. Inversiones',
            content: `
                <div class="lesson-section">
                    <h3>¿Qué es una inversión?</h3>
                    <p>Una inversión cambia qué nota está en el bajo (la más grave):</p>
                    <ul>
                        <li><strong>Estado fundamental</strong>: la raíz está en el bajo → C E G</li>
                        <li><strong>1a inversión</strong>: la 3era está en el bajo → E G C</li>
                        <li><strong>2a inversión</strong>: la 5ta está en el bajo → G C E</li>
                    </ul>
                    <p>El acorde sigue siendo "Do mayor" en cualquier inversión, pero el <strong>color sonoro cambia</strong>.</p>
                    <div class="lesson-example">
                        <h4>Compara las inversiones de C mayor</h4>
                        <button class="example-btn" data-play-chord="C,major,0">Fundamental</button>
                        <button class="example-btn" data-play-chord="C,major,1">1a inversión</button>
                        <button class="example-btn" data-play-chord="C,major,2">2a inversión</button>
                    </div>
                </div>
            `,
            quiz: {
                question: 'En la 1a inversión de un acorde, ¿qué nota está en el bajo?',
                options: ['La raíz', 'La 3era', 'La 5ta', 'La 7ma'],
                correct: 1,
            }
        },
        {
            id: 'slash-chords',
            title: '8. Slash chords',
            content: `
                <div class="lesson-section">
                    <h3>Acordes con bajo específico</h3>
                    <p>Un <strong>slash chord</strong> indica un acorde con una nota específica en el bajo, separada por "/":</p>
                    <ul>
                        <li><strong>C/E</strong> = Do mayor con Mi en el bajo (= 1a inversión)</li>
                        <li><strong>C/G</strong> = Do mayor con Sol en el bajo (= 2a inversión)</li>
                        <li><strong>C/Bb</strong> = Do mayor con Sib en el bajo (NO es inversión, es un bajo diferente)</li>
                    </ul>
                    <p>Los slash chords son muy útiles para crear <strong>líneas de bajo melódicas</strong>.</p>
                    <div class="lesson-example">
                        <h4>Línea de bajo descendente: C → C/B → C/Bb → C/A</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|B2,E4,G4|Bb2,E4,G4|A2,E4,G4">Tocar ejemplo</button>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Qué significa C/G?',
                options: ['Do mayor o Sol mayor', 'Do mayor con Sol en el bajo', 'Sol mayor con Do en el bajo', 'Do sostenido mayor'],
                correct: 1,
            }
        },
        {
            id: 'seventh-chords',
            title: '9. Acordes de 7ma',
            content: `
                <div class="lesson-section">
                    <h3>Agregando la séptima</h3>
                    <p>Los acordes de séptima agregan una <strong>4ta nota</strong> a la tríada:</p>
                    <ul>
                        <li><strong>maj7</strong> (Mayor con 7ma mayor): 4+3+4 → Cmaj7 = C E G B (suena sofisticado)</li>
                        <li><strong>7</strong> (Dominante): 4+3+3 → C7 = C E G Bb (suena con tensión, quiere resolver)</li>
                        <li><strong>m7</strong> (Menor con 7ma): 3+4+3 → Cm7 = C Eb G Bb (suena jazzy)</li>
                        <li><strong>m7b5</strong> (Semidisminuido): 3+3+4 → Cm7b5 = C Eb Gb Bb</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>Escucha la diferencia</h4>
                        <button class="example-btn" data-play-chord="C,major7">Cmaj7</button>
                        <button class="example-btn" data-play-chord="C,dominant7">C7</button>
                        <button class="example-btn" data-play-chord="C,minor7">Cm7</button>
                        <button class="example-btn" data-play-chord="C,half_diminished7">Cm7b5</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>En canciones reales</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Isn't She Lovely" - Stevie Wonder</div>
                            <div class="song-example-artist">Usa dom7 y m7 constantemente. Intro en E:</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C#3,E3,G#3,B3|F#3,A3,C#4,E4|B3,D4,F#4,A4|E3,G#3,B3,D4">C#m7 - F#m7 - B7 - E (estilo Stevie)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Gymnopédie No.1" - Satie</div>
                            <div class="song-example-artist">Alterna Gmaj7 y Dmaj7 suavemente:</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="G3,B3,D4,F#4|D3,F#3,A3,C#4|G3,B3,D4,F#4|D3,F#3,A3,C#4">Gmaj7 - Dmaj7 (estilo Satie)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Don't Know Why" - Norah Jones</div>
                            <div class="song-example-artist">Bb: Bbmaj7 - Bb7 - Ebmaj7 - D7</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="Bb3,D4,F4,A4|Bb3,D4,F4,Ab4|Eb3,G3,Bb3,D4|D3,F#3,A3,C4">Escuchar progresión</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Cuál es la fórmula del acorde dominante 7?',
                options: ['4+3+4', '3+4+3', '4+3+3', '3+3+4'],
                correct: 2,
            }
        },
        {
            id: 'tonality',
            title: '10. Tonalidad y funciones',
            content: `
                <div class="lesson-section">
                    <h3>Los 7 grados de la tonalidad</h3>
                    <div class="edu-img" onclick="openImageModal('/reference/acordes-diatonicos-funciones.png')">
                        <img src="/reference/acordes-diatonicos-funciones.png" alt="Acordes diatónicos y funciones" loading="lazy">
                        <div class="edu-img-caption">Acordes diatónicos: cada grado de la escala genera un acorde con función T, SD o D</div>
                    </div>
                    <p>En cada tonalidad, cada nota de la escala genera un acorde con una <strong>función armónica</strong>:</p>
                    <table class="ref-table" style="max-width:500px">
                        <tr><th>Grado</th><th>Numeral</th><th>Tipo</th><th>Función</th></tr>
                        <tr><td>1</td><td>I</td><td>Mayor</td><td class="fn-tonic">Tónica (reposo)</td></tr>
                        <tr><td>2</td><td>ii</td><td>menor</td><td class="fn-subdominant">Subdominante (movimiento)</td></tr>
                        <tr><td>3</td><td>iii</td><td>menor</td><td class="fn-tonic">Tónica (mediante)</td></tr>
                        <tr><td>4</td><td>IV</td><td>Mayor</td><td class="fn-subdominant">Subdominante (preparación)</td></tr>
                        <tr><td>5</td><td>V</td><td>Mayor</td><td class="fn-dominant">Dominante (tensión)</td></tr>
                        <tr><td>6</td><td>vi</td><td>menor</td><td class="fn-tonic">Tónica (relativo menor)</td></tr>
                        <tr><td>7</td><td>vii°</td><td>dim</td><td class="fn-dominant">Dominante (tensión)</td></tr>
                    </table>
                    <p style="margin-top:12px">El flujo básico: <span class="fn-tonic">T</span> → <span class="fn-subdominant">SD</span> → <span class="fn-dominant">D</span> → <span class="fn-tonic">T</span></p>
                    <div class="lesson-example">
                        <h4>Acordes diatónicos de Do mayor</h4>
                        <button class="example-btn" data-play-chord="C,major">I: C</button>
                        <button class="example-btn" data-play-chord="D,minor">ii: Dm</button>
                        <button class="example-btn" data-play-chord="E,minor">iii: Em</button>
                        <button class="example-btn" data-play-chord="F,major">IV: F</button>
                        <button class="example-btn" data-play-chord="G,major">V: G</button>
                        <button class="example-btn" data-play-chord="A,minor">vi: Am</button>
                        <button class="example-btn" data-play-chord="B,diminished">vii°: Bdim</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Escúchalo en canciones</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Someone Like You" - Adele</div>
                            <div class="song-example-artist">A mayor: I-V-vi-IV (A-E-F#m-D)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="A3,C#4,E4|E3,G#3,B3|F#3,A3,C#4|D3,F#3,A3">Escuchar progresión</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"No Woman No Cry" - Bob Marley</div>
                            <div class="song-example-artist">C mayor: I-V-vi-IV (C-G-Am-F)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C3,E4,G4|G3,B3,D4|A3,C4,E4|F3,A3,C4">Escuchar progresión</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Stand By Me" - Ben E. King</div>
                            <div class="song-example-artist">C mayor: I-vi-IV-V (C-Am-F-G)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C3,E4,G4|A3,C4,E4|F3,A3,C4|G3,B3,D4">Escuchar progresión</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Cuál es la función del grado V?',
                options: ['Tónica', 'Subdominante', 'Dominante', 'Mediante'],
                correct: 2,
            }
        },
        {
            id: 'secondary-dominants',
            title: '11. Dominantes secundarios',
            content: `
                <div class="lesson-section">
                    <h3>V de cada grado</h3>
                    <div class="edu-img-row">
                        <div class="edu-img" onclick="openImageModal('/reference/481794025_921968040128563_3765322021253533212_n.jpg')">
                            <img src="/reference/481794025_921968040128563_3765322021253533212_n.jpg" alt="Dominantes secundarios" loading="lazy">
                            <div class="edu-img-caption">Diagrama de dominantes secundarios y sus resoluciones</div>
                        </div>
                        <div class="edu-img" onclick="openImageModal('/reference/dominantes-tabla-1.jpg')">
                            <img src="/reference/dominantes-tabla-1.jpg" alt="Tabla de dominantes" loading="lazy">
                            <div class="edu-img-caption">Tabla completa de dominantes por tonalidad</div>
                        </div>
                    </div>
                    <p>Un <strong>dominante secundario</strong> es un acorde que actúa como V7 de cualquier grado diatónico (excepto el vii°).</p>
                    <p>Se escriben como <strong>V/X</strong> donde X es el grado al que resuelven:</p>
                    <ul>
                        <li><strong>V/ii</strong> = A7 (resuelve a Dm en Do mayor)</li>
                        <li><strong>V/iii</strong> = B7 (resuelve a Em)</li>
                        <li><strong>V/IV</strong> = C7 (resuelve a F)</li>
                        <li><strong>V/V</strong> = D7 (resuelve a G) — el más común</li>
                        <li><strong>V/vi</strong> = E7 (resuelve a Am)</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>Escucha la resolución V/V → V → I en Do</h4>
                        <button class="example-btn" data-play-notes="D4,F#4,A4,C5|G3,B3,D4,F4|C3,E4,G4,C5">D7 → G → C</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Escúchalo en canciones</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Sweet Child O'Mine" - Guns N' Roses</div>
                            <div class="song-example-artist">D mayor: V/V = E7 → A → D</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="E3,G#3,B3,D4|A3,C#4,E4|D3,F#3,A3">E7 → A → D (V/V → V → I)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Yesterday" - Beatles</div>
                            <div class="song-example-artist">F mayor: usa V/ii (A7→Dm) y V/V (C7→Bb→F)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="F3,A3,C4|E3,G#3,B3,D4|D3,F3,A3|Bb3,D4,F4|C3,E3,G3,Bb3|F3,A3,C4">F-E7-Dm-Bb-C7-F</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"I Will Survive" - Gloria Gaynor</div>
                            <div class="song-example-artist">Am: V/iv (E7→Am), V/III (D7→G)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="A3,C4,E4|D3,F#3,A3,C4|G3,B3,D4|C3,E3,G3|F3,A3,C4|B3,D4,F4|E3,G#3,B3|A3,C4,E4">Am-D7-G-C-F-Bdim-E7-Am</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quiz: {
                question: 'En Do mayor, ¿cuál es el V/V (dominante del dominante)?',
                options: ['C7', 'A7', 'D7', 'E7'],
                correct: 2,
            }
        },
        {
            id: 'cadences',
            title: '12. Cadencias',
            content: `
                <div class="lesson-section">
                    <h3>Las cadencias principales</h3>
                    <p>Una cadencia es una <strong>fórmula de cierre</strong> o <strong>puntuación musical</strong>:</p>
                    <ul>
                        <li><strong>Auténtica</strong> (V → I): La resolución más fuerte. "Punto final".</li>
                        <li><strong>Plagal</strong> (IV → I): Resolución suave. "Amén".</li>
                        <li><strong>Rota/Deceptiva</strong> (V → vi): Engaño. El V no va al I sino al vi.</li>
                        <li><strong>Media</strong> (X → V): Termina en el V. "Coma" o "punto y seguido".</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>Escucha cada cadencia en Do mayor</h4>
                        <button class="example-btn" data-play-notes="G3,B3,D4,F4|C3,E4,G4,C5">Auténtica: G7 → C</button>
                        <button class="example-btn" data-play-notes="F3,A3,C4|C3,E4,G4">Plagal: F → C</button>
                        <button class="example-btn" data-play-notes="G3,B3,D4,F4|A3,C4,E4">Rota: G7 → Am</button>
                        <button class="example-btn" data-play-notes="C3,E4,G4|G3,B3,D4">Media: C → G</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Escúchalo en canciones</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Happy Birthday"</div>
                            <div class="song-example-artist">Auténtica V→I al final: G7 → C</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C3,E4,G4|G3,B3,D4,F4|C3,E4,G4|F3,A3,C4|C3,E4,G4|G3,B3,D4,F4|C3,E4,G4">Happy Birthday (C-G7-C-F-C-G7-C)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Let It Be" - Beatles</div>
                            <div class="song-example-artist">Plagal IV→I: F → C ("Amén")</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C3,E4,G4|G3,B3,D4|A3,C4,E4|F3,A3,C4|C3,E4,G4">C-G-Am-F-C (plagal al final)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Despacito" - Luis Fonsi</div>
                            <div class="song-example-artist">Rota V→vi: mantiene el loop girando</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="B3,D#4,F#4|E3,G#3,B3|C#3,E3,G#3|A3,C#4,E4|B3,D#4,F#4|E3,G#3,B3">B-E-C#m-A (en E mayor)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Fly Me to the Moon"</div>
                            <div class="song-example-artist">Jazz: ii-V-I clásico: Am7-Dm7-G7-Cmaj7</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="A3,C4,E4,G4|D3,F3,A3,C4|G3,B3,D4,F4|C3,E3,G3,B3">Am7-Dm7-G7-Cmaj7</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Qué cadencia usa V → vi (engaño)?',
                options: ['Auténtica', 'Plagal', 'Rota/Deceptiva', 'Media'],
                correct: 2,
            }
        },
        {
            id: 'reading',
            title: '13. Lectura musical',
            content: `
                <div class="lesson-section">
                    <h3>Clave de Sol y Clave de Fa</h3>
                    <div class="edu-img" onclick="openImageModal('/reference/1.webp')">
                        <img src="/reference/1.webp" alt="Armaduras musicales" loading="lazy">
                        <div class="edu-img-caption">Tabla de armaduras: sostenidos y bemoles para cada tonalidad</div>
                    </div>
                    <p><strong>Clave de Sol</strong> (mano derecha):</p>
                    <ul>
                        <li>Las líneas del pentagrama (de abajo a arriba): <strong>Mi - Sol - Si - Re - Fa</strong></li>
                        <li>Truco: <strong>"Mi Sol Si Refa"</strong></li>
                        <li>Los espacios: <strong>Fa - La - Do - Mi</strong></li>
                    </ul>
                    <p><strong>Clave de Fa</strong> (mano izquierda):</p>
                    <ul>
                        <li>Las líneas: <strong>Sol - Si - Re - Fa - La</strong></li>
                        <li>Los espacios: <strong>La - Do - Mi - Sol</strong></li>
                    </ul>
                    <p><strong>Do central (C4)</strong> = la línea adicional entre ambas claves.</p>
                </div>
            `,
            quiz: {
                question: '¿Cuáles son las notas en las LÍNEAS de clave de Sol?',
                options: ['Fa-La-Do-Mi', 'Mi-Sol-Si-Re-Fa', 'Do-Mi-Sol-Si', 'Sol-Si-Re-Fa-La'],
                correct: 1,
            }
        },
        // ============ LECCIONES 14-22: Ruta avanzada ============
        {
            id: 'extended-chords',
            title: '14. Acordes extendidos',
            content: `
                <div class="lesson-section">
                    <h3>Más allá de la 7ma: 9as, 11as y 13as</h3>
                    <p>Los acordes extendidos se construyen <strong>apilando terceras</strong> más allá de la séptima. Agregan color y sofisticación.</p>
                    <ul>
                        <li><strong>add9</strong>: Tríada + 9na (sin 7ma). Sonido abierto y moderno. Ej: Cadd9 = C E G D</li>
                        <li><strong>maj9</strong>: maj7 + 9na. Sonido sofisticado. Ej: Cmaj9 = C E G B D</li>
                        <li><strong>9</strong> (dom9): dom7 + 9na. Sonido funky/bluesy. Ej: C9 = C E G Bb D</li>
                        <li><strong>m9</strong>: m7 + 9na. Sonido jazzy y cálido. Ej: Cm9 = C Eb G Bb D</li>
                        <li><strong>11</strong>: dom7 + 9na + 11na. Sonido abierto. Ej: C11 = C E G Bb D F</li>
                        <li><strong>13</strong>: dom7 + 13na. Sonido rico y complejo. Ej: C13 = C E G Bb D A</li>
                    </ul>
                    <p>En la práctica, no siempre se tocan todas las notas. Se omiten la 5ta y a veces la raíz (el bajista la cubre).</p>
                    <div class="lesson-example">
                        <h4>Escucha los colores extendidos</h4>
                        <button class="example-btn" data-play-notes="C4,E4,G4,D5">Cadd9</button>
                        <button class="example-btn" data-play-notes="C4,E4,G4,B4,D5">Cmaj9</button>
                        <button class="example-btn" data-play-notes="C4,E4,G4,Bb4,D5">C9</button>
                        <button class="example-btn" data-play-notes="C4,Eb4,G4,Bb4,D5">Cm9</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>¿Dónde se usan?</h3>
                    <ul>
                        <li><strong>Neo-soul / R&B</strong>: maj9, m9, add9 son el pan de cada día (D'Angelo, Erykah Badu)</li>
                        <li><strong>Jazz</strong>: 9as, 11as y 13as en todos los acordes</li>
                        <li><strong>Pop moderno</strong>: add9 y maj7 para sofisticar progresiones simples (Tom Misch, Mac DeMarco)</li>
                        <li><strong>Funk</strong>: dom9 y dom13 dan el groove (Stevie Wonder "Isn't She Lovely")</li>
                    </ul>
                </div>
            `,
            quiz: {
                question: '¿Cuál es la diferencia entre Cadd9 y Cmaj9?',
                options: ['Son lo mismo', 'Cadd9 no tiene 7ma, Cmaj9 sí', 'Cmaj9 no tiene 5ta', 'Cadd9 tiene 7ma menor'],
                correct: 1,
            }
        },
        {
            id: 'reharmonization',
            title: '15. Reharmonización básica',
            content: `
                <div class="lesson-section">
                    <h3>Enriqueciendo una progresión paso a paso</h3>
                    <p>La reharmonización es el arte de <strong>cambiar los acordes</strong> bajo una melodía manteniendo su esencia pero agregando sofisticación.</p>
                    <h3 style="margin-top:16px">Los 4 pasos de la reharmonización</h3>
                    <div class="lesson-example">
                        <h4>Paso 1: Tríadas simples</h4>
                        <p>Empezamos con I - V - vi - IV (la progresión pop):</p>
                        <button class="example-btn" data-play-notes="C3,E4,G4|G3,B3,D4|A3,C4,E4|F3,A3,C4">C - G - Am - F</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Paso 2: Agregar séptimas</h4>
                        <p>Imaj7 - V7 - vi7 - IVmaj7:</p>
                        <button class="example-btn" data-play-notes="C3,E4,G4,B4|G3,B3,D4,F4|A3,C4,E4,G4|F3,A3,C4,E4">Cmaj7 - G7 - Am7 - Fmaj7</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Paso 3: Agregar extensiones</h4>
                        <p>Imaj9 - V9 - vi m9 - IVmaj9:</p>
                        <button class="example-btn" data-play-notes="C3,E4,G4,B4,D5|G3,B3,D4,F4,A4|A3,C4,E4,G4,B4|F3,A3,C4,E4,G4">Cmaj9 - G9 - Am9 - Fmaj9</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Paso 4: Sustituciones</h4>
                        <p>Tritono sub del V + intercambio modal:</p>
                        <button class="example-btn" data-play-notes="C3,E4,G4,B4,D5|Db3,F3,Ab3,B3|A3,C4,E4,G4,B4|Bb3,D4,F4,Ab4">Cmaj9 - Db7 - Am9 - Bbmaj7</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Principio clave</h3>
                    <p>La melodía es la guía. Mientras la nota de la melodía sea una <strong>nota del acorde o una tensión disponible</strong>, la reharmonización funcionará.</p>
                </div>
            `,
            quiz: {
                question: '¿Cuál es el primer paso de la reharmonización?',
                options: ['Agregar sustituciones tritonales', 'Empezar con tríadas simples', 'Usar solo acordes extendidos', 'Cambiar la melodía'],
                correct: 1,
            }
        },
        {
            id: 'jazz-fundamentals',
            title: '16. Fundamentos de jazz',
            content: `
                <div class="lesson-section">
                    <h3>La cadencia ii-V-I</h3>
                    <p>El <strong>ii-V-I</strong> es el ADN del jazz. Aparece en prácticamente todos los standards:</p>
                    <ul>
                        <li><strong>Mayor</strong>: iim7 → V7 → Imaj7 (Dm7 → G7 → Cmaj7)</li>
                        <li><strong>Menor</strong>: iim7b5 → V7b9 → im (Dm7b5 → G7 → Cm)</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>ii-V-I en C mayor</h4>
                        <button class="example-btn" data-play-notes="D3,F3,A3,C4|G3,B3,D4,F4|C3,E3,G3,B3">Dm7 → G7 → Cmaj7</button>
                    </div>
                    <div class="lesson-example">
                        <h4>ii-V-I en otras tonalidades</h4>
                        <button class="example-btn" data-play-notes="E3,G3,B3,D4|A3,C#4,E4,G4|D3,F#3,A3,C#4">Em7 → A7 → Dmaj7</button>
                        <button class="example-btn" data-play-notes="A3,C4,E4,G4|D3,F#3,A3,C4|G3,B3,D4,F#4">Am7 → D7 → Gmaj7</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Guide tones: el secreto del voice leading</h3>
                    <p>Las <strong>guide tones</strong> son la 3era y la 7ma de cada acorde. Son las notas que definen la calidad del acorde y se mueven por semitono entre acordes:</p>
                    <ul>
                        <li>Dm7: <strong>F</strong> (3era) y <strong>C</strong> (7ma)</li>
                        <li>G7: <strong>B</strong> (3era) y <strong>F</strong> (7ma) — la C bajó a B, la F se mantuvo</li>
                        <li>Cmaj7: <strong>E</strong> (3era) y <strong>B</strong> (7ma) — la B se mantuvo, la F bajó a E</li>
                    </ul>
                    <p>¡El movimiento es mínimo! Esto es <strong>voice leading eficiente</strong>.</p>
                    <div class="lesson-example">
                        <h4>Standards clásicos con ii-V-I</h4>
                        <p>"Autumn Leaves" (Gm): Cm7→F7→Bbmaj7→Ebmaj7→Am7b5→D7→Gm</p>
                        <button class="example-btn" data-play-notes="C3,Eb3,G3,Bb3|F3,A3,C4,Eb4|Bb2,D3,F3,A3|Eb3,G3,Bb3,D4|A3,C4,Eb4,G4|D3,F#3,A3,C4|G3,Bb3,D4">Autumn Leaves (simplificado)</button>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Cuáles son los "guide tones" de un acorde?',
                options: ['Raíz y 5ta', '3era y 7ma', '5ta y 9na', 'Raíz y 3era'],
                correct: 1,
            }
        },
        {
            id: 'voicing',
            title: '17. Voicing y distribución de voces',
            content: `
                <div class="lesson-section">
                    <h3>¿Qué es el voicing?</h3>
                    <p>El <strong>voicing</strong> es <em>cómo distribuyes las notas</em> de un acorde entre tus manos. Un mismo acorde puede sonar completamente distinto según el voicing que elijas. Es la diferencia entre sonar "de libro" y sonar como un profesional.</p>
                    <p>No se trata de QUÉ acorde tocas, sino de CÓMO lo tocas.</p>
                </div>

                <div class="lesson-section">
                    <h3>Voicing cerrado vs abierto</h3>
                    <p><strong>Cerrado (close voicing)</strong>: todas las notas dentro de una octava. Sonido compacto.</p>
                    <p><strong>Abierto (open voicing)</strong>: notas repartidas en más de una octava. Sonido amplio y profesional.</p>
                    <div class="lesson-example">
                        <h4>Cmaj7 cerrado vs abierto</h4>
                        <button class="example-btn" data-play-notes="C4,E4,G4,B4">Cerrado: C E G B (todo en oct.4)</button>
                        <button class="example-btn" data-play-notes="C3,G3,B3,E4">Abierto: C G B E (repartido)</button>
                        <button class="example-btn" data-play-notes="C3,B3,E4,G4">Abierto 2: C B E G</button>
                    </div>
                    <p>Consejo: en el piano, la mano izquierda toca las notas graves (raíz, 7ma) y la derecha las agudas (3era, 5ta, extensiones).</p>
                </div>

                <div class="lesson-section">
                    <h3>Drop 2 voicing</h3>
                    <p>Toma un voicing cerrado y <strong>baja la 2da nota más aguda una octava</strong>. Es el voicing más usado en jazz y neo-soul.</p>
                    <ul>
                        <li>Cmaj7 cerrado: C E G B</li>
                        <li>La 2da más aguda es G → baja una octava</li>
                        <li><strong>Drop 2: G2 - C3 - E3 - B3</strong></li>
                    </ul>
                    <div class="lesson-example">
                        <h4>Drop 2 en ii-V-I de C</h4>
                        <button class="example-btn" data-play-notes="A2,D3,F3,C4">Dm7 drop 2</button>
                        <button class="example-btn" data-play-notes="B2,F3,G3,D4">G7 drop 2 (sin raíz)</button>
                        <button class="example-btn" data-play-notes="G2,C3,E3,B3">Cmaj7 drop 2</button>
                        <button class="example-btn" data-play-notes="A2,D3,F3,C4|B2,F3,G3,D4|G2,C3,E3,B3">ii-V-I drop 2 completo</button>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Shell voicing (voicing mínimo)</h3>
                    <p>Solo tocas <strong>raíz + 3era + 7ma</strong> (o raíz + 7ma + 3era). Es el voicing mínimo que define el acorde. Ideal para acompañar sin "llenar" demasiado.</p>
                    <ul>
                        <li><strong>Dm7</strong>: D - F - C (raíz - 3era - 7ma)</li>
                        <li><strong>G7</strong>: G - B - F (raíz - 3era - 7ma)</li>
                        <li><strong>Cmaj7</strong>: C - E - B (raíz - 3era - 7ma)</li>
                    </ul>
                    <p>Nota cómo la 3era y 7ma se mueven por <strong>semitono</strong> entre acordes (voice leading eficiente).</p>
                    <div class="lesson-example">
                        <h4>Shell voicing ii-V-I</h4>
                        <button class="example-btn" data-play-notes="D3,F3,C4">Dm7 shell</button>
                        <button class="example-btn" data-play-notes="G3,B3,F4">G7 shell</button>
                        <button class="example-btn" data-play-notes="C3,E3,B3">Cmaj7 shell</button>
                        <button class="example-btn" data-play-notes="D3,F3,C4|G3,B3,F4|C3,E3,B3">ii-V-I shell completo</button>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Voicing con extensiones (9na, 11na, 13na)</h3>
                    <p>En estilos como neo-soul, R&B y jazz moderno, reemplazas notas "obvias" (la 5ta) por extensiones más coloridas:</p>
                    <ul>
                        <li><strong>Dm9</strong>: D - F - C - E (raíz - 3era - 7ma - 9na, sin 5ta)</li>
                        <li><strong>G13</strong>: G - B - F - E (raíz - 3era - 7ma - 13na)</li>
                        <li><strong>Cmaj9</strong>: C - E - B - D (raíz - 3era - 7ma - 9na)</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>ii-V-I con extensiones (estilo neo-soul)</h4>
                        <button class="example-btn" data-play-notes="D3,F3,C4,E4">Dm9</button>
                        <button class="example-btn" data-play-notes="G3,B3,F4,E4">G13 (3-7-13)</button>
                        <button class="example-btn" data-play-notes="C3,E3,B3,D4">Cmaj9</button>
                        <button class="example-btn" data-play-notes="D3,F3,C4,E4|G3,B3,F4,E4|C3,E3,B3,D4">ii-V-I neo-soul</button>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Voicing por estilo</h3>
                    <table class="ref-table">
                        <tr><th>Estilo</th><th>Voicing típico</th><th>Característica</th></tr>
                        <tr><td>Pop</td><td>Tríadas cerradas, inversiones</td><td>Simple, directo, raíz en el bajo</td></tr>
                        <tr><td>Neo-soul / R&B</td><td>Maj9, m9, add9 abiertos</td><td>9nas siempre, 5ta omitida, movimiento suave</td></tr>
                        <tr><td>Jazz</td><td>Shell, drop 2, rootless</td><td>3era+7ma definen el acorde, bajista cubre raíz</td></tr>
                        <tr><td>Clásico/Chopin</td><td>Bajo separado + arpegio mano derecha</td><td>Bajo de Chopin (3era menor abajo), arpegios amplios</td></tr>
                        <tr><td>Anime/Hisaishi</td><td>Octava en bajo + maj7/m7 en la derecha</td><td>Melodía arriba, acordes en medio, bajo limpio</td></tr>
                        <tr><td>Impresionista</td><td>Cuartal, paralelo, clusters</td><td>Sin raíz clara, sonido flotante, color puro</td></tr>
                    </table>
                </div>

                <div class="lesson-section">
                    <h3>Voicing rootless (sin raíz)</h3>
                    <p>En jazz y neo-soul con bajista, <strong>no necesitas tocar la raíz</strong>. Solo tocas 3era, 5ta/7ma, y extensiones. Suena más moderno.</p>
                    <div class="lesson-example">
                        <h4>Dm7 rootless → G7 rootless → Cmaj7 rootless</h4>
                        <button class="example-btn" data-play-notes="F3,A3,C4,E4">Dm9 rootless (3-5-7-9)</button>
                        <button class="example-btn" data-play-notes="B3,D4,F4,A4">G9 rootless (3-5-7-9)</button>
                        <button class="example-btn" data-play-notes="E3,G3,B3,D4">Cmaj9 rootless (3-5-7-9)</button>
                        <button class="example-btn" data-play-notes="F3,A3,C4,E4|B3,D4,F4,A4|E3,G3,B3,D4">ii-V-I rootless completo</button>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Ejemplo práctico: misma progresión, 4 estilos</h3>
                    <p>I - vi - IV - V en C mayor, con voicing de cada estilo:</p>
                    <div class="lesson-example">
                        <h4>Pop (tríadas cerradas)</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|A3,C4,E4|F3,A3,C4|G3,B3,D4">Pop: C - Am - F - G</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Neo-soul (9nas y abierto)</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4,B4,D5|A3,C4,E4,G4,B4|F3,A3,C4,E4,G4|G3,B3,D4,F4,A4">Neo-soul: Cmaj9 - Am9 - Fmaj9 - G9</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Jazz (shell voicing)</h4>
                        <button class="example-btn" data-play-notes="C3,E3,B3|A3,C4,G4|F3,A3,E4|G3,B3,F4">Jazz: Cmaj7 - Am7 - Fmaj7 - G7 (shells)</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Estilo Chopin (bajo separado + arpegio)</h4>
                        <button class="example-btn" data-play-notes="A2,C3,E4,G4,B4|F2,A3,C4,E4,G4|D2,F3,A3,C4,E4|E2,G3,B3,D4,F4">Chopin: C/A - Am/F - F/D - G/E (bajo de Chopin)</button>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Qué es un voicing "drop 2"?',
                options: ['Quitar la 2da nota del acorde', 'Bajar la 2da nota más aguda una octava', 'Tocar solo 2 notas', 'Bajar todo el acorde 2 octavas'],
                correct: 1,
            }
        },
        {
            id: 'modal-harmony',
            title: '18. Armonía modal',
            content: `
                <div class="lesson-section">
                    <h3>Los 4 modos principales</h3>
                    <p>Cada modo tiene un <strong>color emocional</strong> único y un <strong>acorde característico</strong> que lo define:</p>
                    <h3 style="margin-top:16px">Dórico (ii)</h3>
                    <p>Menor pero con 6ta mayor. Sonido menor con un toque de esperanza.</p>
                    <p>Acorde característico: <strong>iv con 6ta mayor</strong> (contraste con menor natural que tiene iv con 6ta menor).</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-scale="D,dorian">D Dórico</button>
                        <button class="example-btn" data-play-notes="D3,F3,A3,C4|G3,Bb3,D4|A3,C4,E4">Dm7-Gm-Am (Dórico)</button>
                    </div>
                    <h3 style="margin-top:16px">Mixolidio (V)</h3>
                    <p>Mayor pero con 7ma menor. El sonido del blues y el rock.</p>
                    <p>Acorde característico: <strong>bVII</strong>.</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-scale="G,mixolydian">G Mixolidio</button>
                        <button class="example-btn" data-play-notes="G3,B3,D4|F3,A3,C4|C3,E3,G3">G-F-C (Mixolidio)</button>
                    </div>
                    <h3 style="margin-top:16px">Lidio (IV)</h3>
                    <p>Mayor con 4ta aumentada (#4). Sonido brillante, flotante, cinematográfico.</p>
                    <p>Acorde característico: <strong>II mayor</strong> (en vez del ii menor).</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-scale="F,lydian">F Lidio</button>
                        <button class="example-btn" data-play-notes="F3,A3,C4,E4|G3,B3,D4">Fmaj7-G (Lidio)</button>
                    </div>
                    <h3 style="margin-top:16px">Frigio (iii)</h3>
                    <p>Menor con 2da menor. Sonido oscuro, flamenco, medio-oriental.</p>
                    <p>Acorde característico: <strong>bII</strong>.</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-scale="E,phrygian">E Frigio</button>
                        <button class="example-btn" data-play-notes="E3,G3,B3|F3,A3,C4|E3,G3,B3">Em-F-Em (Frigio)</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Escúchalo en canciones</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"So What" - Miles Davis</div>
                            <div class="song-example-artist">D Dórico: Dm7 ida y vuelta</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="D3,A3,E4|D3,A3,E4|D3,G3,D4|D3,F3,C4|D3,A3,E4">Dm voicings (estilo So What)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Oye Como Va" - Santana</div>
                            <div class="song-example-artist">A Dórico: Am7 - D7 (i - IV7)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="A3,C4,E4,G4|D3,F#3,A3,C4|A3,C4,E4,G4|D3,F#3,A3,C4">Am7 - D7 (groove Dórico)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Norwegian Wood" - Beatles</div>
                            <div class="song-example-artist">E Mixolidio: E - D - E (I-bVII-I)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="E3,G#3,B3|D3,F#3,A3|E3,G#3,B3|D3,F#3,A3|E3,G#3,B3">E - D - E (Mixolidio)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Hit the Road Jack" - Ray Charles</div>
                            <div class="song-example-artist">Frigio/Andaluz: Am-G-F-E</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="A3,C4,E4|G3,B3,D4|F3,A3,C4|E3,G#3,B3">Am-G-F-E (cadencia Frigia)</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Qué modo tiene 7ma menor con el resto mayor (sonido de blues/rock)?',
                options: ['Dórico', 'Mixolidio', 'Lidio', 'Frigio'],
                correct: 1,
            }
        },
        {
            id: 'impressionist',
            title: '19. Armonía impresionista',
            content: `
                <div class="lesson-section">
                    <h3>El mundo de Debussy, Ravel y Satie</h3>
                    <p>La armonía impresionista rompe las reglas de la armonía funcional. Los acordes no "resuelven": <strong>flotan</strong>. El objetivo es crear <strong>color y atmósfera</strong>.</p>

                    <h3 style="margin-top:16px">Escala de tonos enteros (whole tone)</h3>
                    <p>6 notas separadas por tonos enteros. Sin semitonos = sin tensión, sin resolución. Sonido onírico y flotante.</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="C4,D4,E4,F#4,G#4,A#4,C5">Escala whole tone desde C</button>
                    </div>

                    <h3 style="margin-top:16px">Acordes paralelos (planing)</h3>
                    <p>Mover la <strong>misma forma de acorde</strong> cromáticamente o por escala. No hay "funciones" — solo movimiento y color.</p>
                    <div class="lesson-example">
                        <h4>Planing cromático con tríadas mayores</h4>
                        <button class="example-btn" data-play-notes="C4,E4,G4|Db4,F4,Ab4|D4,F#4,A4|Eb4,G4,Bb4">C → Db → D → Eb (paralelo)</button>
                    </div>

                    <h3 style="margin-top:16px">Armonía cuartal</h3>
                    <p>Acordes construidos en <strong>4tas</strong> en vez de 3ras. Sonido abierto, ambiguo, moderno.</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="C4,F4,Bb4">Acorde cuartal: C-F-Bb</button>
                        <button class="example-btn" data-play-notes="D4,G4,C5">Acorde cuartal: D-G-C</button>
                    </div>

                    <h3 style="margin-top:16px">Acordes de color</h3>
                    <p>Sus2, add9, sus4 sin resolución funcional. Se usan por su <strong>sonoridad</strong>, no por su función.</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="C4,D4,G4">Csus2</button>
                        <button class="example-btn" data-play-notes="C4,F4,G4">Csus4</button>
                        <button class="example-btn" data-play-notes="C4,E4,G4,D5">Cadd9</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Escúchalo en piezas reales</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Gymnopédie No. 1" - Satie</div>
                            <div class="song-example-artist">Gmaj7 y Dmaj7 alternados, sin resolución funcional</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="G3,B3,D4,F#4|D3,F#3,A3,C#4|G3,B3,D4,F#4|D3,F#3,A3,C#4">Gymnopédie (Gmaj7-Dmaj7)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Clair de Lune" - Debussy</div>
                            <div class="song-example-artist">Planing con acordes flotantes en Db mayor</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="Db3,F3,Ab3|Eb3,Gb3,Bb3|Db3,F3,Ab3|Ab3,Db4,F4|Gb3,Bb3,Db4">Planing estilo Clair de Lune</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Rêverie" - Debussy</div>
                            <div class="song-example-artist">Movimiento por tonos enteros, sonido onírico</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="F3,A3,C4,E4|E3,G#3,B3,D#4|Eb3,G3,Bb3,D4|D3,F#3,A3,C#4">Movimiento cromático descendente</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Pavane pour une infante défunte" - Ravel</div>
                            <div class="song-example-artist">Armonía modal con colores suaves</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="E3,G#3,B3|A3,C#4,E4|F#3,A3,C#4|B3,D#4,F#4|E3,G#3,B3">Pavane (E mayor modal)</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Qué es el "planing" en armonía impresionista?',
                options: ['Resolver acordes al I', 'Mover la misma forma de acorde en paralelo', 'Construir acordes en 4tas', 'Usar solo la escala pentatónica'],
                correct: 1,
            }
        },
        {
            id: 'romantic',
            title: '20. Armonía romántica',
            content: `
                <div class="lesson-section">
                    <h3>El lenguaje de Chopin y Rachmaninoff</h3>
                    <p>La armonía del período romántico expande la armonía funcional con <strong>cromatismo</strong>, <strong>modulaciones expresivas</strong> y <strong>acordes alterados</strong>.</p>

                    <h3 style="margin-top:16px">Cromatismo</h3>
                    <p>Notas cromáticas que conectan acordes diatónicos, creando una línea de bajo o voz interna que se mueve por semitonos.</p>
                    <div class="lesson-example">
                        <h4>Bajo cromático descendente</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|B2,E4,G4|Bb2,E4,G4|A2,E4,G4">C → C/B → C/Bb → Am</button>
                    </div>

                    <h3 style="margin-top:16px">Acordes disminuidos de paso</h3>
                    <p>Un acorde disminuido 7 que conecta dos acordes diatónicos vecinos. El bajo sube cromáticamente.</p>
                    <div class="lesson-example">
                        <h4>Disminuido de paso entre I y ii</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|C#3,E4,G4,Bb4|D3,F4,A4">C → C#dim7 → Dm</button>
                    </div>

                    <h3 style="margin-top:16px">Sexta aumentada</h3>
                    <p>Acorde cromático que resuelve al V con gran fuerza. La 6ta aumentada (Ab-F#) se expande cromáticamente a la 8va (G-G).</p>
                    <ul>
                        <li><strong>Italiana (It6)</strong>: Ab-C-F# (3 notas)</li>
                        <li><strong>Francesa (Fr6)</strong>: Ab-C-D-F# (con 2da)</li>
                        <li><strong>Alemana (Ger6)</strong>: Ab-C-Eb-F# (con 3era menor)</li>
                    </ul>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="Ab3,C4,F#4|G3,B3,D4">It6 → V (en C)</button>
                        <button class="example-btn" data-play-notes="Ab3,C4,D4,F#4|G3,B3,D4">Fr6 → V (en C)</button>
                    </div>

                    <h3 style="margin-top:16px">Bajo de Chopin (3era menor inferior)</h3>
                    <p>Agregar un bajo a la 3era menor inferior de la raíz. Crea riqueza armónica inmediata.</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="A2,C4,E4,G4">C/A (bajo de Chopin de C)</button>
                        <button class="example-btn" data-play-notes="E2,G3,B3,D4">G/E (bajo de Chopin de G)</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Escúchalo en piezas reales</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Nocturno Op.9 No.2" - Chopin</div>
                            <div class="song-example-artist">Eb mayor con bajo de Chopin y cromatismo</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C2,Eb3,G3,Bb3|Bb2,Eb3,G3|Ab2,C3,Eb3,Ab3|Bb2,D3,F3,Ab3|Eb2,Eb3,G3,Bb3">Nocturno: Eb/C-Eb/Bb-Ab-Bb7-Eb</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Preludio en C# menor" - Rachmaninoff</div>
                            <div class="song-example-artist">Acordes masivos con cromatismo</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C#2,C#3,E3,G#3|C#2,C#3,F3,A3|C#2,C#3,E3,G#3|B2,D#3,F#3,A3|C#2,E3,G#3,C#4">C#m masivo (estilo Rachmaninoff)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Liebestraum No.3" - Liszt</div>
                            <div class="song-example-artist">Bajo cromático con sextas aumentadas</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="Ab3,C4,E4|Ab3,C4,Eb4|Ab3,Bb3,D4|G3,B3,D4|C3,E4,G4">Ab-Abm-Bb7-G-C (cromático)</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Qué es un acorde disminuido de paso?',
                options: ['Un acorde en estado fundamental', 'Un dim7 que conecta dos acordes diatónicos vecinos por cromatismo', 'Un acorde que resuelve al I', 'Un acorde sin 3era'],
                correct: 1,
            }
        },
        {
            id: 'japanese-anime',
            title: '21. Armonía japonesa / anime',
            content: `
                <div class="lesson-section">
                    <h3>El sonido de Hisaishi, Final Fantasy y anime</h3>
                    <p>La música japonesa de anime y videojuegos tiene un lenguaje armónico propio que mezcla <strong>romanticismo occidental</strong> con <strong>sensibilidad melódica japonesa</strong>.</p>

                    <h3 style="margin-top:16px">La progresión Royal Road (王道進行)</h3>
                    <p>La progresión más importante del J-pop y anime: <strong>IVmaj7 → V7 → iii7 → vi</strong></p>
                    <p>Se llama "ōdō shinkō" (王道進行) que significa "progresión del camino real". Mezcla esperanza (IV→V) con melancolía (iii→vi).</p>
                    <div class="lesson-example">
                        <h4>Royal Road en C mayor</h4>
                        <button class="example-btn" data-play-notes="F3,A3,C4,E4|G3,B3,D4,F4|E3,G3,B3,D4|A3,C4,E4">Fmaj7 → G7 → Em7 → Am</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Royal Road en G mayor</h4>
                        <button class="example-btn" data-play-notes="C3,E3,G3,B3|D3,F#3,A3,C4|B3,D4,F#4,A4|E3,G3,B3">Cmaj7 → D7 → Bm7 → Em</button>
                    </div>

                    <h3 style="margin-top:16px">Características de Joe Hisaishi</h3>
                    <ul>
                        <li><strong>Melodías simples</strong> con armonía rica debajo</li>
                        <li><strong>Suspensiones y retardos</strong>: notas que se mantienen mientras la armonía cambia</li>
                        <li><strong>Acordes prestados</strong> del modo menor para dar melancolía</li>
                        <li><strong>Movimiento cromático</strong> suave en las voces internas</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>Progresión tipo Hisaishi</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4,B4|F3,A3,C4,E4|Bb3,D4,F4|C3,E4,G4">Cmaj7 → Fmaj7 → Bbmaj7 → C (con bVII prestado)</button>
                    </div>

                    <h3 style="margin-top:16px">Final Fantasy (Nobuo Uematsu)</h3>
                    <ul>
                        <li><strong>Modulación por mediante</strong>: moverse a una tonalidad que está a una 3era de distancia (C → Eb, C → Ab)</li>
                        <li><strong>Acordes extendidos</strong> con sabor cinematográfico</li>
                        <li>Mezcla de armonía modal (modo Dórico, Mixolidio) con armonía funcional</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>Modulación por mediante (tipo FF)</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|Ab3,C4,Eb4|Bb3,D4,F4|Eb3,G3,Bb3">C → Ab → Bb → Eb (modulación a bIII)</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Escúchalo en piezas reales</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"One Summer's Day" - Hisaishi</div>
                            <div class="song-example-artist">El viaje de Chihiro: Royal Road con suspensiones</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="F3,A3,C4,E4|G3,B3,D4,F4|E3,G3,B3,D4|A3,C4,E4|F3,A3,C4,E4|G3,B3,D4|C3,E4,G4">Fmaj7-G7-Em7-Am-Fmaj7-G-C</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Merry-Go-Round of Life" - Hisaishi</div>
                            <div class="song-example-artist">El castillo ambulante: vals con intercambio modal</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="D3,F3,A3|A3,C#4,E4|D3,F3,A3|Bb3,D4,F4|A3,C#4,E4|D3,F4,A4">Dm-A-Dm-Bb-A-Dm (vals)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"To Zanarkand" - Uematsu</div>
                            <div class="song-example-artist">Final Fantasy X: modulación por mediante</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C3,E4,G4,B4|F3,A3,C4,E4|G3,B3,D4|C3,E4,G4|Ab3,C4,Eb4|Bb3,D4,F4|C3,E4,G4">C-F-G-C-Ab-Bb-C (mediante)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Aerith's Theme" - Uematsu</div>
                            <div class="song-example-artist">Final Fantasy VII: cromatismo expresivo</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="Eb3,G3,Bb3|Ab3,C4,Eb4|Bb3,D4,F4|Eb3,G4,Bb4|Db3,F3,Ab3|Eb3,G3,Bb3">Eb-Ab-Bb-Eb-Db-Eb (épico)</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Cuál es la progresión Royal Road (王道進行)?',
                options: ['I - V - vi - IV', 'IV - V - iii - vi', 'ii - V - I', 'I - bVII - IV - I'],
                correct: 1,
            }
        },
        {
            id: 'score-analysis',
            title: '22. Análisis de partituras',
            content: `
                <div class="lesson-section">
                    <h3>Método de análisis armónico</h3>
                    <div class="edu-img-row">
                        <div class="edu-img" onclick="openImageModal('/reference/1.webp')">
                            <img src="/reference/1.webp" alt="Armaduras" loading="lazy">
                            <div class="edu-img-caption">Paso 1: Identifica la armadura para encontrar la tonalidad</div>
                        </div>
                        <div class="edu-img" onclick="openImageModal('/reference/6-circulo-completo_ezgl9-1024x729.jpg')">
                            <img src="/reference/6-circulo-completo_ezgl9-1024x729.jpg" alt="Círculo de quintas" loading="lazy">
                            <div class="edu-img-caption">El círculo de quintas: mapa de todas las tonalidades y sus relaciones</div>
                        </div>
                    </div>
                    <p>Sigue estos 6 pasos para analizar cualquier pieza:</p>

                    <h3 style="margin-top:16px">Paso 1: Identificar la tonalidad</h3>
                    <ul>
                        <li>Mira la <strong>armadura</strong> (sostenidos/bemoles al inicio)</li>
                        <li>Observa la <strong>nota final</strong> (generalmente la tónica)</li>
                        <li>Busca la <strong>cadencia final</strong> (V→I confirma la tonalidad)</li>
                    </ul>

                    <h3 style="margin-top:16px">Paso 2: Numerar los acordes</h3>
                    <p>Etiqueta cada acorde con su <strong>numeral romano</strong> respecto a la tonalidad encontrada.</p>

                    <h3 style="margin-top:16px">Paso 3: Funciones armónicas</h3>
                    <ul>
                        <li><strong class="fn-tonic">T (Tónica)</strong>: I, iii, vi — reposo</li>
                        <li><strong class="fn-subdominant">SD (Subdominante)</strong>: ii, IV — preparación, movimiento</li>
                        <li><strong class="fn-dominant">D (Dominante)</strong>: V, vii° — tensión</li>
                    </ul>

                    <h3 style="margin-top:16px">Paso 4: Identificar cadencias</h3>
                    <p>Busca las fórmulas de cierre al final de cada frase: V→I, IV→I, V→vi, etc.</p>

                    <h3 style="margin-top:16px">Paso 5: Acordes no diatónicos</h3>
                    <ul>
                        <li><strong>Dominantes secundarios</strong>: V/V, V/vi, etc.</li>
                        <li><strong>Acordes prestados</strong>: bVI, bVII, iv</li>
                        <li><strong>Modulaciones</strong>: cambio de centro tonal</li>
                    </ul>

                    <h3 style="margin-top:16px">Paso 6: Notas no armónicas</h3>
                    <ul>
                        <li><strong>Nota de paso</strong>: conecta dos notas del acorde por grado conjunto</li>
                        <li><strong>Bordadura</strong>: sale y vuelve a la misma nota</li>
                        <li><strong>Retardo</strong>: nota del acorde anterior que se mantiene y luego resuelve</li>
                        <li><strong>Anticipación</strong>: nota del siguiente acorde que llega antes</li>
                    </ul>
                </div>
                <div class="lesson-section">
                    <h3>Ejemplo: "Happy Birthday" en C</h3>
                    <div class="lesson-example">
                        <h4>Análisis</h4>
                        <p>Tonalidad: <strong>C mayor</strong></p>
                        <p>Acordes: <strong>C(I)</strong> → <strong>G7(V7)</strong> → <strong>C(I)</strong> → <strong>F(IV)</strong> → <strong>C(I)</strong> → <strong>G7(V7)</strong> → <strong>C(I)</strong></p>
                        <p>Funciones: T → D → T → SD → T → D → T</p>
                        <p>Cadencia final: Auténtica perfecta (V7→I)</p>
                        <button class="example-btn" data-play-notes="C3,E4,G4|G3,B3,D4,F4|C3,E4,G4|F3,A3,C4|C3,E4,G4|G3,B3,D4,F4|C3,E4,G4">Tocar progresión</button>
                    </div>
                </div>
            `,
            quiz: {
                question: '¿Cuál es el primer paso del análisis armónico?',
                options: ['Numerar acordes', 'Identificar la tonalidad', 'Buscar dominantes secundarios', 'Identificar notas de paso'],
                correct: 1,
            }
        },
        {
            id: 'study-roadmap',
            title: '23. Ruta de estudio completa',
            content: `
                <div class="lesson-section">
                    <h3>Tu camino desde pop básico hasta Chopin, Debussy e Hisaishi</h3>
                    <p>Esta es una guía de referencia con 7 niveles progresivos. Cada nivel construye sobre el anterior.</p>
                    <div class="edu-img-row">
                        <div class="edu-img" onclick="openImageModal('/reference/acordes-diatonicos-funciones.png')">
                            <img src="/reference/acordes-diatonicos-funciones.png" alt="Acordes y funciones" loading="lazy">
                            <div class="edu-img-caption">Fundamento: acordes diatónicos y funciones armónicas</div>
                        </div>
                        <div class="edu-img" onclick="openImageModal('/reference/6-circulo-completo_ezgl9-1024x729.jpg')">
                            <img src="/reference/6-circulo-completo_ezgl9-1024x729.jpg" alt="Círculo de quintas" loading="lazy">
                            <div class="edu-img-caption">Herramienta clave: el círculo de quintas</div>
                        </div>
                    </div>

                    <div class="study-level">
                        <div class="study-level-header">
                            <div class="study-level-number">1</div>
                            <div>
                                <div class="study-level-name">Fundamentos</div>
                                <div class="study-level-subtitle">Lecciones 1-5</div>
                            </div>
                        </div>
                        <div class="study-level-body">
                            <ul class="study-level-goals">
                                <li>Conocer todas las notas en español e inglés</li>
                                <li>Entender semitonos, tonos, sostenidos y bemoles</li>
                                <li>Tocar la escala mayor y menor en C</li>
                                <li>Identificar la escala pentatónica y blues</li>
                            </ul>
                            <div class="study-level-practice">Práctica diaria: Tocar escalas mayor y menor en 3 tonalidades (15 min)</div>
                        </div>
                    </div>

                    <div class="study-level">
                        <div class="study-level-header">
                            <div class="study-level-number">2</div>
                            <div>
                                <div class="study-level-name">Acordes y tonalidad</div>
                                <div class="study-level-subtitle">Lecciones 6-10</div>
                            </div>
                        </div>
                        <div class="study-level-body">
                            <ul class="study-level-goals">
                                <li>Construir tríadas mayores, menores, dim y aug</li>
                                <li>Tocar inversiones y slash chords</li>
                                <li>Construir acordes de 7ma (maj7, dom7, m7)</li>
                                <li>Identificar los 7 grados de una tonalidad</li>
                                <li>Tocar I-V-vi-IV y I-IV-V-I en varias tonalidades</li>
                            </ul>
                            <div class="study-level-practice">Práctica diaria: Tríadas y 7mas en todas las tonalidades + una progresión (20 min)</div>
                        </div>
                    </div>

                    <div class="study-level">
                        <div class="study-level-header">
                            <div class="study-level-number">3</div>
                            <div>
                                <div class="study-level-name">Intermedio</div>
                                <div class="study-level-subtitle">Lecciones 11-13</div>
                            </div>
                        </div>
                        <div class="study-level-body">
                            <ul class="study-level-goals">
                                <li>Usar dominantes secundarios (V/V, V/vi)</li>
                                <li>Reconocer las 4 cadencias principales de oído</li>
                                <li>Leer notas en clave de Sol y Fa</li>
                                <li>Analizar progresiones de canciones pop simples</li>
                            </ul>
                            <div class="study-level-practice">Práctica diaria: Analizar los acordes de 1 canción que te guste (20 min)</div>
                        </div>
                    </div>

                    <div class="study-level">
                        <div class="study-level-header">
                            <div class="study-level-number">4</div>
                            <div>
                                <div class="study-level-name">Avanzado Pop / Neo-soul</div>
                                <div class="study-level-subtitle">Lecciones 14-15</div>
                            </div>
                        </div>
                        <div class="study-level-body">
                            <ul class="study-level-goals">
                                <li>Tocar acordes extendidos: add9, maj9, m9, dom9</li>
                                <li>Reharmonizar una progresión simple en 4 pasos</li>
                                <li>Aplicar sustituciones tritonales e intercambio modal</li>
                                <li>Escuchar y reconocer colores extendidos</li>
                            </ul>
                            <div class="study-level-practice">Práctica diaria: Tomar I-V-vi-IV y reharmonizarla de una forma nueva cada día (25 min)</div>
                        </div>
                    </div>

                    <div class="study-level">
                        <div class="study-level-header">
                            <div class="study-level-number">5</div>
                            <div>
                                <div class="study-level-name">Jazz</div>
                                <div class="study-level-subtitle">Lecciones 16-18</div>
                            </div>
                        </div>
                        <div class="study-level-body">
                            <ul class="study-level-goals">
                                <li>Tocar ii-V-I en las 12 tonalidades mayores</li>
                                <li>Entender y usar guide tones (3era y 7ma)</li>
                                <li>Dominar voicings: drop 2, shell, rootless, abierto</li>
                                <li>Identificar y tocar en modo Dórico, Mixolidio, Lidio y Frigio</li>
                                <li>Analizar un standard de jazz (Autumn Leaves, All of Me)</li>
                            </ul>
                            <div class="study-level-practice">Práctica diaria: ii-V-I en 3 tonalidades con drop 2 y shell voicing + un modo (30 min)</div>
                        </div>
                    </div>

                    <div class="study-level">
                        <div class="study-level-header">
                            <div class="study-level-number">6</div>
                            <div>
                                <div class="study-level-name">Clásico / Impresionista</div>
                                <div class="study-level-subtitle">Lecciones 19-20</div>
                            </div>
                        </div>
                        <div class="study-level-body">
                            <ul class="study-level-goals">
                                <li>Tocar la escala de tonos enteros y usar acordes paralelos</li>
                                <li>Construir armonía cuartal</li>
                                <li>Usar cromatismo, disminuidos de paso y sextas aumentadas</li>
                                <li>Aplicar el bajo de Chopin a progresiones</li>
                                <li>Escuchar y analizar una pieza de Debussy o Chopin</li>
                            </ul>
                            <div class="study-level-practice">Práctica diaria: Técnica impresionista (planing, escalas whole tone) + 1 pieza clásica (30 min)</div>
                        </div>
                    </div>

                    <div class="study-level">
                        <div class="study-level-header">
                            <div class="study-level-number">7</div>
                            <div>
                                <div class="study-level-name">Anime / Cine / Maestría</div>
                                <div class="study-level-subtitle">Lecciones 21-22</div>
                            </div>
                        </div>
                        <div class="study-level-body">
                            <ul class="study-level-goals">
                                <li>Tocar la progresión Royal Road en varias tonalidades</li>
                                <li>Analizar una pieza de Hisaishi o Final Fantasy</li>
                                <li>Hacer un análisis armónico completo de 6 pasos</li>
                                <li>Modular por mediante (3eras)</li>
                                <li>Crear tus propias piezas combinando todas las técnicas</li>
                            </ul>
                            <div class="study-level-practice">Práctica diaria: Analizar 1 pieza + componer/improvisar aplicando lo aprendido (40 min)</div>
                        </div>
                    </div>
                </div>
            `,
        },
        {
            id: 'hymns',
            title: '24. Himnos al piano',
            content: `
                <div class="lesson-section">
                    <h3>Introducción: acompañar himnos al piano</h3>
                    <p>Los <strong>himnos congregacionales</strong> son piezas escritas para que una congregación cante al unísono o en armonía. En los himnarios, la escritura más común es a <strong>4 voces SATB</strong> (Soprano, Alto, Tenor, Bajo) en dos pentagramas.</p>
                    <p>El pianista que acompaña himnos tiene una tarea específica: <strong>sostener la armonía, marcar el tempo y apoyar al canto</strong>. El estilo buscado es clásico/congregacional — firme, claro y al servicio de la letra.</p>
                    <div class="edu-concept">
                        <strong>Formato SATB:</strong> El pentagrama superior (clave de Sol) contiene Soprano (melodía, plicas arriba) y Alto (plicas abajo). El pentagrama inferior (clave de Fa) contiene Tenor (plicas arriba) y Bajo (plicas abajo). Esto NO es una partitura de piano: necesitas adaptarla.
                    </div>
                    <p>Esta lección te enseñará a tomar un himno en formato SATB y convertirlo en un acompañamiento pianístico efectivo.</p>
                </div>

                <div class="lesson-section">
                    <h3>Cómo analizar un himno paso a paso</h3>
                    <p>Antes de tocar, analiza la partitura:</p>
                    <ol>
                        <li><strong>Tonalidad:</strong> mira la armadura de clave. Un bemol (Bb) = Fa mayor o Re menor. Dos bemoles = Sib mayor, etc.</li>
                        <li><strong>Compás:</strong> 4/4, 3/4, 6/8, etc. Define el patrón rítmico.</li>
                        <li><strong>Forma:</strong> ¿tiene estrofas y coro? ¿Se repite? ¿Hay interludio?</li>
                        <li><strong>Extraer acordes del SATB:</strong> el bajo te da la raíz probable. Las 4 voces juntas forman el acorde.</li>
                        <li><strong>Cifrar con números romanos:</strong> identifica cada acorde en relación a la tonalidad.</li>
                    </ol>
                    <div class="edu-concept">
                        <strong>Cifrado rápido:</strong> En Fa mayor, si el bajo tiene F y las voces superiores forman F-A-C, es un acorde de <strong>I</strong>. Si el bajo tiene C y las voces forman C-E-G, es <strong>V</strong>. Si el bajo tiene Bb y las voces forman Bb-D-F, es <strong>IV</strong>.
                    </div>
                    <table class="ref-table">
                        <tr><th>Grado</th><th>Acorde en F mayor</th><th>Notas</th></tr>
                        <tr><td>I</td><td>F</td><td>F - A - C</td></tr>
                        <tr><td>ii</td><td>Gm</td><td>G - Bb - D</td></tr>
                        <tr><td>iii</td><td>Am</td><td>A - C - E</td></tr>
                        <tr><td>IV</td><td>Bb</td><td>Bb - D - F</td></tr>
                        <tr><td>V</td><td>C</td><td>C - E - G</td></tr>
                        <tr><td>vi</td><td>Dm</td><td>D - F - A</td></tr>
                        <tr><td>vii°</td><td>Edim</td><td>E - G - Bb</td></tr>
                    </table>
                    <div class="lesson-example">
                        <h4>Acordes diatónicos de Fa mayor</h4>
                        <button class="example-btn" data-play-notes="F3,A3,C4|G3,Bb3,D4|A3,C4,E4|Bb3,D4,F4|C3,E4,G4|D3,F4,A4|E3,G3,Bb3">I - ii - iii - IV - V - vi - vii°</button>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Patrones de acompañamiento — Mano izquierda</h3>
                    <p>La mano izquierda (MI) proporciona el fundamento armónico y rítmico. Aquí tienes los patrones más usados, todos en el acorde de <strong>F (I)</strong>:</p>

                    <div class="edu-concept">
                        <strong>1. Bajo simple (raíz en negras):</strong> Toca la nota fundamental en cada tiempo. Es el más básico y firme.
                    </div>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="F2|F2|F2|F2">Bajo simple: F en negras</button>
                    </div>

                    <div class="edu-concept">
                        <strong>2. Bajo octavado:</strong> Alterna la raíz grave con su octava. Da más cuerpo y movimiento.
                    </div>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="F2|F3|F2|F3">Bajo octavado: F2-F3-F2-F3</button>
                    </div>

                    <div class="edu-concept">
                        <strong>3. Bajo 1-5 alternado:</strong> Alterna raíz y quinta. Muy estable y clásico para himnos.
                    </div>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="F2|C3|F2|C3">Bajo 1-5: F2-C3-F2-C3</button>
                    </div>

                    <div class="edu-concept">
                        <strong>4. Arpegio 1-5-8:</strong> Raíz, quinta, octava. Más fluido, bueno para himnos de tempo moderado.
                    </div>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="F2|C3|F3|C3">Arpegio 1-5-8-5: F2-C3-F3-C3</button>
                    </div>

                    <div class="edu-concept">
                        <strong>5. Bajo de vals (para 3/4):</strong> Raíz en tiempo 1, acorde en tiempos 2 y 3. Para himnos en compás ternario.
                    </div>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="F2|A2,C3|A2,C3">Bajo de vals en F: F2 - AC - AC</button>
                    </div>

                    <div class="edu-concept">
                        <strong>6. Bajo con inversiones:</strong> Cuando la partitura SATB indica una nota de bajo que no es la raíz, respétala. Ej: F/C significa acorde de F con C en el bajo (segunda inversión).
                    </div>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="F2,A2,C3|C2,F3,A3|A2,C3,F3">F (raíz) → F/C (2da inv.) → F/A (1era inv.)</button>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Patrones rítmicos — Mano derecha</h3>
                    <p>La mano derecha (MD) lleva la armonía y/o la melodía. Los patrones principales:</p>

                    <div class="edu-concept">
                        <strong>1. Bloque sostenido:</strong> Toca el acorde completo y mantenlo (redondas o blancas). Ideal para himnos lentos y solemnes.
                    </div>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="F4,A4,C5">Bloque: F mayor sostenido</button>
                    </div>

                    <div class="edu-concept">
                        <strong>2. Bloque rítmico:</strong> Repite el acorde en negras, siguiendo el pulso. Da más energía y apoyo rítmico.
                    </div>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="F4,A4,C5|F4,A4,C5|F4,A4,C5|F4,A4,C5">Bloque rítmico: F mayor en negras</button>
                    </div>

                    <div class="edu-concept">
                        <strong>3. Melodía + relleno armónico:</strong> La soprano (melodía) va en el dedo más agudo, y los dedos internos completan la armonía. Es la forma más musical y expresiva.
                    </div>
                    <div class="lesson-example">
                        <h4>Ejemplo: melodía C5-D5-C5-A4 con armonía de F debajo</h4>
                        <button class="example-btn" data-play-notes="A4,C5|A4,D5|A4,C5|F4,A4">Melodía + armonía interior</button>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Cambios armónicos rápidos (un acorde por tiempo)</h3>
                    <p>Muchos himnos tienen <strong>un acorde diferente en cada tiempo</strong> del compás (ej: I - vii° - I - I o IV - IV - iii - iii). Esto puede ser intimidante pero hay técnicas clave:</p>

                    <div class="edu-concept">
                        <strong>Voice leading (conducción de voces):</strong> Mueve cada voz la menor distancia posible al cambiar de acorde. Si una nota es común entre dos acordes, mantenla en su lugar.
                    </div>
                    <p><strong>Ejemplo:</strong> F (F-A-C) → Edim (E-G-Bb) → F (F-A-C). La voz del medio no se mueve mucho:</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="F4,A4,C5|E4,G4,Bb4|F4,A4,C5|F4,A4,C5">I - vii° - I - I (posición cercana)</button>
                    </div>

                    <div class="edu-concept">
                        <strong>Inversiones para suavizar el movimiento:</strong> En vez de saltar a posición fundamental en cada acorde, usa inversiones que mantengan las notas cerca.
                    </div>
                    <div class="lesson-example">
                        <h4>Bb → Bb → Am → Am (IV-IV-iii-iii con inversiones)</h4>
                        <button class="example-btn" data-play-notes="Bb3,D4,F4|Bb3,D4,F4|A3,C4,E4|A3,C4,E4">Con inversiones cercanas</button>
                    </div>

                    <div class="edu-concept">
                        <strong>Simplifica la MI:</strong> Cuando hay un acorde por tiempo, la MI puede tocar solo la raíz de cada acorde (una nota por tiempo), mientras la MD mantiene voicings cerrados.
                    </div>
                    <div class="lesson-example">
                        <h4>MI simplificada con MD en bloque (I-vii°-I-I en F)</h4>
                        <button class="example-btn" data-play-notes="F2,F4,A4,C5|E2,E4,G4,Bb4|F2,F4,A4,C5|F2,F4,A4,C5">MI raíz + MD bloque</button>
                    </div>

                    <p><strong>Reglas prácticas para cambios rápidos:</strong></p>
                    <ul>
                        <li>Busca <strong>notas comunes</strong> entre acordes consecutivos y no las muevas.</li>
                        <li>La MI toca solo la <strong>raíz</strong> (o bajo indicado) — una nota por tiempo.</li>
                        <li>La MD mantiene <strong>posición cerrada</strong> — no saltes más de una tecla por voz.</li>
                        <li>Si un acorde dura solo 1 tiempo, <strong>no arpegies</strong> — toca todo junto.</li>
                        <li>Practica los cambios <strong>aislados</strong>: toma solo 2 acordes y repítelos hasta que fluyan.</li>
                    </ul>
                </div>

                <div class="lesson-section">
                    <h3>Passing chords y acordes de aproximación (Mano izquierda)</h3>
                    <p>Los <strong>passing chords</strong> (acordes de paso) son acordes que insertas <em>entre</em> los acordes escritos en la partitura para crear movimiento cromático, tensión y resolución. Son la herramienta principal para que un acompañamiento de himno suene profesional en vez de cuadrado.</p>
                    <p>La MD generalmente va leyendo soprano y contralto (o formando acordes a partir de ellas). La MI es donde ocurre la magia de los passing chords — el bajo guía todo el movimiento armónico.</p>

                    <div class="edu-concept">
                        <strong>Concepto clave — Target chord (acorde objetivo):</strong> Siempre piensas en el próximo acorde al que vas. Ese es tu "target". Los passing chords son puentes que te llevan a él de manera más suave o más dramática.
                    </div>

                    <h4>1. Aproximación cromática por semitono (medio tono abajo)</h4>
                    <p>La técnica más básica y efectiva: toca el acorde un <strong>semitono debajo</strong> del target justo antes de llegar a él. Esto crea tensión que resuelve inmediatamente.</p>
                    <p>En la MI: si vas a F, tocas E justo antes. Si vas a Bb, tocas A justo antes. Si vas a C, tocas B justo antes.</p>
                    <div class="lesson-example">
                        <h4>MI: Aproximación cromática a F (target)</h4>
                        <button class="example-btn" data-play-notes="C2,C3|C2,C3|E2,E3|F2,F3">V ... → E (cromático) → I (target F)</button>
                    </div>
                    <div class="lesson-example">
                        <h4>MI: Aproximación cromática a Bb (target = IV)</h4>
                        <button class="example-btn" data-play-notes="F2,F3|F2,F3|A2,A3|Bb2,Bb3">I ... → A (cromático) → IV (target Bb)</button>
                    </div>
                    <div class="lesson-example">
                        <h4>MI: Aproximación cromática a C (target = V)</h4>
                        <button class="example-btn" data-play-notes="Bb2,Bb3|Bb2,Bb3|B2,B3|C3,C4">IV ... → B (cromático) → V (target C)</button>
                    </div>
                    <div class="edu-concept">
                        <strong>Cuándo usarlo:</strong> En el último tiempo del compás antes del target, o en la segunda mitad del último tiempo (como corchea de anticipación). Es sutil pero transforma el sonido.
                    </div>

                    <h4>2. Aproximación cromática por semitono arriba</h4>
                    <p>Igual que el anterior pero desde <strong>medio tono arriba</strong>. Menos común pero igualmente efectivo.</p>
                    <div class="lesson-example">
                        <h4>MI: Desde Gb (arriba) resolviendo a F</h4>
                        <button class="example-btn" data-play-notes="C2,C3|C2,C3|Gb2,Gb3|F2,F3">V ... → Gb (cromático arriba) → I</button>
                    </div>

                    <h4>3. Aproximación doble cromática (arriba y abajo)</h4>
                    <p>Combina ambas: tocas medio tono arriba y luego medio tono abajo (o viceversa) antes del target. Crea un efecto de "encircling" (rodeo cromático).</p>
                    <div class="lesson-example">
                        <h4>MI: Rodeo cromático hacia F</h4>
                        <button class="example-btn" data-play-notes="C2,C3|Gb2,Gb3|E2,E3|F2,F3">V → Gb (arriba) → E (abajo) → I</button>
                    </div>

                    <h4>4. Cadencia ii-V-I hacia el target</h4>
                    <p>La técnica más poderosa de los passing chords. Para llegar a cualquier acorde target, tocas su <strong>ii-V</strong> antes (como mini cadencia). Esto funciona porque ii-V-I es la resolución más fuerte en música tonal.</p>
                    <div class="edu-concept">
                        <strong>Cómo calcular el ii-V de cualquier target:</strong><br>
                        • El <strong>V</strong> del target está una 5ta justa arriba (o 4ta abajo) del target.<br>
                        • El <strong>ii</strong> del target está un tono arriba del target (o una 5ta arriba del V).<br>
                        Ejemplo: target = F → V de F = C → ii de F = Gm. La cadencia es Gm - C - F.
                    </div>
                    <table class="ref-table">
                        <tr><th>Target</th><th>ii</th><th>V</th><th>Cadencia completa</th></tr>
                        <tr><td>F (I)</td><td>Gm</td><td>C</td><td>Gm → C → F</td></tr>
                        <tr><td>Bb (IV)</td><td>Cm</td><td>F</td><td>Cm → F → Bb</td></tr>
                        <tr><td>C (V)</td><td>Dm</td><td>G</td><td>Dm → G → C</td></tr>
                        <tr><td>Dm (vi)</td><td>Em</td><td>A</td><td>Em → A → Dm</td></tr>
                    </table>
                    <div class="lesson-example">
                        <h4>MI: ii-V-I hacia F (Gm → C → F)</h4>
                        <button class="example-btn" data-play-notes="G2,G3|C2,C3|F2,F3">Bajo: G → C → F (ii-V-I)</button>
                    </div>
                    <div class="lesson-example">
                        <h4>MI: ii-V-I hacia Bb (Cm → F → Bb)</h4>
                        <button class="example-btn" data-play-notes="C2,C3|F2,F3|Bb2,Bb3">Bajo: C → F → Bb (ii-V-I del IV)</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Completo con MD: ii-V-I hacia F</h4>
                        <button class="example-btn" data-play-notes="G2,Bb3,D4,F4|C2,Bb3,C4,E4|F2,A3,C4,F4">Gm7 → C7 → F (con voicings)</button>
                    </div>
                    <div class="edu-concept">
                        <strong>En la práctica:</strong> No necesitas tocar el ii-V completo siempre. A veces basta con solo el V del target (dominante secundario): antes de ir a Bb tocas F7, antes de Dm tocas A7, etc.
                    </div>

                    <h4>5. Solo el V del target (dominante secundario)</h4>
                    <p>Versión simplificada del ii-V: solo tocas el <strong>acorde dominante (V7)</strong> del target en el tiempo anterior. Esto ya crea una resolución fuerte.</p>
                    <div class="lesson-example">
                        <h4>MI: V7/IV — Antes de Bb, toca F7</h4>
                        <button class="example-btn" data-play-notes="F2,A2,C3,Eb3|Bb2,D3,F3">F7 → Bb (V7 → target)</button>
                    </div>
                    <div class="lesson-example">
                        <h4>MI: V7/vi — Antes de Dm, toca A7</h4>
                        <button class="example-btn" data-play-notes="A2,C#3,E3,G3|D3,F3,A3">A7 → Dm (V7 → target)</button>
                    </div>
                    <div class="lesson-example">
                        <h4>MI: V7/V — Antes de C, toca G7</h4>
                        <button class="example-btn" data-play-notes="G2,B2,D3,F3|C3,E3,G3">G7 → C (V7 → target)</button>
                    </div>

                    <h4>6. Bajo cromático descendente (línea de bajo)</h4>
                    <p>Crea una línea de bajo que desciende por semitonos conectando dos acordes. Los acordes intermedios son passing chords puros — su función es solo conectar.</p>
                    <div class="lesson-example">
                        <h4>MI: Línea cromática descendente F → Dm (I → vi)</h4>
                        <button class="example-btn" data-play-notes="F2,A3,C4,F4|E2,G3,C4,E4|Eb2,G3,Bb3,C4|D2,F3,A3,D4">F → E (paso) → Eb (paso) → Dm</button>
                    </div>
                    <div class="lesson-example">
                        <h4>MI: Línea cromática Bb → F/A (IV → I en 1era inv.)</h4>
                        <button class="example-btn" data-play-notes="Bb2,D4,F4|A2,C4,F4">Bb → F/A (bajo desciende un semitono)</button>
                    </div>

                    <h4>7. Bajo cromático ascendente</h4>
                    <p>Lo mismo pero subiendo. Muy usado para ir de I a IV o de IV a V.</p>
                    <div class="lesson-example">
                        <h4>MI: Línea ascendente F → Bb (I → IV)</h4>
                        <button class="example-btn" data-play-notes="F2,A3,C4|G2,Bb3,D4|A2,C4,F4|Bb2,D4,F4">F → Gm (paso) → F/A (inv.) → Bb</button>
                    </div>

                    <h4>8. Walking bass (bajo caminante) para himnos</h4>
                    <p>Combina todas las técnicas anteriores: el bajo camina por grados conjuntos (diatónicos o cromáticos) entre los acordes del himno, una nota por tiempo. El walking bass transforma la MI en una línea melódica independiente.</p>
                    <div class="edu-concept">
                        <strong>Regla del walking bass:</strong> El tiempo fuerte (1 y 3) toca notas del acorde (raíz o quinta). Los tiempos débiles (2 y 4) pueden ser notas de paso cromáticas o diatónicas que conectan hacia el próximo acorde.
                    </div>
                    <div class="lesson-example">
                        <h4>Walking bass: I - IV - V - I en F mayor</h4>
                        <button class="example-btn" data-play-notes="F2|A2|G2|A2|Bb2|D3|C3|B2|C3|E3|D3|Db3|C3|A2|Bb2|B2|F2">Walking: F(I) ... Bb(IV) ... C(V) ... F(I)</button>
                    </div>

                    <h4>Resumen: técnicas de MI para passing chords</h4>
                    <table class="ref-table">
                        <tr><th>Técnica</th><th>Qué hace la MI</th><th>Ejemplo (target = F)</th><th>Efecto</th></tr>
                        <tr><td>Cromático abajo</td><td>Semitono abajo antes del target</td><td>E → F</td><td>Tensión sutil, muy versátil</td></tr>
                        <tr><td>Cromático arriba</td><td>Semitono arriba antes del target</td><td>Gb → F</td><td>Tensión desde arriba</td></tr>
                        <tr><td>Doble cromático</td><td>Arriba y abajo (o viceversa)</td><td>Gb → E → F</td><td>Rodeo, más elaborado</td></tr>
                        <tr><td>V del target</td><td>Dominante secundario</td><td>C7 → F</td><td>Resolución fuerte</td></tr>
                        <tr><td>ii-V del target</td><td>Mini cadencia completa</td><td>Gm → C → F</td><td>Resolución muy fuerte</td></tr>
                        <tr><td>Bajo cromático desc.</td><td>Línea cromática bajando</td><td>F → E → Eb → D</td><td>Movimiento suave hacia abajo</td></tr>
                        <tr><td>Bajo cromático asc.</td><td>Línea cromática subiendo</td><td>F → G → A → Bb</td><td>Movimiento suave hacia arriba</td></tr>
                        <tr><td>Walking bass</td><td>Bajo caminante nota por nota</td><td>F-A-G-A-Bb...</td><td>Bajo melódico independiente</td></tr>
                    </table>

                    <h4>Cómo aplicarlo en un himno</h4>
                    <p>No uses todas las técnicas a la vez. Sigue estas reglas:</p>
                    <ul>
                        <li><strong>Menos es más:</strong> Usa 1-2 passing chords por frase, no en cada compás.</li>
                        <li><strong>Tiempos débiles:</strong> Los passing chords van en tiempos débiles (2, 4) o en la segunda corchea de un tiempo. Nunca en el tiempo 1.</li>
                        <li><strong>Anticipa el bajo:</strong> Si el siguiente compás es Bb, puedes mover el bajo a A (cromático) o F (V del target) en el último tiempo del compás anterior.</li>
                        <li><strong>La MD no cambia:</strong> Mientras la MI hace passing chords, la MD puede mantener el acorde escrito o preparar el siguiente. No necesitas mover ambas manos.</li>
                        <li><strong>Escucha el contexto:</strong> En estrofas puedes ser más sencillo; en el coro o clímax puedes agregar más movimiento cromático.</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>Ejemplo completo: I → IV con passing chord cromático en MI</h4>
                        <button class="example-btn" data-play-notes="F2,A3,C4,F4|F2,A3,C4,F4|A2,A3,C4,F4|Bb2,Bb3,D4,F4">F (I) → F → A (cromático) → Bb (IV target)</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Ejemplo completo: I → V con ii-V en MI</h4>
                        <button class="example-btn" data-play-notes="F2,A3,C4,F4|D2,F3,A3,D4|G2,B3,D4,F4|C2,E3,G3,C4">F (I) → Dm (ii/V) → G7 (V/V) → C (V target)</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Ejemplo: himno con walking bass en MI (I-IV-V-I)</h4>
                        <button class="example-btn" data-play-notes="F2,A3,C4,F4|A2,A3,C4,F4|Bb2,Bb3,D4,F4|D3,Bb3,D4,F4|C2,C4,E4,G4|B2,C4,E4,G4|C3,C4,E4,G4|E3,C4,E4,G4|F2,A3,C4,F4">MI walking + MD bloque: I → IV → V → I</button>
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Método de estudio para un himno nuevo</h3>
                    <p>Sigue estos 7 pasos en orden para aprender cualquier himno:</p>
                    <table class="ref-table">
                        <tr><th>Paso</th><th>Qué hacer</th><th>Por qué</th></tr>
                        <tr><td>1</td><td>Cantar o tocar solo la melodía (soprano)</td><td>Internalizar la línea melódica</td></tr>
                        <tr><td>2</td><td>Tocar solo el bajo (línea inferior)</td><td>Entender el movimiento armónico</td></tr>
                        <tr><td>3</td><td>Identificar acordes compás por compás</td><td>Cifrar con números romanos</td></tr>
                        <tr><td>4</td><td>MI sola con el patrón elegido</td><td>Automatizar el fundamento</td></tr>
                        <tr><td>5</td><td>MD sola con voicings</td><td>Dominar los cambios de acorde</td></tr>
                        <tr><td>6</td><td>Manos juntas — tempo lento</td><td>Coordinar ambas manos</td></tr>
                        <tr><td>7</td><td>Subir tempo gradualmente</td><td>Llegar al tempo de congregación</td></tr>
                    </table>
                    <div class="edu-concept">
                        <strong>Consejo:</strong> El tempo congregacional típico es ♩ = 90-110 para himnos en 4/4. No toques demasiado rápido — la congregación necesita tiempo para respirar entre frases.
                    </div>
                </div>

                <div class="lesson-section">
                    <h3>Ejemplo aplicado: Himno 138 — "El corazón de los padres"</h3>
                    <p>Analicemos este himno del Himnario IDDAM (Ross Jutsum):</p>
                    <ul>
                        <li><strong>Tonalidad:</strong> Fa mayor (armadura: 1 bemol — Bb)</li>
                        <li><strong>Compás:</strong> 4/4</li>
                        <li><strong>Carácter:</strong> Solemne, moderado</li>
                    </ul>

                    <div class="edu-concept">
                        <strong>Análisis armónico (primeros compases típicos):</strong> Muchos himnos en Fa mayor usan las progresiones I - IV - V - I y I - vi - IV - V. Veamos cómo suenan con distintos patrones de MI.
                    </div>

                    <div class="lesson-example">
                        <h4>Progresión I - IV - V - I en Fa mayor</h4>
                        <button class="example-btn" data-play-notes="F3,A3,C4|Bb3,D4,F4|C3,E4,G4|F3,A3,C4">Acordes: I - IV - V - I</button>
                    </div>

                    <div class="lesson-example">
                        <h4>MI con bajo 1-5 + MD en bloque (I - IV - V - I)</h4>
                        <button class="example-btn" data-play-notes="F2,A3,C4,F4|C3,A3,C4,F4|Bb2,Bb3,D4,F4|F3,Bb3,D4,F4|C2,C4,E4,G4|G2,C4,E4,G4|F2,A3,C4,F4|C3,A3,C4,F4">MI 1-5 + MD bloque (I-IV-V-I)</button>
                    </div>

                    <div class="lesson-example">
                        <h4>MI con bajo octavado + MD en bloque (I - vi - IV - V)</h4>
                        <button class="example-btn" data-play-notes="F2,A3,C4,F4|F3,A3,C4,F4|D2,D3,F3,A3|D3,D3,F3,A3|Bb2,Bb3,D4,F4|Bb3,Bb3,D4,F4|C2,C4,E4,G4|C3,C4,E4,G4">MI octavado + MD bloque (I-vi-IV-V)</button>
                    </div>

                    <div class="lesson-example">
                        <h4>Cambio rápido: I - vii° - I - IV en Fa mayor</h4>
                        <button class="example-btn" data-play-notes="F2,F4,A4,C5|E2,E4,G4,Bb4|F2,F4,A4,C5|Bb2,F4,Bb4,D5">I - vii° - I - IV (un acorde por tiempo)</button>
                    </div>

                    <p><strong>Practica así:</strong></p>
                    <ol>
                        <li>Toca la melodía del himno 138 con la mano derecha sola (línea de soprano).</li>
                        <li>Toca el bajo solo con la mano izquierda (línea inferior del SATB).</li>
                        <li>Cifra los acordes: mira qué notas suenan en cada tiempo y ponles número romano.</li>
                        <li>Elige un patrón de MI (empieza con bajo simple o 1-5) y practícalo.</li>
                        <li>Agrega la MD con bloques. Cuando domines eso, prueba melodía + relleno.</li>
                    </ol>
                </div>
            `,
            quiz: {
                question: '¿Cuál es la mejor estrategia cuando un himno tiene un acorde diferente en cada tiempo del compás?',
                options: [
                    'Tocar todos los acordes arpegiados rápidamente',
                    'Usar voice leading (mínimo movimiento) e inversiones para mantener notas comunes',
                    'Ignorar algunos acordes y tocar solo el primero del compás',
                    'Tocar solo la melodía sin armonía'
                ],
                correct: 1,
            }
        },
    ];

    let completedLessons = new Set();

    function init() {
        loadProgress();
        renderNav();
        setupExampleButtons();
    }

    function loadProgress() {
        try {
            const saved = localStorage.getItem('musihacks_theory_progress');
            if (saved) completedLessons = new Set(JSON.parse(saved));
        } catch (e) { /* ignore */ }
    }

    function saveProgress() {
        localStorage.setItem('musihacks_theory_progress', JSON.stringify([...completedLessons]));
    }

    function renderNav() {
        const nav = document.getElementById('theory-lessons-nav');
        if (!nav) return;
        nav.innerHTML = '';

        for (const lesson of lessons) {
            const btn = document.createElement('button');
            btn.className = 'theory-lesson-btn';
            if (completedLessons.has(lesson.id)) btn.classList.add('completed');
            btn.textContent = lesson.title;
            btn.addEventListener('click', () => showLesson(lesson));
            nav.appendChild(btn);
        }
    }

    function showLesson(lesson) {
        const content = document.getElementById('theory-content');
        if (!content) return;

        // Update nav
        document.querySelectorAll('.theory-lesson-btn').forEach((btn, i) => {
            btn.classList.toggle('active', lessons[i].id === lesson.id);
        });

        let html = `<h2>${lesson.title}</h2>${lesson.content}`;

        // Quiz
        if (lesson.quiz) {
            html += `
                <div class="quiz-section">
                    <h4>Quiz rápido</h4>
                    <p>${lesson.quiz.question}</p>
                    <div class="quiz-options" data-correct="${lesson.quiz.correct}" data-lesson="${lesson.id}">
                        ${lesson.quiz.options.map((opt, i) =>
                            `<button class="quiz-option" data-index="${i}">${opt}</button>`
                        ).join('')}
                    </div>
                    <div class="quiz-feedback"></div>
                </div>
            `;
        }

        content.innerHTML = html;
        setupExampleButtons();
        setupQuiz();
    }

    function setupExampleButtons() {
        // Play notes buttons
        document.querySelectorAll('[data-play-notes]').forEach(btn => {
            btn.removeEventListener('click', btn._handler);
            btn._handler = () => playNoteSequence(btn.dataset.playNotes);
            btn.addEventListener('click', btn._handler);
        });

        // Play chord buttons
        document.querySelectorAll('[data-play-chord]').forEach(btn => {
            btn.removeEventListener('click', btn._handler);
            btn._handler = () => {
                const parts = btn.dataset.playChord.split(',');
                playChordExample(parts[0], parts[1], parseInt(parts[2]) || 0);
            };
            btn.addEventListener('click', btn._handler);
        });

        // Play scale buttons
        document.querySelectorAll('[data-play-scale]').forEach(btn => {
            btn.removeEventListener('click', btn._handler);
            btn._handler = () => {
                const [root, type] = btn.dataset.playScale.split(',');
                playScaleExample(root, type);
            };
            btn.addEventListener('click', btn._handler);
        });
    }

    function setupQuiz() {
        document.querySelectorAll('.quiz-options').forEach(container => {
            const correct = parseInt(container.dataset.correct);
            const lessonId = container.dataset.lesson;

            container.querySelectorAll('.quiz-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    const feedback = container.parentElement.querySelector('.quiz-feedback');

                    // Disable all options
                    container.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);

                    if (index === correct) {
                        btn.classList.add('correct');
                        feedback.textContent = 'Correcto!';
                        feedback.style.color = 'var(--tonic)';
                        completedLessons.add(lessonId);
                        saveProgress();
                        renderNav();
                    } else {
                        btn.classList.add('wrong');
                        container.querySelectorAll('.quiz-option')[correct].classList.add('correct');
                        feedback.textContent = 'Incorrecto. La respuesta correcta está marcada en verde.';
                        feedback.style.color = 'var(--dominant)';
                    }
                });
            });
        });
    }

    async function playNoteSequence(notesStr) {
        if (Tone.context.state !== 'running') await Tone.start();

        // Support chord groups separated by |
        const groups = notesStr.split('|');
        const bt = 0.5;
        const now = Tone.now();

        for (let g = 0; g < groups.length; g++) {
            const notes = groups[g].split(',').map(n => n.trim());
            for (const note of notes) {
                Piano.playNote(note, bt * 0.9, now + g * bt, 0.7);
            }
        }
    }

    async function playChordExample(root, type, inversion = 0) {
        try {
            let url = `/api/chords/${encodeURIComponent(root)}/${encodeURIComponent(type)}`;
            if (inversion > 0) url += `?inversion=${inversion}`;
            const resp = await fetch(url);
            const data = await resp.json();

            if (data.notes) {
                const noteNames = buildChordNoteNames(data.notes, 4);
                for (const n of noteNames) {
                    Piano.playNote(n, 1.5, null, 0.7);
                }
            }
        } catch (e) {
            console.warn('Could not play chord:', e);
        }
    }

    async function playScaleExample(root, type) {
        try {
            const resp = await fetch(`/api/scales/${encodeURIComponent(root)}/${encodeURIComponent(type)}`);
            const data = await resp.json();

            if (data.notes) {
                const now = Tone.now();
                let octave = 4;
                let prevPC = -1;

                for (let i = 0; i < data.notes.length; i++) {
                    const pc = Piano.noteToPC(data.notes[i]);
                    if (prevPC >= 0 && pc <= prevPC) octave++;
                    Piano.playNote(data.notes[i] + octave, 0.35, now + i * 0.35, 0.65);
                    prevPC = pc;
                }
                // Play octave note at end
                Piano.playNote(data.notes[0] + octave, 0.5, now + data.notes.length * 0.35, 0.7);

                // Show scale on piano (single octave)
                Piano.highlightScale(root, data.notes);
            }
        } catch (e) {
            console.warn('Could not play scale:', e);
        }
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

    return { init, showLesson, lessons };
})();
