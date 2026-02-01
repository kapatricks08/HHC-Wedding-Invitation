// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });

    // Initialize Swiper Gallery
    initSwiper();
    
    // Initialize Countdown Timer
    initCountdown();
    
    // Smooth scrolling for anchor links
    initSmoothScroll();
    
    // Parallax effect on hero section
    initParallax();
});

// ============================================
// SWIPER GALLERY INITIALIZATION
// ============================================
function initSwiper() {
    const gallerySwiper = new Swiper('.gallery-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    });
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function initCountdown() {
    // Set your wedding date here (YYYY, MM-1, DD, HH, MM, SS)
    // Note: Month is 0-indexed (0 = January, 5 = June)
    const weddingDate = new Date(2025, 5, 15, 14, 0, 0).getTime();
    
    // Update countdown every second
    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM with animation
        updateCountdownDisplay('days', days);
        updateCountdownDisplay('hours', hours);
        updateCountdownDisplay('minutes', minutes);
        updateCountdownDisplay('seconds', seconds);
        
        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }, 1000);
}

// Helper function to update countdown with smooth animation
function updateCountdownDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    const formattedValue = value.toString().padStart(2, '0');
    
    if (element.textContent !== formattedValue) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#c9a58a';
        
        setTimeout(() => {
            element.textContent = formattedValue;
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initSmoothScroll() {
    // Select all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallax() {
    const hero = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// ============================================
// LAZY LOADING IMAGES (Intersection Observer)
// ============================================
// This is automatically handled by the loading="lazy" attribute in HTML
// But here's an additional implementation for better browser support

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                observer.unobserve(img);
            }
        });
    });
    
    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// SCROLL TO TOP BUTTON (Optional Enhancement)
// ============================================
// Uncomment this section if you want a "scroll to top" button

/*
// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-to-top';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(201, 165, 138, 0.3);
`;

document.body.appendChild(scrollTopBtn);

// Show/hide button based on scroll position
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top when clicked
scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
*/

// ============================================
// FORM VALIDATION (Optional Enhancement)
// ============================================
// If you create a custom RSVP form instead of using Google Forms,
// you can add validation here

/*
function validateRSVPForm() {
    const form = document.getElementById('rsvp-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const attendance = document.getElementById('attendance').value;
            
            // Basic validation
            if (!name || !email || !attendance) {
                alert('Please fill in all required fields');
                return false;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return false;
            }
            
            // If validation passes, you can submit the form
            // For now, just show a success message
            alert('Thank you for your RSVP! We look forward to celebrating with you.');
            form.reset();
        });
    }
}
*/

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use debounced scroll handler for better performance
window.addEventListener('scroll', debounce(() => {
    // Your scroll-based functions here
}, 10));

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Press 'Esc' to close any modals (if you add them)
    if (e.key === 'Escape') {
        // Close modal logic here
    }
});

// ============================================
// CONSOLE MESSAGE (Optional Fun Touch)
// ============================================
console.log('%c💍 Welcome to our wedding website! 💍', 'font-size: 20px; color: #c9a58a; font-weight: bold;');
console.log('%cWe\'re so excited to celebrate with you!', 'font-size: 14px; color: #6b6b6b;');

// ============================================
// LOADING SCREEN (Optional Enhancement)
// ============================================
// Uncomment if you want to add a loading screen

/*
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});
*/
