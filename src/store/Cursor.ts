import { Store } from "./Store";

enum CursorType {
  ADD_POINT = "ADD_POINT",
  REMOVE_POINT = "REMOVE_POINT",
  CONNECT_POINT = "CONNECT_POINT",
  REMOVE_EDGE = "REMOVE_EDGE",
  INFO = "INFO",
  VERTEX_MOVE = "VERTEX_MOVE",
}

export class Cursor {
  public static readonly Type = CursorType;

  public type?: CursorType;

  /** X coordinate inside the canvas. */
  public canvasX: number = 0;
  /** Y coordinate inside the canvas. */
  public canvasY: number = 0;

  public screenX: number = 0;
  public screenY: number = 0;

  get isActive() {
    return this.type !== undefined;
  }

  onPointerMove(ev: PointerEvent, store: Store) {
    this.screenX = ev.clientX;
    this.screenY = ev.clientY;

    this.canvasX = ev.clientX - store.canvas.panX;
    this.canvasY = ev.clientY - store.canvas.panY;
  }

  is(type?: CursorType) {
    return this.type === type;
  }

  setType(index?: number) {
    if (typeof index === "undefined") {
      this.type = undefined;
    } else {
      this.type = [
        CursorType.ADD_POINT,
        CursorType.REMOVE_POINT,
        CursorType.CONNECT_POINT,
        CursorType.REMOVE_EDGE,
        CursorType.INFO,
        CursorType.VERTEX_MOVE,
        CursorType.VERTEX_MOVE,
      ][index];
    }
  }
}
