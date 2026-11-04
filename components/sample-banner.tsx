import { FlaskConical } from "lucide-react";
import { formatShortDate } from "@/lib/format";
import { lastRun, sampleDisclaimer } from "@/lib/site";

export function SampleBanner() {
  return (
    <div
      role="note"
      className="mb-6 flex items-start gap-2.5 rounded-lg border border-warn/30 bg-warn-soft px-3.5 py-2.5 text-sm text-warn"
    >
      <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>
        <strong className="font-semibold">{sampleDisclaimer}</strong>{" "}
        <span className="opacity-90">
          Housecall Pro, Jobber, and ServiceTitan are real. Every customer, prospect, and person named here is
          invented, and so are the events and quotes.
          {/* Phones get the short version; the header's "Updated weekly" badge is hidden there. */}
          <span className="sm:hidden"> Updated weekly from Jobber and ServiceTitan pages and blogs.</span>
          <span className="hidden sm:inline">
            {" "}
            In production Dispatch refreshes every Monday by scraping Jobber and ServiceTitan pages and blogs (this
            sample: {formatShortDate(lastRun)} run).
          </span>
        </span>
      </p>
    </div>
  );
}
