import { GameObject } from "./gameObject";
import {Vector2} from "./Vector2";

export class Point extends GameObject  {
  constructor() {
    super("");
    this.color = "rgb(25, 123, 231)";
    this.size = 1;
  }
  override draw(ctx: CanvasRenderingContext2D, scale: number, camera: Vector2, size: [number, number]){
        const centerX: number = size[0]/2+(this.positon.x-camera.x)*scale;
        const centerY: number = size[1]/2-(this.positon.y-camera.y)*scale;
        const radius: number = this.size*scale;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        // Ustaw styl linii i wypełnienie
        ctx.strokeStyle = '#000'; // Kolor linii
        ctx.fillStyle = this.color;//'rgb(72, 161, 141)'; // Kolor wypełnienia

        ctx.fill(); // Wypełnij okrąg kolorem

        // Zakończ rysowanie
        ctx.closePath();
    }
}
