import type { Metadata } from "next";
import { ExternalLink, FlaskConical, Lightbulb, PhoneCall } from "lucide-react";
import { LossReasonsChart, type LossReason } from "@/components/loss-reasons-chart";
import { PageHeader } from "@/components/page-header";
import { ResearchRequest } from "@/components/research-request";
import { eyebrowFor } from "@/lib/nav";

export const metadata: Metadata = { title: "Service Plans Brief" };

type Rating = "strong" | "moderate" | "validate";

const ratingStyle: Record<Rating, { label: string; cell: string; dot: string }> = {
  strong: { label: "Strong", cell: "bg-good-soft text-good", dot: "bg-good" },
  moderate: { label: "Moderate", cell: "bg-warn-soft text-warn", dot: "bg-warn" },
  validate: { label: "To validate", cell: "bg-surface-2 text-muted", dot: "bg-muted" },
};

const players = ["Housecall Pro", "ServiceTitan", "Jobber"];

const snapshot: { capability: string; cells: { text: string; rating: Rating }[] }[] = [
  {
    capability: "Plan setup flexibility",
    cells: [
      { text: "Simple", rating: "moderate" },
      { text: "Deepest", rating: "strong" },
      { text: "Basic", rating: "moderate" },
    ],
  },
  {
    capability: "Selling a plan in the field",
    cells: [
      { text: "Shipped: plans on jobs and estimates", rating: "strong" },
      { text: "Strong", rating: "strong" },
      { text: "Limited", rating: "moderate" },
    ],
  },
  {
    capability: "Recurring job scheduling",
    cells: [
      { text: "Good", rating: "moderate" },
      { text: "Strong", rating: "strong" },
      { text: "Strong", rating: "strong" },
    ],
  },
];

const sources = [
  { label: "ServiceTitan: ServiceTitan vs. Jobber", href: "https://www.servicetitan.com:443/comparison/servicetitan-vs-jobber" },
  { label: "Housecall Pro", href: "https://www.housecallpro.com/?p=99270" },
  { label: "Capterra: Jobber vs. Housecall Pro", href: "https://www.capterra.com/compare/127994-140363/Jobber-vs-HouseCall-Pro" },
  {
    label: "Housecall Pro: HVAC, plumbing, and electrical software",
    href: "https://www.housecallpro.com/resources/trade-specific-software-hvac-plumbing-electrical/",
  },
];

const lossReasons: LossReason[] = [
  { reason: "Needed custom plan tiers", lostTo: "ServiceTitan", share: 38 },
  { reason: "Recurring crew scheduling", lostTo: "Jobber", share: 22 },
  { reason: "Price", lostTo: "Jobber", share: 18 },
  { reason: "Other", lostTo: null, share: 22 },
];

const soWhat = [
  {
    label: "Status",
    text: "Membership plans on jobs and estimates are already live in the HVAC, Plumbing and Electrical packages. The open question is adoption.",
  },
  { label: "Metric", text: "Measure how often techs attach a plan to an estimate or job, by trade." },
  {
    label: "Research",
    text: "Interview techs who don't offer plans to find out what stops them: training, pricing confidence, or the flow itself.",
  },
];

const validateFirst = [
  "5 calls with techs who rarely attach a plan to estimates or jobs",
  "5 calls with Pros who left for ServiceTitan over membership flexibility",
];

function Card({ title, badge, children }: { title: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col rounded-xl border border-line bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {badge}
      </div>
      <div className="mt-5 flex-1">{children}</div>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow={eyebrowFor("/service-plans")}
        title="Service Plans: where Housecall Pro wins and where it's exposed"
        lede="Week-one brief for the Recurring Jobs + Service Plans PM"
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Competitive snapshot">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-separate border-spacing-1 text-sm">
              <thead>
                <tr>
                  <th className="w-[31%]" />
                  {players.map((p, i) => (
                    <th key={p} scope="col" className={`px-1 pb-1 text-center text-xs font-semibold sm:text-sm ${i === 0 ? "text-accent" : ""}`}>
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {snapshot.map((row) => (
                  <tr key={row.capability}>
                    <th scope="row" className="py-2 pr-2 text-left text-xs font-medium text-pretty sm:text-sm">
                      {row.capability}
                    </th>
                    {row.cells.map((c, i) => (
                      <td
                        key={players[i]}
                        className={`rounded-lg px-1 py-3 text-center text-xs font-medium sm:text-sm ${ratingStyle[c.rating].cell}`}
                      >
                        {c.text}
                        <span className="sr-only"> ({ratingStyle[c.rating].label})</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted" aria-label="Legend">
            {/* Only the ratings the table uses, in strong-to-weak order. */}
            {(Object.keys(ratingStyle) as Rating[])
              .filter((r) => snapshot.some((row) => row.cells.some((c) => c.rating === r)))
              .map((r) => (
              <span key={r} className="inline-flex items-center gap-1.5">
                <span className={`size-2.5 rounded-full ${ratingStyle[r].dot}`} aria-hidden />
                {ratingStyle[r].label}
              </span>
            ))}
          </div>

          <div className="mt-4 border-t border-line pt-3 text-xs text-muted">
            <p className="font-medium">Sources</p>
            <ul className="mt-1 space-y-0.5">
              {sources.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 py-0.5 hover:text-accent hover:underline"
                  >
                    {s.label}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card
          title="Why deals are lost"
          badge={
            <span className="inline-flex items-center gap-1 rounded-full border border-warn/40 bg-warn-soft px-2.5 py-0.5 text-xs font-semibold text-warn">
              <FlaskConical className="size-3.5" aria-hidden />
              Sample data
            </span>
          }
        >
          <p className="mb-4 text-xs text-muted">Share of lost service-plan deals, by the reason given</p>
          <LossReasonsChart reasons={lossReasons} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="min-w-0 rounded-xl border-2 border-accent bg-accent-soft p-4 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-accent">
            <Lightbulb className="size-5" aria-hidden />
            So what for Product
          </h2>
          <dl className="mt-5 space-y-4">
            {soWhat.map((item) => (
              <div key={item.label} className="grid gap-1 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
                <dt className="text-xs font-semibold tracking-wide text-accent uppercase sm:pt-1">{item.label}</dt>
                <dd className="text-base text-pretty">{item.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Card title="What I'd validate first">
          <ul className="space-y-3">
            {validateFirst.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <PhoneCall className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <ResearchRequest />
          </div>
        </Card>
      </div>

      {/* Deliberately lighter than the sections above: an idea, not a finding. */}
      <section className="mt-6 rounded-xl border border-dashed border-line bg-surface-2/60 px-5 py-4">
        <h2 className="text-sm font-semibold">One bet worth exploring</h2>
        <p className="mt-1.5 max-w-3xl text-sm text-pretty">
          When a tech services an older AC unit or water heater, the estimate automatically suggests a maintenance plan.
          Older equipment needs more upkeep, so these homeowners are the most likely to sign up.
        </p>
        <p className="mt-2 text-xs text-muted">Hypothesis to test before it becomes a recommendation.</p>
      </section>

      <p className="mt-8 border-t border-line pt-4 text-sm text-muted">
        Prepared by Mark Saldaña. Competitive data from public sources; loss data is illustrative.
      </p>
    </>
  );
}
