import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useSnapshot } from "valtio";
import { Store, store } from "~/store/Store";

function getVertexElem(ev: MouseEvent | TouchEvent | PointerEvent) {
  const target = ev.target as Element;
  return target.closest("g")!;
}

function onTap(ev: MouseEvent | TouchEvent | PointerEvent) {
  const elem = getVertexElem(ev);

  if (store.isRemovingVertex) {
    return store.matrix.removeVertex(elem.id!);
  }

  if (store.isConnectingVertex && !store.matrix.connectingVertexId) {
    store.matrix.connectingVertexId = elem.id!;
    return;
  }

  if (store.isConnectingVertex && store.matrix.connectingVertexId) {
    const p1 = store.matrix.getVertex(store.matrix.connectingVertexId);
    const p2 = store.matrix.getVertex(elem.id!);
    store.matrix.createEdge(p1, p2);
    store.matrix.connectingVertexId = p2.id;
  }
}

function onHoverStart(ev: MouseEvent) {
  const elem = getVertexElem(ev);

  if (store.cursor.is(Store.Cursor.Type.REMOVE_POINT)) {
    elem.dataset.state = "hover-remove";
  } else if (store.cursor.is(Store.Cursor.Type.CONNECT_POINT)) {
    elem.dataset.state = "hover-connect";
  } else if (store.cursor.is(Store.Cursor.Type.ADD_POINT)) {
    elem.dataset.state = "hover-impossible";
  }
}

function onHoverEnd(ev: MouseEvent) {
  const elem = getVertexElem(ev);

  elem.dataset.state = "";
}

export function Vertex({ id, x, y }: { id: string; x: number; y: number }) {
  const {
    matrix: { connectingVertexId },
    cursor: { type },
  } = useSnapshot(store);

  const isHighlighted =
    type === Store.Cursor.Type.CONNECT_POINT && connectingVertexId === id;

  const variant = isHighlighted ? "highlighted" : "base";

  return (
    <motion.g
      id={id}
      key={id}
      layout
      className="group/point focus:outline-0 focus-visible:outline-0"
      style={{ x: x, y: y }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onTap={onTap}
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
          "fill-white",

          // Hovering to remove:
          "group-data-[state=hover-remove]/point:fill-red-300",
          "group-data-[state=hover-remove]/point:stroke-red-500",

          // Hovering to connect:
          "group-data-[state=hover-connect]/point:stroke-blue-300",

          "transition-colors",
          "focus-visible:outline-0"

          // Transition
          // "transition-all"
        )}
        animate={variant}
        variants={{
          base: {
            scale: 1,
            stroke: "var(--color-neutral-300)",
          },
          highlighted: {
            scale: 1.6,
            stroke: "var(--color-blue-300)",
          },
        }}
      />
    </motion.g>
  );
}

export function getVertexElemFromEvent(ev: Event | React.SyntheticEvent) {
  return (ev.target as Element).closest("g")!;
}

export function getVertexIdFromEvent(ev: Event | React.SyntheticEvent) {
  return getVertexElemFromEvent(ev).id!;
}

function onVertexDragDown(ev: React.PointerEvent) {
  if (!store.cursor.is(Store.Cursor.Type.VERTEX_MOVE)) return;

  // Skip if a vertex is somehow already being dragged:
  // (this should be an impossible state, but we never know lol)
  if (store.matrix.draggingVertexId) return;

  store.matrix.draggingVertexId = getVertexIdFromEvent(ev);
}

export function onVertexDragMove(ev: PointerEvent) {
  if (!store.cursor.is(Store.Cursor.Type.VERTEX_MOVE)) return;
  if (!store.matrix.draggingVertexId) return;

  const deltaX = ev.movementX;
  const deltaY = ev.movementY;

  store.matrix.getVertex(store.matrix.draggingVertexId).drag(deltaX, deltaY);
}

export function onVertexDragUp(ev: PointerEvent) {
  if (!store.cursor.is(Store.Cursor.Type.VERTEX_MOVE)) return;
  if (!store.matrix.draggingVertexId) return;

  store.matrix.dragVertex(store.matrix.draggingVertexId);
  store.matrix.draggingVertexId = undefined;
}
