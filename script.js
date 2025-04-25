import Player from "./Player.js";
import Bonk from "./Bonk.js";
import Room from "./Room.js";
import Floor from "./Floor.js";
import roomGrid from "./roomGrid.js";

const Canvas = document.querySelector("canvas");
const ctx = Canvas.getContext('2d');

const Enemys = [];
const player = new Player(Canvas, ctx, 300, 100);


// BeginPlay();

async function BeginPlay() {
    ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    player.SpawnCharacter(Canvas.width / 2, Canvas.height / 2);

    Tick();
}

async function Tick() {
    let LastUpdateTime = performance.now();
    let DeltaTime = 0;
    let LastTickTime = performance.now();
    Enemys.forEach(enemy => enemy.CalculateTargetAngle(player.x, player.y));

    const gameLoop = () => {
        if (player.CurrentHealth <= 0) {
            GameOver();
            return;
        }

        const CurrentTime = performance.now();
        const TimeSinceLastUpdate = CurrentTime - LastUpdateTime;
        DeltaTime = CurrentTime - LastTickTime;
        LastTickTime = CurrentTime;

        if (TimeSinceLastUpdate >= 50) {
            Enemys.forEach(enemy => enemy.CalculateTargetAngle(player.x, player.y));
            LastUpdateTime = CurrentTime;
        }

        player.MovePlayer(DeltaTime, room);
        Enemys.forEach(enemy => enemy.MoveTowardsPlayer(player, DeltaTime, room, [player, ...Enemys]));

        requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);
}

function GameOver() {
    document.getElementById("gameover").style.display = "block";
    document.getElementById("gameover").style.animationName = "appear";
}