import Enemy from "./Enemy.js";

export default class Bonk extends Enemy {
    constructor (canvas, ctx) {
        super(canvas, ctx, 200, 100, 15, 36.7695);
    }

    MoveTowardsPlayer(player, deltaTime, room, otherCharacters) {
        this.MoveTowardsPoint(player.x, player.y, 0, deltaTime, room, otherCharacters);
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
}