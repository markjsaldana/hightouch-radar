"use client";

import { useRef, useState } from "react";
import { ArrowDown, FileDiff, Lock } from "lucide-react";
import { SignalCard } from "@/components/signal-card";
import { useInView } from "@/lib/use-in-view";
import { competitorName, competitors, signals, sources } from "@/lib/data";
import type { SnapshotDiff } from "@/lib/diff";

type Filter = "all" | "internal" | string;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...competitors.map((c) => ({ id: c.id, label: c.name })),
  { id: "internal", label: "Category & internal" },
];

// Snapshots are stored as markdown. Show headings and bullets the way a reader
// would see them on the page, without the # and - markers.
function isHeading(text: string) {
  return /^#+\s/.test(text);
}

function readable(text: string) {
  return text.replace(/^#+\s+/, "").replace(/^-\s+/, "• ");
}

function matches(filter: Filter, competitorId: string) {
  if (filter === "all") return true;
  if (filter === "internal") return competitorId === "category";
  return competitorId === filter;
}

export function SourceExplorer({
  diffs,
  initialSource,
}: {
  diffs: Record<string, SnapshotDiff>;
  initialSource: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState(initialSource);
  const panelRef = useRef<HTMLDivElement>(null);
  const [diffRef, diffSeen] = useInView<HTMLPreElement>(0.4);

  const visible = sources.filter((s) => matches(filter, s.competitorId));
  const selected = sources.find((s) => s.id === selectedId)!;
  const produced = signals.filter((s) => s.sourceId === selected.id);
  const diff = selected.snapshot ? diffs[selected.snapshot] : undefined;
  const demoSources = sources.filter((s) => s.snapshot);

  function select(id: string) {
    setSelectedId(id);
    // On narrow screens the panel sits below the list, so bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm">
        <FileDiff className="size-4 text-accent" aria-hidden />
        <span className="font-medium">See a before-and-after:</span>
        {demoSources.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => select(s.id)}
            aria-pressed={s.id === selectedId}
            className={`rounded-full border px-3 py-1 transition-colors ${
              s.id === selectedId
                ? "border-accent bg-accent text-accent-fg"
                : "border-accent/30 bg-surface text-fg hover:border-accent"
            }`}
          >
            {competitorName(s.competitorId)} {s.type}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div>
          <div role="group" aria-label="Filter sources" className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`rounded-md px-2 py-1 text-xs transition-colors ${
                  filter === f.id ? "bg-fg text-bg" : "bg-surface-2 text-muted hover:text-fg"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <ul className="mt-3 max-h-[34rem] divide-y divide-line overflow-y-auto rounded-xl border border-line bg-surface">
            {visible.map((s) => {
              const count = signals.filter((sig) => sig.sourceId === s.id).length;
              const active = s.id === selectedId;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => select(s.id)}
                    aria-current={active ? "true" : undefined}
                    className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm transition-colors ${
                      active ? "bg-accent-soft" : "hover:bg-surface-2"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className={`block font-medium ${active ? "text-accent" : ""}`}>
                        {competitorName(s.competitorId)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted">
                        {s.internal ? <Lock className="size-3" aria-label="Internal source" /> : null}
                        {s.type} · {s.frequency.toLowerCase()}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      {s.snapshot ? (
                        <span className="rounded bg-accent px-1.5 py-0.5 text-[11px] font-medium text-accent-fg">
                          Before/after
                        </span>
                      ) : null}
                      {count ? (
                        <span className="text-[11px] text-muted">
                          {count} signal{count > 1 ? "s" : ""}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div ref={panelRef} className="min-w-0 scroll-mt-32 space-y-4" aria-live="polite">
          <div className="rounded-xl border border-line bg-surface p-5">
            <p className="font-mono text-xs text-muted">Source</p>
            <h3 className="mt-1 text-lg font-semibold">
              {competitorName(selected.competitorId)} {selected.type}
            </h3>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6 sm:gap-y-2">
              <dt className="text-muted">Where</dt>
              <dd className="text-pretty">
                {/* Placeholder URLs (<...>) read as code, so describe the page instead. */}
                {selected.url.startsWith("<")
                  ? `${competitorName(selected.competitorId)}'s public ${selected.type}`
                  : selected.url}
              </dd>
              <dt className="text-muted">Checked</dt>
              <dd>
                {selected.frequency}
                {selected.internal ? " · internal" : ""}
              </dd>
              <dt className="text-muted">Looking for</dt>
              <dd className="text-pretty">{selected.lookFor}</dd>
            </dl>
          </div>

          {diff ? (
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
                <div>
                  <p className="text-sm font-medium">What changed since the last check</p>
                  <p className="mt-0.5 text-xs text-muted">
                    <span className="text-good">Green</span> = added · <span className="text-bad">red</span> =
                    removed · <span className="line-through">struck through</span> = cosmetic, ignored
                  </p>
                </div>
                <p className="text-xs text-muted">
                  <span className="font-medium text-fg">{diff.meaningful}</span> meaningful line
                  {diff.meaningful === 1 ? "" : "s"} · {diff.cosmetic} cosmetic ignored
                </p>
              </div>
              {/* Keyed by source so each selection replays: removed lines flag red, then added lines type in. */}
              <pre key={selected.id} ref={diffRef} className="overflow-x-auto py-2 font-sans text-[13px] leading-6">
                {diff.lines.map((line, i) => {
                  const changed = diff.lines.slice(0, i).filter((l) => l.kind !== "same").length;
                  const motion =
                    line.kind === "same" || !diffSeen
                      ? ""
                      : line.kind === "del"
                        ? "animate-flag"
                        : "animate-type";
                  const tone =
                    line.kind === "same"
                      ? "text-muted"
                      : line.cosmetic
                        ? "text-muted"
                        : line.kind === "add"
                          ? "bg-good-soft text-good"
                          : "bg-bad-soft text-bad";
                  const mark = line.kind === "add" ? "+" : line.kind === "del" ? "−" : " ";
                  return (
                    <div
                      key={i}
                      className={`flex px-5 ${tone} ${motion}`}
                      style={motion ? { animationDelay: `${300 + changed * 700}ms` } : undefined}
                    >
                      <span className="w-5 shrink-0 select-none" aria-hidden>
                        {mark}
                      </span>
                      <span
                        className={`whitespace-pre-wrap ${line.cosmetic ? "line-through decoration-muted/50" : ""} ${
                          isHeading(line.text) ? "font-semibold" : ""
                        }`}
                      >
                        {readable(line.text) || " "}
                      </span>
                      {line.cosmetic && line.kind === "add" ? (
                        <span className="ml-auto pl-4 font-sans text-[11px] whitespace-nowrap">
                          cosmetic, ignored
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </pre>
            </div>
          ) : null}

          {produced.length ? (
            <>
              <div className="flex items-center gap-2 text-sm text-muted">
                <ArrowDown className="size-4" aria-hidden />
                {diff
                  ? "Classified and scored into:"
                  : "No saved before-and-after for this one, but it produced:"}
              </div>
              {produced.map((s) => (
                <SignalCard key={s.id} signal={s} />
              ))}
            </>
          ) : (
            <p className="rounded-xl border border-dashed border-line px-5 py-4 text-sm text-muted">
              No meaningful change from this source in the last 3 weeks. It&apos;s still checked{" "}
              {selected.frequency.toLowerCase()}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
