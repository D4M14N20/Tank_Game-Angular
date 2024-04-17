export class Color{
  public readonly r: number = 0;
  public readonly g: number = 0;
  public readonly b: number = 0;
  public a: number = 1;

  public static readonly stroke: Color = new Color(43,43,44);
  public static readonly background: Color = new Color(88,90,93);
  //a = "rgb(88,90,93)";
  constructor(r: number, g:number, b: number, a: number=1) {
    this.r = Math.min(255, Math.max(0, r));
    this.g = Math.min(255, Math.max(0, g));
    this.b = Math.min(255, Math.max(0, b));
    this.a = Math.min(1, Math.max(0, a));
  }
  toString(): string{
    return `rgba(${this.r},${this.g},${this.b},${Math.max(0, Math.min(this.a, 1))})`;
  }
  toRgb(): Color{
    return new Color(this.r, this.g, this.b);
  }
  toArgb(alpha: number){
    return new Color(this.r, this.g, this.b, alpha);
  }
}
