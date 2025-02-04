import { twMerge } from "tailwind-merge";
import { useSnapshot } from "valtio";
import { store } from "~/store/Store";
import { AnimatePresence, motion } from "framer-motion";
import { CursorType } from "~/store/Cursor";
import { Fragment } from "react";

export function Navbar() {
  const snap = useSnapshot(store);
  const isMounted = snap.isMounted;
  const isActive = snap.radial.isActive;
  const cursorType = snap.cursor.type;

  return (
    <div
      className={twMerge(
        "absolute",
        "pointer-events-none",
        "top-0 left-0",
        "w-screen",
        "p-4",
        "flex items-center justify-center gap-2"
      )}
    >
      <AnimatePresence>
        {isMounted && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className={twMerge(
              "flex items-center justify-center gap-1",

              "py-1 px-1 w-fit",

              "bg-white",
              "border-[2.5px]",
              "border-neutral-300",
              "rounded-full",

              "text-sm",
              "text-neutral-400",
              "font-mono",
              "font-semibold",
              "uppercase"
            )}
          >
            <Item
              isActive={isActive}
              name="Radial"
              cmd="Cmd + Click"
              className="rounded-tr-md rounded-br-md"
            />
            <Item
              isActive={false}
              name={
                cursorType
                  ? {
                      [CursorType.VERTEX_ADD]: "Action: Add Vertex",
                      [CursorType.VERTEX_REMOVE]: "Action: Remove Vertex",
                      [CursorType.VERTEX_MOVE]: "Action: Move Vertex",
                      [CursorType.EDGE_ADD]: "Action: Add Edge",
                      [CursorType.EDGE_REMOVE]: "Action: Remove Edge",
                      [CursorType.EDGE_MOVE]: "Action: Move Edge",
                    }[cursorType]
                  : "Action: None"
              }
              cmd={cursorType ? "Esc to cancel" : undefined}
              className="rounded-tl-md rounded-bl-md"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Item({
  className,
  isActive,
  name,
  cmd,
}: {
  className?: string;
  isActive?: boolean;
  name: string;
  cmd?: string;
}) {
  return (
    <motion.div
      className={twMerge(
        "bg-neutral-100 px-3 py-1.5 flex items-center gap-2",
        "rounded-tl-2xl",
        "rounded-bl-2xl",
        "rounded-tr-2xl",
        "rounded-br-2xl",
        // "rounded-tl-full",

        className
      )}
    >
      <div
        className={twMerge(
          "size-3",
          "rounded-sm",
          "bg-white",
          "border-2",
          isActive ? "border-blue-400" : "border-neutral-400/80",

          "flex items-center justify-center",
          "p-px",

          "transition-all",
          "duration-150"
        )}
      >
        <div
          className={twMerge(
            "size-full",
            "rounded-sm",
            isActive ? "bg-blue-400" : "bg-neutral-200",
            "transition-all",
            "duration-150"
          )}
        />
      </div>
      <span>{name}</span>
      {cmd && (
        <Fragment>
          <span>|</span>
          <span className="opacity-80">{cmd}</span>
        </Fragment>
      )}
    </motion.div>
  );
}
