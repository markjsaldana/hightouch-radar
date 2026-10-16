"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Bot, Check, CircleCheck, ClipboardList, Copy, FileText, Mail, RotateCcw, Sparkles, Upload } from "lucide-react";
import { battlecard, caseStudyById, competitorName, customerById, transcriptDemo as demo } from "@/lib/data";
import type { DealResource, DemoEmail } from "@/lib/types";

type Path = "transcript" | "form";

// A step is one chat bubble. Bot bubbles reveal their rows one at a time.
type Step = { from: "bot" | "rep"; rows: ReactNode[]; wait?: number };

// Milliseconds before each beat appears. Bot bubbles show the typing dots first.
const REP_DELAY = 900;
const BOT_DELAY = 1100;
const ROW_DELAY = 550;

const competitor = competitorName(demo.prospect.competitorId);

function TypingDots() {
  return (
    <span className="flex gap-1 py-1" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="animate-typing size-1.5 rounded-full bg-muted" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </span>
  );
}

function BotBubble({ children }: { children: ReactNode }) {
  return (
    <div className="animate-rise flex max-w-2xl gap-3">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
        <Bot className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 space-y-2 rounded-lg rounded-tl-sm border border-line bg-surface px-4 py-2.5">
        {children}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="pt-2 text-xs font-medium tracking-wide text-muted uppercase">{children}</p>;
}

function resourceInfo(r: DealResource) {
  if (r.kind === "caseStudy") {
    const cs = caseStudyById(r.ref)!;
    const customer = customerById(cs.customerId)!;
    return {
      label: "Case study",
      title: cs.title,
      meta: `${customer.name}${cs.visibility === "Internal only" ? " · internal only" : ""}`,
      href: `/references#cs-${cs.id}`,
    };
  }
  if (r.kind === "reference") {
    const c = customerById(r.ref)!;
    return {
      label: "Reference call",
      title: `${c.reference!.contactRole}, ${c.name}`,
      meta: `${c.region} · ${c.reference!.status.toLowerCase()}`,
      href: `/references#ref-${c.id}`,
    };
  }
  const i = Number(r.ref);
  return {
    label: "Talk track",
    title: battlecard.objections[i].objection.replace(/^"|"$/g, ""),
    meta: `${competitor} battlecard`,
    href: `/battlecard#objection-${i}`,
  };
}

function ChoiceCard({ path, onChoose }: { path: Path | null; onChoose: (p: Path) => void }) {
  const options = [
    { id: "transcript" as const, icon: Upload, title: "Upload a call transcript", note: "Concerns come ranked, in the buyer's own words." },
    { id: "form" as const, icon: ClipboardList, title: "Fill out a short form", note: "Six fields, for when there's no recording." },
  ];
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map(({ id, icon: Icon, title, note }) => {
        const chosen = path === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChoose(id)}
            aria-pressed={chosen}
            className={`relative rounded-lg border p-3 text-left transition-colors ${
              chosen ? "border-accent bg-accent-soft" : "border-line hover:border-accent/50"
            }`}
          >
            {id === "transcript" ? (
              <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-medium text-accent-fg">
                <Sparkles className="size-3" aria-hidden />
                Recommended
              </span>
            ) : null}
            <Icon className={`size-4 ${chosen ? "text-accent" : "text-muted"}`} aria-hidden />
            <span className="mt-2 block font-medium">{title}</span>
            <span className="mt-0.5 block text-xs text-pretty text-muted">{note}</span>
          </button>
        );
      })}
    </div>
  );
}

