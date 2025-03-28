export default class Enemy{
    constructor(canvas, ctx, canvasElement, speed, damage) {
        this.Canvas = canvas;
        this.ctx = ctx;
        this.CanvasElement = canvasElement;
        this.Speed = speed;
        this.Damage = damage;
    }

    SpawnEnemy() {
        const random = Math.random();
        if (random >= .75) {
            this.CanvasElement.x = 0;
            this.CanvasElement.y = Math.floor(Math.random() * this.Canvas.height);
        }
        else if (random >= .5) {
            this.CanvasElement.x = this.Canvas.width;
            this.CanvasElement.y = Math.floor(Math.random() * this.Canvas.height);
        }
        else if (random >= .25) {
            this.CanvasElement.x = Math.floor(Math.random() * this.Canvas.width);
            this.CanvasElement.y = 0;
        }
        else {
            this.CanvasElement.x = Math.floor(Math.random() * this.Canvas.width);
            this.CanvasElement.y = this.Canvas.height;
        }
            
        this.CanvasElement.Draw(this.ctx);
        this.rateX = this.Canvas.width / 2 - this.CanvasElement.x;
        this.rateY = this.Canvas.height / 2 - this.CanvasElement.y;
    }

    CreepCloserToCenter() {
        if (Math.abs(this.Canvas.width / 2 - this.CanvasElement.x) < 50 && Math.abs(this.Canvas.height / 2 - this.CanvasElement.y) < 50) return true;

        let DefaultTime = 120;

        const rateX = Math.abs(this.rateX / DefaultTime / 1000);
        const rateY = Math.abs(this.rateY / DefaultTime / 1000);

        if (this.CanvasElement.x > this.Canvas.width / 2)
            this.CanvasElement.x -= (this.Canvas.width / 2 * this.Speed * rateX);
        else
            this.CanvasElement.x += (this.Canvas.width / 2 * this.Speed * rateX);

        if (this.CanvasElement.y > this.Canvas.height / 2)
            this.CanvasElement.y -= (this.Canvas.width / 2 * this.Speed * rateY);
        else
            this.CanvasElement.y += (this.Canvas.width / 2 * this.Speed * rateY);

        this.CanvasElement.Draw(this.ctx);
        return false;   
    }
}