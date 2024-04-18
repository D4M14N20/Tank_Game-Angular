import {Square} from "./square";
import {GameEngineService} from "./game-engine.service";
import {Vector2} from "./Vector2";

export class Pentagon extends Square{
    constructor(game: GameEngineService) {
        super(game, "pentagon");
        this.maxHp = 75;
    }
    override draw(ctx: CanvasRenderingContext2D, scale: number, camera: Vector2, size: [number, number]) {
        const cx: number = size[0]/2+(this.positon.x-camera.x)*scale;
        const cy: number = size[1]/2-(this.positon.y-camera.y)*scale;
        const k: number = scale*this.size;
        const u: number = scale;
        const a: number = (2*Math.PI)/5;

        ctx.save();
        ctx.lineWidth = k/3;
        ctx.fillStyle = this.color.toString();
        ctx.shadowBlur = 30;
        ctx.translate(cx, cy);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        ctx.moveTo(0, k*2);
        for(let i=1;i<5;i++){
          ctx.lineTo(Math.sin(i*a)*k*2, Math.cos(i*a)*k*2);
        }
        ctx.closePath();

        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fill();
        ctx.restore();

        this.drawHealthBar(ctx, cx-3*u, cy-1.5*k-2*u, 6*u, u, this.getHp(), this.maxHp, scale);
    }
}
