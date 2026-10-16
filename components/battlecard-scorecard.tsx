import { competitorName, matrix } from "@/lib/data";
import type { MatrixMark } from "@/lib/types";

const fill: Record<MatrixMark, number> = { yes: 1, partial: 0.5, no: 0 };
const word: Record<MatrixMark, string> = { yes: "Yes", partial: "Partial", no: "No" };

// Circle filled all the way, half, or not at all.
function Ball({ mark, us, delay }: { mark: MatrixMark; us: boolean; delay: number }) {
  const f = fill[mark];
  return (
    <svg viewBox="0 0 20 20" className="animate-rise size-5" style={{ animationDelay: `${delay}ms` }} aria-hidden>
      <circle cx="10" cy="10" r="8" fill="none" strokeWidth="2" className={us ? "stroke-accent" : "stroke-muted"} />
      {f === 1 ? <circle cx="10" cy="10" r="8" className={us ? "fill-accent" : "fill-muted"} /> : null}
      {f === 0.5 ? <path d="M10 2 A8 8 0 0 1 10 18 Z" className={us ? "fill-accent" : "fill-muted"} /> : null}
    </svg>
  );
}

// Hightouch against one competitor, capability by capability, from the matrix.
export function BattlecardScorecard({ competitorId }: { competitorId: string }) {
  const them = competitorName(competitorId);
  let n = 0;
  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">Scorecard: Hightouch vs. {them}</h2>
        <p className="flex items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Ball mark="yes" us delay={0} /> Hightouch
          </span>
          <span className="inline-flex items-center gap-1">
            <Ball mark="yes" us={false} delay={0} /> {them}
          </span>
          <span>Full = yes · half = partial · empty = no</span>
        </p>
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {matrix.groups.map((g) => (
          <div key={g.persona}>
            <p className="text-xs font-medium tracking-wide text-muted uppercase">{g.persona}</p>
            <ul className="mt-2 divide-y divide-line">
              {g.capabilities.map((cap) => {
                const ours = cap.cells.hightouch;
                const theirs = cap.cells[competitorId];
                const delay = 100 + n++ * 60;
                return (
                  <li key={cap.name} className="flex items-center gap-3 py-2 text-sm">
                    <span className="min-w-0 flex-1 text-pretty">{cap.name}</span>
                    <span title={`Hightouch: ${word[ours.mark]}. ${ours.note}`}>
                      <Ball mark={ours.mark} us delay={delay} />
                      <span className="sr-only">Hightouch {word[ours.mark]}</span>
                    </span>
                    <span title={`${them}: ${word[theirs.mark]}. ${theirs.note}`}>
                      <Ball mark={theirs.mark} us={false} delay={delay + 30} />
                      <span className="sr-only">
                        {them} {word[theirs.mark]}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
