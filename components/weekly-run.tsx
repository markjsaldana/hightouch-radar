import type { LucideIcon } from "lucide-react";
import { Bot, CalendarDays, Camera, Diff, FileCheck2, Globe, Send, Sparkles, UserCheck } from "lucide-react";

type Step = {
  time: string;
  icon: LucideIcon;
  title: string;
  who: "auto" | "ai" | "human";
  body: string;
};

// What Monday's run would look like in production. This sample site doesn't scrape;
// the data shows what one run produces.
const steps: Step[] = [
  {
    time: "Mon 5:00",
    icon: Globe,
    title: "Scrape",
    who: "auto",
    body: "A scheduled GitHub Actions job loads each Jobber and ServiceTitan pricing page, product updates page, comparison page, and help article in a headless browser. Blogs come in through their RSS feeds. One request per page per week, following each site's robots.txt.",
  },
  {
    time: "Mon 5:20",
    icon: Camera,
    title: "Snapshot and compare",
    who: "auto",
    body: "Saves the text of each page with the date, then compares it with last week's copy. Date stamps, typos, and layout shifts are dropped as noise.",
  },
  {
    time: "Mon 5:30",
    icon: Sparkles,
    title: "Draft",
    who: "ai",
    body: "Claude reads each real change and drafts the signal: type, deal impact, who it affects, the talk track, and the So what lines. Everything lands in a pull request. Nothing is published yet.",
  },
  {
    time: "Mon 8:00",
    icon: UserCheck,
    title: "Review",
    who: "human",
    body: "I check each draft against the page it came from, fixes scores, deletes noise, and rewrites anything a rep will say out loud. About an hour on a normal week.",
  },
  {
    time: "Mon 9:00",
    icon: Send,
    title: "Approve and publish",
    who: "human",
    body: "Merging the pull request publishes the digest, the So what, battlecard updates, and Slack alerts. A person clicks merge; the rest is automatic.",
  },
  {
    time: "Tue–Fri",
    icon: CalendarDays,
    title: "What scraping can't see",
    who: "human",
    body: "Win-loss interviews, mystery-shop calls, listening to sales calls, and checking with Product and Legal before a comparison page or pricing claim changes.",
  },
];

const tone = {
  auto: { label: "Automated", icon: Bot, chip: "bg-surface-2 text-muted", ring: "border-line bg-surface text-muted" },
  ai: { label: "AI draft", icon: Sparkles, chip: "bg-accent-soft text-accent", ring: "border-accent/40 bg-accent-soft text-accent" },
  human: { label: "Needs a person", icon: UserCheck, chip: "bg-warn-soft text-warn", ring: "border-warn bg-warn-soft text-warn" },
};

const alwaysHuman = [
  "Deciding which changes matter to a deal",
  "Every line a rep will say to a customer",
  "Pricing claims and comparison pages (with Legal)",
  "Leadership asks in the So what",
  "Mystery-shop calls and win-loss interviews",
];

const needs = [
  "About half a day of my time each Monday",
  "A GitHub repo with a scheduled job",
  "An Anthropic API key, stored as a repo secret",
  "Read-only exports from the call recorder and the CRM",
];

export function WeeklyRun() {
  return (
    <section id="weekly-run" className="scroll-mt-32">
      <h2 className="text-xl font-semibold tracking-tight">The weekly run: what&apos;s automated, and where a person steps in</h2>
      <p className="mt-1 max-w-3xl text-sm text-pretty text-muted">
        Every Monday morning, step by step. This sample site doesn&apos;t scrape; its data shows what one run would produce.
      </p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs" aria-label="Legend">
        {(Object.keys(tone) as (keyof typeof tone)[]).map((k) => {
          const { label, icon: Icon, chip } = tone[k];
          return (
            <span key={k} className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium ${chip}`}>
              <Icon className="size-3" aria-hidden />
              {label}
            </span>
          );
        })}
      </div>

      <ol className="relative mt-5 space-y-3 border-l-2 border-line pl-6 sm:ml-4">
        {steps.map((s, i) => {
          const t = tone[s.who];
          return (
            <li key={s.title} className="animate-rise relative" style={{ animationDelay: `${i * 80}ms` }}>
              <span className={`absolute top-3 -left-[2.4rem] grid size-8 place-items-center rounded-full border-2 ${t.ring}`}>
                <s.icon className="size-4" aria-hidden />
              </span>
              <div
                className={`rounded-xl border bg-surface p-4 ${s.who === "human" ? "border-warn/40" : "border-line"}`}
              >
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted">{s.time}</span>
                  <span className="font-semibold">{s.title}</span>
                  <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${t.chip}`}>
                    <t.icon className="size-3" aria-hidden />
                    {t.label}
                  </span>
                </p>
                <p className="mt-1.5 text-sm text-pretty text-muted">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-warn/40 bg-warn-soft p-5">
          <h3 className="flex items-center gap-2 font-semibold text-warn">
            <UserCheck className="size-4" aria-hidden />
            Always a person
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {alwaysHuman.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-warn" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <FileCheck2 className="size-4 text-accent" aria-hidden />
            What it takes to turn on
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {needs.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 flex items-start gap-1.5 text-xs text-pretty text-muted">
            <Diff className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            A first version of the pipeline is in this repo (scripts/radar.py): it fetches, compares, and drafts. It runs
            on the sample snapshots today. Headless browsing and RSS reading would be added before it points at live
            sites.
          </p>
        </div>
      </div>
    </section>
  );
}
