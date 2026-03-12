/* ============================================================
   IGLESIA DEL SANTO JOCARSA — app.js
   Todas las funciones usan guard para funcionar en ambas páginas
   ============================================================ */

/* --- Constantes de localStorage -------------------------- */
const LS = {
    BENDICIONES: 'jocarsismo_bendiciones',
    FIELES:      'jocarsismo_fieles',
    BOOT_DATE:   'jocarsismo_boot_date',
};

/* ============================================================
   UTILIDADES COMPARTIDAS
   ============================================================ */

/* --- Toast notifications ---------------------------------- */
function getToastContainer() {
    let c = document.getElementById('toast-container');
    if (!c) {
        c = document.createElement('div');
        c.id = 'toast-container';
        c.className = 'toast-container';
        document.body.appendChild(c);
    }
    return c;
}

function showToast(message, type = 'success', duration = 3000) {
    const container = getToastContainer();
    // Limitar a 3 toasts simultáneos
    while (container.children.length >= 3) {
        container.removeChild(container.firstChild);
    }
    const toast = document.createElement('div');
    toast.className = 'toast' + (type !== 'success' ? ` toast-${type}` : '');
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, duration);
}

/* ============================================================
   BOOT SCREEN (index.html — primera visita del día)
   ============================================================ */
function initBootScreen() {
    const overlay = document.getElementById('boot-screen');
    if (!overlay) return false; // no está en la página

    // Solo mostrar una vez por día
    const today = new Date().toDateString();
    if (localStorage.getItem(LS.BOOT_DATE) === today) {
        overlay.remove();
        return false; // no hubo boot screen
    }

    const LINES = [
        { type: 'ok',   text: '[ OK ] Iniciando Kernel del Santo Jocarsa...' },
        { type: 'ok',   text: '[ OK ] Montando sistema de archivos sagrados...' },
        { type: 'ok',   text: '[ OK ] Cargando módulo del pingüino...' },
        { type: 'ok',   text: '[ OK ] Verificando ortodoxia del código...' },
        { type: 'ok',   text: '[ OK ] Comprobando que no hay VS Code instalado...' },
        { type: 'warn', text: '[ WARN ] Se detectó software no libre en el sector 666...' },
        { type: 'ok',   text: '[ OK ] Invocando al Santo Jocarsa...' },
        { type: 'ok',   text: '[ OK ] Sistema listo. Bienvenido, fiel.' },
    ];

    const linesContainer = overlay.querySelector('.boot-lines');
    const cursor         = overlay.querySelector('.boot-cursor');
    const skipBtn        = overlay.querySelector('.boot-skip');

    function dismissBoot() {
        localStorage.setItem(LS.BOOT_DATE, today);
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 850);
    }

    skipBtn?.addEventListener('click', dismissBoot);

    let i = 0;
    function showNextLine() {
        if (i >= LINES.length) {
            cursor?.remove();
            setTimeout(dismissBoot, 900);
            return;
        }
        const line   = document.createElement('div');
        line.className = 'boot-line';
        const span   = document.createElement('span');
        span.className = LINES[i].type;
        span.textContent = LINES[i].text;
        line.appendChild(span);
        linesContainer.appendChild(line);
        // Forzar reflow antes de añadir clase .show
        void line.offsetWidth;
        line.classList.add('show');
        i++;
        setTimeout(showNextLine, 320 + Math.random() * 180);
    }

    setTimeout(showNextLine, 300);
    return true; // hubo boot screen
}

/* ============================================================
   CONFETI DE BENDICIONES
   ============================================================ */
const CONFETTI_MILESTONES = new Set([10, 25, 50, 100, 250, 500, 1000]);