function ContextRow() {
  const p = demo.prospect;
  const chips = [p.industry, p.size, p.region, `Buyers: ${p.personas.join(" + ")}`, `vs. ${competitor}`, `${p.stage} · ${p.nextStep}`];
  return (
    <div>
      <p className="font-medium">{p.name}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span key={c} className="rounded-md border border-line px-1.5 py-0.5 text-xs text-muted">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function ConcernRow({ rank, fromForm }: { rank: number; fromForm?: boolean }) {
  const c = demo.concerns[rank - 1];
  return (
    <div className="flex gap-3 rounded-lg bg-surface-2 p-3">
      <span className="font-mono text-xs leading-5 text-accent">{rank}</span>
      <div className="min-w-0 space-y-1">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-medium">{c.concern}</span>
          {fromForm ? null : <span className="text-xs text-muted">raised {c.mentions}×</span>}
        </p>
        {fromForm ? (
          <p className="text-xs text-muted">From the form. No quote, no count.</p>
        ) : (
          <p className="text-pretty">
            <span className="italic">“{c.quote}”</span>{" "}
            <span className="text-xs text-muted">
              {c.speaker} · {c.at}
            </span>
          </p>
        )}
        {c.objection !== undefined ? (
          <a href={`/battlecard#objection-${c.objection}`} className="inline-flex items-center gap-0.5 text-xs font-medium text-accent hover:underline">
            Talk track <ArrowUpRight className="size-3" aria-hidden />
          </a>
        ) : null}
      </div>
    </div>
  );
}

// `concerns`: the concern ranks shown in this answer, so a row never cites one that isn't there.
function ResourceRow({ rank, concerns }: { rank: number; concerns: number[] }) {
  const r = demo.resources[rank - 1];
  const answers = r.addresses.filter((n) => concerns.includes(n));
  const info = resourceInfo(r);
  return (
    <div className="flex gap-3">
      <span className="font-mono text-xs leading-5 text-accent">{rank}</span>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-xs font-medium text-accent">{info.label}</span>
          <a href={info.href} className="inline-flex items-center gap-0.5 font-medium text-pretty hover:text-accent hover:underline">
            {info.title}
            <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
          </a>
        </p>
        <p className="mt-1 text-pretty text-muted">{r.why}</p>
        <p className="mt-0.5 text-xs text-muted">
          {info.meta} · answers concern {answers.join(" & ")}
        </p>
      </div>
    </div>
  );
}

// `chosen` highlights the picked option once the rep has answered.
function emailLink(rank: number) {
  return resourceInfo(demo.resources[rank - 1]).href;
}

function EmailCard({ email }: { email: DemoEmail }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    // Plain text with full URLs, ready to paste into any email client.
    const body = email.paragraphs
      .map((p) => (p.resource ? `${p.text}\n${p.linkText}: ${window.location.origin}${emailLink(p.resource)}` : p.text))
      .join("\n\n");
    navigator.clipboard
      ?.writeText(`Subject: ${email.subject}\n\n${body}\n\n${email.signoff}`)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-line bg-surface-2 px-3 py-2 text-xs">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
          <dt className="text-muted">To</dt>
          <dd>{email.to}</dd>
          <dt className="text-muted">Subject</dt>
          <dd className="font-medium">{email.subject}</dd>
        </dl>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2 py-1 text-muted transition-colors hover:text-fg"
        >
          {copied ? <Check className="size-3.5 text-good" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="space-y-2.5 px-3 py-3">
        {email.paragraphs.map((p) => (
          <p key={p.text} className="text-pretty">
            {p.text}
            {p.resource ? (
              <>
                {" "}
                <a href={emailLink(p.resource)} className="font-medium text-accent hover:underline">
                  {p.linkText}
                </a>
              </>
            ) : null}
          </p>
        ))}
        <p>{email.signoff}</p>
      </div>
    </div>
  );
}

function emailStep(email: DemoEmail): Step {
  return {
    from: "bot",
    rows: [
      <p key="h" className="flex items-center gap-2 font-medium">
        <Mail className="size-4 text-accent" aria-hidden />
        Follow-up email, ready to send
      </p>,
      <EmailCard key="email" email={email} />,
      <p key="note" className="text-xs text-muted">
        Links go to public case studies only. Internal-only stories stay out of customer email.
      </p>,
    ],
  };
}

function buildSteps(path: Path, chosen: Path | null, choose: (p: Path) => void): Step[] {
  const intro: Step = {
    from: "bot",
    rows: [
      <p key="ask">Give me the deal context. A call transcript gets you the sharpest answer.</p>,
      <ChoiceCard key="choice" path={chosen} onChoose={choose} />,
    ],
  };

  if (path === "transcript") {
    return [
      intro,
      {
        from: "rep",
        rows: [
          <span key="file" className="flex items-center gap-3">
            <FileText className="size-5 shrink-0" aria-hidden />
            <span>
              <span className="block font-medium">{demo.file.name}</span>
              <span className="block text-xs opacity-80">
                {demo.file.source} · {demo.file.duration} · {demo.file.speakers} speakers
              </span>
            </span>
          </span>,
        ],
      },
      {
        from: "bot",
        rows: [
          <p key="h" className="font-medium">
            Reading the transcript…
          </p>,
          ...demo.parsing.map((line) => (
            <p key={line} className="flex gap-2 text-muted">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-good" aria-hidden />
              <span className="text-pretty">{line}</span>
            </p>
          )),
        ],
      },
      {
        from: "bot",
        wait: 1600,
        rows: [
          <ContextRow key="ctx" />,
          <SectionLabel key="cl">Top concerns, ranked by how often they came up</SectionLabel>,
          ...demo.concerns.map((_, i) => <ConcernRow key={`c${i}`} rank={i + 1} />),
          <SectionLabel key="rl">Resources most likely to close this deal</SectionLabel>,
          ...demo.resources.map((_, i) => <ResourceRow key={`r${i}`} rank={i + 1} concerns={demo.concerns.map((_, n) => n + 1)} />),
          <p key="src" className="pt-1 font-mono text-xs text-muted">
            Sources: {demo.file.name} · References · {competitor} battlecard (objections)
          </p>,
        ],
      },
      emailStep(demo.email),
    ];
  }

  return [
    intro,
    {
      from: "rep",
      rows: [
        <dl key="form" className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          {demo.form.fields.map((f) => (
            <div key={f.label} className="contents">
              <dt className="text-xs opacity-80">{f.label}</dt>
              <dd className="font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>,
      ],
    },
    {
      from: "bot",
      wait: 1600,
      rows: [
        <ContextRow key="ctx" />,
        <SectionLabel key="cl">Concern you entered</SectionLabel>,
        ...demo.form.concerns.map((rank) => <ConcernRow key={`c${rank}`} rank={rank} fromForm />),
        <SectionLabel key="rl">Resources most likely to close this deal</SectionLabel>,
        ...demo.form.resources.map((rank) => <ResourceRow key={`r${rank}`} rank={rank} concerns={demo.form.concerns} />),
        <div key="tip" className="rounded-lg border border-accent/30 bg-accent-soft p-3">
          <p className="text-pretty">{demo.form.missed}</p>
          <button
            type="button"
            onClick={() => choose("transcript")}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
          >
            <Upload className="size-3.5" aria-hidden />
            See the transcript version
          </button>
        </div>,
      ],
    },
    emailStep(demo.form.email),
  ];
}

export function DealAssistant() {
  const [path, setPath] = useState<Path>("transcript");
  const [run, setRun] = useState(0);
  // Beats revealed so far, counted across every row of every step.
  const [beats, setBeats] = useState(0);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  function choose(next: Path) {
    setPath(next);
    setStarted(true);
    setRun((r) => r + 1);
  }

  // The intro bubble has two rows (question, choice card); the rep answers after them.
  const steps = buildSteps(path, beats > 2 ? path : null, choose);
  const total = steps.reduce((n, s) => n + s.rows.length, 0);

  // Start when the demo scrolls into view.
  useEffect(() => {
    const node = ref.current;
    if (!node || started) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setStarted(true);
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const clear = () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
    clear();
    // Every update goes through a timer, including the reset, so the effect only schedules.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timers.current.push(window.setTimeout(() => setBeats(total), 0));
      return clear;
    }
    timers.current.push(
      window.setTimeout(() => {
        setTyping(false);
        setBeats(0);
      }, 0),
    );
    let t = 300;
    let beat = 0;
    for (const step of steps) {
      step.rows.forEach((_, row) => {
        if (row === 0 && step.from === "bot") {
          timers.current.push(window.setTimeout(() => setTyping(true), t));
          t += step.wait ?? BOT_DELAY;
        } else {
          t += row === 0 ? REP_DELAY : ROW_DELAY;
        }
        const next = ++beat;
        timers.current.push(
          window.setTimeout(() => {
            setTyping(false);
            setBeats(next);
          }, t),
        );
      });
    }
    return clear;
    // steps is rebuilt every render; path and run are what change the script.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, path, run, total]);

  const done = beats >= total;
  // Each step's first beat, so a step knows how many of its rows to show.
  const starts = steps.map((_, i) => steps.slice(0, i).reduce((n, s) => n + s.rows.length, 0));

  return (
    <div ref={ref} className="min-h-[80rem] space-y-3 text-sm sm:min-h-[68rem]">
      {steps.map((step, i) => {
        const shown = Math.min(step.rows.length, beats - starts[i]);
        if (shown <= 0) return null;
        return step.from === "rep" ? (
          <div
            key={`${run}-${i}`}
            className="animate-rise ml-auto w-fit max-w-md rounded-lg rounded-br-sm bg-accent px-4 py-2.5 text-accent-fg"
          >
            {step.rows[0]}
          </div>
        ) : (
          <BotBubble key={`${run}-${i}`}>
            {step.rows.slice(0, shown).map((row, r) => (
              <div key={r} className="animate-rise">
                {row}
              </div>
            ))}
          </BotBubble>
        );
      })}
      {typing ? (
        <BotBubble>
          <TypingDots />
        </BotBubble>
      ) : null}
      {done ? (
        <div className="animate-rise mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:text-fg"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Replay
          </button>
          <button
            type="button"
            onClick={() => choose(path === "transcript" ? "form" : "transcript")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:text-fg"
          >
            {path === "transcript" ? <ClipboardList className="size-3.5" aria-hidden /> : <Upload className="size-3.5" aria-hidden />}
            {path === "transcript" ? "Try the form instead" : "Try the transcript instead"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
