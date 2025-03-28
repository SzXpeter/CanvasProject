export default class CanvasElement {
    constructor(drawFunction, x = 0, y = 0, rotate = 0) {
        this.DrawFunction = drawFunction;
        this.x = x;
        this.y = y;
        this.Rotate = rotate;
    }

    Draw(ctx) {
        ctx.translate(this.x, this.y)
        ctx.rotate(Math.PI / 180 * this.Rotate);
        this.DrawFunction();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}