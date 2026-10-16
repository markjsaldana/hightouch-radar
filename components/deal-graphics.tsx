"use client";

import { useEffect, useRef, useState } from "react";
import { transcriptDemo as demo } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/use-in-view";

const LINE_MS = 180;

// The sample transcript scrolling past while the assistant reads it. Lines
// quoted in a concern light up and get tagged with that concern's number.
export function TranscriptScroller({ lines }: { lines: string[] }) {
  const spoken = lines.filter((l) => l.startsWith("["));
  const [at, setAt] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const last = spoken.length - 1;
    if (prefersReducedMotion()) {
      const id = window.setTimeout(() => setAt(last), 0);
      return () => window.clearTimeout(id);
    }
    const id = window.setInterval(() => setAt((a) => (a >= last ? a : a + 1)), LINE_MS);
    return () => window.clearInterval(id);
  }, [spoken.length]);

  useEffect(() => {
    const row = box.current?.children[at] as HTMLElement | undefined;
    if (row && box.current) box.current.scrollTop = row.offsetTop - box.current.clientHeight / 2;
  }, [at]);

  return (
    <div
      ref={box}
      className="relative h-36 overflow-hidden rounded-md border border-line bg-surface-2 px-3 py-2 font-mono text-[11px] leading-5 [mask-image:linear-gradient(transparent,black_20%,black_80%,transparent)]"
      aria-hidden
    >
      {spoken.map((line, i) => {
        const concern = demo.concerns.findIndex((c) => line.includes(c.quote));
        const lit = concern >= 0 && i <= at;
        return (
          <p
            key={line}
            className={`flex gap-2 rounded px-1 transition-colors duration-300 ${
              lit ? "bg-warn-soft text-fg" : i <= at ? "text-muted" : "text-muted/40"
            }`}
          >
            <span className="min-w-0 flex-1 truncate">{line}</span>
            {lit ? (
              <span className="animate-rise shrink-0 rounded bg-accent px-1 font-sans text-[10px] font-semibold text-accent-fg">
                Concern {concern + 1}
              </span>
            ) : null}
          </p>
        );
      })}
    </div>
  );
}

const ROW = 40;

// Concerns on the left, resources on the right, a line for each "answers concern N".
export function ConnectionMap({
  concerns,
  resources,
}: {
  concerns: { rank: number; label: string }[];
  resources: { rank: number; label: string; addresses: number[] }[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const height = Math.max(concerns.length, resources.length) * ROW;
  const yL = (i: number) => (i + 0.5) * (height / concerns.length);
  const yR = (i: number) => (i + 0.5) * (height / resources.length);
  const links = resources.flatMap((r, ri) =>
    r.addresses
      .map((c) => ({ c, ci: concerns.findIndex((x) => x.rank === c), r: r.rank, ri }))
      .filter((l) => l.ci >= 0),
  );
  const lit = (l: { c: number; r: number }) => hover === null || hover === l.c || hover === -l.r;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] text-xs sm:grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)]">
      <div className="relative" style={{ height }}>
        {concerns.map((c, i) => (
          <p
            key={c.rank}
            onMouseEnter={() => setHover(c.rank)}
            onMouseLeave={() => setHover(null)}
            className="absolute right-0 left-0 flex -translate-y-1/2 items-center justify-end gap-1.5 text-right"
            style={{ top: yL(i) }}
          >
            <span className="truncate">{c.label}</span>
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-warn-soft font-mono text-warn">
              {c.rank}
            </span>
          </p>
        ))}
      </div>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }} aria-hidden>
        {links.map((l, i) => (
          <path
            key={`${l.c}-${l.r}`}
            d={`M 0 ${yL(l.ci)} C 50 ${yL(l.ci)}, 50 ${yR(l.ri)}, 100 ${yR(l.ri)}`}
            fill="none"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            className="draw-line stroke-accent transition-opacity"
            strokeWidth={2}
            style={{ opacity: lit(l) ? 1 : 0.15, animationDelay: `${i * 150}ms` }}
          />
        ))}
      </svg>
      <div className="relative" style={{ height }}>
        {resources.map((r, i) => (
          <p
            key={r.rank}
            onMouseEnter={() => setHover(-r.rank)}
            onMouseLeave={() => setHover(null)}
            className="absolute right-0 left-0 flex -translate-y-1/2 items-center gap-1.5"
            style={{ top: yR(i) }}
          >
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-accent">
              {r.rank}
            </span>
            <span className="truncate">{r.label}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
