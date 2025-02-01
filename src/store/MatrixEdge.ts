export class MatrixEdge {
  private static idx = 0;

  public readonly id = MatrixEdge.createId();

  constructor(
    public readonly p1Id: string,
    public readonly p2Id: string,
    // public readonly p1: MatrixPoint,
    // public readonly p2: MatrixPoint
    //
    public x?: number
  ) {}

  public static createId() {
    return `edge:${MatrixEdge.idx++}`;
  }
}
