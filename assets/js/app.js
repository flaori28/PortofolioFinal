// TACTICAL INTERFACE OPERATIONS
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');

    initBootSequence();
    initRadarCheck();
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

function initBootSequence() {
    const bootScreen = document.getElementById('boot-sequence');
    if (bootScreen) {
        bootScreen.style.display = 'none';
        initTypewriter();
    } else {
        initTypewriter();
    }
}

// RADAR / MAP SYSTEM
function initRadar() {
    const container = document.getElementById('background-canvas-container');
    if (container) {
        container.innerHTML = '';
    }
}

// Simple fallback if no canvas logic needed immediately
function initRadarCheck() {
    initRadar();
}

let typewriterTimeout = null;

// TYPEWRITER EFFECT
function initTypewriter() {
    const element = document.getElementById('typewriter-text');
    if (!element) return;

    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
        typewriterTimeout = null;
    }

    const text = element.getAttribute('data-text');
    element.textContent = text || '';
}
