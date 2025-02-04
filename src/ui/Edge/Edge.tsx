import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { watch } from "valtio/utils";
import { CursorType } from "~/store/Cursor";
import { Store, store } from "~/store/Store";
import { TapEvent } from "~/types/TapEvent";

enum Variant {
  IDLE = "IDLE",
  DISABLED = "DISABLED",

  REMOVE_HOVERING = "REMOVE_HOVERING",

  MOVE_HOVERING = "MOVE_HOVERING",
  MOVE_DRAGGING = "MOVE_DRAGGING",
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
  const [variant, setVariant] = useState<Variant>(Variant.IDLE);

  useEffect(() => {
    return watch((get) => {
      const type = get(store).cursor.type;
      const edge = get(store).matrix.edgesById[id];
      const hoveringId = get(store).matrix.hoveringEdgeId;
      const draggingId = get(store).matrix.draggingEdgeId;

      if (!edge) {
        return;
      }

      const isHovering = hoveringId === edge.id;
      const isDragging = draggingId === edge.id;

      const disableTypes = [
        Store.Cursor.Type.VERTEX_ADD,
        Store.Cursor.Type.EDGE_ADD,
        Store.Cursor.Type.VERTEX_REMOVE,
        Store.Cursor.Type.VERTEX_MOVE,
      ];

      if (!type) {
        return setVariant(Variant.IDLE);
      }

      //
      else if (disableTypes.includes(type)) {
        return setVariant(Variant.DISABLED);
      }

      //
      else if (type === Store.Cursor.Type.EDGE_REMOVE) {
        if (isHovering) return setVariant(Variant.REMOVE_HOVERING);
      }

      //
      else if (type === Store.Cursor.Type.EDGE_MOVE) {
        if (isHovering && !isDragging) {
          return setVariant(Variant.MOVE_HOVERING);
        } else if (isDragging) {
          return setVariant(Variant.MOVE_DRAGGING);
        }
      }

      return setVariant(Variant.IDLE);
    });
  }, [id]);

  return (
    <motion.g
      data-edge
      key={id}
      id={id}
      className={twMerge("group/edge", "focus:outline-none")}
      onTap={onEdgeTap}
      onHoverStart={onEdgeHoverStart}
      onHoverEnd={onEdgeHoverEnd}
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
          "stroke-5"
        )}
        animate={variant}
        variants={{
          [Variant.IDLE]: {
            stroke: "var(--color-neutral-300)",
          },
          [Variant.DISABLED]: {
            stroke: "var(--color-neutral-200)",
          },
          [Variant.REMOVE_HOVERING]: {
            stroke: "var(--color-red-400)",
          },
          [Variant.MOVE_HOVERING]: {
            stroke: "var(--color-orange-400)",
          },
          [Variant.MOVE_DRAGGING]: {
            stroke: "var(--color-orange-400)",
          },
        }}
      />
    </motion.g>
  );
}

function getEdgeIdFromEvent(ev: Event | React.SyntheticEvent) {
  return (ev.target as Element).closest("g")!.id!;
}

/**
 *
 */
function onEdgeHoverStart(ev: MouseEvent) {
  store.matrix.hoveringEdgeId = getEdgeIdFromEvent(ev);
}

/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onEdgeHoverEnd(ev: MouseEvent) {
  store.matrix.hoveringEdgeId = undefined;
}

/**
 *
 */
function onEdgeTap(ev: TapEvent) {
  const edgeId = getEdgeIdFromEvent(ev);

  // Handle tapping to remove the edge:
  if (store.cursor.is(CursorType.EDGE_REMOVE)) {
    store.matrix.removeEdge(edgeId);
  }
}

/**
 *
 */
function onEdgeDragDown(ev: React.PointerEvent) {
  if (!store.cursor.is(CursorType.EDGE_MOVE)) return;

  // Skip if an edge is somehow already being dragged:
  // (this should be an impossible state, but we never know lol)
  if (store.matrix.draggingEdgeId) return;

  store.matrix.draggingEdgeId = getEdgeIdFromEvent(ev);
}

/**
 * Should be attached to `window.document`.
 */
export function onEdgeDragMove(ev: PointerEvent) {
  if (!store.cursor.is(CursorType.EDGE_MOVE)) return;
  if (!store.matrix.draggingEdgeId) return;

  const deltaX = ev.movementX;
  const deltaY = ev.movementY;
  const edgeId = store.matrix.draggingEdgeId;

  store.matrix.dragEdge(edgeId, deltaX, deltaY);
}

/**
 * Should be attached to `window.document`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function onEdgeDragUp(ev: PointerEvent) {
  if (!store.cursor.is(CursorType.EDGE_MOVE)) return;
  if (!store.matrix.draggingEdgeId) return;

  store.matrix.dragEdgeEnd(store.matrix.draggingEdgeId);
  store.matrix.draggingEdgeId = undefined;
}
