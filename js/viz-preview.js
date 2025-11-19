// Preview visualizations for the homepage

class VizPreview {
    constructor(canvasId, type) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.type = type;
        this.animationId = null;

        this.resize();
        this.animate();
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    drawSMPreview(time) {
        // Streaming Multiprocessor preview
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = 60;

        // Draw SM circle
        this.ctx.strokeStyle = '#76b900';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw cores around the circle
        const numCores = 8;
        for (let i = 0; i < numCores; i++) {
            const angle = (i / numCores) * Math.PI * 2 + time * 0.0005;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            const pulse = Math.sin(time * 0.003 + i) * 0.3 + 0.7;
            this.ctx.fillStyle = `rgba(118, 185, 0, ${pulse})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Center label
        this.ctx.fillStyle = '#00d4aa';
        this.ctx.font = 'bold 14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SM', centerX, centerY + 5);
    }

    drawMemoryPreview(time) {
        // Memory hierarchy preview
        const levels = [
            { name: 'Global', color: '#76b900', y: 0.2, width: 0.8 },
            { name: 'L2', color: '#00d4aa', y: 0.4, width: 0.6 },
            { name: 'L1', color: '#669900', y: 0.6, width: 0.4 },
            { name: 'Shared', color: '#00bbaa', y: 0.8, width: 0.3 }
        ];

        levels.forEach((level, index) => {
            const pulse = Math.sin(time * 0.002 + index * 0.5) * 0.2 + 0.8;
            const y = this.height * level.y;
            const width = this.width * level.width * pulse;
            const x = (this.width - width) / 2;
            const height = 30;

            this.ctx.fillStyle = level.color;
            this.ctx.fillRect(x, y - height/2, width, height);

            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(level.name, this.width / 2, y + 5);
        });
    }

    drawWarpPreview(time) {
        // Warp execution preview
        const threads = 32;
        const cols = 8;
        const rows = threads / cols;
        const cellSize = Math.min(this.width / cols, this.height / rows) * 0.8;
        const startX = (this.width - cellSize * cols) / 2;
        const startY = (this.height - cellSize * rows) / 2;

        for (let i = 0; i < threads; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = startX + col * cellSize;
            const y = startY + row * cellSize;

            // Simulate warp execution
            const executionPhase = (time * 0.001) % threads;
            const isActive = i <= executionPhase;

            this.ctx.fillStyle = isActive
                ? `rgba(118, 185, 0, ${0.8 - (executionPhase - i) * 0.02})`
                : 'rgba(255, 255, 255, 0.1)';

            this.ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        }

        // Warp label
        this.ctx.fillStyle = '#00d4aa';
        this.ctx.font = 'bold 14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('32 Threads', this.width / 2, this.height - 20);
    }

    drawMatMulPreview(time) {
        // Matrix multiplication preview
        const gridSize = 8;
        const cellSize = Math.min(this.width / (gridSize * 2 + 2), this.height / gridSize) * 0.8;
        const gap = cellSize * 2;

        // Draw matrix A
        const aX = cellSize;
        const aY = (this.height - gridSize * cellSize) / 2;
        this.drawMatrix(aX, aY, gridSize, gridSize, cellSize, '#76b900', time, 'A');

        // Draw matrix B
        const bX = aX + gridSize * cellSize + gap;
        this.drawMatrix(bX, aY, gridSize, gridSize, cellSize, '#00d4aa', time * 0.8, 'B');

        // Draw multiplication symbol
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 20px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('×', aX + gridSize * cellSize + gap/2, this.height / 2);
    }

    drawMatrix(x, y, rows, cols, cellSize, color, time, label) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cellX = x + j * cellSize;
                const cellY = y + i * cellSize;
                const pulse = Math.sin(time * 0.002 + i + j) * 0.3 + 0.5;

                this.ctx.fillStyle = `rgba(${color === '#76b900' ? '118, 185, 0' : '0, 212, 170'}, ${pulse})`;
                this.ctx.fillRect(cellX + 1, cellY + 1, cellSize - 2, cellSize - 2);
            }
        }

        // Matrix label
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 12px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, x + (cols * cellSize) / 2, y - 10);
    }

    animate(time = 0) {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(26, 26, 26, 1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw based on type
        switch (this.type) {
            case 'sm':
                this.drawSMPreview(time);
                break;
            case 'memory':
                this.drawMemoryPreview(time);
                break;
            case 'warp':
                this.drawWarpPreview(time);
                break;
            case 'matmul':
                this.drawMatMulPreview(time);
                break;
        }

        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize preview visualizations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new VizPreview('sm-viz-preview', 'sm');
    new VizPreview('memory-viz-preview', 'memory');
    new VizPreview('warp-viz-preview', 'warp');
    new VizPreview('matmul-viz-preview', 'matmul');
});
