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
});

// ========================================
// Mobile Menu Functionality
// ========================================
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (mobileMenuToggle && navbar) {
        mobileMenuToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
            this.classList.toggle('active');
            
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
                // Form is valid - show success message
                showFormMessage('success', 'Thank you for your message! We will get back to you soon.');
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
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation class
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .about-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations if needed
// Uncomment the line below to enable
// initializeScrollAnimations();


// ========================================
// Hero Slider Functionality
// ========================================
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicators .indicator');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
        resetInterval();
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Auto-advance slides every 5 seconds
    slideInterval = setInterval(nextSlide, 5000);

    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
        heroSection.addEventListener('mouseleave', resetInterval);
    }

    // Initialize first slide
    showSlide(0);
}
