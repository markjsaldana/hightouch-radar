import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bomb, CircleAlert, CircleCheck, MessagesSquare, Radar, Zap } from "lucide-react";
import { BattlecardScorecard } from "@/components/battlecard-scorecard";
import { PageHeader } from "@/components/page-header";
import { PersonaTabs } from "@/components/persona-tabs";
import { battlecard, competitorName, signalById } from "@/lib/data";
import { formatLongDate } from "@/lib/format";

export const metadata: Metadata = { title: "Battlecard" };

const proofTone: Record<string, string> = {
  "Customer story": "bg-good-soft text-good",
  "Demo moment": "bg-accent-soft text-accent",
  Architecture: "bg-warn-soft text-warn",
};

function UpdatedTag({ section }: { section: string }) {
  const updates = battlecard.updatedBySignals.filter((u) => u.section === section);
  if (!updates.length) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
      <Radar className="size-3" aria-hidden />
      Updated this week · {updates.map((u) => `#${u.signal}`).join(", ")}
    </span>
  );
}

function Block({ title, icon, section, children }: { title: string; icon: ReactNode; section: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-2">
        {icon}
        <h2 className="font-semibold">{title}</h2>
        <UpdatedTag section={section} />
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Page() {
  const name = competitorName(battlecard.competitorId);

  return (
    <>
      <PageHeader
        eyebrow="05 · Battlecard"
        title={`Hightouch vs. ${name}`}
        lede="One page a rep can use mid-call. The Radar keeps it current, so reps can trust what's on it."
        sample
      />

      <aside className="rounded-xl border border-accent/30 bg-accent-soft p-4">
        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-accent">
          <Radar className="size-4" aria-hidden />
          Last updated by Radar · {formatLongDate(battlecard.updatedOn)}
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {battlecard.updatedBySignals.map((u) => (
            <li key={u.signal} className="flex gap-3">
              <span className="shrink-0 font-mono text-xs leading-5 text-accent">#{u.signal}</span>
              <span className="text-pretty">
                <span className="font-medium">{u.section}:</span> {u.change}{" "}
                <span className="text-muted">(from: {signalById(u.signal)?.change})</span>
              </span>
            </li>
          ))}
        </ul>
      </aside>

      <section className="mt-6 rounded-xl bg-fg p-6 text-bg">
        <p className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase opacity-70">
          <Zap className="size-3.5" aria-hidden />
          Quick dismiss
        </p>
        <p className="mt-2 text-lg leading-relaxed text-pretty">{battlecard.quickDismiss}</p>
      </section>

      <div className="mt-6">
        <BattlecardScorecard competitorId={battlecard.competitorId} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Block title="Where we win" section="Where we win" icon={<CircleCheck className="size-5 text-good" aria-hidden />}>
          <ul className="space-y-5">
            {battlecard.whereWeWin.map((w) => (
              <li key={w.point}>
                <p className="font-medium">{w.point}</p>
                <p className="mt-1 text-sm text-pretty text-muted">{w.detail}</p>
                <p className="mt-2 flex items-start gap-2 text-sm">
                  <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium ${proofTone[w.proofType]}`}>
                    {w.proofType}
                  </span>
                  <span className="text-pretty">{w.proof}</span>
                </p>
              </li>
            ))}
          </ul>
        </Block>

        <Block
          title="Where they win: be careful"
          section="Where they win"
          icon={<CircleAlert className="size-5 text-warn" aria-hidden />}
        >
          <ul className="space-y-5">
            {battlecard.whereTheyWin.map((w) => (
              <li key={w.point}>
                <p className="font-medium">{w.point}</p>
                <p className="mt-1 text-sm text-pretty">
                  <span className="font-medium text-muted">How to handle: </span>
                  {w.handle}
                </p>
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <div className="mt-4">
        <Block
          title="Landmine questions"
          section="Landmine questions"
          icon={<Bomb className="size-5 text-bad" aria-hidden />}
        >
          <p className="-mt-2 mb-3 text-sm text-muted">Plant these early in discovery, before the evaluation starts.</p>
          <ol className="grid gap-3 sm:grid-cols-2">
            {battlecard.landmines.map((q, i) => (
              <li key={q} className="flex gap-3 rounded-lg bg-surface-2 p-3 text-sm">
                <span className="font-mono text-xs leading-5 text-muted">{i + 1}</span>
                <span className="text-pretty">{q}</span>
              </li>
            ))}
          </ol>
        </Block>
      </div>

      <div className="mt-4">
        <Block title="Objection handling" section="Objection handling" icon={<MessagesSquare className="size-5 text-accent" aria-hidden />}>
          <dl className="divide-y divide-line">
            {battlecard.objections.map((o, i) => (
              <div
                key={o.objection}
                id={`objection-${i}`}
                className="grid scroll-mt-32 gap-2 py-4 target:rounded-lg target:bg-accent-soft target:px-3 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-6">
                <dt className="font-medium text-pretty">{o.objection}</dt>
                <dd className="border-l-2 border-accent pl-3 text-sm text-pretty">{o.response}</dd>
              </div>
            ))}
          </dl>
        </Block>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight">By persona</h2>
        <p className="mt-1 text-sm text-muted">Same competitor, different proof depending on who&apos;s in the room.</p>
        <div className="mt-4">
          <PersonaTabs personas={battlecard.byPersona} />
        </div>
      </section>
    </>
  );
}
