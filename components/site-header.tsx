import Link from "next/link";
import { Radar } from "lucide-react";
import { formatShortDate } from "@/lib/format";
import { lastRun, siteName } from "@/lib/site";
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
            Sales enablement assistant proposal
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/how-it-works#weekly-run"
            className="hidden items-center gap-1.5 text-xs text-muted hover:text-fg md:inline-flex"
            title="Refreshed every Monday by scraping competitor pages and blogs"
          >
            <span className="relative flex size-2">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-good" aria-hidden />
              <span className="relative size-2 rounded-full bg-good" />
            </span>
            Updated weekly · last run {formatShortDate(lastRun)}
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <MobileNav />
    </header>
  );
}
