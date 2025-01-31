import { MatrixEdge } from "./MatrixEdge";
import { MatrixPoint } from "./MatrixPoint";
import { Store } from "./Store";

export class Matrix {
  public readonly points: Record<string, MatrixPoint> = {};
  public readonly edges: Record<string, MatrixEdge> = {};

  private readonly adjMatrix: Record<string, Record<string, boolean>> = {};

  /**
   *
   */
  public selectedPoint?: MatrixPoint;

  getPoint(x: number, y: number): MatrixPoint | undefined {
    const id = MatrixPoint.createId(x, y);
    return this.points[id];
  }

  public findClosestMatrixPoint(x: number, y: number, threshold = 0) {
    const closestGridPoint = Store.Canvas.findClosestGridPoint(x, y, threshold);

    if (!closestGridPoint) {
      return undefined;
    }

    const id = MatrixPoint.createId(closestGridPoint.x, closestGridPoint.y);
    return this.points[id];
  }

  /**
   * When creating a point, we need to:
   *
   * 1. Verify that it doesn't already exist
   * 2. Add the point to the points map
   * 3. Initialize the adjacency matrix entry for this point
   */
  createPoint(x: number, y: number): MatrixPoint | undefined {
    const point = new MatrixPoint(x, y);

    if (point.id in this.points) {
      return undefined;
    }

    // Add the point to the points map:
    this.points[point.id] = point;

    // Initialize the adjacency matrix for this point:
    this.adjMatrix[point.id] ||= {};

    return point;
  }

  /**
   * When removing a point, we need to:
   *
   * 1. Remove all edges connecting to the point (recursively)
   * 2. Remove the adjacency matrix for this point
   * 3. Remove the point from the points map
   */
  removePoint(x: number, y: number): MatrixPoint | undefined {
    const id = MatrixPoint.createId(x, y);
    const point = this.points[id];

    if (point) {
      // First we delete all edges connected to this point:
      const edges = this.adjMatrix[id] || {};
      for (const edgeId in edges) {
        this.removeEdge(edgeId);
      }

      // Then we delete the adjacency matrix entry:
      delete this.adjMatrix[id];

      // Finally delete the point:
      delete this.points[id];
    }

    return point;
  }

  /**
   * When removing a vertex, we need to:
   *
   * 1. Remove all edges connected to the vertex
   * 2. Remove the adjacency matrix for this vertex
   * 3. Remove the vertex from the vertex lookup
   */
  removeVertex(vertexId: string): MatrixPoint | undefined {
    const vertex = this.points[vertexId];

    if (!vertex) {
      return undefined;
    }

    // Remove all edges connected to this vertex:
    const edges = this.adjMatrix[vertexId];
    for (const edgeId in edges) {
      this.removeEdge(edgeId);
    }

    // Remove the adjacency matrix entry:
    delete this.adjMatrix[vertexId];
    // Remove the vertex from the vertex lookup:
    delete this.points[vertexId];

    return vertex;
  }

  /**
   * When creating an edge, we need to:
   *
   * 1. Verify that it doesn't exist already
   * 2. Add the edge to the edges map
   * 3. Connect the points to the edge in the adjacency matrix
   */
  createEdge(p1: MatrixPoint, p2: MatrixPoint) {
    const edge = new MatrixEdge(p1, p2);

    if (this.edges[edge.id]) {
      // Edge already exists, so we skip creating it:
      return undefined;
    }

    // Add the edge to the edges map:
    this.edges[edge.id] = edge;

    // Connect the points to the adjacency matrix:
    this.adjMatrix[p1.id][edge.id] = true;
    this.adjMatrix[p2.id][edge.id] = true;

    return edge;
  }

  /**
   * When removing an edge, we need to:
   *
   * 1. Verify the edge exists
   * 2. Remove the edge from the adjacency matrix for its points
   * 3. Remove the edge from the edges map
   */
  removeEdge(edgeId: string): MatrixEdge | undefined {
    const edge = this.edges[edgeId];

    if (!edge) {
      return undefined;
    }

    // Remove the edge from the adjacency matrix for its points:
    delete this.adjMatrix[edge.p1.id][edgeId];
    delete this.adjMatrix[edge.p2.id][edgeId];

    // Remove the edge from the edges map:
    delete this.edges[edgeId];

    return edge;
  }

  onPointerDown(ev: PointerEvent, store: Store) {
    if (ev.metaKey) return;

    switch (store.cursor.type) {
      case Store.Cursor.Type.ADD_POINT:
        return this.onVertexCreate(ev, store);
      case Store.Cursor.Type.REMOVE_POINT:
        return this.onVertexRemove(ev, store);
      case Store.Cursor.Type.CONNECT_POINT:
        return this.onConnectPoint(ev, store);
    }
  }

  /**
   *
   */
  private onVertexCreate(ev: PointerEvent, store: Store) {
    const gridX = store.cursor.canvasX;
    const gridY = store.cursor.canvasY;

    const point = Store.Canvas.findClosestGridPoint(gridX, gridY, 10);

    if (!point) {
      // Assume the user wants to cancel the operation if clicking outside
      // of a valid grid point target:
      return store.cursor.setType(undefined);
    }

    this.createPoint(point.x, point.y);
  }

  /**
   *
   */
  private onVertexRemove(ev: PointerEvent, store: Store) {
    const gridX = store.cursor.canvasX;
    const gridY = store.cursor.canvasY;

    const point = this.findClosestMatrixPoint(gridX, gridY, 10);

    if (!point) {
      // Assume the user wants to cancel the operation if clicking outside
      // of a valid grid point target:
      return store.cursor.setType(undefined);
    }

    this.removeVertex(point.id);
  }

  /**
   * When connecting points to form an edge, we have three states:
   *
   * 1. No origin point selected yet
   * 2. An origin point is selected, and we are selecting the end point
   * 3. Both points are selected, so we create the edge.
   *
   * NOTE: If the user clicks outside of a valid matrix point, we assume
   * that the intent is to cancel the operation!
   */
  private onConnectPoint(ev: PointerEvent, store: Store) {
    const gridX = store.cursor.canvasX;
    const gridY = store.cursor.canvasY;

    const point = this.findClosestMatrixPoint(gridX, gridY, 10);

    if (!point) {
      // No point was clicked, we assume the user wants to cancel
      // the operation. First we reset the state:
      this.selectedPoint = undefined;
      store.cursor.setType(undefined);
      return;
    }

    if (!this.selectedPoint) {
      // No origin point is selected yet, so select the clicked point:
      this.selectedPoint = point;
    } else if (this.selectedPoint) {
      // An origin point is already selected, so we can create an edge
      // between the origin and the clicked point:
      this.createEdge(this.selectedPoint, point);

      // We then switch the origin point to be the clicked point so
      // the operation can continue:
      this.selectedPoint = point;
    }
  }

  public resetInteractive() {
    this.selectedPoint = undefined;
  }
}
