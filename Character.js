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
    
        const NextX = this.x + this.MoveX * (deltaTime / 1000);
        const NextY = this.y + this.MoveY * (deltaTime / 1000);
    
        if (!this.IsCollidingHorizontally(room, NextX, otherCharacters))
            this.x = NextX;
        if (!this.IsCollidingVertically(room, NextY, otherCharacters))
            this.y = NextY;
    
        this.Rotate = this.CalculateRotation();
        this.Draw();
        return false;
    }

    IsCollidingHorizontally(room, nextX, otherCharacters) {
        if (room.IsCollidingWithWall(nextX, this.y, this.CollisionRadius))
            return true;

        for (const character of otherCharacters)
            if (character !== this && this.IsCollidingWithCharacter(nextX, this.y, character))
                return true;
        return false;
    }

    IsCollidingVertically(room, nextY, otherCharacters) {
        if (room.IsCollidingWithWall(this.x, nextY, this.CollisionRadius))
            return true;

        for (const character of otherCharacters)
            if (character !== this && this.IsCollidingWithCharacter(this.x, nextY, character))
                return true;
        return false;
    }
    
    CalculateTargetAngle(targetX, targetY) {
        this.angleToPoint = Math.atan2(targetY - this.y, targetX - this.x);
        this.MoveX = Math.cos(this.angleToPoint) * this.Speed;
        this.MoveY = Math.sin(this.angleToPoint) * this.Speed;
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
}