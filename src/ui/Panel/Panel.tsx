import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useSnapshot } from "valtio";
import { Store, store } from "~/store/Store";

export function Panel() {
  const {
    cursor: { type },
  } = useSnapshot(store);

  return (
    <AnimatePresence>
      {type === Store.Cursor.Type.INFO && (
        <motion.div
          className={twMerge(
            //
            "absolute",
            "top-12",
            "right-12",

            "bg-white",
            "w-[400px]",

            "border-3",
            "border-neutral-200",

            "rounded-2xl",
            "p-4"
          )}
          initial={{ x: 600, scaleX: 0.6, opacity: 0 }}
          animate={{ x: 0, scaleX: 1, opacity: 1 }}
          exit={{ x: 600 }}
        >
          adjlksadlsakd
        </motion.div>
      )}
    </AnimatePresence>
  );
}
