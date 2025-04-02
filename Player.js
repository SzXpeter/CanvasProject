import Character from "./Character.js";

export default class Player extends Character {
    constructor(canvas, ctx, drawFunction, speed = 1, health = 100) {
        super(canvas, ctx, drawFunction, speed, health);
        this.pressedKeys = new Set();

        window.addEventListener('keydown', (event) => this.pressedKeys.add(event.key));
        window.addEventListener('keyup', (event) => this.pressedKeys.delete(event.key));
    }

    MovePlayer() {
        if (this.pressedKeys.size === 0) {
            this.Draw();
            return;
        }
        let x = this.x;
        let y = this.y;

        if (this.pressedKeys.has('w')) y -= this.Speed * 10; // Move up
        if (this.pressedKeys.has('a')) x -= this.Speed * 10; // Move left
        if (this.pressedKeys.has('s')) y += this.Speed * 10; // Move down
        if (this.pressedKeys.has('d')) x += this.Speed * 10; // Move right

        this.MoveTowardsPoint(x, y, 10);
    }

    Clear() {
        this.ctx.translate(this.x, this.y)
        this.ctx.rotate(Math.PI / 180 * this.Rotate);
        this.ctx.clearRect(-31, -31, 62, 62);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
    }
}