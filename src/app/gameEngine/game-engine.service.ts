import { Injectable } from '@angular/core';
import { GameObject } from './gameObject';
import { Player } from './player';
import { Context } from 'vm';
import { Vector2 } from './Vector2';
import {Point} from "./point";
import {randomInt} from "node:crypto";

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  constructor() { }

  keyDown(key: string) {
    for (const gameObject of this.gameObjects)
      gameObject.keyDown(key);
  }
  keyUp(key: string){
    for (const gameObject of this.gameObjects)
      gameObject.keyUp(key);
  }
  scroll(delta: number){
    let ds = -(delta/100)*5;
    if(this.targetScale+ds<100&&this.targetScale+ds>10)
      this.targetScale+=ds;
  }
  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  init(){
    this.start();
    if(this.canvas)
      this.mainLoop();
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
    for (let x =  (canvasWidth/2-this.camera.x*this.scale)%gridSize; x <= canvasWidth; x += gridSize) {
        for (let y = (canvasHeight/2+this.camera.y*this.scale)%gridSize; y <= canvasHeight; y += gridSize) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }


  }

  private gameObjects: GameObject[] = [];
  private g = new GameObject("obiekt 1");
  private g2 = new GameObject("obiekt 2");
  private p : Player = new Player("Gracz");

  private canvas : HTMLCanvasElement | null = null;
  private lastFrameTime = performance.now();
  private frameCount = 0;
  private time = 0;
  private fps = 0;
  private targetScale = 35;
  private scale = 35;
  private camera : Vector2 = new Vector2(0, 0);
  mainLoop = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastFrameTime)/1000;
    this.lastFrameTime = currentTime;
    this.frameCount++;
    this.time += deltaTime;
    if (this.time >= 1) {
      this.fps = this.frameCount / (this.time);
      this.frameCount = 0;
      this.time = 0;
    }

    if(!this.canvas)
      return;
    let ctx = this.canvas.getContext("2d");
    if(!ctx)
      return;

    ctx.imageSmoothingEnabled = true;

    // Wyczyść canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Tutaj umieść kod renderowania Twojej gry
    this.update(this.canvas, ctx, deltaTime);


    // Wywołaj funkcję renderowania w pętli
    requestAnimationFrame(this.mainLoop);
  }
  start(){
    this.g2.positon = new Vector2(-50, 10);
    this.g2.velocity = new Vector2(5, 0);
    this.gameObjects.push(this.g, this.g2, this.p);
    this.g2.color = "darkolivegreen"//"limegreen";
    this.g2.size = 6;
    this.p.size = 4;

    for(let i = 0;i<1000;i++){
      let point = new Point();
      //point.positon = new Vector2(randomInt(-100, 100), randomInt(-100, 100));
      point.positon = new Vector2(Math.random()*1000, Math.random()*1000);
      point.color = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`
      this.gameObjects.push(point);
    }

    for (const gameObject of this.gameObjects) {
      gameObject.start();
    }
  }
  update(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, deltaTime: number){
    let targetCamera = this.p.positon;
    this.camera = this.camera.plus(targetCamera.minus(this.camera).times(10*deltaTime));
    this.scale += (this.targetScale-this.scale)*(5*deltaTime);

    this.drawDotGrid(ctx, 5, 0.25, 'rgb(10,20,25)');
    this.gameObjects.sort((a : GameObject, b : GameObject) => (a.size > b.size)?1:-1);
    for (const gameObject of this.gameObjects.filter(value => Vector2.distance(this.p.positon, value.positon)<100))
      gameObject.draw(ctx, this.scale, this.camera, [canvas.width, canvas.height]);
    for (const gameObject of this.gameObjects)
      gameObject.update(deltaTime);

/*    if(Vector2.distance(this.g.positon, this.p.positon)>3){
      let x = this.p.positon.minus(this.g.positon);
      this.g.positon = this.g.positon.plus(x.times(1/x.magnitude()).times(x.magnitude()-3));
    }*/

    for (const gameObject of this.gameObjects)
      gameObject.go(deltaTime);
    this.g2.gameObjectName = "Fps: "+this.fps.toFixed(2).toString();
    //let image = new Image();
    //image.src = '..\\..\\assets\\drzewo.png';
    //ctx.drawImage(image, -500, 0);
    //ctx.drawImage(image, +3000, 0);
  }
}
