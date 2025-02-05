import { clamp } from "~/utils/clamp";

const CanvasConfig = {
  canvasWidth: 4000,
  canvasHeight: 4000,
  /** The size of each grid square. */
  squareSize: 50,
};

export class Canvas {
  public static readonly Config = CanvasConfig;

  /** How many pixels the canvas has been moved on the X axis. */
  public panX: number = 0;
  /** How many pixels the canvas has been moved on the Y axis. */
  public panY: number = 0;

  /** How much the canvas is scrolled on the X axis [0, 1]. */
  public scrollX: number = 0;
  /** How much the canvas is scrolled on the Y axis [0, 1]. */
  public scrollY: number = 0;

  public pan(deltaX: number, deltaY: number): void {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    const nextX = this.panX - deltaX;
    const nextY = this.panY - deltaY;

    // Update the pan position:
    this.panX = clamp(nextX, -Canvas.Config.canvasWidth + screenW, 0);
    this.panY = clamp(nextY, -Canvas.Config.canvasHeight + screenH, 0);

    const rangeX = Canvas.Config.canvasWidth - screenW;
    const rangeY = Canvas.Config.canvasHeight - screenH;

    // Update the scroll position:
    this.scrollX = Math.abs(this.panX) / rangeX;
    this.scrollY = Math.abs(this.panY) / rangeY;
  }

  /** Centralizes the canvas on the screen. */
  public center(): void {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    this.panX = -Canvas.Config.canvasWidth / 2 + screenW / 2;
    this.panY = -Canvas.Config.canvasHeight / 2 + screenH / 2;

    this.scrollX = 0.5;
    this.scrollY = 0.5;
  }

  /**
   * Finds the closest grid point to another point.
   */
  public static findClosestGridPoint(
    gridX: number,
    gridY: number,
    threshold = 0
  ) {
    const { squareSize: w, squareSize: h } = Canvas.Config;

    // Find the closest grid point:
    const pX = Math.round(gridX / w) * w;
    const pY = Math.round(gridY / h) * h;

    const distance = Math.sqrt(
      Math.pow(gridX - pX, 2) + Math.pow(gridY - pY, 2)
    );

    return distance <= threshold ? { x: pX, y: pY } : undefined;
  }
}
