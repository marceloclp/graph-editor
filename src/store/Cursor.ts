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

  /** The selected cursor action type. */
  public type?: CursorType;

  /** X coordinate inside the canvas. */
  public canvasX: number = 0;
  /** Y coordinate inside the canvas. */
  public canvasY: number = 0;

  /** X coordinate on the screen. */
  public screenX: number = 0;
  /** Y coordinate on the screen. */
  public screenY: number = 0;

  /** Whether the user has moved the cursor at least once. */
  public isInitialized: boolean = false;

  public getClosestGridPoint(threshold: number = 10) {
    const x = this.canvasX;
    const y = this.canvasY;

    return Store.Canvas.findClosestGridPoint(x, y, threshold);
  }

  public move(
    /** The cursor's X coordinate on the screen. */
    screenX: number,
    /** The cursor's Y coordinate on the screen. */
    screenY: number,
    panX: number,
    panY: number
  ): void {
    this.isInitialized = true;

    this.screenX = screenX;
    this.screenY = screenY;

    this.canvasX = screenX - panX;
    this.canvasY = screenY - panY;
  }

  public is(type?: CursorType): boolean {
    return this.type === type;
  }

  public setType(index?: number): void {
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

  public cancel(): void {
    this.type = undefined;
  }

  public static isPressingCancelKey(ev: KeyboardEvent): boolean {
    return ev.key === "Escape";
  }
}
