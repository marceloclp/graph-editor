import { Store } from "./Store";

export enum CursorType {
  VERTEX_ADD = "VERTEX_ADD",
  VERTEX_REMOVE = "VERTEX_REMOVE",
  VERTEX_MOVE = "VERTEX_MOVE",
  EDGE_ADD = "EDGE_ADD",
  EDGE_REMOVE = "EDGE_REMOVE",
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
    return this.type === CursorType.VERTEX_ADD;
  }

  get isRemovingVertex() {
    return this.type === CursorType.VERTEX_REMOVE;
  }

  get isConnectingVertex() {
    return this.type === CursorType.EDGE_ADD;
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

  onResize(ev: UIEvent, store: Store) {
    // Maintain cursor position relative to canvas after resize
    this.canvasX = this.screenX - store.canvas.panX;
    this.canvasY = this.screenY - store.canvas.panY;
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

    if (this.is(Cursor.Type.VERTEX_ADD) && !ev.metaKey) {
      const point = this.getClosestGridPoint();
      if (point) {
        store.matrix.createVertex(point.x, point.y);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPointerUp(ev: PointerEvent) {
    this.isDragging = false;
    this.dragX = 0;
    this.dragY = 0;
  }

  onKeyUp(ev: KeyboardEvent) {
    if (ev.key === "Escape") this.setType();
  }

  is(type?: CursorType) {
    return this.type === type;
  }

  setType(index?: number) {
    if (typeof index === "undefined") {
      this.type = undefined;
    } else {
      this.type = [
        CursorType.VERTEX_ADD,
        CursorType.VERTEX_REMOVE,
        CursorType.VERTEX_MOVE,
        CursorType.EDGE_ADD,
        CursorType.EDGE_REMOVE,
        CursorType.EDGE_MOVE,
      ][index];
    }
  }
}
