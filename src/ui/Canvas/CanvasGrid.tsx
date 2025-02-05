import { Store } from "~/store/Store";
import { path } from "../SVG/svg-utils";

export function CanvasGrid() {
  const {
    //
    canvasWidth,
    canvasHeight,
    squareSize,
  } = Store.Canvas.Config;

  const d = path(
    //
    `M ${squareSize} ${0}`,
    `L ${0} ${0}`,
    `L ${0} ${squareSize}`
  );

  return (
    <g className="pointer-events-none">
      <defs>
        <pattern
          id="grid"
          width={squareSize}
          height={squareSize}
          patternUnits="userSpaceOnUse"
        >
          <path d={d} className="stroke-neutral-200 fill-none" />
        </pattern>
      </defs>

      {/* Grid */}
      <rect x={0} y={0} width="100%" height="100%" fill="url(#grid)" />

      {/* X-axis */}
      <rect
        width="100%"
        height="1"
        fill="none"
        x={0}
        y={canvasHeight / 2}
        className="stroke-neutral-200 stroke-2"
      />

      {/* Y-axis */}
      <rect
        width="1"
        height="100%"
        fill="none"
        x={canvasWidth / 2}
        y={0}
        className="stroke-neutral-200 stroke-2"
      />
    </g>
  );
}
