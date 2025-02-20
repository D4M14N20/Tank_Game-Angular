import { Vector2 } from "./Vector2";
import { GameEngineService } from "./game-engine.service";
import {Color} from "./color";

export class GameObject {
    public gameObjectName : string = "GameObjectName";
    public positon : Vector2 = new Vector2(0, 0);
    public velocity : Vector2 = new Vector2(0, 0);
    public drag : number = 1;
    //public scale : Vector2 = new Vector2(1, 1);
    public color : Color = new Color(124,22, 31);
    public size : number = 3;
    public maxHp: number = 100;
    private hp: number = 100;
    public readonly game : GameEngineService;
    constructor(game: GameEngineService, name: string) {
        this.gameObjectName = name;
        this.game = game;
    }
    attack(damage: number): number{
        damage = Math.min(this.hp, damage);
        this.hp -= damage;
        if(this.hp<=0)
            this.game.destroy(this);
        return damage;
    }
    heal(heal: number){
        this.hp = Math.min(this.maxHp, this.hp+heal);
    }
    getHp():number{
        return this.hp;
    }
    go(deltaTime: number){
        this.positon = this.positon.plus(this.velocity.times(deltaTime));
        this.velocity = this.velocity.times(1-this.drag*deltaTime);
    }
    update(deltaTime: number){}
    start(){
        this.hp = this.maxHp;
    }
    keyDown(key: string){}
    keyUp(key: string){}
    drawHealthBar(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, health: number, maxHealth: number, scale: number): void {
      if(health==maxHealth||health<=0)
        return;
      //const alpha: number = 0.6;
      const fillWidth: number = Math.max(0, (health/maxHealth) * width);
      ctx.fillStyle = Color.background.toString();
      ctx.strokeStyle = Color.stroke.toString();
      ctx.lineWidth = scale/10;
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = this.color.toRgb().toString();
      ctx.fillRect(x, y, fillWidth, height);
      ctx.strokeRect(x, y, width, height);
  }
    draw(ctx: CanvasRenderingContext2D, scale: number, camera: Vector2, size: [number, number]){
        // Ustaw punkt środkowy okręgu
        const centerX: number = size[0]/2+(this.positon.x-camera.x)*scale;
        const centerY: number = size[1]/2-(this.positon.y-camera.y)*scale;
        const k: number = scale*this.size;
        const b: number = scale;

        // Ustaw promień okręgu
        const radius: number = this.size*scale;

        // Rozpocznij rysowanie ścieżki
        ctx.beginPath();

        // Narysuj okrąg
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

        // Ustaw styl linii i wypełnienie
        ctx.lineWidth = scale*this.size/15;
        ctx.strokeStyle = 'rgb(43,43,44)'; // Kolor linii
        ctx.fillStyle = this.color.toString();//'rgb(72, 161, 141)'; // Kolor wypełnienia


        ctx.shadowBlur = 30; // Rozmycie cienia
        ctx.shadowColor =  'rgba(0, 0, 0, 0.5)'; // Kolor cienia

        ctx.fill(); // Wypełnij okrąg kolorem
        ctx.stroke(); // Narysuj obrys okręgu


        ctx.shadowBlur = 0;
        ctx.closePath();

        const text = this.gameObjectName;
        const textHeight = this.size/3*scale;
        ctx.font = "bold "+textHeight+"px Arial";
        ctx.fillStyle = "azure";
        ctx.strokeStyle = 'rgb(43,43,44)';
        ctx.lineWidth = this.size*scale/20;
        ctx.lineJoin = 'miter';
        ctx.miterLimit = 2;
        const textWidth = ctx.measureText(text).width;

        ctx.strokeText(text, centerX-textWidth/2, centerY+textHeight/4);
        ctx.fillText(text, centerX-textWidth/2, centerY+textHeight/4);
        this.drawHealthBar(ctx, centerX-3*b, centerY-1.5*k, 6*b, b, this.hp, this.maxHp, scale);
    }
}
