import { MatrixEdge } from "./MatrixEdge";
import { MatrixPoint } from "./MatrixPoint";
import { Store } from "./Store";

type Lookup<T> = Record<string, T>;
type AdjMatrix = Record<string, Record<string, boolean>>;

export class Matrix {
  public readonly edgesById: Lookup<MatrixEdge> = {};
  public readonly verticesById: Lookup<MatrixPoint> = {};
  private readonly verticesByPosId: Lookup<MatrixPoint> = {};
  private readonly vertexIdToEdgeIds: AdjMatrix = {};
  private readonly vertexIdToVertexId: AdjMatrix = {};

  public connectingVertexId?: string;
  public draggingVertexId?: string;
  public hoveringVertexId?: string;
  public hoveringEdgeId?: string;
  public draggingEdgeId?: string;

  /**
   *
   */
  getVertex(id: string) {
    return this.verticesById[id];
  }

  getVertexAt(x: number, y: number) {
    return this.verticesByPosId[MatrixPoint.createPosId(x, y)];
  }

  /**
   *
   */
  createVertex(x: number, y: number): MatrixPoint | undefined {
    // 1. Verify that a vertex doesn't exist at this point yet:
    const posId = MatrixPoint.createPosId(x, y);

    if (posId in this.verticesByPosId) {
      return undefined;
    }

    // 2. Create the vertex:
    const vertex = new MatrixPoint(x, y);

    // 3. Add the vertex to the lookup tables:
    this.verticesById[vertex.id] = vertex;
    this.verticesByPosId[posId] = vertex;

    // Initialize the adjacency matrixes for this vertex:
    this.vertexIdToEdgeIds[vertex.id] = {};
    this.vertexIdToVertexId[vertex.id] = {};

    return vertex;
  }

  /**
   *
   */
  removeVertex(vertexId: string): MatrixPoint | undefined {
    // 1. Verify that the vertex exists:
    const vertex = this.verticesById[vertexId];

    if (!vertex) {
      return undefined;
    }

    // 2. Remove the vertex from the lookup tables:
    delete this.verticesById[vertex.id];
    delete this.verticesByPosId[vertex.posId];

    // 3. Remove any edges connected to the vertex:
    const edgeIds = Object.keys(this.vertexIdToEdgeIds[vertex.id]);
    for (const edgeId of edgeIds) {
      this.removeEdge(edgeId);
    }

    return vertex;
  }

  /**
   * Drags a vertex by a given (deltaX, deltaY) amount.
   */
  dragVertex(vertexId: string, deltaX: number, deltaY: number) {
    const vertex = this.getVertex(vertexId);

    if (!vertex) {
      return;
    }

    vertex.dragX += deltaX;
    vertex.dragY += deltaY;
  }

  /**
   * Completes the vertex drag.
   */
  dragVertexEnd(vertexId: string) {
    const vertex = this.getVertex(vertexId);

    if (!vertex) {
      return;
    }

    const prevPosId = vertex.posId;

    // We want to snap the vertex to the closest grid point:
    const { x, y } = Store.Canvas.findClosestGridPoint(
      vertex.canvasX + vertex.dragX,
      vertex.canvasY + vertex.dragY,
      // We use a slightly larger threshold to ensure we always get a point:
      Store.Canvas.Config.squareWidth + 10
    )!;

    vertex.canvasX = x;
    vertex.canvasY = y;
    vertex.dragX = 0;
    vertex.dragY = 0;

    if (prevPosId !== vertex.posId) {
      delete this.verticesByPosId[prevPosId];
      this.verticesByPosId[vertex.posId] = vertex;
    }
  }

  /**
   *
   */
  getEdge(id: string) {
    return this.edgesById[id];
  }

  /**
   *
   */
  createEdge(v1: MatrixPoint, v2: MatrixPoint): MatrixEdge | undefined {
    // 1. Verify that we are not trying to connect the same vertex to itself:
    if (v1.id === v2.id) {
      return undefined;
    }

    // 2. Verify that an edge between those two points doesn't exist yet:
    if (this.hasEdgeBetween(v1, v2)) {
      return undefined;
    }

    // 3. Create the edge:
    const edge = new MatrixEdge(v1.id, v2.id);

    // 4. Add the edge to the lookup table:
    this.edgesById[edge.id] = edge;

    // 5. Connect the two vertices in the adjacency matrix:
    this.vertexIdToVertexId[v1.id][v2.id] = true;
    this.vertexIdToVertexId[v2.id][v1.id] = true;

    // 6. Connect the vertices to the edge in the adjacency matrix:
    this.vertexIdToEdgeIds[v1.id][edge.id] = true;
    this.vertexIdToEdgeIds[v2.id][edge.id] = true;

    return edge;
  }

  /**
   *
   */
  removeEdge(edgeId: string): MatrixEdge | undefined {
    // 1. Verify that the edge exists:
    const edge = this.edgesById[edgeId];

    if (!edge) {
      return undefined;
    }

    // 2. Remove the edge from the lookup table:
    delete this.edgesById[edge.id];

    // 3. Disconnect the edge vertices from each other in the adjacency matrix:
    delete this.vertexIdToVertexId[edge.p1Id][edge.p2Id];
    delete this.vertexIdToVertexId[edge.p2Id][edge.p1Id];

    // 4. Disconnect the vertices from the edge in the adjacency matrix:
    delete this.vertexIdToEdgeIds[edge.p1Id][edge.id];
    delete this.vertexIdToEdgeIds[edge.p2Id][edge.id];

    return edge;
  }

  /**
   * Drags an edge by a given (deltaX, deltaY).
   * Dragging an edge consists of dragging both of its vertices.
   */
  dragEdge(edgeId: string, deltaX: number, deltaY: number) {
    const edge = this.getEdge(edgeId);

    if (!edge) {
      return;
    }

    this.getVertex(edge.p1Id).drag(deltaX, deltaY);
    this.getVertex(edge.p2Id).drag(deltaX, deltaY);
  }

  /**
   * Completes the edge drag.
   */
  dragEdgeEnd(edgeId: string) {
    const edge = this.getEdge(edgeId);

    if (!edge) {
      return;
    }

    this.dragVertexEnd(edge.p1Id);
    this.dragVertexEnd(edge.p2Id);
  }

  private hasEdgeBetween(v1: MatrixPoint, v2: MatrixPoint) {
    return this.vertexIdToVertexId[v1.id][v2.id];
  }

  public resetInteractive() {
    if (this.connectingVertexId) {
      this.connectingVertexId = undefined;
    }
  }
}
