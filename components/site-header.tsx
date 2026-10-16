import Link from "next/link";
import { Radar } from "lucide-react";
import { siteName } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-fg">
            <Radar className="size-4.5" aria-hidden />
          </span>
          <span className="truncate font-semibold tracking-tight">{siteName}</span>
          <span className="hidden rounded-full border border-line px-2 py-0.5 text-xs text-muted sm:inline">
            Sales intelligence system proposal
          </span>
        </Link>
        <ThemeToggle />
      </div>
      <MobileNav />
    </header>
  );
}
