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
    static distance(a: Vector2, b: Vector2){
      return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
    }
    magnitude(){
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}
