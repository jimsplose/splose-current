"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, FormInput, FormSelect, Badge, statusVariant } from "@/components/ds";

const sidebarSections = [
  {
    title: "Workspace",
    items: [
      { name: "Details", href: "/settings" },
      { name: "Integrations", href: "/settings" },
      { name: "SMS settings", href: "/settings" },
    ],
  },
  {
    title: "Automation",
    items: [
      { name: "Forms", href: "/settings" },
      { name: "splose AI", href: "/settings/ai" },
    ],
  },
  {
    title: "Business",
    items: [
      { name: "Locations", href: "/settings" },
      { name: "Custom fields", href: "/settings" },
      { name: "Rooms/Resources", href: "/settings" },
      { name: "Services", href: "/settings" },
      { name: "Busy times", href: "/settings" },
      { name: "Cancellation reasons", href: "/settings" },
      { name: "Online bookings", href: "/settings", badge: "New" },
      { name: "Communication types", href: "/settings" },
      { name: "Tags", href: "/settings" },
      { name: "Referral types", href: "/settings" },
    ],
  },
  {
    title: "Team",
    items: [
      { name: "Users", href: "/settings" },
      { name: "User groups", href: "/settings" },
    ],
  },
  {
    title: "Templates",
    items: [
      { name: "Appointments", href: "/settings" },
      { name: "Emails", href: "/settings" },
      { name: "Progress notes", href: "/settings" },
      { name: "Letters", href: "/settings" },
      { name: "Body charts", href: "/settings" },
    ],
  },
  {
    title: "Finances",
    items: [
      { name: "Payments", href: "/settings" },
      { name: "Invoices", href: "/settings" },
    ],
  },
];

type ActivePage =
  | "Details"
  | "Integrations"
  | "SMS settings"
  | "Forms"
  | string;

const pagesWithContent = ["Details", "Integrations", "SMS settings", "Forms"];

