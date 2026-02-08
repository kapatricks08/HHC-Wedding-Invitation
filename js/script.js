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



//RSVP Scripts Starts here

const attendanceSelect = document.getElementById("attendance");
const bringingGuestsContainer = document.getElementById("bringingGuestsContainer");
const guestCheckbox = document.getElementById("bringingGuests");
const guestCountContainer = document.getElementById("guestCountContainer");
const exactGuestContainer = document.getElementById("exactGuestCountContainer");
const form = document.getElementById("rsvpForm");
const popup = document.getElementById("rsvpPopup");
const guestDropdown = document.getElementById("guestCount");
const exactGuestInput = document.getElementById("exactGuestCount");

// Show checkbox only if attendance = Yes
attendanceSelect.addEventListener("change", function() {
  if (this.value === "Yes") {
    bringingGuestsContainer.style.display = "block";
  } else {
    bringingGuestsContainer.style.display = "none";
    guestCountContainer.style.display = "none";
    exactGuestContainer.style.display = "none";
    guestCheckbox.checked = false;
    exactGuestInput.value = "";
  }
});

// Show dropdown only if checkbox is checked
guestCheckbox.addEventListener("change", function() {
  guestCountContainer.style.display = this.checked ? "block" : "none";
  if (!this.checked) {
    exactGuestContainer.style.display = "none";
    exactGuestInput.value = "";
  }
});

// Show exact number input only if "5 or more" is selected
guestDropdown.addEventListener("change", function() {
  if (this.value === "5+") {
    exactGuestContainer.style.display = "block";
  } else {
    exactGuestContainer.style.display = "none";
    exactGuestInput.value = "";
  }
});

// Form submission
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const btn = form.querySelector(".rsvp-btn");
  btn.disabled = true;
  btn.textContent = "Sending...";

  // Determine final guest count
  let finalGuestCount = "1"; // Default is 1 (just the person themselves)
  
  if (guestCheckbox.checked) {
    if (guestDropdown.value === "5+") {
      finalGuestCount = exactGuestInput.value || "1";
    } else if (guestDropdown.value !== "") {
      finalGuestCount = guestDropdown.value;
    }
  }

  const data = {
    name: form.name.value,
    email: form.email.value,
    attendance: attendanceSelect.value,
    bringingGuests: guestCheckbox.checked ? "Yes" : "No",
    guestCount: finalGuestCount,
    message: form.message.value
  };

  console.log("Data being sent:", data); // For debugging

  fetch("https://script.google.com/macros/s/AKfycbwHD-8fLL5v5-Xsh22JPxEfG-HjB5wL19kK7CP1Lc4rmHCYpy4DEnmm9myC8ICXkg-H/exec", 
    {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(() => {
    form.reset();
    bringingGuestsContainer.style.display = "none";
    guestCountContainer.style.display = "none";
    exactGuestContainer.style.display = "none";
    popup.style.display = "flex";
  })
  .catch(() => alert("Network error. Please try again."))
  .finally(() => {
    btn.disabled = false;
    btn.textContent = "Send RSVP";
  });
});

function closePopup() {
  popup.style.display = "none";
}
//RSVP Scripts Ends Here



