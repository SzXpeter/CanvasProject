import CanvasElement from "./CanvasElement.js";
export default class Enemy extends CanvasElement {
    constructor(canvas, ctx, drawFunction, speed, damage) {
        super(canvas, ctx, drawFunction);
        this.Speed = speed;
        this.Damage = damage;
    }

    SpawnEnemy() {
        const random = Math.random();
        if (random >= .75) {
            this.x = 0;
            this.y = Math.floor(Math.random() * this.Canvas.height);
        }
        else if (random >= .5) {
            this.x = this.Canvas.width;
            this.y = Math.floor(Math.random() * this.Canvas.height);
        }
        else if (random >= .25) {
            this.x = Math.floor(Math.random() * this.Canvas.width);
            this.y = 0;
        }
        else {
            this.x = Math.floor(Math.random() * this.Canvas.width);
            this.y = this.Canvas.height;
        }
        this.Draw();
    }

    MoveTowardsPoint(targetX, targetY, acceptance ) {
        if (acceptance && Math.abs(targetX - this.x) < 50 && Math.abs(targetY - this.y) < 50) return true;

        const angleToPoint = Math.atan2(targetY - this.y, targetX - this.x);

        const moveX = Math.cos(angleToPoint) * this.Speed;
        const moveY = Math.sin(angleToPoint) * this.Speed;

        this.x += moveX;
        this.y += moveY;

        this.Rotate = angleToPoint * (180 / Math.PI) + 90;
        this.Draw(this.ctx);
        return false;
    }
}