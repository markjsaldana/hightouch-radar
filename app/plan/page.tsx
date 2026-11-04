import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { More } from "@/components/more";
import { PageHeader } from "@/components/page-header";
import { personName } from "@/lib/site";
import { eyebrowFor } from "@/lib/nav";

export const metadata: Metadata = { title: "90-day plan" };

// Dated milestones for the timeline strip. `day` places each marker.
const milestones = [
  { day: 10, label: "Sat in on 20 sales calls" },
  { day: 30, label: "Jobber and ServiceTitan battlecards live" },
  { day: 35, label: "First Monday Dispatch" },
  { day: 45, label: "First So what to leadership" },
  { day: 60, label: "Comparison pages updated" },
  { day: 75, label: "Deal assistant pilot starts" },
  { day: 90, label: "Win rates to leadership" },
];

const phases = [
  {
    days: "Days 1–30",
    name: "Listen and ship the first cards",
    items: [
      "Sit in on 20 SDR and AE calls, and join a few CS renewal calls.",
      "Interview sales leaders, SDRs, AEs, CS, and Product about where Jobber and ServiceTitan show up and what reps need in the moment.",
      "Audit the competitive content that exists today and retire anything out of date.",
      "Pull win-loss and call data to see where we lose to each competitor, by trade and shop size.",
      "Agree with sales leadership on who else to watch beyond Jobber and ServiceTitan.",
    ],
    ships: "v1 battlecards for Jobber and ServiceTitan, and the source list Dispatch will track.",
    done: "Reps are using both battlecards on live calls.",
  },
  {
    days: "Days 31–60",
    name: "Make it weekly",
    items: [
      "Turn on the Monday scrape with RevOps and a few days of an engineer's time.",
      "Send the first weekly digest and the first So what for leadership, SDRs, and the team.",
      "Open a sales alert channel for same-day changes.",
      "Start monthly win-loss interviews and mystery-shop calls, alternating Jobber and ServiceTitan.",
      "Refresh our Jobber and ServiceTitan comparison pages with the web team.",
    ],
    ships: "Dispatch every Monday, the So what, the alert channel, and updated comparison pages.",
    done: "Dispatch goes out every Monday without me chasing anyone for it.",
  },
  {
    days: "Days 61–90",
    name: "Prove it and start the assistant",
    items: [
      "Set the KPI baseline and report win rate against Jobber and ServiceTitan.",
      "Pilot the deal assistant with 5 AEs and 3 SDRs on live deals.",
      "Run a field enablement session on the top competitive plays.",
      "Bring a quarterly competitive review into roadmap planning with Product.",
    ],
    ships: "A win-rate baseline, the first quarterly competitive review, and the assistant pilot.",
    done: "Leadership sees win rate by competitor, and pilot reps use the assistant in live deals.",
  },
];

