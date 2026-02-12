// TACTICAL INTERFACE OPERATIONS
document.addEventListener('DOMContentLoaded', () => {
    // Fade in page
    setTimeout(() => document.body.classList.add('loaded'), 100);

    initBootSequence();
    initRadarCheck();
    initProfileSystem();
    initLanguageSystem();
    initMobileMenu();
});

// MOBILE MENU
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// LANGUAGE SYSTEM
const translations = {
    fr: {
        nav_terminal: "ACCUEIL", nav_mission: "TCS", nav_arsenal: "COMPÉTENCES", nav_ops: "PROJETS", nav_clearance: "BTS SIO", nav_intel: "VEILLES", nav_profile: "À PROPOS",
        term_status: "STATUS: ONLINE", term_connect: "> ETABLISSEMENT DE LA CONNEXION...", term_user: "> UTILISATEUR IDENTIFIE: RECRUTEUR", term_access: "> ACCES AU DOSSIER...",
        term_welcome: "Bienvenue sur le terminal tactique. Je suis un étudiant en Systèmes et Réseaux (SISR). Explorez les différents modules pour analyser mes compétences en infrastructure.",
        btn_access: "ACCÉDER AUX DOSSIERS", footer_sys: "SYSTEME: SECURISE",
        hero_status: "ADMINISTRATEUR RÉSEAUX ET SYSTÈME", hero_role: "ÉTUDIANT EN BTS SIO SISR",
        hero_desc: "Spécialiste Systèmes et Réseaux Informatiques. Passionné par l'infrastructure IT et les nouvelles technologies, je développe des compétences en administration système, sécurité réseau et virtualisation.",
        btn_projects: "EXPLORER MES PROJETS", btn_contact: "ME CONTACTER"
    },
    en: {
        nav_terminal: "TERMINAL", nav_mission: "TCS", nav_arsenal: "SKILLS", nav_ops: "PROJECTS", nav_clearance: "EDUCATION", nav_intel: "TECH WATCH", nav_profile: "ABOUT",
        term_status: "STATUS: ONLINE", term_connect: "> ESTABLISHING CONNECTION...", term_user: "> USER IDENTIFIED: RECRUITER", term_access: "> ACCESSING DOSSIER...",
        term_welcome: "Welcome to the tactical terminal. I am a Systems and Networks student (SISR). Explore the different modules to analyze my infrastructure skills.",
        btn_access: "ACCESS FILES", footer_sys: "SYSTEM: SECURE",
        hero_status: "SYSTEM ADMINISTRATION", hero_role: "BTS SIO SISR STUDENT",
        hero_desc: "Systems and Network Infrastructure Specialist. Passionate about IT infrastructure, system administration and virtualization.",
        btn_projects: "EXPLORE PROJECTS", btn_contact: "CONTACT ME"
    },
    pt: {
        nav_terminal: "TERMINAL", nav_mission: "TCS", nav_arsenal: "HABILIDADES", nav_ops: "PROJETOS", nav_clearance: "FORMAÇÃO", nav_intel: "VIGILÂNCIA", nav_profile: "SOBRE",
        term_status: "STATUS: ONLINE", term_connect: "> ESTABELECENDO CONEXAO...", term_user: "> USUARIO IDENTIFICADO: RECRUTADOR", term_access: "> ACESSANDO DOSSIE...",
        term_welcome: "Bem-vindo ao terminal tático. Eu sou um desenvolvedor Fullstack especializado em soluções de software. Explore os diferentes módulos para analisar minhas habilidades e operações passadas.",
        btn_access: "ACESSAR ARQUIVOS", footer_sys: "SISTEMA: SEGURO"
    },
    de: {
        nav_terminal: "TERMINAL", nav_mission: "TCS", nav_arsenal: "KOMPETENZEN", nav_ops: "PROJEKTE", nav_clearance: "AUSBILDUNG", nav_intel: "TECH-WATCH", nav_profile: "ÜBER",
        term_status: "STATUS: ONLINE", term_connect: "> VERBINDUNG HERSTELLEN...", term_user: "> BENUTZER IDENTIFIZIERT: REKRUTIER", term_access: "> ZUGRIFF AUF DATEI...",
        term_welcome: "Willkommen am taktischen Terminal. Ich bin ein Fullstack-Entwickler, spezialisiert auf Softwarelösungen. Erkunden Sie die verschiedenen Module, um meine Fähigkeiten und vergangenen Operationen zu analysieren.",
        btn_access: "DATEIEN AUFRUFEN", footer_sys: "SYSTEM: SICHER"
    },
    it: {
        nav_terminal: "TERMINALE", nav_mission: "TCS", nav_arsenal: "COMPETENZE", nav_ops: "PROGETTI", nav_clearance: "FORMAZIONE", nav_intel: "TECH-WATCH", nav_profile: "A PROPOSITO",
        term_status: "STATO: ONLINE", term_connect: "> CONNESSIONE IN CORSO...", term_user: "> UTENTE IDENTIFICATO: RECLUTATORE", term_access: "> ACCESSO AL DOSSIER...",
        term_welcome: "Benvenuto nel terminale tattico. Sono uno sviluppatore Fullstack specializzato in soluzioni software. Esplora i diversi moduli per analizzare le mie competenze e operazioni passate.",
        btn_access: "ACCEDI AI FILE", footer_sys: "SISTEMA: SICURO"
    }
};

