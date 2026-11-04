import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Briefcase, Megaphone, PhoneOutgoing, Sparkles, UsersRound } from "lucide-react";
import { HashTabs } from "@/components/hash-tabs";
import { PageHeader } from "@/components/page-header";
import { competitorName, signalById, signals, soWhat } from "@/lib/data";
import { formatLongDate } from "@/lib/format";
import type { SoWhatItem } from "@/lib/types";
import { eyebrowFor } from "@/lib/nav";

export const metadata: Metadata = { title: "So what" };

// How each audience's action line is labelled, and its icon.
const audienceStyle: Record<string, { icon: LucideIcon; action: string }> = {
  leadership: { icon: Briefcase, action: "Decision or ask" },
  sdrs: { icon: PhoneOutgoing, action: "Use this" },
  team: { icon: UsersRound, action: "Do this week" },
};

function SignalChips({ ids }: { ids: number[] }) {
  return (
    <p className="flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const s = signalById(id)!;
        return (
          <Link
            key={id}
            href="/digest"
            title={s.change}
            className="rounded-md border border-line px-2 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent hover:text-accent"
          >
            #{id} {competitorName(s.competitorId)}
          </Link>
        );
      })}
    </p>
  );
}

function ItemCard({ item, index, actionLabel }: { item: SoWhatItem; index: number; actionLabel: string }) {
  return (
    <li className="animate-rise flex flex-col rounded-xl border border-line bg-surface p-5" style={{ animationDelay: `${index * 90}ms` }}>
      <p className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="mt-1 font-semibold text-pretty">{item.title}</h3>
      <p className="mt-1.5 text-sm text-pretty text-muted">{item.detail}</p>
      <div className="mt-4 rounded-lg border-l-2 border-accent bg-accent-soft px-3 py-2.5 text-sm">
        <p className="text-[11px] font-medium tracking-wide text-accent uppercase">{actionLabel}</p>
        <p className="mt-0.5 text-pretty">{item.action}</p>
      </div>
      <div className="mt-auto pt-4">
        <SignalChips ids={item.signals} />
      </div>
    </li>
  );
}

export default function Page() {
  const used = new Set(soWhat.audiences.flatMap((a) => a.items.flatMap((i) => i.signals)));
  const thisWeek = signals.filter((s) => s.weekOf === soWhat.weekOf).length;

  return (
    <>
      <PageHeader
        eyebrow={eyebrowFor("/so-what")}
        title="So what, this week"
        lede="The digest says what changed. This page says what it means for leadership, for SDRs, and for the rest of the team, in about two minutes each."
        sample
      />

      <section className="rounded-xl bg-fg p-6 text-bg">
        <p className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase opacity-70">
          <Sparkles className="size-3.5" aria-hidden />
          Week of {formatLongDate(soWhat.weekOf)} in one line
        </p>
        <p className="mt-2 text-lg leading-relaxed text-pretty">{soWhat.headline}</p>
        <p className="mt-3 text-xs opacity-70">
          Built from {used.size} signals ({thisWeek} from this week, the rest from the two weeks before).
        </p>
      </section>

      {/* One tile per audience: who it's for and how much is in it. */}
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {soWhat.audiences.map((a) => {
          const { icon: Icon } = audienceStyle[a.id] ?? audienceStyle.team;
          return (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                className="flex h-full items-start gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/50"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                  <Icon className="size-4.5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold">{a.label}</span>
                  <span className="block text-xs text-muted">{a.who}</span>
                  <span className="mt-1 block text-sm">
                    <span className="text-2xl font-semibold tabular-nums">{a.items.length}</span>{" "}
                    <span className="text-muted">{a.id === "sdrs" ? "outreach angles" : a.id === "leadership" ? "decisions and asks" : "changes this week"}</span>
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-8">
        <HashTabs
          label="Audience"
          tabs={soWhat.audiences.map((a) => {
            const style = audienceStyle[a.id] ?? audienceStyle.team;
            return {
              id: a.id,
              label: a.label,
              content: (
                <section aria-label={a.label}>
                  <p className="text-sm text-muted">
                    <span className="font-medium text-fg">For: {a.who}.</span> {a.summary}
                  </p>
                  <ol className="mt-4 grid gap-4 lg:grid-cols-2">
                    {a.items.map((item, i) => (
                      <ItemCard key={item.title} item={item} index={i} actionLabel={style.action} />
                    ))}
                  </ol>
                </section>
              ),
            };
          })}
        />
      </div>

      <section className="mt-10 flex flex-wrap items-start gap-4 rounded-xl border border-line bg-surface-2 p-5">
        <Megaphone className="mt-0.5 size-5 text-accent" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">How this page gets made</h2>
          <p className="mt-1 max-w-3xl text-sm text-pretty text-muted">
            Monday&apos;s run drafts it from the week&apos;s signals. I rewrite every line before it goes out
            at 9 a.m.: leadership gets it by email, SDRs see their angles in the call guide, and the team gets the Slack
            post. Nothing here is published without a person reading it first.
          </p>
          <Link href="/how-it-works#weekly-run" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
            See the weekly run <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
