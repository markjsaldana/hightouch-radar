"use client";

import { useInView } from "@/lib/use-in-view";

export type LossReason = { reason: string; lostTo: string | null; share: number };

// Horizontal bars, one per reason, scaled to the largest share so the top bar
// fills the row. Labels sit above each bar so long reasons never get clipped.
export function LossReasonsChart({ reasons }: { reasons: LossReason[] }) {
  const [ref, seen] = useInView<HTMLOListElement>(0.3);
  const max = Math.max(...reasons.map((r) => r.share));

  return (
    <ol ref={ref} className="space-y-4" aria-label="Share of lost deals by reason">
      {reasons.map((r, i) => (
        <li key={r.reason}>
          <p className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0">
              <span className="font-medium">{r.reason}</span>
              {r.lostTo ? <span className="text-muted"> · lost to {r.lostTo}</span> : null}
            </span>
            <span className="font-semibold tabular-nums">{r.share}%</span>
          </p>
          <div className="mt-1.5 h-3 rounded-full bg-surface-2" aria-hidden>
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
              style={{ width: seen ? `${(r.share / max) * 100}%` : "0%", transitionDelay: `${i * 120}ms` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
