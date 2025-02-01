import { useSnapshot } from "valtio/react";
import { store } from "~/store/Store";
import { AnimatePresence } from "motion/react";
import { Vertex } from "../Vertex/Vertex";
import { Edge } from "../Edge/Edge";

export function CanvasArea() {
  const {
    matrix: { edgesById, verticesById },
  } = useSnapshot(store);

  return (
    <AnimatePresence>
      {Object.values(edgesById).map((edge) => (
        <Edge
          key={edge.id}
          id={edge.id}
          x1={verticesById[edge.p1Id].canvasX + verticesById[edge.p1Id].dragX}
          y1={verticesById[edge.p1Id].canvasY + verticesById[edge.p1Id].dragY}
          x2={verticesById[edge.p2Id].canvasX + verticesById[edge.p2Id].dragX}
          y2={verticesById[edge.p2Id].canvasY + verticesById[edge.p2Id].dragY}
        />
      ))}

      {Object.values(verticesById).map((point) => (
        <Vertex
          key={point.id}
          id={point.id}
          x={point.canvasX + point.dragX}
          y={point.canvasY + point.dragY}
        />
      ))}
    </AnimatePresence>
  );
}
