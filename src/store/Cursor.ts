import { Store } from "./Store";

export enum CursorType {
  ADD_POINT = "ADD_POINT",
  REMOVE_POINT = "REMOVE_POINT",
  CONNECT_POINT = "CONNECT_POINT",
  REMOVE_EDGE = "REMOVE_EDGE",
  INFO = "INFO",
  VERTEX_MOVE = "VERTEX_MOVE",
  EDGE_MOVE = "EDGE_MOVE",
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

  public isDragging: boolean = false;
  public dragX: number = 0;
  public dragY: number = 0;

  get isActive() {
    return this.type !== undefined;
  }

  get isAddingVertex() {
    return this.type === CursorType.ADD_POINT;
  }

  get isRemovingVertex() {
    return this.type === CursorType.REMOVE_POINT;
  }

  get isConnectingVertex() {
    return this.type === CursorType.CONNECT_POINT;
  }

  public getClosestGridPoint(threshold: number = 10) {
    const x = this.canvasX;
    const y = this.canvasY;

    return Store.Canvas.findClosestGridPoint(x, y, threshold);
  }

  /**
   * Keep track of the cursor position on wheel event (2-fingers gesture).
   */
  onWheel(ev: WheelEvent, store: Store) {
    this.screenX = ev.clientX;
    this.screenY = ev.clientY;

    this.canvasX = ev.clientX - store.canvas.panX;
    this.canvasY = ev.clientY - store.canvas.panY;
  }

  /**
   * Keep track of the cursor position on pointer move.
   */
  onPointerMove(ev: PointerEvent, store: Store) {
    this.screenX = ev.clientX;
    this.screenY = ev.clientY;

    this.canvasX = ev.clientX - store.canvas.panX;
    this.canvasY = ev.clientY - store.canvas.panY;

    this.dragX += ev.movementX;
    this.dragY += ev.movementY;
  }

  /**
   * Because there are no elements in the canvas to attach event handlers
   * to when listening for the ADD_VERTEX action, we need to find the closest
   * grid point by doing some quick maths.
   */
  onPointerDown(ev: PointerEvent, store: Store) {
    this.isDragging = true;
    this.dragX = 0;
    this.dragY = 0;

    if (this.is(Cursor.Type.ADD_POINT) && !ev.metaKey) {
      const point = this.getClosestGridPoint();
      if (point) {
        store.matrix.createVertex(point.x, point.y);
      }
    }
  }

  onPointerUp(ev: PointerEvent) {
    this.isDragging = false;
    this.dragX = 0;
    this.dragY = 0;
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
        CursorType.EDGE_MOVE,
        CursorType.VERTEX_MOVE,
      ][index];
    }
  }
}
