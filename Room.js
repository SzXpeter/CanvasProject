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
        this.EnemyTypes = enemyTypes;
        this.Enemies = [];
        this.Iscleared = false;

        this.doors = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.doorsEnabled = true;
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
                        y: i * this.CellHeight + this.CellHeight / 2,
                        gridX: j,
                        gridY: i
                    });
                    this.EnemyCount++;
                }
            }
        });
    }
    
    DrawRoom() {
        this.ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
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

        if (this.Iscleared && this.doorsEnabled) {
            this.DrawDoors();
        }
    }

    DrawDoors() {
        const doorWidth = this.CellWidth * 3;
        const doorHeight = this.CellHeight;
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';

        if (this.doors.up) {
            this.ctx.fillRect(this.Canvas.width/2 - doorWidth/2, 0, doorWidth, doorHeight);
        }
        if (this.doors.down) {
            this.ctx.fillRect(this.Canvas.width/2 - doorWidth/2, this.Canvas.height - doorHeight, doorWidth, doorHeight);
        }
        if (this.doors.left) {
            this.ctx.fillRect(0, this.Canvas.height/2 - doorWidth/2, doorHeight, doorWidth);
        }
        if (this.doors.right) {
            this.ctx.fillRect(this.Canvas.width - doorHeight, this.Canvas.height/2 - doorWidth/2, doorHeight, doorWidth);
        }
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

    IsCollidingWithDoor(x, y, radius) {
        if (!this.Iscleared || !this.doorsEnabled) return null;

        const doorWidth = this.CellWidth * 3;
        const doorHeight = this.CellHeight;

        if (this.doors.up && 
            x > this.Canvas.width/2 - doorWidth/2 && 
            x < this.Canvas.width/2 + doorWidth/2 && 
            y - radius < doorHeight) {
            return 'up';
        }
        if (this.doors.down && 
            x > this.Canvas.width/2 - doorWidth/2 && 
            x < this.Canvas.width/2 + doorWidth/2 && 
            y + radius > this.Canvas.height - doorHeight) {
            return 'down';
        }
        if (this.doors.left && 
            y > this.Canvas.height/2 - doorHeight/2 && 
            y < this.Canvas.height/2 + doorHeight/2 && 
            x - radius < doorHeight) {
            return 'left';
        }
        if (this.doors.right && 
            y > this.Canvas.height/2 - doorHeight/2 && 
            y < this.Canvas.height/2 + doorHeight/2 && 
            x + radius > this.Canvas.width - doorHeight) {
            return 'right';
        }
        return null;
    }

    DisableDoors() {
        this.doorsEnabled = false;
        setTimeout(() => {
            this.doorsEnabled = true;
            this.DrawRoom();
        }, 1000);
    }

    ClearEnemies() {
        this.Enemies.forEach(enemy => enemy.Clear());
        this.Enemies = [];
        this.EnemiesSpawned = false;
    }

    DisableEnemies() {
        this.Enemies.forEach(enemy => enemy.canMove = false);
        setTimeout(() => {
            this.Enemies.forEach(enemy => enemy.canMove = true);
        }, 200);
    }

    SpawnEnemies() {
        if (!this.Iscleared && !this.EnemiesSpawned) {
            this.ClearEnemies();
            this.EnemySpawnPositions.forEach(spawnPos => {
                const randomEnemy = this.EnemyTypes[Math.floor(Math.random() * this.EnemyTypes.length)];
                const enemy = this.CopyEnemy(randomEnemy);
                enemy.SpawnCharacter(spawnPos.x, spawnPos.y);
                
                this.Enemies.push(enemy);
                this.Grid[spawnPos.gridY][spawnPos.gridX] = 0;
            });
            this.EnemiesSpawned = true;
            this.DisableEnemies();
            this.DrawRoom();
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

            this.Enemies = this.Enemies.filter(enemy => enemy.CurrentHealth > 0);
            
            if (this.Enemies.length < this.EnemyCount) {
                this.DrawRoom();
                this.EnemyCount = this.Enemies.length;
            }
            
            if (this.Enemies.length === 0) {
                this.Iscleared = true;
                this.DrawRoom();
            }
        }
    }
}