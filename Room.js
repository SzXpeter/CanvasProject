export default class Room {
    constructor(canvas, ctx, grid) {
        this.Canvas = canvas;
        this.ctx = ctx;
        this.Grid = grid;
        this.CellWidth = canvas.width / grid[0].length;
        this.CellHeight = canvas.height / grid.length;
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
}