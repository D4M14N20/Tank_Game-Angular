import { Vector2 } from "./Vector2";

export class GameObject {
    gameObjectName : string = "GameObjectName";
    positon : Vector2 = new Vector2(0, 0);
    velocity : Vector2 = new Vector2(0, 0);
    scale : Vector2 = new Vector2(0, 0);
    constructor(name: string) {
        this.gameObjectName = name;
    }
    go(deltaTime: number){
        this.positon = this.positon.plus(this.velocity.times(deltaTime));
    }
    draw(ctx: CanvasRenderingContext2D, size: [number, number], scale: number){
        // Ustaw punkt środkowy okręgu
        const centerX: number = size[0] / 2+this.positon.x*scale;
        const centerY: number = size[1] / 2-this.positon.y*scale;

        // Ustaw promień okręgu
        const radius: number = 3.14*scale;

        // Rozpocznij rysowanie ścieżki
        ctx.beginPath();

        // Narysuj okrąg
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

        // Ustaw styl linii i wypełnienie
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000'; // Kolor linii
        ctx.fillStyle = "crimson";//'rgb(72, 161, 141)'; // Kolor wypełnienia

        // Dodaj cień
        // ctx.shadowBlur = 10; // Rozmycie cienia
        // ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Kolor cienia
        // ctx.shadowOffsetX = 5; // Przesunięcie cienia w osi X
        // ctx.shadowOffsetY = 5; // Przesunięcie cienia w osi Y

        // Narysuj kształt
        ctx.fill(); // Wypełnij okrąg kolorem
        ctx.stroke(); // Narysuj obrys okręgu

        // Wyczyść ustawienia cieni
        // ctx.shadowBlur = 0;
        // ctx.shadowColor = 'transparent';
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 0;


        var text = this.gameObjectName;

        // Właściwości tekstu
        var textHeight = 1.5*scale;
        ctx.font = textHeight+"px Arial";
        ctx.fillStyle = "azure"; // Kolor wypełnienia tekstu
        ctx.strokeStyle = "black"; // Kolor obrysu tekstu
        ctx.lineWidth = 4; // Grubość obrysu tekstu

        // Ustawienie tekstu na canvasie
        var textWidth = ctx.measureText(text).width;

        ctx.strokeText(text, centerX-textWidth/2, centerY+textHeight/4); // Rysowanie obrysu tekstu
        ctx.fillText(text, centerX-textWidth/2, centerY+textHeight/4); // Rysowanie wypełnionego tekstu
        // Zakończ rysowanie
        
    }
}