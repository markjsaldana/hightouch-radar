"use client";

import { useState } from "react";
import { signals } from "@/lib/data";
import type { Owner, Urgency } from "@/lib/types";
import { useInView } from "@/lib/use-in-view";

const urgencies: Urgency[] = ["Alert now", "This week's digest", "Monthly review"];
const owners: Owner[] = ["Sales", "Sales leadership", "PMM", "Product", "Website", "CS", "Enablement"];

const W = 640;
const H = 300;
const NODE_W = 10;
const GAP = 8;
const LEFT_X = 150;
const RIGHT_X = W - 170;

type Band = { from: Urgency; to: Owner; count: number; y0: number; y1: number; h: number };

// Every signal-to-team handoff: one signal with two owners is two handoffs.
function layout() {
  const pairs = signals.flatMap((s) => s.owners.map((o) => ({ from: s.urgency, to: o })));
  const total = pairs.length;
  const usable = (n: number) => H - GAP * (n - 1);
  const scaleL = usable(urgencies.length) / total;
  const scaleR = usable(owners.length) / total;

  const stack = <K extends string>(keys: K[], count: (k: K) => number, scale: number) => {
    let y = 0;
    return Object.fromEntries(
      keys.map((k) => {
        const h = count(k) * scale;
        const node = { y, h, n: count(k) };
        y += h + GAP;
        return [k, node];
      }),
    ) as Record<K, { y: number; h: number; n: number }>;
  };
  const left = stack(urgencies, (u) => pairs.filter((p) => p.from === u).length, scaleL);
  const right = stack(owners, (o) => pairs.filter((p) => p.to === o).length, scaleR);

  // Bands leave each left node top to bottom in owner order, and arrive in urgency order.
  const leftCursor = Object.fromEntries(urgencies.map((u) => [u, left[u].y]));
  const rightCursor = Object.fromEntries(owners.map((o) => [o, right[o].y]));
  const bands: Band[] = [];
  for (const u of urgencies) {
    for (const o of owners) {
      const count = pairs.filter((p) => p.from === u && p.to === o).length;
      if (!count) continue;
      const hL = count * scaleL;
      const hR = count * scaleR;
      bands.push({ from: u, to: o, count, y0: leftCursor[u], y1: rightCursor[o], h: (hL + hR) / 2 });
      leftCursor[u] += hL;
      rightCursor[o] += hR;
    }
  }
  return { left, right, bands, scaleL, scaleR, total };
}

const { left, right, bands, scaleL, scaleR, total } = layout();

function bandPath(b: Band) {
  const hL = b.count * scaleL;
  const hR = b.count * scaleR;
  const x0 = LEFT_X + NODE_W;
  const x1 = RIGHT_X;
  const mx = (x0 + x1) / 2;
  return [
    `M ${x0} ${b.y0}`,
    `C ${mx} ${b.y0}, ${mx} ${b.y1}, ${x1} ${b.y1}`,
    `L ${x1} ${b.y1 + hR}`,
    `C ${mx} ${b.y1 + hR}, ${mx} ${b.y0 + hL}, ${x0} ${b.y0 + hL}`,
    "Z",
  ].join(" ");
}

export function RoutingFlow() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const [focus, setFocus] = useState<string | null>(null);

  const lit = (b: Band) => !focus || focus === b.from || focus === b.to || focus === `${b.from}>${b.to}`;
  const hovered = focus?.includes(">") ? bands.find((b) => `${b.from}>${b.to}` === focus) : null;

  return (
    <div ref={ref} className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">Who each signal went to</h2>
        <p className="text-xs text-muted">
          {signals.length} signals, {total} handoffs over 3 weeks. Band width = number of handoffs.
        </p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`-8 -8 ${W + 16} ${H + 16}`}
          className="w-full min-w-[34rem]"
          role="img"
          aria-label="Flow from urgency level to the teams that received each signal"
        >
          {bands.map((b, i) => (
            <path
              key={`${b.from}-${b.to}`}
              d={bandPath(b)}
              onMouseEnter={() => setFocus(`${b.from}>${b.to}`)}
              onMouseLeave={() => setFocus(null)}
              className="cursor-default transition-[opacity,clip-path] duration-700 ease-out"
              style={{
                fill: "var(--accent)",
                opacity: !seen ? 0 : lit(b) ? 0.35 : 0.08,
                clipPath: seen ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                transitionDelay: seen && !focus ? `${i * 60}ms` : "0ms",
              }}
            />
          ))}
          {urgencies.map((u) => (
            <g key={u} onMouseEnter={() => setFocus(u)} onMouseLeave={() => setFocus(null)}>
              <rect x={LEFT_X} y={left[u].y} width={NODE_W} height={left[u].h} rx={3} className="fill-fg" />
              <text x={LEFT_X - 8} y={left[u].y + left[u].h / 2} dy="0.35em" textAnchor="end" className="fill-fg text-[12px]">
                {u}
              </text>
              <text
                x={LEFT_X - 8}
                y={left[u].y + left[u].h / 2 + 14}
                dy="0.35em"
                textAnchor="end"
                className="fill-muted text-[11px]"
              >
                {left[u].n}
              </text>
            </g>
          ))}
          {owners.map((o) => (
            <g key={o} onMouseEnter={() => setFocus(o)} onMouseLeave={() => setFocus(null)}>
              <rect x={RIGHT_X} y={right[o].y} width={NODE_W} height={right[o].h} rx={3} className="fill-accent" />
              <text x={RIGHT_X + NODE_W + 8} y={right[o].y + right[o].h / 2} dy="0.35em" className="fill-fg text-[12px]">
                {o} <tspan className="fill-muted">{right[o].n}</tspan>
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="mt-2 min-h-5 text-sm text-muted" aria-live="polite">
        {hovered
          ? `${hovered.count} ${hovered.from === "Alert now" ? "same-day alert" : hovered.from.toLowerCase()} handoff${
              hovered.count === 1 ? "" : "s"
            } to ${hovered.to}.`
          : "Hover a band or a team to trace it."}
      </p>
    </div>
  );
}
