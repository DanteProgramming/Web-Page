document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================
       1. LIGHT & DARK MODE TOGGLE (DEFAULTS TO DARK MODE)
       ========================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const ripple = document.getElementById('theme-ripple');

    // Load saved theme if visitor previously toggled it; otherwise stay in 'dark'
    const savedTheme = localStorage.getItem('dante-woodworking-theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Position ripple at the center of the toggle button
        const rect = themeToggle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        ripple.style.left = `${centerX}px`;
        ripple.style.top = `${centerY}px`;

        // Restart ripple animation
        ripple.classList.remove('animate');
        void ripple.offsetWidth; // Trigger reflow
        ripple.classList.add('animate');

        // Switch theme mid-animation
        htmlElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('dante-woodworking-theme', nextTheme);
    });


    /* ==========================================================
       2. COPY EMAIL BUTTON FUNCTIONALITY
       ========================================================== */
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');

    if (copyEmailBtn && emailText) {
        copyEmailBtn.addEventListener('click', () => {
            const email = emailText.textContent.trim();
            navigator.clipboard.writeText(email).then(() => {
                const originalText = copyEmailBtn.textContent;
                copyEmailBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyEmailBtn.textContent = originalText;
                }, 2000);
            });
        });
    }


    /* ==========================================================
       3. DYNAMIC WOOD-GRAIN & SAWDUST CANVAS BACKGROUND
       ========================================================== */
    const canvas = document.getElementById('dynamic-bg');
    const ctx = canvas.getContext('2d');

    let width, height;
    let mouse = { x: -1000, y: -1000 };
    let time = 0;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Floating sawdust particles
    const particles = Array.from({ length: 35 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: Math.random() * -0.4 - 0.1
    }));

    function getThemeColors() {
        const styles = getComputedStyle(document.documentElement);
        return {
            grain: styles.getPropertyValue('--grain-color').trim(),
            particle: styles.getPropertyValue('--particle-color').trim()
        };
    }

    function animateBackground() {
        ctx.clearRect(0, 0, width, height);
        const colors = getThemeColors();
        time += 0.008;

        // Draw organic flowing wood-grain contours
        ctx.strokeStyle = colors.grain;
        ctx.lineWidth = 1.25;

        const lineCount = 22;
        const spacing = height / (lineCount - 4);

        for (let i = -2; i < lineCount; i++) {
            ctx.beginPath();
            const baseY = i * spacing;

            for (let x = 0; x <= width; x += 25) {
                const wave1 = Math.sin(x * 0.003 + time + i * 0.45) * 28;
                const wave2 = Math.cos(x * 0.007 - time * 0.7 + i) * 12;

                // Subtle interactive bend near mouse cursor
                const dx = x - mouse.x;
                const dy = baseY - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const mouseBend = dist < 240 ? (1 - dist / 240) * 35 : 0;

                const y = baseY + wave1 + wave2 + mouseBend;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }

        // Draw drifting sawdust motes
        ctx.fillStyle = colors.particle;
        particles.forEach((p) => {
            p.x += p.speedX + Math.sin(time + p.y * 0.01) * 0.2;
            p.y += p.speedY;

            // Wrap around screen edges
            if (p.y < -10) p.y = height + 10;
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animateBackground);
    }

    animateBackground();


    /* ==========================================================
       4. IMAGE LIGHTBOX (CLICK ANY PHOTO TO ENLARGE)
       ========================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    document.querySelectorAll('main img').forEach((img) => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.alt || '';
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
});