import { AnimatePresence, motion } from "motion/react";
import { useSnapshot } from "valtio/react";
import { Store, store } from "~/store/Store";
import { RadialCone } from "./RadialCone";
import { RadialSquare } from "./RadialSquare";
import { VertexAddIcon } from "../Icons/VertexAddIcon";
import { VertexRemoveIcon } from "../Icons/VertexRemoveIcon";
import { EdgeAddIcon } from "../Icons/EdgeAddIcon";
import { EdgeRemoveIcon } from "../Icons/EdgeRemoveIcon";
import { VertexMoveIcon } from "../Icons/VertexMoveIcon";
import { EdgeMoveIcon } from "../Icons/EdgeMoveIcon";

const {
  //
  innerRadius,
  outerRadius,
  innerStroke,
  outerStroke,
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
          {[
            VertexAddIcon,
            VertexRemoveIcon,
            VertexMoveIcon,
            EdgeAddIcon,
            EdgeRemoveIcon,
            EdgeMoveIcon,
          ].map((Icon, index) => (
            <RadialSquare key={index} index={index} Icon={Icon} />
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
