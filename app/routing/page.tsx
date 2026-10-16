import type { Metadata } from "next";
import { ArrowRight, Bell, Globe, HeartHandshake, Lightbulb, Megaphone, MessageCircleQuestion } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { RoutingFlow } from "@/components/routing-flow";
import { competitorName, routingLog, signalById } from "@/lib/data";
import { formatShortDate } from "@/lib/format";
import type { RoutingEntry } from "@/lib/types";

export const metadata: Metadata = { title: "Routing log" };

const kinds: Record<RoutingEntry["kind"], { icon: typeof Bell; tone: string }> = {
  "Sales alert": { icon: Bell, tone: "bg-bad-soft text-bad" },
  Product: { icon: Lightbulb, tone: "bg-warn-soft text-warn" },
  PMM: { icon: Megaphone, tone: "bg-accent-soft text-accent" },
  Website: { icon: Globe, tone: "bg-accent-soft text-accent" },
  CS: { icon: HeartHandshake, tone: "bg-good-soft text-good" },
  "Win-loss": { icon: MessageCircleQuestion, tone: "bg-surface-2 text-muted" },
};

export default function Page() {
  const entries = [...routingLog.entries].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.signal - a.signal));
  const counts = Object.entries(
    entries.reduce<Record<string, number>>((acc, e) => ({ ...acc, [e.kind]: (acc[e.kind] ?? 0) + 1 }), {}),
  );

  return (
    <>
      <PageHeader
        eyebrow="08 · Routing log"
        title="Where intel went and what it changed"
        lede="The program is judged by what changes after a signal goes out. This log tracks those changes in deals, the roadmap, and the website."
        sample
      />

      <div className="flex flex-wrap gap-2">
        {counts.map(([kind, n]) => {
          const { icon: Icon, tone } = kinds[kind as RoutingEntry["kind"]];
          return (
            <span key={kind} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm ${tone}`}>
              <Icon className="size-3.5" aria-hidden />
              {n} {kind}
            </span>
          );
        })}
      </div>

      <div className="mt-6">
        <RoutingFlow />
      </div>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">The log</h2>
      <ol className="relative mt-6 space-y-6 border-l border-line pl-6 sm:ml-2">
        {entries.map((e) => {
          const { icon: Icon, tone } = kinds[e.kind];
          const signal = signalById(e.signal);
          return (
            <li key={`${e.signal}-${e.kind}`} className="relative">
              <span
                className={`absolute top-0.5 -left-[2.3rem] grid size-7 place-items-center rounded-full ring-4 ring-bg ${tone}`}
                aria-hidden
              >
                <Icon className="size-3.5" />
              </span>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium">
                <span className="font-mono">Signal #{e.signal}</span>
                <ArrowRight className="size-3.5 text-muted" aria-hidden />
                <span>{e.destination}</span>
                <ArrowRight className="size-3.5 text-muted" aria-hidden />
                <span className="text-pretty">{e.outcome}</span>
              </p>
              <p className="mt-1 text-sm text-pretty text-muted">
                {formatShortDate(e.date)} · {e.action}
              </p>
              {signal ? (
                <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-xs text-pretty text-muted">
                  <span className="font-medium text-fg">{competitorName(signal.competitorId)}:</span> {signal.change}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">KPIs to track</h2>
        <p className="mt-1 max-w-2xl text-sm text-pretty text-muted">
          Targets are set after a baseline in days 61–90. Until then, any number would be a guess, so the scorecard
          shows what each KPI measures and the goal.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {routingLog.kpis.map((k) => (
            <div key={k.name} className="flex flex-col rounded-xl border border-line bg-surface p-5">
              <h3 className="font-semibold">{k.name}</h3>
              <p className="mt-1 text-sm text-pretty text-muted">{k.why}</p>
              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <div>
                  <dt className="text-xs text-muted">Measure</dt>
                  <dd className="text-pretty">{k.measure}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Goal</dt>
                  <dd className="font-medium text-pretty">{k.target}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
