import Enemy from "./Enemy.js";
import Bullet from "./Bullet.js";

export default class Ranger extends Enemy {
    constructor(canvas, ctx) {
        super(canvas, ctx, 100, 50, 0, 30, 2000);
        this.BurstCount = 3;
        this.BurstDelay = 100;
        this.Bullets = [];
        this.canAttack = true;
    }

    MoveTowardsPlayer(player, deltaTime, room, otherCharacters) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distToPlayer = Math.sqrt(dx * dx + dy * dy);
        const idealRange = 300;
        
        let targetX = this.x;
        let targetY = this.y;

        if (distToPlayer < idealRange - 50) {
            targetX = this.x - dx;
            targetY = this.y - dy;
        } else if (distToPlayer > idealRange + 50) {
            targetX = this.x + dx;
            targetY = this.y + dy;
        }

        this.CalculateTargetAngle(player.x, player.y);
        this.MoveTowardsPoint(targetX, targetY, deltaTime, room, otherCharacters);
        
        this.Bullets = this.Bullets.filter(bullet => 
            bullet.Update(deltaTime, room, otherCharacters)
        );

        if (this.canAttack && distToPlayer < 500) {
            this.StartBurst(player);
        }
    }

    StartBurst(player) {
        this.canAttack = false;
        let burstsFired = 0;

        const fireBullet = () => {
            const bullet = new Bullet(this.Canvas, this.ctx);
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            
            const spawnX = this.x + Math.cos(angle) * (this.CollisionRadius + 10);
            const spawnY = this.y + Math.sin(angle) * (this.CollisionRadius + 10);
            
            bullet.SpawnCharacter(spawnX, spawnY);
            bullet.SetDirection(angle);
            
            this.Bullets.push(bullet);
            burstsFired++;

            if (burstsFired < this.BurstCount) {
                setTimeout(fireBullet, this.BurstDelay);
            } else {
                setTimeout(() => { this.canAttack = true; }, this.AttackSpeed);
            }
        };

        fireBullet();
    }
    
    DrawCharacter() {
        this.ctx.fillStyle = "orange";
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

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(-5, -this.CollisionRadius + 2, 10, 28);

        this.ctx.beginPath();
        this.ctx.moveTo(-5, -10);
        this.ctx.lineTo(-15, 0);
        this.ctx.lineTo(-5, 0);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(5, -10);
        this.ctx.lineTo(15, 0);
        this.ctx.lineTo(5, 0);
        this.ctx.fill();

        this.ctx.fillStyle = grad;
        this.ctx.fillRect(-20, 0, 40, 10);
    }
}
