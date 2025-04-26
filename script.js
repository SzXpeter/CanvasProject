import Player from "./Player.js";
import Floor from "./Floor.js";
import Room from "./Room.js";
import { CreateRoomTemplates } from "./RoomTemplates.js";

const Canvas = document.querySelector("canvas");
const ctx = Canvas.getContext('2d');

const player = new Player(Canvas, ctx, 300, 100);
let CurrentRoom = 0;

BeginPlay();

async function BeginPlay() {
    ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    player.SpawnCharacter(Canvas.width / 2, Canvas.height / 2);

    const roomTemplates = CreateRoomTemplates(Canvas, ctx);
    const floor = new Floor(Canvas, ctx, roomTemplates);
    CurrentRoom = floor.GetCurrentRoom();
    CurrentRoom.DrawRoom();

    Tick();
}

async function Tick() {
    let LastUpdateTime = performance.now();
    let DeltaTime = 0;
    let LastTickTime = performance.now();
    
    const GameLoop = () => {
        if (player.CurrentHealth <= 0) {
            GameOver();
            return;
        }
        
        const CurrentTime = performance.now();
        const TimeSinceLastUpdate = CurrentTime - LastUpdateTime;
        DeltaTime = CurrentTime - LastTickTime;
        LastTickTime = CurrentTime;

        CurrentRoom.SpawnEnemies();
        CurrentRoom.UpdateRoomStatus();

        if (TimeSinceLastUpdate >= 50) {
            CurrentRoom.Enemies.forEach(enemy => {
                if (enemy.CurrentHealth > 0) {
                    enemy.CalculateTargetAngle(player.x, player.y);
                }
            });
            LastUpdateTime = CurrentTime;
        }

        player.MovePlayer(DeltaTime, CurrentRoom);
        CurrentRoom.Enemies.forEach(enemy => {
            if (enemy.CurrentHealth > 0) {
                enemy.MoveTowardsPlayer(player, DeltaTime, CurrentRoom, [player, ...CurrentRoom.Enemies]);
            }
        });

        requestAnimationFrame(GameLoop);
    };
    requestAnimationFrame(GameLoop);
}

function GameOver() {
    document.getElementById("gameover").style.display = "block";
    document.getElementById("gameover").style.animationName = "appear";
}