export default class CanvasElement {
    constructor(canvas, ctx, drawFunction, x = 0, y = 0, rotate = 0) {
        this.Canvas = canvas;
        this.ctx = ctx;
        this.DrawFunction = drawFunction;
        this.x = x;
        this.y = y;
        this.Rotate = rotate;
    }

    Draw() {
        this.ctx.translate(this.x, this.y)
        this.ctx.rotate(Math.PI / 180 * this.Rotate);
        this.DrawFunction();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}