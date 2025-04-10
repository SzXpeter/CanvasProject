import Enemy from "./Enemy.js";

export default class Bonk extends Enemy {
    constructor (canvas, ctx) {
        super(canvas, ctx, 200, 100, 15, 35, 1000);
        this.canAttack = true;
    }

    MoveTowardsPlayer(player, deltaTime, room, otherCharacters) {
        this.MoveTowardsPoint(player.x, player.y, deltaTime, room, otherCharacters);
        
        if (this.Colliding && this.CanAttack(player)) {
            this.canMove = false;
            setTimeout(() => {
                this.Attack(player, room);
                setTimeout(() => {this.canMove = true}, 200);
            }, 500);
            this.canAttack = false;
            setTimeout(() => { this.canAttack = true }, this.AttackSpeed);
        }
    }

    Attack(player, room) {
        if (this.IsCollidingWithCharacter(this.x, this.y, player, 10)) {
            player.CurrentHealth -= this.Damage;
            console.log("Player Health: " + player.CurrentHealth);
        }
        this.DrawAttack();
        setTimeout(() => {this.ClearAttack(); room.DrawRoom();}, 150);
    }

    DrawCharacter() {
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius - 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(-20, -20, 40, 10);
    }

    DrawAttack() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);

        this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius + 2, 0, Math.PI * 2, false);
        this.ctx.arc(0, 0, this.CollisionRadius + 15, 0, Math.PI * 2, true);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(-20, -20, 40, 10);

        this.ctx.restore();
    }

    ClearAttack() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);

        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius + 16, 0, Math.PI * 2);
        this.ctx.clip();
        this.ctx.clearRect(-this.CollisionRadius - 16, -this.CollisionRadius - 16, this.CollisionRadius * 2.8 + 3, this.CollisionRadius * 2.8 + 3);

        this.ctx.restore();
    }


    CanAttack(player) {
        return this.canAttack && this.IsCollidingWithCharacter(this.x + this.NextX, this.y + this.NextY, player);
    }
}