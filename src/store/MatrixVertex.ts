export class MatrixVertex {
  private static idx = 0;

  /** Stable id, used to connect entities together (eg., edges). */
  public readonly id = MatrixVertex.createId();

  /** String representation of the point's position for quick lookup. */
  get posId() {
    return MatrixVertex.createPosId(this.canvasX, this.canvasY);
  }

  constructor(
    /** X coordinate inside the SVG. */
    public canvasX: number,
    /** X coordinate inside the SVG. */
    public canvasY: number
  ) {}

  public dragX: number = 0;
  public dragY: number = 0;

  public drag(deltaX: number, deltaY: number): void {
    this.dragX += deltaX;
    this.dragY += deltaY;
  }

  public static createId() {
    return `point:${MatrixVertex.idx++}`;
  }

  public static createPosId(x: number, y: number) {
    return `(${x},${y})`;
  }
}
