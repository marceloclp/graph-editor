import { motion } from "framer-motion";
import { ComponentProps, FC } from "react";
import { twMerge } from "tailwind-merge";
import { useSnapshot } from "valtio/react";
import { store, Store } from "~/store/Store";

const {
  //
  squarePositions: positions,
  squareSize: w,
  squareSize: h,
  squareRadius: r,
  iconSize,
  iconX,
  iconY,
} = Store.Radial.Config;

export function RadialSquare({
  Icon,
  index,
}: {
  Icon?: FC<ComponentProps<"svg">>;
  index: number;
}) {
  const {
    radial: { activeIndex },
  } = useSnapshot(store);

  const { x, y } = positions[index];
  const isActive = activeIndex === index;

  return (
    <motion.g
      initial={{
        x: x,
        y: y,
        scale: 0.4,
        opacity: 0.9,
      }}
      animate={{
        x: x,
        y: y,
        scale: 1,
        opacity: 1,
      }}
    >
      <motion.rect
        width={w}
        height={h}
        rx={r}
        ry={r}
        className={twMerge(
          "fill-white",
          "stroke-4",
          isActive ? "stroke-blue-400" : "stroke-neutral-300",

          "transition-all"
        )}
      />

      {Icon && (
        <motion.g
          initial={{ x: iconX, y: iconY, opacity: 0 }}
          animate={{ x: iconX, y: iconY, opacity: 1 }}
        >
          <Icon
            width={iconSize}
            height={iconSize}
            className={twMerge(
              "stroke-[2.5]",
              isActive ? "text-blue-400" : "text-neutral-300",
              "transition-all"
            )}
          />
        </motion.g>
      )}
    </motion.g>
  );
}
