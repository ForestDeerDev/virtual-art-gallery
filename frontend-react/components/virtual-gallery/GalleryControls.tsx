"use client";

import { Keyboard, Mouse, MousePointerClick, Orbit, RotateCcw, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryControlState } from "@/types";

interface GalleryControlsProps {
  controls: GalleryControlState;
  onMoveSpeedChange: (value: number) => void;
  onMouseSensitivityChange: (value: number) => void;
  onReset: () => void;
  onToggleRotate: () => void;
}

export function GalleryControls({
  controls,
  onMoveSpeedChange,
  onMouseSensitivityChange,
  onReset,
  onToggleRotate,
}: GalleryControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-20 w-60 rounded-xl border border-white/10 bg-black/70 p-5 text-white shadow-lg backdrop-blur-md">
      <h2 className="mb-4 text-sm font-semibold tracking-wide text-amber-400">
        控制面板
      </h2>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-white/80">
          <span>移动速度</span>
          <span className="text-white/50">{controls.moveSpeed.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min={0.1}
          max={2}
          step={0.1}
          value={controls.moveSpeed}
          onChange={(event) =>
            onMoveSpeedChange(Number(event.target.value))
          }
          className="h-1.5 w-full cursor-pointer accent-amber-400"
          aria-label="移动速度"
        />
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-white/80">
          <span>鼠标灵敏度</span>
          <span className="text-white/50">
            {controls.mouseSensitivity.toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.1}
          value={controls.mouseSensitivity}
          onChange={(event) =>
            onMouseSensitivityChange(Number(event.target.value))
          }
          className="h-1.5 w-full cursor-pointer accent-amber-400"
          aria-label="鼠标灵敏度"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 px-2 py-1.5 text-xs text-white/85 transition-colors hover:border-amber-400/60 hover:text-amber-300"
        >
          <RotateCcw className="size-3.5" />
          重置视角
        </button>
        <button
          type="button"
          onClick={onToggleRotate}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs transition-colors",
            controls.autoRotate
              ? "border-amber-400/70 bg-amber-400/15 text-amber-300"
              : "border-white/15 text-white/85 hover:border-amber-400/60 hover:text-amber-300",
          )}
        >
          <Orbit className="size-3.5" />
          {controls.autoRotate ? "停止旋转" : "自动旋转"}
        </button>
      </div>

      <div className="mt-4 border-t border-white/10 pt-3">
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-amber-400">
          操作说明
        </h3>
        <ul className="space-y-1.5 text-xs text-white/60">
          <li className="flex items-center gap-2">
            <Mouse className="size-3.5 shrink-0" />
            鼠标移动：旋转视角
          </li>
          <li className="flex items-center gap-2">
            <Keyboard className="size-3.5 shrink-0" />
            W/A/S/D：前后左右移动
          </li>
          <li className="flex items-center gap-2">
            <ArrowUpDown className="size-3.5 shrink-0" />
            空格/Shift：上升/下降
          </li>
          <li className="flex items-center gap-2">
            <MousePointerClick className="size-3.5 shrink-0" />
            点击画框：查看详情
          </li>
        </ul>
      </div>
    </div>
  );
}
