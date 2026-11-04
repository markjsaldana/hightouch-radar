export type NavItem = {
  href: string;
  label: string;
  step: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Overview", step: "01" },
  { href: "/how-it-works", label: "How it works", step: "02" },
  { href: "/inputs", label: "Inputs", step: "03" },
  { href: "/digest", label: "Weekly digest", step: "04" },
  { href: "/so-what", label: "So what", step: "05" },
  { href: "/battlecard", label: "Battlecards", step: "06" },
  { href: "/matrix", label: "Matrix & map", step: "07" },
  { href: "/references", label: "References", step: "08" },
  { href: "/routing", label: "Routing log", step: "09" },
  { href: "/plan", label: "Build it", step: "10" },
  { href: "/assistant", label: "Deal assistant", step: "11" },
];
