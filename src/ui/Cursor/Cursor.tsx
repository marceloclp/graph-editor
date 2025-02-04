import { useMotionValue, motion, AnimatePresence } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useSnapshot } from "valtio/react";
import { watch } from "valtio/utils";
import { Store, store } from "~/store/Store";
import { match } from "ts-pattern";
import { CursorType } from "~/store/Cursor";
import { PathMinus } from "../SVG/PathMinus";
import { PathArrow } from "../SVG/PathArrow";
import { PathPlus } from "../SVG/PathPlus";
import { Circle } from "../SVG/Circle";
import { range } from "~/utils/range";

export function Cursor() {
  const {
    isMounted,
    cursor: { type },
    radial: { isActive: isRadialActive },
  } = useSnapshot(store);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    return watch((get) => {
      const canvasX = get(store).cursor.canvasX;
      const canvasY = get(store).cursor.canvasY;
      x.set(canvasX);
      y.set(canvasY);
    });
  }, [x, y]);

  return (
    <Fragment>
      <AnimatePresence>
        {isMounted && (
          <motion.g
            data-cursor
            style={{ x, y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none"
          >
            <motion.circle
              r={16}
              cx={0}
              cy={0}
              className={twMerge(
                "fill-neutral-300/60",
                "group-has-data-[impossible=true]/app:fill-red-300/60",
                isRadialActive && "fill-blue-300/60"
              )}
            />
            {!isRadialActive &&
              match(type)
                .with(CursorType.VERTEX_ADD, () => <VertexAddIcon />)
                .with(CursorType.VERTEX_REMOVE, () => <VertexRemoveIcon />)
                .with(CursorType.VERTEX_MOVE, () => <VertexMoveIcon />)
                .with(CursorType.EDGE_ADD, () => <EdgeAddIcon />)
                .with(CursorType.EDGE_REMOVE, () => <EdgeRemoveIcon />)
                .with(CursorType.EDGE_MOVE, () => <EdgeMoveIcon />)
                .otherwise(() => null)}
          </motion.g>
        )}
      </AnimatePresence>
      <ClosestGridPoint />
    </Fragment>
  );
}

function ClosestGridPoint() {
  const [origin, setOrigin] = useState<{
    x: number;
    y: number;
    isHovered?: boolean;
  }>();

  useEffect(() => {
    return watch((get) => {
      const isRadialActive = get(store).radial.isActive;
      const cursorType = get(store).cursor.type;
      const canvasX = get(store).cursor.canvasX;
      const canvasY = get(store).cursor.canvasY;

      if (cursorType !== CursorType.VERTEX_ADD || isRadialActive) {
        return setOrigin(undefined);
      }

      const origin = Store.Canvas.findClosestGridPoint(
        canvasX,
        canvasY,
        // We use the full square width as the threshold to ensure we always get an origin:
        Store.Canvas.Config.squareWidth
      )!;

      const point = Store.Canvas.findClosestGridPoint(canvasX, canvasY, 10);

      setOrigin({
        x: origin.x,
        y: origin.y,
        isHovered: !!point,
      });
    });
  }, []);

  const w = Store.Canvas.Config.squareWidth;

  return (
    <AnimatePresence>
      {origin && (
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          {range(5, (i) => i)
            .flatMap((row) =>
              range(5, (col) => ({
                x: origin.x + (col - 2) * w,
                y: origin.y + (row - 2) * w,
                distance: Math.sqrt(
                  Math.pow(col - 2, 2) + Math.pow(row - 2, 2)
                ),
              }))
            )
            .filter(({ distance }) => distance > 0 && distance <= 2)
            .map(({ x, y, distance }) => (
              <motion.circle
                key={`${x},${y}`}
                cx={x}
                cy={y}
                r={8}
                className=" fill-neutral-200"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 0.8,
                  scale: Math.max(0, 1 - distance * 0.175),
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", duration: 0.175 }}
              />
            ))}
          <motion.circle
            key={`${origin.x},${origin.y}`}
            cx={origin.x}
            cy={origin.y}
            r={8}
            initial={{ opacity: 0, scale: 0, fill: "var(--color-neutral-200)" }}
            animate={{
              opacity: 0.8,
              scale: origin.isHovered ? 1.5 : 1,
              fill: origin.isHovered
                ? "var(--color-blue-400)"
                : "var(--color-neutral-200)",
            }}
            exit={{ opacity: 0, scale: 0, fill: "var(--color-neutral-200)" }}
            transition={{ type: "spring", duration: 0.175 }}
          />
        </motion.g>
      )}
    </AnimatePresence>
  );
}

function VertexAddIcon() {
  return (
    <motion.g style={{ x: 20, y: 20 }}>
      <Circle r={7} dashed={6} />
      <PathPlus l={10} dx={6} dy={6} />
    </motion.g>
  );
}

function VertexRemoveIcon() {
  return (
    <motion.g style={{ x: 20, y: 20 }}>
      <Circle r={7} dashed={6} />
      <PathMinus l={10} dx={6} dy={6} />
    </motion.g>
  );
}

function VertexMoveIcon() {
  return (
    <motion.g style={{ x: 20, y: 20 }}>
      <Circle r={7} dashed={6} />
      <PathArrow l={8} dx={8} dy={8} />
    </motion.g>
  );
}

function EdgeAddIcon() {
  return (
    <motion.g style={{ x: 18, y: 18 }}>
      <line
        x1={-10}
        y1={10}
        x2={10}
        y2={-10}
        className="stroke-3 stroke-neutral-300"
      />
      {/* Bottom-left circle (1st circle) */}
      <Circle r={5} cx={-8} cy={8} />
      {/* Top-right circle (2nd circle) */}
      <Circle r={5} cx={8} cy={-8} />
      <PathPlus l={10} dx={2} dy={2} />
    </motion.g>
  );
}

function EdgeRemoveIcon() {
  return (
    <motion.g style={{ x: 18, y: 18 }}>
      <line
        x1={-10}
        y1={10}
        x2={10}
        y2={-10}
        className="stroke-3 stroke-neutral-300"
      />
      {/* Bottom-left circle (1st circle) */}
      <Circle r={5} cx={-8} cy={8} />
      {/* Top-right circle (2nd circle) */}
      <Circle r={5} cx={8} cy={-8} />
      <PathMinus l={10} dx={2} dy={2} />
    </motion.g>
  );
}

function EdgeMoveIcon() {
  return (
    <motion.g style={{ x: 18, y: 18 }}>
      <line
        x1={-10}
        y1={10}
        x2={10}
        y2={-10}
        className="stroke-3 stroke-neutral-300"
      />
      {/* Bottom-left circle (1st circle) */}
      <Circle r={5} cx={-8} cy={8} />
      {/* Top-right circle (2nd circle) */}
      <Circle r={5} cx={8} cy={-8} />
      <PathArrow l={8} dx={4} dy={4} />
    </motion.g>
  );
}
