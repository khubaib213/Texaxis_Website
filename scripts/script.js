// Main JavaScript for TEXAXIS Website
// Handles mobile menu, smooth scrolling, and form validation

document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider
    initializeHeroSlider();

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
// Mobile Menu Functionality
// ========================================
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (mobileMenuToggle && navbar) {
        mobileMenuToggle.addEventListener('click', function() {
            const isOpen = navbar.classList.toggle('active');
            this.classList.toggle('active');
            this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navbar.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navbar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
    }
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
                showFormMessage('success', 'Your email app should open with your message ready to send. If it does not, email us directly at info@texaxis.com.');
                contactForm.reset();
            } else {
                // Show error message
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
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.padding = '15px';
    messageDiv.style.marginTop = '20px';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.fontWeight = '600';
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '2px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '2px solid #f5c6cb';
        messageDiv.style.whiteSpace = 'pre-line';
    }
    
    messageDiv.textContent = message;
    
    // Insert message after form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.appendChild(messageDiv);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.5s';
            setTimeout(() => messageDiv.remove(), 500);
        }, 5000);
    }
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initializeSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scroll for valid anchor links
            if (href !== '#' && href.length > 1) {
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ========================================
// Header Scroll Effect
// ========================================
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add shadow when scrolled
            if (currentScroll > 10) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
            
            lastScroll = currentScroll;
        });
    }
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
        '.feature-card, .product-card, .about-card, .partner-link, .partner-item, .certification-card, .info-card, .location-card, .reveal-card'
    ).forEach((element) => {
        element.classList.add('reveal-card');
        observer.observe(element);
    });
}

// ========================================
// Back to Top Button
// ========================================
function initializeBackToTop() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #0052cc;
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        z-index: 1000;
        font-size: 18px;
    `;
    
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Simple hover effect
    backToTop.addEventListener('mouseenter', function() {
        this.style.opacity = '0.85';
    });
    
    backToTop.addEventListener('mouseleave', function() {
        this.style.opacity = '1';
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
            if (img.closest('.hero-slide')) return;
            imageObserver.observe(img);
        });
    } else {
        images.forEach(img => {
            if (!img.closest('.hero-slide')) {
                loadDeferredImage(img);
            }
        });
    }
}


// ========================================
// Hero Slider Functionality
// ========================================
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicators .indicator');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;

    function restartSlideAnimation(slide) {
        const img = slide?.querySelector('img');
        if (!img) return;
        img.style.animation = 'none';
        void img.offsetWidth;
        img.style.animation = '';
    }

    function showSlide(index) {
        slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
        indicators.forEach((indicator, i) => indicator.classList.toggle('active', i === index));
        restartSlideAnimation(slides[index]);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
        resetInterval();
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
    }

    slideInterval = setInterval(nextSlide, 6000);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    prevBtn?.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    nextBtn?.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
        heroSection.addEventListener('mouseleave', resetInterval);
    }

    showSlide(0);
}
