import { twMerge } from "tailwind-merge";
import { path } from "./svg-utils";

export function PathPlus({
  className,
  l = 16,
  dx = 0,
  dy = 0,
}: {
  className?: string;
  l?: number;
  dx?: number;
  dy?: number;
}) {
  return (
    <path
      d={path(
        `M ${l / 2 + dx} ${dy}`,
        // Vertical line:
        `l 0 ${l}`,
        `M ${dx} ${l / 2 + dy}`,
        // Horizontal line:
        `l ${l} 0`
      )}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={twMerge(
        "fill-white",
        "stroke-3",
        "stroke-neutral-300",
        className
      )}
    />
  );
}
