import Character from "./Character.js";

export default class Player extends Character {
    constructor(canvas, ctx, speed = 1, health = 100) {
        super(canvas, ctx, speed, health, 43.84);
        this.pressedKeys = new Set();

        window.addEventListener('keydown', (event) => this.pressedKeys.add(event.key));
        window.addEventListener('keyup', (event) => this.pressedKeys.delete(event.key));
        window.addEventListener('mousemove', (event) => {
            this.Clientx = event.clientX;
            this.Clienty = event.clientY;
        });
    }

    MovePlayer(deltaTime = 16.66667, room) {
        if (this.pressedKeys.size === 0) {
            this.Clear();
            this.Rotate = this.CalculateRotation();
            this.Draw();
            return;
        }
        let x = this.x;
        let y = this.y;

        if (this.pressedKeys.has('w')) y -= this.Speed * 50;
        if (this.pressedKeys.has('a')) x -= this.Speed * 50;
        if (this.pressedKeys.has('s')) y += this.Speed * 50;
        if (this.pressedKeys.has('d')) x += this.Speed * 50;

        this.CalculateTargetAngle(x, y);
        this.MoveTowardsPoint(x, y, 10, deltaTime, room);
    }

    DrawCharacter() {
        this.ctx.fillStyle = "purple";
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius - 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(-20, -20, 40, 10);
    }

    CalculateRotation() {
        const rect = this.Canvas.getBoundingClientRect();
        const mouseX = this.Clientx - rect.left;
        const mouseY = this.Clienty - rect.top;
        return Math.atan2(mouseY - this.y, mouseX - this.x) * (180 / Math.PI) + 90;
    }
}