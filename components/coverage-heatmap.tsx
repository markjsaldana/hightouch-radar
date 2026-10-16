"use client";

import { useState } from "react";
import { competitorName, competitors, sources } from "@/lib/data";
import type { Source } from "@/lib/types";
import { useInView } from "@/lib/use-in-view";

// How often each competitor's sources are checked, as one ordinal ramp.
const levels: { id: Source["frequency"]; step: number }[] = [
  { id: "Monthly", step: 1 },
  { id: "Weekly", step: 2 },
  { id: "Daily", step: 3 },
  { id: "Continuous", step: 4 },
];
const rank = (f: Source["frequency"]) => levels.find((l) => l.id === f)!.step;

const rows = [...competitors.map((c) => c.id), "category"];
const columns = [...new Set(sources.map((s) => s.type))];

export function CoverageHeatmap() {
  const [ref, seen] = useInView<HTMLDivElement>(0.25);
  const [hover, setHover] = useState<{ row: string; col: string } | null>(null);

  // A row can have two sources of the same type; the cell shows the most frequent.
  const cell = (row: string, col: string) => {
    const matches = sources.filter((s) => s.competitorId === row && s.type === col);
    if (!matches.length) return null;
    return matches.reduce((a, b) => (rank(b.frequency) > rank(a.frequency) ? b : a));
  };
  const hovered = hover ? sources.filter((s) => s.competitorId === hover.row && s.type === hover.col) : [];

  return (
    <div ref={ref} className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-semibold">What gets checked, and how often</h3>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted" aria-label="Legend">
          {levels.map((l) => (
            <span key={l.id} className="inline-flex items-center gap-1.5">
              <span className="size-3 rounded-sm" style={{ background: `var(--seq-${l.step})` }} aria-hidden />
              {l.id}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <span className="size-3 rounded-sm border border-dashed border-line" aria-hidden />
            Not tracked
          </span>
        </div>
      </div>

      {/* relative: the cells' sr-only labels are absolutely positioned and must stay inside the scroll box. */}
      <div className="relative mt-4 overflow-x-auto pr-16">
        <table className="w-full min-w-[42rem] border-separate border-spacing-0.5 text-xs">
          <thead>
            <tr>
              <th className="w-36" />
              {columns.map((col) => (
                <th key={col} scope="col" className="relative h-24 font-normal text-muted">
                  {/* Tilted 45° so the labels read left to right, starting over their column. */}
                  <span className="absolute bottom-2 left-1/2 origin-bottom-left -rotate-45 text-left text-[12px] whitespace-nowrap">
                    {col}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row}>
                <th scope="row" className="pr-2 text-left font-medium whitespace-nowrap">
                  {row === "category" ? "Category & internal" : competitorName(row)}
                </th>
                {columns.map((col, c) => {
                  const s = cell(row, col);
                  const step = s ? rank(s.frequency) : 0;
                  const active = hover?.row === row && hover.col === col;
                  return (
                    <td key={col} className="p-0">
                      <span
                        onMouseEnter={() => s && setHover({ row, col })}
                        onMouseLeave={() => setHover(null)}
                        title={s ? `${s.frequency}: ${s.lookFor}` : "Not tracked"}
                        className={`block h-7 rounded-[4px] transition-[opacity,transform] duration-500 ${
                          s ? "" : "border border-dashed border-line"
                        } ${active ? "ring-2 ring-fg" : ""}`}
                        style={{
                          background: s ? `var(--seq-${step})` : undefined,
                          opacity: seen ? 1 : 0,
                          transform: seen ? "none" : "scale(0.6)",
                          transitionDelay: `${(r + c) * 35}ms`,
                        }}
                      >
                        <span className="sr-only">{s ? s.frequency : "Not tracked"}</span>
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 min-h-10 text-sm text-pretty text-muted" aria-live="polite">
        {hovered.length ? (
          <>
            <span className="font-medium text-fg">
              {hover!.row === "category" ? "Category & internal" : competitorName(hover!.row)} · {hover!.col}:
            </span>{" "}
            {hovered.map((s) => `${s.frequency.toLowerCase()}, looking for ${s.lookFor.toLowerCase()}`).join("; ")}.
          </>
        ) : (
          "Hover a square to see what the Radar looks for there."
        )}
      </p>
    </div>
  );
}
