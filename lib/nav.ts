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
  { href: "/battlecard", label: "Battlecard", step: "05" },
  { href: "/matrix", label: "Matrix & map", step: "06" },
  { href: "/references", label: "References", step: "07" },
  { href: "/routing", label: "Routing log", step: "08" },
  { href: "/plan", label: "First 90 days", step: "09" },
];
