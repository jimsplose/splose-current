import type { CommandEntry } from "@/components/ds/CommandPalette";

/**
 * Static global command definitions. Navigation `onSelect` handlers are
 * wired up by CommandPaletteMount using the Next.js router.
 */
export interface CommandDef {
  id: string;
  label: string;
  group: "Navigate" | "Create";
  keywords?: string[];
  href?: string;
}

export const globalCommandDefs: CommandDef[] = [
  // ── Navigate ──
  { id: "nav-dashboard",   label: "Go to Dashboard",   group: "Navigate", href: "/",           keywords: ["home"] },
  { id: "nav-calendar",    label: "Go to Calendar",    group: "Navigate", href: "/calendar",   keywords: ["schedule", "appointments"] },
  { id: "nav-clients",     label: "Go to Clients",     group: "Navigate", href: "/clients",    keywords: ["patients"] },
  { id: "nav-invoices",    label: "Go to Invoices",    group: "Navigate", href: "/invoices",   keywords: ["billing"] },
  { id: "nav-payments",    label: "Go to Payments",    group: "Navigate", href: "/payments",   keywords: ["receipts"] },
  { id: "nav-reports",     label: "Go to Reports",     group: "Navigate", href: "/reports",    keywords: ["analytics", "data"] },
  { id: "nav-waitlist",    label: "Go to Waitlist",    group: "Navigate", href: "/waitlist",   keywords: ["queue"] },
  { id: "nav-settings",    label: "Go to Settings",    group: "Navigate", href: "/settings",   keywords: ["preferences", "config"] },
  // ── Create ──
  { id: "new-appointment", label: "New appointment",   group: "Create",   href: "/calendar",   keywords: ["booking", "schedule"] },
  { id: "new-client",      label: "New client",        group: "Create",   href: "/clients/new", keywords: ["patient", "add"] },
  { id: "new-invoice",     label: "New invoice",       group: "Create",   href: "/invoices/new", keywords: ["bill", "charge"] },
  { id: "new-waitlist",    label: "Add to waitlist",   group: "Create",   href: "/waitlist/new", keywords: ["queue", "add"] },
];

/** Build CommandEntry[] from defs, wiring navigation via a router push callback. */
export function buildCommands(
  defs: CommandDef[],
  navigate: (href: string) => void,
  extra: CommandEntry[] = [],
): CommandEntry[] {
  const base: CommandEntry[] = defs.map((d) => ({
    id: d.id,
    label: d.label,
    group: d.group,
    keywords: d.keywords,
    onSelect: () => d.href && navigate(d.href),
  }));
  return [...base, ...extra];
}
