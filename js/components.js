/**
 * FinSmart Shared Components
 * Reusable JavaScript modules for navigation, animations, and theming
 */

// ========================================
// MOBILE NAVIGATION
// ========================================
class MobileNavigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelector('.navbar-links');
        this.init();
    }

    init() {
        if (!this.navbar) return;

        // Create mobile menu toggle button
        this.createToggleButton();

        // Create overlay for mobile menu
        this.createOverlay();

        // Handle resize events
        window.addEventListener('resize', () => this.handleResize());
    }

    createToggleButton() {
        if (document.querySelector('.mobile-menu-toggle')) return;

        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.setAttribute('aria-label', 'Toggle navigation menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        toggle.addEventListener('click', () => this.toggleMenu());
        this.navbar.appendChild(toggle);
        this.toggleButton = toggle;
    }

    createOverlay() {
        if (document.querySelector('.mobile-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        overlay.addEventListener('click', () => this.closeMenu());
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    toggleMenu() {
        const isOpen = this.navLinks.classList.contains('active');

        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.navLinks.classList.add('active');
        this.toggleButton.classList.add('active');
        this.overlay.classList.add('active');
        this.toggleButton.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.navLinks.classList.remove('active');
        this.toggleButton.classList.remove('active');
        this.overlay.classList.remove('active');
        this.toggleButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMenu();
        }
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
class ScrollAnimations {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.15;
        this.rootMargin = options.rootMargin || '0px';
        this.init();
    }

    init() {
        const animatedElements = document.querySelectorAll(
            '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .fade-in-up'
        );

        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: this.threshold,
            rootMargin: this.rootMargin
        });

        animatedElements.forEach(el => observer.observe(el));
    }
}

// ========================================
// COUNTER ANIMATION
// ========================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-target]');
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target, 10);
        const duration = 2000; // ms
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                if (element.dataset.suffix) {
                    element.textContent += element.dataset.suffix;
                }
                clearInterval(timer);
            } else {
                element.textContent = Math.ceil(current).toLocaleString();
            }
        }, 16);
    }
}

// ========================================
// TYPING EFFECT
// ========================================
class TypingEffect {
    constructor(elementId, words, options = {}) {
        this.element = document.getElementById(elementId);
        this.words = words;
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseDuration = options.pauseDuration || 2000;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        if (this.element) {
            this.start();
        }
    }

    start() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.wordIndex];

        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typingSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.charIndex === currentWord.length) {
            typingSpeed = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            typingSpeed = 300;
        }

        setTimeout(() => this.type(), typingSpeed);
    }
}

// ========================================
// THEME TOGGLE
// ========================================
class ThemeToggle {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme
        this.applyTheme(this.theme);

        // Set up toggle buttons
        const toggleButtons = document.querySelectorAll('.theme-toggle');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => this.toggle());
        });

        // Check system preference
        if (!localStorage.getItem('theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                this.applyTheme('dark');
            }
        }
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        localStorage.setItem('theme', this.theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
    }
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
class ScrollToTop {
    constructor() {
        this.button = null;
        this.init();
    }

    init() {
        this.createButton();
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
    }

    createButton() {
        if (document.querySelector('.scroll-to-top')) {
            this.button = document.querySelector('.scroll-to-top');
            return;
        }

        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Scroll to top');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        `;

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.body.appendChild(button);
        this.button = button;
    }

    handleScroll() {
        if (window.scrollY > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
}

// ========================================
// COOKIE CONSENT
// ========================================
class CookieConsent {
    constructor() {
        this.consent = localStorage.getItem('cookieConsent');
        this.banner = null;

        if (!this.consent) {
            this.init();
        }
    }

    init() {
        this.createBanner();

        // Show banner after a short delay
        setTimeout(() => {
            this.banner.classList.add('active');
        }, 1000);
    }

    createBanner() {
        if (document.querySelector('.cookie-consent')) {
            this.banner = document.querySelector('.cookie-consent');
            return;
        }

        const banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>🍪 We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button class="btn btn-ghost btn-sm" id="cookie-decline">Decline</button>
                    <button class="btn btn-primary btn-sm" id="cookie-accept">Accept</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);
        this.banner = banner;

        // Event listeners
        document.getElementById('cookie-accept').addEventListener('click', () => {
            this.accept();
        });

        document.getElementById('cookie-decline').addEventListener('click', () => {
            this.decline();
        });
    }

    accept() {
        localStorage.setItem('cookieConsent', 'accepted');
        this.hideBanner();
    }

    decline() {
        localStorage.setItem('cookieConsent', 'declined');
        this.hideBanner();
    }

    hideBanner() {
        this.banner.classList.remove('active');
        setTimeout(() => {
            this.banner.remove();
        }, 500);
    }
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================
class HeaderScrollEffect {
    constructor() {
        this.header = document.querySelector('.main-header');
        if (this.header) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }
}

// ========================================
// FAQ ACCORDION
// ========================================
class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        if (this.faqItems.length > 0) {
            this.init();
        }
    }

    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleItem(item));
            }
        });
    }

    toggleItem(item) {
        const isActive = item.classList.contains('active');

        // Close all items
        this.faqItems.forEach(faq => faq.classList.remove('active'));

        // Open clicked item if it wasn't already open
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new MobileNavigation();
    new ScrollAnimations();
    new CounterAnimation();
    new ThemeToggle();
    new ScrollToTop();
    new CookieConsent();
    new HeaderScrollEffect();
    new FAQAccordion();
    new SmoothScroll();

    // Initialize typing effect if element exists
    const typingElement = document.getElementById('typing-effect');
    if (typingElement) {
        new TypingEffect('typing-effect', ['Smarter', 'Faster', 'Better', 'Interactive', 'Engaging']);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileNavigation,
        ScrollAnimations,
        CounterAnimation,
        TypingEffect,
        ThemeToggle,
        ScrollToTop,
        CookieConsent,
        HeaderScrollEffect,
        FAQAccordion,
        SmoothScroll
    };
}
