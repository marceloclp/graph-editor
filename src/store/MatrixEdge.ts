import { MatrixPoint } from "./MatrixPoint";

export class MatrixEdge {
  public readonly id = MatrixEdge.createId(this.p1, this.p2);

  constructor(
    public readonly p1: MatrixPoint,
    public readonly p2: MatrixPoint
  ) {}

  public static createId(p1: MatrixPoint, p2: MatrixPoint) {
    return `${p1.id}->${p2.id}`;
  }
}
