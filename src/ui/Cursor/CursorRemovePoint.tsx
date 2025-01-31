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

const d = path(`M 0 ${c.midL}`, `l ${c.l} 0`);

export function CursorRemovePoint() {
  return (
    <motion.g>
      <motion.circle
        r={16}
        cx={0}
        cy={0}
        className={twMerge(
          //
          "fill-red-300/60"
        )}
      />
      <motion.g style={{ x: 16, y: 16 }}>
        <path
          d={d}
          className="stroke-3 stroke-red-300/60"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.g>
    </motion.g>
  );
}
