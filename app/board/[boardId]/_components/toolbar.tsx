"use client";

import {
  Circle,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";

import { useEffect } from "react";
import { useSelf } from "@/liveblocks.config";

import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState, LayerType} from "@/types/canvas";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) => {

  const selection = useSelf((me) => me.presence.selection);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing
      const isTypingTarget =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable);

      if (isTypingTarget) return;

      // Ignore modified shortcuts
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "a":
          setCanvasState({ mode: CanvasMode.None });
          break;

        case "t":
          setCanvasState({
            layerType: LayerType.Text,
            mode: CanvasMode.Inserting,
          });
          break;

        case "s":
          setCanvasState({
            layerType: LayerType.Note,
            mode: CanvasMode.Inserting,
          });
          break;

        case "r":
          setCanvasState({
            layerType: LayerType.Rectangle,
            mode: CanvasMode.Inserting,
          });
          break;

        case "e":
          setCanvasState({
            layerType: LayerType.Ellipse,
            mode: CanvasMode.Inserting,
          });
          break;

        case "p":
          setCanvasState({ mode: CanvasMode.Pencil });
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [setCanvasState]);


  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] left-2 
    flex flex-col gap-y-4"
    >
      <div
        className="bg-white rounded-md p-1.5 flex gap-y-1
      flex-col items-center shadow-md"
      >
        <ToolButton
          label="Select (A)"
          icon={MousePointer2}
          onClick={() => setCanvasState({ mode: CanvasMode.None })}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing || 
            canvasState.mode === CanvasMode.Resizing
          }
        />

        <ToolButton
          label="Text (T)"
          icon={Type}
          onClick={() => setCanvasState({ 
            mode: CanvasMode.Inserting,
            layerType: LayerType.Text,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Text
          }
        />

        <ToolButton
          label="Sticky note (S)"
          icon={StickyNote}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Note,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Note
          }
        />

        <ToolButton
          label="Rectangle (R)"
          icon={Square}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Rectangle,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Rectangle
          }
        />

        <ToolButton
          label="Ellipse (E)"
          icon={Circle}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Ellipse,
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Ellipse
          }
        />

        <ToolButton
          label="Pen (P)"
          icon={Pencil}
          onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
          isActive={canvasState.mode === CanvasMode.Pencil}
        />
      </div>

      <div
        className="bg-white rounded-md p-1.5 flex flex-col
      items-center shadow-md"
      >
        <ToolButton
          label="Undo (Ctrl + Z)"
          icon={Undo2}
          onClick={undo}
          isDisabled={!canUndo}
        />

        <ToolButton
          label="Redo (Ctrl + Shift + Z)"
          icon={Redo2}
          onClick={redo}
          isDisabled={!canRedo}
        />
      </div>
    </div>
  );
};

export const ToolbarSkeleton = () => {
  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] left-2 
    flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md
    rounded-md"
    />
  );
};
