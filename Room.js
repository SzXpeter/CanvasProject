export default class Room {
    constructor(canvas, ctx, grid, background, walls) {
        this.Canvas = canvas;
        this.ctx = ctx;
        this.CellWidth = canvas.width / grid[0].length;
        this.CellHeight = canvas.height / grid.length;
        this.Background = background;
        this.Walls = walls;

        this.Grid = [];
        this.WallsX = [];
        this.WallsY = [];
        grid.forEach((element, i) => {
            this.Grid.push([]);
            for (let j = 0; j < element.length; j++) {
                this.Grid[i].push(parseInt(grid[i][j]));
                if (this.Grid[i][j] === 1) {
                    this.WallsX.push(j);
                    this.WallsY.push(i);
                }
            }
        });
    }

    ChangeBackground() {
        document.querySelector("canvas").style.backgroundImage = `url(${this.Background})`;
    }
    
    DrawRoom() {
        this.ctx.fillStyle = 'black';
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
}