"use client";

import { useEffect, useState, type ReactNode } from "react";

// Tabs that follow the URL hash. A link like /battlecard#servicetitan-objection-2
// opens the matching tab, then scrolls to the item.
export function HashTabs({
  tabs,
  label,
}: {
  tabs: { id: string; label: string; content: ReactNode }[];
  label: string;
}) {
  const [active, setActive] = useState(tabs[0].id);

  useEffect(() => {
    let timer = 0;
    const apply = () => {
      const hash = window.location.hash.slice(1);
      const match = tabs.find((t) => hash === t.id || hash.startsWith(`${t.id}-`));
      if (!match) return;
      // Deferred so the tab switch isn't a synchronous update inside the effect.
      timer = window.setTimeout(() => {
        setActive(match.id);
        requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }));
      }, 0);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => {
      window.removeEventListener("hashchange", apply);
      window.clearTimeout(timer);
    };
  }, [tabs]);

  return (
    <div>
      <div role="tablist" aria-label={label} className="mb-6 inline-flex rounded-xl border border-line bg-surface p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={t.id}
            onClick={() => {
              setActive(t.id);
              history.replaceState(null, "", `#${t.id}`);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              active === t.id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={t.id} className="scroll-mt-40" aria-labelledby={`tab-${t.id}`} hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
