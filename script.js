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
// INITIALIZE ALL MODULES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    HeroSlideshow.init();
    LanguageSwitcher.init();
    MobileMenu.init();
    HeaderScroll.init();
    ScrollReveal.init();
    SmoothScroll.init();
});