function launchConfetti(originEl, count = 32) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect   = originEl ? originEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    const cx     = rect.left + rect.width / 2;
    const cy     = rect.top  + rect.height / 2;
    const COLORS = ['#22c55e', '#22d3ee', '#4ade80', '#67e8f9', '#a7f3d0', '#fbbf24'];
    const COUNT  = count;

    for (let i = 0; i < COUNT; i++) {
        const piece  = document.createElement('div');
        piece.className = 'confetti-piece';

        const size     = 6 + Math.random() * 8;
        const angle    = (Math.PI * 2 * i) / COUNT + (Math.random() - 0.5) * 0.8;
        const speed    = 80 + Math.random() * 120;
        const dx       = Math.cos(angle) * speed;
        const dy       = Math.sin(angle) * speed - 80; // impulso hacia arriba
        const duration = 0.9 + Math.random() * 0.6;
        const rot      = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360);

        piece.style.cssText = `
            left: ${cx}px;
            top: ${cy}px;
            width: ${size}px;
            height: ${size * (0.4 + Math.random() * 0.6)}px;
            background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
            --dx: ${dx}px;
            --dy: ${dy + 140}px;
            --rot: ${rot}deg;
            --duration: ${duration}s;
        `;

        document.body.appendChild(piece);
        piece.addEventListener('animationend', () => piece.remove(), { once: true });
    }
}

/* ============================================================
   EASTER EGG: BSOD del Hereje
   ============================================================ */
function initBsodEasterEgg() {
    const dogma04 = document.querySelector('[data-dogma="04"]');
    if (!dogma04) return;

    let clicks = 0;
    let timer  = null;

    dogma04.addEventListener('click', () => {
        clicks++;
        clearTimeout(timer);
        // Reset si pasan 4 segundos entre clics
        timer = setTimeout(() => { clicks = 0; }, 4000);

        if (clicks >= 7) {
            clicks = 0;
            triggerBsod();
        }
    });
}

function triggerBsod() {
    const overlay = document.getElementById('bsod-overlay');
    if (!overlay) return;

    overlay.classList.add('show');
    showToast('¡HEREJÍA DETECTADA! Invocando a Jocarsa...', 'error', 3000);

    const AUTO_CLOSE = 4000;
    let closeTimer = setTimeout(closeBsod, AUTO_CLOSE);

    function closeBsod() {
        clearTimeout(closeTimer);
        overlay.classList.remove('show');
        overlay.removeEventListener('click', closeBsod);
    }

    overlay.addEventListener('click', closeBsod, { once: true });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    els.forEach(el => observer.observe(el));
}

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
function initScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================================
   CONTADOR DE BENDICIONES (index.html)
   ============================================================ */
function initBlessing() {
    const btn  = document.getElementById('blessing-btn');
    const disp = document.getElementById('blessing-count');
    if (!btn || !disp) return;

    const MESSAGES = [
        '¡Bendición concedida! 🙌',
        '¡El Kernel te escucha!',
        '¡Commit aprobado!',
        '¡Instala Linux hoy!',
        '¡Tu RAM es suficiente!',
        '¡Gedit te sonríe!',
        '¡Tu bash history es sagrado!',
    ];

    let count = parseInt(localStorage.getItem(LS.BENDICIONES) || '0', 10);
    disp.textContent = count.toLocaleString('es-ES');

    btn.addEventListener('click', () => {
        count++;
        localStorage.setItem(LS.BENDICIONES, count);
        disp.textContent = count.toLocaleString('es-ES');

        // Retrigger animation
        disp.classList.remove('blessing-pop');
        void disp.offsetWidth;
        disp.classList.add('blessing-pop');

        const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        btn.textContent = msg;
        setTimeout(() => { btn.textContent = 'Recibir bendición 🙏'; }, 2000);

        // Confeti en hitos
        if (CONFETTI_MILESTONES.has(count)) {
            launchConfetti(btn);
            showToast(`¡${count} bendiciones! ¡El Kernel está complacido!`);
        }
    });
}

/* ============================================================
   VERSO DEL DÍA (index.html)
   ============================================================ */
