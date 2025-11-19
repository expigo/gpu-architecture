// Hero section GPU visualization using Canvas

class GPUHeroVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.cores = [];
        this.animationId = null;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    init() {
        // Create GPU core visualization
        const rows = 8;
        const cols = 8;
        const spacing = 40;
        const startX = (this.width - (cols * spacing)) / 2;
        const startY = (this.height - (rows * spacing)) / 2;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.cores.push({
                    x: startX + j * spacing,
                    y: startY + i * spacing,
                    size: 8,
                    active: Math.random() > 0.5,
                    pulsePhase: Math.random() * Math.PI * 2,
                    type: Math.random() > 0.7 ? 'tensor' : 'cuda'
                });
            }
        }

        // Create connecting particles
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    drawCore(core, time) {
        this.ctx.save();

        // Pulsing effect
        const pulse = Math.sin(time * 0.002 + core.pulsePhase) * 0.3 + 0.7;
        const size = core.size * (core.active ? pulse : 0.6);

        // Core color based on type
        const color = core.type === 'tensor'
            ? `rgba(0, 212, 170, ${core.active ? pulse : 0.3})`
            : `rgba(118, 185, 0, ${core.active ? pulse : 0.3})`;

        // Draw core
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(core.x, core.y, size, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw glow for active cores
        if (core.active) {
            const gradient = this.ctx.createRadialGradient(
                core.x, core.y, size,
                core.x, core.y, size * 3
            );
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(core.x, core.y, size * 3, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawConnections() {
        this.ctx.strokeStyle = 'rgba(118, 185, 0, 0.1)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.cores.length; i++) {
            for (let j = i + 1; j < this.cores.length; j++) {
                const core1 = this.cores[i];
                const core2 = this.cores[j];
                const distance = Math.hypot(core1.x - core2.x, core1.y - core2.y);

                if (distance < 60 && core1.active && core2.active) {
                    const opacity = (60 - distance) / 60 * 0.3;
                    this.ctx.strokeStyle = `rgba(118, 185, 0, ${opacity})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(core1.x, core1.y);
                    this.ctx.lineTo(core2.x, core2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(0, 212, 170, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Update particle position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;
        });
    }

    animate(time = 0) {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw connections between active cores
        this.drawConnections();

        // Draw cores
        this.cores.forEach(core => this.drawCore(core, time));

        // Draw particles
        this.drawParticles();

        // Randomly toggle core states
        if (Math.random() > 0.98) {
            const randomCore = this.cores[Math.floor(Math.random() * this.cores.length)];
            randomCore.active = !randomCore.active;
        }

        // Draw labels
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = '12px monospace';
        this.ctx.fillText('64 CUDA Cores', 10, 20);
        this.ctx.fillText(`Active: ${this.cores.filter(c => c.active).length}`, 10, 40);

        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize hero visualization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GPUHeroVisualization('gpu-hero-canvas');
});
