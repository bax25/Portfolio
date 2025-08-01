document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) {
        console.warn('Particle canvas not found. Skipping particle network initialization.');
        return;
    }

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animationFrameId;
    let isAnimating = false;
    let resizeTimeout;

    // Cache for theme-based colors
    let cachedColors = {
        particle: null,
        line: null,
        isDark: null
    };

    // Convert hex to rgba
    function hexToRgba(hex, alpha) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 7) { // #RRGGBB
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        } else if (hex.length === 4) { // #RGB
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function getCssVariable(variable, fallback) {
        const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
        return value || fallback;
    }

    // Update theme colors
    function updateColorCache() {
        const isDark = document.documentElement.classList.contains('dark');
        if (cachedColors.isDark === isDark) return;

        cachedColors.isDark = isDark;
        const primaryHex = isDark
            ? getCssVariable('--color-primary-dark', '#3B82F6')
            : getCssVariable('--color-primary-light', '#2563EB');

        cachedColors.particle = hexToRgba(primaryHex, 0.6);
        cachedColors.line = primaryHex;
    }

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            const margin = this.size;
            if (this.x + margin >= canvas.width || this.x - margin <= 0) {
                this.directionX = -this.directionX;
                this.x = Math.max(margin, Math.min(canvas.width - margin, this.x));
            }
            if (this.y + margin >= canvas.height || this.y - margin <= 0) {
                this.directionY = -this.directionY;
                this.y = Math.max(margin, Math.min(canvas.height - margin, this.y));
            }

            this.x += this.directionX;
            this.y += this.directionY;

            // Mouse repulsion
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    const repulsionStrength = 4;

                    this.x -= Math.cos(angle) * force * repulsionStrength;
                    this.y -= Math.sin(angle) * force * repulsionStrength;

                    this.x = Math.max(margin, Math.min(canvas.width - margin, this.x));
                    this.y = Math.max(margin, Math.min(canvas.height - margin, this.y));
                }
            }

            this.draw();
        }
    }

    function init() {
        particles = [];
        updateColorCache();

        const screenArea = canvas.width * canvas.height;
        const baseParticleCount = Math.floor(screenArea / 15000);

        let numberOfParticles;
        if (window.innerWidth > 1200) {
            numberOfParticles = Math.min(100, Math.max(60, baseParticleCount));
        } else if (window.innerWidth > 768) {
            numberOfParticles = Math.min(80, Math.max(40, baseParticleCount));
        } else {
            numberOfParticles = Math.min(40, Math.max(20, baseParticleCount));
        }

        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 3 + 1.5;
            const margin = size * 2;
            const x = Math.random() * (canvas.width - margin * 2) + margin;
            const y = Math.random() * (canvas.height - margin * 2) + margin;
            const speed = Math.random() * 0.4 + 0.1;
            const angle = Math.random() * Math.PI * 2;
            const directionX = Math.cos(angle) * speed;
            const directionY = Math.sin(angle) * speed;

            particles.push(new Particle(x, y, directionX, directionY, size, cachedColors.particle));
        }
    }

    function connect() {
        const maxDistance = window.innerWidth > 768 ? 120 : 80;
        const maxDistanceSq = maxDistance * maxDistance;

        ctx.lineWidth = 1;

        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distanceSq = dx * dx + dy * dy;

                if (distanceSq < maxDistanceSq) {
                    const opacity = 1 - (distanceSq / maxDistanceSq);
                    ctx.strokeStyle = hexToRgba(cachedColors.line, opacity);
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        if (!isAnimating) return;
        animationFrameId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let p of particles) p.update();
        connect();
    }

    function resizeCanvas() {
        const homeSection = document.getElementById('home');
        if (!homeSection) return;

        canvas.width = homeSection.clientWidth;
        canvas.height = homeSection.offsetHeight;
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            init();
        }, 100);
    }

    function updateMousePosition(x, y) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = x - rect.left;
        mouse.y = y - rect.top;
    }

    function clearMousePosition() {
        mouse.x = null;
        mouse.y = null;
    }

    function startAnimation() {
        if (!isAnimating) {
            isAnimating = true;
            animate();
        }
    }

    function stopAnimation() {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId);
    }

    // Named event handlers
    function onMouseMove(event) {
        const homeSection = document.getElementById('home');
        if (homeSection) {
            const rect = homeSection.getBoundingClientRect();
            const tolerance = 5;
            if (
                event.clientX >= rect.left - tolerance &&
                event.clientX <= rect.right + tolerance &&
                event.clientY >= rect.top - tolerance &&
                event.clientY <= rect.bottom + tolerance
            ) {
                updateMousePosition(event.clientX, event.clientY);
            } else {
                clearMousePosition();
            }
        }
    }

    function onMouseOut() {
        clearMousePosition();
    }

    function onTouchMove(event) {
        const homeSection = document.getElementById('home');
        const touch = event.touches[0];
        if (!touch) return;

        const rect = homeSection.getBoundingClientRect();
        if (
            touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom
        ) {
            event.preventDefault();
            updateMousePosition(touch.clientX, touch.clientY);
        } else {
            clearMousePosition();
        }
    }

    // Theme mutation observer
    const observer = new MutationObserver(() => {
        updateColorCache();
        particles.forEach(p => (p.color = cachedColors.particle));
    });
    observer.observe(document.documentElement, { attributes: true });

    // Intersection observer for performance
    const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => (entry.isIntersecting ? startAnimation() : stopAnimation()));
    }, { threshold: 0.1 });
    intersectionObserver.observe(canvas);

    // Add listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseout', onMouseOut, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', clearMousePosition, { passive: true });

    // Init
    resizeCanvas();
    init();
    startAnimation();
});
