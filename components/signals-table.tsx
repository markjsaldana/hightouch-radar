"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ConfidenceBadge, ImpactBadge } from "@/components/badges";
import { competitorName, signalTypeLabel, signalTypes, signals } from "@/lib/data";
import { formatShortDate } from "@/lib/format";
import type { Persona, Signal } from "@/lib/types";

type SortKey = "impact" | "date" | "competitor";

const personas: Persona[] = ["Owner", "Office", "Tech", "Ops"];

const selectClass =
  "rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-fg focus:border-accent focus:outline-none";

type Sort = { key: SortKey; desc: boolean };

function SortHeader({
  k,
  sort,
  onSort,
  children,
}: {
  k: SortKey;
  sort: Sort;
  onSort: (sort: Sort) => void;
  children: React.ReactNode;
}) {
  const active = sort.key === k;
  const Icon = sort.desc ? ArrowDown : ArrowUp;
  return (
    <th scope="col" className="px-4 py-3 font-medium" aria-sort={active ? (sort.desc ? "descending" : "ascending") : "none"}>
      <button
        type="button"
        // First click sorts competitors A to Z, and impact and date highest first.
        onClick={() => onSort({ key: k, desc: active ? !sort.desc : k !== "competitor" })}
        className={`-my-1.5 inline-flex items-center gap-1 py-1.5 hover:text-fg ${active ? "text-fg" : ""}`}
      >
        {children}
        {active ? <Icon className="size-3" aria-hidden /> : null}
      </button>
    </th>
  );
}

export function SignalsTable({ weekOf }: { weekOf: string }) {
  const [range, setRange] = useState<"week" | "all">("week");
  const [competitor, setCompetitor] = useState("all");
  const [type, setType] = useState("all");
  const [persona, setPersona] = useState("all");
  const [minImpact, setMinImpact] = useState(1);
  const [sort, setSort] = useState<Sort>({ key: "impact", desc: true });

  const competitorIds = useMemo(() => [...new Set(signals.map((s) => s.competitorId))], []);

  const rows = useMemo(() => {
    const value = (s: Signal) =>
      sort.key === "impact" ? s.impact : sort.key === "date" ? s.date : competitorName(s.competitorId);
    return signals
      .filter((s) => range === "all" || s.weekOf === weekOf)
      .filter((s) => competitor === "all" || s.competitorId === competitor)
      .filter((s) => type === "all" || s.type === type)
      .filter((s) => persona === "all" || s.personas.includes(persona as Persona))
      .filter((s) => s.impact >= minImpact)
      .sort((a, b) => {
        const av = value(a);
        const bv = value(b);
        const cmp = av < bv ? -1 : av > bv ? 1 : b.id - a.id;
        return sort.desc ? -cmp : cmp;
      });
  }, [range, competitor, type, persona, minImpact, sort, weekOf]);

  const filtered = competitor !== "all" || type !== "all" || persona !== "all" || minImpact > 1;

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div role="group" aria-label="Date range" className="flex rounded-lg border border-line bg-surface p-0.5 text-sm">
          {(["week", "all"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`rounded-md px-3 py-1 transition-colors ${range === r ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
            >
              {r === "week" ? "This week" : "Last 3 weeks"}
            </button>
          ))}
        </div>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Competitor
          <select className={selectClass} value={competitor} onChange={(e) => setCompetitor(e.target.value)}>
            <option value="all">All</option>
            {competitorIds.map((id) => (
              <option key={id} value={id}>
                {competitorName(id)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Type
          <select className={selectClass} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All</option>
            {signalTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Persona
          <select className={selectClass} value={persona} onChange={(e) => setPersona(e.target.value)}>
            <option value="all">All</option>
            {personas.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Impact
          <select className={selectClass} value={minImpact} onChange={(e) => setMinImpact(Number(e.target.value))}>
            <option value={1}>Any</option>
            <option value={3}>3 and up</option>
            <option value={4}>4 and up</option>
          </select>
        </label>
        {filtered ? (
          <button
            type="button"
            onClick={() => {
              setCompetitor("all");
              setType("all");
              setPersona("all");
              setMinImpact(1);
            }}
            className="py-1.5 text-sm text-accent hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <SortHeader k="date" sort={sort} onSort={setSort}>Date</SortHeader>
              <SortHeader k="competitor" sort={sort} onSort={setSort}>Competitor</SortHeader>
              <th scope="col" className="px-4 py-3 font-medium">Change</th>
              <th scope="col" className="px-4 py-3 font-medium">Type</th>
              <SortHeader k="impact" sort={sort} onSort={setSort}>Impact</SortHeader>
              <th scope="col" className="px-4 py-3 font-medium">Persona</th>
              <th scope="col" className="px-4 py-3 font-medium">Owner</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line align-top">
            {rows.map((s) => (
              <tr key={s.id} id={`signal-${s.id}`} className="scroll-mt-32">
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatShortDate(s.date)}
                  <span className="block font-mono text-xs text-muted">#{s.id}</span>
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">{competitorName(s.competitorId)}</td>
                <td className="min-w-[15rem] px-4 py-3 text-pretty">{s.change}</td>
                <td className="px-4 py-3 text-muted">{signalTypeLabel(s.type)}</td>
                <td className="px-4 py-3">
                  <span className="flex flex-col items-start gap-1">
                    <ImpactBadge impact={s.impact} />
                    <ConfidenceBadge confidence={s.confidence} />
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{s.personas.join(", ")}</td>
                <td className="px-4 py-3 text-muted">{s.owners.join(", ")}</td>
                <td className="px-4 py-3">{s.status}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted">
                  No signals match these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted">
        {rows.length} signal{rows.length === 1 ? "" : "s"} shown. Click Date, Competitor, or Impact to sort.
      </p>
    </div>
  );
}
