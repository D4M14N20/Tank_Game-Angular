import {Square} from "./square";
import {GameEngineService} from "./game-engine.service";
import {Vector2} from "./Vector2";

export class Triangle extends Square{
    constructor(game: GameEngineService) {
        super(game, "triangle");
        this.maxHp = 25;
    }
    override draw(ctx: CanvasRenderingContext2D, scale: number, camera: Vector2, size: [number, number]) {
        const cx: number = size[0]/2+(this.positon.x-camera.x)*scale;
        const cy: number = size[1]/2-(this.positon.y-camera.y)*scale;
        const k: number = scale*this.size;
        const u: number = scale;
        const h: number = k*Math.sqrt(3)/6*(5/2)
        const a: number = k/2*(5/2);

        ctx.save();
        ctx.lineWidth = k/3;
        ctx.fillStyle = this.color.toString();
        ctx.shadowBlur = 30;
        ctx.translate(cx, cy);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        ctx.moveTo(-a, h);
        ctx.lineTo(0, -h*2);
        ctx.lineTo(a, h);
        ctx.closePath();

        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fill();
        ctx.restore();

        this.drawHealthBar(ctx, cx-3*u, cy-1.5*k-2*u, 6*u, u, this.getHp(), this.maxHp, scale);
    }
}
