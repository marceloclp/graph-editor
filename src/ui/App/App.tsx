"use client";

import { twMerge } from "tailwind-merge";
import { Canvas } from "~/ui/Canvas/Canvas";
import { CanvasGrid } from "../Canvas/CanvasGrid";
import { Store, store } from "~/store/Store";
import { Radial } from "../Radial/Radial";
import { Cursor } from "../Cursor/Cursor";
import { CanvasArea } from "../Canvas/CanvasArea";
import { Scrollbar } from "../Scrollbar/Scrollbar";
import { Navbar } from "../Navbar/Navbar";
import { CursorType } from "~/store/Cursor";
import { subscribeKey } from "valtio/utils";
import { addListener } from "~/utils/addListener";
import { VertexGrid } from "../Vertex/VertexGrid";

export function App() {
  return (
    <div
      ref={onMount}
      className={twMerge(
        // We use this to apply styles to the cursor based on the existence
        // of an impossible action (e.g., hovering over a vertex while in
        // EDGE_REMOVE mode).
        "group/app",

        "relative",
        "w-screen h-screen",
        "overflow-hidden",
        "bg-white",

        // Disable overscroll so we can pan using 2-fingers gesture:
        "overscroll-none",

        // We use our own cursor :)
        "cursor-none"
      )}
    >
      <Canvas>
        <CanvasGrid />
        <VertexGrid />
        <CanvasArea />
        <Radial />
        <Cursor />
      </Canvas>
      <Navbar />
      <Scrollbar />
    </div>
  );
}

function onInit() {
  // Initialize the store:
  store.isInitialized = true;

  // Center the canvas on the screen:
  store.canvas.center();

  return () => {
    store.isInitialized = false;
  };
}

function onWheel(ev: WheelEvent) {
  ev.preventDefault();

  // Panning is not allowed when the radial is active:
  if (store.radial.isActive) return;

  const screenX = ev.clientX;
  const screenY = ev.clientY;

  const deltaX = ev.deltaX;
  const deltaY = ev.deltaY;

  // 1. Track the panning position of the canvas:
  store.canvas.pan(deltaX, deltaY);

  const panX = store.canvas.panX;
  const panY = store.canvas.panY;

  // 2. Track the cursor position:
  store.cursor.move(screenX, screenY, panX, panY);
}

function onPointerMove(ev: PointerEvent | MouseEvent) {
  const deltaX = ev.movementX;
  const deltaY = ev.movementY;

  const screenX = ev.clientX;
  const screenY = ev.clientY;

  const panX = store.canvas.panX;
  const panY = store.canvas.panY;

  // Track the cursor position:
  store.cursor.move(screenX, screenY, panX, panY);

  const cursorX = store.cursor.canvasX;
  const cursorY = store.cursor.canvasY;

  if (store.radial.isActive) {
    // Rotate the radial:
    store.radial.rotate(cursorX, cursorY);
  }

  // Update the dragging vertex (if a vertex is being dragged):
  const draggingVertexId = store.matrix.draggingVertexId;
  if (draggingVertexId) {
    store.matrix.dragVertex(draggingVertexId, deltaX, deltaY);
  }

  // Update the dragging edge (if an edge is being dragged):
  const draggingEdgeId = store.matrix.draggingEdgeId;
  if (draggingEdgeId) {
    store.matrix.dragEdge(draggingEdgeId, deltaX, deltaY);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onPointerDown(ev: PointerEvent | MouseEvent) {
  if (store.radial.isActive) {
    // If the user presses down while the radial is active,
    // we auto-close the radial for better UX, since the user may not
    // know that he just needs to release the Meta key.
    store.radial.close();
  }

  // Add a vertex (if in VERTEX_ADD mode):
  const isAddingVertex = store.cursor.is(CursorType.VERTEX_ADD);
  if (isAddingVertex) {
    const point = store.cursor.getClosestGridPoint();
    if (point) store.matrix.createVertex(point.x, point.y);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onPointerUp(ev: PointerEvent | MouseEvent) {
  // Complete dragging a vertex:
  const draggingVertexId = store.matrix.draggingVertexId;
  if (draggingVertexId) {
    store.matrix.dragVertexEnd(draggingVertexId);
    store.matrix.draggingVertexId = undefined;
  }

  const draggingEdgeId = store.matrix.draggingEdgeId;
  if (draggingEdgeId) {
    store.matrix.dragEdgeEnd(draggingEdgeId);
    store.matrix.draggingEdgeId = undefined;
  }
}

function onKeyDown(ev: KeyboardEvent) {
  const cursorX = store.cursor.canvasX;
  const cursorY = store.cursor.canvasY;

  // Open the radial menu:
  if (Store.Radial.isPressingActivationKey(ev)) {
    store.radial.open(cursorX, cursorY);
  }
}

function onKeyUp(ev: KeyboardEvent) {
  if (!Store.Radial.isPressingActivationKey(ev)) {
    // Close the radial menu:
    store.radial.close();

    // Initiate the cursor mode:
    store.cursor.setType(store.radial.activeIndex);
  }

  if (Store.Cursor.isPressingCancelKey(ev)) {
    // Cancel the cursor mode:
    store.cursor.cancel();
  }
}

function onRadialActiveIndexChange() {
  return subscribeKey(store.radial, "activeIndex", () => {
    store.cursor.setType(store.radial.activeIndex);
  });
}

function onCursorTypeChange() {
  return subscribeKey(store.cursor, "type", () => {
    store.matrix.resetInteractions();
  });
}

function onMount() {
  const handlers = [
    onInit(),

    addListener("wheel", onWheel, { passive: false }),

    addListener("pointermove", onPointerMove),
    addListener("pointerdown", onPointerDown),
    addListener("pointerup", onPointerUp),

    addListener("keydown", onKeyDown),
    addListener("keyup", onKeyUp),

    onRadialActiveIndexChange(),
    onCursorTypeChange(),
  ];

  return () => {
    handlers.forEach((cb) => cb());
  };
}
