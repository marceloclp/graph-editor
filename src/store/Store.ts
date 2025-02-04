import { proxy } from "valtio";
import { Matrix } from "./Matrix";
import { Cursor } from "./Cursor";
import { Canvas } from "./Canvas";
import { Radial } from "./Radial";
import { subscribeKey } from "valtio/utils";
import { onEdgeDragMove, onEdgeDragUp } from "~/ui/Edge/Edge";
import { onVertexDragMove, onVertexDragUp } from "~/ui/Vertex/Vertex";

export class Store {
  public static readonly Canvas = Canvas;
  public static readonly Cursor = Cursor;
  public static readonly Matrix = Matrix;
  public static readonly Radial = Radial;

  public readonly canvas = new Canvas();
  public readonly cursor = new Cursor();
  public readonly matrix = new Matrix();
  public readonly radial = new Radial();

  public isMounted: boolean = false;

  getCanvasPoint(x: number, y: number) {
    const canvasX = x - this.canvas.panX;
    const canvasY = y - this.canvas.panY;
    return { x: canvasX, y: canvasY };
  }

  get isAddingVertex() {
    return this.cursor.isAddingVertex;
  }

  get isRemovingVertex() {
    return this.cursor.isRemovingVertex;
  }

  get isConnectingVertex() {
    return this.cursor.isConnectingVertex;
  }

  get isDraggingVertex() {
    return this.cursor.is(Store.Cursor.Type.VERTEX_MOVE);
  }

  onType(handlers: {
    onVertexAdd?: () => void;
    onVertexRemove?: () => void;
    onVertexMove?: () => void;
    onEdgeAddStart?: () => void;
    onEdgeAddEnd?: () => void;
    onEdgeRemove?: () => void;
    onEdgeMove?: () => void;
  }) {
    const Type = Store.Cursor.Type;
    const type = this.cursor.type;
    if (type === Type.VERTEX_ADD) {
      handlers.onVertexAdd?.();
    } else if (type === Type.VERTEX_REMOVE) {
      handlers.onVertexRemove?.();
    } else if (type === Type.VERTEX_MOVE) {
      handlers.onVertexMove?.();
    } else if (type === Type.EDGE_ADD) {
      if (!this.matrix.connectingVertexId) {
        handlers.onEdgeAddStart?.();
      } else if (this.matrix.connectingVertexId) {
        handlers.onEdgeAddEnd?.();
      }
    } else if (type === Type.EDGE_REMOVE) {
      handlers.onEdgeRemove?.();
    } else if (type === Type.EDGE_MOVE) {
      handlers.onEdgeMove?.();
    }
  }
}

export const store = proxy(new Store());

function onWheel(ev: WheelEvent) {
  store.canvas.onWheel(ev);
  store.cursor.onWheel(ev, store);
}

function onPointerMove(ev: PointerEvent) {
  store.cursor.onPointerMove(ev, store);
  store.radial.onPointerMove(ev, store);
  onVertexDragMove(ev);
  onEdgeDragMove(ev);
}

function onPointerDown(ev: PointerEvent) {
  store.radial.onPointerDown(ev, store);
  store.cursor.onPointerDown(ev, store);
}

function onPointerUp(ev: PointerEvent) {
  onEdgeDragUp(ev);
  onVertexDragUp(ev);
  store.cursor.onPointerUp(ev);
}

function onKeyUp(ev: KeyboardEvent) {
  store.radial.onKeyUp(ev, store);
}

export function onMount<T extends Element>(elem: T | null) {
  if (!elem) return;

  store.isMounted = true;

  window.addEventListener("wheel", onWheel);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("keyup", onKeyUp);
  store.canvas.onInit();

  const unsubscribe = subscribeKey(store.cursor, "type", () => {
    store.matrix.resetInteractive();
  });

  const unsub2 = subscribeKey(store.radial, "isActive", (isActive) => {
    if (isActive) store.cursor.setType();
  });

  return () => {
    store.isMounted = false;
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("keyup", onKeyUp);
    unsubscribe();
    unsub2();
  };
}
