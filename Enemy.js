import Character from "./Character.js";
export default class Enemy extends Character {
    constructor (canvas, ctx, drawFunction, speed = 1, health = 100, damage = 5) {
        super(canvas, ctx, drawFunction, speed, health);
        this.Damage = damage;
    }

}
