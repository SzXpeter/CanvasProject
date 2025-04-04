import Player from "./Player.js";
import Bonk from "./Bonk.js";
import Room from "./Room.js";

const Canvas = document.querySelector("canvas");
const ctx = Canvas.getContext('2d');

const Enemys = [];
const player = new Player(Canvas, ctx, 300, 100);
const roomGrid = [
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000011110000",
    "00000000000000000000000011110000",
    "00000000000000000000000011110000",
    "00000000000000000000000011110000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000"
];

const room = new Room(Canvas, ctx, roomGrid);

BeginPlay();

async function BeginPlay() {
    ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    player.SpawnCharacter(Canvas.width / 2, Canvas.height / 2);

    Enemys.push(new Bonk(Canvas, ctx, 200, 100, 5));
    Enemys.push(new Bonk(Canvas, ctx, 200, 100, 5));
    Enemys.push(new Bonk(Canvas, ctx, 200, 100, 5));
    Enemys.push(new Bonk(Canvas, ctx, 200, 100, 5));
    Enemys.forEach(enemy => enemy.SpawnCharacter(Math.random() * Canvas.width, Math.random() * Canvas.height));
    room.DrawRoom();

    Tick();
}

async function Tick() {
    let LastUpdateTime = performance.now();
    let DeltaTime = 0;
    let LastTickTime = performance.now();
    Enemys.forEach(enemy => enemy.CalculateTargetAngle(player.x, player.y));

    const gameLoop = () => {
        const CurrentTime = performance.now();
        const TimeSinceLastUpdate = CurrentTime - LastUpdateTime;
        DeltaTime = CurrentTime - LastTickTime;
        LastTickTime = CurrentTime;

        if (TimeSinceLastUpdate >= 50) {
            Enemys.forEach(enemy => enemy.CalculateTargetAngle(player.x, player.y));
            LastUpdateTime = CurrentTime;
        }

        player.MovePlayer(DeltaTime, room, Enemys);
        Enemys.forEach(enemy => enemy.MoveTowardsPlayer(player, DeltaTime, room, [player, ...Enemys]));

        requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);
}