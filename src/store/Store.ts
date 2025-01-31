import { proxy } from "valtio";
import { Matrix } from "./Matrix";
import { Cursor } from "./Cursor";
import { Canvas } from "./Canvas";
import { Radial } from "./Radial";
import { subscribeKey } from "valtio/utils";

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
}

export const store = proxy(new Store());

export function onMount<T extends Element>(elem: T | null) {
  if (!elem) return;

  store.isMounted = true;

  const onWheel = (ev: WheelEvent) => {
    store.canvas.onWheel(ev);
  };

  const onPointerMove = (ev: PointerEvent) => {
    store.cursor.onPointerMove(ev, store);
    store.radial.onPointerMove(ev, store);
  };

  const onPointerDown = (ev: PointerEvent) => {
    store.matrix.onPointerDown(ev, store);
    store.radial.onPointerDown(ev, store);
  };

  const onKeyUp = (ev: KeyboardEvent) => {
    store.radial.onKeyUp(ev, store);
  };

  window.addEventListener("wheel", onWheel);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("keyup", onKeyUp);
  store.canvas.onInit();

  const unsubscribe = subscribeKey(store.cursor, "type", () => {
    store.matrix.resetInteractive();
  });

  return () => {
    store.isMounted = false;
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("keyup", onKeyUp);
    unsubscribe();
  };
}
