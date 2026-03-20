export interface StateVariant {
  id: string;
  label: string;
  description?: string;
  screenshot?: string;
  match?: "yes" | "partial" | "no" | "unknown";
}

export interface PageEntry {
  path: string;
  resolvedPath?: string;
  label: string;
  group?: string;
  variants: StateVariant[];
  children?: PageEntry[];
}

export const stateRegistry: PageEntry[] = [
  {
    path: "/",
    label: "Dashboard",
    group: "Dashboard",
    variants: [{ id: "default", label: "Default view" }],
  },
  {
    path: "/calendar",
    label: "Calendar",
    group: "Calendar",
    variants: [
      { id: "default", label: "Week view" },
      { id: "month-view", label: "Month view" },
      { id: "day-view", label: "Day view" },
      { id: "appointment-selected", label: "Appointment selected" },
      { id: "new-appointment", label: "New appointment modal" },
      { id: "edit-appointment", label: "Edit appointment modal" },
      { id: "rooms-view", label: "Rooms/Resources view" },
    ],
  },
  {
    path: "/clients",
    label: "Clients",
    group: "Clients",
    variants: [{ id: "default", label: "Client list" }],
    children: [
      {
        path: "/clients/[id]",
        resolvedPath: "/clients/1",
        label: "Client Detail",
        variants: [
          { id: "default", label: "Details tab" },
          { id: "edit-mode", label: "Edit mode" },
        ],
        children: [
          {
            path: "/clients/[id]/appointments",
            resolvedPath: "/clients/1/appointments",
            label: "Appointments",
            variants: [{ id: "default", label: "Appointments list" }],
          },
          {
            path: "/clients/[id]/communications",
            resolvedPath: "/clients/1/communications",
            label: "Communications",
            variants: [{ id: "default", label: "Communications list" }],
          },
          {
            path: "/clients/[id]/files",
            resolvedPath: "/clients/1/files",
            label: "Files",
            variants: [{ id: "default", label: "Files list" }],
          },
          {
            path: "/clients/[id]/notes",
            resolvedPath: "/clients/1/notes",
            label: "Progress Notes",
            variants: [{ id: "default", label: "Notes list" }],
          },
          {
            path: "/clients/[id]/cases",
            resolvedPath: "/clients/1/cases",
            label: "Cases",
            variants: [{ id: "default", label: "Cases list" }],
          },
          {
            path: "/clients/[id]/support-activities",
            resolvedPath: "/clients/1/support-activities",
            label: "Support Activities",
            variants: [{ id: "default", label: "Activities list" }],
          },
          {
            path: "/clients/[id]/forms",
            resolvedPath: "/clients/1/forms",
            label: "Forms",
            variants: [{ id: "default", label: "Forms list" }],
          },
          {
            path: "/clients/[id]/invoices",
            resolvedPath: "/clients/1/invoices",
            label: "Invoices",
            variants: [{ id: "default", label: "Invoices list" }],
          },
          {
            path: "/clients/[id]/payments",
            resolvedPath: "/clients/1/payments",
            label: "Payments",
            variants: [{ id: "default", label: "Payments list" }],
          },
          {
            path: "/clients/[id]/statements",
            resolvedPath: "/clients/1/statements",
            label: "Statements",
            variants: [{ id: "default", label: "Statements view" }],
          },
          {
            path: "/clients/[id]/letters",
            resolvedPath: "/clients/1/letters",
            label: "Letters",
            variants: [{ id: "default", label: "Letters list" }],
          },
          {
            path: "/clients/[id]/practitioner-access",
            resolvedPath: "/clients/1/practitioner-access",
            label: "Practitioner Access",
            variants: [{ id: "default", label: "Access list" }],
          },
        ],
      },
    ],
  },
  {
    path: "/contacts",
    label: "Contacts",
    group: "Contacts",
    variants: [{ id: "default", label: "Contacts list" }],
    children: [
      {
        path: "/contacts/[id]",
        resolvedPath: "/contacts/1",
        label: "Contact Detail",
        variants: [
          { id: "default", label: "Details tab" },
          { id: "invoices", label: "Invoices tab" },
        ],
      },
    ],
  },
  {
    path: "/waitlist",
    label: "Waitlist",
    group: "Waitlist",
    variants: [
      { id: "default", label: "Waitlist list view" },
      { id: "screener-triage", label: "Screener \u2192 Triage" },
      { id: "screener-rejected", label: "Screener \u2192 Rejected" },
      { id: "waitlist-map", label: "Map view" },
    ],
  },
  {
    path: "/invoices",
    label: "Invoices",
    group: "Invoices",
    variants: [{ id: "default", label: "Invoice list" }],
    children: [
      {
        path: "/invoices/[id]",
        resolvedPath: "/invoices/cmmyhkhzk0028wpwgeu2hcnsj",
        label: "Invoice Detail",
        variants: [{ id: "default", label: "Invoice view" }],
      },
    ],
  },
  {
    path: "/payments",
    label: "Payments",
    group: "Payments",
    variants: [{ id: "default", label: "Payment list" }],
    children: [{ path: "/payments/new", label: "New Payment", variants: [{ id: "default", label: "Payment form" }] }],
  },
  {
    path: "/notes",
    label: "Progress Notes",
    group: "Notes",
    variants: [{ id: "default", label: "Notes list" }],
    children: [
      {
        path: "/notes/[id]",
        resolvedPath: "/notes/cmmyhkay2001hwpwg2vp2u2yw",
        label: "View Note",
        variants: [{ id: "default", label: "Note view" }],
      },
      {
        path: "/notes/[id]/edit",
        resolvedPath: "/notes/cmmyhkay2001hwpwg2vp2u2yw/edit",
        label: "Edit Note",
        variants: [
          { id: "default", label: "Edit note" },
          { id: "split-view", label: "Split view" },
        ],
      },
      {
        path: "/notes/new",
        label: "New Note",
        variants: [
          { id: "default", label: "New note form" },
          { id: "split-view", label: "Split view" },
        ],
      },
    ],
  },
  {
    path: "/practitioners",
    label: "Practitioners",
    group: "Practitioners",
    variants: [{ id: "default", label: "Practitioner list" }],
  },
  {
    path: "/products",
    label: "Products",
    group: "Products",
    variants: [{ id: "default", label: "Product list" }],
  },
  {
    path: "/eng",
    label: "Eng Toolkit",
    group: "Internal",
    variants: [{ id: "default", label: "Component showcase + page directory" }],
  },
  {
    path: "/reports",
    label: "Reports",
    group: "Reports",
    variants: [{ id: "default", label: "Reports overview" }],
    children: [
      {
        path: "/reports/appointments",
        label: "Appointments Report",
        variants: [{ id: "default", label: "Appointments report" }],
      },
      {
        path: "/reports/performance",
        label: "Performance Report",
        variants: [{ id: "default", label: "Performance report" }],
      },
      {
        path: "/reports/progress-notes",
        label: "Progress Notes Report",
        variants: [{ id: "default", label: "Notes report" }],
      },
    ],
  },
  {
    path: "/settings",
    label: "Settings",
    group: "Settings",
    variants: [{ id: "default", label: "Details" }],
    children: [
      { path: "/settings/integrations", label: "Integrations", variants: [{ id: "default", label: "Integrations" }] },
      { path: "/settings/sms-settings", label: "SMS Settings", variants: [{ id: "default", label: "SMS Settings" }] },
      { path: "/settings/forms", label: "Forms", variants: [{ id: "default", label: "Forms" }] },
      { path: "/settings/locations", label: "Locations", variants: [{ id: "default", label: "Locations" }] },
      { path: "/settings/custom-fields", label: "Custom Fields", variants: [{ id: "default", label: "Custom Fields" }] },
      { path: "/settings/rooms-resources", label: "Rooms/Resources", variants: [{ id: "default", label: "Rooms/Resources" }] },
      { path: "/settings/services", label: "Services", variants: [{ id: "default", label: "Services" }] },
      { path: "/settings/busy-times", label: "Busy Times", variants: [{ id: "default", label: "Busy Times" }] },
      { path: "/settings/cancellation-reasons", label: "Cancellation Reasons", variants: [{ id: "default", label: "Cancellation Reasons" }] },
      { path: "/settings/online-bookings", label: "Online Bookings", variants: [{ id: "default", label: "Online Bookings" }] },
      { path: "/settings/communication-types", label: "Communication Types", variants: [{ id: "default", label: "Communication Types" }] },
      { path: "/settings/tags", label: "Tags", variants: [{ id: "default", label: "Tags" }] },
      { path: "/settings/referral-types", label: "Referral Types", variants: [{ id: "default", label: "Referral Types" }] },
      { path: "/settings/users", label: "Users", variants: [{ id: "default", label: "Users" }] },
      { path: "/settings/user-groups", label: "User Groups", variants: [{ id: "default", label: "User Groups" }] },
      { path: "/settings/appointment-templates", label: "Appointment Templates", variants: [{ id: "default", label: "Appointment Templates" }] },
      { path: "/settings/email-templates", label: "Email Templates", variants: [{ id: "default", label: "Email Templates" }] },
      { path: "/settings/progress-notes", label: "Progress Notes", variants: [{ id: "default", label: "Progress Notes" }] },
      { path: "/settings/letter-templates", label: "Letter Templates", variants: [{ id: "default", label: "Letter Templates" }] },
      { path: "/settings/body-charts", label: "Body Charts", variants: [{ id: "default", label: "Body Charts" }] },
      { path: "/settings/payment-settings", label: "Payment Settings", variants: [{ id: "default", label: "Payment Settings" }] },
      { path: "/settings/invoice-settings", label: "Invoice Settings", variants: [{ id: "default", label: "Invoice Settings" }] },
      { path: "/settings/tax-rates", label: "Tax Rates", variants: [{ id: "default", label: "Tax Rates" }] },
      { path: "/settings/data-export", label: "Data Export", variants: [{ id: "default", label: "Data Export" }] },
      { path: "/settings/data-import", label: "Data Import", variants: [{ id: "default", label: "Data Import" }] },
      {
        path: "/settings/ai",
        label: "Splose AI",
        variants: [
          { id: "default", label: "AI Preferences" },
          { id: "saved-prompts", label: "Saved Prompts" },
          { id: "ai-block-library", label: "AI Block Library" },
        ],
      },
    ],
  },
  {
    path: "/patient-form/[id]/view",
    resolvedPath: "/patient-form/1/view",
    label: "Patient Form View",
    group: "Forms",
    variants: [{ id: "default", label: "Form view" }],
  },
  {
    path: "/online-booking",
    label: "Online Booking",
    group: "Booking",
    variants: [
      { id: "default", label: "Select appointment" },
      { id: "confirm", label: "Confirm booking" },
    ],
  },
  {
    path: "/login",
    label: "Login",
    group: "Auth",
    variants: [{ id: "default", label: "Login page" }],
  },
];

/** Flatten the tree into a flat list */
export function flattenRegistry(entries: PageEntry[] = stateRegistry): PageEntry[] {
  const result: PageEntry[] = [];
  for (const entry of entries) {
    result.push(entry);
    if (entry.children) {
      result.push(...flattenRegistry(entry.children));
    }
  }
  return result;
}

/** Find a page entry by its path */
export function findByPath(path: string): PageEntry | undefined {
  return flattenRegistry().find((e) => e.path === path || e.resolvedPath === path);
}

/** Get the resolved URL for a variant */
export function getVariantUrl(page: PageEntry, variant: StateVariant): string {
  const base = page.resolvedPath || page.path;
  if (variant.id === "default") return base;
  return `${base}?state=${variant.id}`;
}

/** Count total variants across all pages */
export function countVariants(): { pages: number; variants: number } {
  const flat = flattenRegistry();
  return {
    pages: flat.length,
    variants: flat.reduce((sum, p) => sum + p.variants.length, 0),
  };
}
