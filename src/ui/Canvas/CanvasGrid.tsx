import { Store } from "~/store/Store";
import { path } from "~/utils/path";

const {
  squareWidth: sW,
  squareHeight: sH,
  xAxisY,
  yAxisX,
} = Store.Canvas.Config;

const d = path(
  //
  `M ${sW} ${0}`,
  `L ${0} ${0}`,
  `L ${0} ${sH}`
);

export function CanvasGrid() {
  return (
    <g className="pointer-events-none">
      <defs>
        <pattern id="grid" width={sW} height={sH} patternUnits="userSpaceOnUse">
          <path d={d} className="stroke-neutral-200 fill-none" />
        </pattern>
      </defs>

      {/* Grid */}
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* X-axis */}
      <rect
        width="100%"
        height="1"
        fill="none"
        y={xAxisY}
        className="stroke-neutral-200 stroke-2"
      />

      {/* Y-axis */}
      <rect
        width="1"
        height="100%"
        fill="none"
        x={yAxisX}
        className="stroke-neutral-200 stroke-2"
      />
    </g>
  );
}
