"use client";

import { memo, useState, useEffect } from "react";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

import { Camera, Color, LayerType } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { useMutation, useSelf, useStorage } from "@/liveblocks.config";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

import { ColorPicker } from "./color-picker";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
  lastUsedColor: Color;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor, lastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((me) => me.presence.selection);
    const layers = useStorage((root) => root.layers);

    const [fontSizeInput, setFontSizeInput] = useState<string>("");

    useEffect(() => {
      if (selection.length === 1) {
        const layer = layers.get(selection[0]);
        if (
          layer &&
          ((layer as any).type === LayerType.Text ||
            (layer as any).type === LayerType.Note)
        ) {
          setFontSizeInput(String((layer as any).fontSize ?? 24));
        }
      }
    }, [selection, layers]);

    const setFontSize = useMutation(
      ({ storage }, size: number) => {
        const liveLayers = storage.get("layers");
        selection.forEach((id) => {
          const layer = liveLayers.get(id);
          if (!layer) return;
          const type = layer.get("type");
          if (type === LayerType.Text || type === LayerType.Note) {
            layer.update({ fontSize: size });
          }
        });
      },
      [selection]
    );

    const moveToFront = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
          liveLayerIds.move(
            indices[i],
            arr.length - 1 - (indices.length - 1 - i)
          );
        }
      },
      [selection]
    );

    const moveToBack = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = 0; i < indices.length; i++) {
          liveLayerIds.move(indices[i], i);
        }
      },
      [selection]
    );

    const setFill = useMutation(
      ({ storage }, fill: Color) => {
        const liveLayers = storage.get("layers");
        setLastUsedColor(fill);

        selection.forEach((id) => {
          liveLayers.get(id)?.set("fill", fill);
        });
      },
      [selection, setLastUsedColor]
    );

    const deleteLayers = useDeleteLayers();

    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) {
      return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    const commitFontSize = () => {
      const parsed = Number(fontSizeInput);
      if (!isNaN(parsed)) {
        const clamped = Math.min(200, Math.max(12, parsed));
        setFontSize(clamped);
        setFontSizeInput(String(clamped));
      } else {
        if (selection.length === 1) {
          const layer = layers.get(selection[0]);
          if (
            layer &&
            ((layer as any).type === LayerType.Text ||
              (layer as any).type === LayerType.Note)
          ) {
            setFontSizeInput(String((layer as any).fontSize ?? 24));
          }
        }
      }
    };

    return (
      <div
        className="absolute p-3 rounded-xl bg-white shadow-sm
      border flex select-none"
        style={{
          transform: `translate(
          calc(${x}px - 50%),
          calc(${y - 16}px - 100%)
        )`,
        }}
      >
        <ColorPicker onChange={setFill} lastUsedColor={lastUsedColor} />

        {selection.length === 1 &&
          (() => {
            const layer = layers.get(selection[0]);
            if (!layer) return null;
            if (
              (layer as any).type === LayerType.Text ||
              (layer as any).type === LayerType.Note
            ) {
              return (
                <Hint label="Font Size">
                  <div className="flex items-center">
                    <input
                      type="number"
                      min={12}
                      max={200}
                      value={fontSizeInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFontSizeInput(e.currentTarget.value);
                      }}
                      onBlur={() => {
                        commitFontSize();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          commitFontSize();
                          e.currentTarget.blur();
                        }
                      }}
                      onFocus={(e) => {
                        e.currentTarget.select();
                      }}
                      className="h-12 text-base text-center rounded border border-neutral-200 px-1"
                      style={{
                        width: `${fontSizeInput.length + 3}ch`,
                        minWidth: "6ch",
                        transition: "width 0.1s",
                      }}
                    />
                  </div>
                </Hint>
              );
            }
            return null;
          })()}

        {selection.length === 1 &&
          (() => {
            const layer = layers.get(selection[0]);
            if (!layer) return null;
            const type = (layer as any).type;
            if (type === LayerType.Text || type === LayerType.Note) {
              return <div className="border-l border-neutral-200 mx-2" />;
            }
            return null;
          })()}

        <div className="flex flex-col gap-y-0.5">
          <Hint label="Bring to front">
            <Button onClick={moveToFront} variant="board" size="icon">
              <BringToFront />
            </Button>
          </Hint>

          <Hint label="Send to back" side="bottom">
            <Button onClick={moveToBack} variant="board" size="icon">
              <SendToBack />
            </Button>
          </Hint>
        </div>

        <div
          className="flex items-center pl-2 ml-2 border-l
      border-neutral-200"
        >
          <Hint label="Delete">
            <Button variant="board" size="icon" onClick={deleteLayers}>
              <Trash2 />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
