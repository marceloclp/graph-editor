import { useMotionValue } from "motion/react";
import { Fragment, useEffect } from "react";
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
    <Fragment>
      <motion.div
        style={{ y: scrollY }}
        className={twMerge(
          "absolute",
          "pointer-events-none",
          "top-0 bottom-96 right-0",
          "w-4",
          "flex flex-col"
        )}
      >
        <div className="h-96 w-full pt-2 pb-4 px-1">
          <div className="h-full w-full bg-neutral-400/40 rounded-full" />
        </div>
      </motion.div>

      <motion.div
        style={{ x: scrollX }}
        className={twMerge(
          "absolute",
          "pointer-events-none",
          "bottom-0 left-0 right-96",
          "h-4",
          "flex flex-col"
        )}
      >
        <div className="w-96 h-full py-1 pl-2 pr-4">
          <div className="h-full w-full bg-neutral-400/40 rounded-full" />
        </div>
      </motion.div>
    </Fragment>
  );
}
