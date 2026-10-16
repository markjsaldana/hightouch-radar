"use client";

import { useState } from "react";
import { competitorName, digest, signals } from "@/lib/data";
import { formatShortDate } from "@/lib/format";
import type { Confidence, Signal } from "@/lib/types";
import { useInView } from "@/lib/use-in-view";

// Oldest week lightest, this week darkest (one hue, ordinal).
const weeks = [...new Set(signals.map((s) => s.weekOf))].sort();
const weekStep = (w: string) => `var(--seq-${weeks.indexOf(w) + 2})`;

const competitorIds = [...new Set(signals.map((s) => s.competitorId))]
  .map((id) => ({ id, n: signals.filter((s) => s.competitorId === id).length }))
  .sort((a, b) => b.n - a.n);
const maxCount = Math.max(...competitorIds.map((c) => c.n));

function WeeklyBars() {
  const [ref, seen] = useInView<HTMLDivElement>(0.4);
  const [tip, setTip] = useState<string | null>(null);

  return (
    <div ref={ref} className="rounded-xl border border-line bg-surface p-5">
      <h3 className="font-semibold">Signals by competitor, last 3 weeks</h3>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted" aria-label="Legend">
        {weeks.map((w) => (
          <span key={w} className="inline-flex items-center gap-1.5">
            <span className="size-3 rounded-sm" style={{ background: weekStep(w) }} aria-hidden />
            Week of {formatShortDate(w)}
          </span>
        ))}
      </div>
      <ul className="mt-4 space-y-2.5">
        {competitorIds.map(({ id, n }, row) => (
          <li key={id} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 text-sm">
            <span className="truncate text-muted">{competitorName(id)}</span>
            <span className="flex items-center gap-2">
              <span
                className="flex h-5 gap-0.5 transition-[width] duration-700 ease-out"
                style={{ width: seen ? `${(n / maxCount) * 85}%` : "0%", transitionDelay: `${row * 80}ms` }}
              >
                {weeks.map((w, i) => {
                  const count = signals.filter((s) => s.competitorId === id && s.weekOf === w).length;
                  if (!count) return null;
                  const last = weeks.slice(i + 1).every((later) => !signals.some((s) => s.competitorId === id && s.weekOf === later));
                  return (
                    <span
                      key={w}
                      onMouseEnter={() => setTip(`${competitorName(id)}, week of ${formatShortDate(w)}: ${count} signal${count > 1 ? "s" : ""}`)}
                      onMouseLeave={() => setTip(null)}
                      className={`h-full ${last ? "rounded-r" : ""}`}
                      style={{ flex: count, background: weekStep(w) }}
                    />
                  );
                })}
              </span>
              <span className="text-xs tabular-nums text-muted">{n}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 min-h-5 text-xs text-muted" aria-live="polite">
        {tip ?? "Hover a segment for the count."}
      </p>
    </div>
  );
}

const confidences: Confidence[] = ["Confirmed", "Likely", "Rumor"];

function ImpactPlot() {
  const [ref, seen] = useInView<HTMLDivElement>(0.4);
  const [tip, setTip] = useState<Signal | null>(null);
  const thisWeek = signals.filter((s) => s.weekOf === digest.weekOf);

  const W = 320;
  const H = 150;
  const left = 74;
  const x = (impact: number) => left + ((impact - 1) / 4) * (W - left - 16);
  const y = (c: Confidence) => 20 + confidences.indexOf(c) * 50;
  // Nudge signals that share a cell apart so every dot stays visible.
  const offset = (s: Signal) => {
    const same = thisWeek.filter((o) => o.impact === s.impact && o.confidence === s.confidence);
    return (same.indexOf(s) - (same.length - 1) / 2) * 14;
  };

  return (
    <div ref={ref} className="rounded-xl border border-line bg-surface p-5">
      <h3 className="font-semibold">This week: impact vs. confidence</h3>
      <p className="mt-1 text-xs text-muted">Top right is what reps hear about the same day.</p>
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="mt-3 w-full" role="img" aria-label="Deal impact against confidence for this week's signals">
        <rect x={x(4) - 10} y={4} width={x(5) - x(4) + 20} height={y("Likely") + 16} rx={6} className="fill-bad-soft" />
        {confidences.map((c) => (
          <g key={c}>
            <line x1={left} x2={W - 8} y1={y(c)} y2={y(c)} className="stroke-line" />
            <text x={left - 10} y={y(c)} dy="0.35em" textAnchor="end" className="fill-muted text-[10px]">
              {c}
            </text>
          </g>
        ))}
        {[1, 2, 3, 4, 5].map((i) => (
          <text key={i} x={x(i)} y={H + 6} textAnchor="middle" className="fill-muted text-[10px]">
            {i}
          </text>
        ))}
        <text x={(left + W) / 2} y={H + 20} textAnchor="middle" className="fill-muted text-[10px]">
          Deal impact
        </text>
        {thisWeek.map((s, i) => (
          <g
            key={s.id}
            onMouseEnter={() => setTip(s)}
            onMouseLeave={() => setTip(null)}
            className="transition-opacity duration-500"
            style={{ opacity: seen ? 1 : 0, transitionDelay: `${200 + i * 120}ms` }}
          >
            <circle cx={x(s.impact) + offset(s)} cy={y(s.confidence)} r={14} fill="transparent" />
            <circle
              cx={x(s.impact) + offset(s)}
              cy={y(s.confidence)}
              r={6}
              strokeWidth={2}
              className={`stroke-surface ${s.urgency === "Alert now" ? "fill-bad" : "fill-accent"}`}
            />
          </g>
        ))}
      </svg>
      <p className="mt-1 min-h-10 text-xs text-pretty text-muted" aria-live="polite">
        {tip ? (
          <>
            <span className="font-medium text-fg">
              #{tip.id} {competitorName(tip.competitorId)}
            </span>{" "}
            · impact {tip.impact} · {tip.urgency}: {tip.change}
          </>
        ) : (
          <>
            <span className="text-bad">●</span> Alert sent · <span className="text-accent">●</span> Digest or monthly
            review. Hover a dot for the signal.
          </>
        )}
      </p>
    </div>
  );
}

export function DigestCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <WeeklyBars />
      <ImpactPlot />
    </div>
  );
}