function initLanguageSystem() {
    // Default to French if no language is saved
    let currentLang = localStorage.getItem('tactical_lang');
    if (!currentLang) {
        currentLang = 'fr';
        localStorage.setItem('tactical_lang', 'fr');
    }
    setLanguage(currentLang);
    
    // Bind click events to dropdown items
    document.querySelectorAll('.lang-dropdown div').forEach(item => {
        item.addEventListener('click', (e) => {
            const lang = e.target.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}

function setLanguage(lang) {
    localStorage.setItem('tactical_lang', lang);
    const data = translations[lang];
    if(!data) return;

    // Update Text Content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(data[key]) el.innerText = data[key];
    });

    // Update Typewriter
    const typewriter = document.getElementById('typewriter-text');
    if(typewriter && data['term_welcome']) {
        // Stop existing execution if possible or just reset
        typewriter.setAttribute('data-text', data['term_welcome']);
        typewriter.innerHTML = '';
        initTypewriter(); // Restart typing
    }

    // Update active lang display
    const btn = document.querySelector('.lang-btn');
    if(btn) btn.innerText = `[ ${lang.toUpperCase()} ]`;
}


// PROFILE PHOTO SYSTEM (Local Storage Persistence)
function initProfileSystem() {
    const fileInput = document.getElementById('profile-upload');
    const imgPreview = document.getElementById('profile-img');       // About Page
    const dashboardImg = document.getElementById('dashboard-img');   // Index Page
    const defaultMatrix = document.getElementById('default-matrix'); // Index Page
    const uploadBtn = document.getElementById('upload-btn');

    // 1. Function to apply saved image to DOM
    const applyImage = (dataUrl) => {
        if (!dataUrl) return;
        
        // Update About Page Image
        if (imgPreview) imgPreview.src = dataUrl;
        
        // Update Index Page Visual
        if (dashboardImg) {
            dashboardImg.src = dataUrl;
            dashboardImg.style.display = 'block';
            if(defaultMatrix) defaultMatrix.style.display = 'none';
        }
    };

    // 2. Load on startup
    const savedImg = localStorage.getItem('tactical_profile_img');
    if (savedImg) applyImage(savedImg);

    // 3. Handle Upload with Compression
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    // Resize to avoid localStorage quotas (Max width 600px)
                    const MAX_WIDTH = 600;
                    const scaleFactor = (img.width > MAX_WIDTH) ? (MAX_WIDTH / img.width) : 1;
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width * scaleFactor;
                    canvas.height = img.height * scaleFactor;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    // Compress to JPEG 0.7 quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    
                    try {
                        localStorage.setItem('tactical_profile_img', compressedDataUrl);
                        applyImage(compressedDataUrl); // Update immediately
                        uploadBtn.innerText = "UPLOAD OK";
                        setTimeout(() => uploadBtn.innerText = "[ UPLOAD ID ]", 2000);
                    } catch (err) {
                        alert("ERROR: STORAGE FULL. TRY A SMALLER IMAGE.");
                        console.error(err);
                    }
                };
            };
        });
    }
}

function initBootSequence() {
    // Only run if on index page or forces
    const bootScreen = document.getElementById('boot-sequence');
    if (bootScreen) {
        setTimeout(() => {
            document.querySelector('.boot-text').innerHTML = "SYSTEM INITIALIZED";
            document.querySelector('.progress-fill').style.background = "#fff";
        }, 2100);

        setTimeout(() => {
            bootScreen.style.opacity = '0';
            setTimeout(() => {
                bootScreen.style.display = 'none';
                initTypewriter();
                initRadar();
            }, 500);
        }, 2500);
    } else {
        initRadar();
        initTypewriter();
    }
}

