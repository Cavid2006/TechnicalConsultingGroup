/**
 * TCG Website - JavaScript
 * Bilingual support, hero slideshow, mobile menu, and scroll animations
 */

// ========================================
// HERO SLIDESHOW
// ========================================
const HeroSlideshow = {
    slides: [],
    dots: [],
    currentSlide: 0,
    autoPlayInterval: null,
    autoPlayDelay: 5000, // 5 seconds

    init() {
        this.slides = document.querySelectorAll('.hero-slideshow .slide');
        this.dots = document.querySelectorAll('.slide-dot');

        if (this.slides.length === 0) return;

        // Add click handlers to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });

        // Start auto-play
        this.startAutoPlay();

        // Pause on hover (optional - improves UX)
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => this.stopAutoPlay());
            heroSection.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    },

    goToSlide(index) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // Update current slide index
        this.currentSlide = index;

        // Handle wrap-around
        if (this.currentSlide >= this.slides.length) {
            this.currentSlide = 0;
        }
        if (this.currentSlide < 0) {
            this.currentSlide = this.slides.length - 1;
        }

        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    },

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    },

    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    },

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    },

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    },

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
};

// ========================================
// LANGUAGE SWITCHER
// ========================================
const LanguageSwitcher = {
    currentLang: 'az',

    init() {
        // Get all language buttons (both header and mobile menu)
        const langButtons = document.querySelectorAll('.lang-btn');

        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.switchLanguage(lang);
                this.updateActiveButtons(lang);
            });
        });

        // Check for saved language preference, default to Azerbaijani
        const savedLang = localStorage.getItem('tcg-language') || 'az';
        this.switchLanguage(savedLang);
        this.updateActiveButtons(savedLang);
    },

    switchLanguage(lang) {
        this.currentLang = lang;

        // Find all elements with data-en, data-az, or data-ru attributes
        const elements = document.querySelectorAll('[data-en], [data-az], [data-ru]');

        elements.forEach(el => {
            const text = el.dataset[lang];
            if (text) {
                el.textContent = text;
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Save preference
        localStorage.setItem('tcg-language', lang);
    },

    updateActiveButtons(lang) {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }
};

// ========================================
// MOBILE MENU
// ========================================
const MobileMenu = {
    menu: null,
    overlay: null,
    hamburger: null,
    closeBtn: null,

    init() {
        this.menu = document.getElementById('mobileMenu');
        this.overlay = document.getElementById('mobileOverlay');
        this.hamburger = document.getElementById('hamburger');
        this.closeBtn = document.getElementById('mobileClose');

        if (!this.menu || !this.hamburger) return;

        // Open menu
        this.hamburger.addEventListener('click', () => this.open());

        // Close menu
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }

        // Close on link click
        const menuLinks = this.menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    },

    open() {
        this.menu.classList.add('active');
        if (this.overlay) {
            this.overlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.menu.classList.remove('active');
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    },

    isOpen() {
        return this.menu.classList.contains('active');
    }
};

// ========================================
// HEADER SCROLL EFFECT
// ========================================
const HeaderScroll = {
    header: null,

    init() {
        this.header = document.getElementById('header');
        if (!this.header) return;

        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        this.onScroll(); // Initial check
    },

    onScroll() {
        if (window.scrollY > 10) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
};

// ========================================
// SCROLL REVEAL OBSERVER
// ========================================
const ScrollReveal = {
    observer: null,

    init() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements immediately
            document.querySelectorAll('.reveal').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        const options = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once revealed, stop observing
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all elements with .reveal class
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => {
            this.observer.observe(el);
        });
    }
};

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
const SmoothScroll = {
    init() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 64;

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();

                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
};

// ========================================
// HERO CYBER GRID EFFECT
// ========================================
const HeroCyberGrid = {
    canvas: null,
    ctx: null,
    hero: null,
    nodes: [],
    mouse: { x: 0, y: 0 },
    targetMouse: { x: 0, y: 0 },
    isActive: false,
    animationId: null,
    nodeCount: 35,
    connectionDistance: 150,

    init() {
        // Skip on touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

        // Respect prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        this.canvas = document.getElementById('heroCyberGrid');
        this.hero = document.querySelector('.hero');

        if (!this.canvas || !this.hero) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createNodes();

        // Event listeners
        window.addEventListener('resize', () => this.resize());
        this.hero.addEventListener('mouseenter', () => this.activate());
        this.hero.addEventListener('mouseleave', () => this.deactivate());
        this.hero.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    },

    resize() {
        if (!this.canvas || !this.hero) return;
        const rect = this.hero.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.createNodes();
    },

    createNodes() {
        this.nodes = [];
        const width = this.canvas.width;
        const height = this.canvas.height;

        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                baseX: Math.random() * width,
                baseY: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2 + 1
            });
        }
    },

    handleMouseMove(e) {
        const rect = this.hero.getBoundingClientRect();
        this.targetMouse.x = e.clientX - rect.left;
        this.targetMouse.y = e.clientY - rect.top;
    },

    activate() {
        this.isActive = true;
        if (!this.animationId) {
            this.animate();
        }
    },

    deactivate() {
        this.isActive = false;
    },

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    animate() {
        if (!this.ctx) return;

        // Smooth mouse lerp
        this.mouse.x = this.lerp(this.mouse.x, this.targetMouse.x, 0.08);
        this.mouse.y = this.lerp(this.mouse.y, this.targetMouse.y, 0.08);

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.isActive) {
            this.animationId = null;
            return;
        }

        const width = this.canvas.width;
        const height = this.canvas.height;

        // Update and draw nodes
        this.nodes.forEach(node => {
            // Subtle drift movement
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            // Mouse influence (subtle parallax)
            const dx = this.mouse.x - node.x;
            const dy = this.mouse.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 250;

            if (dist < maxDist) {
                const force = (1 - dist / maxDist) * 0.015;
                node.x += dx * force;
                node.y += dy * force;
            }

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(147, 197, 253, 0.5)';
            this.ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionDistance) {
                    const opacity = (1 - dist / this.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

        // Mouse glow effect
        const gradient = this.ctx.createRadialGradient(
            this.mouse.x, this.mouse.y, 0,
            this.mouse.x, this.mouse.y, 120
        );
        gradient.addColorStop(0, 'rgba(147, 197, 253, 0.08)');
        gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        this.animationId = requestAnimationFrame(() => this.animate());
    }
};

// ========================================
// INITIALIZE ALL MODULES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    HeroSlideshow.init();
    LanguageSwitcher.init();
    MobileMenu.init();
    HeaderScroll.init();
    ScrollReveal.init();
    SmoothScroll.init();
    HeroCyberGrid.init();
});
