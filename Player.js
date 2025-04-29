import Character from "./Character.js";
import Bullet from "./Bullet.js";

export default class Player extends Character {
    constructor(canvas, ctx, speed = 1, health = 100) {
        super(canvas, ctx, speed, health, 43.84); //43.84
        this.pressedKeys = new Set();

        window.addEventListener('keydown', (event) => this.pressedKeys.add(event.key));
        window.addEventListener('keyup', (event) => this.pressedKeys.delete(event.key));
        window.addEventListener('mousemove', (event) => {
            this.Clientx = event.clientX;
            this.Clienty = event.clientY;
        });

        this.Bullets = [];
        this.canShoot = true;
        this.fireRate = 100;
        this.bulletDamage = 15;
        this.bulletSpeed = 1000;

        window.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                this.startShooting();
            }
        });

        window.addEventListener('mouseup', (event) => {
            if (event.button === 0) {
                this.stopShooting();
            }
        });

        this.shootingInterval = null;
    }

    startShooting() {
        if (this.shootingInterval) return;
        
        const shoot = () => {
            if (this.canShoot) {
                this.shoot();
                this.canShoot = false;
                setTimeout(() => this.canShoot = true, this.fireRate);
            }
        };

        shoot();
        this.shootingInterval = setInterval(shoot, this.fireRate);
    }

    stopShooting() {
        if (this.shootingInterval) {
            clearInterval(this.shootingInterval);
            this.shootingInterval = null;
        }
    }

    shoot() {
        const bullet = new Bullet(this.Canvas, this.ctx, this.bulletDamage, this.bulletSpeed);
        const angle = Math.atan2(this.Clienty - this.Canvas.getBoundingClientRect().top - this.y, 
                               this.Clientx - this.Canvas.getBoundingClientRect().left - this.x);
        
        const spawnX = this.x + Math.cos(angle) * (this.CollisionRadius + 10);
        const spawnY = this.y + Math.sin(angle) * (this.CollisionRadius + 10);
        
        bullet.SpawnCharacter(spawnX, spawnY);
        bullet.SetDirection(angle);
        
        this.Bullets.push(bullet);
    }

    MovePlayer(deltaTime = 16.66667, room, otherCharacters = []) {
        if (this.pressedKeys.size === 0) {
            this.Clear();
            this.Rotate = this.CalculateRotation();
            this.Draw();
            return;
        }
        let x = this.x;
        let y = this.y;

        if (this.pressedKeys.has('w')) y -= this.Speed * 50;
        if (this.pressedKeys.has('a')) x -= this.Speed * 50;
        if (this.pressedKeys.has('s')) y += this.Speed * 50;
        if (this.pressedKeys.has('d')) x += this.Speed * 50;

        this.CalculateTargetAngle(x, y);
        this.MoveTowardsPoint(x, y, deltaTime, room, otherCharacters);
    }

    GetBullets() {
        return this.Bullets;
    }

    DrawCharacter() {
        this.ctx.fillStyle = "purple";
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.CollisionRadius - 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();

        const grad = this.ctx.createLinearGradient(-20, 0, 25, 0);
        
        const healthPercentage = this.CurrentHealth / this.Health;
        grad.addColorStop(0, "green");
        grad.addColorStop(healthPercentage < 0 ? 0 : healthPercentage, "green");
        grad.addColorStop(healthPercentage < 0 ? 0 : healthPercentage, "red");
        grad.addColorStop(1, "red");

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(-5, -this.CollisionRadius + 2, 10, 20);

        this.ctx.fillStyle = grad;
        this.ctx.fillRect(-25, -10, 50, 10);
    }

    CalculateRotation() {
        const rect = this.Canvas.getBoundingClientRect();
        const mouseX = this.Clientx - rect.left;
        const mouseY = this.Clienty - rect.top;
        return Math.atan2(mouseY - this.y, mouseX - this.x) * (180 / Math.PI) + 90;
    }
}