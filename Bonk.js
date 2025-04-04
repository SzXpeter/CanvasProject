import Enemy from "./Enemy.js";

export default class Bonk extends Enemy {
    constructor (canvas, ctx, speed = 1, health = 100, damage = 5) {
        super(canvas, ctx, speed, health, damage, 36.7695);
    }

    MoveTowardsPlayer(player, deltaTime, room, otherCharacters) {
        this.MoveTowardsPoint(player.x, player.y, 70, deltaTime, room, otherCharacters);
    }
    
    Clear() {
        this.ctx.translate(this.x, this.y)
        this.ctx.rotate(Math.PI / 180 * this.Rotate);
        this.ctx.clearRect(-26, -26, 52, 52);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    DrawCharacter() {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(-25, -25, 50, 50);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(-20, -20, 40, 10);
    }
}