function initVersoDia() {
    const el = document.getElementById('verso-text');
    if (!el) return;

    const versos = [
        '"El que no tiene terminal, que use la de su prójimo." — Jocarsa 3:14',
        '"Bendito sea el que hace git commit antes de cerrar el portátil." — Kernel 1:1',
        '"No hay pantalla azul que resista un buen disco de arranque de Ubuntu." — Distros 7:4',
        '"Gedit abrió el archivo que VS Code tardó 40 segundos en indexar." — Milagros 2:8',
        '"El RAM es un bien escaso; no lo malgastes en Electron." — Apocalipsis 4:20',
        '"sudo make me a sandwich — y el sistema respondió: OK." — Cartas 5:0',
        '"Al que madruga, el cron job le ayuda." — Mandamientos 3:6',
        '"chmod 777 es el diablo disfrazado de comodidad." — Seguridad 6:6',
        '"Un README sin ejemplos es un mapa sin escala." — Evangelio 2:3',
        '"No temas al error 404; teme al que no tiene documentación." — Jocarsa 9:9',
    ];

    const dayIndex = Math.floor(Date.now() / 86400000) % versos.length;
    el.textContent = versos[dayIndex];
}

/* ============================================================
   COPIAR LITURGIA (index.html)
   ============================================================ */
function initCopyLiturgia() {
    const btn = document.getElementById('copy-liturgia');
    if (!btn) return;

    const COMMAND = 'sudo apt update && sudo apt upgrade -y';

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(COMMAND);
            showToast('¡Oración copiada! Pégala en tu terminal.');
        } catch {
            // Fallback para navegadores sin Clipboard API
            const ta = document.createElement('textarea');
            ta.value = COMMAND;
            ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('¡Oración copiada! Pégala en tu terminal.');
        }

        btn.textContent = '¡Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = 'Copiar oración';
            btn.classList.remove('copied');
        }, 2200);
    });
}

/* ============================================================
   TICKER DE FIELES (index.html) — con Page Visibility API
   ============================================================ */
function initFielesTicker() {
    const el = document.getElementById('fieles-number');
    if (!el) return;

    const BASE  = 31337;
    let current = parseInt(localStorage.getItem(LS.FIELES) || BASE, 10);
    let paused  = false;

    el.textContent = current.toLocaleString('es-ES');

    document.addEventListener('visibilitychange', () => {
        paused = document.visibilityState === 'hidden';
    });

    function tick() {
        if (!paused) {
            const delta = Math.floor(Math.random() * 3) + 1;
            current += delta;
            localStorage.setItem(LS.FIELES, current);
            el.textContent = current.toLocaleString('es-ES');
        }
        setTimeout(tick, 2500 + Math.random() * 3000);
    }
    setTimeout(tick, 2000);
}

/* ============================================================
   FAQ ACORDEÓN con ARIA (index.html)
   ============================================================ */
function initFaq() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');

            // Cerrar todos
            document.querySelectorAll('.faq-item.open').forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            });

            // Abrir el pulsado si estaba cerrado
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/* ============================================================
   STICKY NAV ACTIVA (biblia.html)
   ============================================================ */
function initStickyNavHighlight() {
    const navLinks = document.querySelectorAll('.book-nav-sticky a[href^="#"]');
    if (!navLinks.length) return;

    const sections = Array.from(navLinks)
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(a => {
                    const active = a.getAttribute('href') === '#' + id;
                    a.classList.toggle('active', active);
                    a.setAttribute('aria-current', active ? 'true' : 'false');
                });
            }
        });
    }, { threshold: 0.25, rootMargin: '-60px 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
}

/* ============================================================
   EFECTO TYPING EN SUBTÍTULO (index.html)
   ============================================================ */
