// Main JavaScript for TEXAXIS Website
// Handles mobile menu, smooth scrolling, and form validation

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle (light / dark)
    initializeThemeToggle();

    // Mobile Menu Toggle
    initializeMobileMenu();
    
    // Form Validation
    initializeContactForm();
    
    // Smooth Scroll for Anchor Links
    initializeSmoothScroll();
    
    // Header Scroll Effect
    initializeHeaderScroll();
    
    // Scroll Animations
    initializeScrollAnimations();
    
    // Back to Top Button
    initializeBackToTop();
    
    // Lazy Load Images
    initializeLazyLoading();
});

// ========================================
// Theme Toggle (Light / Dark)
// ========================================
const THEME_KEY = 'texaxis-theme';

function getPreferredTheme() {
    try {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) { /* ignore */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.setAttribute('content', next === 'dark' ? '#0b1220' : '#0052cc');
    }

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        const label = next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
        btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
    });
}

function initializeThemeToggle() {
    applyTheme(getPreferredTheme());

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            try {
                localStorage.setItem(THEME_KEY, next);
            } catch (e) { /* ignore */ }
            applyTheme(next);
        });
    });

    // Sync if OS preference changes and user hasn't chosen explicitly
    try {
        if (!localStorage.getItem(THEME_KEY)) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(THEME_KEY)) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    } catch (e) { /* ignore */ }
}

// ========================================
// Mobile Menu Functionality
// ========================================
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');

    if (!mobileMenuToggle || !navbar) return;

    function setMenuOpen(isOpen) {
        navbar.classList.toggle('active', isOpen);
        mobileMenuToggle.classList.toggle('active', isOpen);
        mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        const spans = mobileMenuToggle.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    mobileMenuToggle.addEventListener('click', function() {
        setMenuOpen(!navbar.classList.contains('active'));
    });

    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navbar.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);

        if (!isClickInsideMenu && !isClickOnToggle && navbar.classList.contains('active')) {
            setMenuOpen(false);
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navbar.classList.contains('active')) {
            setMenuOpen(false);
            mobileMenuToggle.focus();
        }
    });

    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (navbar.classList.contains('active')) {
                setMenuOpen(false);
            }
        });
    });
}

// ========================================
// Contact Form Validation
// ========================================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            
            // Validation
            let isValid = true;
            let errorMessage = '';
            
            if (name === '') {
                isValid = false;
                errorMessage += 'Please enter your name.\n';
            }
            
            if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Please enter a valid email address.\n';
            }
            
            if (phone === '') {
                isValid = false;
                errorMessage += 'Please enter your phone number.\n';
            }
            
            if (subject === '') {
                isValid = false;
                errorMessage += 'Please select a subject.\n';
            }
            
            if (message === '') {
                isValid = false;
                errorMessage += 'Please enter your message.\n';
            }
            
            if (isValid) {
                const company = document.getElementById('company').value.trim();
                const subjectLabels = {
                    'product-inquiry': 'Product Inquiry',
                    'technical-support': 'Technical Support',
                    'quotation': 'Request Quotation',
                    'partnership': 'Partnership Opportunity',
                    'other': 'Other',
                };
                const subjectLabel = subjectLabels[subject] || subject;
                const body = [
                    `Name: ${name}`,
                    `Email: ${email}`,
                    `Phone: ${phone}`,
                    company ? `Company: ${company}` : '',
                    '',
                    message,
                ].filter(Boolean).join('\n');

                window.location.href = `mailto:info@texaxis.com?subject=${encodeURIComponent('TEXAXIS: ' + subjectLabel)}&body=${encodeURIComponent(body)}`;
                showFormMessage('success', 'Your email app should open with your message ready to send. If nothing opens, email us at info@texaxis.com or use WhatsApp.');
                // Keep form filled so the user can retry if the mail client is cancelled
            } else {
                showFormMessage('error', errorMessage);
            }
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form message
function showFormMessage(type, message) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.setAttribute('role', type === 'error' ? 'alert' : 'status');
    messageDiv.textContent = message;

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.appendChild(messageDiv);
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.5s';
            setTimeout(() => messageDiv.remove(), 500);
        }, 8000);
    }
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function getHeaderOffset() {
    const topBar = document.querySelector('.top-bar');
    const header = document.querySelector('.header');
    const topBarH = topBar ? topBar.offsetHeight : 0;
    const headerH = header ? header.offsetHeight : 0;
    return topBarH + headerH + 16;
}

function scrollToTarget(targetElement) {
    const top = targetElement.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({ top, behavior: 'smooth' });

    if (targetElement.id === 'contactForm' || targetElement.closest('#contactForm')) {
        const form = document.getElementById('contactForm');
        if (form) {
            form.classList.add('form-highlight');
            const firstField = form.querySelector('input, select, textarea');
            if (firstField) {
                setTimeout(() => firstField.focus({ preventScroll: true }), 450);
            }
            setTimeout(() => form.classList.remove('form-highlight'), 1800);
        }
    }
}

function initializeSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href !== '#' && href.length > 1) {
                const targetElement = document.querySelector(href);

                if (targetElement) {
                    e.preventDefault();
                    scrollToTarget(targetElement);
                    history.pushState(null, '', href);
                }
            }
        });
    });

    // Honor hash on load (e.g. contact.html#contactForm from other pages)
    if (window.location.hash && window.location.hash.length > 1) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => scrollToTarget(target), 100);
        }
    }
}

// ========================================
// Header Scroll Effect
// ========================================
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const update = () => {
        header.classList.toggle('is-scrolled', window.pageYOffset > 10);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
}

// ========================================
// Animation on Scroll (Optional Enhancement)
// ========================================
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(
        '.product-card, .location-card, .reveal-card, .hq-panel, .regional-card, .principles__item'
    ).forEach((element) => {
        element.classList.add('reveal-card');
        observer.observe(element);
    });
}

// ========================================
// Back to Top Button
// ========================================
function initializeBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.type = 'button';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        backToTop.classList.toggle('is-visible', window.pageYOffset > 300);
    }, { passive: true });

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// Lazy Loading Images
// ========================================
function loadDeferredImage(img) {
    if (!img || img.dataset.loaded === 'true') return;

    const picture = img.closest('picture');
    if (picture) {
        picture.querySelectorAll('source[data-srcset]').forEach((source) => {
            source.srcset = source.dataset.srcset;
            source.removeAttribute('data-srcset');
        });
    }

    const src = img.dataset.src;
    if (src) {
        img.src = src;
        img.removeAttribute('data-src');
    }

    img.dataset.loaded = 'true';
    img.classList.add('loaded');
}

function preloadImageSrc(src) {
    if (!src) return;
    const preload = new Image();
    preload.src = src;
}

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadDeferredImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '200px 0px' });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        images.forEach(img => {
            loadDeferredImage(img);
        });
    }
}
