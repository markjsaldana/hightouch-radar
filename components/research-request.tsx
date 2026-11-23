"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CircleCheck, Send, X } from "lucide-react";
import { formatLongDate } from "@/lib/format";

type Sent = { question: string; pm: string; due: string };

// A demo form: it opens in a dialog, checks the fields, and shows a
// confirmation. Nothing is sent anywhere.
export function ResearchRequest() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);
  const first = useRef<HTMLTextAreaElement>(null);
  const uid = useId();

  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSent({ question: String(data.get("question")), pm: String(data.get("pm")), due: String(data.get("due")) });
    setOpen(false);
  }

  const field = "mt-1 block w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-fg";

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setSent(null);
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
      >
        <Send className="size-4" aria-hidden />
        Request follow-up research
      </button>

      {sent ? (
        <p role="status" className="animate-rise mt-4 flex gap-2 rounded-lg bg-good-soft px-4 py-3 text-sm text-good">
          <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span className="text-pretty">
            Got it, {sent.pm}. I&apos;ll come back on &ldquo;{sent.question}&rdquo; by {formatLongDate(sent.due)}.
          </span>
        </p>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-fg/40 p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-title`}
            className="animate-rise w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id={`${uid}-title`} className="text-lg font-semibold">
                Request follow-up research
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted hover:bg-surface-2 hover:text-fg"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={submit} className="mt-4 space-y-4">
              <label className="block text-sm font-medium">
                Question
                <textarea
                  ref={first}
                  name="question"
                  required
                  rows={3}
                  placeholder="Do Pros who left for ServiceTitan mention plan tiers?"
                  className={field}
                />
              </label>
              <label className="block text-sm font-medium">
                PM name
                <input name="pm" required className={field} />
              </label>
              <label className="block text-sm font-medium">
                Due date
                <input name="due" type="date" required className={field} />
              </label>
              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-xs text-muted">Demo form. Nothing is sent.</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-line px-3 py-2 text-sm hover:bg-surface-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
                  >
                    Send request
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
