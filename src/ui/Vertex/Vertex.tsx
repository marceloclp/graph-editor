import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useSnapshot } from "valtio";
import { Store, store } from "~/store/Store";

function getVertexElem(ev: MouseEvent | TouchEvent | PointerEvent) {
  const target = ev.target as Element;
  return target.closest("g")!;
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
    matrix: { selectedPoint },
    cursor: { type },
  } = useSnapshot(store);

  const isHighlighted =
    type === Store.Cursor.Type.CONNECT_POINT && selectedPoint?.id === id;

  const variant = isHighlighted ? "highlighted" : "base";

  return (
    <motion.g
      id={id}
      key={id}
      layout
      className="group/point"
      style={{ x: x, y: y }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      drag
      whileDrag={{
        scale: 1.2,
      }}
      dragMomentum={false}
      onDragEnd={(ev, info) => {
        console.log("DRAG ENDED", info);
        const point = store.getCanvasPoint(info.point.x, info.point.y);
        const gridPoint = Store.Canvas.findClosestGridPoint(
          point.x,
          point.y,
          30
        );

        if (gridPoint) {
          // const p = store.matrix.getPoint(gridPoint.x, gridPoint.y)
          // console.log(p);
          // p.x = gridPoint.x;
          store.matrix.createPoint(gridPoint.x, gridPoint.y);
        }
      }}
      // onDrag={(ev, info) => {
      //   console.log(ev, info);
      // }}
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

          "transition-colors"

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
