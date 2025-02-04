import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { watch } from "valtio/utils";
import { CursorType } from "~/store/Cursor";
import { Store, store } from "~/store/Store";
import { TapEvent } from "~/types/TapEvent";

enum Variant {
  IDLE = "IDLE",
  DISABLED = "DISABLED",
  IMPOSSIBLE = "IMPOSSIBLE",

  // /**
  //  * When adding a new vertex, clicking on top of an existing vertex
  //  * should not be allowed.
  //  */
  // ADD_HOVERING = "ADD_HOVERING",

  REMOVE_HOVERING = "REMOVE_HOVERING",

  CONNECT_HOVER_START = "CONNECT_HOVER_START",
  CONNECT_SELECTED_START = "CONNECT_SELECTED_START",
  CONNECT_HOVER_END = "CONNECT_HOVER_END",

  MOVE_HOVERING = "MOVE_HOVERING",
  MOVE_DRAGGING = "MOVE_DRAGGING",
}

export function Vertex({ id, x, y }: { id: string; x: number; y: number }) {
  const [variant, setVariant] = useState<Variant>(Variant.IDLE);

  useEffect(() => {
    return watch((get) => {
      const type = get(store).cursor.type;
      const vertex = get(store).matrix.verticesById[id];
      const connectingId = get(store).matrix.connectingVertexId;
      const hoveringId = get(store).matrix.hoveringVertexId;
      const draggingId = get(store).matrix.draggingVertexId;

      if (!vertex) {
        return;
      }

      const isHovering = hoveringId === vertex.id;
      const isConnecting = connectingId === vertex.id;
      const isDragging = draggingId === vertex.id;

      if (type === Store.Cursor.Type.EDGE_ADD) {
        if (isHovering && !connectingId) {
          return setVariant(Variant.CONNECT_HOVER_START);
        } else if (isConnecting) {
          return setVariant(Variant.CONNECT_SELECTED_START);
        } else if (isHovering && !isConnecting) {
          return setVariant(Variant.CONNECT_HOVER_END);
        } else {
          return setVariant(Variant.IDLE);
        }
      }

      //
      else if (type === Store.Cursor.Type.VERTEX_REMOVE) {
        if (isHovering) return setVariant(Variant.REMOVE_HOVERING);
      }

      //
      else if (type === Store.Cursor.Type.EDGE_MOVE) {
        return setVariant(Variant.DISABLED);
      } else if (type === Store.Cursor.Type.EDGE_REMOVE) {
        return setVariant(Variant.DISABLED);
      }

      //
      else if (type === Store.Cursor.Type.VERTEX_MOVE) {
        if (isHovering && !isDragging) {
          return setVariant(Variant.MOVE_HOVERING);
        } else if (isDragging) {
          return setVariant(Variant.MOVE_DRAGGING);
        }
      }

      //
      else if (type === CursorType.VERTEX_ADD && isHovering) {
        return setVariant(Variant.IMPOSSIBLE);
      }

      return setVariant(Variant.IDLE);
    });
  }, [id]);

  return (
    <motion.g
      data-vertex
      data-impossible={variant === Variant.IMPOSSIBLE}
      id={id}
      key={id}
      layout
      className="group/point focus:outline-0 focus-visible:outline-0"
      style={{ x: x, y: y }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      onHoverStart={onVertexHoverStart}
      onHoverEnd={onVertexHoverEnd}
      onTap={onVertexTap}
      onPointerDown={onVertexDragDown}
    >
      <motion.circle
        cx={0}
        cy={0}
        r={10}
        className={twMerge(
          // Stroke
          "stroke-4",

          // Fill
          "fill-white"
        )}
        animate={variant}
        variants={{
          [Variant.IDLE]: {
            scale: 1,
            stroke: "var(--color-neutral-300)",
          },
          [Variant.IMPOSSIBLE]: {
            scale: 1,
            stroke: "var(--color-red-300)",
          },
          [Variant.CONNECT_HOVER_START]: {
            scale: 1.25,
            stroke: "var(--color-neutral-400)",
          },
          [Variant.CONNECT_SELECTED_START]: {
            scale: 1.25,
            stroke: "var(--color-emerald-400)",
          },
          [Variant.CONNECT_HOVER_END]: {
            scale: 1.25,
            stroke: "var(--color-emerald-400)",
          },
          [Variant.DISABLED]: {
            scale: 1,
            stroke: "var(--color-neutral-200)",
          },
          [Variant.REMOVE_HOVERING]: {
            scale: 1.25,
            stroke: "var(--color-red-400)",
          },
          [Variant.MOVE_HOVERING]: {
            scale: 1.25,
            stroke: "var(--color-orange-400)",
          },
          [Variant.MOVE_DRAGGING]: {
            scale: 1,
            stroke: "var(--color-orange-400)",
          },
        }}
      />
    </motion.g>
  );
}

function getVertexIdFromEvent(ev: Event | React.SyntheticEvent) {
  return (ev.target as Element).closest("g")!.id!;
}

/**
 *
 */
function onVertexHoverStart(ev: MouseEvent) {
  store.matrix.hoveringVertexId = getVertexIdFromEvent(ev);
}

/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onVertexHoverEnd(ev: MouseEvent) {
  store.matrix.hoveringVertexId = undefined;
}

/**
 *
 */
function onVertexTap(ev: TapEvent) {
  const vertexId = getVertexIdFromEvent(ev);

  // Handle tapping to remove the vertex:
  if (store.cursor.is(CursorType.VERTEX_REMOVE)) {
    store.matrix.removeVertex(vertexId);
  }

  // Handle tapping to connect two vertices:
  else if (store.cursor.is(CursorType.EDGE_ADD)) {
    const originId = store.matrix.connectingVertexId;
    if (!originId) {
      // We are selecting the origin (first) vertex:
      store.matrix.connectingVertexId = vertexId;
    } else if (originId && originId !== vertexId) {
      // We are selecting the destination (second) vertex:
      const p1 = store.matrix.getVertex(originId);
      const p2 = store.matrix.getVertex(vertexId);
      if (!p1 || !p2) return;
      store.matrix.createEdge(p1, p2);
      store.matrix.connectingVertexId = p2.id;
    }
  }
}

/**
 *
 */
function onVertexDragDown(ev: React.PointerEvent) {
  if (!store.cursor.is(CursorType.VERTEX_MOVE)) return;

  // Skip if a vertex is somehow already being dragged:
  // (this should be an impossible state, but we never know lol)
  if (store.matrix.draggingVertexId) return;

  store.matrix.draggingVertexId = getVertexIdFromEvent(ev);
}

/**
 * Should be attached to `window.document`.
 */
export function onVertexDragMove(ev: PointerEvent) {
  if (!store.cursor.is(CursorType.VERTEX_MOVE)) return;
  if (!store.matrix.draggingVertexId) return;

  const deltaX = ev.movementX;
  const deltaY = ev.movementY;
  const vertexId = store.matrix.draggingVertexId;

  store.matrix.dragVertex(vertexId, deltaX, deltaY);
}

/**
 * Should be attached to `window.document`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function onVertexDragUp(ev: PointerEvent) {
  if (!store.cursor.is(Store.Cursor.Type.VERTEX_MOVE)) return;
  if (!store.matrix.draggingVertexId) return;

  store.matrix.dragVertexEnd(store.matrix.draggingVertexId);
  store.matrix.draggingVertexId = undefined;
}
