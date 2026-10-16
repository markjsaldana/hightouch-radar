import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { Hash, Lock } from "lucide-react";
import { DealAssistant } from "@/components/deal-assistant";
import { PageHeader } from "@/components/page-header";
import { transcriptDemo } from "@/lib/data";
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

const stages = [
  { name: "Discovery", gives: "Landmine questions to plant before the evaluation starts." },
  { name: "Evaluation & demo", gives: "The demo moments and proof points that land with this buyer." },
  { name: "Technical validation", gives: "Architecture answers for the data team and what to test in the POC." },
  { name: "Proposal & negotiation", gives: "Responses to bundling and cost objections, and when to bring in the AE's TCO worksheet." },
  { name: "Renewal", gives: "Proof of value to date and what to say if a competitor shows up at renewal." },
];

const buildSteps = [
  {
    title: "Start from the call",
    body: "The rep uploads the call transcript, or fills in a six-field form when there's no recording. The transcript is the recommended path: concerns come ranked by what the buyer actually said, with the quotes to prove it.",
  },
  {
    title: "Ground it in the Radar",
    body: "It answers only from the battlecards, signals, matrix, win-loss notes, and the reference and case study library, and every line cites where it came from. When the data has no answer, it says so.",
  },
  {
    title: "Match proof to the deal",
    body: "Resources are ranked by how many of the buyer's concerns they answer and how closely the customer matches on use case, region, industry, and competitor.",
  },
  {
    title: "Put it where reps work",
    body: "Slack and the CRM opportunity page, with call recordings pulled from Gong automatically, so a rep can ask between calls without opening another tool.",
  },
  {
    title: "Turn gaps into intel requests",
    body: "Concerns it can't answer go to the CI owner, and missing reference matches go to CS. They become new sources to track, new win-loss questions, or reference recruiting.",
  },
];

// Read at build time so the demo can scroll the real sample transcript.
const transcript = readFileSync(path.join(process.cwd(), transcriptDemo.file.path), "utf8").split("\n");

const channels = ["deal-larkspur-home", "comp-alerts", "sales-emea", "segment-deals"];

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

      <section id="assistant" className="mt-14 scroll-mt-32">
        <p className="font-mono text-xs text-accent">Next · After day 90</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Phase 2: the deal assistant reps talk to</h2>
        <p className="mt-3 max-w-3xl text-pretty text-muted">
          Once the Radar has a quarter of data behind it, the same data can power an assistant: a rep uploads the call
          transcript (or fills in a short form) and gets back the buyer&apos;s top concerns and the resources most
          likely to close the deal.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="font-semibold">How to build it</h3>
            <ol className="mt-4 space-y-4 text-sm">
              {buildSteps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="font-mono text-xs leading-5 text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="font-medium">{step.title}.</span>{" "}
                    <span className="text-pretty text-muted">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="font-semibold">What changes by sales stage</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {stages.map((stage) => (
                <div key={stage.name}>
                  <dt className="font-medium">{stage.name}</dt>
                  <dd className="text-pretty text-muted">{stage.gives}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <figure className="mt-4 rounded-xl border border-dashed border-line bg-surface-2 p-3 sm:p-5">
          <figcaption className="text-xs text-muted">
            Mockup of one exchange, built from a sample call transcript, the battlecard, and the references library.
            Not a working tool. Links open the real pages in this site.
          </figcaption>
          {/* A Slack-style window, so it reads as something reps use where they already work. */}
          <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
            <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full bg-bad/60" />
                <span className="size-2.5 rounded-full bg-warn/60" />
                <span className="size-2.5 rounded-full bg-good/60" />
              </span>
              <span className="ml-2 text-xs text-muted">Slack · Hightouch sales</span>
            </div>
            <div className="grid md:grid-cols-[12rem_minmax(0,1fr)]">
              <aside className="hidden border-r border-line bg-surface-2/60 p-3 text-sm md:block" aria-hidden>
                <p className="px-2 text-xs font-medium text-muted">Channels</p>
                <ul className="mt-1 space-y-0.5">
                  {channels.map((c, i) => (
                    <li
                      key={c}
                      className={`flex items-center gap-1.5 rounded-md px-2 py-1 ${i === 0 ? "bg-accent text-accent-fg" : "text-muted"}`}
                    >
                      <Hash className="size-3.5" />
                      <span className="truncate">{c}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 px-2 text-xs font-medium text-muted">Apps</p>
                <p className="mt-1 flex items-center gap-1.5 px-2 py-1 text-muted">
                  <span className="size-2 rounded-full bg-good" />
                  Deal Radar
                </p>
              </aside>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    <Hash className="size-4 text-muted" aria-hidden />
                    deal-larkspur-home
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted">
                    <Lock className="size-3" aria-hidden />
                    Linked to CRM opportunity · {transcriptDemo.prospect.stage}
                  </p>
                </div>
                <div className="p-4">
                  <DealAssistant transcript={transcript} />
                </div>
              </div>
            </div>
          </div>
        </figure>

        <p className="mt-4 max-w-3xl text-sm text-pretty text-muted">
          <span className="font-medium text-fg">How to measure it: </span>
          reps using it each week, the share of competitive deals where it was used, win rate in those deals compared
          with the rest, and how many questions it couldn&apos;t answer.
        </p>
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