function initTypingEffect(bootShown) {
    // Solo si NO se mostró el boot screen en esta sesión
    if (bootShown) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = document.querySelector('header .subtitle');
    if (!el) return;

    const fullText = el.textContent.trim();
    el.textContent  = '';
    el.style.minHeight = '3em'; // evitar layout shift

    // Cursor parpadeante mientras escribe
    const cursor = document.createElement('span');
    cursor.className    = 'boot-cursor';
    cursor.style.cssText = 'display:inline-block;width:0.5ch;height:1em;background:#22c55e;animation:blink 1s step-end infinite;vertical-align:text-bottom;margin-left:1px';
    el.appendChild(cursor);

    let i = 0;
    const interval = setInterval(() => {
        if (i < fullText.length) {
            cursor.before(fullText[i]);
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => cursor.remove(), 800);
        }
    }, 30);
}

/* ============================================================
   CONFESIONARIO DE PECADOS TECNOLÓGICOS (index.html)
   ============================================================ */
function initConfesionario() {
    const overlay   = document.getElementById('confes-overlay');
    const openBtn   = document.getElementById('confes-open-btn');
    const closeBtn  = document.getElementById('confes-close-btn');
    const submitBtn = document.getElementById('confes-submit');
    const select    = document.getElementById('confes-select');
    const result    = document.getElementById('confes-result');
    if (!overlay || !openBtn) return;

    const PENITENCIAS = {
        windows:   { texto: 'Tus pecados son graves, pero hay redención.', penitencia: 'Reza 10 veces <code>sudo apt update</code> y regala un USB con Ubuntu a alguien que sufra.' },
        vscode:    { texto: 'El hijo del diablo ha corrompido tu terminal.', penitencia: 'Abre Gedit y trabaja con él durante una jornada completa. Solo Gedit. Sin extensiones.' },
        force:     { texto: 'Has destruido el tejido del repositorio.', penitencia: 'Escribe un commit message de al menos 50 palabras explicando exactamente qué rompiste y por qué no harás <code>--force</code> jamás.' },
        commit:    { texto: '"arreglé cosas" es la oración del cobarde.', penitencia: 'Vuelve a ese commit, escribe el mensaje real con prefijo semántico, y lee el Libro III, Capítulo 1.' },
        rmrf:      { texto: 'El Kernel llora.', penitencia: 'Instala <code>rsync</code>, crea un script de backup y ejecútalo cada domingo durante un mes. El Kernel lo verá.' },
        chmod777:  { texto: 'Has abierto las puertas del infierno en producción.', penitencia: 'Lee el Capítulo 2 del Libro del Kernel sobre permisos. Luego corre <code>find . -perm 777 -exec chmod 644 {} \\;</code> y reflexiona.' },
        readme:    { texto: 'Tu repositorio es una caja negra.', penitencia: 'Escribe el README ahora mismo. Con instalación, uso y licencia. No cierres el editor hasta que tengas al menos 30 líneas.' },
        stackoverflow: { texto: 'El copy-paste sin comprensión es idolatría.', penitencia: 'Vuelve al código copiado, explica línea por línea qué hace en comentarios. Si no puedes, bórralo y empieza de cero.' },
        tabs:      { texto: 'El caos de la indentación te consume.', penitencia: 'Configura tu editor para usar espacios, corre el linter, y corrige todos los errores sin usar "fix all". Uno a uno.' },
        npm:       { texto: 'node_modules ha engullido tu disco sagrado.', penitencia: 'Ejecuta <code>npx depcheck</code>, elimina las dependencias innecesarias y jura no instalar ninguna librería que puedas escribir en menos de 20 líneas.' },
    };

    openBtn.addEventListener('click', () => {
        overlay.classList.add('show');
        result.classList.remove('show');
        result.innerHTML = '';
        select.value = '';
    });

    function cerrar() { overlay.classList.remove('show'); }
    closeBtn?.addEventListener('click', cerrar);
    overlay.addEventListener('click', e => { if (e.target === overlay) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });

    submitBtn?.addEventListener('click', () => {
        const pecado = select.value;
        if (!pecado) {
            showToast('Selecciona un pecado antes de confesar.', 'warn');
            return;
        }
        const p = PENITENCIAS[pecado];
        result.innerHTML = `
            <strong>⚖️ Sentencia del Santo Jocarsa:</strong><br>
            <em>${p.texto}</em><br><br>
            <strong>Tu penitencia:</strong><br>${p.penitencia}
        `;
        result.classList.add('show');
        showToast('¡Pecado confesado! Cumple tu penitencia, fiel.');
    });
}

