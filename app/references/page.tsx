import type { Metadata } from "next";
import { Lock, Quote } from "lucide-react";
import { Chip } from "@/components/badges";
import { PageHeader } from "@/components/page-header";
import { ReferenceFinder } from "@/components/reference-finder";
import { caseStudies, competitorName, customerById } from "@/lib/data";

export const metadata: Metadata = { title: "References" };

const rules = [
  "Request through the account's CSM, never by contacting the customer directly.",
  "Each reference takes at most 3 calls a quarter. After that they're marked Resting.",
  "Match on at least two of use case, geo, industry, and competitor. Geo matters most in EMEA, because of data residency.",
  "Log every call so CS can thank the customer and the next rep sees when they were last used.",
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="07 · References"
        title="Customer references and case studies"
        lede="Find the customer a prospect will believe: same use case, same region, same competitor. The deal assistant picks from this list too."
        sample
      />

      <section>
        <h2 className="text-xl font-semibold tracking-tight">Reference customers</h2>
        <p className="mt-1 max-w-2xl text-sm text-pretty text-muted">
          Customers who have agreed to talk to prospects. Filter by what the prospect cares about.
        </p>
        <div className="mt-4">
          <ReferenceFinder />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-surface-2 p-5">
        <h2 className="font-semibold">How references stay healthy</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {rules.map((r) => (
            <li key={r} className="flex gap-2.5">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span className="text-pretty">{r}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">Case studies</h2>
        <p className="mt-1 max-w-2xl text-sm text-pretty text-muted">
          Public stories can go in any email. Internal-only stories are for reps to tell on calls, so keep them out of email.
        </p>
        <ul className="mt-4 grid gap-4 lg:grid-cols-2">
          {caseStudies.map((cs) => {
            const customer = customerById(cs.customerId)!;
            return (
              <li
                key={cs.id}
                id={`cs-${cs.id}`}
                className="flex scroll-mt-32 flex-col rounded-xl border border-line bg-surface p-5 target:ring-2 target:ring-accent"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="font-medium text-fg">{customer.name}</span>
                  <span>
                    {customer.industry} · {customer.region}
                  </span>
                  {cs.visibility === "Internal only" ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-warn-soft px-1.5 py-0.5 font-medium text-warn">
                      <Lock className="size-3" aria-hidden />
                      Internal only
                    </span>
                  ) : null}
                  {customer.reference ? (
                    <a
                      href={`#ref-${customer.id}`}
                      className="rounded-md bg-good-soft px-1.5 py-0.5 font-medium text-good hover:underline"
                    >
                      Reference available
                    </a>
                  ) : null}
                </div>
                <h3 className="mt-2 font-semibold text-pretty">{cs.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {cs.useCases.map((u) => (
                    <Chip key={u}>{u}</Chip>
                  ))}
                  {customer.competitor ? (
                    <Chip>
                      {customer.competitor.outcome} {competitorName(customer.competitor.id)}
                    </Chip>
                  ) : null}
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium tracking-wide text-muted uppercase">Challenge</dt>
                    <dd className="mt-0.5 text-pretty">{cs.challenge}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium tracking-wide text-muted uppercase">What they did</dt>
                    <dd className="mt-0.5 text-pretty">{cs.solution}</dd>
                  </div>
                </dl>

                <dl className="mt-4 flex flex-wrap gap-px overflow-hidden rounded-lg border border-line bg-line">
                  {cs.results.map((r) => (
                    <div key={r.label} className="flex min-w-32 flex-1 flex-col-reverse bg-surface-2 px-3 py-2.5">
                      <dt className="mt-0.5 text-xs text-muted">{r.label}</dt>
                      <dd className="font-semibold tabular-nums">{r.value}</dd>
                    </div>
                  ))}
                </dl>

                <blockquote className="mt-auto flex gap-2 pt-4 text-sm">
                  <Quote className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  <p className="text-pretty">
                    {cs.quote.text} <span className="text-muted">({cs.quote.role})</span>
                  </p>
                </blockquote>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
