import Player from "./Player.js";
import Bonk from "./Bonk.js";

const Canvas = document.querySelector("canvas");
const ctx = Canvas.getContext('2d');

const Enemys = [];
const player = new Player(Canvas, ctx, DrawPlayer, 10, 100);

BeginPlay();

async function BeginPlay() {
    ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    player.SpawnCharacter(Canvas.width / 2, Canvas.height / 2);

    Enemys.push(new Bonk(Canvas, ctx, DrawEnemy, 5, 100, 5));
    Enemys.push(new Bonk(Canvas, ctx, DrawEnemy, 5, 100, 5));
    Enemys.push(new Bonk(Canvas, ctx, DrawEnemy, 5, 100, 5));
    Enemys.push(new Bonk(Canvas, ctx, DrawEnemy, 5, 100, 5));
    Enemys.forEach(enemy => enemy.SpawnCharacter(Math.random() * Canvas.width, Math.random() * Canvas.height));

    Tick();
};

async function Tick() {
    while (true) {
        Enemys.forEach(enemy => enemy.MoveTowardsPlayer(player));
        player.MovePlayer();
        await new Promise(r => setTimeout(r, 16.66666));
    }

    document.getElementById("gameover").style.display = "block";
    document.getElementById("gameover").style.animationName = "appear";
}

function DrawPlayer() {
    ctx.fillStyle = "purple";
    ctx.fillRect(-30, -30, 60, 60);
    ctx.fillStyle = "black";
    ctx.fillRect(-20, -20, 40, 10);
}

function DrawEnemy() {
    ctx.fillStyle = "red";
    ctx.fillRect(-25, -25, 50, 50);
    ctx.fillStyle = "black";
    ctx.fillRect(-20, -20, 40, 10);
}