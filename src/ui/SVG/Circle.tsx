import { twMerge } from "tailwind-merge";

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
