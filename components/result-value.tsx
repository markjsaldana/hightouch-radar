"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion, useInView } from "@/lib/use-in-view";

const DAYS: Record<string, number> = { day: 1, days: 1, week: 7, weeks: 7, month: 30, months: 30 };

// "2 weeks → 1 day" style results: both sides in days, for a before/after bar.
function beforeAfter(value: string) {
  const m = value.match(/^(\d+)\s+(\w+)\s+→\s+(\d+)\s+(\w+)$/);
  if (!m || !DAYS[m[2]] || !DAYS[m[4]]) return null;
  return { before: Number(m[1]) * DAYS[m[2]], after: Number(m[3]) * DAYS[m[4]], left: `${m[1]} ${m[2]}`, right: `${m[3]} ${m[4]}` };
}

// Counts the leading number up from zero when the card scrolls into view.
export function ResultValue({ value }: { value: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.6);
  const match = value.match(/^([+−-]?)(\d+)(.*)$/);
  const target = match ? Number(match[2]) : 0;
  const [n, setN] = useState(0);
  const pair = beforeAfter(value);
  const counts = Boolean(match) && !pair;

  useEffect(() => {
    if (!seen || !counts) return;
    if (prefersReducedMotion()) {
      const id = window.setTimeout(() => setN(target), 0);
      return () => window.clearTimeout(id);
    }
    const start = performance.now();
    let frame = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, target, counts]);

  if (pair) {
    return (
      <span ref={ref} className="block">
        <span className="block font-semibold">{value}</span>
        <span className="mt-1.5 block space-y-1" aria-hidden>
          {[
            { label: pair.left, days: pair.before, tone: "bg-muted/40" },
            { label: pair.right, days: pair.after, tone: "bg-accent" },
          ].map((bar, i) => (
            <span key={bar.label} className="flex h-1.5 items-center">
              <span
                className={`h-full rounded-r transition-[width] duration-700 ease-out ${bar.tone}`}
                style={{
                  width: seen ? `${Math.max(3, (bar.days / pair.before) * 100)}%` : "0%",
                  transitionDelay: `${i * 300}ms`,
                }}
              />
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (!match) return <span className="font-semibold">{value}</span>;
  return (
    <span ref={ref} className="font-semibold tabular-nums">
      <span className="sr-only">{value}</span>
      <span aria-hidden>
        {match[1]}
        {seen ? n : 0}
        {match[3]}
      </span>
    </span>
  );
}
