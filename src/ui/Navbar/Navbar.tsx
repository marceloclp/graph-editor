import { twMerge } from "tailwind-merge";
import { useSnapshot } from "valtio";
import { Store, store } from "~/store/Store";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment } from "react";

export function Navbar() {
  const snap = useSnapshot(store);
  const isInitialized = snap.isInitialized;
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
        {isInitialized && (
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
              cmd="Hold CMD"
              className="rounded-tr-md rounded-br-md"
            >
              Radial
            </Item>
            <Item
              isActive={false}
              cmd={cursorType ? "Esc to cancel" : undefined}
              className="rounded-tl-md rounded-bl-md"
            >
              {"Action: "}
              {!snap.cursor.type && "none"}
              {snap.cursor.type && (
                <span className="text-blue-500/90">
                  {Store.Radial.Config.actions[snap.radial.activeIndex].name}
                </span>
              )}
            </Item>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Item({
  className,
  children,
  isActive,
  cmd,
}: {
  className?: string;
  children?: React.ReactNode;
  isActive?: boolean;
  cmd?: string;
}) {
  return (
    <motion.div
      className={twMerge(
        "flex items-center gap-2",

        "px-3 py-1.5",
        "rounded-2xl",

        "bg-neutral-100",

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
      <span>{children}</span>
      {cmd && (
        <Fragment>
          <span>|</span>
          <span className="opacity-80">{cmd}</span>
        </Fragment>
      )}
    </motion.div>
  );
}
