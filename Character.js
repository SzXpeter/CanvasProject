export default class Character {
    constructor(canvas, ctx, speed, health, collisionRadius = 25, x = 0, y = 0, rotate = 0) {
        this.Canvas = canvas;
        this.ctx = ctx;
        this.Speed = speed;
        this.Health = health;
        this.CurrentHealth = health;
        this.CollisionRadius = collisionRadius;
        this.x = Number.parseInt(x);
        this.y = Number.parseInt(y);
        this.Rotate = rotate;
        this.canMove = true;
    }

    SpawnCharacter(x, y) {
        this.x = x;
        this.y = y;
        this.Draw();
    }

    Draw() {
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(Math.PI / 180 * this.Rotate);
        this.DrawCharacter();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    DrawCharacter() { }

    Clear() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(Math.PI / 180 * this.Rotate);

        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius, 0, Math.PI * 2);
        this.ctx.clip();
        this.ctx.clearRect(-this.CollisionRadius + 1, -this.CollisionRadius + 1, this.CollisionRadius * 2 - 2, this.CollisionRadius * 2 - 2);

        this.ctx.restore();
    }

    MoveTowardsPoint(targetX, targetY, deltaTime = 16.66667, room, otherCharacters = []) {
        if (!this.canMove || Math.abs(targetX - this.x) < this.CollisionRadius && Math.abs(targetY - this.y) < this.CollisionRadius) {
            this.Draw();
            return true;
        }
        this.Clear();

        this.NextX = this.MoveX * (deltaTime / 1000);
        this.NextY = this.MoveY * (deltaTime / 1000);
        let CollidingX = this.IsCollidingHorizontally(room, this.x + this.NextX, otherCharacters);
        let CollidingY = this.IsCollidingVertically(room, this.y + this.NextY, otherCharacters);

        this.x += CollidingX ? 0 : this.NextX;
        this.y += CollidingY ? 0 : this.NextY;
        
        if (CollidingX === 2 || CollidingY === 2)
            this.Colliding = true;
        else
            this.Colliding = false;
        
        this.Rotate = this.CalculateRotation(targetX, targetY);
        this.Draw();
        return false;
    }

    IsCollidingHorizontally(room, nextX, otherCharacters) {
        if (nextX < this.CollisionRadius || nextX > this.Canvas.width - this.CollisionRadius)
            return 1;

        if (room.IsCollidingWithWall(nextX, this.y, this.CollisionRadius))
            return 1;

        for (const character of otherCharacters)
            if (character !== this && this.IsCollidingWithCharacter(nextX, this.y, character))
                return 2;
        return 0;
    }

    IsCollidingVertically(room, nextY, otherCharacters) {
        if (nextY < this.CollisionRadius || nextY > this.Canvas.height - this.CollisionRadius)
            return 1;

        if (room.IsCollidingWithWall(this.x, nextY, this.CollisionRadius))
            return 1;

        for (const character of otherCharacters)
            if (character !== this && this.IsCollidingWithCharacter(this.x, nextY, character))
                return 2;
        return 0;
    }

    CalculateTargetAngle(targetX, targetY) {
        this.angleToPoint = Math.atan2(targetY - this.y, targetX - this.x);

        const angleX = Math.round(Math.cos(this.angleToPoint) * 10 ** 2) / 10 ** 2;
        const angleY = Math.round(Math.sin(this.angleToPoint) * 10 ** 2) / 10 ** 2;

        this.MoveX = angleX * this.Speed;
        this.MoveY = angleY * this.Speed;
    }

    CalculateRotation() {
        return this.angleToPoint * (180 / Math.PI) + 90;
    }

    IsCollidingWithCharacter(nextX, nextY, otherCharacter, extraCollision = 0) {
        const dx = nextX - otherCharacter.x;
        const dy = nextY - otherCharacter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (otherCharacter.CollisionRadius + this.CollisionRadius + extraCollision);
    }
}