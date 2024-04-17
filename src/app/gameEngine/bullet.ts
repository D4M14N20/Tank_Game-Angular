import { GameObject } from "./gameObject";
import {Vector2} from "./Vector2";
import {Point} from "./point";
import {Player} from "./player";
import {Color} from "./color";


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

    ctx.shadowBlur = 30; // Rozmycie cienia
    ctx.shadowColor =  new Color(43,43,44, this.color.a/2).toString(); // Kolor cienia

    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0; // Rozmycie cienia
    ctx.shadowColor =  'rgba(0, 0, 0, 0.0)'; // Kolor cienia
    ctx.closePath();
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

    for (const gameObject of this.game.gameObjects) {
      if(!gameObject||gameObject===this||gameObject==this.player) continue;
      if(gameObject instanceof Bullet){
        if ((gameObject as Bullet).player === this.player)
          continue;
      }
      if (Vector2.distance(this.positon, gameObject.positon) < this.size+gameObject.size) {
        if(gameObject instanceof Point){
          this.game.destroy(gameObject);
          //this.player.size += Math.sqrt(gameObject.size)/70;
        }
        gameObject.attack(10);
        gameObject.velocity = gameObject.velocity.plus(this.velocity.times(1/50));
        this.game.destroy(this);
      }
    }
  }
}
