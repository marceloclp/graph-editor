import { proxy } from "valtio";
import { Matrix } from "./Matrix";
import { Cursor } from "./Cursor";
import { Canvas } from "./Canvas";
import { Radial } from "./Radial";

export class Store {
  public static readonly Canvas = Canvas;
  public static readonly Cursor = Cursor;
  public static readonly Matrix = Matrix;
  public static readonly Radial = Radial;

  public readonly canvas = new Canvas();
  public readonly cursor = new Cursor();
  public readonly matrix = new Matrix();
  public readonly radial = new Radial();

  public isInitialized: boolean = false;
}

export const store = proxy(new Store());