// Wedding song MP3 scripts starts here
document.addEventListener('DOMContentLoaded', function() {
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const volumeSlider = document.getElementById('volumeSlider');
    const playIcon = musicToggle.querySelector('.play-icon');
    const pauseIcon = musicToggle.querySelector('.pause-icon');
    
    // Set initial volume (50%)
    backgroundMusic.volume = 0.5;
    
    // Play/Pause Toggle
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            musicToggle.classList.add('playing');
        } else {
            backgroundMusic.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            musicToggle.classList.remove('playing');
        }
    });
    
    // Volume Control
    volumeSlider.addEventListener('input', function() {
        backgroundMusic.volume = this.value / 100;
        
        // Update slider gradient
        const percentage = this.value;
        this.style.background = `linear-gradient(to right, #c29d89 0%, #c29d89 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
    });
    
    // Auto-play on first user interaction (some browsers block auto-play)
    let hasInteracted = false;
    document.addEventListener('click', function() {
        if (!hasInteracted) {
            backgroundMusic.play().then(() => {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                musicToggle.classList.add('playing');
            }).catch(err => {
                console.log('Auto-play prevented. User needs to click play.');
            });
            hasInteracted = true;
        }
    }, { once: true });
});
// Wedding song MP3 scripts ends here



// Prenup Videos scripts Starts here
(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initPrenupVideoSection();
    });

    function initPrenupVideoSection() {
        // Main featured video functionality
        initFeaturedVideo();
        
        // Video grid cards functionality
        initVideoCards();
    }

    // Featured Video Player
    function initFeaturedVideo() {
        const playButton = document.getElementById('playButton');
        const videoPlaceholder = document.getElementById('videoPlaceholder');
        const videoPlayer = document.getElementById('videoPlayer');
        const youtubePlayer = document.getElementById('youtubePlayer');

        // Replace this with your actual YouTube video ID
        const MAIN_VIDEO_ID = 'dQw4w9WgXcQ'; // Example: 'dQw4w9WgXcQ'

        if (playButton && videoPlaceholder) {
            playButton.addEventListener('click', function(e) {
                e.stopPropagation();
                playFeaturedVideo();
            });

            videoPlaceholder.addEventListener('click', function() {
                playFeaturedVideo();
            });
        }

        function playFeaturedVideo() {
            if (videoPlaceholder && videoPlayer && youtubePlayer) {
                // Hide placeholder
                videoPlaceholder.style.display = 'none';
                
                // Show video player
                videoPlayer.style.display = 'block';
                
                // Set YouTube video URL with autoplay
                const videoSrc = `https://www.youtube.com/embed/${MAIN_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;
                youtubePlayer.src = videoSrc;

                // Optional: Track video play event
                trackVideoPlay('Featured Prenup Video');
            }
        }
    }

    // Video Grid Cards
    function initVideoCards() {
        const videoCards = document.querySelectorAll('.video-card');

        videoCards.forEach(function(card) {
            card.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video-id');
                const videoTitle = this.querySelector('h4')?.textContent || 'Prenup Video';

                if (videoId) {
                    playVideoInMainPlayer(videoId, videoTitle);
                }
            });

            // Add keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 'Play video');

            card.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // Play selected video in main player
    function playVideoInMainPlayer(videoId, videoTitle) {
        const mainVideoWrapper = document.getElementById('mainVideoWrapper');
        const videoPlaceholder = document.getElementById('videoPlaceholder');
        const videoPlayer = document.getElementById('videoPlayer');
        const youtubePlayer = document.getElementById('youtubePlayer');

        if (mainVideoWrapper && youtubePlayer) {
            // Scroll to main video player
            mainVideoWrapper.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });

            // Small delay for smooth scroll
            setTimeout(function() {
                // Hide placeholder
                if (videoPlaceholder) {
                    videoPlaceholder.style.display = 'none';
                }

                // Show video player
                if (videoPlayer) {
                    videoPlayer.style.display = 'block';
                }

                // Update video source with autoplay
                const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
                youtubePlayer.src = videoSrc;

                // Track video play
                trackVideoPlay(videoTitle);
            }, 500);
        }
    }

    // Analytics tracking (optional)
    function trackVideoPlay(videoTitle) {
        // You can integrate with Google Analytics or other analytics tools
        console.log('Video played:', videoTitle);

        // Example with Google Analytics (if implemented):
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', 'video_play', {
        //         'video_title': videoTitle,
        //         'event_category': 'Video',
        //         'event_label': videoTitle
        //     });
        // }
    }

    // Optional: Stop video when scrolling away
    function handleVideoStop() {
        const videoPlayer = document.getElementById('videoPlayer');
        const youtubePlayer = document.getElementById('youtubePlayer');

        if (!videoPlayer || !youtubePlayer) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) {
                    // Video is out of view - pause it
                    youtubePlayer.src = '';
                    videoPlayer.style.display = 'none';
                    
                    const videoPlaceholder = document.getElementById('videoPlaceholder');
                    if (videoPlaceholder) {
                        videoPlaceholder.style.display = 'block';
                    }
                }
            });
        }, {
            threshold: 0.5
        });

        observer.observe(videoPlayer);
    }

    // Call this function if you want videos to stop when scrolling away
    // handleVideoStop();

})();
// Prenup Videos scripts Ends Here