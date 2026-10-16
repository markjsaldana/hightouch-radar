import type { Metadata } from "next";
import { MatrixTable } from "@/components/matrix-table";
import { PageHeader } from "@/components/page-header";
import { PositioningMap } from "@/components/positioning-map";

export const metadata: Metadata = { title: "Matrix & map" };

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="06 · Matrix & map"
        title="Comparison matrix and positioning map"
        lede="The matrix answers 'can they do X?' for each buyer. The map shows where each player is headed."
        sample
      />

      <section>
        <h2 className="text-xl font-semibold tracking-tight">Capability matrix</h2>
        <p className="mt-1 max-w-2xl text-sm text-pretty text-muted">
          Grouped by what each persona cares about. Each cell has a source note. Signals from the Radar change cells
          when a competitor ships something (look for the signal numbers in the notes).
        </p>
        <div className="mt-4">
          <MatrixTable />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">Positioning map</h2>
        <p className="mt-1 max-w-2xl text-sm text-pretty text-muted">
          Packaged vs. composable on one axis, and who drives the purchase on the other. It&apos;s a point of view, so it&apos;s
          labeled that way.
        </p>
        <div className="mt-4">
          <PositioningMap />
        </div>
      </section>
    </>
  );
}
