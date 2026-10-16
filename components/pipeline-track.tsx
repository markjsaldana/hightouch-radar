"use client";

import { useEffect, useState } from "react";
import { Camera, Diff, Globe, Inbox, Route, Tags } from "lucide-react";

const icons = [Globe, Camera, Diff, Tags, Route, Inbox];

// Sticky strip above the step cards. The signal chip sits on whichever step is
// in view, so scrolling the page moves the change through the pipeline.
export function PipelineTrack({ titles, signalId }: { titles: string[]; signalId: number }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const cards = titles.map((_, i) => document.getElementById(`step-${i + 1}`)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(cards.indexOf(entry.target as HTMLElement));
        }
      },
      // A thin band across the upper middle of the screen decides which card is "current".
      { rootMargin: "-35% 0px -55% 0px" },
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [titles]);

  const n = titles.length;

  return (
    <nav
      aria-label="Steps"
      className="sticky top-14 z-20 -mx-4 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:bg-surface/95"
    >
      <div className="relative">
        <div className="absolute top-4 right-[calc(100%/12)] left-[calc(100%/12)] h-0.5 bg-line" aria-hidden>
          <div
            className="h-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${(active / (n - 1)) * 100}%` }}
          />
        </div>
        {/* The change itself, riding along the track. */}
        <span
          className="absolute -top-1 z-10 -translate-x-1/2 rounded-full bg-fg px-1.5 py-0.5 font-mono text-[10px] font-semibold text-bg shadow transition-[left] duration-500 ease-out"
          style={{ left: `${((active + 0.5) / n) * 100}%` }}
          aria-hidden
        >
          #{signalId}
        </span>
        <ol className="relative grid grid-cols-6">
          {titles.map((title, i) => {
            const Icon = icons[i];
            const state = i === active ? "current" : i < active ? "done" : "todo";
            return (
              <li key={title} className="flex justify-center">
                <a href={`#step-${i + 1}`} className="group flex flex-col items-center gap-1.5 pt-3 text-center">
                  <span
                    className={`grid size-8 place-items-center rounded-full border-2 transition-colors ${
                      state === "current"
                        ? "border-accent bg-accent text-accent-fg"
                        : state === "done"
                          ? "border-accent bg-accent-soft text-accent"
                          : "border-line bg-surface text-muted group-hover:border-accent/50"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className={`hidden text-xs sm:block ${state === "current" ? "font-medium" : "text-muted"}`}>
                    {title}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
