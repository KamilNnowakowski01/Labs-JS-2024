export default class Bubble {
    constructor(ctx, x, y, radius, speedX, speedY) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x - this.radius < 0 || this.x + this.radius > this.ctx.canvas.width) {
            this.speedX *= -1;
        }

        if (this.y - this.radius < 0 || this.y + this.radius > this.ctx.canvas.height) {
            this.speedY *= -1;
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
    }
}
