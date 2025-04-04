import CanvasElement from "./CanvasElement.js";

export default class Character extends CanvasElement {
    constructor(canvas, ctx, speed, health, collisionRadius = 25) {
        super(canvas, ctx);
        this.Speed = speed;
        this.Health = health;
        this.CollisionRadius = collisionRadius;
    }

    SpawnCharacter(x, y) {
        this.x = x;
        this.y = y;
        this.Draw();
    }

    MoveTowardsPoint(targetX, targetY, acceptance = 10, deltaTime = 16.66667, room, otherCharacters = []) {
        if (Math.abs(targetX - this.x) < acceptance && Math.abs(targetY - this.y) < acceptance) {
            this.Draw();
            return true;
        }
        this.Clear();
    
        let NextX = this.MoveX * (deltaTime / 1000);
        let NextY = this.MoveY * (deltaTime / 1000);
        let CollidingX = this.IsCollidingHorizontally(room, this.x + NextX, otherCharacters);
        let CollidingY = this.IsCollidingVertically(room, this.y + NextY, otherCharacters);

        if (CollidingX)
            NextX = 0;
        if (CollidingY)
            NextY = 0;
        
        this.x += CollidingX ? 0 : NextX;
        this.y += CollidingY ? 0 : NextY;
    
        this.Rotate = this.CalculateRotation();
        this.Draw();
        return false;
    }

    IsCollidingHorizontally(room, nextX, otherCharacters) {
        if (nextX < this.CollisionRadius || nextX > this.Canvas.width - this.CollisionRadius)
            return true;

        if (room.IsCollidingWithWall(nextX, this.y, this.CollisionRadius))
            return true;

        for (const character of otherCharacters)
            if (character !== this && this.IsCollidingWithCharacter(nextX, this.y, character))
                return true;
        return false;
    }

    IsCollidingVertically(room, nextY, otherCharacters) {
        if (nextY < this.CollisionRadius || nextY > this.Canvas.height - this.CollisionRadius)
            return true;

        if (room.IsCollidingWithWall(this.x, nextY, this.CollisionRadius))
            return true;

        for (const character of otherCharacters)
            if (character !== this && this.IsCollidingWithCharacter(this.x, nextY, character))
                return true;
        return false;
    }
    
    CalculateTargetAngle(targetX, targetY) {
        const angleToPoint = Math.atan2(targetY - this.y, targetX - this.x);

        this.angleX = Math.round(Math.cos(angleToPoint) * 10 ** 2) / 10 ** 2;
        this.angleY = Math.round(Math.sin(angleToPoint) * 10 ** 2) / 10 ** 2; 

        this.MoveX = this.angleX * this.Speed;
        this.MoveY = this.angleY * this.Speed;
    }

    CalculateRotation() {
        return this.angleToPoint * (180 / Math.PI) + 90;
    }

    IsCollidingWithCharacter(nextX, nextY, otherCharacter) {
        const dx = nextX - otherCharacter.x;
        const dy = nextY - otherCharacter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (otherCharacter.CollisionRadius + this.CollisionRadius);
    }

    Clear() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y)
        this.ctx.rotate(Math.PI / 180 * this.Rotate);
        
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius, 0, Math.PI * 2);
        this.ctx.clip();
        this.ctx.clearRect(-this.CollisionRadius + 1, -this.CollisionRadius + 1, this.CollisionRadius * 2 - 2, this.CollisionRadius * 2 - 2);    
        
        this.ctx.restore();
    }
}