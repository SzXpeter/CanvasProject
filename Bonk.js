import Enemy from "./Enemy.js";

export default class Bonk extends Enemy {
    constructor (canvas, ctx, attackColor = "rgba(255, 255, 255, 0.5)") {
        super(canvas, ctx, 275, 100, 15, 35, 1000);
        this.canAttack = true;
        this.AttackColor = attackColor;
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
        this.ctx.fillStyle = "darkgray";
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius - 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();

        const grad = this.ctx.createLinearGradient(-20, 0, 20, 0);
        const healthPercentage = this.CurrentHealth / this.Health;
        grad.addColorStop(0, "green");
        grad.addColorStop(healthPercentage < 0 ? 0 : healthPercentage, "green");
        grad.addColorStop(healthPercentage < 0 ? 0 : healthPercentage, "red");
        grad.addColorStop(1, "red");

        this.ctx.strokewidth = 2;
        this.ctx.strokeStyle = "black";

        this.ctx.beginPath();
        this.ctx.arc(0, -50, 40, Math.PI * .72, Math.PI * .28, true);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(-15, -29);
        this.ctx.lineTo(-15, -12);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(-7.5, -32);
        this.ctx.lineTo(-7.5, -11);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, -33);
        this.ctx.lineTo(0, -10);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(7.5, -32);
        this.ctx.lineTo(7.5, -11);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(15, -29);
        this.ctx.lineTo(15, -12);
        this.ctx.stroke();


        this.ctx.fillStyle = grad;
        this.ctx.fillRect(-20, -5, 40, 10);
    }

    DrawAttack() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);

        this.ctx.fillStyle = this.AttackColor;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius + 2, 0, Math.PI * 2, false);
        this.ctx.arc(0, 0, this.CollisionRadius + 15, 0, Math.PI * 2, true);
        this.ctx.fill();
        this.ctx.closePath();

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