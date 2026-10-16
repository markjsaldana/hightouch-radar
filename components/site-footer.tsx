import { personName } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted sm:px-6 lg:px-8">
        Sales enablement assistant proposal by {personName}
        <span className="mt-1 block text-xs">
          Not affiliated with or endorsed by Hightouch or any company named here.
        </span>
      </div>
    </footer>
  );
}
