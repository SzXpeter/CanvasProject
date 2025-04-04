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

    MovePlayer(deltaTime = 16.66667, room, otherCharacters = []) {
        if (this.pressedKeys.size === 0) {
            this.Clear();
            this.Rotate = this.CalculateRotation();
            this.Draw();
            return;
        }
        let x = this.x;
        let y = this.y;

        if (this.pressedKeys.has('w')) y -= this.Speed * 50; // Move up
        if (this.pressedKeys.has('a')) x -= this.Speed * 50; // Move left
        if (this.pressedKeys.has('s')) y += this.Speed * 50; // Move down
        if (this.pressedKeys.has('d')) x += this.Speed * 50; // Move right

        this.CalculateTargetAngle(x, y);
        this.MoveTowardsPoint(x, y, 10, deltaTime, room);
    }

    Clear() {
        this.ctx.translate(this.x, this.y)
        this.ctx.rotate(Math.PI / 180 * this.Rotate);
        this.ctx.clearRect(-31, -31, 62, 62);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
    }

    DrawCharacter() {
        this.ctx.fillStyle = "purple";
        this.ctx.fillRect(-30, -30, 60, 60);
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