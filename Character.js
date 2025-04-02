import CanvasElement from "./CanvasElement.js";
export default class Character extends CanvasElement {
    constructor(canvas, ctx, drawFunction, speed, health) {
        super(canvas, ctx, drawFunction);
        this.Speed = speed;
        this.Health = health;
    }

    SpawnCharacter(x, y) {
        this.x = x;
        this.y = y;
        this.Draw();
    }

    MoveTowardsPoint(targetX, targetY, acceptance = 10) {
        if (Math.abs(targetX - this.x) < acceptance && Math.abs(targetY - this.y) < acceptance) {
            this.Draw();
            return true;
        } 

        const angleToPoint = Math.atan2(targetY - this.y, targetX - this.x);

        const moveX = Math.cos(angleToPoint) * this.Speed;
        const moveY = Math.sin(angleToPoint) * this.Speed;

        this.Clear();

        this.x += moveX;
        this.y += moveY;

        this.Rotate = angleToPoint * (180 / Math.PI) + 90;
        this.Draw();
        return false;
    }
}