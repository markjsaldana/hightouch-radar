import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Chip } from "@/components/badges";
import { CoverageHeatmap } from "@/components/coverage-heatmap";
import { PageHeader } from "@/components/page-header";
import { SourceExplorer } from "@/components/source-explorer";
import { competitors, rules, signalTypes, sources } from "@/lib/data";
import { loadSnapshotDiff } from "@/lib/diff";
import type { Tier } from "@/lib/types";

export const metadata: Metadata = { title: "Inputs" };

const tiers: { id: Tier; note: string }[] = [
  { id: "Primary", note: "In most competitive deals. Full battlecards, weekly tracking." },
  { id: "Secondary", note: "In specific segments. Battlecards on demand." },
  { id: "Watch", note: "Not head-to-head yet, but moving toward our buyers." },
];

const sections = [
  { id: "competitors", letter: "A", title: "Competitor list" },
  { id: "sources", letter: "B", title: "Sources" },
  { id: "signal-types", letter: "C", title: "Signal types" },
  { id: "rules", letter: "D", title: "Scoring & routing rules" },
];

function Section({ index, lede, children }: { index: number; lede: string; children: ReactNode }) {
  const s = sections[index];
  return (
    <section id={s.id} className="mt-14 scroll-mt-32">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          <span className="mr-2 font-mono text-accent">{s.letter}.</span>
          {s.title}
        </h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-pretty text-muted">{lede}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function Page() {
  const diffs = Object.fromEntries(
    sources.filter((s) => s.snapshot).map((s) => [s.snapshot!, loadSnapshotDiff(s.snapshot!)]),
  );

  return (
    <>
      <PageHeader
        eyebrow="03 · Inputs"
        title="What the Radar watches, and the rules it follows"
        lede="Who we track, where we look, what counts as a change, and how each change is scored and routed."
        sample
      />

      <nav aria-label="Sections" className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm transition-colors hover:bg-surface-2"
          >
            <span className="mr-1.5 font-mono text-accent">{s.letter}</span>
            {s.title}
          </a>
        ))}
      </nav>

      <Section
        index={0}
        lede="Who we track, how closely, and a starting hypothesis for why each one wins. Win-loss interviews test the hypotheses in the first 60 days."
      >
        <div className="space-y-6">
          {tiers.map((tier) => (
            <div key={tier.id}>
              <p className="text-sm">
                <span className="font-semibold">{tier.id}</span>{" "}
                <span className="text-muted">· {tier.note}</span>
              </p>
              <div className="mt-2 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {competitors
                  .filter((c) => c.tier === tier.id)
                  .map((c) => (
                    <div key={c.id} className="flex flex-col rounded-xl border border-line bg-surface p-4">
                      <p className="font-semibold">
                        {c.name}
                        {c.parent ? <span className="font-normal text-muted"> · {c.parent}</span> : null}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">{c.category}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {c.competesFor.map((p) => (
                          <Chip key={p}>{p}</Chip>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-pretty">
                        <span className="font-medium">Why they win: </span>
                        <span className="text-muted">{c.whyTheyWin}</span>
                      </p>
                      <ul className="mt-auto space-y-1 border-t border-line pt-3 text-xs text-muted [&:not(:first-child)]:mt-3">
                        {c.facts.map((f) => (
                          <li key={f.fact}>
                            <span className="text-good">✓</span> {f.fact}{" "}
                            <span className="opacity-75">({f.source})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          ✓ = public fact, checked against the cited source. Everything else on the card is a hypothesis.
        </p>
      </Section>

      <Section
        index={1}
        lede={`${sources.length} sources, public and internal. Pick one to see what the Radar checks. Three have saved before-and-after versions, so you can see exactly what changed and the signal it produced.`}
      >
        <CoverageHeatmap />
        <div className="mt-6">
          <SourceExplorer diffs={diffs} initialSource="salesforce-pricing" />
        </div>
      </Section>

      <Section
        index={2}
        lede="Every change gets exactly one type. The type decides the default route and which battlecard section it can update."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {signalTypes.map((t) => (
            <div key={t.id} className="rounded-xl border border-line bg-surface p-4">
              <p className="font-medium">{t.label}</p>
              <p className="mt-1 text-sm text-pretty text-muted">{t.description}</p>
              <p className="mt-3 border-l-2 border-line pl-3 text-xs text-muted italic">e.g. {t.example}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        index={3}
        lede="The scores decide who hears about a change and how fast. The AI proposes them, and the CI owner confirms or changes them."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="font-semibold">Deal impact (1–5)</h3>
            <p className="text-sm text-muted">Does this change what a rep says in an active deal?</p>
            <ol className="mt-4 space-y-2">
              {rules.dealImpact.map((d) => (
                <li key={d.score} className="flex items-center gap-3 text-sm">
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-md font-mono text-xs font-semibold ${
                      d.score >= 4
                        ? "bg-bad-soft text-bad"
                        : d.score === 3
                          ? "bg-warn-soft text-warn"
                          : "bg-surface-2 text-muted"
                    }`}
                  >
                    {d.score}
                  </span>
                  {d.label}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="font-semibold">Persona affected</h3>
            <p className="text-sm text-muted">Each persona needs different proof.</p>
            <dl className="mt-4 space-y-2 text-sm">
              {rules.personas.map((p) => (
                <div key={p.id} className="flex gap-3">
                  <dt className="w-20 shrink-0 font-medium">{p.id}</dt>
                  <dd className="text-muted">{p.needs}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="font-semibold">Urgency</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {rules.urgency.map((u) => (
                <div key={u.id}>
                  <dt className="font-medium">{u.id}</dt>
                  <dd className="text-muted">{u.when}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="font-semibold">Confidence</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {rules.confidence.map((c) => (
                <div key={c.id}>
                  <dt className="font-medium">{c.id}</dt>
                  <dd className="text-muted">{c.when}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="px-5 pt-4 text-left font-semibold">Routing table</caption>
            <thead className="text-xs text-muted">
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-3 font-medium">When</th>
                <th scope="col" className="px-5 py-3 font-medium">Goes to</th>
                <th scope="col" className="px-5 py-3 font-medium">What happens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rules.routing.map((r) => (
                <tr key={r.when}>
                  <th scope="row" className="px-5 py-3 font-medium">{r.when}</th>
                  <td className="px-5 py-3">{r.to.join(" + ")}</td>
                  <td className="px-5 py-3 text-muted">{r.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
