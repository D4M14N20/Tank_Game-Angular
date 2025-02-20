import { GameObject } from "./GameObject";
import {Vector2} from "./Vector2";
import {Player} from "./player";
import {Color} from "./color";
import {Square} from "./square";


export class Bullet extends GameObject  {
  private readonly player: Player;
  private range: number = 45;
  public dead: boolean = false;
  public deadTime: number = 0.5;
  constructor(player: Player) {
    super(player.game, "");
    this.player = player;
    this.color = new Color(134,146,154);
    this.size = player.size/3;
    this.drag = 0;
    this.maxHp = 10;
  }
  override draw(ctx: CanvasRenderingContext2D, scale: number, camera: Vector2, size: [number, number]) {
    const centerX: number = size[0]/2+(this.positon.x-camera.x)*scale;
    const centerY: number = size[1]/2-(this.positon.y-camera.y)*scale;
    const radius: number = this.size*scale;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = scale/5;
    ctx.strokeStyle = new Color(43,43,44, this.color.a).toString();
    ctx.fillStyle = this.color.toString();

    //ctx.shadowBlur = 30; // Rozmycie cienia
    //ctx.shadowColor =  new Color(43,43,44, this.color.a/2).toString(); // Kolor cienia

    ctx.fill();
    ctx.stroke();

    //ctx.shadowBlur = 0; // Rozmycie cienia
   // ctx.shadowColor =  'rgba(0, 0, 0, 0.5)'; // Kolor cienia
    ctx.strokeStyle = Color.stroke.toString();
    ctx.closePath();
  }
  override attack(damage: number) : number {
      let ret = super.attack(damage);
      if(this.getHp()<=0)
          this.game.destroy(this);
      return ret;
  }
  override update(deltaTime: number) {
    if(this.dead){
      this.drag = 15;
      this.deadTime -= deltaTime;
      this.color.a = this.deadTime*2;
      if(this.deadTime <= 0)
        this.game.destroy(this);
      return;
    }
    this.range -= deltaTime*this.velocity.magnitude();
    if(this.range<0)
      this.game.destroy(this);

    for (const gameObject of this.game.closeObjects) {
      if(!gameObject||gameObject===this||gameObject==this.player) continue;
      if(gameObject instanceof Bullet&&(gameObject as Bullet).player === this.player)
        continue;
      if (Vector2.distance(this.positon, gameObject.positon) < this.size+gameObject.size) {
        let dmg = gameObject.attack((this.getHp()/this.maxHp)*10);
        this.attack(dmg);
        if(gameObject.getHp()<=0)
            this.player.addXp(gameObject.maxHp);
        gameObject.velocity = gameObject.velocity.plus(this.velocity.times(1/20));
        if(gameObject instanceof Square){
          let sqr: Square = gameObject as Square;
          sqr.rotSpeed -= this.positon.minus(sqr.positon).vectorProduct(this.velocity)/20;
        }
      }
    }
  }
}
