import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { watch } from "valtio/utils";
import { CursorType } from "~/store/Cursor";
import { Store, store } from "~/store/Store";
import {
  MotionExit,
  MotionInitial,
  MotionTransition,
  MotionVariant,
} from "~/types/Motion";
import { clamp } from "~/utils/clamp";
import { range } from "~/utils/range";

interface GridPoint {
  x: number;
  y: number;
  isHovered?: boolean;
}

const s = Store.Canvas.Config.squareSize;
// The area of the grid (NxN squares):
// This must be an odd number so we can have an exact middle point.
const areaSize = 10;
// How much of the grid is not visible:
const areaOffset = 2;

export function VertexGrid() {
  const [point, setPoint] = useState<GridPoint>();

  const originX = point?.x;
  const originY = point?.y;
  const isHovered = !!point?.isHovered;

  const points = useMemo(() => {
    if (typeof originX === "number" && typeof originY === "number") {
      return createPoints(originX, originY, isHovered);
    }
    return [];
  }, [originX, originY, isHovered]);
  // console.log(point, points);

  useEffect(() => {
    return watch((get) => {
      const isActive = get(store).radial.isActive;
      const cursorType = get(store).cursor.type;

      const cursorX = get(store).cursor.canvasX;
      const cursorY = get(store).cursor.canvasY;

      if (isActive || cursorType !== CursorType.VERTEX_ADD) {
        return setPoint(undefined);
      }

      const closest = Store.Canvas.findClosestGridPoint(cursorX, cursorY, s)!;
      const hovered = Store.Canvas.findClosestGridPoint(cursorX, cursorY, 10);

      const next: GridPoint = {
        x: closest.x,
        y: closest.y,
        isHovered: !!hovered,
      };

      setPoint((prev) => {
        if (!prev) return next;
        if (
          prev.x !== next.x ||
          prev.y !== next.y ||
          prev.isHovered !== next.isHovered
        )
          return next;
        return prev;
      });
    });
  }, []);

  return (
    <AnimatePresence>
      {point && (
        <motion.g
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LayoutGroup>
            {points.map(({ x, y, dist, key, variant }) => (
              <motion.circle
                layoutId={key}
                key={key}
                cx={x}
                cy={y}
                r={8}
                custom={dist}
                animate={variant}
                initial={initial}
                exit={initial}
                variants={variants}
                transition={transition}
              />
            ))}
          </LayoutGroup>
        </motion.g>
      )}
    </AnimatePresence>
  );
}

enum Variant {
  HIDDEN = "HIDDEN",
  VISIBLE = "VISIBLE",
  HOVERED = "HOVERED",
}

function createPoints(originX: number, originY: number, isHovered: boolean) {
  const mid = areaSize / 2;

  return range(areaSize, (row) => {
    return range(areaSize, (col) => {
      const x = originX + (col - mid) * s;
      const y = originY + (row - mid) * s;
      const dist = Math.sqrt(Math.pow(col - mid, 2) + Math.pow(row - mid, 2));
      const key = `${x},${y}`;

      return {
        x,
        y,
        dist,
        key,
        variant: getVariant(dist, isHovered),
      };
    });
  }).flat();
}

function getVariant(dist: number, isHovered: boolean) {
  const mid = (areaSize - areaOffset) / 2;

  if (dist === 0 && isHovered) return Variant.HOVERED;
  if (dist <= mid) return Variant.VISIBLE;
  return Variant.HIDDEN;
}

const initial: MotionInitial & MotionExit = {
  opacity: 0,
  scale: 0,
  fill: "#D4D4D4",
};

const transition: MotionTransition = {
  type: "spring",
  duration: 1,
};

const variants: Record<Variant, MotionVariant> = {
  [Variant.HIDDEN]: {
    opacity: 0,
    scale: 0,
    fill: "#D4D4D4",
  },
  [Variant.VISIBLE]: (dist: number) => ({
    opacity: dist <= 1.5 ? 0.5 : clamp(0.75 - dist * 0.2, 0.25, 0.75),
    scale: dist <= 1.5 ? 0.75 : clamp(1 - dist * 0.175, 0.5, 1),
    fill: "#D4D4D4",
  }),
  [Variant.HOVERED]: {
    opacity: 0.8,
    scale: 1.4,
    fill: "#2B7FFF",
    transition: {
      delay: 0.125,
    },
  },
};
