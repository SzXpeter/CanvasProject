export default class Room {
    constructor(canvas, ctx, grid, background, walls, enemyTypes = []) {
        this.Canvas = canvas;
        this.ctx = ctx;
        this.CellWidth = canvas.width / grid[0].length;
        this.CellHeight = canvas.height / grid.length;
        this.Background = background;
        this.Walls = walls;

        this.Grid = [];
        this.WallsX = [];
        this.WallsY = [];
        this.EnemySpawnPositions = [];
        this.EnemyCount = 0;

        this.CreateGrid(grid);

        this.EnemiesSpawned = false;
        this.Iscleared = false;
        this.EnemyTypes = enemyTypes;
        this.Enemies = [];
    }

    CreateGrid(grid) {
        grid.forEach((element, i) => {
            this.Grid.push([]);
            for (let j = 0; j < element.length; j++) {
                this.Grid[i].push(parseInt(grid[i][j]));
                if (this.Grid[i][j] === 1) {
                    this.WallsX.push(j);
                    this.WallsY.push(i);
                } else if (this.Grid[i][j] === 2) {
                    this.EnemySpawnPositions.push({
                        x: j * this.CellWidth + this.CellWidth / 2,
                        y: i * this.CellHeight + this.CellHeight / 2
                    });
                    this.EnemyCount++;
                    this.Grid[i][j] = 0;
                }
            }
        });
    }
    
    DrawRoom() {
        this.ctx.fillStyle = 'black';
        document.querySelector("canvas").style.backgroundImage = `url(${this.Background})`;
        this.Grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 1) {
                    if (this.Walls == undefined)
                        this.ctx.fillRect(colIndex * this.CellWidth, rowIndex * this.CellHeight, this.CellWidth, this.CellHeight);
                    else 
                        this.ctx.drawImage(this.Walls, colIndex * this.CellWidth, rowIndex * this.CellHeight, this.CellWidth, this.CellHeight);
                }
            });
        });
    }

    IsCollidingWithWall(x, y, collisionRadius) {
        const Left = Math.floor((x - collisionRadius) / this.CellWidth);
        const Right = Math.floor((x + collisionRadius) / this.CellWidth);
        const Top = Math.floor((y - collisionRadius) / this.CellHeight);
        const Bottom = Math.floor((y + collisionRadius) / this.CellHeight);

        for (let row = Top; row <= Bottom; row++) {
            if (this.Grid[row] && this.Grid[row].includes(1))
                for (let col = Left; col <= Right; col++) {
                    if (this.Grid[row][col] === 1)
                        return true;
                }
        }
        return false;
    }

    SpawnEnemies() {
        if (!this.Iscleared && !this.EnemiesSpawned) {
            this.EnemiesSpawned = true;
            this.EnemySpawnPositions.forEach(spawnPos => {
                const randomEnemy = this.EnemyTypes[Math.floor(Math.random() * this.EnemyTypes.length)];
                
                const enemy = this.CopyEnemy(randomEnemy);
                
                enemy.SpawnCharacter(spawnPos.x, spawnPos.y);
                this.Enemies.push(enemy);
            });
        }
    }

    CopyEnemy(enemy) {
        const newEnemy = Object.create(
            Object.getPrototypeOf(enemy),
            Object.getOwnPropertyDescriptors(enemy)
        );
        newEnemy.Canvas = this.Canvas;
        newEnemy.ctx = this.ctx;
        return newEnemy;
    }


    UpdateRoomStatus() {
        if (!this.Iscleared && this.EnemiesSpawned) {
            // Remove dead enemies and get alive ones
            this.Enemies = this.Enemies.filter(enemy => enemy.CurrentHealth > 0);
            
            if (this.Enemies.length < this.EnemyCount) {
                this.DrawRoom();
                this.EnemyCount = this.Enemies.length;
            }

            if (this.Enemies.length === 0) {
                this.Iscleared = true;
            }
        }
    }
}