import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { Store, store } from "~/store/Store";

function getEdgeId(ev: MouseEvent | TouchEvent | PointerEvent) {
  const target = ev.target as Element;
  const g = target.closest("g");
  return g?.id ?? "";
}

function getEdgeElem(ev: MouseEvent | TouchEvent | PointerEvent) {
  const target = ev.target as Element;
  return target.closest("g")!;
}

function onTap(ev: MouseEvent | TouchEvent | PointerEvent) {
  const edgeId = getEdgeId(ev);
  store.matrix.removeEdge(edgeId);
}

function onHoverStart(ev: MouseEvent) {
  const elem = getEdgeElem(ev);

  if (store.cursor.is(Store.Cursor.Type.REMOVE_EDGE)) {
    elem.dataset.state = "hover-remove";
  }
}

function onHoverEnd(ev: MouseEvent) {
  const elem = getEdgeElem(ev);

  elem.dataset.state = "";
}

export function Edge({
  id,
  x1,
  y1,
  x2,
  y2,
}: {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <motion.g
      key={id}
      id={id}
      className={twMerge("group/edge", "focus:outline-none")}
      onTap={onTap}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="stroke-16 stroke-red-500/0"
      />
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={twMerge(
          // Stroke
          "stroke-5",
          "stroke-neutral-300",

          "group-data-[state=hover-remove]/edge:stroke-red-400",

          "transition-all"
        )}
        variants={{}}
      />
    </motion.g>
  );
}
