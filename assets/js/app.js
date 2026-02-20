// TACTICAL INTERFACE OPERATIONS
document.addEventListener('DOMContentLoaded', () => {
    // Fade in page
    setTimeout(() => document.body.classList.add('loaded'), 100);

    initBootSequence();
    initRadarCheck();
    initProfileSystem();
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

// LANGUAGE SYSTEM - REMOVED

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
             // Logic: Random pulses - SLOWED DOWN
             // Probability reduced from > 0.999 to > 0.9995 for fewer pulses
             if(!h.active && Math.random() > 0.9995 && h.delay <= 0) {
                 h.active = true;
                 h.life = 1.0;
                 h.delay = 200; // Cooldown increased from 100
             }
             if(h.delay > 0) h.delay--;

             // Draw Faint Grid - Opacity reduced for better readability
             drawHex(h.x, h.y, hexRadius, 'rgba(51, 255, 0, 0.01)');

             // Draw Active Pulse
             if(h.active) {
                 h.life -= 0.005; // Fading speed halved (was 0.01)
                 const alpha = h.life * 0.15; // Max opacity halved (was 0.3)
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
