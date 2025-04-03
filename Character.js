import CanvasElement from "./CanvasElement.js";

export default class Character extends CanvasElement {
    constructor(canvas, ctx, speed, health) {
        super(canvas, ctx);
        this.Speed = speed;
        this.Health = health;
    }

    SpawnCharacter(x, y) {
        this.x = x;
        this.y = y;
        this.Draw();
    }

    MoveTowardsPoint(targetX, targetY, acceptance = 10, deltaTime = 16.66667) {
        if (Math.abs(targetX - this.x) < acceptance && Math.abs(targetY - this.y) < acceptance) {
            this.Draw();
            return true;
        }
        this.Clear();

        this.x += this.moveX * (deltaTime / 1000);
        this.y += this.moveY * (deltaTime / 1000);
        this.Rotate = this.CalculateRotation();
        
        this.Draw();
        return false;
    }
    
    CalculateTargetAngle(targetX, targetY) {
        this.angleToPoint = Math.atan2(targetY - this.y, targetX - this.x);
        this.moveX = Math.cos(this.angleToPoint) * this.Speed;
        this.moveY = Math.sin(this.angleToPoint) * this.Speed;
    }

    CalculateRotation() {
        return this.angleToPoint * (180 / Math.PI) + 90;
    }
}