// RADAR / MAP SYSTEM
function initRadar() {
    const container = document.getElementById('background-canvas-container');
    if (!container) return;

    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    let w, h;
    let hexRadius = 35; // Hexagon size
    let hexes = [];
    
    // Rotating Rings
    let rings = [];

    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        initHexGrid();
        initRings();
    }
    window.addEventListener('resize', resize);
    
    function initHexGrid() {
        hexes = [];
        // Calculate grid cols/rows
        const cols = Math.ceil(w / (hexRadius * 1.5)) + 2;
        const rows = Math.ceil(h / (hexRadius * Math.sqrt(3) * 0.5)) + 2;
        
        for(let r = 0; r < rows; r++) {
            for(let c = 0; c < cols; c++) {
                // Hexagon center calculation
                const x = c * hexRadius * 1.5;
                const y = r * hexRadius * Math.sqrt(3) + (c % 2 === 1 ? hexRadius * Math.sqrt(3) / 2 : 0);
                
                hexes.push({
                    x: x,
                    y: y,
                    active: false,
                    life: 0,
                    delay: Math.random() * 100
                });
            }
        }
    }

    function initRings() {
        // Black Ops 2 Style rings (Orange/Cyan/Green)
        rings = [
            { r: 150, speed: 0.005, angle: 0, dash: [50, 20], color: 'rgba(255, 160, 0, 0.4)', width: 2 }, // Amber (BO2 ID)
            { r: 240, speed: -0.008, angle: Math.PI, dash: [20, 40], color: 'rgba(0, 240, 250, 0.2)', width: 1 }, // Cyan
            { r: 320, speed: 0.002, angle: 0, dash: [100, 100], color: 'rgba(51, 255, 0, 0.1)', width: 8 } // Faint Green Wide
        ];
    }
    
    resize();

    function drawHex(x, y, r, color, fill = false) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60) * Math.PI / 180;
            ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
        }
        ctx.closePath();
        if(fill) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }

    function draw() {
        // Clear background
        ctx.clearRect(0, 0, w, h);
        
        // 1. HEXAGON GRID BACKGROUND (Honeycomb)
        ctx.lineWidth = 1;
        
        hexes.forEach(h => {
             // Logic: Random pulses
             if(!h.active && Math.random() > 0.999 && h.delay <= 0) {
                 h.active = true;
                 h.life = 1.0;
                 h.delay = 100; // Cooldown
             }
             if(h.delay > 0) h.delay--;

             // Draw Faint Grid
             drawHex(h.x, h.y, hexRadius, 'rgba(51, 255, 0, 0.02)');

             // Draw Active Pulse
             if(h.active) {
                 h.life -= 0.01;
                 const alpha = h.life * 0.3;
                 // BO2 Orange Pulse mixed with Cyan
                 const pulseColor = Math.random() > 0.5 ? `rgba(255, 160, 0, ${alpha})` : `rgba(0, 240, 255, ${alpha})`;
                 drawHex(h.x, h.y, hexRadius, pulseColor, true);
                 
                 if(h.life <= 0) h.active = false;
             }
        });

        // 2. CENTRAL TACTICAL RINGS
        const cx = w / 2;
        const cy = h / 2;
        
        rings.forEach(ring => {
            ring.angle += ring.speed;
            ctx.beginPath();
            ctx.setLineDash(ring.dash);
            ctx.strokeStyle = ring.color;
            ctx.lineWidth = ring.width;
            ctx.arc(cx, cy, ring.r, ring.angle, ring.angle + Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        });
        
        // 3. CROSSHAIR CENTER
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Plus in center
        ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
        ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
        ctx.stroke();

        // 4. RANDOM DECOR DATA (Bottom Left)
        ctx.font = '10px "Share Tech Mono"';
        ctx.fillStyle = 'rgba(255, 160, 0, 0.7)'; // Amber Text
        ctx.fillText(`SYS_OP: NORMAL`, 30, h - 80);
        ctx.fillText(`NET_STR: ${Math.floor(Date.now() / 100) % 100}%`, 30, h - 65);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
        ctx.fillText(`COORD: ${Math.floor(cx)}.${Math.floor(cy)}`, 30, h - 50);

        requestAnimationFrame(draw);
    }
    draw();
}

// Simple fallback if no canvas logic needed immediately
function initRadarCheck() {
    if(!document.getElementById('boot-sequence')) initRadar();
}

let typewriterTimeout = null;

// TYPEWRITER EFFECT
function initTypewriter() {
    const element = document.getElementById('typewriter-text');
    if (!element) return;
    
    // Cancel any existing typing process to prevent overlap
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
        typewriterTimeout = null;
    }
    
    const text = element.getAttribute('data-text');
    element.innerHTML = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            typewriterTimeout = setTimeout(type, 30);
        } else {
            typewriterTimeout = null;
        }
    }
    type();
}
