"use client";

import { useId, useRef, useState } from "react";
import type { Battlecard } from "@/lib/types";

type PersonaCard = Battlecard["byPersona"][number];

export function PersonaTabs({ personas }: { personas: PersonaCard[] }) {
  // Unique per instance: the battlecard page renders one of these per competitor.
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = personas[active];

  function onKeyDown(e: React.KeyboardEvent) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + personas.length) % personas.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="rounded-xl border border-line bg-surface">
      <div role="tablist" aria-label="Buyer persona" className="flex gap-1 border-b border-line px-3 pt-3" onKeyDown={onKeyDown}>
        {personas.map((persona, i) => (
          <button
            key={persona.persona}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${persona.persona}`}
            aria-selected={i === active}
            aria-controls={`${uid}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`-mb-px rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              i === active ? "border-accent text-accent" : "border-transparent text-muted hover:text-fg"
            }`}
          >
            {persona.persona} buyer
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${p.persona}`} className="p-5">
        <dl className="grid gap-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium tracking-wide text-muted uppercase">They care about</dt>
            <dd className="mt-1 text-pretty">{p.theyCareAbout}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-muted uppercase">Lead with</dt>
            <dd className="mt-1 text-pretty">{p.lead}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-bad uppercase">Avoid</dt>
            <dd className="mt-1 text-pretty">{p.avoid}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-muted uppercase">Proof point</dt>
            <dd className="mt-1 text-pretty">{p.proofPoint}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
