import Character from "./Character.js";

export default class Enemy extends Character {
    constructor(canvas, ctx, speed = 1, health = 100, damage = 5, collisionRadius = 25, attakSpeed = 1000) {
        super(canvas, ctx, speed, health, collisionRadius);
        this.Damage = damage;
        this.AttackSpeed = attakSpeed;
    }
}