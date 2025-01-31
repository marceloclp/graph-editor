import { useMotionValue, motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useSnapshot } from "valtio/react";
import { watch } from "valtio/utils";
import { Store, store } from "~/store/Store";
import { CursorAddPoint } from "./CursorAddPoint";
import { CursorRemovePoint } from "./CursorRemovePoint";
import { CursorConnectPoint } from "./CursorConnectPoint";
import { CursorEdgeRemove } from "./CursorEdgeRemove";
import { CursorVertexMove } from "./CursorVertexMove";

export function Cursor() {
  const {
    cursor: { isActive, type },
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
    <AnimatePresence>
      {isActive && (
        <motion.g
          data-cursor
          style={{
            x: x,
            y: y,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={twMerge(
            //
            "pointer-events-none",

            "bg-yellow-500/20"
          )}
        >
          {type === Store.Cursor.Type.ADD_POINT && <CursorAddPoint />}
          {type === Store.Cursor.Type.REMOVE_POINT && <CursorRemovePoint />}
          {type === Store.Cursor.Type.CONNECT_POINT && <CursorConnectPoint />}
          {type === Store.Cursor.Type.REMOVE_EDGE && <CursorEdgeRemove />}
          {type === Store.Cursor.Type.VERTEX_MOVE && <CursorVertexMove />}
        </motion.g>
      )}
    </AnimatePresence>
  );
}
