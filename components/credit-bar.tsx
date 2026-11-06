import { ArrowUpRight, Mail } from "lucide-react";
import { personEmail, personLinkedIn, personName, personRole } from "@/lib/site";

// One line above the header on every page: who made this, and how to reach him.
export function CreditBar() {
  return (
    <div className="bg-fg text-bg">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-xs sm:px-6 lg:px-8">
        <p className="text-pretty">
          Created by <span className="font-semibold">{personName}</span>, candidate for {personRole}
        </p>
        <p className="flex items-center gap-4">
          <a
            href={personLinkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 py-1 underline-offset-2 opacity-90 hover:underline hover:opacity-100"
          >
            LinkedIn
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
          <a
            href={`mailto:${personEmail}`}
            className="inline-flex items-center gap-1 py-1 underline-offset-2 opacity-90 hover:underline hover:opacity-100"
          >
            <Mail className="size-3.5" aria-hidden />
            {personEmail}
          </a>
        </p>
      </div>
    </div>
  );
}
