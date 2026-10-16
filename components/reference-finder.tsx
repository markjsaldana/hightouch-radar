"use client";

import { useState } from "react";
import { BookOpen, MapPin, UserRound } from "lucide-react";
import { Chip } from "@/components/badges";
import { ReferenceMap } from "@/components/reference-map";
import { caseStudies, competitorName, customers } from "@/lib/data";
import { formatShortDate } from "@/lib/format";
import type { ReferenceStatus } from "@/lib/types";

const referenceable = customers.filter((c) => c.reference);
const unique = (values: string[]) => [...new Set(values)].sort();

const facets = [
  { key: "useCase", label: "Use case", options: unique(referenceable.flatMap((c) => c.useCases)) },
  { key: "region", label: "Geo", options: unique(referenceable.map((c) => c.region)) },
  { key: "industry", label: "Industry", options: unique(referenceable.map((c) => c.industry)) },
  {
    key: "competitor",
    label: "Competitor",
    options: unique(referenceable.flatMap((c) => (c.competitor ? [competitorName(c.competitor.id)] : []))),
  },
] as const;

type FacetKey = (typeof facets)[number]["key"];

const statusTone: Record<ReferenceStatus, string> = {
  Available: "bg-good-soft text-good",
  Limited: "bg-warn-soft text-warn",
  Resting: "bg-surface-2 text-muted",
};

const statusHint: Record<ReferenceStatus, string> = {
  Available: "Ask the CSM, usually booked within a week",
  Limited: "Needs customer approval for each request",
  Resting: "At the 3-a-quarter limit, back next quarter",
};

export function ReferenceFinder() {
  const [selected, setSelected] = useState<Record<FacetKey, string>>({
    useCase: "",
    region: "",
    industry: "",
    competitor: "",
  });

  const visible = referenceable.filter(
    (c) =>
      (!selected.useCase || c.useCases.some((u) => u === selected.useCase)) &&
      (!selected.region || c.region === selected.region) &&
      (!selected.industry || c.industry === selected.industry) &&
      (!selected.competitor || (c.competitor && competitorName(c.competitor.id) === selected.competitor)),
  );
  const filtered = Object.values(selected).some(Boolean);

  return (
    <div>
      <ReferenceMap
        customers={referenceable}
        visible={new Set(visible.map((c) => c.id))}
        region={selected.region}
        onRegion={(region) => setSelected((s) => ({ ...s, region }))}
      />
      <div className="mt-3 grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        {facets.map((f) => (
          <label key={f.key} className="text-xs text-muted">
            {f.label}
            <select
              value={selected[f.key]}
              onChange={(e) => setSelected((s) => ({ ...s, [f.key]: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-sm text-fg"
            >
              <option value="">Any</option>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted" aria-live="polite">
        {visible.length} of {referenceable.length} reference customers
        {filtered ? (
          <button
            type="button"
            onClick={() => setSelected({ useCase: "", region: "", industry: "", competitor: "" })}
            className="underline underline-offset-2 hover:text-fg"
          >
            Clear filters
          </button>
        ) : null}
      </p>

      {visible.length ? (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {visible.map((c) => {
            const ref = c.reference!;
            const stories = caseStudies.filter((cs) => cs.customerId === c.id);
            return (
              <li
                key={c.id}
                id={`ref-${c.id}`}
                className="flex scroll-mt-32 flex-col rounded-xl border border-line bg-surface p-5 target:ring-2 target:ring-accent"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                      <MapPin className="size-3" aria-hidden />
                      {c.hq} · {c.region} · {c.industry} · {c.size}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium ${statusTone[ref.status]}`}
                    title={statusHint[ref.status]}
                  >
                    {ref.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.useCases.map((u) => (
                    <Chip key={u}>{u}</Chip>
                  ))}
                </div>

                <p className="mt-3 text-sm text-pretty">{ref.goodFor}</p>

                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-line pt-4 text-sm">
                  <dt className="text-muted">Contact</dt>
                  <dd className="flex items-center gap-1.5">
                    <UserRound className="size-3.5 text-muted" aria-hidden />
                    {ref.contactRole} ({ref.personas.join(", ")})
                  </dd>
                  {c.competitor ? (
                    <>
                      <dt className="text-muted">Competitor</dt>
                      <dd>
                        {c.competitor.outcome} {competitorName(c.competitor.id)}
                      </dd>
                    </>
                  ) : null}
                  <dt className="text-muted">Stack</dt>
                  <dd>{c.warehouse}</dd>
                  <dt className="text-muted">Formats</dt>
                  <dd>{ref.formats.join(", ")}</dd>
                  <dt className="text-muted">Last used</dt>
                  <dd>{formatShortDate(ref.lastUsed)}</dd>
                </dl>

                {stories.length ? (
                  <p className="mt-auto pt-4 text-sm">
                    {stories.map((cs) => (
                      <a
                        key={cs.id}
                        href={`#cs-${cs.id}`}
                        className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
                      >
                        <BookOpen className="size-3.5" aria-hidden />
                        Case study
                      </a>
                    ))}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-line px-5 py-4 text-sm text-muted">
          No reference matches all of those. That gap goes to CS as a reference-recruiting request.
        </p>
      )}
    </div>
  );
}
