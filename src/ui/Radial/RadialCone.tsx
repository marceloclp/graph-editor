import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { useSnapshot } from "valtio/react";
import { Store, store } from "~/store/Store";
import { path } from "../SVG/svg-utils";

const {
  n,

  innerRadius,
  outerRadius,
  outerStroke,

  coneEnlargeEnd,
  coneEnlargeOrigin,

  squareMid,
} = Store.Radial.Config;

const angle = Math.PI / 2;
const cos = Math.cos(angle);
const sin = Math.sin(angle);

const x1 = -coneEnlargeOrigin + innerRadius * cos;

const x2 = -coneEnlargeEnd - squareMid + outerRadius * cos;
const y2 = -outerRadius * sin + squareMid - outerStroke * 2;

const x3 = coneEnlargeEnd + squareMid + outerRadius * cos;
const y3 = -outerRadius * sin + squareMid - outerStroke * 2;

const x4 = coneEnlargeOrigin + innerRadius * cos;

const d = path(
  //
  `M ${x1} ${0}`,
  `L ${x2} ${y2}`,
  `A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}`,
  `L ${x4} ${0}`,
  `Z`
);

export function RadialCone() {
  const {
    radial: { rotation },
  } = useSnapshot(store);

  const deg = (((2 * Math.PI * rotation) / n) * 180) / Math.PI;

  return (
    <motion.path
      className={twMerge(
        "stroke-0",
        "fill-blue-400/20",
        "duration-150",
        "ease-in-out"
      )}
      d={d}
      transform={`rotate(${deg})`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
}
