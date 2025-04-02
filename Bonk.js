import Enemy from "./Enemy.js";
export default class Bonk extends Enemy {
    constructor (canvas, ctx, drawFunction, speed = 1, health = 100, damage = 5) {
        super(canvas, ctx, drawFunction, speed, health, damage);
    }

    MoveTowardsPlayer(player) {
        this.MoveTowardsPoint(player.x + (Math.random() - .5) * 20, player.y + (Math.random() - .5) * 20, 75);
    }
}