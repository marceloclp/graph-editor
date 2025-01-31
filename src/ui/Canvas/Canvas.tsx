import { useMotionValue, motion, AnimatePresence } from "motion/react";
import { ReactNode, useEffect } from "react";
import { subscribe } from "valtio";
import { useSnapshot } from "valtio/react";
import { watch } from "valtio/utils";
import { Store, store } from "~/store/Store";

const { canvasHeight: cH, canvasWidth: cW } = Store.Canvas.Config;

export function Canvas({ children }: { children?: ReactNode }) {
  const { isMounted } = useSnapshot(store);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  useEffect(() => {
    return watch((get) => {
      const x = get(store).canvas.panX;
      const y = get(store).canvas.panY;
      panX.set(x);
      panY.set(y);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {isMounted && (
        <motion.svg
          style={{ width: cW, height: cH }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.g style={{ x: panX, y: panY, originX: 0, originY: 0 }}>
            {children}
          </motion.g>
        </motion.svg>
      )}
    </AnimatePresence>
  );
}
