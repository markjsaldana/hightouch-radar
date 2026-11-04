"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { navItems } from "@/lib/nav";

export function MobileNav() {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);

  return (
    <nav aria-label="Site pages" className="border-t border-line lg:hidden">
      <ol className="flex gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:px-6">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                ref={active ? activeRef : undefined}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-full px-3 py-1.5 text-sm whitespace-nowrap ${
                  active ? "bg-accent-soft font-medium text-accent" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
