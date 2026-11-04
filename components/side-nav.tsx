"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Site pages" className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-52 shrink-0 py-10 lg:block">
      <ol className="space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent-soft font-medium text-accent"
                    : "text-muted hover:bg-surface-2 hover:text-fg"
                }`}
              >
                <span className="font-mono text-xs opacity-70">{item.step}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
