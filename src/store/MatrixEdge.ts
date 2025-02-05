export class MatrixEdge {
  private static idx = 0;

  public readonly id = MatrixEdge.createId();

  constructor(public readonly p1Id: string, public readonly p2Id: string) {}

  public static createId() {
    return `edge:${MatrixEdge.idx++}`;
  }
}
