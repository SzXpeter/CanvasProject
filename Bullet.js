import Character from "./Character.js";

export default class Bullet extends Character {
    constructor(canvas, ctx, damage = 10, speed = 800) {
        super(canvas, ctx, speed, 1, 7);
        this.Damage = damage;
        this.Direction = { x: 0, y: 0 };
    }

    SetDirection(angleRad) {
        this.Direction.x = Math.cos(angleRad);
        this.Direction.y = Math.sin(angleRad);
    }

    Update(deltaTime, room, characters) {
        const targetX = this.x + this.Direction.x * this.Speed * deltaTime / 1000;
        const targetY = this.y + this.Direction.y * this.Speed * deltaTime / 1000;

        if (room.IsCollidingWithWall(targetX, targetY, this.CollisionRadius)) {
            this.Clear();
            return false;
        }

        for (const char of characters) {
            if (char !== this && this.IsCollidingWithCharacter(targetX, targetY, char)) {
                char.CurrentHealth -= this.Damage;
                this.Clear();
                return false;
            }
        }

        this.Clear();
        this.x = targetX;
        this.y = targetY;
        this.Draw();
        return true;
    }

    DrawCharacter() {
        this.ctx.fillStyle = "darkgray";
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius - 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
    }
}
