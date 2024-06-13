import Bubble from "./Bubble.js";
import getRandom from "./helpers/getRandom.js";

export default class BubbleManager {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.bubbles = [];
    }

    createBubbles(num) {
        this.bubbles = [];
        for (let i = 0; i < num; i++) {
            const radius = 5;
            const x = getRandom(radius, this.canvas.width - radius);
            const y = getRandom(radius, this.canvas.height - radius);
            const speedX = getRandom(-2, 2);
            const speedY = getRandom(-2, 2);
            this.bubbles.push(new Bubble(this.ctx, x, y, radius, speedX, speedY));
        }
    }

    drawLines(maxDistance) {
        for (let i = 0; i < this.bubbles.length; i++) {
            for (let j = i + 1; j < this.bubbles.length; j++) {
                const dx = this.bubbles[i].x + this.bubbles[i].speedX - this.bubbles[j].x - this.bubbles[j].speedX;
                const dy = this.bubbles[i].y + this.bubbles[i].speedY - this.bubbles[j].y - this.bubbles[j].speedY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.bubbles[i].x, this.bubbles[i].y);
                    this.ctx.lineTo(this.bubbles[j].x, this.bubbles[j].y);
                    this.ctx.strokeStyle = 'gray';
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const bubble of this.bubbles) {
            bubble.move();
            bubble.draw();
        }

        const maxDistance = this.canvas.width * (parseInt(document.getElementById('lineDistance').value) / 100);
        this.drawLines(maxDistance);
    }

    reset() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bubbles = [];
    }
}
