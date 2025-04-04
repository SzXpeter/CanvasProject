export default class Room {
    constructor(canvas, ctx, grid) {
        this.Canvas = canvas;
        this.ctx = ctx;
        this.CellWidth = canvas.width / grid[0].length;
        this.CellHeight = canvas.height / grid.length;

        this.Grid = [];
        grid.forEach((element, i) => {
            this.Grid.push([]);
            for (let j = 0; j < element.length; j++) {
                this.Grid[i].push(parseInt(grid[i][j]));
            }
        });
        console.log(this.Grid);
        
    }
    
    DrawRoom() {
        this.ctx.fillStyle = 'black';
        this.Grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 1) {
                    this.ctx.fillRect(colIndex * this.CellWidth, rowIndex * this.CellHeight, this.CellWidth, this.CellHeight);
                }
            });
        });
    }

    IsCollidingWithWall(x, y, collisionRadius) {
        const left = Math.floor((x - collisionRadius) / this.CellWidth);
        const right = Math.floor((x + collisionRadius) / this.CellWidth);
        const top = Math.floor((y - collisionRadius) / this.CellHeight);
        const bottom = Math.floor((y + collisionRadius) / this.CellHeight);

        for (let row = top; row <= bottom; row++) {
            for (let col = left; col <= right; col++) {
                if (this.Grid[row] && this.Grid[row][col] === 1) {
                    return true;
                }
            }
        }
        return false;
    }
}