/* ============================================================
   PROCESIÓN DE PINGÜINOS (ambas páginas)
   ============================================================ */
function initProcession() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function launchProcession() {
        const count    = 3 + Math.floor(Math.random() * 5); // 3–7 pingüinos
        const duration = 10 + Math.random() * 6;            // 10–16s
        const bottomY  = 1 + Math.random() * 2;             // 1–3rem del borde

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'penguin-march';
            p.textContent = '🐧';
            p.style.setProperty('--march-dur', `${duration}s`);
            p.style.animationDelay = `${i * 0.35}s`;
            p.style.bottom = `${bottomY}rem`;
            document.body.appendChild(p);
            p.addEventListener('animationend', () => p.remove(), { once: true });
        }
    }

    // Primera procesión a los 45s, luego cada 60–120s
    setTimeout(() => {
        launchProcession();
        setInterval(launchProcession, 60000 + Math.random() * 60000);
    }, 45000);
}

/* ============================================================
   ORÁCULO DEL KERNEL (index.html)
   ============================================================ */
function initOraculo() {
    const btn  = document.getElementById('oraculo-btn');
    const text = document.getElementById('oraculo-text');
    if (!btn || !text) return;

    const PROFECIAS = [
        // — Sobre el Santo y la fe —
        'Y habló el Santo Jocarsa desde su terminal: «Quien abre Gedit abre su alma al Kernel.»',
        'Bendito el que compila en paz, porque él heredará el repositorio eterno.',
        'El Santo Jocarsa ascendió al servidor celestial con un último commit limpio y un README impecable.',
        'Santificado sea el BOE. Santificado sea el diff. Santificado sea el merge sin conflictos.',
        'Así dijo el Jocarsa a sus discípulos: «No temo a la pantalla en blanco; temo al cursor que no parpadea.»',
        // — Sobre Linux y el Kernel —
        'En el principio era el Kernel, y el Kernel estaba con el fiel, y el Kernel era el sistema.',
        'El pingüino sagrado descendió de los repositorios celestiales y vio que el código era libre, y fue bueno.',
        'El Kernel separó el proceso del usuario del proceso del sistema, y a cada uno le asignó su CPU.',
        'Quien insulte a Linux delante de un fiel del Jocarsismo, que se prepare para un disco de arranque de Ubuntu.',
        'Desde /home hasta /etc, desde /var hasta /usr: todo en el árbol sagrado tiene su propósito.',
        // — Sobre GitHub —
        'Escrito está en el Evangelio del GitHub: «Todo lo que no está comiteado, no ha ocurrido.»',
        'El repositorio es el templo. El commit, la oración. El pull request, la ofrenda.',
        'Y el Santo Jocarsa alzó su perfil de GitHub y vio que tenía muchas estrellas, y se sintió en paz.',
        'Quien hace fork con respeto y pull request con humildad, ese es el verdadero fiel del Jocarsismo.',
        'No existe el código si no tiene repositorio. No existe el alma si no tiene commit.',
        // — Sobre Gedit —
        'Gedit no necesita extensiones para ser santo. La santidad es su estado natural.',
        'Cuando VS Code tardó cuarenta segundos en arrancar, Gedit ya había salvado tres archivos de configuración.',
        'El que abre Gedit en lugar del IDE pesado, sentirá cómo su portátil respira de nuevo.',
        'No busques la iluminación en los plugins. La iluminación ya estaba en Gedit, esperándote.',
        // — Sobre los Mandamientos —
        'Primer mandamiento del fiel: no tendrás otro sistema operativo por encima de Linux.',
        'Honrarás al README como a tu propio código. Porque sin README, el código es un grito en el vacío.',
        'El mensaje de commit «arreglé cosas» es el pecado original del desarrollador moderno.',
        'Santificarás cada git push. Y antes del push, harás git pull. Y antes del pull, harás git status.',
        // — Sobre el Apocalipsis y los herejes —
        'Y en los últimos tiempos, los herejes de las cajas negras verán su servicio caer sin poder arreglarlo.',
        'Microsoft es el maligno tentador. Su fruto es la pantalla azul. Sus hojas, las licencias confusas.',
        'Visual Studio Code llegó con promesas de extensiones y se llevó la RAM. Gedit permanece.',
        'El Apocalipsis no vendrá del fuego, sino de una actualización automática a las 3 de la mañana.',
        'return libertad; — La última línea del Santo Jocarsa, que sincronizó el mundo en código libre.',
    ];

    let last = -1;

    function escribirProfecia(frase) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            text.textContent = `"${frase}"`;
            return;
        }
        text.textContent = '';
        text.classList.add('typing');
        let i = 0;
        const full = `"${frase}"`;
        const iv = setInterval(() => {
            if (i < full.length) {
                text.textContent += full[i++];
            } else {
                clearInterval(iv);
                text.classList.remove('typing');
            }
        }, 28);
    }

    btn.addEventListener('click', () => {
        let idx;
        do { idx = Math.floor(Math.random() * PROFECIAS.length); } while (idx === last);
        last = idx;
        escribirProfecia(PROFECIAS[idx]);
        showToast('El Kernel ha hablado 🔮');
    });
}

