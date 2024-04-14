import { Injectable } from '@angular/core';
import { GameObject } from './GameObject';
import { Context } from 'vm';
import { Vector2 } from './Vector2';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  g = new GameObject("obiekt 1");
  g2 = new GameObject("obiekt 2");
  canvas : HTMLCanvasElement | null = null; 
  
  constructor() { }
  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }
  init(){   
    this.start();
    if(this.canvas)
      this.render();
  }
  start(){
    this.g2.positon = new Vector2(-50, 10);
    this.g2.velocity = new Vector2(5, 0);
  }
  drawDotGrid(ctx: CanvasRenderingContext2D, gridSize: number, dotSize: number, dotColor: string) {
    // Pobierz szerokość i wysokość canvasu
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    gridSize *= this.scale;
    dotSize *=this.scale;
    // Ustaw kolor punktów
    ctx.fillStyle = dotColor;

    // Rysuj punkty
    for (let x = 0; x <= canvasWidth; x += gridSize) {
        for (let y = 0; y <= canvasHeight; y += gridSize) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
  }

  private lastFrameTime = performance.now();
  private frameCount = 0;
  private time = 0;
  private scale = 35;
  render = () => { 
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastFrameTime)/1000;
    this.lastFrameTime = currentTime;
    this.frameCount++;
    this.time += deltaTime;
    if (this.time >= 1) {
      const fps = this.frameCount / (this.time);
      this.frameCount = 0;
      this.time = 0;
      console.log("Fps: ", fps.toFixed(2));
    }

    if(!this.canvas)
      return;
    let ctx = this.canvas.getContext("2d");
    if(!ctx)
      return;

    ctx.imageSmoothingEnabled = true;
    
    // Wyczyść canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawDotGrid(ctx, 2, 0.25, 'rgb(10,20,25)'); // R
      
    // Tutaj umieść kod renderowania Twojej gry
    this.g.draw(ctx, [this.canvas.width, this.canvas.height], this.scale);
    this.g2.draw(ctx, [this.canvas.width, this.canvas.height], this.scale);
    this.g2.go(deltaTime);
    
    ctx.closePath();

    
    // Wywołaj funkcję renderowania w pętli
    requestAnimationFrame(this.render);
  }
}
