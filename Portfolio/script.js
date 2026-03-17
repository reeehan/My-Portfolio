/* ══════════════════════════════════════════════════════════
   Rehan Tamboli — Portfolio JavaScript
   Theme Toggle · Floating Shapes · 3D Tilt · Typing
   Enhanced Float Hover · Counters · Smooth Reveals
   ══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const canvas = document.getElementById('shapesCanvas');
    const typedTextEl = document.getElementById('typedText');
    const contactForm = document.getElementById('contactForm');
    const scrollProgress = document.getElementById('scrollProgress');
    const themeToggle = document.getElementById('themeToggle');

    /* ════════════════════════════════
       1. THEME TOGGLE (Light / Dark)
       ════════════════════════════════ */
    const THEME_KEY = 'rt-portfolio-theme';

    function getStoredTheme() {
        // Default to dark on every load as requested
        return 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        // Update canvas opacity
        if (canvas) {
            canvas.style.opacity = theme === 'light' ? '0.5' : '0.7';
        }
    }

    // Init theme
    applyTheme(getStoredTheme());

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    /* ════════════════════════════════
       2. NAVBAR SCROLL + PROGRESS
       ════════════════════════════════ */
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        if (scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
        }
    }, { passive: true });

    // Active link
    const allSections = document.querySelectorAll('.section, .hero');
    const navLinkEls = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        allSections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        navLinkEls.forEach(l => {
            l.classList.toggle('active', l.getAttribute('data-section') === current);
        });
    }, { passive: true });

    /* ════════════════════════════════
       3. MOBILE MENU
       ════════════════════════════════ */
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach(l => {
        l.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        }
    });

    /* ════════════════════════════════
       4. TYPING ANIMATION
       ════════════════════════════════ */
    const typingStrings = [
        'nmap -sV -sC target.local',
        'splunk search index=security',
        'python3 exploit_scanner.py',
        'tcpdump -i eth0 -w capture.pcap',
        'openvas --scan 10.0.0.0/24',
        'cat /etc/shadow | hashcat -m 1800',
    ];

    let sIdx = 0, cIdx = 0, deleting = false, speed = 80;

    function typeLoop() {
        const str = typingStrings[sIdx];
        if (deleting) {
            typedTextEl.textContent = str.substring(0, --cIdx);
            speed = 35;
        } else {
            typedTextEl.textContent = str.substring(0, ++cIdx);
            speed = 60 + Math.random() * 40;
        }
        if (!deleting && cIdx === str.length) { deleting = true; speed = 2000; }
        else if (deleting && cIdx === 0) { deleting = false; sIdx = (sIdx + 1) % typingStrings.length; speed = 400; }
        setTimeout(typeLoop, speed);
    }
    setTimeout(typeLoop, 1800);

    /* ════════════════════════════════
       5. SCROLL REVEAL + SKILL BARS
       ════════════════════════════════ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Fill skill bars when expertise section is visible
                entry.target.querySelectorAll('.sbar-fill').forEach((bar, i) => {
                    setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 80);
                });
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Stagger
    [
        '.skills-grid .skill-card',
        '.projects-grid .project-card',
        '.certs-grid .cert-card',
        '.timeline .tl-item',
        '.contact-links .contact-link',
        '.intro-traits .trait',
        '.tools-row .tool-chip',
    ].forEach(selector => {
        document.querySelectorAll(selector).forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.1}s`;
            revealObserver.observe(card);
        });
    });

    /* ════════════════════════════════
       6. COUNTER ANIMATION
       ════════════════════════════════ */
    let counted = false;
    const counters = document.querySelectorAll('.stat-num');
    const statsArea = document.querySelector('.hero-stats');

    if (statsArea) {
        new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && !counted) {
                    counted = true;
                    counters.forEach(c => {
                        const target = +c.dataset.count;
                        const dur = 1200;
                        const startT = performance.now();
                        function tick(now) {
                            const p = Math.min((now - startT) / dur, 1);
                            c.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
                            if (p < 1) requestAnimationFrame(tick);
                            else c.textContent = target;
                        }
                        requestAnimationFrame(tick);
                    });
                }
            });
        }, { threshold: 0.5 }).observe(statsArea);
    }

    /* ════════════════════════════════
       7. 3D TILT
       ════════════════════════════════ */
    if (!('ontouchstart' in window)) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', function (e) {
                const inner = this.querySelector('.skill-inner, .project-inner');
                if (!inner) return;
                const r = this.getBoundingClientRect();
                const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -6;
                const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6;
                inner.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
            });
            card.addEventListener('mouseleave', function () {
                const inner = this.querySelector('.skill-inner, .project-inner');
                if (!inner) return;
                inner.style.transition = 'transform 0.5s ease';
                inner.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
                setTimeout(() => { inner.style.transition = ''; }, 500);
            });
        });
    }

    /* ═══════════════════════════════════════
       8. ENHANCED FLOATING HOVER (float-el)
       Elements float on their own.
       On mouse-near they react / push away.
       ═══════════════════════════════════════ */
    if (!('ontouchstart' in window)) {
        let mx = 0, my = 0;
        document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

        const floatEls = document.querySelectorAll('.float-el');
        const INFLUENCE_RADIUS = 200;

        function updateProximityFloat() {
            floatEls.forEach(el => {
                const r = el.getBoundingClientRect();
                const elCX = r.left + r.width / 2;
                const elCY = r.top + r.height / 2;
                const dx = mx - elCX;
                const dy = my - elCY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < INFLUENCE_RADIUS) {
                    const strength = 1 - (dist / INFLUENCE_RADIUS);
                    const pushX = -dx * strength * 0.08;
                    const pushY = -dy * strength * 0.12;
                    el.style.setProperty('--push-x', pushX + 'px');
                    el.style.setProperty('--push-y', pushY + 'px');
                    el.style.transform = `translate(${pushX}px, ${pushY}px) scale(${1 + strength * 0.04})`;
                    el.style.boxShadow = `0 ${8 + strength * 12}px ${20 + strength * 30}px rgba(161, 134, 235, ${0.1 + strength * 0.12})`;
                } else {
                    // Let CSS animation take over
                    el.style.transform = '';
                    el.style.boxShadow = '';
                }
            });
            requestAnimationFrame(updateProximityFloat);
        }
        requestAnimationFrame(updateProximityFloat);
    }

    /* ════════════════════════════════
       9. FLOATING CYBER SHAPES
       ════════════════════════════════ */
    function initShapes() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H;
        const shapes = [];
        const SHAPE_COUNT = 80;
        let mouseX = 0, mouseY = 0, mouseActive = false;

        document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; mouseActive = true; }, { passive: true });
        document.addEventListener('mouseleave', () => { mouseActive = false; });

        const palette = [
            '#5669cf', '#a186eb', '#d9aefb', '#ffaefa',
            '#7c8adf', '#b99ef0', '#e4c4fd',
            '#6475d4', '#8e7ce4', '#c5a0f5',
            '#30d158', '#64d2ff', '#ff6b6b', '#ff9f0a',
        ];

        function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

        class Shape {
            constructor() {
                this.x = Math.random() * (W || window.innerWidth);
                this.y = Math.random() * (H || window.innerHeight);
                this.vx = 0; this.vy = 0;
                this.color = palette[Math.floor(Math.random() * palette.length)];
                this.alpha = 0.5 + Math.random() * 0.35;
                this.size = 4 + Math.random() * 10;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.03;
                this.type = Math.floor(Math.random() * 6);
                this.orbitRadius = 50 + Math.random() * 220;
                this.orbitSpeed = (0.03 + Math.random() * 0.1) * (Math.random() > 0.5 ? 1 : -1);
                this.orbitPhase = Math.random() * Math.PI * 2;
                this.driftVx = (Math.random() - 0.5) * 0.05;
                this.driftVy = (Math.random() - 0.5) * 0.05;
                this.ease = 0.004 + Math.random() * 0.008;
                this.friction = 0.97 + Math.random() * 0.02;
            }

            update(t) {
                this.vx += (this.driftVx - this.vx) * 0.01;
                this.vy += (this.driftVy - this.vy) * 0.01;
                this.vx *= this.friction; this.vy *= this.friction;
                this.x += this.vx; this.y += this.vy;
                this.rotation += this.rotSpeed;
                const m = 30;
                if (this.x < -m) this.x = W + m; if (this.x > W + m) this.x = -m;
                if (this.y < -m) this.y = H + m; if (this.y > H + m) this.y = -m;
            }

            draw(ctx) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                const s = this.size;
                switch (this.type) {
                    case 0: ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 0.87, s * 0.5); ctx.lineTo(-s * 0.87, s * 0.5); ctx.closePath(); ctx.fill(); break;
                    case 1: ctx.fillRect(-s / 2, -s / 2, s, s); break;
                    case 2: ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 0.7, 0); ctx.lineTo(0, s); ctx.lineTo(-s * 0.7, 0); ctx.closePath(); ctx.fill(); break;
                    case 3: ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, Math.PI * 2); ctx.fill(); break;
                    case 4: { const th = s * 0.25; ctx.fillRect(-s / 2, -th, s, th * 2); ctx.fillRect(-th, -s / 2, th * 2, s); break; }
                    case 5: { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i - Math.PI / 6; if (i === 0) ctx.moveTo(Math.cos(a) * s * 0.6, Math.sin(a) * s * 0.6); else ctx.lineTo(Math.cos(a) * s * 0.6, Math.sin(a) * s * 0.6); } ctx.closePath(); ctx.fill(); break; }
                }
                ctx.restore();
            }
        }

        function init() { resize(); for (let i = 0; i < SHAPE_COUNT; i++) shapes.push(new Shape()); }

        function animate(t) {
            ctx.clearRect(0, 0, W, H);
            shapes.forEach(s => { s.update(t); s.draw(ctx); });
            requestAnimationFrame(animate);
        }

        init();
        window.addEventListener('resize', resize);
        requestAnimationFrame(animate);
    }
    initShapes();

    /* ════════════════════════════════
       10. MAGNETIC HOVER
       ════════════════════════════════ */
    if (!('ontouchstart' in window)) {
        document.querySelectorAll('.magnetic').forEach(el => {
            el.addEventListener('mousemove', function (e) {
                const r = this.getBoundingClientRect();
                this.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.2}px)`;
            });
            el.addEventListener('mouseleave', function () {
                this.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                this.style.transform = 'translate(0, 0)';
                setTimeout(() => { this.style.transition = ''; }, 400);
            });
        });
    }

    /* ════════════════════════════════
       11. SMOOTH SCROLL
       ════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const t = document.querySelector(this.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ════════════════════════════════
       12. CONTACT FORM
       ════════════════════════════════ */
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const message = this.querySelector('#message').value.trim();
            const to = 'rehan.tamboli@example.com'; // ← Replace with your real email
            const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
            window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        });
    }

    /* ════════════════════════════════
       13. HERO PARALLAX
       ════════════════════════════════ */
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        if (!heroContent) return;
        const y = window.scrollY;
        if (y < window.innerHeight) {
            heroContent.style.transform = `translateY(${y * 0.1}px)`;
            heroContent.style.opacity = 1 - (y / (window.innerHeight * 0.75));
        }
    }, { passive: true });

    /* ════════════════════════════════
       14. GRID LINE ENTRANCE
       ════════════════════════════════ */
    document.querySelectorAll('.grid-line').forEach((line, i) => {
        line.style.opacity = '0';
        line.style.transition = `opacity 0.5s ease ${i * 0.04}s`;
        setTimeout(() => { line.style.opacity = '1'; }, 100);
    });

    /* ════════════════════════════════
       15. HERO LOAD REVEAL
       ════════════════════════════════ */
    window.addEventListener('load', () => {
        document.querySelectorAll('.hero .reveal').forEach((el, i) => {
            setTimeout(() => { el.classList.add('show'); }, 300 + i * 150);
        });
    });

})();
