import { range } from "~/utils/range";

const RadialConfig = {
  /** Number of squares in the radial. */
  n: 6,

  /** Inner circle radius. */
  innerRadius: 40,
  /** Outer circle radius. */
  outerRadius: 140,

  /** Inner circle stroke. */
  innerStroke: 5,
  /** Outer circle stroke. */
  outerStroke: 6,

  /** Square (the action item) radius. */
  squareRadius: 10,
  /** Square (the action item) size. */
  squareSize: 50,
  /** Mid point of the square. */
  get squareMid() {
    return this.squareSize / 2;
  },

  /** Icon size - we use this to center the icon inside the square. */
  iconSize: 32,
  /** Icon x0 position. */
  get iconX() {
    return (this.squareSize - this.iconSize) / 2;
  },
  /** Icon y0 position. */
  get iconY() {
    return (this.squareSize - this.iconSize) / 2;
  },

  /** How much to enlarge the end (from the outer circle) of the cone. */
  coneEnlargeEnd: 40,
  /** How much to enlarge the origin (from the inner circle) of the cone. */
  coneEnlargeOrigin: 16,

  /** Cached square positions. */
  squarePositions: [] as { x: number; y: number; angle: number }[],

  actions: [
    { name: "Add vertex" },
    { name: "Remove vertex" },
    { name: "Move vertex" },
    { name: "Add edge" },
    { name: "Remove edge" },
    { name: "Move edge" },
  ],
};

RadialConfig.squarePositions = range(RadialConfig.n, (i) => {
  const r = RadialConfig.outerRadius;
  const mid = RadialConfig.squareMid;
  const angle = Math.PI / 2 - (2 * Math.PI * i) / RadialConfig.n;

  return {
    x: r * Math.cos(angle) - mid,
    y: -r * Math.sin(angle) - mid,
    angle: angle,
  };
});

export class Radial {
  public static readonly Config = RadialConfig;

  /** How many degrees the radial is rotated around its center. */
  public rotation: number = 0;

  /** The origin X coordinate of the radial on the canvas. */
  public canvasX: number = 0;
  /** The origin Y coordinate of the radial on the canvas. */
  public canvasY: number = 0;

  /** Whether the radial is currently active/open/visible. */
  public isActive: boolean = false;

  /** The index of the square closest to the cursor. */
  public get activeIndex() {
    const n = Radial.Config.n;
    return ((this.rotation % n) + n) % n;
  }

  /** Track the radial rotation based on the current cursor position. */
  rotate(cursorX: number, cursorY: number) {
    // Skip updating if the radial is not active:
    if (!this.isActive) return;

    // Get the cursor position relative to the origin of the radial:
    const relX = cursorX - this.canvasX;
    const relY = cursorY - this.canvasY;

    // Update the rotation:
    this.rotation += Radial.getRotationInc(relX, relY, this.activeIndex);
  }

  open(originX: number, originY: number): void {
    // Prevent resetting the state if the radial is already open.
    // This can happen when the user holds down the activation key
    // while pressing another key.
    if (this.isActive) return;

    this.isActive = true;

    this.rotation = 0;

    this.canvasX = originX;
    this.canvasY = originY;
  }

  close() {
    this.isActive = false;
  }

  /**
   * When spinning the radial cone, we want to rotate the cone in the
   * shortest direction to the next closest square.
   *
   * For example, if we are at square 6, and the next square is 0, rather
   * than spinning counter-clockwise by 6 positions, we only spin clockwise
   * by 1 position.
   */
  private static getRotationInc(
    /** Cursor X in Canvas units, relative to the origin of the radial */
    relX: number,
    /** Cursor Y in Canvas units, relative to the origin of the radial */
    relY: number,
    currentIndex: number
  ): number {
    const { n, squarePositions, squareMid } = Radial.Config;

    let minDistance = Infinity;
    let closestIndex = 0;

    squarePositions.forEach((pos, index) => {
      const dx = pos.x + squareMid - relX;
      const dy = pos.y + squareMid - relY;
      const distance = dx * dx + dy * dy;

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    const distRight = (currentIndex - closestIndex + n) % n;
    const distLeft = (closestIndex - currentIndex + n) % n;

    return distRight < distLeft ? -distRight : distLeft;
  }

  public static isPressingActivationKey(ev: KeyboardEvent): boolean {
    return ev.metaKey;
  }
}
