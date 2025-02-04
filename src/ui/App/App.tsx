"use client";

import { twMerge } from "tailwind-merge";
import { Canvas } from "~/ui/Canvas/Canvas";
import { CanvasGrid } from "../Canvas/CanvasGrid";
import { onMount } from "~/store/Store";
import { Radial } from "../Radial/Radial";
import { Cursor } from "../Cursor/Cursor";
import { CanvasArea } from "../Canvas/CanvasArea";
import { Panel } from "../Panel/Panel";
import { Scrollbar } from "../Scrollbar/Scrollbar";

export function App() {
  return (
    <div
      data-app
      ref={onMount}
      className={twMerge(
        "group/app",
        //
        "relative",

        "w-screen h-screen",
        "overflow-hidden",

        "bg-white",

        // Disable overscroll so we can pan using 2-fingers gesture:
        "overscroll-none"
      )}
    >
      <Canvas>
        <CanvasGrid />
        <CanvasArea />
        <Radial />
        <Cursor />
      </Canvas>
      <Panel />
      <Scrollbar />
    </div>
  );
}
