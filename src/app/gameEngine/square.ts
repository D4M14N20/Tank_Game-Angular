import {GameObject} from "./gameObject";
import {GameEngineService} from "./game-engine.service";
import {Vector2} from "./Vector2";
import {Color} from "./color";
import {Point} from "./point";

export class Square extends Point{
    private readonly rotSpeed: number;
    private rotation: number = 0;
    constructor(game: GameEngineService) {
        super(game);
        this.color = new Color(189, 166, 62);// "rgb(189,166,62)";
        this.maxHp = 15;
        this.rotSpeed = Math.random()-0.5;
        this.size = 1.2;
    }
    override draw(ctx: CanvasRenderingContext2D, scale: number, camera: Vector2, size: [number, number]) {
        const cx: number = size[0]/2+(this.positon.x-camera.x)*scale;
        const cy: number = size[1]/2-(this.positon.y-camera.y)*scale;
        const k: number = scale*this.size;
        const u: number = scale;

        ctx.save();
        ctx.lineWidth = k/3;
        ctx.fillStyle = this.color.toString();
        ctx.shadowBlur = 30;
        ctx.translate(cx, cy);
        ctx.rotate(this.rotation);
        ctx.strokeRect(-k, -k, 2*k, 2*k);
        //ctx.strokeRect(cx-k, cy-k, 2*k, 2*k);
        ctx.shadowBlur = 0;
        //ctx.fillRect(cx-k, cy-k, 2*k, 2*k);

        ctx.fillRect(-k, -k, 2*k, 2*k);
        ctx.restore();

        this.drawHealthBar(ctx, cx-3*u, cy-1.5*k-2*u, 6*u, u, this.hp, this.maxHp, scale);
    }
    override update(deltaTime: number) {
        this.rotation += this.rotSpeed*deltaTime;
    }
}
