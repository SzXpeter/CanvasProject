import CanvasElement from "./CanvasElement.js";
import Enemy from "./Enemy.js";

const Canvas = document.querySelector("canvas");
const ctx = Canvas.getContext('2d');

const enemys = [];

BeginPlay();

async function BeginPlay() {
    for (let index = 0; index < 5; index++)
        enemys.push(new Enemy(Canvas, ctx, DrawEnemy, 5, 1));    
    
    enemys.forEach(element => {
        element.SpawnEnemy(Canvas, ctx);
    });
    
    ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    await new Promise(r => setTimeout(r, 2000));
    Tick();
};

async function Tick() {
    let bIsItGameOver = false;
    while (true) {
        ctx.clearRect(0, 0, Canvas.width, Canvas.height);
        enemys.forEach(element => {
            if (element.MoveTowardsPoint(Canvas.width / 2, Canvas.height / 2, 50))
                bIsItGameOver = true;
        });
        if (bIsItGameOver)
            break;
        await new Promise(r => setTimeout(r, 33.3333333));
    }

    document.getElementById("gameover").style.display = "block";
    document.getElementById("gameover").style.animationName = "appear";
}

function DrawEnemy() {
    ctx.fillStyle = "purple";
    ctx.fillRect(-25, -50, 50, 100);
}