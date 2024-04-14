export class Vector2 {
    x : number = 0;
    y : number = 0;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    plus(a: Vector2) : Vector2{
        return new Vector2(this.x+a.x, this.y+a.y);
    }
    minus(a: Vector2) : Vector2{
        return new Vector2(this.x-a.x, this.y-a.y);
    }
    times(a: number) : Vector2{
        return new Vector2(this.x*a, this.y*a);
    }
}