const partners = [
  { team: "Sales leadership", why: "What reps need, and which decisions go in the leadership So what" },
  { team: "SDR and AE managers", why: "Openers, talk tracks, and who joins the assistant pilot" },
  { team: "RevOps", why: "Call recordings, CRM fields for competitor tags, and the Monday job" },
  { team: "Product", why: "Roadmap gaps from signals, and the quarterly competitive review" },
  { team: "CS", why: "Switch risk at renewal, and reference customers" },
  { team: "Web and Legal", why: "Comparison pages and any claim about a competitor" },
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow={eyebrowFor("/plan")}
        title="How I'll build and ship Dispatch in my first 90 days"
        lede="Listen first, make it weekly, then prove it moves win rates. By day 90, Dispatch goes out every Monday and a group of reps is piloting the deal assistant."
      />

      {/* 90 days as one strip, with each milestone placed by its day. */}
      <section aria-label="Milestones" className="rounded-xl border border-line bg-surface p-5">
        <div className="relative my-2 hidden h-36 md:block">
          <div className="absolute top-12 right-0 left-0 flex h-2 gap-0.5 overflow-hidden rounded-full" aria-hidden>
            <span className="animate-grow-x flex-1 bg-seq-2" />
            <span className="animate-grow-x flex-1 bg-seq-3 [animation-delay:200ms]" />
            <span className="animate-grow-x flex-1 bg-seq-4 [animation-delay:400ms]" />
          </div>
          {milestones.map((m, i) => {
            const above = i % 2 === 0;
            const last = m.day === 90;
            return (
              <div
                key={m.day}
                className={`absolute w-32 ${last ? "-translate-x-full text-right" : "-translate-x-1/2 text-center"}`}
                style={{ left: `${(m.day / 90) * 100}%`, top: above ? 0 : "3.75rem" }}
              >
                <div className="animate-rise" style={{ animationDelay: `${300 + i * 120}ms` }}>
                  {above ? null : <span className={`mb-1 block h-3 w-px bg-line ${last ? "ml-auto" : "mx-auto"}`} aria-hidden />}
                  <p className="font-mono text-[11px] text-accent">Day {m.day}</p>
                  <p className="text-xs leading-tight text-pretty">{m.label}</p>
                  {above ? <span className={`mt-1 block h-3 w-px bg-line ${last ? "ml-auto" : "mx-auto"}`} aria-hidden /> : null}
                </div>
              </div>
            );
          })}
        </div>
        <ol className="space-y-2 md:hidden">
          {milestones.map((m) => (
            <li key={m.day} className="flex gap-3 text-sm">
              <span className="w-14 shrink-0 font-mono text-xs leading-5 text-accent">Day {m.day}</span>
              <span>{m.label}</span>
            </li>
          ))}
        </ol>
      </section>

      <ol className="mt-6 grid gap-4 lg:grid-cols-3">
        {phases.map((p, i) => (
          <li key={p.days} className="flex flex-col rounded-xl border border-line bg-surface p-5">
            <p className="font-mono text-xs text-accent">
              {String(i + 1).padStart(2, "0")} · {p.days}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{p.name}</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="text-xs font-medium tracking-wide text-muted uppercase">What ships</span>
                <span className="mt-1 block text-pretty">{p.ships}</span>
              </p>
              <p>
                <span className="text-xs font-medium tracking-wide text-muted uppercase">Done when</span>
                <span className="mt-1 block text-pretty">{p.done}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <More label="What I'll do in each phase" hint="Step by step, month by month">
        <div className="grid gap-4 lg:grid-cols-3">
          {phases.map((p) => (
            <div key={p.days} className="rounded-xl border border-line bg-surface p-5">
              <p className="font-mono text-xs text-accent">{p.days}</p>
              <ul className="mt-3 space-y-2.5 text-sm">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </More>

      <More label="Who I'll work with" hint="Six teams, and what I need from each">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <div key={p.team} className="rounded-xl border border-line bg-surface p-4">
              <dt className="font-medium">{p.team}</dt>
              <dd className="mt-1 text-sm text-pretty text-muted">{p.why}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm">
          <Link href="/routing" className="font-medium text-accent hover:underline">
            How I&apos;ll measure it
          </Link>{" "}
          <span className="text-muted">· the KPI scorecard on the Routing log page.</span>
        </p>
      </More>

      <section className="mt-14 rounded-xl border border-accent/30 bg-accent-soft p-6">
        <p className="font-mono text-xs text-accent">Next · After day 90</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">Roll the deal assistant out to every rep</h2>
        <p className="mt-2 max-w-3xl text-pretty">
          The pilot shows what reps use and what they skip. After day 90 I&apos;ll open the assistant to every SDR and
          AE: upload the call transcript and get back what the buyer cares about, with proof and a follow-up email.
        </p>
        <Link
          href="/assistant"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
        >
          See the deal assistant <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>

      <blockquote className="mt-12 rounded-xl bg-fg p-8 text-bg">
        <p className="text-xl leading-relaxed font-medium text-balance">
          Competitive intel pays off when it changes what a rep says on the next call. That&apos;s the bar I&apos;ll
          hold Dispatch to.
        </p>
        <footer className="mt-4 text-sm opacity-70">{personName}</footer>
      </blockquote>
    </>
  );
}