/* ============================================================
   BARRA DE PROGRESO DE LECTURA (biblia.html)
   ============================================================ */
function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;

    function update() {
        const scrollTop = window.scrollY;
        const docH      = document.documentElement.scrollHeight - window.innerHeight;
        const pct       = docH > 0 ? Math.min(100, (scrollTop / docH) * 100) : 0;
        bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ============================================================
   BOTONES AMÉN (biblia.html)
   ============================================================ */
function initAmenButtons() {
    const btns = document.querySelectorAll('.amen-btn');
    if (!btns.length) return;

    btns.forEach(btn => {
        const bookId    = btn.dataset.book;
        const lsKey     = `jocarsismo_amen_${bookId}`;
        const countEl   = document.getElementById(`amen-${bookId}`);
        if (!countEl) return;

        let count = parseInt(localStorage.getItem(lsKey) || '0', 10);
        countEl.textContent = count.toLocaleString('es-ES');

        btn.addEventListener('click', () => {
            count++;
            localStorage.setItem(lsKey, count);
            countEl.textContent = count.toLocaleString('es-ES');

            // Mini confeti (menos partículas que en bendiciones)
            const rect = btn.getBoundingClientRect();
            const miniOrigin = { getBoundingClientRect: () => rect };
            launchConfetti(miniOrigin, 12);

            const AMENES = ['¡Amén!', '¡Que así sea!', '¡El Kernel lo confirma!', '¡Palabra sagrada!'];
            showToast(AMENES[Math.floor(Math.random() * AMENES.length)]);
        });
    });
}

/* ============================================================
   AÑO EN FOOTER
   ============================================================ */
function initFooterYear() {
    document.querySelectorAll('.footer-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    const byId = document.getElementById('footer-year');
    if (byId) byId.textContent = new Date().getFullYear();
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const bootShown = initBootScreen();

    initScrollReveal();
    initScrollTop();
    initBlessing();
    initVersoDia();
    initCopyLiturgia();
    initFielesTicker();
    initFaq();
    initStickyNavHighlight();
    initBsodEasterEgg();
    initConfesionario();
    initProcession();
    initOraculo();
    initReadingProgress();
    initAmenButtons();
    initFooterYear();
    initTypingEffect(bootShown);
});
