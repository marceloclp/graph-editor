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
  const [point, setPoint] = useState<{ x: number; y: number }>();

  useEffect(() => {
    return watch((get) => {
      const cursorType = get(store).cursor.type;
      const canvasX = get(store).cursor.canvasX;
      const canvasY = get(store).cursor.canvasY;

      if (cursorType !== CursorType.VERTEX_ADD) {
        return setPoint(undefined);
      }

      const point = Store.Canvas.findClosestGridPoint(canvasX, canvasY, 10);
      if (point && !store.matrix.getVertexAt(point.x, point.y)) {
        return setPoint(point);
      }

      setPoint(undefined);
    });
  }, []);

  return (
    <AnimatePresence>
      {point && (
        <motion.circle
          cx={point.x}
          cy={point.y}
          r={10}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="stroke-4 fill-white stroke-neutral-300"
        />
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
