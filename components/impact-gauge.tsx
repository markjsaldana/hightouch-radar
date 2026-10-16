"use client";

import { useInView } from "@/lib/use-in-view";

// Half-circle dial: five segments for deal impact 1 to 5, filled up to the score.
export function ImpactGauge({ impact, label }: { impact: number; label: string }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.5);
  const segments = 5;
  const r = 40;
  const cx = 50;
  const cy = 50;
  // Each segment spans 36° with a 4° gap, left (180°) to right (0°).
  const arc = (i: number) => {
    const start = Math.PI - (i * Math.PI) / segments - 0.035;
    const end = Math.PI - ((i + 1) * Math.PI) / segments + 0.035;
    const p = (a: number) => `${cx + r * Math.cos(a)} ${cy - r * Math.sin(a)}`;
    return `M ${p(start)} A ${r} ${r} 0 0 1 ${p(end)}`;
  };
  const angle = seen ? -90 + (impact / segments) * 180 - 18 : -90;

  return (
    <div ref={ref} className="flex items-center gap-4">
      <svg viewBox="0 0 100 58" className="w-32 shrink-0" role="img" aria-label={`Deal impact ${impact} of 5`}>
        {Array.from({ length: segments }, (_, i) => (
          <path
            key={i}
            d={arc(i)}
            fill="none"
            strokeWidth={9}
            strokeLinecap="butt"
            className="transition-colors duration-300"
            style={{
              stroke: seen && i < impact ? "var(--accent)" : "var(--line)",
              transitionDelay: `${150 + i * 150}ms`,
            }}
          />
        ))}
        <g
          className="transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${angle}deg)`, transformOrigin: "50px 50px" }}
        >
          <line x1={cx} y1={cy} x2={cx} y2={cy - 30} strokeWidth={2.5} strokeLinecap="round" className="stroke-fg" />
        </g>
        <circle cx={cx} cy={cy} r={4} className="fill-fg" />
      </svg>
      <div>
        <p className="text-2xl font-semibold tabular-nums">
          {impact}
          <span className="text-sm font-normal text-muted">/5</span>
        </p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}
