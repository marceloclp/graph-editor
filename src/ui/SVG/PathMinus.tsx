import { twMerge } from "tailwind-merge";
import { path, transform } from "./svg-utils";

export function PathMinus({
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
        `M ${0} ${l / 2}`,
        `l ${l} ${0}`
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
