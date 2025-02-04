import { twMerge } from "tailwind-merge";
import { path, transform } from "./svg-utils";

export function PathArrow({
  className,
  deg = 0,
  l = 16,
  dx = 0,
  dy = 0,
}: {
  className?: string;
  deg?: number;
  l?: number;
  dx?: number;
  dy?: number;
}) {
  return (
    <path
      transform={transform(dx, dy, deg)}
      d={path(
        //
        `M ${0} ${0}`,
        `l ${l} ${l}`,
        `l ${-l} ${0}`,
        `m ${l} ${0}`,
        `l ${0} ${-l}`
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
