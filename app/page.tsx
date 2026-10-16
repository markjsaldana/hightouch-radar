import Link from "next/link";
import { ArrowRight, Binoculars, Gauge, Send } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { competitors, digest, signals, sources } from "@/lib/data";

const pillars = [
  {
    icon: Binoculars,
    title: "Track",
    body: "Features, pricing, positioning, reviews, hiring, and partnerships for every competitor in our deals, plus how their reps pitch on real sales calls.",
  },
  {
    icon: Gauge,
    title: "Interpret",
    body: "Score each change for deal impact and decide who needs it: a rep, a PM, or a marketer.",
  },
  {
    icon: Send,
    title: "Deliver",
    body: "Weekly digest, live battlecards, a comparison matrix, and alerts for urgent shifts.",
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
    title: "Reps need answers in the moment.",
    body: "When a prospect brings up a competitor's launch on today's call, the rep needs one good line to say back.",
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
        title="What is the Radar?"
        lede="An always-on competitive intelligence system that turns competitor changes into sales-ready intel every week."
      />

      <section aria-label="What the Radar does" className="grid gap-4 sm:grid-cols-3">
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
          Every page here reads from a few JSON files and one pipeline script. Your team can fork it and run it,
          or bring me in to set it up.{" "}
          <Link href="/plan" className="font-medium text-accent hover:underline">
            See how to build it
          </Link>
          .
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          See how it works <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link
          href="/digest"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
        >
          Jump to this week&apos;s digest
        </Link>
      </div>
    </>
  );
}
