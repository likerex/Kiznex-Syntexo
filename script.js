// --- Kiznex Syntexo - Final Interactivity ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Generation (Animated Background)
    // Generates 40 glowing particles in the background for visual effect
    const particleField = document.querySelector('.particle-field');
    if (particleField) {
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            // Set random position and animation delays for variety
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = 10 + Math.random() * 10 + 's'; 
            particleField.appendChild(particle);
        }
    }

    // 2. Smooth Scrolling for internal links (Home/Features/About etc.)
    // Ensures a smooth user experience when navigating the single-page layout
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 3. Card Click Logic
    // Makes the entire Holo Card clickable (not just the button)
    const holoCards = document.querySelectorAll('.holo-card');
    holoCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent button click from triggering the card click twice
            if (e.target.closest('.sci-fi-btn')) {
                return; 
            }
            const link = this.getAttribute('data-link');
            if (link) {
                // Navigate to the linked page
                window.location.href = link;
            }
        });
        
        // Add hover effect when hovering over the card
        card.addEventListener('mouseenter', () => {
             card.style.transform = 'translateY(-3px) scale(1.01)';
        });
        card.addEventListener('mouseleave', () => {
             card.style.transform = '';
        });
    });
});

