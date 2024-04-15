import { Vector2 } from "./Vector2";
import { GameObject } from "./gameObject";

export class Player extends GameObject  {
  constructor(name: string) {
    super(name);
    this.color = "royalblue";
  }

  keyMap : { [key: string]: boolean } = {};
  override keyDown(key: string){
    this.keyMap[key.toLowerCase()] = true;
  }
  override keyUp(key: string){
     this.keyMap[key.toLowerCase()] = false;
  }
  isPressed(key: string){
    return this.keyMap[key];
  }
  override update(deltaTime:number) {
    let v0 = 12.0;
    let vx = this.velocity.x;
    let vy = this.velocity.y;
    if (this.isPressed("w"))
    {
        vy = v0;
    }
    if (this.isPressed("s"))
    {
        vy = -v0;
    }
    if (this.isPressed("a"))
    {
        vx = -v0;
    }
    if (this.isPressed("d"))
    {
        vx = v0;
    }
    this.velocity = new Vector2(vx, vy);
  }
}
