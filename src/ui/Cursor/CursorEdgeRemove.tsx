import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { path } from "~/utils/path";

/**
 * We will draw two icons from this config:
 * Connecting points: O---O
 * Removing edge:     O-X-O
 */
const c = {
  h: 10,
  pointRadius: 4,
  lineLength: 8,
  crossLength: 8,

  get midY() {
    return this.h / 2;
  },

  get fullLength() {
    return this.lineLength * 2 + this.crossLength;
  },

  get d1() {
    return path(
      //
      `M ${0} ${c.midY}`,
      `l ${c.lineLength * 2 + c.crossLength} 0`
    );
  },
};

export function CursorEdgeRemove() {
  return (
    <motion.g>
      <motion.circle
        r={16}
        cx={0}
        cy={0}
        className={twMerge(
          //
          "fill-neutral-300/60"
        )}
      />
      <motion.g style={{ x: 16, y: 16 }}>
        <line
          x1={c.pointRadius}
          y1={c.midY}
          x2={c.lineLength}
          y2={c.midY}
          className="stroke-neutral-300 stroke-3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={c.pointRadius + c.lineLength + c.crossLength}
          y1={c.midY}
          x2={c.pointRadius + c.lineLength + c.crossLength * 2}
          y2={c.midY}
          className="stroke-neutral-300 stroke-3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={c.pointRadius + c.lineLength - 2}
          y1={1}
          x2={c.pointRadius + c.lineLength + c.crossLength - 2}
          y2={c.crossLength + 1}
          className="stroke-neutral-300 stroke-3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={c.pointRadius + c.lineLength + c.crossLength - 2}
          y1={1}
          x2={c.pointRadius + c.lineLength - 2}
          y2={c.crossLength + 1}
          className="stroke-neutral-300 stroke-3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          r={c.pointRadius}
          cx={0}
          cy={c.midY}
          className="fill-white stroke-neutral-300 stroke-3"
        />
        <circle
          r={c.pointRadius}
          cx={c.fullLength + c.pointRadius}
          cy={c.midY}
          className="fill-white stroke-neutral-300 stroke-3"
        />
      </motion.g>
    </motion.g>
  );
}
