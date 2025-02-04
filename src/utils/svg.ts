import { path } from "./path";

export function drawPlus(size: number, dx: number = 0, dy: number = 0) {
  return path(
    `M ${size / 2 + dx} ${dy}`,
    // Vertical line:
    `l 0 ${size}`,
    `M ${dx} ${size / 2 + dy}`,
    `l ${size} 0`
  );
}

export function transform(x?: number, y?: number, deg?: number) {
  return [
    typeof x === "number" && typeof y === "number" && `translate(${x}, ${y})`,
    typeof deg === "number" && `rotate(${deg})`,
  ]
    .filter(Boolean)
    .join(" ");
}
