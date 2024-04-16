import { inject } from "@angular/core";
import { Vector2 } from "./Vector2";
import { GameEngineService } from "./game-engine.service";

export class GameObject {
    public gameObjectName : string = "GameObjectName";
    public positon : Vector2 = new Vector2(0, 0);
    public velocity : Vector2 = new Vector2(0, 0);
    public drag : number = 1;
    //public scale : Vector2 = new Vector2(1, 1);
    public color : string = "crimson";
    public size : number = 3;
    public readonly game : GameEngineService;
    constructor(game: GameEngineService, name: string) {
        this.gameObjectName = name;
        this.game = game;
    }
    go(deltaTime: number){
        this.positon = this.positon.plus(this.velocity.times(deltaTime));
        this.velocity = this.velocity.times(1-this.drag*deltaTime);
    }
    update(deltaTime: number){}
    start(){}
    keyDown(key: string){}
    keyUp(key: string){}
    draw(ctx: CanvasRenderingContext2D, scale: number, camera: Vector2, size: [number, number]){
        // Ustaw punkt środkowy okręgu
        const centerX: number = size[0]/2+(this.positon.x-camera.x)*scale;
        const centerY: number = size[1]/2-(this.positon.y-camera.y)*scale;


        // Ustaw promień okręgu
        const radius: number = this.size*scale;

        // Rozpocznij rysowanie ścieżki
        ctx.beginPath();

        // Narysuj okrąg
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

        // Ustaw styl linii i wypełnienie
        ctx.lineWidth = scale*this.size/15;
        ctx.strokeStyle = 'rgb(43,43,44)'; // Kolor linii
        ctx.fillStyle = this.color;//'rgb(72, 161, 141)'; // Kolor wypełnienia

        // Dodaj cień
        ctx.shadowBlur = 30; // Rozmycie cienia
        ctx.shadowColor =  'rgba(0, 0, 0, 0.5)'; // Kolor cienia
        ctx.shadowOffsetX = 0; // Przesunięcie cienia w osi X
        ctx.shadowOffsetY = 0; // Przesunięcie cienia w osi Y

        // Narysuj kształt
        ctx.fill(); // Wypełnij okrąg kolorem
        ctx.stroke(); // Narysuj obrys okręgu

        // Wyczyść ustawienia cieni
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        const text = this.gameObjectName;
        const textHeight = this.size/3*scale;
        ctx.font = textHeight+"px Arial";
        ctx.fillStyle = "azure";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8;
        const textWidth = ctx.measureText(text).width;

        ctx.strokeText(text, centerX-textWidth/2, centerY+textHeight/4);
        ctx.fillText(text, centerX-textWidth/2, centerY+textHeight/4);
        // Zakończ rysowanie
        ctx.closePath();
    }
}
