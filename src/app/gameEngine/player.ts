import { Vector2 } from "./Vector2";
import { GameObject } from "./gameObject";
import * as vm from "node:vm";
import {delay} from "rxjs";
import {Bullet} from "./bullet";
import {GameEngineService} from "./game-engine.service";

export class Player extends GameObject {
  private readonly reloadTime: number = 0.2;
  constructor(game: GameEngineService, name: string) {
    super(game, name);
    this.color = "royalblue";
    this.color = "rgba(0,91,194,0.34)";

  }

  override draw(ctx: CanvasRenderingContext2D, scale: number, camera: Vector2, size: [number, number]) {
    const direction = this.game.mouse.plus(this.game.camera.minus(this.positon));
    const centerX: number = size[0]/2+(this.positon.x-camera.x)*scale;
    const centerY: number = size[1]/2-(this.positon.y-camera.y)*scale;
    const radius: number = this.size*scale;
    const width: number = this.size*0.7*scale;
    const length: number = (3*(Math.abs(this.reloadTime/2-this.delay)) + 1.2)*scale*this.size;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(3.14/2-Math.atan2(direction.y, direction.x));
    ctx.fillStyle = 'rgb(49,51,54)';
    ctx.strokeStyle = 'rgb(43,43,44)';
    ctx.lineWidth = scale*this.size/15;
    ctx.fillRect(-width / 2, -length, width, length);
    ctx.strokeRect(-width / 2, -length, width, length);
    ctx.restore();

    //super.draw(ctx, scale, camera, size);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = scale*this.size/15;
    ctx.strokeStyle = 'rgb(43,43,44)'; // Kolor linii
    ctx.fillStyle = this.color;//'rgb(72, 161, 141)'; // Kolor wypełnienia
    ctx.shadowBlur = 30; // Rozmycie cienia
    ctx.shadowColor =  'rgba(0, 0, 0, 0.5)'; // Kolor cienia
    //ctx.fill(); // Wypełnij okrąg kolorem
    //ctx.stroke(); // Narysuj obrys okręgu
    ctx.shadowBlur = 0; // Rozmycie cienia
    ctx.shadowColor =  'rgba(0, 0, 0, 0.0)'; // Kolor cienia

      ctx.save();
      ctx.clip();
      let image = new Image();
      image.src = '..\\..\\assets\\x.png';
      const nw = this.size*2*scale;
      const nh = nw;
      ctx.drawImage(image, size[0]/2 -nw/2+ (this.positon.x-camera.x)*scale,  size[1]/2-(this.positon.y-camera.y)*scale-nh/2, nw, nh);
      ctx.restore();

    ctx.fill(); // Wypełnij okrąg kolorem
    ctx.stroke(); // Narysuj obrys okręgu
    ctx.closePath();



    const text = this.gameObjectName;
    const textHeight = this.size/3*scale;
    ctx.font = textHeight+"px Arial";
    ctx.fillStyle = "azure";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    const textWidth = ctx.measureText(text).width;

    ctx.strokeText(text, centerX-textWidth/2, centerY+textHeight/4);
    ctx.fillText(text, centerX-textWidth/2, centerY+textHeight/4);
  }

  private delay = 0;
  shoot(delta: number){
    if(this.delay>0)
      return;
    let go = this.game.spawn(new Bullet(this));
    go.positon = this.positon.plus(this.game.mouse.plus(this.game.camera.minus(this.positon)).toUnit().times(this.size+2));
    go.velocity = this.game.mouse.plus(this.game.camera.minus(this.positon)).toUnit().times(30);
    this.velocity = this.velocity.minus(go.velocity.toUnit().times(5));
    if(go.velocity.x!=0&&go.velocity.y!=0){
      let rec = new Vector2(1/go.velocity.x, -1/go.velocity.y).toUnit();
      rec = rec.times(Math.random()-0.5).times(15);
      go.velocity = go.velocity.plus(rec);
    }

    this.delay = this.reloadTime;
  }

  keyMap: { [key: string]: boolean } = {};

  override keyDown(key: string) {
    this.keyMap[key.toLowerCase()] = true;
  }

  override keyUp(key: string) {
    this.keyMap[key.toLowerCase()] = false;
  }

  isPressed(key: string) {
    return this.keyMap[key];
  }

  override update(deltaTime: number) {
    let a = 400/this.size;
    let vmax = 20.0;
    let vx = this.velocity.x;
    let vy = this.velocity.y;
    if (this.isPressed("w")) {
      vy += a*deltaTime;
    }
    if (this.isPressed("s")) {
      vy += -a*deltaTime;
    }
    if (this.isPressed("a")) {
      vx += -a*deltaTime;
    }
    if (this.isPressed("d")) {
      vx += a*deltaTime;
    }
    this.velocity = new Vector2(vx, vy);
    if(this.velocity.magnitude()>vmax)
      this.velocity = this.velocity.toUnit().times(vmax);

    if(this.delay>0)
      this.delay-=deltaTime;
    if (this.isPressed("e")) {
      this.shoot(deltaTime);
    }


    for (const gameObject of this.game.gameObjects) {
      if(!gameObject||gameObject===this) continue;
      if (Vector2.distance(this.positon, gameObject.positon) < this.size&&this.size>gameObject.size) {
        this.size += Math.sqrt(gameObject.size)/20;
        this.game.destroy(gameObject);
      }
    }
  }
}
