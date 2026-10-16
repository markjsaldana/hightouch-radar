import type { Metadata } from "next";
import { MessageSquareQuote, TrendingUp } from "lucide-react";
import { Chip, ConfidenceBadge, ImpactBadge } from "@/components/badges";
import { PageHeader } from "@/components/page-header";
import { SignalsTable } from "@/components/signals-table";
import { competitorName, digest, signalById, signals } from "@/lib/data";
import { formatLongDate } from "@/lib/format";

export const metadata: Metadata = { title: "Weekly digest" };

export default function Page() {
  const thisWeek = signals.filter((s) => s.weekOf === digest.weekOf);
  const needAction = thisWeek.filter((s) => s.urgency === "Alert now").length;
  const top = digest.topForSales.map((id) => signalById(id)!);

  return (
    <>
      <PageHeader
        eyebrow="04 · Weekly digest"
        title="What sales gets every Monday"
        lede="One email and one Slack post. Reps read the top 3 in two minutes. Everything else is there if they need it."
        sample
      />

      <div className="rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="text-xs text-muted">Deal Radar · Weekly digest</p>
            <p className="mt-0.5 text-lg font-semibold">
              Week of {formatLongDate(digest.weekOf)} · {thisWeek.length} signals ·{" "}
              <span className="text-bad">{needAction} need action</span>
            </p>
          </div>
          <p className="text-xs text-muted">To: Sales, SEs, Sales leadership · Cc: Product, PMM, CS</p>
        </div>

        <section className="px-5 py-5">
          <h2 className="font-semibold">Top 3 for Sales this week</h2>
          <ol className="mt-4 space-y-4">
            {top.map((s, i) => (
              <li key={s.id} className="rounded-lg border border-line bg-bg p-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 grid size-6 place-items-center rounded-full bg-accent font-mono text-xs font-semibold text-accent-fg">
                    {i + 1}
                  </span>
                  <span className="mr-1 font-medium">{competitorName(s.competitorId)}</span>
                  <ImpactBadge impact={s.impact} />
                  <ConfidenceBadge confidence={s.confidence} />
                  {s.urgency === "Alert now" ? <Chip>Alerted {s.date.slice(5).replace("-", "/")}</Chip> : null}
                  <span className="ml-auto font-mono text-xs text-muted">#{s.id}</span>
                </div>
                <dl className="mt-3 grid gap-4 text-sm md:grid-cols-3">
                  <div>
                    <dt className="text-xs font-medium tracking-wide text-muted uppercase">What changed</dt>
                    <dd className="mt-1 text-pretty">{s.change}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium tracking-wide text-muted uppercase">Why it matters</dt>
                    <dd className="mt-1 text-pretty">{s.whyItMatters}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium tracking-wide text-muted uppercase">What to say</dt>
                    <dd className="mt-1 border-l-2 border-accent pl-3 text-pretty">{s.whatToSay}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">All signals</h2>
        <p className="mt-1 text-sm text-muted">Filter by competitor, type, persona, or impact.</p>
        <div className="mt-4">
          <SignalsTable weekOf={digest.weekOf} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <TrendingUp className="size-5 text-accent" aria-hidden />
          Trends to watch
        </h2>
        <p className="mt-1 text-sm text-muted">Patterns that only show up across several weeks.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {digest.trends.map((t) => (
            <div key={t.title} className="flex flex-col rounded-xl border border-line bg-surface p-5">
              <h3 className="font-semibold text-pretty">{t.title}</h3>
              <p className="mt-2 text-sm text-pretty text-muted">{t.detail}</p>
              <p className="mt-auto pt-4 font-mono text-xs text-muted">
                Signals {t.signals.map((id) => `#${id}`).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <MessageSquareQuote className="size-5 text-accent" aria-hidden />
          Questions for win-loss this month
        </h2>
        <p className="mt-1 text-sm text-muted">Each one fills a gap the Radar can&apos;t see from public sources.</p>
        <ol className="mt-4 space-y-3">
          {digest.winLossQuestions.map((q, i) => (
            <li key={q.question} className="flex gap-4 rounded-xl border border-line bg-surface p-5">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-medium text-pretty">{q.question}</p>
                <p className="mt-1 text-sm text-pretty text-muted">
                  <span className="font-medium text-fg">Gap: </span>
                  {q.gap}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
