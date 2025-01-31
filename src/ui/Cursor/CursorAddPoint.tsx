import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { path } from "~/utils/path";

const c = {
  /** The length of the cross. */
  l: 16,
  get midL() {
    return this.l / 2;
  },
};

const d = path(
  `M 0 0`,
  `l ${c.l} 0`,
  `M 0 0`,
  `m ${c.midL} ${-c.midL}`,
  `l 0 ${c.l}`
);

export function CursorAddPoint() {
  return (
    <motion.g>
      <motion.circle
        r={16}
        cx={0}
        cy={0}
        className={twMerge(
          //
          "fill-neutral-300/60",

          "group-has-data-[state=hover-impossible]/app:fill-red-300/60",

          "transition-colors"
        )}
      />
      <motion.g style={{ x: 16, y: 16 }}>
        <path
          d={d}
          className="stroke-3 stroke-neutral-300/60"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
    </motion.g>
  );
}
