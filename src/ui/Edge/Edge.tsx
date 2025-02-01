import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { Store, store } from "~/store/Store";

function getEdgeElem(ev: MouseEvent | TouchEvent | PointerEvent) {
  const target = ev.target as Element;
  return target.closest("g")!;
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
      onTap={onEdgeRemove}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onPointerDown={onEdgeDragDown}
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

/**
 * Returns the <g> element that contains the edge.
 */
export function getEdgeElemFromEvent(ev: Event | React.SyntheticEvent) {
  return (ev.target as Element).closest("g")!;
}

/**
 * Returns the id of the edge element from the event.
 */
export function getEdgeIdFromEvent(ev: Event | React.SyntheticEvent) {
  return getEdgeElemFromEvent(ev).id!;
}

function onEdgeRemove(ev: MouseEvent | TouchEvent | PointerEvent) {
  if (!store.cursor.is(Store.Cursor.Type.REMOVE_EDGE)) return;

  store.matrix.removeEdge(getEdgeIdFromEvent(ev));
}

function onEdgeDragDown(ev: React.PointerEvent) {
  if (!store.cursor.is(Store.Cursor.Type.EDGE_MOVE)) return;

  // Skip if an edge is somehow already being dragged:
  // (this should be an impossible state, but we never know lol)
  if (store.matrix.draggingEdgeId) return;

  store.matrix.draggingEdgeId = getEdgeIdFromEvent(ev);
}

export function onEdgeDragMove(ev: PointerEvent) {
  if (!store.cursor.is(Store.Cursor.Type.EDGE_MOVE)) return;
  if (!store.matrix.draggingEdgeId) return;

  const deltaX = ev.movementX;
  const deltaY = ev.movementY;

  const edge = store.matrix.getEdge(store.matrix.draggingEdgeId);
  store.matrix.getVertex(edge.p1Id).drag(deltaX, deltaY);
  store.matrix.getVertex(edge.p2Id).drag(deltaX, deltaY);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function onEdgeDragUp(ev: PointerEvent) {
  if (!store.cursor.is(Store.Cursor.Type.EDGE_MOVE)) return;
  if (!store.matrix.draggingEdgeId) return;

  store.matrix.dragEdge(store.matrix.draggingEdgeId);
  store.matrix.draggingEdgeId = undefined;
}
