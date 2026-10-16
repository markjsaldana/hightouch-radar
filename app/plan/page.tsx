import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { personName } from "@/lib/site";

export const metadata: Metadata = { title: "Build it" };

const paths = [
  {
    name: "On your own",
    summary: "This repo is the starting point. Everything on the site comes from it.",
    items: [
      "Fork the repo. The JSON files in /data define every schema, and npm run check:data keeps them consistent.",
      "Replace the sample data with your own competitors, sources, reference customers, and case studies.",
      "Schedule scripts/radar.py weekly with a Claude API key. It drafts signals, and a person approves each one.",
      "Follow the 90-day rollout below.",
    ],
    needsLabel: "You'll need",
    needs: "One CI owner (usually in PMM), sales ops for Gong and CRM access, and an engineer for the pipeline setup.",
  },
  {
    name: "With me",
    summary: "I set it up with your team, run the first 90 days, and hand it over.",
    items: [
      "Run the 90-day rollout below alongside your PMM team.",
      "Connect the pipeline to your real sources, call recordings, and CRM.",
      "Build the deal assistant once the Radar has a quarter of data.",
      "Train the person who keeps it running after handover.",
    ],
    needsLabel: "You get",
    needs: "A Radar running on your real sources, an owner trained to run it, and written notes on every source and rule.",
  },
];

const phases = [
  {
    days: "Days 1–30",
    name: "Listen & baseline",
    items: [
      "Interview reps, SEs, PMs, and CS about where competitors show up and what they need in the moment.",
      "Audit existing competitive content and retire anything out of date.",
      "Pull win-loss and call data to see which competitors you actually lose to.",
      "Pick the primary competitors based on that data.",
      "Ship v1 battlecards for the top 3.",
    ],
    done: "Reps have current battlecards for the 3 competitors they see most.",
  },
  {
    days: "Days 31–60",
    name: "Systematize",
    items: [
      "Launch the weekly digest and a sales alert channel.",
      "Start a monthly win-loss interview cadence.",
      "Start monthly mystery-shop calls, rotating through the primary competitors.",
      "Build the comparison matrix and the first comparison pages.",
    ],
    done: "The Radar runs every week without anyone having to chase it.",
  },
  {
    days: "Days 61–90",
    name: "Prove impact",
    items: [
      "Set the KPI baseline and report win rate against each primary competitor.",
      "Feed a quarterly competitive review into roadmap planning.",
      "Run a field enablement session on the top competitive plays.",
    ],
    done: "Leadership sees win rate by competitor, and Product plans with CI in the room.",
  },
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="09 · Build it"
        title="How Hightouch could build this internally"
        lede="Everything on this site runs from one repo: the data, the pipeline, and the assistant reps use. A team could stand it up in 90 days, on its own or with me."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {paths.map((path) => (
          <section key={path.name} className="flex flex-col rounded-xl border border-line bg-surface p-5">
            <h2 className="text-lg font-semibold">{path.name}</h2>
            <p className="mt-1 text-sm text-pretty text-muted">{path.summary}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {path.items.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span className="text-pretty">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-auto border-t border-line pt-4 text-sm text-pretty [&:not(:first-child)]:mt-5">
              <span className="text-xs font-medium tracking-wide text-muted uppercase">{path.needsLabel}</span>
              <span className="mt-1 block">{path.needs}</span>
            </p>
          </section>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-semibold tracking-tight">The 90-day rollout</h2>
      <p className="mt-1 mb-4 max-w-2xl text-sm text-pretty text-muted">
        Listen first, then build the system, then prove it changes win rates. The same plan works either way.
      </p>

      <ol className="grid gap-4 lg:grid-cols-3">
        {phases.map((p, i) => (
          <li key={p.days} className="flex flex-col rounded-xl border border-line bg-surface p-5">
            <p className="font-mono text-xs text-accent">
              {String(i + 1).padStart(2, "0")} · {p.days}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{p.name}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {p.items.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span className="text-pretty">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-auto border-t border-line pt-4 text-sm [&:not(:first-child)]:mt-5">
              <span className="text-xs font-medium tracking-wide text-muted uppercase">Done when</span>
              <span className="mt-1 block text-pretty">{p.done}</span>
            </p>
          </li>
        ))}
      </ol>

      <section className="mt-14 rounded-xl border border-accent/30 bg-accent-soft p-6">
        <p className="font-mono text-xs text-accent">Next · After day 90</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">Phase 2: the deal assistant</h2>
        <p className="mt-2 max-w-3xl text-pretty">
          Once the Radar has a quarter of data, the same data powers the assistant reps use on every deal: upload the
          call transcript, get the buyer&apos;s concerns, the proof, and the follow-up email.
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
          Take this repo and build it on your own, or bring me in to set it up with your team and hand it over.
        </p>
        <footer className="mt-4 text-sm opacity-70">{personName}</footer>
      </blockquote>
    </>
  );
}
