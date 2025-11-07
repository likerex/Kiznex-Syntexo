/*
==============================================
  LOGIC FOR ALL DETAIL PAGES (post1.html, etc.)
==============================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Background Particles ---
    const particleField = document.getElementById('particles-post');
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

    // --- 2. Lightbox Gallery Logic ---
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const downloadBtn = document.getElementById('download-btn');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            const imgSrc = img.getAttribute('src');
            const imgAlt = img.getAttribute('alt');
            
            lightboxImg.setAttribute('src', imgSrc); // Full image set karo
            downloadBtn.setAttribute('href', imgSrc); // Download link set karo
            downloadBtn.setAttribute('download', imgAlt); // File ka naam set karo
            
            if(lightbox) lightbox.style.display = 'flex'; // Lightbox dikhao
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            if(lightbox) lightbox.style.display = 'none'; // Lightbox band karo
        });
    }
    
    // Lightbox ko background par click karke bhi band kar sakte hain
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            // Check karo ki click image par nahi, balki background par hua hai
            if (e.target.id === 'lightbox-modal') {
                lightbox.style.display = 'none';
            }
        });
    }


    // --- 3. Ad Logic: Download Flag ---
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            // Asli download ko na rokein, bas flag set karein
            console.log('Download initiated. Setting ad flag.');
            sessionStorage.setItem('downloadClicked', 'true');
            
            // Lightbox ko 1 second baad band kar do taaki user ko lage download start ho gaya
            setTimeout(() => {
                 if(lightbox) lightbox.style.display = 'none';
            }, 1000);
        });
    }

    // --- 4. Ad Logic: Back Button Intercept ---
    const backBtn = document.getElementById('back-to-hub-btn');
    const adModal = document.getElementById('ad-modal');
    const closeAdBtn = document.getElementById('close-ad-btn');

    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            // Check karo ki download flag set hai ya nahi
            if (sessionStorage.getItem('downloadClicked') === 'true') {
                // 1. Button ko roko (index.html par jaane se)
                e.preventDefault();
                
                // 2. Ad Modal dikhao
                console.log('Ad flag detected. Showing ad modal.');
                if(adModal) adModal.style.display = 'flex';
                
                // 3. Flag ko clear karo (taaki ad ek hi baar dikhe)
                sessionStorage.removeItem('downloadClicked');

            } else {
                // Agar flag set nahi hai, toh normal back jao
                console.log('No ad flag. Returning to hub.');
                // Do nothing, link will work as normal.
            }
        });
    }

    if (closeAdBtn) {
        closeAdBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Ad band karo
            if(adModal) adModal.style.display = 'none';
            
            // Ab user ko manually back bhejo
            if(backBtn) window.location.href = backBtn.href;
        });
    }

});
