"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Pause, Play } from "lucide-react";
import { prefersReducedMotion, useInView } from "@/lib/use-in-view";

export type Stage = { name: string; who: string; asks: string; gets: string; href: string; source: string };

const STEP_MS = 4500;

// The sales cycle as a track: a marker moves stage to stage, and the panel
// below shows the rep's question and the assistant's answer for that stage.
export function SalesCycleTrack({ stages }: { stages: Stage[] }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!seen || !playing || hovering || prefersReducedMotion()) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % stages.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [seen, playing, hovering, stages.length]);

  const stage = stages[active];
  const progress = stages.length > 1 ? active / (stages.length - 1) : 0;

  return (
    <div
      ref={ref}
      className="rounded-xl border border-line bg-surface p-5"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative">
        {/* Track line, filled up to the active stage. Insets match half a column so it runs dot to dot. */}
        <div className="absolute top-4 right-[calc(100%/12)] left-[calc(100%/12)] h-0.5 rounded-full bg-line" aria-hidden>
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <ol className="relative grid grid-cols-6" aria-label="Sales stages">
          {stages.map((s, i) => {
            const current = i === active;
            const passed = i < active;
            return (
              <li key={s.name} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={current ? "step" : undefined}
                  className="group flex flex-col items-center gap-2 text-center"
                >
                  <span className="relative grid size-8 place-items-center">
                    {current ? (
                      <span className="animate-pulse-ring absolute inset-0 rounded-full bg-accent/40" aria-hidden />
                    ) : null}
                    <span
                      className={`relative grid size-8 place-items-center rounded-full border-2 font-mono text-xs transition-colors ${
                        current
                          ? "border-accent bg-accent text-accent-fg"
                          : passed
                            ? "border-accent bg-accent-soft text-accent"
                            : "border-line bg-surface text-muted group-hover:border-accent/50"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </span>
                  <span
                    className={`hidden text-xs leading-tight sm:block ${current ? "font-medium text-fg" : "text-muted"}`}
                  >
                    {s.name}
                  </span>
                  <span className="hidden rounded bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted md:block">
                    {s.who}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-6 min-h-56 rounded-lg bg-surface-2 p-4 sm:min-h-44" aria-live="polite">
        <div key={active} className="space-y-3 text-sm">
          <p className="font-mono text-xs text-accent sm:hidden">
            {String(active + 1).padStart(2, "0")} · {stage.name} · {stage.who}
          </p>
          <p className="animate-rise ml-auto w-fit max-w-md rounded-lg rounded-br-sm bg-accent px-4 py-2 text-accent-fg">
            {stage.asks}
          </p>
          <div className="animate-rise flex max-w-xl gap-3 [animation-delay:350ms]">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <Bot className="size-4" aria-hidden />
            </span>
            <div className="rounded-lg rounded-tl-sm border border-line bg-surface px-4 py-2.5">
              <p className="text-pretty">{stage.gets}</p>
              <Link
                href={stage.href}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                From: {stage.source} <ArrowRight className="size-3" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>Click a stage, or let it play through.</span>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-surface-2 hover:text-fg"
        >
          {playing ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
