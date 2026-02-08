 document.addEventListener('DOMContentLoaded', function() {
            const invitation = document.getElementById('weddingInvitation');
            const openButton = document.getElementById('openInvitation');
            const redirectOverlay = document.getElementById('redirectOverlay');
            const heartsContainer = document.getElementById('heartsContainer');
            
            // Create floating hearts
            function createHearts() {
                const heartCount = 15;
                
                for (let i = 0; i < heartCount; i++) {
                    const heart = document.createElement('div');
                    heart.classList.add('heart');
                    heart.innerHTML = '❤';
                    
                    // Random position and animation delay
                    const leftPos = Math.random() * 100;
                    const delay = Math.random() * 5;
                    const duration = 6 + Math.random() * 4;
                    
                    heart.style.left = `${leftPos}%`;
                    heart.style.animationDelay = `${delay}s`;
                    heart.style.animationDuration = `${duration}s`;
                    
                    heartsContainer.appendChild(heart);
                }
            }
            
            createHearts();
            
            // Function to handle the invitation click
            function handleInvitationClick() {
                // Add click effect to the envelope
                invitation.style.transform = 'scale(0.95)';
                invitation.style.boxShadow = '0 5px 15px rgba(139, 107, 93, 0.2)';
                
                // Show the redirect overlay
                setTimeout(() => {
                    redirectOverlay.classList.add('active');
                }, 300);
                
                // Redirect after a delay
                setTimeout(() => {
                    window.location.href = 'wedding-invitation.html';
                }, 3000);
            }
            
            // Add click event to the entire invitation
            invitation.addEventListener('click', handleInvitationClick);
            
            // Also add click event to the button for accessibility
            openButton.addEventListener('click', function(e) {
                e.stopPropagation();
                handleInvitationClick();
            });
            
            // Add hover effect with keyboard support
            invitation.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.01)';
            });
            
            invitation.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            // Keyboard accessibility
            invitation.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleInvitationClick();
                }
            });
            
            // Set focus for accessibility
            invitation.setAttribute('tabindex', '0');
            
            // Add a subtle entrance animation
            invitation.style.opacity = '0';
            invitation.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                invitation.style.transition = 'opacity 1s ease, transform 1s ease';
                invitation.style.opacity = '1';
                invitation.style.transform = 'translateY(0)';
            }, 100);
        });