"use client";

import { Fragment, useState } from "react";
import { Check, Minus, X } from "lucide-react";
import { matrix } from "@/lib/data";
import type { MatrixMark, Persona } from "@/lib/types";
import { companyId, personaHeading } from "@/lib/site";

const markStyle: Record<MatrixMark, { icon: typeof Check; label: string; tone: string }> = {
  yes: { icon: Check, label: "Yes", tone: "bg-good-soft text-good" },
  partial: { icon: Minus, label: "Partial", tone: "bg-warn-soft text-warn" },
  no: { icon: X, label: "No", tone: "bg-surface-2 text-muted" },
};

function Mark({ mark }: { mark: MatrixMark }) {
  const { icon: Icon, label, tone } = markStyle[mark];
  return (
    <span className={`inline-grid size-6 place-items-center rounded-md ${tone}`} title={label}>
      <Icon className="size-3.5" strokeWidth={2.5} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function MatrixTable() {
  const [persona, setPersona] = useState<Persona | "all">("all");
  const [showNotes, setShowNotes] = useState(false);
  const groups = matrix.groups.filter((g) => persona === "all" || g.persona === persona);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filter by persona" className="flex flex-wrap gap-1.5">
          {(["all", ...matrix.groups.map((g) => g.persona)] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPersona(p)}
              aria-pressed={persona === p}
              className={`rounded-md px-2.5 py-1 text-sm transition-colors ${
                persona === p ? "bg-fg text-bg" : "bg-surface-2 text-muted hover:text-fg"
              }`}
            >
              {p === "all" ? "All personas" : p}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showNotes}
            onChange={(e) => setShowNotes(e.target.checked)}
            className="size-4 accent-[var(--accent)]"
          />
          Show source notes
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        {(Object.keys(markStyle) as MatrixMark[]).map((m) => (
          <span key={m} className="flex items-center gap-1.5">
            <Mark mark={m} /> {markStyle[m].label}
          </span>
        ))}
      </div>

      {/* relative: keeps the sr-only labels' absolute boxes inside the scroller. */}
      <div className="relative mt-4 overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs">
              <th scope="col" className="sticky left-0 z-10 bg-surface px-3 py-3 font-medium text-muted sm:px-4">
                Capability
              </th>
              {matrix.players.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className={`w-[4.75rem] px-1.5 py-3 text-center font-semibold sm:w-36 sm:px-3 ${p.id === companyId ? "bg-accent-soft text-accent" : ""}`}
                >
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <Fragment key={g.persona}>
                <tr className="border-b border-line bg-surface-2">
                  <th
                    scope="colgroup"
                    colSpan={matrix.players.length + 1}
                    className="px-4 py-2 text-xs font-semibold tracking-wide text-muted uppercase"
                  >
                    {personaHeading[g.persona] ?? g.persona}
                  </th>
                </tr>
                {g.capabilities.map((c) => (
                  <tr key={c.name} className="border-b border-line last:border-0">
                    <th scope="row" className="sticky left-0 z-10 bg-surface px-3 py-3 font-medium text-pretty sm:px-4">
                      {c.name}
                    </th>
                    {matrix.players.map((p) => {
                      const cell = c.cells[p.id];
                      return (
                        <td
                          key={p.id}
                          title={cell.note}
                          className={`px-1.5 py-3 text-center align-top sm:px-3 ${p.id === companyId ? "bg-accent-soft/50" : ""}`}
                        >
                          <Mark mark={cell.mark} />
                          {showNotes ? (
                            <span className="mt-1 block text-[11px] leading-snug text-muted">{cell.note}</span>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
