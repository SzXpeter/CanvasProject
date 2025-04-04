import CanvasElement from "./CanvasElement.js";

export default class Character extends CanvasElement {
    constructor(canvas, ctx, speed, health, collisionRadius = 25) {
        super(canvas, ctx);
        this.Speed = speed;
        this.Health = health;
        this.collisionRadius = collisionRadius;
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
    
        const nextX = this.x + this.moveX * (deltaTime / 1000);
        const nextY = this.y + this.moveY * (deltaTime / 1000);
    
        let canMoveX = true;
        let canMoveY = true;
    
        if (room.IsCollidingWithWall(nextX, this.y, this.collisionRadius)) {
            canMoveX = false;
        }
    
        if (room.IsCollidingWithWall(this.x, nextY, this.collisionRadius)) {
            canMoveY = false;
        }
    
        for (const character of otherCharacters) {
            if (character !== this && this.IsCollidingWithCharacter(nextX, this.y, character)) {
                canMoveX = false;
            }
        }
    
        for (const character of otherCharacters) {
            if (character !== this && this.IsCollidingWithCharacter(this.x, nextY, character)) {
                canMoveY = false;
            }
        }
    
        if (canMoveX) {
            this.x = nextX;
        }
        if (canMoveY) {
            this.y = nextY;
        }
    
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

    IsCollidingWithCharacter(nextX, nextY, otherCharacter) {
        const dx = nextX - otherCharacter.x;
        const dy = nextY - otherCharacter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < otherCharacter.collisionRadius + this.collisionRadius;
    }
}