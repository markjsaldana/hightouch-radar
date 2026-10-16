"use client";

import { useState } from "react";
import { matrix } from "@/lib/data";

const { xAxis, yAxis, points } = matrix.positioning;

export function PositioningMap() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
      <figure>
        <div className="relative aspect-square w-full rounded-xl border border-line bg-surface">
          {/* Quadrant lines */}
          <div className="absolute inset-y-6 left-1/2 border-l border-dashed border-line" aria-hidden />
          <div className="absolute inset-x-6 top-1/2 border-t border-dashed border-line" aria-hidden />

          {/* Axis end labels */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-medium text-muted">{yAxis.high} ↑</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-muted">↓ {yAxis.low}</span>
          <span className="absolute top-1/2 left-2 -translate-y-1/2 text-xs font-medium text-muted [writing-mode:vertical-rl] rotate-180">
            ← {xAxis.low}
          </span>
          <span className="absolute top-1/2 right-2 -translate-y-1/2 text-xs font-medium text-muted [writing-mode:vertical-rl]">
            {xAxis.high} →
          </span>

          {/* Plot area, inset so dots and labels stay off the axis labels */}
          <div className="absolute inset-8">
            {points.map((p) => {
              const ours = p.id === "hightouch";
              const side = p.label ?? (p.x > 65 ? "left" : "right");
              const isActive = active === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onMouseEnter={() => setActive(p.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(p.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(isActive ? null : p.id)}
                  aria-label={`${p.name}: ${p.note}`}
                  // Each variant puts the 24px dot target's center on the point.
                  className={`group absolute flex items-center ${
                    side === "top"
                      ? "-translate-x-1/2 -translate-y-[calc(100%-12px)] flex-col-reverse"
                      : side === "left"
                        ? "-translate-x-[calc(100%-12px)] -translate-y-1/2 flex-row-reverse gap-1.5"
                        : "-translate-x-3 -translate-y-1/2 gap-1.5"
                  }`}
                  style={{ left: `${p.x}%`, top: `${100 - p.y}%` }}
                >
                  <span className="grid size-6 shrink-0 place-items-center" aria-hidden>
                    <span
                      className={`rounded-full ring-2 ring-surface transition-transform ${
                        ours ? "size-3.5 bg-accent" : "size-3 bg-muted"
                      } ${isActive ? "scale-125" : ""}`}
                    />
                  </span>
                  <span
                    className={`rounded px-1 text-xs whitespace-nowrap sm:text-sm ${
                      ours ? "font-semibold text-accent" : "text-fg"
                    } ${isActive ? "bg-surface-2" : ""}`}
                  >
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <figcaption className="mt-2 text-xs text-muted">
          A point of view, not measured data. Hover or tap a dot for the reasoning.
        </figcaption>
      </figure>

      <div>
        <h3 className="text-sm font-semibold">Why each one sits where it does</h3>
        <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface text-sm">
          {points.map((p) => (
            <li
              key={p.id}
              className={`flex gap-3 px-4 py-3 transition-colors ${active === p.id ? "bg-accent-soft" : ""}`}
            >
              <span
                className={`mt-1.5 size-2.5 shrink-0 rounded-full ${p.id === "hightouch" ? "bg-accent" : "bg-muted"}`}
                aria-hidden
              />
              <span>
                <span className="font-medium">{p.name}</span>{" "}
                <span className="text-muted">· {p.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
