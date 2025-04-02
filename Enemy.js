import Character from "./Character.js";
export default class Enemy extends Character {
    constructor (canvas, ctx, drawFunction, speed = 1, health = 100, damage = 5) {
        super(canvas, ctx, drawFunction, speed, health);
        this.Damage = damage;
    }

    Clear() {
        this.ctx.translate(this.x, this.y)
        this.ctx.rotate(Math.PI / 180 * this.Rotate);
        this.ctx.clearRect(-26, -51, 52, 102);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
