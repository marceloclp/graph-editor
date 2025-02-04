import { motion } from "framer-motion";
import { ComponentProps, FC, Fragment } from "react";
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

  const { x, y, angle } = positions[index];
  const isActive = activeIndex === index;

  return (
    <Fragment>
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
          x={0}
          y={0}
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
                "bg-red-500",
                "transition-all"
              )}
            />
          </motion.g>
        )}

        {/* <g transform={transform(-25, 0)}>
        <foreignObject
          // x={40 * Math.cos(angle)}
          // y={-40 * Math.sin(angle)}
          x={getX(40)}
          y={getY(40)}
          width={100}
          height={20}
          // transform={transform("-50%", 0)}
          className="bg-blue-500"
        >
          <div className="bg-red-500/0 w-[100px]">adsada</div>
        </foreignObject>
      </g> */}
      </motion.g>

      <Text angle={angle} index={index} isActive={isActive} />

      {/* <motion.g
        initial={{
          x: 220 * Math.cos(angle) - 50,
          y: -220 * Math.sin(angle) - 15,
        }}
        animate={{
          x: 220 * Math.cos(angle) - 50,
          y: -220 * Math.sin(angle) - 15,
        }}
      >
        <rect
          x={0}
          y={0}
          // x={-50}
          // y={-20}
          width={100}
          height={40}
          rx={10}
          ry={10}
          className="fill-neutral-100"
          // className="fill-white stroke-3 stroke-neutral-300"
        />
      </motion.g> */}

      {/* <motion.g
        initial={{
          x: 220 * Math.cos(angle),
          y: -220 * Math.sin(angle),
        }}
        animate={{
          x: 220 * Math.cos(angle),
          y: -220 * Math.sin(angle),
        }}
      >
        <text
          className="font-mono"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          dasdas
        </text>
      </motion.g> */}
    </Fragment>
  );
}

function Text({
  index,
  angle,
  isActive,
}: {
  index: number;
  angle: number;
  isActive: boolean;
}) {
  const h = 36;
  const w = 140;
  const r = h / 1.8;

  const x = 270 * Math.cos(angle) - w / 2;
  const y = -200 * Math.sin(angle) - h / 2;

  return (
    <motion.g initial={{ x, y }} animate={{ x, y }}>
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={r}
        ry={r}
        className={twMerge(
          isActive ? "fill-blue-500" : "fill-neutral-100",
          "transition-all duration-150"
        )}
        // className="fill-white stroke-3 stroke-neutral-300"
      />
      <text
        x={w / 2}
        y={h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        className={twMerge(
          //
          "font-mono",
          "font-semibold",
          "text-sm",
          "uppercase",
          // "fill-neutral-500",
          isActive ? "fill-white" : "fill-neutral-500",
          "transition-all duration-150"
        )}
      >
        {/* {actions[index]?.name} */}
        {Store.Radial.Config.actions[index].name}
      </text>
    </motion.g>
  );
}
