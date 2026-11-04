"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { deepItems, deepLabel, navItems, type NavItem } from "@/lib/nav";

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active ? "bg-accent-soft font-medium text-accent" : "text-muted hover:bg-surface-2 hover:text-fg"
      }`}
    >
      <span className="w-4 font-mono text-xs opacity-70">{item.step}</span>
      {item.label}
    </Link>
  );
}

export function SideNav() {
  const pathname = usePathname();
  const inDeep = deepItems.some((i) => i.href === pathname);
  // Collapsed by default; a click opens it, and it's always open on its own pages.
  const [toggled, setToggled] = useState(false);
  const open = inDeep || toggled;

  return (
    <nav aria-label="Site pages" className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-52 shrink-0 overflow-y-auto py-10 lg:block">
      <ol className="space-y-0.5">
        {navItems.map((item) => (
          <li key={item.href}>
            <NavLink item={item} active={pathname === item.href} />
          </li>
        ))}
      </ol>
      <div className="mt-6 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => setToggled((t) => !t)}
          aria-expanded={open}
          disabled={inDeep}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium tracking-wide text-muted uppercase hover:text-fg disabled:hover:text-muted"
        >
          <ChevronRight className={`size-3.5 transition-transform ${open ? "rotate-90" : ""}`} aria-hidden />
          {deepLabel}
        </button>
        {open ? (
          <ol className="animate-rise mt-1 space-y-0.5">
            {deepItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} active={pathname === item.href} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="px-3 pt-1 text-xs text-pretty text-muted">The system behind it: sources, cards, and logs.</p>
        )}
      </div>
    </nav>
  );
}
