"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// Folded detail: a summary line that opens the rest. It also opens itself when
// the URL points at something inside it, so links like #cs-rivera-growth land.
export function More({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer = 0;
    const check = () => {
      const id = window.location.hash.slice(1);
      if (!id || !body.current) return;
      const target = document.getElementById(id);
      if (!target || !body.current.contains(target)) return;
      timer = window.setTimeout(() => {
        setOpen(true);
        requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
      }, 0);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => {
      window.removeEventListener("hashchange", check);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left transition-colors hover:border-accent/50"
      >
        <span>
          <span className="block text-sm font-medium">{label}</span>
          {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted group-hover:text-fg">
          {open ? "Hide" : "Show"}
          <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </span>
      </button>
      {/* Kept in the page when closed, so in-page links and anchors still resolve. */}
      <div ref={body} hidden={!open} className="pt-4 [&>*:first-child]:mt-0">
        {children}
      </div>
    </div>
  );
}
