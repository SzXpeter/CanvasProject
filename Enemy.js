import Character from "./Character.js";

export default class Enemy extends Character {
    constructor(canvas, ctx, speed = 1, health = 100, damage = 5, collisionRadius = 25) {
        super(canvas, ctx, speed, health, collisionRadius);
        this.Damage = damage;
    }
}