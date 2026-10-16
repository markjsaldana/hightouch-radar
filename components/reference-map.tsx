"use client";

import { useState } from "react";
import type { Customer, Region } from "@/lib/types";
import { useInView } from "@/lib/use-in-view";
import { worldDots } from "@/lib/world-dots";

const GRID = 6;
const { step, lat0, lon0, rows } = worldDots;
const width = rows[0].length * GRID;
const height = rows.length * GRID;
const project = ([lon, lat]: [number, number]) => [((lon - lon0) / step) * GRID + GRID / 2, ((lat0 - lat) / step) * GRID + GRID / 2];

// Land dots drawn once; they never change.
const land = rows.flatMap((row, r) =>
  [...row].flatMap((c, i) => (c === "1" ? [[i * GRID + GRID / 2, r * GRID + GRID / 2]] : [])),
);

const regions: Region[] = ["North America", "EMEA", "APAC", "LATAM"];

export function ReferenceMap({
  customers,
  visible,
  region,
  onRegion,
}: {
  customers: Customer[];
  visible: Set<string>;
  region: string;
  onRegion: (region: string) => void;
}) {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const [hover, setHover] = useState<Customer | null>(null);

  return (
    <div ref={ref} className="rounded-xl border border-line bg-surface p-4">
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Map of reference customers">
          <g className="fill-muted" opacity={0.28}>
            {land.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={1.5} />
            ))}
          </g>
          {customers.map((c, i) => {
            const [x, y] = project(c.coords);
            const on = visible.has(c.id);
            return (
              <g
                key={c.id}
                onMouseEnter={() => setHover(c)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onRegion(region === c.region ? "" : c.region)}
                className="cursor-pointer transition-opacity duration-500"
                style={{ opacity: seen ? (on ? 1 : 0.2) : 0, transitionDelay: seen ? `${i * 90}ms` : "0ms" }}
              >
                {on ? <circle cx={x} cy={y} r={5} className="animate-pulse-ring fill-accent" /> : null}
                <circle cx={x} cy={y} r={5} className="fill-accent stroke-surface" strokeWidth={2} />
                <circle cx={x} cy={y} r={12} fill="transparent" />
              </g>
            );
          })}
        </svg>
        {hover ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-lg"
            style={{
              left: `${(project(hover.coords)[0] / width) * 100}%`,
              top: `calc(${(project(hover.coords)[1] / height) * 100}% - 10px)`,
            }}
          >
            <p className="font-medium whitespace-nowrap">{hover.name}</p>
            <p className="whitespace-nowrap text-muted">
              {hover.hq} · {hover.reference?.contactRole}
            </p>
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter by region">
        {regions.map((r) => {
          const n = customers.filter((c) => c.region === r).length;
          return (
            <button
              key={r}
              type="button"
              onClick={() => onRegion(region === r ? "" : r)}
              aria-pressed={region === r}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                region === r ? "border-accent bg-accent text-accent-fg" : "border-line text-muted hover:text-fg"
              }`}
            >
              {r} · {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
