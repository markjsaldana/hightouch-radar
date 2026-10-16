import Link from "next/link";
import { ArrowRight, Binoculars, Gauge, MessageSquareText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SalesCycleTrack, type Stage } from "@/components/sales-cycle-track";
import { competitors, digest, signals, sources } from "@/lib/data";

const pillars = [
  {
    icon: Binoculars,
    title: "Watch",
    body: "Competitor launches, pricing, messaging, reviews, and hiring, plus how their reps pitch on real sales calls. Customer references and case studies sit alongside.",
  },
  {
    icon: Gauge,
    title: "Check",
    body: "Each change is scored for deal impact and reviewed by a person before a rep sees it. Rumors never make it into a talk track.",
  },
  {
    icon: MessageSquareText,
    title: "Answer",
    body: "Reps ask in Slack or the CRM and get what to say next for the deal in front of them, with the source for every line.",
  },
];

// What an SDR or AE gets from the assistant at each stage, and where it comes from.
const stages: Stage[] = [
  {
    name: "Prospecting",
    who: "SDR",
    asks: "Which of my accounts just felt a competitor change?",
    gets: "A reason to reach out this week, such as a competitor's price change or renewal timing, with a two-line opener.",
    href: "/digest",
    source: "Weekly digest",
  },
  {
    name: "Discovery",
    who: "SDR → AE",
    asks: "They use Segment. What should I ask?",
    gets: "Landmine questions to plant before the evaluation, and the one-line answer if the competitor comes up.",
    href: "/battlecard",
    source: "Battlecard",
  },
  {
    name: "Demo & evaluation",
    who: "AE",
    asks: "Here's the call transcript. What do they care about?",
    gets: "The buyer's top concerns in their own words, the case studies and talk tracks that answer them, and a follow-up email.",
    href: "/assistant",
    source: "Deal assistant",
  },
  {
    name: "Technical validation",
    who: "AE + SE",
    asks: "Can they actually do this on the warehouse?",
    gets: "A capability-by-capability answer with a source note on every cell, and what to test in the POC.",
    href: "/matrix",
    source: "Matrix",
  },
  {
    name: "Proposal & negotiation",
    who: "AE",
    asks: "They want to talk to a customer like them.",
    gets: "Reference customers matched on use case, region, industry, and competitor, with who to ask and when they were last used.",
    href: "/references",
    source: "References",
  },
  {
    name: "Renewal",
    who: "AE + CS",
    asks: "A competitor is pitching my customer.",
    gets: "A same-day alert when the competitor shows up, plus proof of value to date for the renewal conversation.",
    href: "/routing",
    source: "Routing log",
  },
];

const whyHightouch = [
  {
    title: "Every deal has a competitor in it.",
    body: "Composable vs. packaged CDP comes up in almost every deal, and AI decisioning now puts engagement platforms and suites in the same evaluations.",
  },
  {
    title: "Each buyer needs different proof.",
    body: "Marketing wants speed, data teams want governance and one source of truth, and product wants real-time experimentation. One battlecard can't serve all three.",
  },
  {
    title: "Reps only use what they trust.",
    body: "Every answer cites the signal, battlecard section, or customer story it came from. When the assistant doesn't know, it says so, and the question goes to the CI owner.",
  },
];

export default function Page() {
  const thisWeek = signals.filter((s) => s.weekOf === digest.weekOf);
  const stats = [
    { label: "Competitors tracked", value: competitors.length },
    { label: "Sources monitored", value: sources.length },
    { label: "Signals this week", value: thisWeek.length },
    { label: "Sales alerts this week", value: thisWeek.filter((s) => s.urgency === "Alert now").length },
  ];

  return (
    <>
      <PageHeader
        eyebrow="01 · Overview"
        title="A sales assistant for every stage of the deal"
        lede="SDRs and AEs ask it what to say next, from the first cold email to the renewal call. It answers from current competitive intel, battlecards, and customer proof, and cites the source for every line."
      />

      <section aria-label="How the assistant works" className="grid gap-4 sm:grid-cols-3">
        {pillars.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-line bg-surface p-5">
            <span className="grid size-9 place-items-center rounded-lg bg-accent-soft text-accent">
              <Icon className="size-4.5" aria-hidden />
            </span>
            <h2 className="mt-4 font-semibold">{title}</h2>
            <p className="mt-1.5 text-sm text-muted">{body}</p>
          </div>
        ))}
      </section>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface px-5 py-4">
            <dt className="text-xs text-muted">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-muted">Counts come from the sample data on the pages that follow.</p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Through the whole sales cycle</h2>
        <p className="mt-1 max-w-2xl text-sm text-pretty text-muted">
          What a rep asks at each stage, and what comes back.
        </p>
        <div className="mt-5">
          <SalesCycleTrack stages={stages} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Why this matters for Hightouch</h2>
        <ul className="mt-5 space-y-4">
          {whyHightouch.map((item, i) => (
            <li key={item.title} className="flex gap-4">
              <span className="mt-0.5 font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <p className="max-w-2xl text-pretty">
                <strong className="font-semibold">{item.title}</strong>{" "}
                <span className="text-muted">{item.body}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-xl border border-line bg-surface-2 p-6">
        <p className="font-mono text-xs tracking-wide text-muted uppercase">Built to run in-house</p>
        <p className="mt-3 max-w-3xl text-pretty">
          The assistant and every page here read from a few JSON files and one pipeline script. Your team can fork it and run it,
          or bring me in to set it up.{" "}
          <Link href="/plan" className="font-medium text-accent hover:underline">
            See how to build it
          </Link>
          .
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/assistant"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          Try the deal assistant <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
        >
          See how it works
        </Link>
      </div>
    </>
  );
}
