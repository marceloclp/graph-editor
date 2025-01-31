import { useSnapshot } from "valtio/react";
import { store } from "~/store/Store";
import { AnimatePresence } from "motion/react";
import { Vertex } from "../Vertex/Vertex";
import { Edge } from "../Edge/Edge";

export function CanvasArea() {
  const {
    matrix: { points, edges },
  } = useSnapshot(store);

  return (
    <AnimatePresence>
      {Object.values(edges).map((edge) => (
        <Edge
          key={edge.id}
          id={edge.id}
          x1={edge.p1.canvasX}
          y1={edge.p1.canvasY}
          x2={edge.p2.canvasX}
          y2={edge.p2.canvasY}
        />
      ))}

      {Object.values(points).map((point) => (
        <Vertex
          key={point.id}
          id={point.id}
          x={point.canvasX}
          y={point.canvasY}
        />
      ))}
    </AnimatePresence>
  );
}
