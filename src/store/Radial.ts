import { Store } from "./Store";

export class Radial {
  /**  */
  public rotation: number = 0;

  public canvasX: number = 0;
  public canvasY: number = 0;

  public isActive: boolean = false;

  /** The index of the square closest to the cursor. */
  public get activeIndex() {
    const n = Radial.Config.n;
    return ((this.rotation % n) + n) % n;
  }

  /**
   * Open the radial menu if the user clicks on the canvas while
   * holding the activation key.
   */
  onPointerDown(ev: PointerEvent, store: Store) {
    if (!Radial.isPressingActivationKey(ev)) return;
    if (this.isActive) return;

    const { x, y } = store.getCanvasPoint(ev.clientX, ev.clientY);

    this.isActive = true;
    this.canvasX = x;
    this.canvasY = y;
    this.rotation = 0;
  }

  /**
   * Track the rotation around the radial inner circle, so that we can
   * compute which square is closest to the user's cursor.
   */
  onPointerMove(ev: PointerEvent, store: Store) {
    // Skip tracking if not active:
    if (!this.isActive) return;

    // Get the cursor canvas position:
    const { x, y } = store.getCanvasPoint(ev.clientX, ev.clientY);

    // Get the cursor position relative to the origin of the radial:
    const relX = x - this.canvasX;
    const relY = y - this.canvasY;

    this.rotation += Radial.getRotationInc(relX, relY, this.activeIndex);
  }

  /**
   * When the user releases the Radial activation key, we want to close
   * the radial menu, and initiate the action of the square that is currently
   * active.
   */
  onKeyUp(ev: KeyboardEvent, store: Store) {
    // Skip if not active:
    if (!this.isActive) return;
    // Skip if still pressing the activation key:
    if (Radial.isPressingActivationKey(ev)) return;

    this.isActive = false;
    store.cursor.setType(this.activeIndex);
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
  ) {
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

  /**
   * Return the square position props used to position the square around
   * the radial, based on its index.
   */
  public static getSquarePosition(index: number) {
    const { n, outerRadius: r, squareMid: mid, squareSize: s } = Radial.Config;
    const angle = Math.PI / 2 - (2 * Math.PI * index) / n;

    return {
      x: r * Math.cos(angle) - mid,
      y: -r * Math.sin(angle) - mid,
      width: s,
      height: s,
    };
  }

  private static isPressingActivationKey(ev: PointerEvent | KeyboardEvent) {
    return ev.metaKey;
  }

  public static readonly Config = {
    /** Number of squares in the radial. */
    n: 7,

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

    get squarePositions() {
      if (this["~squarePositions"]) {
        return this["~squarePositions"];
      }

      const pos: { x: number; y: number }[] = [];

      for (let i = 0; i < this.n; i++) {
        pos.push(Radial.getSquarePosition(i));
      }

      this["~squarePositions"] = pos;
      return pos;
    },

    // Cached square positions
    // (~ places the property at the bottom during autocomplete)
    "~squarePositions": null as { x: number; y: number }[] | null,
  };
}
