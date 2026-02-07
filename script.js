// ============================================
// INITIALIZATION - FIXED VERSION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Wedding website loaded!');
    
    // Initialize AOS (Animate On Scroll) - with error handling
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
        console.log('✓ AOS animations initialized');
    } else {
        console.warn('⚠ AOS library not loaded');
    }

    // Initialize Swiper Gallery - with error handling
    if (typeof Swiper !== 'undefined') {
        initSwiper();
        console.log('✓ Swiper gallery initialized');
    } else {
        console.warn('⚠ Swiper library not loaded');
    }
    
    // Initialize Countdown Timer - ALWAYS runs
    initCountdown();
    console.log('✓ Countdown timer started');
    
    // Smooth scrolling for anchor links
    initSmoothScroll();
    console.log('✓ Smooth scrolling enabled');
    
    // Parallax effect on hero section
    initParallax();
    console.log('✓ Parallax effects ready');
});

// ============================================
// SWIPER GALLERY INITIALIZATION
// ============================================
function initSwiper() {
    try {
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
    } catch (error) {
        console.error('Swiper error:', error);
    }
}

// ============================================
// COUNTDOWN TIMER - FIXED VERSION
// ============================================
function initCountdown() {
    // Check if countdown elements exist
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        console.error('❌ Countdown timer elements not found! Check your HTML.');
        return;
    }
    
    // Set your wedding date here (YYYY, MM-1, DD, HH, MM, SS)
    // Note: Month is 0-indexed (0 = January, 5 = June, 11 = December)
    // Current setting: June 15, 2025 at 2:00 PM
    const weddingDate = new Date(2027, 1, 22, 9, 0, 0).getTime();
    
    console.log('Wedding date set to:', new Date(weddingDate));
    
    // Function to update the countdown
    function updateCountdown() {
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
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            console.log('🎊 Wedding day has arrived!');
        }
    }
    
    // Initial update
    updateCountdown();
    
    // Update countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// Helper function to update countdown with smooth animation
function updateCountdownDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const formattedValue = value.toString().padStart(2, '0');
    
    if (element.textContent !== formattedValue) {
        // Add animation effect
        element.style.transform = 'scale(1.2)';
        element.style.transition = 'transform 0.3s ease';
        
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
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                e.preventDefault();
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
    
    if (!hero) {
        console.warn('⚠ Hero section not found for parallax');
        return;
    }
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// ============================================
// LAZY LOADING IMAGES (Intersection Observer)
// ============================================
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

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
document.addEventListener('keydown', function(e) {
    // Press 'Esc' to close any modals (if you add them)
    if (e.key === 'Escape') {
        // Close modal logic here
    }
});




// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c💍 Welcome to our wedding website! 💍', 'font-size: 20px; color: #c9a58a; font-weight: bold;');
console.log('%cWe\'re so excited to celebrate with you!', 'font-size: 14px; color: #6b6b6b;');

// ============================================
// DEBUG MODE - Check if libraries loaded
// ============================================
window.addEventListener('load', function() {
    console.log('=== LIBRARY STATUS ===');
    console.log('AOS:', typeof AOS !== 'undefined' ? '✓ Loaded' : '✗ Not loaded');
    console.log('Swiper:', typeof Swiper !== 'undefined' ? '✓ Loaded' : '✗ Not loaded');
    console.log('===================');
    
    // Check countdown elements
    const countdownExists = document.getElementById('days') !== null;
    console.log('Countdown Timer:', countdownExists ? '✓ Elements found' : '✗ Elements missing');
});
