import { AnimatePresence, motion } from "motion/react";
import { useSnapshot } from "valtio/react";
import { Store, store } from "~/store/Store";
import { RadialCone } from "./RadialCone";
import { RadialSquare } from "./RadialSquare";

const {
  //
  innerRadius,
  outerRadius,
  innerStroke,
  outerStroke,
  actions,
} = Store.Radial.Config;

export function Radial() {
  const {
    radial: { isActive, canvasX, canvasY },
  } = useSnapshot(store);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.g style={{ x: canvasX, y: canvasY }} className="group/radial">
          {/* Outer circle - must stay in the foreground. */}
          <motion.circle
            r={outerRadius}
            strokeWidth={outerStroke}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="stroke-neutral-200 fill-white/60"
          />

          <RadialCone />

          {actions.map((action, index) => (
            <RadialSquare key={action.name} index={index} Icon={action.Icon} />
          ))}

          {/* Inner circle - must stay above all other elements. */}
          <motion.circle
            r={innerRadius}
            strokeWidth={innerStroke}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="stroke-blue-500/80 fill-white z-10"
          />
        </motion.g>
      )}
    </AnimatePresence>
  );
}
