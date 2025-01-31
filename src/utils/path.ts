type MoveTo = `M ${number} ${number}`;
type MoveToRel = `m ${number} ${number}`;

type LineTo = `L ${number} ${number}`;
type LineToRel = `l ${number} ${number}`;

type ArcTo = `A ${number} ${number} ${number} ${0 | 1} ${
  | 0
  | 1} ${number} ${number}`;

type CloseShape = `Z`;

type PathCommand = MoveTo | MoveToRel | LineTo | LineToRel | ArcTo | CloseShape;

export function path(...commands: PathCommand[]) {
  return commands.join(" ");
}
