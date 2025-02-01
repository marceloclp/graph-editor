export class MatrixPoint {
  private static idx = 0;

  /** Stable id, used to connect entities together (eg., edges). */
  public readonly id = MatrixPoint.createId();

  /** String representation of the point's position for quick lookup. */
  get posId() {
    return MatrixPoint.createPosId(this.canvasX, this.canvasY);
  }

  constructor(
    /** X coordinate inside the SVG. */
    public canvasX: number,
    /** X coordinate inside the SVG. */
    public canvasY: number
  ) {}

  public dragX: number = 0;
  public dragY: number = 0;

  drag(deltaX: number, deltaY: number) {
    this.dragX += deltaX;
    this.dragY += deltaY;
  }

  public static createId() {
    return `point:${MatrixPoint.idx++}`;
  }

  public static createPosId(x: number, y: number) {
    return `(${x},${y})`;
  }
}
