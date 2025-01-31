import { useMotionValue } from "motion/react";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { store } from "~/store/Store";
import { motion } from "framer-motion";
import { watch } from "valtio/utils";

export function Scrollbar() {
  const scrollX = useMotionValue("50%");
  const scrollY = useMotionValue("50%");

  useEffect(() => {
    return watch((get) => {
      scrollX.set(`${get(store).canvas.scrollX * 100}%`);
      scrollY.set(`${get(store).canvas.scrollY * 100}%`);
    });
  }, [scrollX, scrollY]);

  return (
    <div
      className={twMerge(
        "absolute",
        "pointer-events-none",
        "top-0 left-0",
        "h-screen",
        "w-screen"
        //
      )}
    >
      <motion.div
        style={{ y: scrollY }}
        className={twMerge(
          "absolute",
          "w-3",
          "top-2",
          "right-2",
          "h-[calc(100vh-200px-1rem)]"
        )}
      >
        <motion.div className="h-[200px] bg-neutral-400/25 rounded-full w-3" />
      </motion.div>
      <motion.div
        style={{ x: scrollX }}
        className={twMerge(
          "absolute",
          "h-3",
          "bottom-2",
          "left-2",
          "w-[calc(100vw-200px-1rem)]"
        )}
      >
        <motion.div className="w-[200px] bg-neutral-400/25 rounded-full h-3" />
      </motion.div>
    </div>
  );
}
