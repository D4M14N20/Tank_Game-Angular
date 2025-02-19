import {Injectable, OnDestroy} from '@angular/core';
import { GameObject } from './GameObject';
import { Player } from './player';
import { Vector2 } from './Vector2';
import {Bullet} from "./bullet";
import {Color} from "./color";
import {Square} from "./square";
import {Triangle} from "./triangle"
import {Pentagon} from "./pentagon";

@Injectable({
  providedIn: 'root'
})
export class GameEngineService implements OnDestroy {
  private readonly interval: any;
  private readonly fixedDelta: number = 7;
  constructor() {
    this.interval = setInterval(() => {
      this.fixedUpdate();
    }, this.fixedDelta);
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
  setXp(xp: number, color: string){
    const myDiv = document.getElementById("xp");
    if (myDiv){
        myDiv.style.width = Math.round(xp/10)+"%";
        myDiv.style.backgroundColor = color;
    }
  }
  keyDown(key: string) {
    for (const gameObject of this.gameObjects)
      gameObject.keyDown(key);
  }
  setMousePosition(x: number, y: number){
    if(!this.canvas)
      return;
    this.mouse = new Vector2((x-this.canvas.width/2)/this.scale, (-y+this.canvas.height/2)/this.scale);
  }
  keyUp(key: string){
    for (const gameObject of this.gameObjects)
      gameObject.keyUp(key);
  }
  scroll(delta: number){
    delta = Math.sign(delta);
      if(delta>0&&this.targetScale*0.9>5)
        this.targetScale=0.9*this.targetScale;
      if(delta<0&&this.targetScale*1.1<100)
        this.targetScale=1.1*this.targetScale;
  }
  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if(!this.canvas)
        return;
      const rect = this.canvas.getBoundingClientRect();
      let scaleX = this.canvas.width / rect.width;
      let scaleY = this.canvas.height / rect.height;
      let mouseX = (event.clientX-rect.left)*scaleX;
      let mouseY = (event.clientY-rect.top)*scaleY;
      this.setMousePosition(mouseX, mouseY);
    });
  }
  private initialized: boolean = false;
  init(){
    if(this.initialized)
      return;
    this.initialized = true;

    this.start();
    if(!this.canvas)
      return;
    this.mainLoop();
  }
  addVignetteEffect(ctx: CanvasRenderingContext2D, color: string) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0.1, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, color);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  drawDotGrid(ctx: CanvasRenderingContext2D, gridSize: number, dotSize: number, dotColor: string) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    gridSize *= this.scale;
    dotSize *=this.scale;
    ctx.fillStyle = dotColor;

    for (let x =  (canvasWidth/2-this.camera.x*this.scale)%gridSize; x <= canvasWidth; x += gridSize) {
        for (let y = (canvasHeight/2+this.camera.y*this.scale)%gridSize; y <= canvasHeight; y += gridSize) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }


  }

  private gameObjects: GameObject[] = [];
  public closeObjects: GameObject[] = [];
  private g = new GameObject(this, "obiekt 1");
  private g2 = new GameObject(this, "obiekt 2");
  private p : Player = new Player(this, "unnamed");

  private canvas : HTMLCanvasElement | null = null;
  private lastFrameTime = performance.now();
  private frameCount = 0;
  private time = 0;
  private fps = 0;
  private targetScale = 35;
  private scale = 35;
  public camera : Vector2 = new Vector2(0, 0);
  public mouse : Vector2 = new Vector2(1, 0);
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
    ctx.strokeStyle = "rgb(43,43,44)";
    ctx.lineJoin = "round";
    ctx.shadowColor =  'rgba(0, 0, 0, 0.5)';

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.update(this.canvas, ctx, deltaTime);

    requestAnimationFrame(this.mainLoop);
  }
  spawn(gameObject : GameObject){
    this.gameObjects.push(gameObject);
    gameObject.start();
    return gameObject;
  }
  destroy(gameObject : GameObject){
    let index = this.gameObjects.indexOf(gameObject);
    if(index===-1)
      return;
    if(gameObject instanceof Bullet){
      let bullet = gameObject as Bullet;
      if(!bullet.dead)
        bullet.dead = true;
      if(bullet.deadTime>0)
        return;
    }
    if(this.gameObjects[index]===gameObject)
      this.gameObjects.splice(index, 1);
  }
  setName(name: string){
    this.p.gameObjectName = name;
  }
  start(){
    this.g.positon = new Vector2(10, 20);
    this.g2.positon = new Vector2(-50, 10);
    this.g2.velocity = new Vector2(5, 0);
    this.gameObjects.push(this.g, this.g2, this.p);
    this.g2.color = new Color(40, 150, 30);
    this.g2.size = 6;
    for(let i = 0;i<600;i++){
      let x =this.spawn(new Square(this));
      x.positon = new Vector2((Math.random()-0.5)*1000, (Math.random()-0.5)*1000);
      x.color = new Color(Math.random()*255, Math.random()*255, Math.random()*255);
    }
    for(let i = 0;i<300;i++){
      let x =this.spawn(new Triangle(this));
      x.positon = new Vector2((Math.random()-0.5)*1000, (Math.random()-0.5)*1000);
      x.color = new Color(Math.random()*255, Math.random()*255, Math.random()*255);
    }
    for(let i = 0;i<100;i++){
      let x =this.spawn(new Pentagon(this));
      x.positon = new Vector2((Math.random()-0.5)*1000, (Math.random()-0.5)*1000);
      x.color = new Color(Math.random()*255, Math.random()*255, Math.random()*255);
    }
  }
  fixedUpdate() {
    let deltaTime = this.fixedDelta/1000;
    let targetCamera = this.p.positon;
    this.camera = this.camera.plus( targetCamera.minus(this.camera).times(0.02) );
    for (const gameObject of this.closeObjects)
      gameObject.go(deltaTime);
    this.p.fixedUpdate(deltaTime);
  }
  update(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, deltaTime: number){

    this.scale += (this.targetScale-this.scale)*(5*deltaTime);

    this.drawDotGrid(ctx, 5, 0.25, 'rgb(43,43,44)');

    this.gameObjects.sort((a : GameObject, b : GameObject) => (a.size +a.positon.y/1000> b.size+b.positon.y/1000)?1:-1);
    this.closeObjects = this.gameObjects.filter(value => Vector2.distance(this.p.positon, value.positon)<75);
    for (const gameObject of this.closeObjects)
      gameObject.draw(ctx, this.scale, this.camera, [canvas.width, canvas.height]);
    for (const gameObject of this.closeObjects)
      gameObject.update(deltaTime);

    this.addVignetteEffect(ctx, 'rgb(0,0,0, 0.4)');
/*    if(Vector2.distance(this.g.positon, this.p.positon)>3){
      let x = this.p.positon.minus(this.g.positon);
      this.g.positon = this.g.positon.plus(x.times(1/x.magnitude()).times(x.magnitude()-3));
    }*/


    this.g2.gameObjectName = "Fps: "+this.fps.toFixed(2).toString();
  }
}
