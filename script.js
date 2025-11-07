/*
==============================================
  LOGIC FOR HOME PAGE (index.html)
==============================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Particle Generation ---
    const particleField = document.getElementById('particles');
    if (particleField) {
        const particleCount = 40;
        for (let i = 0; i < particleCount; i++) {
            let particle = document.createElement('div');
            particle.className = 'glow-particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDelay = (Math.random() * 20) + 's';
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            particleField.appendChild(particle);
        }
    }

    // --- 2. Video Autoplay ---
    const videos = document.querySelectorAll('video');
    let userInteracted = false;

    // Video ko safely play karne ka function
    const safePlayVideo = (video) => {
        if (!video || (video.paused === false && !video.ended)) return; // Agar pehle se chal raha hai toh chhod do
        video.muted = true;
        video.playsInline = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                if (err.name !== 'AbortError') { console.log('Video play prevented'); }
            });
        }
    };

    // User ke pehle click/touch par videos enable karna
    const enableInteraction = () => {
        if (userInteracted) return;
        userInteracted = true;
        console.log('User interaction detected. Enabling video playback.');
        videos.forEach(video => {
            // Jo video screen par dikh raha hai, use play karo
            if (video.getBoundingClientRect().top < window.innerHeight && video.getBoundingClientRect().bottom >= 0) {
                safePlayVideo(video);
            }
        });
        // Listeners ko remove karo taaki yeh baar baar na chale
        document.removeEventListener('click', enableInteraction);
        document.removeEventListener('touchstart', enableInteraction);
        document.removeEventListener('keydown', enableInteraction);
    };

    // User interaction ke liye listeners
    document.addEventListener('click', enableInteraction);
    document.addEventListener('touchstart', enableInteraction);
    document.addEventListener('keydown', enableInteraction);

    // Header video ko turant play karne ki koshish (mobile par shayad na chale)
    const headerVideo = document.querySelector('.header-video');
    if(headerVideo) {
        safePlayVideo(headerVideo);
    }

    // Intersection Observer (jo video screen par aayega, wahi play hoga)
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    // Header video ko hamesha play rakho, baakiyon ko interaction ke baad
                    if (userInteracted || video.classList.contains('header-video')) { 
                        safePlayVideo(video); 
                    }
                } else {
                    // Header video ko pause mat karo, baakiyon ko kar do
                    if (video && !video.paused && !video.classList.contains('header-video')) { 
                        video.pause(); 
                    }
                }
            });
        }, { threshold: 0.1 }); // Jab 10% video dikhe
        videos.forEach(video => videoObserver.observe(video));
    } else {
        // Agar observer support nahi hai, toh sab play karne ki koshish karo
        videos.forEach(video => safePlayVideo(video));
    }

    // --- 3. Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    window.onscroll = () => {
        // Agar user 100px neeche scroll kare, toh button dikhao
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            if(backToTopBtn) backToTopBtn.style.display = "block";
        } else {
            if(backToTopBtn) backToTopBtn.style.display = "none";
        }
    };

    // --- 4. Pagination ---
    const cardsPerPage = 6; // Ek page par 6 card dikhenge
    let currentPage = 1;
    const allCards = Array.from(document.querySelectorAll('.holo-card'));
    const totalPages = Math.ceil(allCards.length / cardsPerPage);
    
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const pageIndicator = document.getElementById('pageIndicator');
    const paginationControls = document.querySelector('.pagination-hud');

    function showPage(page) {
        const startIndex = (page - 1) * cardsPerPage;
        const endIndex = page * cardsPerPage;

        allCards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.style.display = "flex"; // Card dikhao
            } else {
                card.style.display = "none"; // Card chhipao
            }
        });
    }

    function updatePaginationUI() {
        if (!pageIndicator || !prevButton || !nextButton) return;
        pageIndicator.textContent = `Page ${currentPage} / ${totalPages}`;
        prevButton.style.display = (currentPage === 1) ? "none" : "inline-block";
        nextButton.style.display = (currentPage === totalPages) ? "none" : "inline-block";
    }

    if(prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
                updatePaginationUI();
            }
        });
    }

    if(nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
                updatePaginationUI();
            }
        });
    }

    // Page load par initial setup
    showPage(1);
    updatePaginationUI();

    // --- 5. Search Functionality ---
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if(searchInput) {
        searchInput.addEventListener('keyup', () => {
            const filter = searchInput.value.toUpperCase();
            
            if (filter.length > 0) {
                // Search active
                if(paginationControls) paginationControls.style.display = 'none'; // Pagination hide karo
                if(clearSearchBtn) clearSearchBtn.style.display = 'inline-block';
                
                allCards.forEach(card => {
                    // h2 tag ke andar ka text (hidden) search karo
                    const title = card.querySelector('h2').textContent.toUpperCase();
                    if (title.indexOf(filter) > -1) {
                        card.style.display = "flex"; // Search result show karo
                    } else {
                        card.style.display = "none"; // Hide karo
                    }
                });

            } else {
                // Search empty
                if(paginationControls) paginationControls.style.display = 'flex'; // Pagination waapas dikhao
                if(clearSearchBtn) clearSearchBtn.style.display = 'none';
                showPage(currentPage); // Current page restore karo
            }
        });
    }
    
    if(clearSearchBtn) {
        clearSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchInput.value = '';
            if(paginationControls) paginationControls.style.display = 'flex';
            clearSearchBtn.style.display = 'none';
            showPage(currentPage);
        });
    }
});
