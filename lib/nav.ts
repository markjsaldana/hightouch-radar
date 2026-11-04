export type NavItem = {
  href: string;
  label: string;
  step: string;
};

// The four pages that tell the story. Most readers only need these.
export const navItems: NavItem[] = [
  { href: "/", label: "Overview", step: "01" },
  { href: "/so-what", label: "So what", step: "02" },
  { href: "/assistant", label: "Deal assistant", step: "03" },
  { href: "/plan", label: "90-day plan", step: "04" },
];

// The system behind them, for anyone who wants the detail.
export const deepItems: NavItem[] = [
  { href: "/how-it-works", label: "How it works", step: "A" },
  { href: "/inputs", label: "Inputs", step: "B" },
  { href: "/digest", label: "Weekly digest", step: "C" },
  { href: "/battlecard", label: "Battlecards", step: "D" },
  { href: "/matrix", label: "Matrix & map", step: "E" },
  { href: "/references", label: "References", step: "F" },
  { href: "/routing", label: "Routing log", step: "G" },
];

export const deepLabel = "Under the hood";

// The eyebrow above each page title, so numbering stays in one place.
export function eyebrowFor(href: string) {
  const main = navItems.find((i) => i.href === href);
  if (main) return `${main.step} · ${main.label}`;
  const deep = deepItems.find((i) => i.href === href);
  return deep ? `${deepLabel} · ${deep.label}` : "";
}
