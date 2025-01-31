export class MatrixPoint {
  public readonly id = MatrixPoint.createId(this.canvasX, this.canvasY);

  constructor(
    /** X coordinate inside the SVG. */
    public readonly canvasX: number,
    /** X coordinate inside the SVG. */
    public readonly canvasY: number
  ) {}

  /**
   * Whether this point is currectly selected for connecting to another
   * point through an edge.
   */
  public isConnecting: boolean = false;

  public static createId(x: number, y: number) {
    return `${x},${y}`;
  }
}
