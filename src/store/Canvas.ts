import { clamp } from "~/utils/clamp";

export class Canvas {
  public panX: number = 0;
  public panY: number = 0;

  public scrollX: number = 0;
  public scrollY: number = 0;

  /**
   * Centers the canvas on the screen on initialization.
   */
  onInit() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    this.panX = -Canvas.Config.canvasWidth / 2 + screenWidth / 2;
    this.panY = -Canvas.Config.canvasHeight / 2 + screenHeight / 2;

    this.scrollX = 0.5;
    this.scrollY = 0.5;
  }

  /**
   * Pans the canvas based on the wheel event (2-fingers gesture).
   */
  onWheel(ev: WheelEvent) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const nextX = this.panX - ev.deltaX;
    const nextY = this.panY - ev.deltaY;

    this.panX = clamp(nextX, -Canvas.Config.canvasWidth + screenWidth, 0);
    this.panY = clamp(nextY, -Canvas.Config.canvasHeight + screenHeight, 0);

    const totalRangeX = Canvas.Config.canvasWidth - screenWidth;
    const totalRangeY = Canvas.Config.canvasHeight - screenHeight;

    this.scrollX = Math.abs(this.panX) / totalRangeX;
    this.scrollY = Math.abs(this.panY) / totalRangeY;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onResize(ev: UIEvent) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate new pan positions while maintaining relative scroll position
    const totalRangeX = Canvas.Config.canvasWidth - screenWidth;
    const totalRangeY = Canvas.Config.canvasHeight - screenHeight;

    this.panX = -this.scrollX * totalRangeX;
    this.panY = -this.scrollY * totalRangeY;

    // Ensure pan values stay within bounds
    this.panX = clamp(this.panX, -Canvas.Config.canvasWidth + screenWidth, 0);
    this.panY = clamp(this.panY, -Canvas.Config.canvasHeight + screenHeight, 0);
  }

  findClosestGridPoint(x: number, y: number, threshold: number = 0) {
    return Canvas.findClosestGridPoint(x, y, threshold);
  }

  /**
   * Finds the closest grid point to another point.
   */
  public static findClosestGridPoint(
    gridX: number,
    gridY: number,
    threshold = 0
  ) {
    const { squareWidth: w, squareHeight: h } = Canvas.Config;

    // Find the closest grid point:
    const pX = Math.round(gridX / w) * w;
    const pY = Math.round(gridY / h) * h;

    const distance = Math.sqrt(
      Math.pow(gridX - pX, 2) + Math.pow(gridY - pY, 2)
    );

    return distance <= threshold ? { x: pX, y: pY } : undefined;
  }

  public static readonly Config = {
    canvasWidth: 4000,
    canvasHeight: 4000,
    squareWidth: 50,
    squareHeight: 50,

    get xAxisY() {
      return this.canvasHeight / 2;
    },

    get yAxisX() {
      return this.canvasWidth / 2;
    },
  };
}
