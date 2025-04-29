import Enemy from "./Enemy.js";
import Bullet from "./Bullet.js";

export default class Boss extends Enemy {
    constructor(canvas, ctx) {
        super(canvas, ctx, 250, 500, 25, 50, 2000);
        this.Bullets = [];
        this.canAttack = true;
        this.attackPhase = 'approach';
        this.meleeRange = 100 + this.CollisionRadius;
        this.rangedRange = 300 + this.CollisionRadius;
        this.burstCount = 5;
        this.phaseTimer = 0;
        this.approachTimeout = 3000;
        this.approachTimer = 0;
    }

    MoveTowardsPlayer(player, deltaTime, room, otherCharacters) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distToPlayer = Math.sqrt(dx * dx + dy * dy);
        
        if (this.attackPhase === 'approach') {
            this.approachTimer += deltaTime;
            if (this.approachTimer > this.approachTimeout) {
                this.attackPhase = 'ranged';
                this.phaseTimer = 3000;
                this.approachTimer = 0;
            } else if (distToPlayer < this.meleeRange) {
                this.attackPhase = 'melee';
                this.approachTimer = 0;
            }
        } else {
            this.approachTimer = 0;
        }

        this.phaseTimer += deltaTime;
        this.UpdatePhase();
        
        let targetX = this.x;
        let targetY = this.y;

        switch(this.attackPhase) {
            case 'approach':
                targetX = player.x;
                targetY = player.y;
                break;
            case 'ranged':
                if (distToPlayer < this.rangedRange - 50) {
                    targetX = this.x - dx;
                    targetY = this.y - dy;
                }
                if (this.canAttack) {
                    this.RangedAttack(player);
                }
                break;
            case 'melee':
                if (this.canAttack) {
                    this.MeleeAttack(player, room);
                }
                break;
        }

        this.CalculateTargetAngle(player.x, player.y);
        this.MoveTowardsPoint(targetX, targetY, deltaTime, room, otherCharacters);
        
        this.Bullets = this.Bullets.filter(bullet => 
            bullet.Update(deltaTime, room, otherCharacters)
        );
    }

    UpdatePhase() {
        if (this.phaseTimer < 3000) return;
        
        this.phaseTimer = 0;
        if (this.attackPhase === 'melee') {
            this.attackPhase = 'ranged';
        } else if (this.attackPhase === 'ranged') {
            this.attackPhase = 'approach';
            this.approachTimer = 0;
        }
    }

    MeleeAttack(player, room) {
        this.canAttack = false;
        if (this.IsCollidingWithCharacter(this.x, this.y, player, 50)) {
            player.CurrentHealth -= this.Damage;
        }
        this.DrawMeleeAttack();
        setTimeout(() => {
            this.ClearMeleeAttack();
            room.DrawRoom();
            setTimeout(() => this.canAttack = true, 500);
        }, 150);
    }

    RangedAttack(player) {
        this.canAttack = false;
        let shotsLeft = this.burstCount;
        
        const shoot = () => {
            const bullet = new Bullet(this.Canvas, this.ctx, 10, 600);
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            const spread = (Math.random() - 0.5) * 0.2;
            const finalAngle = angle + spread;
            
            const spawnX = this.x + Math.cos(finalAngle) * (this.CollisionRadius + 10);
            const spawnY = this.y + Math.sin(finalAngle) * (this.CollisionRadius + 10);
            
            bullet.SpawnCharacter(spawnX, spawnY);
            bullet.SetDirection(finalAngle);
            this.Bullets.push(bullet);
            
            shotsLeft--;
            if (shotsLeft > 0) {
                setTimeout(shoot, 100);
            } else {
                setTimeout(() => this.canAttack = true, 1000);
            }
        };
        shoot();
    }

    DrawCharacter() {
        this.ctx.fillStyle = "darkred";
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius - 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();

        const grad = this.ctx.createLinearGradient(-30, 0, 30, 0);
        grad.addColorStop(0, "green");
        grad.addColorStop(this.CurrentHealth / this.Health, "green");
        grad.addColorStop(this.CurrentHealth / this.Health, "red");
        grad.addColorStop(1, "red");
        
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(-30, -30, 60, 10);
    }

    DrawMeleeAttack() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius + 50, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    ClearMeleeAttack() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius + 21, 0, Math.PI * 2);
        this.ctx.clip();
        this.ctx.clearRect(-this.CollisionRadius - 21, -this.CollisionRadius - 21, 
                          this.CollisionRadius * 2 + 42, this.CollisionRadius * 2 + 42);
        this.ctx.restore();
    }
}
