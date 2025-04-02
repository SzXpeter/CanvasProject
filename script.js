import Player from "./Player.js";
import Bonk from "./Bonk.js";

const Canvas = document.querySelector("canvas");
const ctx = Canvas.getContext('2d');

const Enemys = [];
const player = new Player(Canvas, ctx, 1.5, 100);

BeginPlay();

async function BeginPlay() {
    ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    player.SpawnCharacter(Canvas.width / 2, Canvas.height / 2);

    Enemys.push(new Bonk(Canvas, ctx, 1, 100, 5));
    Enemys.push(new Bonk(Canvas, ctx, 1, 100, 5));
    Enemys.push(new Bonk(Canvas, ctx, 1, 100, 5));
    Enemys.push(new Bonk(Canvas, ctx, 1, 100, 5));
    Enemys.forEach(enemy => enemy.SpawnCharacter(Math.random() * Canvas.width, Math.random() * Canvas.height));

    Tick();
}

async function Tick() {
    let lastUpdateTime = 0;
    Enemys.forEach(enemy => enemy.CalculateTargetAngle(player.x, player.y));

    while (true) {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastUpdateTime;

        if (deltaTime >= 50) {
            Enemys.forEach(enemy => enemy.CalculateTargetAngle(player.x, player.y));
            lastUpdateTime = currentTime;
        }
        player.MovePlayer(deltaTime);
        Enemys.forEach(enemy => enemy.MoveTowardsPlayer(player, deltaTime));

        await new Promise(r => setTimeout(r, 16.66666));
    }
}