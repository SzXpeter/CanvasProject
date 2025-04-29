import Player from "./Player.js";
import Floor from "./Floor.js";
import Bonk from "./Bonk.js";
import Ranger from "./Ranger.js";
import Boss from "./Boss.js";
import CreateRoomTemplates from "./RoomTemplates.js";

const Canvas = document.querySelector("canvas");
const ctx = Canvas.getContext('2d');

const player = new Player(Canvas, ctx, 300, 100);
const bonk = new Bonk(Canvas, ctx);
const ranger = new Ranger(Canvas, ctx);
const boss = new Boss(Canvas, ctx);

let CurrentRoom = undefined;
let CurrentFloor = undefined;

BeginPlay();

async function BeginPlay() {
    ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    player.SpawnCharacter(Canvas.width / 2, Canvas.height / 2);

    const roomTemplates = CreateRoomTemplates(Canvas, ctx, [bonk, ranger]);
    
    const floor = new Floor(Canvas, ctx, roomTemplates, boss);
    CurrentFloor = floor;
    CurrentRoom = CurrentFloor.GetCurrentRoom();

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

        player.Bullets = player.GetBullets().filter(bullet => 
            bullet.Update(DeltaTime, CurrentRoom, [player, ...CurrentRoom.Enemies])
        );
        
        if (CurrentRoom.Iscleared && CurrentRoom.doorsEnabled) {
            CurrentRoom.DrawDoors();
        }

        player.MovePlayer(DeltaTime, CurrentRoom);

        const doorHit = CurrentRoom.IsCollidingWithDoor(player.x, player.y, player.CollisionRadius);
        if (doorHit) {
            if (CurrentFloor.MoveToRoom(doorHit)) {
                CurrentRoom = CurrentFloor.GetCurrentRoom();
                player.SpawnCharacter(
                    doorHit === 'left' ? Canvas.width - player.CollisionRadius * 2 :
                    doorHit === 'right' ? player.CollisionRadius * 2 :
                    Canvas.width/2,
                    doorHit === 'up' ? Canvas.height - player.CollisionRadius * 2 :
                    doorHit === 'down' ? player.CollisionRadius * 2 :
                    Canvas.height/2
                );
                CurrentRoom.DrawRoom();
            }
        }

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