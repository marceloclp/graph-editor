type MoveTo = `M ${number} ${number}`;
type MoveToRel = `m ${number} ${number}`;

type LineTo = `L ${number} ${number}`;
type LineToRel = `l ${number} ${number}`;

type ArcTo = `A ${number} ${number} ${number} ${0 | 1} ${
  | 0
  | 1} ${number} ${number}`;

type CloseShape = `Z`;

type PathCommand = MoveTo | MoveToRel | LineTo | LineToRel | ArcTo | CloseShape;

/**
 * Typed utily for building the `d` property of an SVG <path> element.
 */
export function path(...commands: PathCommand[]) {
  return commands.join(" ");
}

/**
 * Typed utility for building the `transform` property of an SVG element.
 */
export function transform(x?: number, y?: number, deg?: number) {
  const isX = typeof x !== "undefined";
  const isY = typeof y !== "undefined";
  const isDeg = typeof deg !== "undefined";

  return [
    isX && isY && `translate(${x}, ${y})`,
    isX && !isY && `translateX(${x})`,
    !isX && isY && `translateY(${y})`,
    isDeg && `rotate(${deg})`,
  ]
    .filter(Boolean)
    .join(" ");
}
