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
                    <h3>Contexto histórico</h3>
                    <p>El sistema de siete notas que usamos hoy tiene sus raíces en la <strong>Antigua Grecia</strong>, donde Pitágoras descubrió las relaciones matemáticas entre los sonidos. En el siglo XI, el monje benedictino <strong>Guido d'Arezzo</strong> creó el sistema de solmización (Do-Re-Mi) basándose en un himno a San Juan Bautista.</p>
                    <div class="theory-citation">
                        <p>"El sistema tonal occidental se fundamenta en una colección de siete notas diatónicas, organizadas en patrones de tonos y semitonos que definen las escalas mayor y menor."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 1</span>
                    </div>
                </div>
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
                    <div class="theory-citation">
                        <p>"Las notas musicales son la materia prima de la música. Cada nota tiene una frecuencia específica de vibración, y la relación entre frecuencias determina los intervalos."</p>
                        <span class="theory-citation-source">— Laitz, <em>The Complete Musician</em>, Cap. 1</span>
                    </div>
                    <div class="lesson-example">
                        <h4>Escucha las notas naturales (octava 4)</h4>
                        <button class="example-btn" data-play-notes="C4,D4,E4,F4,G4,A4,B4,C5">Tocar escala de Do</button>
                        <button class="example-btn" data-play-notes="C4">Solo Do (C)</button>
                        <button class="example-btn" data-play-notes="A4">La 440 Hz (referencia universal)</button>
                        <button class="example-btn" data-play-notes="C3,C4,C5">Do en 3 octavas</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>La octava</h3>
                    <p>Cuando una nota se repite a doble frecuencia, decimos que está una <strong>octava</strong> más arriba. La palabra "octava" viene del latín <em>octavus</em> (octavo), porque es la 8va nota al recorrer las 7 notas naturales.</p>
                    <div class="theory-citation">
                        <p>"La octava es el intervalo más consonante después del unísono. Dos notas separadas por una octava suenan 'iguales' porque la frecuencia de la nota superior es exactamente el doble de la inferior."</p>
                        <span class="theory-citation-source">— Aldwell & Schachter, <em>Armonía y Conducción de Voces</em>, Cap. 1</span>
                    </div>
                    <div class="lesson-example">
                        <h4>Escucha la misma nota en diferentes octavas</h4>
                        <button class="example-btn" data-play-notes="C2,C3,C4,C5">Do en 4 octavas</button>
                        <button class="example-btn" data-play-notes="A2,A3,A4,A5">La en 4 octavas</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca las 7 notas naturales de izquierda a derecha en el piano, primero lento y luego más rápido.</li>
                        <li>Intenta tocar Do-Re-Mi-Fa-Sol-La-Si-Do con los dedos 1-2-3-1-2-3-4-5 de la mano derecha.</li>
                        <li>Localiza todas las notas "Do" (C) en el teclado — son las teclas blancas inmediatamente a la izquierda del grupo de 2 teclas negras.</li>
                    </ul>
                </div>
                <div class="lesson-section">
                    <h3>En canciones reales</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Do-Re-Mi" - The Sound of Music</div>
                            <div class="song-example-artist">La escala de Do mayor como melodía</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C4,D4,E4,F4,G4,A4,B4,C5">Escala ascendente</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Twinkle Twinkle Little Star"</div>
                            <div class="song-example-artist">Solo usa notas naturales en C mayor</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C4,C4,G4,G4,A4,A4,G4|F4,F4,E4,E4,D4,D4,C4">Melodía</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuál es la nota "G" en el sistema español?',
                    options: ['Fa', 'Sol', 'La', 'Si'],
                    correct: 1,
                },
                {
                    question: '¿Cuántas notas naturales existen en la música occidental?',
                    options: ['5', '6', '7', '12'],
                    correct: 2,
                },
                {
                    question: '¿Qué ocurre cuando una nota se repite a doble frecuencia?',
                    options: ['Suena un semitono más aguda', 'Suena una octava más aguda', 'Suena un tono más grave', 'No cambia'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'sharps-flats',
            title: '2. Sostenidos y bemoles',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>Los sostenidos y bemoles surgieron gradualmente en la música medieval. El primer "accidente" reconocido fue el <strong>Si bemol (Bb)</strong>, usado para evitar el intervalo de tritono (Si-Fa), considerado "el diablo en la música" (<em>diabolus in musica</em>) por los teóricos medievales.</p>
                    <div class="theory-citation">
                        <p>"Las alteraciones cromáticas — sostenidos, bemoles y becuadros — expanden el vocabulario de siete notas diatónicas a doce notas cromáticas, proporcionando la base para toda la armonía occidental."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 1</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Las teclas negras</h3>
                    <p>Entre la mayoría de las notas naturales hay <strong>teclas negras</strong> que representan notas alteradas:</p>
                    <ul>
                        <li><strong>Sostenido (#)</strong>: sube la nota medio tono. Ej: C# está entre C y D.</li>
                        <li><strong>Bemol (b)</strong>: baja la nota medio tono. Ej: Db está entre C y D.</li>
                        <li><strong>Becuadro (♮)</strong>: cancela un sostenido o bemol previo.</li>
                    </ul>
                    <p><strong>C# y Db son la misma tecla</strong> (enarmónicos). El nombre depende del contexto armónico.</p>
                    <p>Nota: entre <strong>Mi-Fa</strong> y <strong>Si-Do</strong> NO hay tecla negra (solo hay medio tono natural).</p>
                    <div class="theory-citation">
                        <p>"La enarmonía — el fenómeno de que una misma altura tenga dos nombres posibles — es una consecuencia del temperamento igual, que divide la octava en doce partes iguales."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 1</span>
                    </div>
                    <div class="lesson-example">
                        <h4>Escucha la escala cromática (todos los semitonos)</h4>
                        <button class="example-btn" data-play-notes="C4,C#4,D4,D#4,E4,F4,F#4,G4,G#4,A4,A#4,B4,C5">Escala cromática ascendente</button>
                        <button class="example-btn" data-play-notes="C5,B4,A#4,A4,G#4,G4,F#4,F4,E4,D#4,D4,C#4,C4">Escala cromática descendente</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Las 12 notas cromáticas</h3>
                    <p>En total existen <strong>12 notas distintas</strong> dentro de una octava (7 naturales + 5 alteradas). Estas 12 notas forman la base de toda la música occidental.</p>
                    <div class="lesson-example">
                        <h4>Escucha los 5 sostenidos (teclas negras)</h4>
                        <button class="example-btn" data-play-notes="C#4,D#4,F#4,G#4,A#4">Las 5 teclas negras</button>
                        <button class="example-btn" data-play-notes="C4,C#4">C y C# (semitono)</button>
                        <button class="example-btn" data-play-notes="E4,F4">E y F (semitono natural)</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Localiza los grupos de 2 y 3 teclas negras en el piano. Los grupos de 2 están entre C-D-E, los de 3 entre F-G-A-B.</li>
                        <li>Toca la escala cromática ascendente desde Do hasta Do (12 notas + la octava).</li>
                        <li>Practica nombrando cada tecla negra con su nombre sostenido Y bemol: C#/Db, D#/Eb, F#/Gb, G#/Ab, A#/Bb.</li>
                    </ul>
                </div>
                <div class="lesson-section">
                    <h3>En canciones reales</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Flight of the Bumblebee" - Rimsky-Korsakov</div>
                            <div class="song-example-artist">Movimiento cromático rápido (semitonos consecutivos)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="E5,D#5,D5,C#5,C5,B4,A#4,A4,G#4">Fragmento cromático descendente</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Pink Panther Theme" - Henry Mancini</div>
                            <div class="song-example-artist">Uso icónico de semitonos cromáticos</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C#4,D4,E4,F4,C#4,D4,F4,E4">Tema principal (cromático)</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Entre qué notas NO hay tecla negra (semitono natural)?',
                    options: ['Do-Re y Sol-La', 'Mi-Fa y Si-Do', 'Re-Mi y La-Si', 'Fa-Sol y Do-Re'],
                    correct: 1,
                },
                {
                    question: '¿Cuántas notas distintas existen dentro de una octava?',
                    options: ['7', '10', '12', '14'],
                    correct: 2,
                },
                {
                    question: '¿Qué significa que C# y Db sean "enarmónicos"?',
                    options: ['Son notas diferentes', 'Suenan distinto pero se escriben igual', 'Son la misma tecla/frecuencia con diferente nombre', 'Solo existen en piano'],
                    correct: 2,
                }
            ]
        },
        {
            id: 'english-notes',
            title: '3. Notas en inglés',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>El sistema de letras (A-B-C-D-E-F-G) es más antiguo que el sistema de solmización (Do-Re-Mi). Data del <strong>siglo VI</strong> con Boecio, quien adoptó las letras latinas. El sistema de sílabas de Guido d'Arezzo (siglo XI) se extendió en países latinos, mientras los germánicos y anglosajones mantuvieron las letras.</p>
                    <div class="theory-citation">
                        <p>"En la notación internacional, las notas se identifican por letras del alfabeto, comenzando desde A (La). Este sistema es universalmente usado en cifrados de acordes, análisis armónico y comunicación musical profesional."</p>
                        <span class="theory-citation-source">— Laitz, <em>The Complete Musician</em>, Cap. 1</span>
                    </div>
                </div>
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
                    <div class="theory-citation">
                        <p>"La nota La (A4 = 440 Hz) fue adoptada como estándar internacional de afinación en la Conferencia Internacional de Londres de 1939, y ratificada por la ISO en 1975."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Apéndice</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Notación con octavas</h3>
                    <p>Para identificar exactamente qué nota es, añadimos un <strong>número de octava</strong>: C4 es el Do central del piano, A4 es el La 440 Hz, C5 es el Do una octava arriba del central.</p>
                    <div class="lesson-example">
                        <h4>Escucha la diferencia entre octavas</h4>
                        <button class="example-btn" data-play-notes="C3">C3 (grave)</button>
                        <button class="example-btn" data-play-notes="C4">C4 (Do central)</button>
                        <button class="example-btn" data-play-notes="C5">C5 (agudo)</button>
                        <button class="example-btn" data-play-notes="A3">A3</button>
                        <button class="example-btn" data-play-notes="A4">A4 (440 Hz)</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Practica diciendo las notas en inglés mientras las tocas: "C, D, E, F, G, A, B".</li>
                        <li>Asocia cada letra con su posición en el teclado hasta que sea automático.</li>
                        <li>Lee un cifrado de canción (ej: C - Am - F - G) e identifica cada nota raíz en el teclado.</li>
                    </ul>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Qué nota es "E" en español?',
                    options: ['Re', 'Mi', 'Fa', 'La'],
                    correct: 1,
                },
                {
                    question: '¿Por qué la serie de letras comienza en A y no en C?',
                    options: ['Porque A es la nota más grave', 'Porque La (A) es la nota de referencia universal 440 Hz', 'Porque es la primera letra del alfabeto solamente', 'Porque la escala menor empieza en A'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'semitone-tone',
            title: '4. El semitono y el tono',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>El concepto de <strong>temperamento igual</strong> — dividir la octava en 12 semitonos exactamente iguales — fue propuesto por matemáticos chinos y europeos desde el siglo XVI, pero no se popularizó hasta el siglo XVIII. El "Clave bien temperado" de <strong>J.S. Bach</strong> (1722) demostró las posibilidades de un teclado afinado en temperamento igual al componer en las 24 tonalidades.</p>
                    <div class="theory-citation">
                        <p>"El semitono es la unidad fundamental de medida interválica en el sistema de temperamento igual. Todos los intervalos pueden expresarse como un número exacto de semitonos."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 1</span>
                    </div>
                </div>
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
                    <div class="theory-citation">
                        <p>"La diferencia entre semitonos cromáticos (C-C#) y diatónicos (E-F) es esencial para comprender la construcción de escalas y la lógica de las armaduras de clave."</p>
                        <span class="theory-citation-source">— Aldwell & Schachter, <em>Armonía y Conducción de Voces</em>, Cap. 1</span>
                    </div>
                    <div class="lesson-example">
                        <h4>Escucha la diferencia</h4>
                        <button class="example-btn" data-play-notes="C4,C#4">Semitono cromático: C → C#</button>
                        <button class="example-btn" data-play-notes="E4,F4">Semitono diatónico: E → F</button>
                        <button class="example-btn" data-play-notes="C4,D4">Tono: C → D</button>
                        <button class="example-btn" data-play-notes="F4,G4">Tono: F → G</button>
                        <button class="example-btn" data-play-notes="B3,C4">Semitono natural: B → C</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Intervalos básicos en semitonos</h3>
                    <p>Todo intervalo se puede medir en semitonos:</p>
                    <table class="ref-table" style="max-width:400px">
                        <tr><th>Intervalo</th><th>Semitonos</th><th>Ejemplo</th></tr>
                        <tr><td>Unísono</td><td>0</td><td>C → C</td></tr>
                        <tr><td>2da menor</td><td>1</td><td>C → Db</td></tr>
                        <tr><td>2da mayor</td><td>2</td><td>C → D</td></tr>
                        <tr><td>3ra menor</td><td>3</td><td>C → Eb</td></tr>
                        <tr><td>3ra mayor</td><td>4</td><td>C → E</td></tr>
                        <tr><td>4ta justa</td><td>5</td><td>C → F</td></tr>
                        <tr><td>5ta justa</td><td>7</td><td>C → G</td></tr>
                        <tr><td>Octava</td><td>12</td><td>C → C</td></tr>
                    </table>
                    <div class="lesson-example">
                        <h4>Escucha intervalos clave</h4>
                        <button class="example-btn" data-play-notes="C4,Eb4">3ra menor (3 ST)</button>
                        <button class="example-btn" data-play-notes="C4,E4">3ra mayor (4 ST)</button>
                        <button class="example-btn" data-play-notes="C4,G4">5ta justa (7 ST)</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Cuenta los semitonos entre C y F (respuesta: 5 — C, C#, D, D#, E, F).</li>
                        <li>Cuenta los semitonos entre D y A (respuesta: 7).</li>
                        <li>Practica subir y bajar semitonos desde cualquier tecla.</li>
                    </ul>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuántos semitonos hay en un tono?',
                    options: ['1', '2', '3', '4'],
                    correct: 1,
                },
                {
                    question: '¿Cuántos semitonos hay de C a G (5ta justa)?',
                    options: ['5', '6', '7', '8'],
                    correct: 2,
                },
                {
                    question: '¿Qué tipo de semitono hay entre E y F?',
                    options: ['Cromático', 'Diatónico (natural)', 'Aumentado', 'No hay semitono entre E y F'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'scales',
            title: '5. Escalas',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>Las escalas mayor y menor tal como las conocemos se consolidaron en el periodo <strong>Barroco</strong> (siglos XVII-XVIII). Antes, la música se organizaba en <strong>modos eclesiásticos</strong> (Dórico, Frigio, etc.). La escala mayor (modo Jónico) y la menor (modo Eólico) se impusieron por su capacidad de crear relaciones armónicas fuertes entre tónica, subdominante y dominante.</p>
                    <div class="theory-citation">
                        <p>"Una escala es una abstracción. No es música en sí misma, sino la colección de alturas de las que se deriva una composición. La escala mayor y la menor son las dos colecciones fundamentales de la música tonal."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 1</span>
                    </div>
                </div>
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
                    <div class="theory-citation">
                        <p>"La escala mayor es el referente central de la tonalidad. Todos los acordes diatónicos, funciones armónicas y relaciones interválicas se derivan de ella."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 1</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>La escala menor natural</h3>
                    <p>Patrón: <strong>T - ST - T - T - ST - T - T</strong></p>
                    <p>Ejemplo en La menor: A B C D E F G A</p>
                    <p>La menor natural y Do mayor comparten las mismas notas — se llaman <strong>relativas</strong>. Cada tonalidad mayor tiene su relativa menor (una 3ra menor abajo).</p>
                    <div class="theory-citation">
                        <p>"La relación entre una tonalidad mayor y su relativa menor es uno de los conceptos más importantes de la música tonal. Comparten la misma armadura de clave pero tienen centros tonales diferentes."</p>
                        <span class="theory-citation-source">— Laitz, <em>The Complete Musician</em>, Cap. 3</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Otras escalas importantes</h3>
                    <ul>
                        <li><strong>Pentatónica mayor</strong>: 5 notas (sin 4ta ni 7ma). Sonido folk, asiático, rock.</li>
                        <li><strong>Pentatónica menor</strong>: 5 notas. La escala del blues y el rock.</li>
                        <li><strong>Blues</strong>: Pentatónica menor + blue note (b5). Sonido con "grit".</li>
                        <li><strong>Menor armónica</strong>: Menor natural con 7ma mayor. Sonido "exótico".</li>
                        <li><strong>Menor melódica</strong>: Menor con 6ta y 7ma mayores ascendiendo.</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>Compara todas las escalas</h4>
                        <button class="example-btn" data-play-scale="C,major">Do Mayor</button>
                        <button class="example-btn" data-play-scale="A,natural_minor">La menor natural</button>
                        <button class="example-btn" data-play-scale="A,harmonic_minor">La menor armónica</button>
                        <button class="example-btn" data-play-scale="A,melodic_minor">La menor melódica</button>
                        <button class="example-btn" data-play-scale="C,pentatonic_major">Pentatónica mayor</button>
                        <button class="example-btn" data-play-scale="A,pentatonic_minor">Pentatónica menor</button>
                        <button class="example-btn" data-play-scale="C,blues">Blues</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca la escala mayor en C, G y F. Verifica el patrón T-T-ST-T-T-T-ST en cada una.</li>
                        <li>Toca La menor natural y compara con Do mayor: son las mismas notas pero empezando en notas diferentes.</li>
                        <li>Toca la pentatónica menor de A (A, C, D, E, G) e improvisa una melodía simple sobre ella.</li>
                    </ul>
                </div>
                <div class="lesson-section">
                    <h3>En canciones reales</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"My Girl" - The Temptations</div>
                            <div class="song-example-artist">Pentatónica mayor de C: C D E G A</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C4,D4,E4,G4,A4,C5">Pentatónica mayor C</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Stairway to Heaven" - Led Zeppelin</div>
                            <div class="song-example-artist">La menor natural con cromatismo</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-scale="A,natural_minor">La menor</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Crossroads" - Cream / Robert Johnson</div>
                            <div class="song-example-artist">Escala de blues</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-scale="A,blues">Blues en A</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuál es el patrón de la escala mayor?',
                    options: ['T-ST-T-T-ST-T-T', 'T-T-ST-T-T-T-ST', 'T-T-T-ST-T-T-ST', 'ST-T-T-T-ST-T-T'],
                    correct: 1,
                },
                {
                    question: '¿Cuál es la relativa menor de Do mayor?',
                    options: ['Mi menor', 'Re menor', 'La menor', 'Sol menor'],
                    correct: 2,
                },
                {
                    question: '¿Cuántas notas tiene la escala pentatónica?',
                    options: ['4', '5', '6', '7'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'triads',
            title: '6. Acordes de 3 notas',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>La tríada es la unidad básica de la armonía occidental desde el <strong>Renacimiento</strong>. Antes del siglo XV, la música europea se basaba en intervalos de quintas y octavas (organum). Fue con compositores como <strong>Josquin des Prez</strong> y la polifonía renacentista que la tríada — tres notas apiladas en terceras — se convirtió en el fundamento de la armonía.</p>
                    <p>Jean-Philippe <strong>Rameau</strong>, en su <em>Traité de l'harmonie</em> (1722), fue el primero en teorizar que toda la armonía se deriva de la tríada y sus inversiones, sentando las bases de la armonía funcional que usamos hasta hoy.</p>
                    <div class="theory-citation">
                        <p>"La tríada es la unidad básica de la armonía tonal. Todas las estructuras armónicas más complejas — acordes de séptima, novena, etc. — son extensiones de la tríada fundamental."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 3</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Las tríadas</h3>
                    <p>Un acorde de 3 notas (tríada) se forma apilando <strong>terceras</strong>:</p>
                    <ul>
                        <li><strong>Mayor</strong>: 4 + 3 semitonos → Ej: C E G (suena alegre, estable)</li>
                        <li><strong>Menor</strong>: 3 + 4 semitonos → Ej: C Eb G (suena triste, melancólico)</li>
                        <li><strong>Aumentado</strong>: 4 + 4 semitonos → Ej: C E G# (suena misterioso, inestable)</li>
                        <li><strong>Disminuido</strong>: 3 + 3 semitonos → Ej: C Eb Gb (suena tenso, pide resolución)</li>
                    </ul>
                    <div class="theory-citation">
                        <p>"Cada tipo de tríada tiene una calidad sonora distintiva. La tríada mayor transmite estabilidad y luminosidad; la menor, introspección y seriedad; la aumentada, tensión suspensiva; y la disminuida, una tensión que exige resolución."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 3</span>
                    </div>
                    <div class="lesson-example">
                        <h4>Escucha cada tipo</h4>
                        <button class="example-btn" data-play-chord="C,major">C Mayor</button>
                        <button class="example-btn" data-play-chord="C,minor">C menor</button>
                        <button class="example-btn" data-play-chord="C,augmented">C aumentado</button>
                        <button class="example-btn" data-play-chord="C,diminished">C disminuido</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Compara mayor vs menor en distintas raíces</h4>
                        <button class="example-btn" data-play-chord="G,major">G Mayor</button>
                        <button class="example-btn" data-play-chord="G,minor">G menor</button>
                        <button class="example-btn" data-play-chord="F,major">F Mayor</button>
                        <button class="example-btn" data-play-chord="F,minor">F menor</button>
                        <button class="example-btn" data-play-chord="D,major">D Mayor</button>
                        <button class="example-btn" data-play-chord="D,minor">D menor</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Construcción de tríadas desde cualquier nota</h3>
                    <p>Para construir una tríada, cuenta semitonos desde la raíz:</p>
                    <table class="ref-table" style="max-width:500px">
                        <tr><th>Tipo</th><th>3ra (desde raíz)</th><th>5ta (desde raíz)</th><th>Fórmula</th></tr>
                        <tr><td>Mayor</td><td>4 semitonos</td><td>7 semitonos</td><td>1 - 3 - 5</td></tr>
                        <tr><td>Menor</td><td>3 semitonos</td><td>7 semitonos</td><td>1 - b3 - 5</td></tr>
                        <tr><td>Aumentado</td><td>4 semitonos</td><td>8 semitonos</td><td>1 - 3 - #5</td></tr>
                        <tr><td>Disminuido</td><td>3 semitonos</td><td>6 semitonos</td><td>1 - b3 - b5</td></tr>
                    </table>
                    <div class="theory-citation">
                        <p>"La diferencia entre una tríada mayor y una menor reside en un solo semitono: la tercera. Este pequeño cambio transforma radicalmente el carácter expresivo del acorde."</p>
                        <span class="theory-citation-source">— Aldwell & Schachter, <em>Armonía y Conducción de Voces</em>, Cap. 4</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Construye las 4 tríadas (mayor, menor, aumentada, disminuida) empezando desde C, luego desde G y F.</li>
                        <li>Toca una tríada mayor y luego baja la tercera medio tono para convertirla en menor. Repite en todas las notas.</li>
                        <li>Escucha un acorde y determina si es mayor o menor antes de ver la respuesta. Entrena tu oído.</li>
                        <li>Toca C mayor, luego F mayor, luego G mayor. Estas son las tríadas I, IV y V de Do mayor.</li>
                    </ul>
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
                        <div class="song-example">
                            <div class="song-example-name">"House of the Rising Sun" - The Animals</div>
                            <div class="song-example-artist">Am - C - D - F (tríadas menores y mayores alternadas)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="A3,C4,E4|C3,E4,G4|D3,F#3,A3|F3,A3,C4">Escuchar progresión</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Creep" - Radiohead</div>
                            <div class="song-example-artist">G - B - C - Cm (Mayor → Mayor → Mayor → menor)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="G3,B3,D4|B3,D#4,F#4|C3,E4,G4|C3,Eb4,G4">Escuchar (nota el cambio C → Cm)</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuál es la fórmula del acorde menor en semitonos?',
                    options: ['4 + 3', '3 + 4', '4 + 4', '3 + 3'],
                    correct: 1,
                },
                {
                    question: '¿Qué tipo de tríada se forma con 4 + 4 semitonos?',
                    options: ['Mayor', 'Menor', 'Aumentada', 'Disminuida'],
                    correct: 2,
                },
                {
                    question: '¿Cuántos semitonos hay entre la raíz y la quinta justa de una tríada mayor?',
                    options: ['5', '6', '7', '8'],
                    correct: 2,
                }
            ]
        },
        {
            id: 'inversions',
            title: '7. Inversiones',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>El concepto de inversión fue formalizado por <strong>Jean-Philippe Rameau</strong> en 1722. Antes de Rameau, cada disposición de notas se consideraba un acorde diferente. Rameau revolucionó la teoría al demostrar que C-E-G, E-G-C y G-C-E son el <strong>mismo acorde</strong> en diferentes posiciones.</p>
                    <div class="theory-citation">
                        <p>"Rameau estableció el principio fundamental de que un acorde mantiene su identidad independientemente de la disposición de sus notas. La raíz del acorde permanece constante aunque no esté en el bajo."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 5</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>¿Qué es una inversión?</h3>
                    <p>Una inversión cambia qué nota está en el bajo (la más grave):</p>
                    <ul>
                        <li><strong>Estado fundamental</strong>: la raíz está en el bajo → C E G</li>
                        <li><strong>1a inversión</strong>: la 3era está en el bajo → E G C</li>
                        <li><strong>2a inversión</strong>: la 5ta está en el bajo → G C E</li>
                    </ul>
                    <p>El acorde sigue siendo "Do mayor" en cualquier inversión, pero el <strong>color sonoro cambia</strong>.</p>
                    <div class="theory-citation">
                        <p>"Las inversiones son herramientas esenciales para crear líneas de bajo melódicas y suavizar las progresiones armónicas. La primera inversión produce un sonido más ligero; la segunda inversión, más inestable, se reserva para situaciones específicas."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 6</span>
                    </div>
                    <div class="lesson-example">
                        <h4>Compara las inversiones de C mayor</h4>
                        <button class="example-btn" data-play-chord="C,major,0">Fundamental</button>
                        <button class="example-btn" data-play-chord="C,major,1">1a inversión</button>
                        <button class="example-btn" data-play-chord="C,major,2">2a inversión</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Inversiones de otros acordes</h4>
                        <button class="example-btn" data-play-chord="G,major,0">G fundamental</button>
                        <button class="example-btn" data-play-chord="G,major,1">G 1a inv.</button>
                        <button class="example-btn" data-play-chord="G,major,2">G 2a inv.</button>
                        <button class="example-btn" data-play-chord="A,minor,0">Am fundamental</button>
                        <button class="example-btn" data-play-chord="A,minor,1">Am 1a inv.</button>
                        <button class="example-btn" data-play-chord="A,minor,2">Am 2a inv.</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Cifrado de inversiones</h3>
                    <p>En el análisis clásico, las inversiones se indican con números derivados del <strong>bajo cifrado</strong> (bajo continuo barroco):</p>
                    <table class="ref-table" style="max-width:500px">
                        <tr><th>Posición</th><th>Cifrado</th><th>Ejemplo en C</th><th>Bajo</th></tr>
                        <tr><td>Fundamental</td><td>5/3 (o nada)</td><td>C</td><td>C (raíz)</td></tr>
                        <tr><td>1a inversión</td><td>6/3 (o solo 6)</td><td>C/E</td><td>E (3era)</td></tr>
                        <tr><td>2a inversión</td><td>6/4</td><td>C/G</td><td>G (5ta)</td></tr>
                    </table>
                    <div class="theory-citation">
                        <p>"La segunda inversión (6/4) es la más inestable de las tres posiciones y, en la práctica clásica, se reserva para situaciones específicas: el acorde cadencial 6/4, el 6/4 de paso y el 6/4 de pedal."</p>
                        <span class="theory-citation-source">— Aldwell & Schachter, <em>Armonía y Conducción de Voces</em>, Cap. 8</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Inversiones para mejorar el voice leading</h3>
                    <p>Las inversiones permiten que el bajo se mueva de forma suave en vez de saltar. Compara:</p>
                    <div class="lesson-example">
                        <h4>Sin inversiones (bajo salta)</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|F3,A3,C4|G3,B3,D4|C3,E4,G4">C - F - G - C (fundamental)</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Con inversiones (bajo fluye)</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|C3,F4,A4|B2,D4,G4|C3,E4,G4">C - F/C - G/B - C (bajo suave)</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca C mayor en sus 3 posiciones: fundamental, 1a inversión, 2a inversión. Repite en F y G.</li>
                        <li>Toca la progresión C - Am - F - G usando la 1a inversión de Am (C en el bajo) para suavizar el movimiento.</li>
                        <li>Practica la progresión C - F/C - G/B - C sintiendo cómo el bajo desciende por paso: C - C - B - C.</li>
                    </ul>
                </div>
                <div class="lesson-section">
                    <h3>En canciones reales</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Piano Man" - Billy Joel</div>
                            <div class="song-example-artist">Bajo cromático con inversiones: C - C/B - C/Bb - F/A</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C3,E4,G4|B2,E4,G4|Bb2,E4,G4|A2,C4,F4">Bajo descendente con inversiones</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"A Whiter Shade of Pale" - Procol Harum</div>
                            <div class="song-example-artist">Famoso bajo descendente usando inversiones</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C3,E4,G4|B2,E4,G4|A2,C4,E4|G2,C4,E4|F2,A3,C4|E2,G3,C4|D2,F3,A3|G2,B3,D4">C-C/B-Am-Am/G-F-F/E-Dm-G</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: 'En la 1a inversión de un acorde, ¿qué nota está en el bajo?',
                    options: ['La raíz', 'La 3era', 'La 5ta', 'La 7ma'],
                    correct: 1,
                },
                {
                    question: '¿Cuál es el cifrado clásico de la segunda inversión?',
                    options: ['5/3', '6/3', '6/4', '7'],
                    correct: 2,
                },
                {
                    question: '¿Por qué se usan inversiones en las progresiones?',
                    options: ['Para cambiar la tonalidad', 'Para crear líneas de bajo más suaves', 'Para hacer el acorde más fuerte', 'Para agregar notas nuevas'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'slash-chords',
            title: '8. Slash chords',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>La notación de slash chords es relativamente moderna — surgió en la música popular del siglo XX como una forma simplificada de indicar el bajo. En la música clásica, este concepto ya existía como <strong>bajo cifrado</strong> (basso continuo) desde el período Barroco, donde el tecladista improvisaba acordes sobre una línea de bajo escrita con números.</p>
                    <div class="theory-citation">
                        <p>"La nota del bajo es el factor más importante para determinar el efecto sonoro de un acorde. Cambiar el bajo transforma radicalmente la percepción del acorde, incluso cuando las notas superiores permanecen iguales."</p>
                        <span class="theory-citation-source">— Laitz, <em>The Complete Musician</em>, Cap. 7</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Acordes con bajo específico</h3>
                    <p>Un <strong>slash chord</strong> indica un acorde con una nota específica en el bajo, separada por "/":</p>
                    <ul>
                        <li><strong>C/E</strong> = Do mayor con Mi en el bajo (= 1a inversión)</li>
                        <li><strong>C/G</strong> = Do mayor con Sol en el bajo (= 2a inversión)</li>
                        <li><strong>C/Bb</strong> = Do mayor con Sib en el bajo (NO es inversión, es un bajo diferente)</li>
                    </ul>
                    <p>Los slash chords son muy útiles para crear <strong>líneas de bajo melódicas</strong>.</p>
                    <div class="theory-citation">
                        <p>"Los acordes con bajo alterado permiten al compositor crear líneas de bajo independientes del movimiento armónico, generando contrapunto entre el bajo y las voces superiores."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 11</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Tipos de slash chords</h3>
                    <p>Hay dos categorías fundamentales:</p>
                    <h4>1. Inversiones (el bajo es nota del acorde)</h4>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="E3,G4,C5">C/E (1a inversión)</button>
                        <button class="example-btn" data-play-notes="G3,C4,E4">C/G (2a inversión)</button>
                        <button class="example-btn" data-play-notes="A3,C4,F4">F/A (1a inversión de F)</button>
                    </div>
                    <h4>2. Bajo ajeno (el bajo NO es nota del acorde)</h4>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="Bb2,E4,G4">C/Bb (sonido dominante)</button>
                        <button class="example-btn" data-play-notes="D3,E4,G4">C/D (sonido suspendido)</button>
                        <button class="example-btn" data-play-notes="Ab2,E4,G4">C/Ab (sonido cromático)</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Líneas de bajo con slash chords</h3>
                    <div class="lesson-example">
                        <h4>Bajo descendente cromático</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|B2,E4,G4|Bb2,E4,G4|A2,E4,G4">C → C/B → C/Bb → C/A</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Bajo ascendente diatónico</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|D3,F4,A4|E3,G4,C5|F3,A4,C5">C → Dm/D → C/E → F</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Bajo de pedal (una nota constante)</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|C3,F4,A4|C3,D4,G4|C3,E4,G4">C → F/C → G/C → C (pedal en C)</button>
                    </div>
                    <div class="theory-citation">
                        <p>"El bajo cromático descendente — conocido como lamento — es uno de los dispositivos expresivos más antiguos de la música occidental, presente desde el Barroco hasta el pop contemporáneo."</p>
                        <span class="theory-citation-source">— Aldwell & Schachter, <em>Armonía y Conducción de Voces</em>, Cap. 19</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca la línea de bajo cromática descendente: C → C/B → Am → Am/G → F → F/E → Dm → G.</li>
                        <li>Experimenta poniendo la nota D como bajo bajo los acordes C, F y G. ¿Cómo cambia el sonido?</li>
                        <li>Toca Am/E (bajo en Mi). Compara el sonido con Am normal. ¿Cuál suena más estable?</li>
                    </ul>
                </div>
                <div class="lesson-section">
                    <h3>En canciones reales</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Stairway to Heaven" - Led Zeppelin</div>
                            <div class="song-example-artist">Am - Am/G# - C/G - D/F# (bajo cromático descendente)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="A3,C4,E4|G#3,C4,E4|G3,C4,E4|F#3,A3,D4">Intro: bajo cromático descendente</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Something" - Beatles</div>
                            <div class="song-example-artist">C - C/B - C/A - C/G - F (bajo descendente por escala)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C3,E4,G4|B2,E4,G4|A2,E4,G4|G2,E4,G4|F2,A3,C4">Bajo descendente diatónico</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Qué significa C/G?',
                    options: ['Do mayor o Sol mayor', 'Do mayor con Sol en el bajo', 'Sol mayor con Do en el bajo', 'Do sostenido mayor'],
                    correct: 1,
                },
                {
                    question: '¿Cuál es la diferencia entre C/E y C/Bb?',
                    options: ['No hay diferencia', 'C/E es inversión, C/Bb tiene bajo ajeno', 'C/Bb es inversión, C/E tiene bajo ajeno', 'Ambos son inversiones'],
                    correct: 1,
                },
                {
                    question: '¿Para qué se usan principalmente los slash chords?',
                    options: ['Para tocar más fuerte', 'Para crear líneas de bajo melódicas', 'Para cambiar de tonalidad', 'Para hacer acordes más simples'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'seventh-chords',
            title: '9. Acordes de 7ma',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>El uso de la <strong>séptima</strong> como parte integral del acorde fue una innovación gradual. En el período Barroco, <strong>Monteverdi</strong> fue criticado por usar séptimas sin preparación. Para el Clasicismo, el acorde de <strong>séptima de dominante</strong> (V7) se había vuelto esencial. El Romanticismo y el jazz expandieron el uso a todos los tipos de séptima.</p>
                    <div class="theory-citation">
                        <p>"El acorde de séptima de dominante es el acorde más importante de la armonía tonal después de la tríada. Su tritono interno — formado por la tercera y la séptima — crea la tensión que impulsa la resolución hacia la tónica."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 13</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Agregando la séptima</h3>
                    <p>Los acordes de séptima agregan una <strong>4ta nota</strong> a la tríada:</p>
                    <ul>
                        <li><strong>maj7</strong> (Mayor con 7ma mayor): 4+3+4 → Cmaj7 = C E G B (suena sofisticado, cálido)</li>
                        <li><strong>7</strong> (Dominante): 4+3+3 → C7 = C E G Bb (suena con tensión, quiere resolver)</li>
                        <li><strong>m7</strong> (Menor con 7ma menor): 3+4+3 → Cm7 = C Eb G Bb (suena jazzy, relajado)</li>
                        <li><strong>m7b5</strong> (Semidisminuido): 3+3+4 → Cm7b5 = C Eb Gb Bb (suena oscuro, inestable)</li>
                        <li><strong>dim7</strong> (Disminuido): 3+3+3 → Cdim7 = C Eb Gb A (simétrico, ambiguo)</li>
                    </ul>
                    <div class="theory-citation">
                        <p>"Los acordes de séptima representan la primera extensión de la tríada. La cualidad de la séptima — mayor o menor — combinada con la cualidad de la tríada subyacente produce cinco tipos distintos de acordes de séptima, cada uno con su propia función y color."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 13</span>
                    </div>
                    <div class="lesson-example">
                        <h4>Escucha la diferencia</h4>
                        <button class="example-btn" data-play-chord="C,major7">Cmaj7 (sofisticado)</button>
                        <button class="example-btn" data-play-chord="C,dominant7">C7 (tenso)</button>
                        <button class="example-btn" data-play-chord="C,minor7">Cm7 (jazzy)</button>
                        <button class="example-btn" data-play-chord="C,half_diminished7">Cm7b5 (oscuro)</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Séptimas en la tonalidad de Do mayor</h3>
                    <p>Cada grado de la escala genera un tipo específico de acorde de séptima:</p>
                    <table class="ref-table" style="max-width:500px">
                        <tr><th>Grado</th><th>Acorde</th><th>Tipo</th></tr>
                        <tr><td>I</td><td>Cmaj7</td><td>Mayor 7</td></tr>
                        <tr><td>ii</td><td>Dm7</td><td>Menor 7</td></tr>
                        <tr><td>iii</td><td>Em7</td><td>Menor 7</td></tr>
                        <tr><td>IV</td><td>Fmaj7</td><td>Mayor 7</td></tr>
                        <tr><td>V</td><td>G7</td><td>Dominante 7</td></tr>
                        <tr><td>vi</td><td>Am7</td><td>Menor 7</td></tr>
                        <tr><td>vii</td><td>Bm7b5</td><td>Semidisminuido</td></tr>
                    </table>
                    <div class="lesson-example">
                        <h4>Escucha todos los grados con séptima</h4>
                        <button class="example-btn" data-play-notes="C3,E3,G3,B3|D3,F3,A3,C4|E3,G3,B3,D4|F3,A3,C4,E4|G3,B3,D4,F4|A3,C4,E4,G4|B3,D4,F4,A4">Imaj7-ii7-iii7-IVmaj7-V7-vi7-viim7b5</button>
                    </div>
                    <div class="theory-citation">
                        <p>"En la música popular y el jazz, es habitual utilizar acordes de séptima en todos los grados de la escala, creando un sonido más rico que el que proporcionan las simples tríadas."</p>
                        <span class="theory-citation-source">— Laitz, <em>The Complete Musician</em>, Cap. 14</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Construye Cmaj7, C7, Cm7 y Cm7b5 desde la misma raíz. Nota qué notas cambian entre cada uno.</li>
                        <li>Toca los 7 acordes de séptima diatónicos de Do mayor subiendo por la escala.</li>
                        <li>Toca la progresión ii7 - V7 - Imaj7 (Dm7 - G7 - Cmaj7) en C, F y G mayor.</li>
                        <li>Escucha la diferencia entre un acorde de C mayor (tríada) y Cmaj7. La séptima agrega color sin cambiar la función.</li>
                    </ul>
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
                        <div class="song-example">
                            <div class="song-example-name">"Just the Two of Us" - Grover Washington Jr.</div>
                            <div class="song-example-artist">Dbmaj7 - Cb7 - Bbm7 - Ebm7 (séptimas puras)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="Db3,F3,Ab3,C4|B2,Eb3,Ab3,Bb3|Bb2,Db3,F3,Ab3|Eb3,Gb3,Bb3,Db4">Progresión con todas las séptimas</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuál es la fórmula del acorde dominante 7?',
                    options: ['4+3+4', '3+4+3', '4+3+3', '3+3+4'],
                    correct: 2,
                },
                {
                    question: '¿Qué tipo de acorde de 7ma se forma en el grado V de una escala mayor?',
                    options: ['Mayor 7', 'Menor 7', 'Dominante 7', 'Semidisminuido'],
                    correct: 2,
                },
                {
                    question: '¿Qué contiene el tritono del acorde V7 que impulsa la resolución?',
                    options: ['Raíz y quinta', 'Tercera y séptima', 'Quinta y novena', 'Raíz y tercera'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'tonality',
            title: '10. Tonalidad y funciones',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>El sistema de <strong>tonalidad funcional</strong> se desarrolló gradualmente entre los siglos XVI y XVIII. <strong>Rameau</strong> (1722) fue el primero en clasificar los acordes por funciones, pero fue <strong>Hugo Riemann</strong> en el siglo XIX quien formalizó las tres funciones fundamentales: Tónica, Subdominante y Dominante. Este sistema rige la inmensa mayoría de la música occidental desde Bach hasta el pop actual.</p>
                    <div class="theory-citation">
                        <p>"La tonalidad es un sistema jerárquico en el que todos los acordes gravitan hacia un centro tonal — la tónica. Esta jerarquía se expresa mediante las funciones armónicas: Tónica (reposo), Subdominante (movimiento) y Dominante (tensión)."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 5</span>
                    </div>
                </div>
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
                    <div class="theory-citation">
                        <p>"Todo movimiento armónico puede reducirse a la alternancia entre tensión y reposo. El grado V (Dominante) genera la máxima tensión, que se resuelve al regresar al grado I (Tónica). El grado IV (Subdominante) prepara esta tensión."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 4</span>
                    </div>
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
                    <h3>Progresiones comunes</h3>
                    <p>Las funciones armónicas generan patrones predecibles que se repiten en miles de canciones:</p>
                    <div class="lesson-example">
                        <h4>I - V - vi - IV (la progresión pop más famosa)</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|G3,B3,D4|A3,C4,E4|F3,A3,C4">En C: C - G - Am - F</button>
                    </div>
                    <div class="lesson-example">
                        <h4>I - IV - V - I (la cadencia clásica)</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|F3,A3,C4|G3,B3,D4|C3,E4,G4">En C: C - F - G - C</button>
                    </div>
                    <div class="lesson-example">
                        <h4>I - vi - IV - V (doo-wop / años 50)</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4|A3,C4,E4|F3,A3,C4|G3,B3,D4">En C: C - Am - F - G</button>
                    </div>
                    <div class="lesson-example">
                        <h4>vi - IV - I - V (la misma rotada, "triste")</h4>
                        <button class="example-btn" data-play-notes="A3,C4,E4|F3,A3,C4|C3,E4,G4|G3,B3,D4">En C: Am - F - C - G</button>
                    </div>
                    <div class="theory-citation">
                        <p>"Las sustituciones funcionales permiten reemplazar un acorde por otro de la misma función: el vi puede sustituir al I (ambos son tónica), el ii puede sustituir al IV (ambos son subdominante)."</p>
                        <span class="theory-citation-source">— Aldwell & Schachter, <em>Armonía y Conducción de Voces</em>, Cap. 14</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Construye los 7 acordes diatónicos de G mayor (G - Am - Bm - C - D - Em - F#dim). Tócalos subiendo.</li>
                        <li>Toca I - IV - V - I en las tonalidades de C, G y F. Nota cómo suena "igual" en cada tonalidad.</li>
                        <li>Escucha una canción pop y trata de identificar qué grados usa (I, IV, V, vi son los más comunes).</li>
                        <li>Sustituye el IV por ii en la progresión I-IV-V-I → I-ii-V-I. ¿Notas la diferencia sutil?</li>
                    </ul>
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
                        <div class="song-example">
                            <div class="song-example-name">"With or Without You" - U2</div>
                            <div class="song-example-artist">D mayor: I-V-vi-IV (D-A-Bm-G)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="D3,F#3,A3|A3,C#4,E4|B3,D4,F#4|G3,B3,D4">Escuchar progresión</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuál es la función del grado V?',
                    options: ['Tónica', 'Subdominante', 'Dominante', 'Mediante'],
                    correct: 2,
                },
                {
                    question: '¿Qué grados comparten la función de Tónica?',
                    options: ['I, ii, IV', 'I, iii, vi', 'I, V, vii°', 'I, IV, V'],
                    correct: 1,
                },
                {
                    question: '¿Cuál es el flujo básico de las funciones armónicas?',
                    options: ['D → T → SD', 'T → D → SD → T', 'T → SD → D → T', 'SD → T → D'],
                    correct: 2,
                }
            ]
        },
        {
            id: 'secondary-dominants',
            title: '11. Dominantes secundarios',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>Los dominantes secundarios se usaban ya en el período Barroco, pero fue en el <strong>Clasicismo</strong> (Mozart, Haydn) donde se sistematizaron. <strong>Beethoven</strong> los expandió dramáticamente, y el Romanticismo los convirtió en herramienta cotidiana. En la música popular moderna, los dominantes secundarios son el primer recurso cromático que aprende todo músico.</p>
                    <div class="theory-citation">
                        <p>"El dominante secundario es el recurso cromático más fundamental de la armonía tonal. Permite 'tonicizar' momentáneamente cualquier grado de la escala, creando mini-resoluciones dentro de la tonalidad principal."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 16</span>
                    </div>
                </div>
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
                    <table class="ref-table" style="max-width:500px">
                        <tr><th>Dominante sec.</th><th>Acorde</th><th>Resuelve a</th></tr>
                        <tr><td>V/ii</td><td>A7</td><td>Dm</td></tr>
                        <tr><td>V/iii</td><td>B7</td><td>Em</td></tr>
                        <tr><td>V/IV</td><td>C7</td><td>F</td></tr>
                        <tr><td>V/V</td><td>D7</td><td>G (el más común)</td></tr>
                        <tr><td>V/vi</td><td>E7</td><td>Am</td></tr>
                    </table>
                    <div class="theory-citation">
                        <p>"Para construir un dominante secundario, simplemente pregúntate: ¿cuál sería el V7 si este grado fuera la tónica temporal? La nota que está una quinta justa arriba del grado objetivo será la raíz del dominante secundario."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 17</span>
                    </div>
                    <div class="lesson-example">
                        <h4>Escucha cada dominante secundario resolviendo</h4>
                        <button class="example-btn" data-play-notes="A3,C#4,E4,G4|D3,F3,A3">V/ii: A7 → Dm</button>
                        <button class="example-btn" data-play-notes="C3,E4,G4,Bb4|F3,A3,C4">V/IV: C7 → F</button>
                        <button class="example-btn" data-play-notes="D4,F#4,A4,C5|G3,B3,D4">V/V: D7 → G</button>
                        <button class="example-btn" data-play-notes="E3,G#3,B3,D4|A3,C4,E4">V/vi: E7 → Am</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Cadena de dominantes: V/V → V → I</h4>
                        <button class="example-btn" data-play-notes="D4,F#4,A4,C5|G3,B3,D4,F4|C3,E4,G4,C5">D7 → G7 → C</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Cómo identificar dominantes secundarios</h3>
                    <p>Si ves un acorde mayor con séptima menor (dom7) que <strong>no es el V de la tonalidad</strong>, probablemente es un dominante secundario. Pregúntate: ¿a qué acorde diatónico resuelve?</p>
                    <div class="theory-citation">
                        <p>"El dominante secundario se reconoce por contener alteraciones cromáticas respecto a la tonalidad principal. Estas notas ajenas a la escala son precisamente las que crean la tensión necesaria para resolver al acorde objetivo."</p>
                        <span class="theory-citation-source">— Aldwell & Schachter, <em>Armonía y Conducción de Voces</em>, Cap. 20</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>En Do mayor, toca cada dominante secundario seguido de su resolución: A7→Dm, B7→Em, C7→F, D7→G, E7→Am.</li>
                        <li>Toma la progresión C - Am - F - G y agrega un dominante secundario antes del Am: C - E7 - Am - F - G. ¿Notas la diferencia?</li>
                        <li>Toca la cadena de dominantes: E7 → A7 → D7 → G7 → C. Cada uno resuelve al siguiente.</li>
                        <li>Identifica dominantes secundarios en "Yesterday" de Beatles.</li>
                    </ul>
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
                        <div class="song-example">
                            <div class="song-example-name">"Georgia On My Mind" - Ray Charles</div>
                            <div class="song-example-artist">F: I-V/vi-vi-V/V-V (F-E7-Am-D7-G7)</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="F3,A3,C4|E3,G#3,B3|A3,C4,E4|D3,F#3,A3,C4|G3,B3,D4,F4|C3,E4,G4">F-E7-Am-D7-G7-C (cadena)</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: 'En Do mayor, ¿cuál es el V/V (dominante del dominante)?',
                    options: ['C7', 'A7', 'D7', 'E7'],
                    correct: 2,
                },
                {
                    question: '¿Qué acorde funciona como V/vi en Do mayor?',
                    options: ['A7', 'B7', 'D7', 'E7'],
                    correct: 3,
                },
                {
                    question: '¿Cómo se reconoce un dominante secundario?',
                    options: ['Es un acorde menor', 'Es un acorde dom7 que no es el V de la tonalidad', 'Es un acorde sin tercera', 'Es un acorde disminuido'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'cadences',
            title: '12. Cadencias',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>Las cadencias son tan antiguas como la polifonía misma. En la música medieval, las cadencias se basaban en movimientos de voces convergentes (clausulae). Con el desarrollo de la armonía tonal en el Barroco, las cadencias se estandarizaron en los cuatro tipos que conocemos. <strong>Bach</strong> fue un maestro en el uso expresivo de las cadencias, especialmente la cadencia rota para crear sorpresas dramáticas.</p>
                    <div class="theory-citation">
                        <p>"La cadencia es a la música lo que la puntuación es al lenguaje. Marca el final de una frase, una sección o una obra completa. La fuerza de la cadencia determina el grado de cierre percibido."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 9</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Las cadencias principales</h3>
                    <p>Una cadencia es una <strong>fórmula de cierre</strong> o <strong>puntuación musical</strong>:</p>
                    <ul>
                        <li><strong>Auténtica perfecta</strong> (V → I, ambos en fundamental): La resolución más fuerte. "Punto final".</li>
                        <li><strong>Auténtica imperfecta</strong> (V → I, alguno en inversión): Cierre menos conclusivo.</li>
                        <li><strong>Plagal</strong> (IV → I): Resolución suave. "Amén".</li>
                        <li><strong>Rota/Deceptiva</strong> (V → vi): Engaño. El V no va al I sino al vi.</li>
                        <li><strong>Media/Semicadencia</strong> (X → V): Termina en el V. "Coma" o "punto y seguido".</li>
                    </ul>
                    <div class="theory-citation">
                        <p>"La cadencia auténtica perfecta — con el V y el I en estado fundamental y la tónica en la voz superior — proporciona el mayor grado de cierre posible. Es la 'respiración final' de una frase musical."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 9</span>
                    </div>
                    <div class="lesson-example">
                        <h4>Escucha cada cadencia en Do mayor</h4>
                        <button class="example-btn" data-play-notes="G3,B3,D4,F4|C3,E4,G4,C5">Auténtica perfecta: G7 → C</button>
                        <button class="example-btn" data-play-notes="F3,A3,C4|C3,E4,G4">Plagal: F → C</button>
                        <button class="example-btn" data-play-notes="G3,B3,D4,F4|A3,C4,E4">Rota: G7 → Am</button>
                        <button class="example-btn" data-play-notes="C3,E4,G4|G3,B3,D4">Media: C → G</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Cadencias en otras tonalidades</h4>
                        <button class="example-btn" data-play-notes="D3,F#3,A3,C4|G3,B3,D4">Auténtica en G: D7 → G</button>
                        <button class="example-btn" data-play-notes="C3,E3,G3,Bb3|F3,A3,C4">Auténtica en F: C7 → F</button>
                        <button class="example-btn" data-play-notes="E3,G#3,B3,D4|A3,C#4,E4">Auténtica en A: E7 → A</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>La cadencia rota: el arte de la sorpresa</h3>
                    <p>La cadencia rota (V → vi) es el recurso más poderoso para crear <strong>sorpresa emocional</strong>. El oído espera la resolución al I, pero llega al vi — un acorde de función tónica pero menor, que cambia el color emocional.</p>
                    <div class="lesson-example">
                        <h4>Compara: resolución esperada vs rota</h4>
                        <button class="example-btn" data-play-notes="F3,A3,C4|G3,B3,D4,F4|C3,E4,G4">Esperada: F → G7 → C (satisfacción)</button>
                        <button class="example-btn" data-play-notes="F3,A3,C4|G3,B3,D4,F4|A3,C4,E4">Rota: F → G7 → Am (¡sorpresa!)</button>
                    </div>
                    <div class="theory-citation">
                        <p>"La cadencia deceptiva funciona porque el acorde vi comparte dos notas con el I (en Do mayor, Am tiene C y E en común con C mayor). Esto permite una resolución parcialmente satisfactoria pero emocionalmente diferente."</p>
                        <span class="theory-citation-source">— Aldwell & Schachter, <em>Armonía y Conducción de Voces</em>, Cap. 13</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca las 4 cadencias en Do mayor. Luego repite en Sol mayor y Fa mayor.</li>
                        <li>Toca una frase de 4 acordes (I - IV - V - ?) y elige diferentes finales: I (auténtica), vi (rota), V (media).</li>
                        <li>Escucha 3 canciones y trata de identificar qué cadencia usan al final de cada frase.</li>
                        <li>Toca ii - V - I (Dm - G - C) y luego ii - V - vi (Dm - G - Am). Siente la diferencia.</li>
                    </ul>
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
            quizzes: [
                {
                    question: '¿Qué cadencia usa V → vi (engaño)?',
                    options: ['Auténtica', 'Plagal', 'Rota/Deceptiva', 'Media'],
                    correct: 2,
                },
                {
                    question: '¿Cuál es la cadencia con mayor grado de cierre?',
                    options: ['Plagal (IV → I)', 'Media (X → V)', 'Auténtica perfecta (V → I en fundamental)', 'Rota (V → vi)'],
                    correct: 2,
                },
                {
                    question: '¿Qué nombre recibe la cadencia que termina en el grado V?',
                    options: ['Auténtica', 'Plagal', 'Rota', 'Media / Semicadencia'],
                    correct: 3,
                }
            ]
        },
        {
            id: 'reading',
            title: '13. Lectura musical',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>La <strong>notación musical</strong> moderna evolucionó durante más de mil años. Los primeros sistemas de notación eran los <strong>neumas</strong> del canto gregoriano (siglo IX), que indicaban la dirección melódica pero no las alturas exactas. <strong>Guido d'Arezzo</strong> (siglo XI) inventó el pentagrama de cuatro líneas y el sistema de solmización. El pentagrama de cinco líneas se estandarizó en el Renacimiento.</p>
                    <div class="theory-citation">
                        <p>"La notación musical es el sistema de escritura más sofisticado creado por la humanidad, capaz de codificar simultáneamente alturas, duraciones, dinámicas, articulaciones y expresión en un formato visual coherente."</p>
                        <span class="theory-citation-source">— Laitz, <em>The Complete Musician</em>, Cap. 2</span>
                    </div>
                </div>
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
                    <div class="theory-citation">
                        <p>"La clave de Sol fija la nota Sol en la segunda línea del pentagrama. La clave de Fa fija la nota Fa en la cuarta línea. Juntas, el 'gran pentagrama' (grand staff) cubre el rango completo del piano."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 1</span>
                    </div>
                    <div class="lesson-example">
                        <h4>Escucha las notas de las líneas (clave de Sol)</h4>
                        <button class="example-btn" data-play-notes="E4,G4,B4,D5,F5">Líneas: Mi-Sol-Si-Re-Fa</button>
                        <button class="example-btn" data-play-notes="F4,A4,C5,E5">Espacios: Fa-La-Do-Mi</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Escucha las notas de las líneas (clave de Fa)</h4>
                        <button class="example-btn" data-play-notes="G2,B2,D3,F3,A3">Líneas: Sol-Si-Re-Fa-La</button>
                        <button class="example-btn" data-play-notes="A2,C3,E3,G3">Espacios: La-Do-Mi-Sol</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Las armaduras de clave</h3>
                    <p>La <strong>armadura</strong> al inicio del pentagrama indica qué notas están alteradas en toda la pieza:</p>
                    <table class="ref-table" style="max-width:500px">
                        <tr><th>Armadura</th><th>Tonalidad Mayor</th><th>Tonalidad menor</th></tr>
                        <tr><td>Sin alteraciones</td><td>Do (C)</td><td>La menor (Am)</td></tr>
                        <tr><td>1 sostenido (F#)</td><td>Sol (G)</td><td>Mi menor (Em)</td></tr>
                        <tr><td>2 sostenidos (F#, C#)</td><td>Re (D)</td><td>Si menor (Bm)</td></tr>
                        <tr><td>1 bemol (Bb)</td><td>Fa (F)</td><td>Re menor (Dm)</td></tr>
                        <tr><td>2 bemoles (Bb, Eb)</td><td>Sib (Bb)</td><td>Sol menor (Gm)</td></tr>
                    </table>
                    <div class="theory-citation">
                        <p>"Para determinar la tonalidad mayor a partir de sostenidos, el último sostenido de la armadura es el grado VII de la escala mayor. Para bemoles, el penúltimo bemol indica la tonalidad."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 2</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Figuras rítmicas</h3>
                    <p>Las figuras básicas y su duración relativa:</p>
                    <table class="ref-table" style="max-width:500px">
                        <tr><th>Figura</th><th>Duración</th><th>Equivalencia</th></tr>
                        <tr><td>Redonda</td><td>4 tiempos</td><td>= 2 blancas</td></tr>
                        <tr><td>Blanca</td><td>2 tiempos</td><td>= 2 negras</td></tr>
                        <tr><td>Negra</td><td>1 tiempo</td><td>= 2 corcheas</td></tr>
                        <tr><td>Corchea</td><td>1/2 tiempo</td><td>= 2 semicorcheas</td></tr>
                        <tr><td>Semicorchea</td><td>1/4 tiempo</td><td>= la más corta común</td></tr>
                    </table>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Memoriza las líneas de clave de Sol con el truco "Mi Sol Si Refa". Repite hasta que sea automático.</li>
                        <li>Toma una partitura simple (himno o canción infantil) y nombra cada nota antes de tocarla.</li>
                        <li>Practica identificar la tonalidad mirando la armadura: ¿2 sostenidos? → Re mayor o Si menor.</li>
                        <li>Escribe en papel pautado la escala de Do mayor en clave de Sol (de C4 a C5).</li>
                    </ul>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuáles son las notas en las LÍNEAS de clave de Sol?',
                    options: ['Fa-La-Do-Mi', 'Mi-Sol-Si-Re-Fa', 'Do-Mi-Sol-Si', 'Sol-Si-Re-Fa-La'],
                    correct: 1,
                },
                {
                    question: '¿Qué tonalidad mayor tiene 1 bemol (Bb) en la armadura?',
                    options: ['Do mayor', 'Sol mayor', 'Fa mayor', 'Re mayor'],
                    correct: 2,
                },
                {
                    question: '¿Cuántos tiempos dura una blanca?',
                    options: ['1', '2', '3', '4'],
                    correct: 1,
                }
            ]
        },
        // ============ LECCIONES 14-22: Ruta avanzada ============
        {
            id: 'extended-chords',
            title: '14. Acordes extendidos',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>Los acordes extendidos surgieron gradualmente. Los compositores <strong>impresionistas</strong> (Debussy, Ravel) comenzaron a usar novenas y oncenas como colores sonoros a finales del siglo XIX. El <strong>jazz</strong> de los años 1930-1950 los sistematizó completamente, y artistas como <strong>Art Tatum</strong>, <strong>Bill Evans</strong> y <strong>Herbie Hancock</strong> los convirtieron en vocabulario estándar.</p>
                    <div class="theory-citation">
                        <p>"Los acordes de novena, oncena y trecena son extensiones lógicas del principio de apilamiento de terceras. Cada nueva tercera añadida aporta un color adicional sin destruir la identidad funcional del acorde."</p>
                        <span class="theory-citation-source">— Levine, <em>The Jazz Theory Book</em>, Cap. 3</span>
                    </div>
                </div>
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
                    <div class="theory-citation">
                        <p>"En la práctica jazzística, el acorde de trecena contiene potencialmente todas las notas de la escala. La habilidad del músico reside en elegir qué notas incluir y cuáles omitir para obtener el color deseado."</p>
                        <span class="theory-citation-source">— Persichetti, <em>Armonía del Siglo XX</em>, Cap. 4</span>
                    </div>
                    <div class="lesson-example">
                        <h4>Escucha los colores extendidos</h4>
                        <button class="example-btn" data-play-notes="C4,E4,G4,D5">Cadd9</button>
                        <button class="example-btn" data-play-notes="C4,E4,G4,B4,D5">Cmaj9</button>
                        <button class="example-btn" data-play-notes="C4,E4,G4,Bb4,D5">C9</button>
                        <button class="example-btn" data-play-notes="C4,Eb4,G4,Bb4,D5">Cm9</button>
                        <button class="example-btn" data-play-notes="C4,E4,Bb4,D5,F5">C11 (sin 5ta)</button>
                        <button class="example-btn" data-play-notes="C4,E4,Bb4,D5,A5">C13 (sin 5ta)</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Tensiones disponibles por tipo de acorde</h3>
                    <p>No todas las extensiones suenan bien en todos los acordes. Estas son las <strong>tensiones disponibles</strong>:</p>
                    <table class="ref-table" style="max-width:600px">
                        <tr><th>Tipo</th><th>Tensiones</th><th>Evitar</th></tr>
                        <tr><td>maj7</td><td>9, #11, 13</td><td>11 natural (choca con 3era)</td></tr>
                        <tr><td>m7</td><td>9, 11, 13</td><td>—</td></tr>
                        <tr><td>dom7</td><td>9, #11, 13, b9, #9, b13</td><td>depende del contexto</td></tr>
                        <tr><td>m7b5</td><td>9, 11, b13</td><td>—</td></tr>
                    </table>
                    <div class="theory-citation">
                        <p>"Una tensión disponible es una nota que puede añadirse a un acorde sin crear un choque de semitono con una nota del acorde. La regla general es evitar notas que estén a un semitono por encima de una nota del acorde."</p>
                        <span class="theory-citation-source">— Levine, <em>The Jazz Theory Book</em>, Cap. 4</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>¿Dónde se usan?</h3>
                    <ul>
                        <li><strong>Neo-soul / R&B</strong>: maj9, m9, add9 son el pan de cada día (D'Angelo, Erykah Badu)</li>
                        <li><strong>Jazz</strong>: 9as, 11as y 13as en todos los acordes</li>
                        <li><strong>Pop moderno</strong>: add9 y maj7 para sofisticar progresiones simples (Tom Misch, Mac DeMarco)</li>
                        <li><strong>Funk</strong>: dom9 y dom13 dan el groove (Stevie Wonder, James Brown)</li>
                    </ul>
                    <div class="lesson-example">
                        <h4>Progresión neo-soul con extensiones</h4>
                        <button class="example-btn" data-play-notes="C3,E4,G4,B4,D5|A3,C4,E4,G4,B4|F3,A3,C4,E4,G4|G3,B3,D4,F4,A4">Cmaj9 - Am9 - Fmaj9 - G9</button>
                    </div>
                    <div class="lesson-example">
                        <h4>Progresión funk con dom9</h4>
                        <button class="example-btn" data-play-notes="E3,G#3,B3,D4,F#4|A3,C#4,E4,G4,B4|E3,G#3,B3,D4,F#4">E9 - A9 - E9 (groove funk)</button>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca Cmaj7, luego agrega la 9na (D) → Cmaj9. Haz lo mismo con Dm7 → Dm9 y G7 → G9.</li>
                        <li>Toma la progresión I-V-vi-IV con tríadas y conviértela a maj9-dom9-m9-maj9.</li>
                        <li>Experimenta omitiendo la 5ta de un acorde extendido. Nota cómo el sonido se mantiene pero se abre más.</li>
                        <li>Toca Cadd9 (sin 7ma) y Cmaj9 (con 7ma). Escucha la diferencia de color.</li>
                    </ul>
                </div>
                <div class="lesson-section">
                    <h3>En canciones reales</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Wonderwall" - Oasis</div>
                            <div class="song-example-artist">Usa Emadd9 y Cadd9 constantemente</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="E3,B3,E4,F#4|G3,B3,D4,F#4|D3,A3,D4,F#4|A3,E4,A4,F#4">Em7-G-Dsus4-A7sus4 (con add9)</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Electric Feel" - MGMT</div>
                            <div class="song-example-artist">Dm9 y acordes extendidos definen el groove</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="D3,F3,A3,C4,E4|G3,B3,D4,F4,A4|C3,E3,G3,B3,D4">Dm9 - G9 - Cmaj9</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuál es la diferencia entre Cadd9 y Cmaj9?',
                    options: ['Son lo mismo', 'Cadd9 no tiene 7ma, Cmaj9 sí', 'Cmaj9 no tiene 5ta', 'Cadd9 tiene 7ma menor'],
                    correct: 1,
                },
                {
                    question: '¿Qué tensión se debe evitar en un acorde maj7?',
                    options: ['9na', '13na', '11na natural', '#11'],
                    correct: 2,
                },
                {
                    question: '¿Qué nota se omite frecuentemente en acordes extendidos?',
                    options: ['La raíz', 'La 3era', 'La 5ta', 'La 7ma'],
                    correct: 2,
                }
            ]
        },
        {
            id: 'reharmonization',
            title: '15. Reharmonización básica',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>La reharmonización es una práctica tan antigua como la armonía misma — Bach reharmonizaba corales constantemente, presentando la misma melodía con diferentes acordes en cada estrofa. En el jazz, la reharmonización alcanzó su máxima expresión con <strong>Art Tatum</strong>, <strong>Bill Evans</strong> y <strong>Brad Mehldau</strong>, quienes transforman standards conocidos con harmonías radicalmente diferentes.</p>
                    <div class="theory-citation">
                        <p>"La reharmonización demuestra que una melodía no está ligada a una única armonía. Una misma línea melódica puede funcionar sobre múltiples acordes, y la elección de armonía determina el carácter expresivo de la pieza."</p>
                        <span class="theory-citation-source">— Levine, <em>The Jazz Theory Book</em>, Cap. 17</span>
                    </div>
                </div>
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
                    <h3>Técnicas de reharmonización</h3>
                    <h4>1. Sustitución tritonal</h4>
                    <p>Reemplaza un acorde dom7 por otro dom7 cuya raíz está a un <strong>tritono</strong> (3 tonos) de distancia. Funciona porque comparten el mismo tritono interno (3era y 7ma se intercambian).</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="D3,F3,A3,C4|G3,B3,D4,F4|C3,E3,G3,B3">Original: Dm7 - G7 - Cmaj7</button>
                        <button class="example-btn" data-play-notes="D3,F3,A3,C4|Db3,F3,Ab3,B3|C3,E3,G3,B3">Con sub tritonal: Dm7 - Db7 - Cmaj7</button>
                    </div>
                    <div class="theory-citation">
                        <p>"La sustitución tritonal funciona porque el tritono Fa-Si del acorde G7 es el mismo que el tritono Si-Fa del acorde Db7. Los guide tones son idénticos, solo cambia el bajo."</p>
                        <span class="theory-citation-source">— Levine, <em>The Jazz Theory Book</em>, Cap. 8</span>
                    </div>
                    <h4>2. Intercambio modal</h4>
                    <p>Toma acordes "prestados" del modo menor paralelo. Los más comunes: <strong>bVI</strong>, <strong>bVII</strong>, <strong>iv</strong>.</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="C3,E4,G4|Bb3,D4,F4|Ab3,C4,Eb4|C3,E4,G4">C - Bb - Ab - C (bVII y bVI prestados)</button>
                    </div>
                    <h4>3. Insertar ii-V antes de cualquier acorde</h4>
                    <p>Cada acorde puede ser precedido por su propio ii-V, creando cadenas de resolución.</p>
                    <div class="lesson-example">
                        <button class="example-btn" data-play-notes="C3,E3,G3,B3|E3,G3,B3,D4|A3,C#4,E4,G4|D3,F3,A3,C4|G3,B3,D4,F4|C3,E3,G3,B3">Cmaj7 → (ii-V de Dm) → Dm7 → G7 → Cmaj7</button>
                    </div>
                    <div class="theory-citation">
                        <p>"El principio fundamental de la reharmonización es que cualquier nota melódica puede funcionar como raíz, tercera, quinta, séptima o extensión de múltiples acordes diferentes."</p>
                        <span class="theory-citation-source">— Persichetti, <em>Armonía del Siglo XX</em>, Cap. 2</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Principio clave</h3>
                    <p>La melodía es la guía. Mientras la nota de la melodía sea una <strong>nota del acorde o una tensión disponible</strong>, la reharmonización funcionará.</p>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toma I-V-vi-IV en C y aplica los 4 pasos: tríadas → séptimas → extensiones → sustituciones.</li>
                        <li>Practica la sustitución tritonal: reemplaza G7 por Db7 en la progresión Dm7-G7-Cmaj7.</li>
                        <li>Toma "Happy Birthday" (C-G7-C-F-C-G7-C) y agrega séptimas a todos los acordes.</li>
                        <li>Experimenta con intercambio modal: toca C - Ab - Bb - C (usando bVI y bVII de Do menor).</li>
                    </ul>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuál es el primer paso de la reharmonización?',
                    options: ['Agregar sustituciones tritonales', 'Empezar con tríadas simples', 'Usar solo acordes extendidos', 'Cambiar la melodía'],
                    correct: 1,
                },
                {
                    question: '¿Qué acorde puede sustituir a G7 por sustitución tritonal?',
                    options: ['C7', 'Db7', 'F7', 'Ab7'],
                    correct: 1,
                },
                {
                    question: '¿Qué es el intercambio modal?',
                    options: ['Cambiar de tonalidad', 'Prestar acordes del modo menor paralelo', 'Tocar en otro instrumento', 'Usar solo modos griegos'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'jazz-fundamentals',
            title: '16. Fundamentos de jazz',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>El jazz nació en <strong>Nueva Orleans</strong> a principios del siglo XX, fusionando tradiciones africanas, blues, ragtime y armonía europea. La cadencia <strong>ii-V-I</strong> se convirtió en el pilar armónico del jazz durante la era del <strong>bebop</strong> (1940s), cuando <strong>Charlie Parker</strong>, <strong>Dizzy Gillespie</strong> y <strong>Thelonious Monk</strong> la elevaron a un arte de improvisación sofisticado.</p>
                    <div class="theory-citation">
                        <p>"La cadencia ii-V-I es la progresión armónica más importante del jazz. Aparece en prácticamente todos los standards y constituye el vocabulario básico que todo jazzista debe dominar en las doce tonalidades."</p>
                        <span class="theory-citation-source">— Levine, <em>The Jazz Theory Book</em>, Cap. 1</span>
                    </div>
                </div>
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
                        <h4>ii-V-I en C menor</h4>
                        <button class="example-btn" data-play-notes="D3,F3,Ab3,C4|G3,B3,D4,F4|C3,Eb3,G3,Bb3">Dm7b5 → G7 → Cm7</button>
                    </div>
                    <div class="lesson-example">
                        <h4>ii-V-I en otras tonalidades</h4>
                        <button class="example-btn" data-play-notes="E3,G3,B3,D4|A3,C#4,E4,G4|D3,F#3,A3,C#4">Em7 → A7 → Dmaj7 (en D)</button>
                        <button class="example-btn" data-play-notes="A3,C4,E4,G4|D3,F#3,A3,C4|G3,B3,D4,F#4">Am7 → D7 → Gmaj7 (en G)</button>
                        <button class="example-btn" data-play-notes="G3,Bb3,D4,F4|C3,E3,G3,Bb3|F3,A3,C4,E4">Gm7 → C7 → Fmaj7 (en F)</button>
                    </div>
                    <div class="theory-citation">
                        <p>"Dominar el ii-V-I en todas las tonalidades es el requisito previo fundamental para tocar jazz. No basta con conocerlo teóricamente — debe ser fluido e instantáneo en los dedos."</p>
                        <span class="theory-citation-source">— Levine, <em>The Jazz Theory Book</em>, Cap. 2</span>
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
                        <h4>Solo los guide tones del ii-V-I</h4>
                        <button class="example-btn" data-play-notes="F3,C4|B3,F4|E3,B3">Guide tones: Dm7(F-C) → G7(B-F) → Cmaj7(E-B)</button>
                    </div>
                    <div class="theory-citation">
                        <p>"El voice leading eficiente es la base de la conducción de voces en jazz. Las guide tones (3era y 7ma) definen la calidad armónica del acorde y crean las conexiones más suaves entre acordes."</p>
                        <span class="theory-citation-source">— Persichetti, <em>Armonía del Siglo XX</em>, Cap. 3</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca ii-V-I en C, F, Bb, Eb. Estas son las tonalidades más comunes en jazz.</li>
                        <li>Toca solo los guide tones (3era y 7ma) del ii-V-I en C. Nota el movimiento mínimo.</li>
                        <li>Toca ii-V-I mayor y luego ii-V-i menor en la misma tonalidad. Siente la diferencia.</li>
                        <li>Analiza "Autumn Leaves": identifica cada ii-V-I (hay dos: uno mayor y uno menor).</li>
                    </ul>
                </div>
                <div class="lesson-section">
                    <h3>En standards de jazz</h3>
                    <div class="song-examples-grid">
                        <div class="song-example">
                            <div class="song-example-name">"Autumn Leaves"</div>
                            <div class="song-example-artist">Cm7→F7→Bbmaj7→Ebmaj7→Am7b5→D7→Gm</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C3,Eb3,G3,Bb3|F3,A3,C4,Eb4|Bb2,D3,F3,A3|Eb3,G3,Bb3,D4|A3,C4,Eb4,G4|D3,F#3,A3,C4|G3,Bb3,D4">Autumn Leaves completo</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"All The Things You Are"</div>
                            <div class="song-example-artist">Cadenas de ii-V-I en múltiples tonalidades</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="F3,Ab3,C4,Eb4|Bb3,D4,F4,Ab4|Eb3,G3,Bb3,D4|Ab3,C4,Eb4,G4|D3,F3,A3,C4|G3,B3,D4,F4|C3,E3,G3,B3">Fm7-Bb7-Ebmaj7-Abmaj7-Dm7-G7-Cmaj7</button>
                            </div>
                        </div>
                        <div class="song-example">
                            <div class="song-example-name">"Blue Bossa" - Kenny Dorham</div>
                            <div class="song-example-artist">ii-V-i menor en Cm + modulación a Db</div>
                            <div class="lesson-example">
                                <button class="example-btn" data-play-notes="C3,Eb3,G3,Bb3|F3,Ab3,C4,Eb4|D3,F3,Ab3,C4|G3,B3,D4,F4|C3,Eb3,G3,Bb3">Cm7-Fm7-Dm7b5-G7-Cm7</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuáles son los "guide tones" de un acorde?',
                    options: ['Raíz y 5ta', '3era y 7ma', '5ta y 9na', 'Raíz y 3era'],
                    correct: 1,
                },
                {
                    question: '¿Cuál es el ii-V-I en C menor?',
                    options: ['Dm7-G7-Cmaj7', 'Dm7b5-G7-Cm', 'Cm7-F7-Bbmaj7', 'Am7-D7-Gmaj7'],
                    correct: 1,
                },
                {
                    question: '¿Por qué el voice leading del ii-V-I es eficiente?',
                    options: ['Porque usa pocos acordes', 'Porque los guide tones se mueven por semitonos', 'Porque todos los acordes son mayores', 'Porque no hay disonancias'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'voicing',
            title: '17. Voicing y distribución de voces',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>El arte del voicing tiene raíces en la <strong>conducción de voces</strong> del contrapunto barroco (Bach). En el jazz, pianistas como <strong>Bill Evans</strong> revolucionaron los voicings en los años 60 con sus voicings "rootless" (sin raíz) en el álbum <em>Kind of Blue</em>. <strong>McCoy Tyner</strong> popularizó los voicings cuartales, y <strong>Herbie Hancock</strong> expandió las posibilidades con clusters y voicings abiertos.</p>
                    <div class="theory-citation">
                        <p>"El voicing es el arte de elegir qué notas tocar y en qué registro. Un Cmaj7 puede sonar completamente distinto según cómo distribuyas sus notas. El voicing transforma la teoría en música."</p>
                        <span class="theory-citation-source">— Levine, <em>The Jazz Theory Book</em>, Cap. 5</span>
                    </div>
                </div>
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
                <div class="lesson-section">
                    <div class="theory-citation">
                        <p>"El voicing rootless de Bill Evans revolucionó la forma de tocar piano en jazz. Al omitir la raíz, el pianista libera espacio para el bajista y crea sonoridades más modernas y ambiguas."</p>
                        <span class="theory-citation-source">— Levine, <em>The Jazz Theory Book</em>, Cap. 5</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca Cmaj7 en voicing cerrado, luego en drop 2, luego en shell. Compara los tres sonidos.</li>
                        <li>Practica ii-V-I con shell voicing en C, F, Bb y Eb. El movimiento debe ser mínimo.</li>
                        <li>Toca la misma progresión (I-vi-IV-V) en estilo pop, neo-soul y jazz. Nota cómo cambia el carácter.</li>
                        <li>Practica voicings rootless: toca 3-5-7-9 de Dm7, G7 y Cmaj7. El bajo imaginario toca las raíces.</li>
                    </ul>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Qué es un voicing "drop 2"?',
                    options: ['Quitar la 2da nota del acorde', 'Bajar la 2da nota más aguda una octava', 'Tocar solo 2 notas', 'Bajar todo el acorde 2 octavas'],
                    correct: 1,
                },
                {
                    question: '¿Qué notas contiene un shell voicing?',
                    options: ['Raíz, 3era y 5ta', 'Raíz, 3era y 7ma', 'Solo raíz y 5ta', '3era, 5ta y 9na'],
                    correct: 1,
                },
                {
                    question: '¿Qué caracteriza un voicing rootless?',
                    options: ['No tiene tercera', 'No tiene la nota raíz', 'No tiene séptima', 'Solo usa notas blancas'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'modal-harmony',
            title: '18. Armonía modal',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>Los modos son anteriores a la tonalidad mayor/menor. La música medieval y renacentista se basaba en los <strong>modos eclesiásticos</strong> (Dórico, Frigio, Lidio, Mixolidio). Con el triunfo de la tonalidad funcional en el Barroco, los modos cayeron en desuso. Fueron "redescubiertos" por los <strong>impresionistas</strong> (Debussy), el <strong>jazz modal</strong> (Miles Davis, <em>Kind of Blue</em>, 1959) y el <strong>rock progresivo</strong>.</p>
                    <div class="theory-citation">
                        <p>"La armonía modal abandona las funciones tonales de tensión-resolución. En su lugar, establece un centro tonal mediante repetición, pedales y el color particular del modo elegido."</p>
                        <span class="theory-citation-source">— Persichetti, <em>Armonía del Siglo XX</em>, Cap. 2</span>
                    </div>
                </div>
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
                <div class="lesson-section">
                    <h3>Tabla resumen de modos</h3>
                    <table class="ref-table">
                        <tr><th>Modo</th><th>Nota caract.</th><th>Color</th><th>Géneros</th></tr>
                        <tr><td>Dórico</td><td>6ta mayor</td><td>Menor esperanzado</td><td>Jazz, funk, R&B</td></tr>
                        <tr><td>Mixolidio</td><td>7ma menor</td><td>Mayor relajado</td><td>Blues, rock, folk</td></tr>
                        <tr><td>Lidio</td><td>#4</td><td>Brillante, flotante</td><td>Cine, prog rock</td></tr>
                        <tr><td>Frigio</td><td>b2</td><td>Oscuro, exótico</td><td>Flamenco, metal</td></tr>
                    </table>
                    <div class="theory-citation">
                        <p>"Cada modo se define por su nota característica — aquella que lo distingue de la escala mayor o menor natural. Esa nota es la que debe enfatizarse para establecer el color modal."</p>
                        <span class="theory-citation-source">— Levine, <em>The Jazz Theory Book</em>, Cap. 2</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca D Dórico (notas blancas de D a D). Improvisa una melodía enfatizando la nota B (6ta mayor).</li>
                        <li>Toca G Mixolidio (notas blancas de G a G). Compara con G mayor (cambia F natural por F#).</li>
                        <li>Toca un pedal de bajo en F y toca la escala F Lidia encima (con B natural en vez de Bb).</li>
                        <li>Toca la cadencia Frigia: Am-G-F-E. Siente el color flamenco/árabe.</li>
                    </ul>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Qué modo tiene 7ma menor con el resto mayor (sonido de blues/rock)?',
                    options: ['Dórico', 'Mixolidio', 'Lidio', 'Frigio'],
                    correct: 1,
                },
                {
                    question: '¿Cuál es la nota característica del modo Lidio?',
                    options: ['b2', 'b3', '#4', 'b7'],
                    correct: 2,
                },
                {
                    question: '¿Qué modo se asocia con el flamenco y lo "exótico"?',
                    options: ['Dórico', 'Mixolidio', 'Lidio', 'Frigio'],
                    correct: 3,
                }
            ]
        },
        {
            id: 'impressionist',
            title: '19. Armonía impresionista',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>El <strong>impresionismo musical</strong> nació en Francia a finales del siglo XIX como reacción al dramatismo wagneriano. <strong>Claude Debussy</strong> (1862-1918) fue su principal exponente, influenciado por la música javanesa del gamelán que escuchó en la Exposición Universal de París (1889), el arte impresionista de Monet, y la poesía simbolista de Mallarmé.</p>
                    <div class="theory-citation">
                        <p>"Debussy liberó a la armonía de su función de tensión y resolución. Para él, los acordes eran colores puros, como pigmentos en la paleta de un pintor, que podían yuxtaponerse libremente por su sonoridad."</p>
                        <span class="theory-citation-source">— Persichetti, <em>Armonía del Siglo XX</em>, Cap. 1</span>
                    </div>
                </div>
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
                <div class="lesson-section">
                    <div class="theory-citation">
                        <p>"La escala de tonos enteros elimina toda jerarquía entre sus notas. No hay tónica, dominante ni sensible. El resultado es una sonoridad flotante, suspendida, que Debussy utilizó magistralmente en obras como 'Voiles'."</p>
                        <span class="theory-citation-source">— Schoenberg, <em>Tratado de Armonía</em>, Cap. 20</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca la escala de tonos enteros desde C (C-D-E-F#-G#-A#). Improvisa una melodía sobre ella.</li>
                        <li>Practica planing: toca C mayor como tríada y muévela cromáticamente (C-Db-D-Eb).</li>
                        <li>Construye un acorde cuartal desde C (C-F-Bb). Muévelo a D (D-G-C) y E (E-A-D).</li>
                        <li>Toca Csus2 (C-D-G), Csus4 (C-F-G) y Cadd9 (C-E-G-D). Siente cómo flotan sin resolver.</li>
                    </ul>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Qué es el "planing" en armonía impresionista?',
                    options: ['Resolver acordes al I', 'Mover la misma forma de acorde en paralelo', 'Construir acordes en 4tas', 'Usar solo la escala pentatónica'],
                    correct: 1,
                },
                {
                    question: '¿Cuántas notas tiene la escala de tonos enteros?',
                    options: ['5', '6', '7', '8'],
                    correct: 1,
                },
                {
                    question: '¿Qué caracteriza a la armonía cuartal?',
                    options: ['Acordes en terceras', 'Acordes construidos en cuartas', 'Solo tríadas mayores', 'Acordes de séptima'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'romantic',
            title: '20. Armonía romántica',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>El período <strong>Romántico</strong> (1820-1900) expandió la armonía clásica hasta sus límites. <strong>Chopin</strong> enriqueció la armonía con cromatismo lírico, <strong>Wagner</strong> disolvió la tonalidad con su "Tristán-Akkord" (1859), <strong>Liszt</strong> experimentó con la atonalidad, y <strong>Rachmaninoff</strong> llevó el Romanticismo tardío a su máxima expresión emocional.</p>
                    <div class="theory-citation">
                        <p>"El cromatismo romántico no destruye la tonalidad — la enriquece. Cada nota cromática crea una tensión temporal que se resuelve dentro del marco tonal, como colores que expanden la paleta sin abandonar el lienzo."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 25</span>
                    </div>
                </div>
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
                <div class="lesson-section">
                    <div class="theory-citation">
                        <p>"El acorde de sexta aumentada es uno de los acordes cromáticos más dramáticos del período romántico. Su resolución al V por expansión cromática produce un efecto de intensidad inigualable."</p>
                        <span class="theory-citation-source">— Schoenberg, <em>Tratado de Armonía</em>, Cap. 14</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca el bajo cromático descendente: C → C/B → C/Bb → Am. Siente el lamento.</li>
                        <li>Inserta un acorde disminuido de paso entre C y Dm: C → C#dim7 → Dm. Toca lento.</li>
                        <li>Practica la sexta aumentada italiana (Ab-C-F#) resolviendo al V (G-B-D) en Do mayor.</li>
                        <li>Aplica el "bajo de Chopin": toca Am debajo de C (C/A), Em debajo de G (G/E).</li>
                    </ul>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Qué es un acorde disminuido de paso?',
                    options: ['Un acorde en estado fundamental', 'Un dim7 que conecta dos acordes diatónicos vecinos por cromatismo', 'Un acorde que resuelve al I', 'Un acorde sin 3era'],
                    correct: 1,
                },
                {
                    question: '¿Cuáles son los tres tipos de sexta aumentada?',
                    options: ['Americana, Francesa, Alemana', 'Italiana, Francesa, Alemana', 'Española, Italiana, Francesa', 'Mayor, menor, disminuida'],
                    correct: 1,
                },
                {
                    question: '¿Qué es el "bajo de Chopin"?',
                    options: ['Tocar solo la mano izquierda', 'Agregar un bajo a la 3era menor inferior de la raíz', 'Un bajo que sube cromáticamente', 'Un pedal de tónica'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'japanese-anime',
            title: '21. Armonía japonesa / anime',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>La música de <strong>anime y videojuegos japoneses</strong> representa una fusión única entre la armonía romántica occidental y la sensibilidad melódica japonesa. <strong>Joe Hisaishi</strong> (Studio Ghibli) estudió armonía francesa y la fusionó con minimalismo. <strong>Nobuo Uematsu</strong> (Final Fantasy) mezcla sinfonismo romántico con progresiones de rock progresivo. La "progresión Royal Road" se ha convertido en un fenómeno cultural que define el sonido emocional del J-pop y anime.</p>
                    <div class="theory-citation">
                        <p>"La progresión IV-V-iii-vi, conocida como 'ōdō shinkō' en Japón, explota la resolución deceptiva del V al iii (en lugar del I esperado) para crear un efecto de nostalgia esperanzadora característico de la cultura pop japonesa."</p>
                        <span class="theory-citation-source">— Análisis de la progresión Royal Road en música japonesa</span>
                    </div>
                </div>
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
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Toca la progresión Royal Road en C: Fmaj7 → G7 → Em7 → Am. Repite en G y D.</li>
                        <li>Practica la modulación por mediante: toca C mayor, luego muévete a Ab mayor directamente.</li>
                        <li>Toca una progresión tipo Hisaishi: Cmaj7 → Fmaj7 → Bbmaj7 → C (con bVII prestado).</li>
                        <li>Escucha "One Summer's Day" de Hisaishi e identifica la Royal Road en la pieza.</li>
                    </ul>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuál es la progresión Royal Road (王道進行)?',
                    options: ['I - V - vi - IV', 'IV - V - iii - vi', 'ii - V - I', 'I - bVII - IV - I'],
                    correct: 1,
                },
                {
                    question: '¿Qué técnica usa Uematsu para modular en Final Fantasy?',
                    options: ['Modulación por dominante', 'Modulación por mediante (3eras)', 'Solo cambio de modo', 'No modula'],
                    correct: 1,
                },
                {
                    question: '¿Qué recurso usa Hisaishi para crear melancolía en tonalidad mayor?',
                    options: ['Solo notas agudas', 'Acordes prestados del modo menor', 'Tempos muy rápidos', 'Solo tríadas mayores'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'score-analysis',
            title: '22. Análisis de partituras',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>El <strong>análisis armónico</strong> como disciplina formal se desarrolló en el siglo XIX con teóricos como <strong>Riemann</strong> y <strong>Schenker</strong>. Schenker propuso que toda obra tonal podía reducirse a una estructura fundamental (Ursatz). Hoy, el análisis armónico es una herramienta esencial para comprender, interpretar y componer música en cualquier estilo.</p>
                    <div class="theory-citation">
                        <p>"Analizar es escuchar con inteligencia. El análisis armónico no es un fin en sí mismo, sino una herramienta para comprender las decisiones del compositor y enriquecer nuestra propia interpretación y composición."</p>
                        <span class="theory-citation-source">— Laitz, <em>The Complete Musician</em>, Cap. 28</span>
                    </div>
                </div>
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
                <div class="lesson-section">
                    <div class="theory-citation">
                        <p>"Un análisis completo no se limita a etiquetar acordes. Debe revelar la lógica del discurso musical: cómo se conectan las frases, dónde hay tensión y resolución, y cuál es la forma general de la obra."</p>
                        <span class="theory-citation-source">— Kostka & Payne, <em>Armonía Tonal</em>, Cap. 25</span>
                    </div>
                </div>
                <div class="lesson-section">
                    <h3>Ejercicios prácticos</h3>
                    <ul>
                        <li>Analiza "Happy Birthday": identifica tonalidad, acordes (I, IV, V), funciones y cadencia final.</li>
                        <li>Toma una canción pop que conozcas y cifra los acordes con números romanos.</li>
                        <li>Analiza "Autumn Leaves": identifica los ii-V-I mayor y menor, las cadencias y las modulaciones.</li>
                        <li>Practica identificar notas no armónicas: toca una melodía sobre un acorde y marca las notas de paso, bordaduras y retardos.</li>
                    </ul>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Cuál es el primer paso del análisis armónico?',
                    options: ['Numerar acordes', 'Identificar la tonalidad', 'Buscar dominantes secundarios', 'Identificar notas de paso'],
                    correct: 1,
                },
                {
                    question: '¿Qué nota no armónica sale y vuelve a la misma nota del acorde?',
                    options: ['Nota de paso', 'Bordadura', 'Retardo', 'Anticipación'],
                    correct: 1,
                },
                {
                    question: '¿Cuáles son las tres funciones armónicas principales?',
                    options: ['Mayor, menor, disminuida', 'Tónica, Subdominante, Dominante', 'Raíz, tercera, quinta', 'Aguda, media, grave'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'study-roadmap',
            title: '23. Ruta de estudio completa',
            content: `
                <div class="lesson-section">
                    <h3>Contexto</h3>
                    <p>El estudio de la armonía es un viaje progresivo. Los grandes pedagogos musicales — desde <strong>Nadia Boulanger</strong> (maestra de Copland, Piazzolla, Quincy Jones) hasta los métodos modernos del <strong>Berklee College of Music</strong> — coinciden en que la clave es construir sobre bases sólidas, dominando cada nivel antes de avanzar al siguiente.</p>
                    <div class="theory-citation">
                        <p>"El estudio de la armonía debe ser práctico. La teoría sin la práctica en el teclado es letra muerta. Cada concepto debe internalizarse mediante la ejecución, la audición y la composición."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Prefacio</span>
                    </div>
                </div>
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
                <div class="lesson-section">
                    <div class="theory-citation">
                        <p>"La práctica constante y progresiva es más valiosa que sesiones largas e irregulares. Treinta minutos diarios de estudio enfocado producen mejores resultados que tres horas esporádicas."</p>
                        <span class="theory-citation-source">— Laitz, <em>The Complete Musician</em>, Prefacio</span>
                    </div>
                </div>
            `,
            quizzes: [
                {
                    question: '¿Qué se debe dominar antes de estudiar acordes extendidos?',
                    options: ['Armonía modal', 'Tríadas, inversiones y acordes de séptima', 'Análisis de partituras', 'Armonía impresionista'],
                    correct: 1,
                },
                {
                    question: '¿Cuál es la cadencia más importante en jazz?',
                    options: ['I-IV-V-I', 'ii-V-I', 'IV-V-iii-vi', 'I-bVII-IV'],
                    correct: 1,
                }
            ]
        },
        {
            id: 'hymns',
            title: '24. Himnos al piano',
            content: `
                <div class="lesson-section">
                    <h3>Contexto histórico</h3>
                    <p>Los <strong>himnos congregacionales</strong> tienen una tradición que se remonta a la <strong>Reforma Protestante</strong> (siglo XVI), cuando Martín Lutero impulsó el canto congregacional en lengua vernácula. La tradición coral de <strong>J.S. Bach</strong> — con sus más de 370 corales armonizados — estableció el estándar de la escritura a 4 voces (SATB) que los himnarios modernos siguen utilizando.</p>
                    <div class="theory-citation">
                        <p>"Los corales de Bach representan la culminación del arte de armonizar una melodía. Su conducción de voces es un modelo de voice leading eficiente que todo estudiante de armonía debe estudiar."</p>
                        <span class="theory-citation-source">— Piston, <em>Armonía</em>, Cap. 6</span>
                    </div>
                </div>
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
                        <strong>Voice leading (conducción de voces):</strong> Mueve cada voz la menor distancia posible al cambiar de acorde. Si una nota es común entre dos acordes, mantenla en su lugar. Como dice Aldwell & Schachter en <em>Armonía y Conducción de Voces</em>: "La buena conducción de voces es aquella en la que cada voz se mueve lo menos posible."
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
            quizzes: [
                {
                    question: '¿Cuál es la mejor estrategia cuando un himno tiene un acorde diferente en cada tiempo del compás?',
                    options: [
                        'Tocar todos los acordes arpegiados rápidamente',
                        'Usar voice leading (mínimo movimiento) e inversiones para mantener notas comunes',
                        'Ignorar algunos acordes y tocar solo el primero del compás',
                        'Tocar solo la melodía sin armonía'
                    ],
                    correct: 1,
                },
                {
                    question: '¿Qué es un passing chord (acorde de paso)?',
                    options: [
                        'Un acorde que se toca muy rápido',
                        'Un acorde insertado entre dos acordes escritos para crear movimiento cromático',
                        'Un acorde que se omite',
                        'Un acorde que solo usa teclas negras'
                    ],
                    correct: 1,
                },
                {
                    question: '¿Cuál es el primer paso al estudiar un himno nuevo?',
                    options: [
                        'Tocar manos juntas inmediatamente',
                        'Cantar o tocar solo la melodía (soprano)',
                        'Agregar passing chords',
                        'Tocar con walking bass'
                    ],
                    correct: 1,
                }
            ]
        },
        // ============ TOOL LESSONS (from Harmony tab) ============
        {
            id: 'tool-sus4',
            title: '1. Dominantes SUS4',
            type: 'tool',
            toolInit: 'initSus4',
            content: `
                <div class="lesson-section">
                    <h3>Dominantes SUS4</h3>
                    <p>Resolución clásica: V7sus4 → V7 → I para las 12 tonalidades. Click en una fila para escuchar la secuencia.</p>
                    <div id="sus4-table-container"></div>
                </div>
                <div class="lesson-section">
                    <div class="edu-img" onclick="openImageModal('/reference/dominantes-sus4.png')">
                        <img src="/reference/dominantes-sus4.png" alt="Dominantes SUS4" loading="lazy">
                        <div class="edu-img-caption">Diagrama de dominantes SUS4: V7sus4 → V7 → I</div>
                    </div>
                    <h4>Qué son los dominantes sus4</h4>
                    <p>El <strong>V7sus4</strong> reemplaza la 3era del acorde dominante por la 4ta, creando una <strong>tensión extra</strong> que luego se resuelve al V7 y finalmente al I.</p>
                    <div class="edu-concept">
                        <h5>Voice leading</h5>
                        <p>G7sus4 → G7 → C: la nota Do (4ta) baja a Si (3era), y luego Si resuelve a Do de la tónica.</p>
                    </div>
                </div>
            `,
            quizzes: [{ question: '¿Qué nota reemplaza la 3era en un acorde sus4?', options: ['La 2da', 'La 4ta', 'La 5ta', 'La 7ma'], correct: 1 }]
        },
        {
            id: 'tool-cadences',
            title: '2. Cadencias interactivas',
            type: 'tool',
            toolInit: 'initCadences',
            content: `
                <div class="lesson-section">
                    <h3>Cadencias</h3>
                    <p>Escucha y aprende las cadencias más importantes de la música.</p>
                    <div class="harmony-key-select">
                        <label>Tonalidad: <select id="cadenceKeySelect" class="harmony-key-input">
                            <option value="C">C Mayor</option><option value="G">G Mayor</option>
                            <option value="D">D Mayor</option><option value="A">A Mayor</option>
                            <option value="E">E Mayor</option><option value="Bb">Bb Mayor</option>
                            <option value="F">F Mayor</option><option value="Eb">Eb Mayor</option>
                            <option value="Ab">Ab Mayor</option>
                        </select></label>
                        <button id="btnLoadCadences" class="btn btn-accent">Cargar</button>
                    </div>
                    <div id="cadences-container" class="cadences-grid"></div>
                </div>
                <div class="lesson-section">
                    <h4>Guía de cadencias</h4>
                    <p>Las cadencias son la <strong>puntuación</strong> de la música.</p>
                    <div class="edu-concept"><h5>Auténtica perfecta (V→I)</h5><p>La resolución más fuerte y conclusiva.</p></div>
                    <div class="edu-concept"><h5>Plagal (IV→I)</h5><p>Resolución suave. Cadencia "Amén".</p></div>
                    <div class="edu-concept"><h5>Rota (V→vi)</h5><p>Engaño armónico: el V no va al I esperado.</p></div>
                    <div class="edu-concept"><h5>ii-V-I</h5><p>La cadencia reina del jazz.</p></div>
                    <div class="edu-concept"><h5>Royal Road (IV→V→iii→vi)</h5><p>Progresión característica del J-pop y anime.</p></div>
                    <div class="edu-concept"><h5>Andaluza (iv→III→II→I)</h5><p>Cadencia descendente del flamenco.</p></div>
                    <div class="edu-concept"><h5>Backdoor (bVII7→I)</h5><p>Resolución "por la puerta trasera". Sonido cálido y jazzy.</p></div>
                </div>
            `,
            quizzes: [{ question: '¿Qué cadencia es conocida como la cadencia "Amén"?', options: ['Auténtica', 'Plagal', 'Rota', 'Andaluza'], correct: 1 }]
        },
        {
            id: 'tool-tritone',
            title: '3. Sustitución tritonal',
            type: 'tool',
            toolInit: 'initTritone',
            content: `
                <div class="lesson-section">
                    <h3>Sustitución tritonal</h3>
                    <p>Dado un acorde dominante, encuentra su sustitución tritonal.</p>
                    <div class="harmony-input-row">
                        <label>Acorde: <input type="text" id="tritoneInput" placeholder="Ej: G7, Db7, A7" class="harmony-text-input"></label>
                        <button id="btnTritone" class="btn btn-accent">Calcular</button>
                        <button id="btnTritoneAll" class="btn btn-clear">Ver todas las tonalidades</button>
                    </div>
                    <div id="tritone-result" class="harmony-result"></div>
                    <div id="tritone-all-keys" class="harmony-result hidden"></div>
                </div>
                <div class="lesson-section">
                    <h4>Por qué funciona la sustitución tritonal</h4>
                    <p>El <strong>tritono</strong> (6 semitonos) es la tensión clave del acorde dominante. La 3era y la 7ma del V7 forman un tritono. El bII7 comparte exactamente esas mismas notas, por eso funciona como sustituto.</p>
                    <div class="edu-concept">
                        <h5>Ejemplo en C mayor</h5>
                        <p><strong>G7</strong> tiene B y F (tritono). <strong>Db7</strong> también tiene F y B (=Cb). ¡Mismo tritono, distinta raíz!</p>
                    </div>
                </div>
            `,
            quizzes: [{ question: '¿Cuántos semitonos tiene el intervalo de tritono?', options: ['4', '5', '6', '7'], correct: 2 }]
        },
        {
            id: 'tool-modal',
            title: '4. Intercambio modal',
            type: 'tool',
            toolInit: 'initModalInterchange',
            content: `
                <div class="lesson-section">
                    <h3>Intercambio modal</h3>
                    <p>Acordes prestados del modo paralelo.</p>
                    <div class="harmony-input-row">
                        <label>Tonalidad: <select id="modalInterchangeKey" class="harmony-key-input">
                            <option value="C">C Mayor</option><option value="G">G Mayor</option>
                            <option value="D">D Mayor</option><option value="A">A Mayor</option>
                            <option value="F">F Mayor</option><option value="Bb">Bb Mayor</option>
                            <option value="Eb">Eb Mayor</option>
                        </select></label>
                        <label>Modo: <select id="modalInterchangeMode" class="harmony-key-input">
                            <option value="major">Mayor (presta de menor)</option>
                            <option value="minor">Menor (presta de mayor)</option>
                        </select></label>
                        <button id="btnModalInterchange" class="btn btn-accent">Mostrar</button>
                    </div>
                    <div id="modal-interchange-result" class="harmony-result"></div>
                </div>
                <div class="lesson-section">
                    <h4>Acordes prestados más comunes</h4>
                    <ul>
                        <li><strong>bVI</strong> — El más popular. Pasa de mayor a menor.</li>
                        <li><strong>iv</strong> — Giro melancólico inesperado.</li>
                        <li><strong>bVII</strong> — Sonido de rock por excelencia.</li>
                        <li><strong>bIII</strong> — Desvío tonal dramático.</li>
                    </ul>
                </div>
            `,
            quizzes: [{ question: '¿Qué acorde prestado es el más popular en música pop?', options: ['bIII', 'iv', 'bVI', 'bVII'], correct: 2 }]
        },
        {
            id: 'tool-negative',
            title: '5. Armonía negativa',
            type: 'tool',
            toolInit: 'initNegativeHarmony',
            content: `
                <div class="lesson-section">
                    <h3>Armonía negativa</h3>
                    <p>Reflejo armónico de acordes sobre el eje de simetría (concepto de Ernst Levy / Jacob Collier).</p>
                    <div class="harmony-input-row">
                        <label>Tonalidad: <select id="negativeHarmonyKey" class="harmony-key-input">
                            <option value="C">C Mayor</option><option value="G">G Mayor</option>
                            <option value="D">D Mayor</option><option value="A">A Mayor</option>
                            <option value="F">F Mayor</option><option value="Bb">Bb Mayor</option>
                            <option value="Eb">Eb Mayor</option>
                        </select></label>
                        <button id="btnNegativeHarmony" class="btn btn-accent">Calcular</button>
                    </div>
                    <div id="negative-harmony-result" class="harmony-result"></div>
                </div>
                <div class="lesson-section">
                    <h4>El eje de simetría</h4>
                    <p>En C mayor, el eje está entre <strong>E y Eb</strong>. Cada nota se "refleja" al otro lado. Resultado: un acorde mayor se convierte en menor y viceversa.</p>
                    <div class="edu-concept">
                        <h5>Ejemplo clásico</h5>
                        <p>En C mayor: <strong>G7 → Fm6</strong> (o Dm7b5). El dominante se transforma en subdominante menor.</p>
                    </div>
                </div>
            `,
            quizzes: [{ question: '¿Quién popularizó la armonía negativa en la música moderna?', options: ['Bach', 'Chopin', 'Jacob Collier', 'Debussy'], correct: 2 }]
        },
        {
            id: 'tool-chopin-bass',
            title: '6. Bajo de Chopin',
            type: 'tool',
            toolInit: 'initChopinBass',
            content: `
                <div class="lesson-section">
                    <h3>Bajo de Chopin (3era menor)</h3>
                    <p>Voicing con bajo a la 3era menor inferior. Sonido romántico y profundo.</p>
                    <div class="chopin-explanation">
                        <div class="chopin-diagram">
                            <div class="chopin-step"><span class="chopin-label">Raíz</span><span class="chopin-note" id="chopinDiagramRoot">C</span></div>
                            <div class="chopin-arrow">↓ 3 semitonos</div>
                            <div class="chopin-step"><span class="chopin-label">Bajo</span><span class="chopin-note chopin-bass-note" id="chopinDiagramBass">A</span></div>
                        </div>
                    </div>
                    <div class="harmony-input-row">
                        <label>Acorde: <input type="text" id="chopinInput" placeholder="Ej: C" class="harmony-text-input"></label>
                        <button id="btnChopin" class="btn btn-accent">Calcular</button>
                        <button id="btnChopinAll" class="btn btn-clear">Ver todas las tonalidades</button>
                    </div>
                    <div id="chopin-result" class="harmony-result"></div>
                    <div id="chopin-all-keys" class="harmony-result hidden"></div>
                </div>
                <div class="lesson-section">
                    <h4>Por qué suena tan bien</h4>
                    <p>La nota del bajo a la 3era menor inferior crea un acorde de séptima implícito. C con bajo en A suena como Am7, dando un color más complejo.</p>
                </div>
            `,
            quizzes: [{ question: '¿A qué intervalo se coloca el bajo en la técnica de Chopin?', options: ['3era mayor inferior', '3era menor inferior', '5ta justa inferior', '2da mayor inferior'], correct: 1 }]
        },
        {
            id: 'tool-melody-suggest',
            title: '7. Sugerencias desde melodía',
            type: 'tool',
            toolInit: 'initMelodySuggestions',
            content: `
                <div class="lesson-section">
                    <h3>Sugerencias desde melodía</h3>
                    <p>Graba una melodía en el piano y obtén sugerencias de acordes compatibles.</p>
                    <div class="harmony-input-row">
                        <button id="btnSuggestFromMelody" class="btn btn-accent">Analizar melodía grabada</button>
                    </div>
                    <div id="melody-suggest-result" class="harmony-result"></div>
                </div>
                <div class="lesson-section">
                    <h4>Cómo funciona</h4>
                    <p>El analizador detecta la tonalidad probable de tu melodía y sugiere acordes diatónicos y dominantes secundarios compatibles con las notas que tocaste.</p>
                </div>
            `,
            quizzes: [{ question: '¿Qué necesitas hacer antes de analizar una melodía?', options: ['Seleccionar tonalidad', 'Grabar notas en el piano', 'Elegir escala', 'Ajustar BPM'], correct: 1 }]
        },
        {
            id: 'tool-cinematic',
            title: '8. Progresiones cinematográficas',
            type: 'tool',
            toolInit: 'initCinematic',
            content: `
                <div class="lesson-section">
                    <h3>Progresiones Cinematográficas</h3>
                    <p>Progresiones inspiradas en Studio Ghibli, Final Fantasy y bandas sonoras. Click para escuchar.</p>
                    <div class="harmony-input-row">
                        <label>Tonalidad: <select id="cinematicKeySelect" class="harmony-key-input">
                            <option value="C">C Mayor</option><option value="G">G Mayor</option>
                            <option value="D">D Mayor</option><option value="A">A Mayor</option>
                            <option value="E">E Mayor</option><option value="Bb">Bb Mayor</option>
                            <option value="F">F Mayor</option><option value="Eb">Eb Mayor</option>
                            <option value="Ab">Ab Mayor</option>
                        </select></label>
                        <label>Estilo: <select id="cinematicStyleSelect" class="harmony-key-input">
                            <option value="">Todos</option>
                            <option value="ghibli">Studio Ghibli / Hisaishi</option>
                            <option value="final_fantasy">Final Fantasy / Uematsu</option>
                            <option value="cinematic">Cinematográfico General</option>
                        </select></label>
                        <button id="btnLoadCinematic" class="btn btn-accent">Cargar</button>
                    </div>
                    <div id="cinematic-container" class="harmony-result"></div>
                </div>
            `,
            quizzes: [{ question: '¿Qué compositor es conocido por las bandas sonoras de Studio Ghibli?', options: ['Uematsu', 'Williams', 'Hisaishi', 'Zimmer'], correct: 2 }]
        },
        {
            id: 'tool-improv',
            title: '9. Guía de improvisación',
            type: 'tool',
            toolInit: 'initImprovisation',
            content: `
                <div class="lesson-section">
                    <h3>Guía de Improvisación</h3>
                    <p>Para cada acorde diatónico: escalas, notas guía, tensiones y notas a evitar.</p>
                    <div class="harmony-input-row">
                        <label>Tonalidad: <select id="improvKeySelect" class="harmony-key-input">
                            <option value="C">C Mayor</option><option value="G">G Mayor</option>
                            <option value="D">D Mayor</option><option value="A">A Mayor</option>
                            <option value="E">E Mayor</option><option value="Bb">Bb Mayor</option>
                            <option value="F">F Mayor</option><option value="Eb">Eb Mayor</option>
                            <option value="Ab">Ab Mayor</option>
                        </select></label>
                        <button id="btnLoadImprov" class="btn btn-accent">Cargar</button>
                    </div>
                    <div id="improv-container" class="harmony-result"></div>
                </div>
            `,
            quizzes: [{ question: '¿Qué son las "notas guía" (guide tones) de un acorde?', options: ['La fundamental y la quinta', 'La tercera y la séptima', 'La novena y la oncena', 'Todas las notas del acorde'], correct: 1 }]
        },
        {
            id: 'tool-mediants',
            title: '10. Mediantes cromáticas',
            type: 'tool',
            toolInit: 'initMediants',
            content: `
                <div class="lesson-section">
                    <h3>Mediantes Cromáticas</h3>
                    <p>Acordes cuya raíz está a distancia de 3ra de la tónica. Cambios dramáticos de color, fundamentales en música de cine.</p>
                    <div class="harmony-input-row">
                        <label>Tonalidad: <select id="mediantsKeySelect" class="harmony-key-input">
                            <option value="C">C Mayor</option><option value="G">G Mayor</option>
                            <option value="D">D Mayor</option><option value="A">A Mayor</option>
                            <option value="E">E Mayor</option><option value="Bb">Bb Mayor</option>
                            <option value="F">F Mayor</option><option value="Eb">Eb Mayor</option>
                            <option value="Ab">Ab Mayor</option>
                        </select></label>
                        <button id="btnLoadMediants" class="btn btn-accent">Cargar</button>
                    </div>
                    <div id="mediants-container" class="harmony-result"></div>
                </div>
            `,
            quizzes: [{ question: '¿A qué distancia interválica está una mediante de la tónica?', options: ['2da', '3ra', '4ta', '5ta'], correct: 1 }]
        },
        {
            id: 'tool-composition',
            title: '11. Guía de composición',
            type: 'tool',
            toolInit: 'initComposition',
            content: `
                <div class="lesson-section">
                    <h3>Guía de Composición</h3>
                    <p>Técnicas detalladas: paleta armónica, melodía, ritmo, voicing, forma y piezas de referencia.</p>
                    <div class="harmony-input-row">
                        <label>Estilo: <select id="composeStyleSelect" class="harmony-key-input">
                            <option value="ghibli">Studio Ghibli / Hisaishi</option>
                            <option value="final_fantasy">Final Fantasy / Uematsu</option>
                            <option value="cinematic">Cinematográfico General</option>
                        </select></label>
                        <button id="btnLoadCompose" class="btn btn-accent">Cargar</button>
                    </div>
                    <div id="compose-container" class="harmony-result"></div>
                </div>
            `,
            quizzes: [{ question: '¿Qué elemento es fundamental para una buena composición cinematográfica?', options: ['Usar solo acordes mayores', 'Paleta armónica variada con intercambio modal', 'Tocar siempre forte', 'Evitar la melodía'], correct: 1 }]
        },
        {
            id: 'tool-melody-resources',
            title: '12. Recursos de melodía',
            type: 'tool',
            toolInit: null,
            content: `
                <div class="lesson-section">
                    <h3>Recursos de melodía</h3>
                    <p>Técnicas para enriquecer tus melodías usando notas fuera del acorde.</p>
                    <div class="edu-img" onclick="openImageModal('/reference/recursos-melodia.png')">
                        <img src="/reference/recursos-melodia.png" alt="Recursos de melodía" loading="lazy">
                        <div class="edu-img-caption">Notas de paso, anticipaciones, floreos y otros recursos melódicos</div>
                    </div>
                    <div class="melody-resources-grid">
                        <div class="melody-resource-card">
                            <h4>Notas de paso</h4>
                            <p>Entre dos notas del acorde, agrega notas de la escala (ascendente o descendente).</p>
                            <button class="btn btn-accent btn-sm" onclick="HarmonyTools.playMelodyExample('passing')">Escuchar ejemplo</button>
                        </div>
                        <div class="melody-resource-card">
                            <h4>Anticipaciones</h4>
                            <p>Toca una nota del siguiente acorde antes de que llegue.</p>
                            <button class="btn btn-accent btn-sm" onclick="HarmonyTools.playMelodyExample('anticipation')">Escuchar ejemplo</button>
                        </div>
                        <div class="melody-resource-card">
                            <h4>Floreos</h4>
                            <p>Toca la misma nota dos veces con una nota vecina en el medio.</p>
                            <button class="btn btn-accent btn-sm" onclick="HarmonyTools.playMelodyExample('floreo')">Escuchar ejemplo</button>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [{ question: '¿Qué es una nota de paso?', options: ['Una nota del acorde', 'Una nota entre dos notas del acorde, de la escala', 'Una nota sostenida', 'Un silencio'], correct: 1 }]
        },
        // ============ REFERENCE LESSONS ============
        {
            id: 'ref-scale-browser',
            title: '1. Navegador de escalas',
            type: 'tool',
            toolInit: 'initScaleBrowser',
            content: `
                <div class="lesson-section">
                    <h3>Navegador de escalas</h3>
                    <p>Explora todas las escalas en las 12 tonalidades. Cada tarjeta muestra las notas, un mini piano con las teclas resaltadas y los acordes diatónicos.</p>
                    <div class="scale-browser-controls">
                        <button class="btn btn-accent scale-type-btn active" data-scale-type="major">Mayores</button>
                        <button class="btn btn-clear scale-type-btn" data-scale-type="natural_minor">Menores</button>
                        <button class="btn btn-clear scale-type-btn" data-scale-type="harmonic_minor">Armónica</button>
                        <button class="btn btn-clear scale-type-btn" data-scale-type="melodic_minor">Melódica</button>
                        <button class="btn btn-clear scale-type-btn" data-scale-type="dorian">Dórica</button>
                        <button class="btn btn-clear scale-type-btn" data-scale-type="phrygian">Frigia</button>
                        <button class="btn btn-clear scale-type-btn" data-scale-type="lydian">Lidia</button>
                        <button class="btn btn-clear scale-type-btn" data-scale-type="mixolydian">Mixolidia</button>
                        <button class="btn btn-clear scale-type-btn" data-scale-type="locrian">Locria</button>
                        <button class="btn btn-clear scale-type-btn" data-scale-type="pentatonic_major">Pentatónica</button>
                        <button class="btn btn-clear scale-type-btn" data-scale-type="blues">Blues</button>
                        <button class="btn btn-clear scale-type-btn" data-scale-type="whole_tone">Tono entero</button>
                    </div>
                    <div id="scale-browser-grid" class="scale-browser-grid"></div>
                </div>
            `,
            quizzes: [{ question: '¿Cuántas notas tiene una escala pentatónica?', options: ['5', '6', '7', '8'], correct: 0 }]
        },
        {
            id: 'ref-nomenclature',
            title: '2. Nomenclatura de acordes',
            type: 'reference',
            content: `
                <div class="lesson-section">
                    <h3>Nomenclatura de acordes</h3>
                    <p>Guía de símbolos y convenciones usados en cifrado de acordes.</p>
                    <div class="reference-tables">
                        <div class="ref-table-card">
                            <h4>Símbolos básicos</h4>
                            <table class="ref-table">
                                <tr><th>Símbolo</th><th>Significado</th><th>Ejemplo</th></tr>
                                <tr><td>(nada)</td><td>Mayor</td><td>C = Do mayor</td></tr>
                                <tr><td>m</td><td>Menor</td><td>Cm = Do menor</td></tr>
                                <tr><td>7</td><td>Dominante (7ma menor)</td><td>G7 = Sol dom7</td></tr>
                                <tr><td>maj7 / Δ7</td><td>Séptima mayor</td><td>Cmaj7</td></tr>
                                <tr><td>m7</td><td>Menor con 7ma menor</td><td>Am7</td></tr>
                                <tr><td>dim / °</td><td>Disminuido (b3, b5)</td><td>Bdim</td></tr>
                                <tr><td>aug / +</td><td>Aumentado (#5)</td><td>Caug</td></tr>
                                <tr><td>ø / m7b5</td><td>Semidisminuido</td><td>Bm7b5</td></tr>
                            </table>
                        </div>
                        <div class="ref-table-card">
                            <h4>Suspendidos y agregados</h4>
                            <table class="ref-table">
                                <tr><th>Símbolo</th><th>Significado</th><th>Fórmula</th></tr>
                                <tr><td>sus2</td><td>Suspendido 2da</td><td>1 - 2 - 5</td></tr>
                                <tr><td>sus4</td><td>Suspendido 4ta</td><td>1 - 4 - 5</td></tr>
                                <tr><td>add9</td><td>Agrega 9na (sin 7ma)</td><td>1 - 3 - 5 - 9</td></tr>
                                <tr><td>6</td><td>Agrega 6ta</td><td>1 - 3 - 5 - 6</td></tr>
                                <tr><td>7sus4</td><td>Dominante suspendido</td><td>1 - 4 - 5 - b7</td></tr>
                            </table>
                        </div>
                        <div class="ref-table-card">
                            <h4>Acordes extendidos</h4>
                            <table class="ref-table">
                                <tr><th>Símbolo</th><th>Significado</th><th>Incluye</th></tr>
                                <tr><td>9</td><td>Dominante novena</td><td>1 - 3 - 5 - b7 - 9</td></tr>
                                <tr><td>maj9</td><td>Mayor novena</td><td>1 - 3 - 5 - 7 - 9</td></tr>
                                <tr><td>m9</td><td>Menor novena</td><td>1 - b3 - 5 - b7 - 9</td></tr>
                                <tr><td>11</td><td>Dominante oncena</td><td>1 - 3 - 5 - b7 - 9 - 11</td></tr>
                                <tr><td>13</td><td>Dominante trecena</td><td>1 - 3 - 5 - b7 - 9 - 11 - 13</td></tr>
                            </table>
                        </div>
                        <div class="ref-table-card">
                            <h4>Alteraciones y slash</h4>
                            <table class="ref-table">
                                <tr><th>Símbolo</th><th>Significado</th><th>Ejemplo</th></tr>
                                <tr><td>b5</td><td>5ta disminuida</td><td>C7b5</td></tr>
                                <tr><td>#5</td><td>5ta aumentada</td><td>C7#5</td></tr>
                                <tr><td>b9</td><td>9na menor</td><td>G7b9</td></tr>
                                <tr><td>#9</td><td>9na aumentada</td><td>G7#9 (acorde Hendrix)</td></tr>
                                <tr><td>/X</td><td>Acorde slash (bajo = X)</td><td>C/E = Do con bajo en Mi</td></tr>
                            </table>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [{ question: '¿Qué significa el símbolo "ø" en un acorde?', options: ['Aumentado', 'Disminuido', 'Semidisminuido', 'Suspendido'], correct: 2 }]
        },
        {
            id: 'ref-quick-tables',
            title: '3. Tablas rápidas',
            type: 'reference',
            content: `
                <div class="lesson-section">
                    <h3>Tablas rápidas de referencia</h3>
                    <div class="reference-tables">
                        <div class="ref-table-card">
                            <h4>Notas: Español - Inglés</h4>
                            <table class="ref-table">
                                <tr><th>Español</th><th>Inglés</th></tr>
                                <tr><td>Do</td><td>C</td></tr><tr><td>Re</td><td>D</td></tr>
                                <tr><td>Mi</td><td>E</td></tr><tr><td>Fa</td><td>F</td></tr>
                                <tr><td>Sol</td><td>G</td></tr><tr><td>La</td><td>A</td></tr>
                                <tr><td>Si</td><td>B</td></tr>
                            </table>
                        </div>
                        <div class="ref-table-card">
                            <h4>Fórmulas de acordes (semitonos)</h4>
                            <table class="ref-table">
                                <tr><th>Tipo</th><th>Fórmula</th><th>Ejemplo</th></tr>
                                <tr><td>Mayor</td><td>4 + 3</td><td>C E G</td></tr>
                                <tr><td>Menor</td><td>3 + 4</td><td>Cm: C Eb G</td></tr>
                                <tr><td>Aumentado</td><td>4 + 4</td><td>Caug: C E G#</td></tr>
                                <tr><td>Disminuido</td><td>3 + 3</td><td>Cdim: C Eb Gb</td></tr>
                                <tr><td>dom7</td><td>4+3+3</td><td>C7: C E G Bb</td></tr>
                                <tr><td>maj7</td><td>4+3+4</td><td>Cmaj7: C E G B</td></tr>
                                <tr><td>m7</td><td>3+4+3</td><td>Cm7: C Eb G Bb</td></tr>
                            </table>
                        </div>
                        <div class="ref-table-card">
                            <h4>Grados y funciones</h4>
                            <table class="ref-table">
                                <tr><th>Grado</th><th>Numeral</th><th>Función</th></tr>
                                <tr><td>1</td><td>I</td><td class="fn-tonic">Tónica (T)</td></tr>
                                <tr><td>2</td><td>ii</td><td class="fn-subdominant">Subdominante (SD)</td></tr>
                                <tr><td>3</td><td>iii</td><td class="fn-tonic">Tónica (T)</td></tr>
                                <tr><td>4</td><td>IV</td><td class="fn-subdominant">Subdominante (SD)</td></tr>
                                <tr><td>5</td><td>V</td><td class="fn-dominant">Dominante (D)</td></tr>
                                <tr><td>6</td><td>vi</td><td class="fn-tonic">Tónica (T)</td></tr>
                                <tr><td>7</td><td>vii°</td><td class="fn-dominant">Dominante (D)</td></tr>
                            </table>
                        </div>
                        <div class="ref-table-card">
                            <h4>Intervalos</h4>
                            <table class="ref-table">
                                <tr><th>ST</th><th>Nombre</th><th>Abrev.</th></tr>
                                <tr><td>0</td><td>Unísono</td><td>1</td></tr>
                                <tr><td>1</td><td>2da menor</td><td>b2</td></tr>
                                <tr><td>2</td><td>2da mayor</td><td>2</td></tr>
                                <tr><td>3</td><td>3era menor</td><td>b3</td></tr>
                                <tr><td>4</td><td>3era mayor</td><td>3</td></tr>
                                <tr><td>5</td><td>4ta justa</td><td>4</td></tr>
                                <tr><td>6</td><td>Tritono</td><td>b5</td></tr>
                                <tr><td>7</td><td>5ta justa</td><td>5</td></tr>
                                <tr><td>8</td><td>6ta menor</td><td>b6</td></tr>
                                <tr><td>9</td><td>6ta mayor</td><td>6</td></tr>
                                <tr><td>10</td><td>7ma menor</td><td>b7</td></tr>
                                <tr><td>11</td><td>7ma mayor</td><td>7</td></tr>
                                <tr><td>12</td><td>Octava</td><td>8</td></tr>
                            </table>
                        </div>
                    </div>
                </div>
            `,
            quizzes: [{ question: '¿Cuántos semitonos tiene una 5ta justa?', options: ['5', '6', '7', '8'], correct: 2 }]
        },
        {
            id: 'ref-images',
            title: '4. Imágenes de referencia',
            type: 'reference',
            content: `
                <div class="lesson-section">
                    <h3>Imágenes de referencia</h3>
                    <p>Galería de diagramas, tablas y esquemas de teoría musical.</p>
                    <div id="reference-gallery" class="reference-gallery"></div>
                </div>
            `,
            quizzes: []
        },
        {
            id: 'ref-pdf',
            title: '5. PDF MusiHacks',
            type: 'reference',
            content: `
                <div class="lesson-section">
                    <h3>El Gran Libro de Armonía de MusiHacks</h3>
                    <p>Manual completo de armonía funcional en PDF.</p>
                    <div class="home-course">
                        <div class="course-card">
                            <div class="course-icon">📖</div>
                            <div class="course-info">
                                <h4>El Gran Libro de Armonía de MusiHacks</h4>
                                <p>Manual completo de armonía funcional.</p>
                                <a href="/reference/El%20Gran%20Libro%20de%20Armon%C3%ADa%20de%20Musihacks.pdf" target="_blank" class="btn btn-accent">Abrir PDF</a>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            quizzes: []
        },
        {
            id: 'ref-curriculum',
            title: '6. Ruta del Compositor',
            type: 'reference',
            content: `
                <div class="lesson-section">
                    <h3>Ruta del Compositor</h3>
                    <p>5 niveles progresivos para componer como Chopin, Rachmaninoff, Hisaishi y Uematsu.</p>
                </div>
                <div class="lesson-section">
                    <details class="resource-category" open>
                        <summary class="resource-category-title">Nivel 1 — Fundamentos</summary>
                        <div class="resource-grid">
                            <div class="resource-card resource-book"><div class="resource-badge">Book</div><h4>Music Theory for the Self-Taught Musician</h4><p class="resource-author">Will Metz</p><p>Punto de inicio amigable: notas, intervalos, escalas, acordes y progresiones básicas.</p></div>
                            <div class="resource-card resource-video"><div class="resource-badge">YouTube</div><h4>Michael New — Music Theory from the Ground Up</h4><p class="resource-author">Michael New</p><p>Explicaciones claras con piano. Desde "qué es una nota" hasta acordes, escalas, modos.</p></div>
                        </div>
                    </details>
                </div>
                <div class="lesson-section">
                    <details class="resource-category">
                        <summary class="resource-category-title">Nivel 2 — Armonía Funcional</summary>
                        <div class="resource-grid">
                            <div class="resource-card resource-book"><div class="resource-badge">Book</div><h4>Tonal Harmony (Kostka & Payne)</h4><p>El textbook estándar de armonía. Acordes diatónicos, voice leading, cadencias.</p></div>
                            <div class="resource-card resource-video"><div class="resource-badge">YouTube</div><h4>Seth Monahan — Functional Harmony</h4><p>Cómo funcionan los acordes dentro de las tonalidades: tónica, predominante, dominante.</p></div>
                        </div>
                    </details>
                </div>
                <div class="lesson-section">
                    <details class="resource-category">
                        <summary class="resource-category-title">Nivel 3 — Cromática y Romántica</summary>
                        <div class="resource-grid">
                            <div class="resource-card resource-book"><div class="resource-badge">Book</div><h4>The Romantic Generation (Charles Rosen)</h4><p>Estudio profundo de la armonía romántica. Capítulos sobre Chopin, Schumann, Liszt.</p></div>
                            <div class="resource-card resource-book"><div class="resource-badge">Book</div><h4>Tonal Harmony (ch. 13+)</h4><p>Dominantes secundarios, acordes prestados, Napolitano, sextas aumentadas, modulación.</p></div>
                        </div>
                    </details>
                </div>
                <div class="lesson-section">
                    <details class="resource-category">
                        <summary class="resource-category-title">Nivel 4 — Modal y Cinematográfica</summary>
                        <div class="resource-grid">
                            <div class="resource-card resource-book"><div class="resource-badge">Book</div><h4>On the Track (Karlin & Wright)</h4><p>Guía estándar de composición para cine: función dramática de la música, orquestación, técnicas armónicas.</p></div>
                            <div class="resource-card resource-book"><div class="resource-badge">Book</div><h4>Complete Guide to Film Scoring (Richard Davis)</h4><p>Textbook de Berklee para composición audiovisual.</p></div>
                        </div>
                    </details>
                </div>
                <div class="lesson-section">
                    <details class="resource-category">
                        <summary class="resource-category-title">Nivel 5 — Composición y Maestría</summary>
                        <div class="resource-grid">
                            <div class="resource-card resource-book"><div class="resource-badge">Book</div><h4>Reharmonization Techniques (Randy Felts)</h4><p>El mejor libro de reharmonización: sustituciones, passing chords, approach chords, bajo cromático.</p></div>
                            <div class="resource-card resource-book"><div class="resource-badge">Book</div><h4>Melody in Songwriting (Jack Perricone)</h4><p>Cómo escribir melodías memorables: prosodia, contorno, ritmo, fraseo.</p></div>
                        </div>
                    </details>
                </div>
            `,
            quizzes: []
        },
    ];

    // ============ UNITS ============
    const units = [
        // Teoría (U1-U8)
        { id: 'u1', title: 'Unidad 1: Fundamentos', subtitle: 'Notas, semitonos, escalas y los cimientos de la música', icon: '🎹', color: 'red', lessonIds: ['notes', 'sharps-flats', 'english-notes', 'semitone-tone', 'scales'], section: 'teoria' },
        { id: 'u2', title: 'Unidad 2: Acordes y Tonalidad', subtitle: 'Tríadas, inversiones, séptimas y funciones armónicas', icon: '🎵', color: 'blue', lessonIds: ['triads', 'inversions', 'slash-chords', 'seventh-chords', 'tonality'], section: 'teoria' },
        { id: 'u3', title: 'Unidad 3: Armonía Intermedia', subtitle: 'Dominantes secundarios, cadencias y lectura musical', icon: '🎼', color: 'green', lessonIds: ['secondary-dominants', 'cadences', 'reading'], section: 'teoria' },
        { id: 'u4', title: 'Unidad 4: Pop Avanzado / Neo-soul', subtitle: 'Acordes extendidos y reharmonización', icon: '🎧', color: 'purple', lessonIds: ['extended-chords', 'reharmonization'], section: 'teoria' },
        { id: 'u5', title: 'Unidad 5: Jazz', subtitle: 'ii-V-I, voicing, modos y guide tones', icon: '🎷', color: 'yellow', lessonIds: ['jazz-fundamentals', 'voicing', 'modal-harmony'], section: 'teoria' },
        { id: 'u6', title: 'Unidad 6: Clásico / Impresionista', subtitle: 'Debussy, Chopin, Ravel: color, cromatismo y atmósfera', icon: '🎻', color: 'orange', lessonIds: ['impressionist', 'romantic'], section: 'teoria' },
        { id: 'u7', title: 'Unidad 7: Anime / Cine / Maestría', subtitle: 'Hisaishi, Uematsu y análisis de partituras', icon: '🎬', color: 'teal', lessonIds: ['japanese-anime', 'score-analysis'], section: 'teoria' },
        { id: 'u8', title: 'Unidad 8: Práctica Aplicada', subtitle: 'Ruta de estudio completa e himnos al piano', icon: '📖', color: 'pink', lessonIds: ['study-roadmap', 'hymns'], section: 'teoria' },
        // Herramientas Armónicas (U9-U10)
        { id: 'u9', title: 'Unidad 9: Herramientas Armónicas', subtitle: 'SUS4, cadencias, tritono, modal, negativa, Chopin bass', icon: '🔧', color: 'indigo', lessonIds: ['tool-sus4', 'tool-cadences', 'tool-tritone', 'tool-modal', 'tool-negative', 'tool-chopin-bass'], section: 'herramientas' },
        { id: 'u10', title: 'Unidad 10: Técnicas Creativas', subtitle: 'Melodía, cinematográfico, improvisación, mediantes, composición', icon: '🎨', color: 'cyan', lessonIds: ['tool-melody-suggest', 'tool-cinematic', 'tool-improv', 'tool-mediants', 'tool-composition', 'tool-melody-resources'], section: 'herramientas' },
        // Referencia (U11-U12)
        { id: 'u11', title: 'Unidad 11: Escalas y Referencia', subtitle: 'Navegador de escalas, nomenclatura, tablas rápidas, imágenes', icon: '📊', color: 'emerald', lessonIds: ['ref-scale-browser', 'ref-nomenclature', 'ref-quick-tables', 'ref-images'], section: 'referencia' },
        { id: 'u12', title: 'Unidad 12: Recursos Complementarios', subtitle: 'PDF MusiHacks y ruta del compositor', icon: '📚', color: 'amber', lessonIds: ['ref-pdf', 'ref-curriculum'], section: 'referencia' },
    ];

    let completedLessons = new Set();

    // Navigation state
    let currentView = 'dashboard'; // 'dashboard' | 'unit' | 'lesson'
    let currentUnit = null;
    let currentLessonObj = null;

    function init() {
        loadProgress();
        renderDashboard();
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

    function renderBreadcrumb(parts) {
        const bc = document.getElementById('theory-breadcrumb');
        if (!bc) return;
        bc.innerHTML = '';

        for (let i = 0; i < parts.length; i++) {
            if (i > 0) {
                const sep = document.createElement('span');
                sep.className = 'theory-breadcrumb-sep';
                sep.textContent = '›';
                bc.appendChild(sep);
            }
            if (parts[i].action) {
                const link = document.createElement('button');
                link.className = 'theory-breadcrumb-link';
                link.textContent = parts[i].label;
                link.addEventListener('click', parts[i].action);
                bc.appendChild(link);
            } else {
                const span = document.createElement('span');
                span.className = 'theory-breadcrumb-current';
                span.textContent = parts[i].label;
                bc.appendChild(span);
            }
        }
    }

    function getUnitProgress(unit) {
        const unitLessons = unit.lessonIds;
        let completed = 0;
        for (const lid of unitLessons) {
            if (completedLessons.has(lid)) completed++;
        }
        return { completed, total: unitLessons.length };
    }

    function getNextPendingLesson() {
        for (const unit of units) {
            for (const lid of unit.lessonIds) {
                if (!completedLessons.has(lid)) {
                    const lesson = lessons.find(l => l.id === lid);
                    return { unit, lesson };
                }
            }
        }
        return null;
    }

    function getSectionProgress(sectionName) {
        let total = 0, completed = 0;
        for (const unit of units) {
            if (unit.section === sectionName) {
                for (const lid of unit.lessonIds) {
                    total++;
                    if (completedLessons.has(lid)) completed++;
                }
            }
        }
        return { total, completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
    }

    function renderDashboard() {
        currentView = 'dashboard';
        currentUnit = null;
        currentLessonObj = null;

        const nav = document.getElementById('theory-lessons-nav');
        const content = document.getElementById('theory-content');
        const bc = document.getElementById('theory-breadcrumb');
        if (nav) nav.style.display = 'none';
        if (bc) bc.innerHTML = '';

        // Update back button
        const backBtn = document.getElementById('theory-back-btn');
        if (backBtn) {
            backBtn.textContent = '← Inicio';
            backBtn.onclick = null;
            backBtn.setAttribute('data-goto', 'tab-home');
        }

        if (!content) return;

        const totalLessons = lessons.length;
        const totalCompleted = completedLessons.size;
        const globalPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
        const nextPending = getNextPendingLesson();

        let html = '<div class="theory-view-enter">';

        // === Hero Banner ===
        html += `
            <div class="theory-hero">
                <div class="theory-hero-top">
                    <div>
                        <div class="theory-hero-title">Curso de Teoria Musical</div>
                        <div class="theory-hero-subtitle">${units.length} unidades · ${totalLessons} lecciones interactivas</div>
                    </div>
                    <div class="theory-hero-pct">${globalPct}<small>%</small></div>
                </div>
                <div class="theory-hero-progress">
                    <div class="theory-hero-progress-bar" style="width:${globalPct}%"></div>
                </div>
                <div class="theory-hero-progress-text">${totalCompleted} de ${totalLessons} lecciones completadas</div>
                <div class="theory-hero-actions">
                    ${nextPending ? `<button class="theory-hero-continue" id="theory-hero-continue-btn">▶ Continuar: ${nextPending.unit.title.replace(/^Unidad \d+: /, '')} - ${nextPending.lesson.title.replace(/^\d+\.\s*/, '')}</button>` : '<span style="color:var(--tonic);font-weight:600;">🎉 ¡Curso completado!</span>'}
                </div>
                <div class="theory-hero-stats" style="margin-top:14px;">
                    <div class="theory-hero-stat">Teoria: <span class="theory-hero-stat-value">${getSectionProgress('teoria').pct}%</span></div>
                    <div class="theory-hero-stat">Herramientas: <span class="theory-hero-stat-value">${getSectionProgress('herramientas').pct}%</span></div>
                    <div class="theory-hero-stat">Referencia: <span class="theory-hero-stat-value">${getSectionProgress('referencia').pct}%</span></div>
                </div>
            </div>
        `;

        // Quick-access pill bar
        html += `
            <div class="theory-quick-access">
                <button class="theory-quick-pill" data-ref="intervals"><span class="theory-quick-pill-icon">📏</span> Intervalos</button>
                <button class="theory-quick-pill" data-ref="chord-formulas"><span class="theory-quick-pill-icon">🎵</span> Formulas de Acordes</button>
                <button class="theory-quick-pill" data-ref="degrees"><span class="theory-quick-pill-icon">🏛️</span> Grados y Funciones</button>
                <button class="theory-quick-pill" data-ref="scales"><span class="theory-quick-pill-icon">🎹</span> Escalas</button>
                <button class="theory-quick-pill" data-ref="circle"><span class="theory-quick-pill-icon">⭕</span> Circulo de Quintas</button>
            </div>
        `;

        html += '<div class="theory-dashboard-grid">';

        let currentSection = null;
        for (const unit of units) {
            // Section separator with progress
            if (unit.section && unit.section !== currentSection) {
                currentSection = unit.section;
                const sectionLabels = {
                    'teoria': 'Teoria Musical',
                    'herramientas': 'Herramientas Armonicas',
                    'referencia': 'Referencia y Recursos',
                };
                const sp = getSectionProgress(currentSection);
                html += `
                    <div class="theory-section-separator">
                        <div class="theory-section-separator-line"></div>
                        <span class="theory-section-separator-label">${sectionLabels[currentSection] || currentSection}</span>
                        <div class="theory-section-progress">
                            <div class="theory-section-progress-bar"><div class="theory-section-progress-fill" style="width:${sp.pct}%"></div></div>
                            <span class="theory-section-progress-text">${sp.pct}%</span>
                        </div>
                        <div class="theory-section-separator-line"></div>
                    </div>
                `;
            }

            const prog = getUnitProgress(unit);
            const pct = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;
            const isCompleted = pct === 100;
            const isInProgress = pct > 0 && pct < 100;

            let badgeHtml = '';
            if (isCompleted) {
                badgeHtml = '<span class="theory-unit-badge completed">✓ Completada</span>';
            } else if (isInProgress) {
                badgeHtml = '<span class="theory-unit-badge in-progress">En progreso</span>';
            } else {
                badgeHtml = '<span class="theory-unit-badge pending">Pendiente</span>';
            }

            html += `
                <div class="theory-unit-card ${isCompleted ? 'unit-completed' : ''}" data-color="${unit.color}" data-unit-id="${unit.id}">
                    <div class="theory-unit-card-header">
                        <div class="theory-unit-card-icon">${unit.icon}</div>
                        <div class="theory-unit-card-info">
                            <div class="theory-unit-card-title">${unit.title}</div>
                            <div class="theory-unit-card-subtitle">${unit.subtitle}</div>
                        </div>
                    </div>
                    <div class="theory-unit-card-progress">
                        <div class="theory-unit-card-progress-bar" style="width:${pct}%"></div>
                    </div>
                    <div class="theory-unit-card-meta">
                        ${badgeHtml}
                        <span class="theory-unit-card-progress-text">${prog.completed}/${prog.total}${isCompleted ? ' <span class="theory-unit-pct-badge">100%</span>' : ''}</span>
                    </div>
                </div>
            `;
        }

        html += '</div></div>';
        content.innerHTML = html;

        // Bind "Continue" button
        const continueBtn = document.getElementById('theory-hero-continue-btn');
        if (continueBtn && nextPending) {
            continueBtn.addEventListener('click', () => {
                currentUnit = nextPending.unit;
                showLesson(nextPending.lesson);
            });
        }

        // Bind click events
        content.querySelectorAll('.theory-unit-card').forEach(card => {
            card.addEventListener('click', () => {
                const uid = card.dataset.unitId;
                const unit = units.find(u => u.id === uid);
                if (unit) showUnit(unit);
            });
        });

        // Bind quick-access pills
        content.querySelectorAll('.theory-quick-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                showQuickReference(pill.dataset.ref);
            });
        });
    }

    function showUnit(unit) {
        currentView = 'unit';
        currentUnit = unit;
        currentLessonObj = null;

        const nav = document.getElementById('theory-lessons-nav');
        const content = document.getElementById('theory-content');
        if (nav) nav.style.display = 'none';

        // Update back button
        const backBtn = document.getElementById('theory-back-btn');
        if (backBtn) {
            backBtn.textContent = '← Curso';
            backBtn.onclick = (e) => { e.preventDefault(); renderDashboard(); };
            backBtn.removeAttribute('data-goto');
        }

        // Breadcrumb
        renderBreadcrumb([
            { label: 'Curso', action: () => renderDashboard() },
            { label: unit.title }
        ]);

        if (!content) return;

        const unitLessons = unit.lessonIds.map(id => lessons.find(l => l.id === id)).filter(Boolean);
        const prog = getUnitProgress(unit);
        const pct = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;

        // Find first non-completed lesson in this unit
        let firstPendingLesson = null;
        for (const l of unitLessons) {
            if (!completedLessons.has(l.id)) { firstPendingLesson = l; break; }
        }

        let html = '<div class="theory-view-enter">';

        // === Unit Hero ===
        html += `
            <div class="theory-unit-hero" data-color="${unit.color}">
                <div class="theory-unit-hero-inner">
                    <div class="theory-unit-hero-icon">${unit.icon}</div>
                    <div class="theory-unit-hero-info">
                        <h2>${unit.title}</h2>
                        <p>${unit.subtitle}</p>
                    </div>
                </div>
                <div class="theory-unit-hero-progress">
                    <div class="theory-unit-hero-progress-bar" style="width:${pct}%"></div>
                </div>
                <div class="theory-unit-hero-progress-text">
                    <span>${prog.completed} de ${prog.total} lecciones · ${pct}%</span>
                    <span>${pct === 100 ? '✓ Completada' : ''}</span>
                </div>
                ${firstPendingLesson ? `<button class="theory-unit-hero-continue" id="unit-continue-btn">▶ ${pct > 0 ? 'Continuar' : 'Comenzar'}: ${firstPendingLesson.title.replace(/^\d+\.\s*/, '')}</button>` : ''}
            </div>
        `;

        // === Lesson Tile Grid ===
        html += '<div class="theory-lesson-grid">';
        for (let i = 0; i < unitLessons.length; i++) {
            const lesson = unitLessons[i];
            const isCompleted = completedLessons.has(lesson.id);
            const isCurrent = !isCompleted && lesson === firstPendingLesson;
            const isPending = !isCompleted && !isCurrent;
            const stateClass = isCompleted ? 'completed' : isCurrent ? 'current' : 'pending';

            let statusLabel = '';
            if (isCompleted) statusLabel = '✓ Completa';
            else if (isCurrent) statusLabel = '▶ Actual';
            else statusLabel = 'Pendiente';

            html += `
                <div class="theory-lesson-tile ${stateClass}" data-lesson-id="${lesson.id}">
                    <div class="theory-lesson-tile-num">${isCompleted ? '✓' : (i + 1)}</div>
                    <div class="theory-lesson-tile-title">${lesson.title.replace(/^\d+\.\s*/, '')}</div>
                    <div class="theory-lesson-tile-status">${statusLabel}</div>
                </div>
            `;
        }
        html += '</div></div>';

        content.innerHTML = html;

        // Bind "Continue" in unit hero
        const unitContinueBtn = document.getElementById('unit-continue-btn');
        if (unitContinueBtn && firstPendingLesson) {
            unitContinueBtn.addEventListener('click', () => showLesson(firstPendingLesson));
        }

        // Bind click events on tiles
        content.querySelectorAll('.theory-lesson-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                const lid = tile.dataset.lessonId;
                const lesson = lessons.find(l => l.id === lid);
                if (lesson) showLesson(lesson);
            });
        });
    }

    function renderNav() {
        // Legacy — no longer used for flat list, but kept for compatibility
    }

    function showLesson(lesson) {
        currentView = 'lesson';
        currentLessonObj = lesson;

        const content = document.getElementById('theory-content');
        const nav = document.getElementById('theory-lessons-nav');
        if (nav) nav.style.display = 'none';
        if (!content) return;

        // Find the unit this lesson belongs to
        const unit = currentUnit || units.find(u => u.lessonIds.includes(lesson.id));
        if (unit) currentUnit = unit;

        // Update back button
        const backBtn = document.getElementById('theory-back-btn');
        if (backBtn && unit) {
            backBtn.textContent = '← ' + unit.title.replace(/^Unidad \d+: /, '');
            backBtn.onclick = (e) => { e.preventDefault(); showUnit(unit); };
            backBtn.removeAttribute('data-goto');
        }

        // Breadcrumb
        if (unit) {
            renderBreadcrumb([
                { label: 'Curso', action: () => renderDashboard() },
                { label: unit.title.replace(/^Unidad \d+: /, 'U' + unit.id.replace('u','') + ': '), action: () => showUnit(unit) },
                { label: lesson.title }
            ]);
        }

        let html = '<div class="theory-view-enter">';

        // === Lesson Stepper (position dots) ===
        if (unit) {
            const unitLessons = unit.lessonIds.map(id => lessons.find(l => l.id === id)).filter(Boolean);
            const currentIdx = unitLessons.findIndex(l => l.id === lesson.id);

            html += '<div class="theory-lesson-stepper">';
            for (let i = 0; i < unitLessons.length; i++) {
                const ul = unitLessons[i];
                const dotCompleted = completedLessons.has(ul.id);
                const dotActive = ul.id === lesson.id;
                const dotClass = dotActive ? 'active' : dotCompleted ? 'completed' : '';
                html += `<div class="theory-lesson-stepper-dot ${dotClass}" data-step-lesson="${ul.id}" title="${ul.title}"></div>`;
            }
            html += `<span class="theory-lesson-stepper-label">Leccion ${currentIdx + 1} de ${unitLessons.length}</span>`;
            html += '</div>';
        }

        html += `<h2>${lesson.title}</h2>${lesson.content}`;

        // Gather all quizzes: support both quiz (single) and quizzes (array)
        const allQuizzes = [];
        if (lesson.quizzes && Array.isArray(lesson.quizzes)) {
            allQuizzes.push(...lesson.quizzes);
        } else if (lesson.quiz) {
            allQuizzes.push(lesson.quiz);
        }

        // Render quizzes
        for (let qi = 0; qi < allQuizzes.length; qi++) {
            const q = allQuizzes[qi];
            const quizLabel = allQuizzes.length > 1 ? `Quiz ${qi + 1}` : 'Quiz rapido';
            html += `
                <div class="quiz-section" data-quiz-section="${qi}">
                    <h4>${quizLabel}</h4>
                    <p>${q.question}</p>
                    <div class="quiz-options" data-correct="${q.correct}" data-lesson="${lesson.id}" data-quiz-index="${qi}" data-total-quizzes="${allQuizzes.length}">
                        ${q.options.map((opt, i) =>
                            `<button class="quiz-option" data-index="${i}">${opt}</button>`
                        ).join('')}
                    </div>
                    <div class="quiz-feedback"></div>
                </div>
            `;
        }

        // Prev/Next buttons
        if (unit) {
            const unitLessons = unit.lessonIds.map(id => lessons.find(l => l.id === id)).filter(Boolean);
            const currentIdx = unitLessons.findIndex(l => l.id === lesson.id);

            const prevLesson = currentIdx > 0 ? unitLessons[currentIdx - 1] : null;
            const nextLesson = currentIdx < unitLessons.length - 1 ? unitLessons[currentIdx + 1] : null;
            const isCompleted = completedLessons.has(lesson.id);

            html += '<div class="theory-lesson-nav-btns">';
            html += `<button class="btn" id="theory-prev-btn" ${!prevLesson ? 'disabled' : ''}>← ${prevLesson ? prevLesson.title : 'Anterior'}</button>`;
            html += `<button class="btn ${isCompleted && nextLesson ? 'btn-next-highlight' : ''}" id="theory-next-btn" ${!nextLesson ? 'disabled' : ''}>${nextLesson ? nextLesson.title : 'Siguiente'} →</button>`;
            html += '</div>';

            html += '</div>'; // close theory-view-enter

            content.innerHTML = html;

            // Bind prev/next
            const prevBtn = document.getElementById('theory-prev-btn');
            const nextBtn = document.getElementById('theory-next-btn');
            if (prevBtn && prevLesson) {
                prevBtn.addEventListener('click', () => showLesson(prevLesson));
            }
            if (nextBtn && nextLesson) {
                nextBtn.addEventListener('click', () => showLesson(nextLesson));
            }
        } else {
            html += '</div>'; // close theory-view-enter
            content.innerHTML = html;
        }

        // Bind stepper dot clicks
        content.querySelectorAll('.theory-lesson-stepper-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const lid = dot.dataset.stepLesson;
                const l = lessons.find(x => x.id === lid);
                if (l) showLesson(l);
            });
        });

        setupExampleButtons();
        setupQuiz();

        // Initialize tool lesson if applicable
        initToolLesson(lesson);

        // Scroll to top of content
        content.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        let quizCorrectCount = 0;
        const quizContainers = document.querySelectorAll('.quiz-options');
        const totalQuizzes = quizContainers.length;

        quizContainers.forEach(container => {
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
                        feedback.innerHTML = '<div class="quiz-success-msg"><span class="quiz-success-msg-icon">✓</span> Correcto!</div>';
                        completedLessons.add(lessonId);
                        saveProgress();

                        // Save timestamp of last completed lesson
                        try {
                            localStorage.setItem('musihacks_theory_last_completed', JSON.stringify({
                                lessonId: lessonId,
                                timestamp: Date.now()
                            }));
                        } catch (e) { /* ignore */ }

                        renderNav();
                        quizCorrectCount++;

                        // Check if all quizzes in this lesson are answered correctly
                        if (quizCorrectCount >= totalQuizzes && totalQuizzes > 0) {
                            showLessonCompleteBanner(lessonId);
                        }

                        // Highlight next button after completing quiz
                        const nextBtn = document.getElementById('theory-next-btn');
                        if (nextBtn && !nextBtn.disabled) {
                            nextBtn.classList.add('btn-next-highlight');
                        }
                    } else {
                        btn.classList.add('wrong');
                        container.querySelectorAll('.quiz-option')[correct].classList.add('correct');
                        feedback.textContent = 'Incorrecto. La respuesta correcta esta marcada en verde.';
                        feedback.style.color = 'var(--dominant)';
                    }
                });
            });
        });
    }

    function showLessonCompleteBanner(lessonId) {
        const content = document.getElementById('theory-content');
        if (!content) return;

        // Don't add if already present
        if (content.querySelector('.lesson-complete-banner')) return;

        const unit = currentUnit;
        let nextLessonInUnit = null;
        if (unit) {
            const unitLessons = unit.lessonIds.map(id => lessons.find(l => l.id === id)).filter(Boolean);
            const idx = unitLessons.findIndex(l => l.id === lessonId);
            if (idx >= 0 && idx < unitLessons.length - 1) {
                nextLessonInUnit = unitLessons[idx + 1];
            }
        }

        const banner = document.createElement('div');
        banner.className = 'lesson-complete-banner';
        banner.innerHTML = `
            <div class="lesson-complete-banner-check">✓</div>
            <div class="lesson-complete-banner-text">
                <strong>Leccion completada!</strong>
                <span>${nextLessonInUnit ? 'Siguiente: ' + nextLessonInUnit.title : 'Has completado esta unidad.'}</span>
            </div>
        `;

        // Insert before the nav buttons
        const navBtns = content.querySelector('.theory-lesson-nav-btns');
        if (navBtns) {
            navBtns.parentNode.insertBefore(banner, navBtns);
        } else {
            content.appendChild(banner);
        }

        // Update stepper dots
        content.querySelectorAll('.theory-lesson-stepper-dot').forEach(dot => {
            if (dot.dataset.stepLesson === lessonId) {
                dot.classList.add('completed');
            }
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

    function initToolLesson(lesson) {
        if (!lesson.type || lesson.type === 'standard') return;

        if (lesson.type === 'tool' && lesson.toolInit) {
            // Call the appropriate HarmonyTools initializer
            if (typeof HarmonyTools !== 'undefined' && typeof HarmonyTools[lesson.toolInit] === 'function') {
                setTimeout(() => HarmonyTools[lesson.toolInit](), 50);
            }
            // Special case: scale browser needs its own init
            if (lesson.toolInit === 'initScaleBrowser') {
                setTimeout(() => initScaleBrowserLesson(), 100);
            }
        }

        // Reference images gallery
        if (lesson.id === 'ref-images') {
            setTimeout(() => renderReferenceGallery(), 50);
        }
    }

    function initScaleBrowserLesson() {
        // Set up scale-type-btn handlers and load default
        const container = document.getElementById('theory-content');
        if (!container) return;

        container.querySelectorAll('.scale-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.scale-type-btn').forEach(b => {
                    b.classList.remove('active');
                    b.classList.add('btn-clear');
                    b.classList.remove('btn-accent');
                });
                btn.classList.add('active');
                btn.classList.remove('btn-clear');
                btn.classList.add('btn-accent');
                if (typeof loadScaleBrowser === 'function') {
                    loadScaleBrowser(btn.dataset.scaleType);
                } else if (typeof window.loadScaleBrowser === 'function') {
                    window.loadScaleBrowser(btn.dataset.scaleType);
                }
            });
        });

        // Load default
        if (typeof loadScaleBrowser === 'function') {
            loadScaleBrowser('major');
        } else if (typeof window.loadScaleBrowser === 'function') {
            window.loadScaleBrowser('major');
        }
    }

    function renderReferenceGallery() {
        const gallery = document.getElementById('reference-gallery');
        if (!gallery) return;

        const images = [
            { src: '/reference/dominantes-sus4.png', title: 'Dominantes SUS4' },
            { src: '/reference/recursos-melodia.png', title: 'Recursos de melodía' },
            { src: '/reference/cadencias.png', title: 'Cadencias' },
            { src: '/reference/circle-of-fifths.png', title: 'Círculo de quintas' },
        ];

        let html = '<div class="ref-gallery-grid">';
        for (const img of images) {
            html += `
                <div class="ref-gallery-item" onclick="openImageModal('${img.src}')">
                    <img src="${img.src}" alt="${img.title}" loading="lazy">
                    <div class="ref-gallery-caption">${img.title}</div>
                </div>
            `;
        }
        html += '</div>';
        gallery.innerHTML = html;
    }

    function showQuickReference(refType) {
        const modal = document.getElementById('ref-quick-modal');
        const body = document.getElementById('ref-quick-modal-body');
        if (!modal || !body) return;

        const tables = {
            'intervals': {
                title: 'Intervalos',
                html: `<table><tr><th>ST</th><th>Nombre</th><th>Abrev.</th></tr>
                    <tr><td>0</td><td>Unísono</td><td>1</td></tr>
                    <tr><td>1</td><td>2da menor</td><td>b2</td></tr>
                    <tr><td>2</td><td>2da mayor</td><td>2</td></tr>
                    <tr><td>3</td><td>3era menor</td><td>b3</td></tr>
                    <tr><td>4</td><td>3era mayor</td><td>3</td></tr>
                    <tr><td>5</td><td>4ta justa</td><td>4</td></tr>
                    <tr><td>6</td><td>Tritono</td><td>b5/#4</td></tr>
                    <tr><td>7</td><td>5ta justa</td><td>5</td></tr>
                    <tr><td>8</td><td>6ta menor</td><td>b6</td></tr>
                    <tr><td>9</td><td>6ta mayor</td><td>6</td></tr>
                    <tr><td>10</td><td>7ma menor</td><td>b7</td></tr>
                    <tr><td>11</td><td>7ma mayor</td><td>7</td></tr>
                    <tr><td>12</td><td>Octava</td><td>8</td></tr></table>`
            },
            'chord-formulas': {
                title: 'Fórmulas de Acordes',
                html: `<table><tr><th>Tipo</th><th>Fórmula (ST)</th><th>Ejemplo en C</th></tr>
                    <tr><td>Mayor</td><td>4 + 3</td><td>C E G</td></tr>
                    <tr><td>Menor</td><td>3 + 4</td><td>C Eb G</td></tr>
                    <tr><td>Aumentado</td><td>4 + 4</td><td>C E G#</td></tr>
                    <tr><td>Disminuido</td><td>3 + 3</td><td>C Eb Gb</td></tr>
                    <tr><td>dom7</td><td>4+3+3</td><td>C E G Bb</td></tr>
                    <tr><td>maj7</td><td>4+3+4</td><td>C E G B</td></tr>
                    <tr><td>m7</td><td>3+4+3</td><td>C Eb G Bb</td></tr>
                    <tr><td>dim7</td><td>3+3+3</td><td>C Eb Gb Bbb</td></tr>
                    <tr><td>m7b5</td><td>3+3+4</td><td>C Eb Gb Bb</td></tr>
                    <tr><td>sus2</td><td>2 + 5</td><td>C D G</td></tr>
                    <tr><td>sus4</td><td>5 + 2</td><td>C F G</td></tr></table>`
            },
            'degrees': {
                title: 'Grados y Funciones Armónicas',
                html: `<table><tr><th>Grado</th><th>Numeral</th><th>Calidad</th><th>Función</th></tr>
                    <tr><td>1</td><td>I</td><td>Mayor</td><td style="color:var(--tonic)">Tónica (T)</td></tr>
                    <tr><td>2</td><td>ii</td><td>Menor</td><td style="color:var(--subdominant)">Subdominante (SD)</td></tr>
                    <tr><td>3</td><td>iii</td><td>Menor</td><td style="color:var(--tonic)">Tónica (T)</td></tr>
                    <tr><td>4</td><td>IV</td><td>Mayor</td><td style="color:var(--subdominant)">Subdominante (SD)</td></tr>
                    <tr><td>5</td><td>V</td><td>Mayor</td><td style="color:var(--dominant)">Dominante (D)</td></tr>
                    <tr><td>6</td><td>vi</td><td>Menor</td><td style="color:var(--tonic)">Tónica (T)</td></tr>
                    <tr><td>7</td><td>vii°</td><td>Disminuido</td><td style="color:var(--dominant)">Dominante (D)</td></tr></table>`
            },
            'scales': {
                title: 'Escalas comunes',
                html: `<table><tr><th>Escala</th><th>Fórmula (T/ST)</th><th>Ejemplo en C</th></tr>
                    <tr><td>Mayor</td><td>T-T-ST-T-T-T-ST</td><td>C D E F G A B</td></tr>
                    <tr><td>Menor natural</td><td>T-ST-T-T-ST-T-T</td><td>C D Eb F G Ab Bb</td></tr>
                    <tr><td>Menor armónica</td><td>T-ST-T-T-ST-1½-ST</td><td>C D Eb F G Ab B</td></tr>
                    <tr><td>Dórica</td><td>T-ST-T-T-T-ST-T</td><td>C D Eb F G A Bb</td></tr>
                    <tr><td>Frigia</td><td>ST-T-T-T-ST-T-T</td><td>C Db Eb F G Ab Bb</td></tr>
                    <tr><td>Lidia</td><td>T-T-T-ST-T-T-ST</td><td>C D E F# G A B</td></tr>
                    <tr><td>Mixolidia</td><td>T-T-ST-T-T-ST-T</td><td>C D E F G A Bb</td></tr>
                    <tr><td>Pentatónica mayor</td><td>T-T-1½-T-1½</td><td>C D E G A</td></tr>
                    <tr><td>Blues</td><td>1½-T-ST-ST-1½-T</td><td>C Eb F Gb G Bb</td></tr></table>`
            },
            'circle': {
                title: 'Círculo de Quintas',
                html: `<div style="text-align:center;margin-bottom:16px">
                    <img src="/reference/circle-of-fifths.png" alt="Círculo de quintas" style="max-width:100%;max-height:400px;border-radius:8px;cursor:pointer" onclick="openImageModal('/reference/circle-of-fifths.png')">
                </div>
                <table><tr><th>#</th><th>Tonalidad</th><th>Alteraciones</th></tr>
                    <tr><td>0</td><td>C / Am</td><td>—</td></tr>
                    <tr><td>1#</td><td>G / Em</td><td>F#</td></tr>
                    <tr><td>2#</td><td>D / Bm</td><td>F# C#</td></tr>
                    <tr><td>3#</td><td>A / F#m</td><td>F# C# G#</td></tr>
                    <tr><td>4#</td><td>E / C#m</td><td>F# C# G# D#</td></tr>
                    <tr><td>1b</td><td>F / Dm</td><td>Bb</td></tr>
                    <tr><td>2b</td><td>Bb / Gm</td><td>Bb Eb</td></tr>
                    <tr><td>3b</td><td>Eb / Cm</td><td>Bb Eb Ab</td></tr>
                    <tr><td>4b</td><td>Ab / Fm</td><td>Bb Eb Ab Db</td></tr></table>`
            },
        };

        const ref = tables[refType];
        if (!ref) return;

        body.innerHTML = `<h3>${ref.title}</h3>${ref.html}`;
        modal.classList.remove('hidden');

        // Close handlers
        const backdrop = modal.querySelector('.ref-quick-modal-backdrop');
        const closeBtn = modal.querySelector('.ref-quick-modal-close');

        function closeModal() {
            modal.classList.add('hidden');
            backdrop.removeEventListener('click', closeModal);
            closeBtn.removeEventListener('click', closeModal);
        }

        backdrop.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);

        // Close on Escape
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    function showDashboard() {
        renderDashboard();
    }

    function getCurrentView() {
        return currentView;
    }

    function getCurrentUnit() {
        return currentUnit;
    }

    return { init, showLesson, showDashboard, showUnit, getCurrentView, getCurrentUnit, showQuickReference, lessons, units };
})();