export default function SettingsPage() {
  const [activePage, setActivePage] = useState<ActivePage>("Details");

  const handleSidebarClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    itemName: string,
    itemHref: string
  ) => {
    if (itemHref === "/settings") {
      e.preventDefault();
      setActivePage(itemName);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-white p-4 overflow-y-auto">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-4">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-text">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={(e) =>
                      handleSidebarClick(e, item.name, item.href)
                    }
                    className={`w-full block rounded px-3 py-1.5 text-left text-sm transition-colors hover:bg-purple-50 hover:text-primary ${
                      item.name === activePage
                        ? "border-l-2 border-primary bg-purple-50 text-primary font-medium"
                        : "text-text-secondary"
                    }`}
                  >
                    {item.name}
                    {item.badge && (
                      <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {activePage === "Details" && <DetailsContent />}
        {activePage === "Integrations" && <IntegrationsContent />}
        {activePage === "SMS settings" && <SMSSettingsContent />}
        {activePage === "Forms" && <FormsContent />}
        {!pagesWithContent.includes(activePage) && (
          <PlaceholderContent pageName={activePage} />
        )}
      </div>
    </div>
  );
}

/* ─── Details ─────────────────────────────────────────────────────── */

function DetailsContent() {
  const [emailSigTab, setEmailSigTab] = useState<"Business" | "User">("Business");
  const [casesToggle, setCasesToggle] = useState(true);
  const [applyToAll, setApplyToAll] = useState(false);

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Details</h1>
        <Button variant="primary">Save</Button>
      </div>

      <div className="space-y-6">
        {/* Business name & Upload area */}
        <div className="flex gap-8">
          <div className="flex-1 space-y-4">
            {/* Business name */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Business name<span className="text-red-500">*</span>
              </label>
              <FormInput
                type="text"
                defaultValue="Hands Together Therapies"
              />
            </div>

            {/* Workspace URL */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Workspace URL{" "}
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-300 text-[10px] text-gray-400 cursor-help ml-0.5">i</span>
              </label>
              <FormInput
                type="text"
                defaultValue="acme.splose.com"
              />
            </div>

            {/* Website */}
            <FormInput label="Website" type="text" defaultValue="hands-together-therapy.com" />

            {/* Business email */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Business email<span className="text-red-500">*</span>
              </label>
              <FormInput
                type="email"
                defaultValue="hello@hands-together-therapy.com"
              />
            </div>
          </div>

          {/* Upload area on the right */}
          <div className="w-48 shrink-0">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              {/* Splose wave/hand illustration placeholder */}
              <div className="mb-3 text-4xl text-purple-300">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="28" fill="#ede9fe" />
                  <path d="M22 38c0-6 4-16 10-16s10 10 10 16" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="28" cy="26" r="2" fill="#7c3aed" />
                  <circle cx="36" cy="26" r="2" fill="#7c3aed" />
                  <path d="M28 32c2 2 6 2 8 0" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <Button variant="secondary" size="sm">Upload</Button>
            </div>
          </div>
        </div>

        {/* Row: Patient terminology & Currency code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Patient terminology{" "}
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-300 text-[10px] text-gray-400 cursor-help ml-0.5">i</span>
              <span className="text-red-500">*</span>
            </label>
            <FormSelect
              options={[
                { value: "Client", label: "Client" },
                { value: "Patient", label: "Patient" },
                { value: "Participant", label: "Participant" },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Currency code<span className="text-red-500">*</span>
            </label>
            <FormInput type="text" defaultValue="AUD" />
          </div>
        </div>

        {/* Row: Country & Currency symbol */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Country<span className="text-red-500">*</span>
            </label>
            <FormSelect
              options={[
                { value: "Australia", label: "Australia" },
                { value: "New Zealand", label: "New Zealand" },
                { value: "United Kingdom", label: "United Kingdom" },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Currency symbol<span className="text-red-500">*</span>
            </label>
            <FormInput type="text" defaultValue="$" />
          </div>
        </div>

        {/* Row: Default appointment communication preferences & Tax Label */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Default appointment communication preferences{" "}
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-300 text-[10px] text-gray-400 cursor-help ml-0.5">i</span>
              <span className="text-red-500">*</span>
            </label>
            <FormSelect
              options={[
                { value: "SMS & Email", label: "SMS & Email" },
                { value: "SMS only", label: "SMS only" },
                { value: "Email only", label: "Email only" },
                { value: "None", label: "None" },
              ]}
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              Apply to all existing clients and override the current contact preferences
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Tax Label for invoices (E.g. ABN)<span className="text-red-500">*</span>
            </label>
            <FormInput type="text" defaultValue="ABN" />
            <p className="mt-2 text-sm text-text-secondary">
              Enter your business number in{" "}
              <span className="text-primary cursor-pointer hover:underline">
                Location settings
              </span>
            </p>
          </div>
        </div>

        {/* Email signature */}
        <div>
          <h2 className="text-base font-semibold text-text mb-3">Email signature</h2>
          <div className="flex gap-1 mb-3">
            <button
              onClick={() => setEmailSigTab("Business")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                emailSigTab === "Business"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              Business
            </button>
            <button
              onClick={() => setEmailSigTab("User")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-1 ${
                emailSigTab === "User"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              User
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          {/* Rich text toolbar */}
          <div className="rounded-t-lg border border-border bg-gray-50 px-2 py-1.5 flex items-center gap-1">
            <button className="rounded px-2 py-1 text-sm font-bold text-text hover:bg-gray-200">B</button>
            <button className="rounded px-2 py-1 text-sm italic text-text hover:bg-gray-200">I</button>
            <div className="mx-1 h-4 w-px bg-gray-300" />
            <button className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-gray-200">AI</button>
            <div className="mx-1 h-4 w-px bg-gray-300" />
            {/* Table/grid icon */}
            <button className="rounded px-2 py-1 text-sm text-text hover:bg-gray-200">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v18H3V3zm0 6h18M3 15h18M9 3v18M15 3v18" /></svg>
            </button>
            <button className="rounded px-2 py-1 text-sm text-text hover:bg-gray-200">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </button>
            <button className="rounded px-2 py-1 text-sm text-text hover:bg-gray-200">+</button>
            <div className="mx-1 h-4 w-px bg-gray-300" />
            <button className="rounded px-2 py-1 text-sm text-text hover:bg-gray-200">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h10M4 18h16" /></svg>
            </button>
            <button className="rounded px-2 py-1 text-sm text-text hover:bg-gray-200">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M7 12h10M4 18h16" /></svg>
            </button>
            <button className="rounded px-2 py-1 text-sm text-text hover:bg-gray-200">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </div>
          {/* Signature content */}
          <div className="rounded-b-lg border border-t-0 border-border bg-white p-4 min-h-[200px] text-sm text-text relative">
            <p className="line-through">Warm Regards,</p>
            <p className="text-primary mt-1">{"{user_fullName}"}</p>
            <p className="text-primary">{"{user_professionTitle}"}</p>
            <p className="text-primary">{"{user_email}"}</p>
            <p className="mt-2 text-primary">{"{business_name}"}</p>
            <p className="text-primary">{"{business_email}"}</p>
            <p className="text-primary">{"{business_website}"}</p>
            <p className="text-primary">{"{user_signature}"}</p>
            <p className="text-primary">{"{user_workPhoneNumber}{user_professionTitle}"}</p>
            <div className="absolute right-6 bottom-6">
              <span className="text-5xl font-bold text-purple-200 select-none tracking-wide">splose</span>
            </div>
          </div>
        </div>

        {/* Calendar lock dates */}
        <div>
          <h2 className="text-base font-semibold text-text mb-3">Calendar lock dates</h2>
          <p className="text-sm text-text-secondary mb-2">
            Prevent users with the practitioner role from making changes on the calendar on and before
          </p>
          <FormInput
            type="text"
            defaultValue="19 Dec 2025"
            className="max-w-xs"
          />
        </div>

        {/* Google Tag Manager */}
        <div>
          <h2 className="text-base font-semibold text-text mb-3">Google Tag Manager</h2>
          <FormInput label="Google Tag Manager ID" type="text" defaultValue="GTM-TEST1231" className="max-w-xs" />
        </div>

        {/* Cases */}
        <div>
          <h2 className="text-base font-semibold text-text mb-3">Cases</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text">
              Block bookings exceeding case or funding periods (default setting)
            </p>
            <Toggle checked={casesToggle} onChange={setCasesToggle} />
          </div>
        </div>

        {/* Business settings change log link */}
        <div>
          <span className="text-sm text-primary cursor-pointer hover:underline">
            Business settings change log
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Integrations ────────────────────────────────────────────────── */

const integrations = [
  {
    name: "Stripe",
    description: "Accept online payments and manage billing",
    icon: "💳",
    category: "Payments",
    connected: true,
  },
  {
    name: "Xero",
    description: "Sync invoices and financial data automatically",
    icon: "📊",
    category: "Accounting",
    connected: true,
  },
  {
    name: "MYOB",
    description: "Export invoices and payments to MYOB",
    icon: "📒",
    category: "Accounting",
    connected: false,
  },
  {
    name: "Mailchimp",
    description: "Sync client data for email marketing campaigns",
    icon: "📧",
    category: "Marketing",
    connected: false,
  },
  {
    name: "Zoom",
    description: "Create telehealth appointments with Zoom meetings",
    icon: "📹",
    category: "Telehealth",
    connected: true,
  },
  {
    name: "Google Calendar",
    description: "Two-way sync with Google Calendar",
    icon: "📅",
    category: "Calendar",
    connected: false,
  },
  {
    name: "Outlook Calendar",
    description: "Sync appointments with Outlook Calendar",
    icon: "📆",
    category: "Calendar",
    connected: false,
  },
  {
    name: "Tyro",
    description: "Process EFTPOS payments in-clinic via Tyro",
    icon: "💰",
    category: "Payments",
    connected: false,
  },
  {
    name: "Medicare",
    description: "Submit Medicare claims and check eligibility",
    icon: "🏥",
    category: "Claims",
    connected: true,
  },
  {
    name: "Halaxy",
    description: "Import client and appointment data from Halaxy",
    icon: "🔄",
    category: "Migration",
    connected: false,
  },
  {
    name: "Cliniko",
    description: "Import client and appointment data from Cliniko",
    icon: "🔄",
    category: "Migration",
    connected: false,
  },
  {
    name: "Twilio",
    description: "Send SMS reminders and notifications via Twilio",
    icon: "💬",
    category: "Communication",
    connected: true,
  },
];

function IntegrationsContent() {
  const [filter, setFilter] = useState<"all" | "connected" | "available">(
    "all"
  );
  const [search, setSearch] = useState("");

  const filtered = integrations.filter((i) => {
    if (filter === "connected" && !i.connected) return false;
    if (filter === "available" && i.connected) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Integrations</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Connect your favourite tools to streamline your workflow
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex rounded-lg border border-border bg-white overflow-hidden">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-gray-50"
            }`}
          >
            All ({integrations.length})
          </button>
          <button
            onClick={() => setFilter("connected")}
            className={`border-l border-border px-4 py-2 text-sm font-medium transition-colors ${
              filter === "connected"
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-gray-50"
            }`}
          >
            Connected ({integrations.filter((i) => i.connected).length})
          </button>
          <button
            onClick={() => setFilter("available")}
            className={`border-l border-border px-4 py-2 text-sm font-medium transition-colors ${
              filter === "available"
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-gray-50"
            }`}
          >
            Available ({integrations.filter((i) => !i.connected).length})
          </button>
        </div>
        <div className="w-64">
          <FormInput
            type="text"
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Integration cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((integration) => (
          <div
            key={integration.name}
            className="rounded-lg border border-border bg-white p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text">
                    {integration.name}
                  </h3>
                  <span className="text-xs text-text-secondary">
                    {integration.category}
                  </span>
                </div>
              </div>
              {integration.connected && (
                <Badge variant="green">
                  <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                  Connected
                </Badge>
              )}
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {integration.description}
            </p>
            <Button
              variant={integration.connected ? "danger" : "secondary"}
              className={`w-full ${!integration.connected ? "border-primary text-primary hover:bg-purple-50" : ""}`}
            >
              {integration.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SMS Settings ────────────────────────────────────────────────── */

const smsTemplates = [
  {
    name: "Appointment reminder (24hr)",
    content:
      "Hi {client_first_name}, this is a reminder of your appointment with {practitioner_name} at {clinic_name} on {appointment_date} at {appointment_time}. Reply C to confirm or call us on {clinic_phone} to reschedule.",
    active: true,
  },
  {
    name: "Appointment reminder (2hr)",
    content:
      "Hi {client_first_name}, your appointment with {practitioner_name} is in 2 hours at {appointment_time}. See you soon!",
    active: true,
  },
  {
    name: "Appointment confirmation",
    content:
      "Hi {client_first_name}, your appointment has been booked with {practitioner_name} on {appointment_date} at {appointment_time}. Reply C to confirm.",
    active: true,
  },
  {
    name: "Cancellation notice",
    content:
      "Hi {client_first_name}, your appointment on {appointment_date} at {appointment_time} has been cancelled. Please call {clinic_phone} to rebook.",
    active: false,
  },
  {
    name: "Follow-up reminder",
    content:
      "Hi {client_first_name}, it has been a while since your last visit. Would you like to book a follow-up? Call us on {clinic_phone} or book online.",
    active: false,
  },
  {
    name: "Invoice reminder",
    content:
      "Hi {client_first_name}, you have an outstanding balance of {invoice_amount} for your recent appointment. Please pay via {payment_link}.",
    active: true,
  },
];

function SMSSettingsContent() {
  const [activeTab, setActiveTab] = useState<
    "provider" | "templates" | "history"
  >("provider");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">SMS settings</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Configure SMS notifications and reminders for your clients
          </p>
        </div>
        <Button variant="primary">Save</Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-6 border-b border-border">
        <button
          onClick={() => setActiveTab("provider")}
          className={`border-b-2 px-1 pb-3 text-sm ${
            activeTab === "provider"
              ? "border-primary font-medium text-primary"
              : "border-transparent text-text-secondary hover:text-text"
          }`}
        >
          Provider & balance
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`border-b-2 px-1 pb-3 text-sm ${
            activeTab === "templates"
              ? "border-primary font-medium text-primary"
              : "border-transparent text-text-secondary hover:text-text"
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`border-b-2 px-1 pb-3 text-sm ${
            activeTab === "history"
              ? "border-primary font-medium text-primary"
              : "border-transparent text-text-secondary hover:text-text"
          }`}
        >
          Send history
        </button>
      </div>

      {activeTab === "provider" && <SMSProviderTab />}
      {activeTab === "templates" && <SMSTemplatesTab />}
      {activeTab === "history" && <SMSHistoryTab />}
    </div>
  );
}

function SMSProviderTab() {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Balance card */}
      <div className="rounded-lg border border-border bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text">SMS balance</h3>
          <Button variant="secondary" size="sm" className="border-primary text-primary hover:bg-purple-50">
            Top up
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-2xl font-bold text-green-700">1,247</p>
            <p className="text-xs text-green-600 mt-1">Credits remaining</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">3,856</p>
            <p className="text-xs text-blue-600 mt-1">Sent this month</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">98.2%</p>
            <p className="text-xs text-purple-600 mt-1">Delivery rate</p>
          </div>
        </div>
      </div>

      {/* Provider config */}
      <div className="rounded-lg border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-text mb-4">
          Provider configuration
        </h3>
        <div className="space-y-4">
          <FormSelect
            label="SMS provider"
            options={[
              { value: "Twilio", label: "Twilio" },
              { value: "MessageMedia", label: "MessageMedia" },
              { value: "Burst SMS", label: "Burst SMS" },
            ]}
          />
          <div>
            <FormInput
              label="Sender name / number"
              type="text"
              defaultValue="AcmeHealth"
            />
            <p className="mt-1 text-xs text-text-secondary">
              Max 11 characters. Letters and numbers only.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">
                Auto-send appointment reminders
              </p>
              <p className="text-xs text-text-secondary">
                Automatically send reminders 24 hours before appointments
              </p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">
                Send confirmation on booking
              </p>
              <p className="text-xs text-text-secondary">
                Send SMS when a new appointment is created
              </p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SMSTemplatesTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-secondary">
          Manage your SMS templates. Use merge tags like{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs text-primary">
            {"{client_first_name}"}
          </code>{" "}
          to personalise messages.
        </p>
        <Button variant="primary">+ New template</Button>
      </div>
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                Template name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                Preview
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-text">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {smsTemplates.map((template) => (
              <tr key={template.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-text whitespace-nowrap">
                  {template.name}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary max-w-md truncate">
                  {template.content}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={template.active ? "green" : "gray"}>
                    {template.active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-text-secondary hover:text-text text-sm">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SMSHistoryTab() {
  const history = [
    {
      to: "Sarah Johnson",
      phone: "0412 345 678",
      template: "Appointment reminder (24hr)",
      sent: "17 Mar 2026, 9:00 am",
      status: "Delivered",
    },
    {
      to: "Michael Chen",
      phone: "0423 456 789",
      template: "Appointment confirmation",
      sent: "17 Mar 2026, 8:45 am",
      status: "Delivered",
    },
    {
      to: "Emily Williams",
      phone: "0434 567 890",
      template: "Appointment reminder (24hr)",
      sent: "16 Mar 2026, 9:00 am",
      status: "Delivered",
    },
    {
      to: "James Brown",
      phone: "0445 678 901",
      template: "Invoice reminder",
      sent: "16 Mar 2026, 10:30 am",
      status: "Failed",
    },
    {
      to: "Olivia Davis",
      phone: "0456 789 012",
      template: "Appointment reminder (2hr)",
      sent: "15 Mar 2026, 2:00 pm",
      status: "Delivered",
    },
  ];

  return (
    <div>
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                Recipient
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                Template
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                Sent
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-text">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {history.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-text">
                  {item.to}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {item.phone}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {item.template}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {item.sent}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={statusVariant(item.status)}>
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Forms ───────────────────────────────────────────────────────── */

const formTemplates = [
  {
    name: "New Client Intake Form",
    description: "Collects personal details, medical history, and consent",
    status: "Published" as const,
    responses: 142,
    lastModified: "12 Mar 2026",
  },
  {
    name: "NDIS Service Agreement",
    description: "NDIS participant service agreement and plan details",
    status: "Published" as const,
    responses: 67,
    lastModified: "10 Mar 2026",
  },
  {
    name: "Mental Health Screening (K10)",
    description: "Kessler Psychological Distress Scale questionnaire",
    status: "Published" as const,
    responses: 89,
    lastModified: "8 Mar 2026",
  },
  {
    name: "Consent to Telehealth",
    description: "Telehealth session consent and technology requirements",
    status: "Published" as const,
    responses: 203,
    lastModified: "5 Mar 2026",
  },
  {
    name: "Client Feedback Survey",
    description: "Post-appointment satisfaction and feedback survey",
    status: "Draft" as const,
    responses: 0,
    lastModified: "15 Mar 2026",
  },
  {
    name: "Workplace Injury Report",
    description: "WorkCover injury details and employer information",
    status: "Published" as const,
    responses: 31,
    lastModified: "1 Mar 2026",
  },
  {
    name: "Paediatric Referral Form",
    description: "Referral details for paediatric OT and speech therapy",
    status: "Draft" as const,
    responses: 0,
    lastModified: "14 Mar 2026",
  },
  {
    name: "COVID-19 Screening",
    description: "Pre-appointment COVID-19 symptoms and exposure check",
    status: "Archived" as const,
    responses: 1520,
    lastModified: "20 Jan 2026",
  },
];

function FormsContent() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Published" | "Draft" | "Archived"
  >("all");

  const filtered = formTemplates.filter((f) => {
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Forms</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Create and manage forms that clients can fill out online
          </p>
        </div>
        <Button variant="primary">+ New form</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-64">
          <FormInput
            type="text"
            placeholder="Search forms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex rounded-lg border border-border bg-white overflow-hidden">
          {(["all", "Published", "Draft", "Archived"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                s !== "all" ? "border-l border-border" : ""
              } ${
                statusFilter === s
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Forms table */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                Form name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                Description
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-text">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-text">
                Responses
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                Last modified
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((form) => (
              <tr key={form.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-text">
                  {form.name}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary max-w-xs truncate">
                  {form.description}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={form.status === "Published" ? "green" : form.status === "Draft" ? "yellow" : "gray"}>
                    {form.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center text-sm text-text-secondary">
                  {form.responses}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {form.lastModified}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-sm text-primary hover:underline">
                      Edit
                    </button>
                    <button className="text-sm text-text-secondary hover:text-text">
                      ...
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-text-secondary">
            No forms found
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Placeholder ─────────────────────────────────────────────────── */

function PlaceholderContent({ pageName }: { pageName: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 min-h-[60vh]">
      <div className="mb-6 text-6xl">&#9881;</div>
      <h2 className="text-xl font-bold text-text">{pageName}</h2>
      <p className="mt-2 text-sm text-text-secondary">
        This settings page is coming soon
      </p>
    </div>
  );
}

/* ─── Shared components ───────────────────────────────────────────── */

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-primary" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
