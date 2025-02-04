import { twMerge } from "tailwind-merge";
import { drawPlus, transform } from "~/utils/svg";

export function Circle({
  className,
  r = 16,
  cx = 0,
  cy = 0,
  dashed = 0,
}: {
  className?: string;
  r?: number;
  cx?: number;
  cy?: number;
  /**
   * The number of stroke dash segments.
   * Segments will be equal in length and distance.
   */
  dashed?: number;
}) {
  return (
    <circle
      r={r}
      cx={cx}
      cy={cy}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={`${(Math.PI * r) / dashed} ${(Math.PI * r) / dashed}`}
      className={twMerge(
        "fill-white",
        "stroke-3",
        "stroke-neutral-300",
        //
        className
      )}
    />
  );
}

export function PathX({
  className,
  deg = 45,
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
      d={drawPlus(l, 0, 0)}
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
