"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, FormInput, FormSelect, Badge, statusVariant, DataTable, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

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

const STATE_MAP: Record<string, string> = {
  integrations: "Integrations",
  "sms-settings": "SMS settings",
  forms: "Forms",
  locations: "Locations",
  "custom-fields": "Custom fields",
  "rooms-resources": "Rooms/Resources",
  services: "Services",
  "busy-times": "Busy times",
  "cancellation-reasons": "Cancellation reasons",
  "online-bookings": "Online bookings",
  "communication-types": "Communication types",
  tags: "Tags",
  "referral-types": "Referral types",
  users: "Users",
  "user-groups": "User groups",
  "appointment-templates": "Appointments",
  "email-templates": "Emails",
  "progress-notes": "Progress notes",
  "letter-templates": "Letters",
  "payment-settings": "Payments",
  "invoice-settings": "Invoices",
};

type ActivePage =
  | "Details"
  | "Integrations"
  | "SMS settings"
  | "Forms"
  | string;

const pagesWithContent = ["Details", "Integrations", "SMS settings", "Forms", "Locations", "Users", "Tags", "Custom fields", "Rooms/Resources", "Services", "Busy times", "Cancellation reasons", "Communication types", "Referral types"];

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsPageInner />
    </Suspense>
  );
}

function SettingsPageInner() {
  const [activePage, setActivePage] = useState<ActivePage>("Details");
  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");

  useEffect(() => {
    if (forcedState && STATE_MAP[forcedState]) {
      setActivePage(STATE_MAP[forcedState]);
    }
  }, [forcedState]);

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
        {activePage === "Locations" && <LocationsContent />}
        {activePage === "Users" && <UsersContent />}
        {activePage === "Tags" && <TagsContent />}
        {activePage === "Custom fields" && <CustomFieldsContent />}
        {activePage === "Rooms/Resources" && <RoomsResourcesContent />}
        {activePage === "Services" && <ServicesContent />}
        {activePage === "Busy times" && <BusyTimesContent />}
        {activePage === "Cancellation reasons" && <CancellationReasonsContent />}
        {activePage === "Communication types" && <CommunicationTypesContent />}
        {activePage === "Referral types" && <ReferralTypesContent />}
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
    name: "Xero",
    description:
      "Xero is world leading online accounting software built for small business. splose syncs all invoices, payments, credits, refunds, line of accounts and tax rates with Xero automatically. We're recommend that all Xero users have two-factor authentication enabled.",
    connected: true,
    buttonLabel: "Settings",
    color: "#13B5EA",
  },
  {
    name: "QuickBooks",
    description:
      "QuickBooks is a leading online accounting solution designed for small businesses. splose syncs all invoices, payments, credits, contacts, chart of accounts, and tax rates with QuickBooks automatically. We encourage all users to enable two-factor authentication to enhance the security of their accounts.",
    connected: false,
    buttonLabel: "Connect to QuickBooks",
    color: "#2CA01C",
  },
  {
    name: "Stripe",
    description:
      "Stripe is a payment processing platform that helps you get paid online. Accept credit card payments via online bookings, and add a Pay now button to your invoices. Standard Stripe fees — splose EFTPOS platform fee applies to successful payments.",
    connected: true,
    buttonLabel: "Settings",
    color: "#635BFF",
  },
  {
    name: "Mailchimp",
    description:
      "Mailchimp is a marketing automation platform and email marketing service used to design and send email campaigns and newsletters to your mailing lists and track results. splose sends clients to your selected audience in Mailchimp.",
    connected: false,
    buttonLabel: "Connect",
    color: "#FFE01B",
  },
  {
    name: "HICAPS",
    description:
      "HICAPS is an online claiming platform that allows you to easily claim invoices to the TAC, Worksite Victoria, NDIS, Medicare, MBS and more. With HICAPS and splose, you can run a price determination for NDIS plan managed invoices and submit them for fast payment.",
    connected: false,
    buttonLabel: "Connect",
    color: "#00B140",
  },
  {
    name: "Tyro Health",
    description:
      "Tyro is a related healthcare providers to process digital payments and claims online. This includes Medicare, Bulk Bill and Patient Claims, DVA, health fund claims and contactless debit and credit cards (incl. NDIS, plus or running a card directly within an invoice or payment).",
    connected: false,
    buttonLabel: "Connect",
    color: "#0D1137",
  },
  {
    name: "Zoom",
    description:
      "Zoom is the leader in modern enterprise video communications with an easy, reliable cloud platform for video and audio conferencing, online chat. Automatically create and attach Zoom Meetings for appointments created in splose and send it to clients in email and SMS.",
    connected: true,
    buttonLabel: "Settings",
    color: "#2D8CFF",
  },
  {
    name: "Physitrack",
    description:
      "Physitrack is an online platform that encompasses clinical home exercise and education prescription, outcomes collection, and Telehealth. It can automatically create home exercise programs created in Physitrack in the Files section of the client's splose profile.",
    connected: false,
    buttonLabel: "Connect",
    color: "#00C2CB",
  },
];

function IntegrationsContent() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Integrations</h1>
      </div>

      {/* Integration vertical list */}
      <div className="space-y-6">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="border-b border-border pb-6 last:border-b-0"
          >
            <div className="flex items-start gap-6">
              {/* Logo placeholder */}
              <div className="flex h-16 w-40 shrink-0 items-center justify-center">
                <span
                  className="text-2xl font-bold"
                  style={{ color: integration.color }}
                >
                  {integration.name}
                </span>
              </div>

              {/* Description */}
              <div className="flex-1">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {integration.description}
                </p>
              </div>
            </div>

            {/* Button row */}
            <div className="mt-3 flex justify-start pl-0">
              <Button
                variant={integration.connected ? "secondary" : "primary"}
              >
                {integration.buttonLabel}
              </Button>
            </div>
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

/* ─── Locations ───────────────────────────────────────────────────── */

const locations = [
  {
    name: "East Clinics",
    address: "",
    lastUpdate: "12:24 pm, 6 Mar 2026",
  },
  {
    name: "Splose OT",
    address: "",
    lastUpdate: "2:08 pm, 26 Feb 2026",
  },
  {
    name: "Ploc",
    address: "",
    lastUpdate: "2:08 pm, 26 Feb 2026",
  },
  {
    name: "Tasks",
    address: "",
    lastUpdate: "11:59 am, 5 Mar 2026",
  },
  {
    name: "Sharon\u2019s",
    address: "",
    lastUpdate: "2:08 pm, 26 Feb 2026",
  },
  {
    name: "One service only",
    address: "297 Pirie St, Adelaide, SA, 5000",
    lastUpdate: "2:08 pm, 26 Feb 2026",
  },
];

function LocationsContent() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Locations</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary">+ New location</Button>
        </div>
      </div>

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Address</Th>
          <Th>Last update</Th>
        </TableHead>
        <TableBody>
          {locations.map((loc) => (
            <tr key={loc.name} className="hover:bg-gray-50 cursor-pointer">
              <Td className="font-medium text-text">{loc.name}</Td>
              <Td className="text-text-secondary">{loc.address}</Td>
              <Td className="text-text-secondary">{loc.lastUpdate}</Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={6} itemsPerPage={10} showPageSize={false} />
    </div>
  );
}

/* ─── Users ───────────────────────────────────────────────────────── */

const users = [
  {
    name: "Nicholas Smithson",
    email: "nick@splose.com",
    roleName: "Practitioner admin",
    roleType: "Practitioner admin",
    group: "OT",
    status: "Active",
    isOwner: true,
  },
  {
    name: "Splose Support",
    email: "support@splose.com",
    roleName: "Practice manager",
    roleType: "Practice manager",
    group: "",
    status: "Active",
    isOwner: false,
  },
  {
    name: "nick sand",
    email: "nick1@splose.com",
    roleName: "Practitioner",
    roleType: "Practitioner",
    group: "",
    status: "Active",
    isOwner: false,
  },
  {
    name: "Harry Nguyen",
    email: "harry@splose.com",
    roleName: "Practitioner admin",
    roleType: "Practitioner admin",
    group: "OT",
    status: "Active",
    isOwner: true,
  },
  {
    name: "Cheng Ma",
    email: "cheng@splose.com",
    roleName: "Practitioner admin",
    roleType: "Practitioner admin",
    group: "Intake team, +1 more",
    status: "Active",
    isOwner: true,
  },
  {
    name: "Rakesh Soni",
    email: "rakesh@splose.com",
    roleName: "Practice manager",
    roleType: "Practice manager",
    group: "Physio",
    status: "Active",
    isOwner: true,
  },
  {
    name: "Cheng Test",
    email: "machengjam@gmail.com",
    roleName: "Practitioner admin",
    roleType: "Practitioner admin",
    group: "",
    status: "Active",
    isOwner: false,
  },
];

function UsersContent() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">Users</h1>
        <Button variant="primary">Invite users</Button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1">
          <FormInput
            type="text"
            placeholder="Search for user name and email"
          />
        </div>
        <Button variant="secondary">Search</Button>
      </div>

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Role name</Th>
          <Th>Role type</Th>
          <Th>Group</Th>
          <Th>Status</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <tr key={user.email} className="hover:bg-gray-50">
              <Td className="font-medium text-text">
                <div>
                  {user.name}
                  {user.isOwner && (
                    <span className="ml-2 inline-block rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      Account owner
                    </span>
                  )}
                </div>
              </Td>
              <Td className="text-text-secondary">{user.email}</Td>
              <Td className="text-text-secondary">{user.roleName}</Td>
              <Td className="text-text-secondary">{user.roleType}</Td>
              <Td className="text-text-secondary">{user.group || "---"}</Td>
              <Td>
                <Badge variant="green">{user.status}</Badge>
              </Td>
              <Td align="right">
                <button className="text-text-secondary hover:text-text text-lg font-bold">
                  &middot;&middot;&middot;
                </button>
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
    </div>
  );
}

/* ─── Tags ────────────────────────────────────────────────────────── */

const tagTabs = ["Client tags", "Service tags", "Waitlist tags", "AI tags"] as const;

const clientTags = [
  { name: "2025-11-22", color: "#EAB308" },
  { name: "Client consents to photography for promotional purposes", color: "#22C55E" },
  { name: "Client DOES NOT consent to photography for promotional purposes", color: "#EF4444" },
  { name: "Company A", color: "#EAB308" },
  { name: "Dual funding", color: "#F59E0B" },
  { name: "Exception", color: "#F59E0B" },
  { name: "FORMS PENDING", color: "#EF4444" },
  { name: "High risk", color: "#EF4444" },
];

function TagsContent() {
  const [activeTab, setActiveTab] = useState<typeof tagTabs[number]>("Client tags");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">Tags</h1>
        <Button variant="primary">+ New tag</Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-4 border-b border-border">
        {tagTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-1 pb-3 text-sm transition-colors ${
              activeTab === tab
                ? "border-primary font-medium text-primary"
                : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            {tab}
            {tab === "AI tags" && (
              <span className="ml-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                New
              </span>
            )}
          </button>
        ))}
      </div>

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Colour</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {clientTags.map((tag) => (
            <tr key={tag.name} className="hover:bg-gray-50">
              <Td className="text-text">{tag.name}</Td>
              <Td>
                <div
                  className="h-4 w-20 rounded"
                  style={{ backgroundColor: tag.color }}
                />
              </Td>
              <Td align="right">
                <button className="text-text-secondary hover:text-text text-lg font-bold">
                  &middot;&middot;&middot;
                </button>
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
    </div>
  );
}

/* ─── Custom Fields ───────────────────────────────────────────────── */

const customFields = [
  { name: "Diagnosis", type: "Multiple choice", visible: true, required: false },
  { name: "AAA", type: "Dropdown (Multiple select)", visible: true, required: false },
  { name: "Goal 1", type: "Long text", visible: true, required: false },
  { name: "Client's deidentification code", type: "Numerical", visible: true, required: false },
  { name: "Personal Care", type: "Multiple choice", visible: true, required: false },
  { name: "Level of Education", type: "Short text", visible: true, required: false },
  { name: "Child Name", type: "Short text", visible: true, required: false },
  { name: "Custom Field Multi Choice - Single Select", type: "Multiple choice", visible: true, required: false },
];

function CustomFieldsContent() {
  const [search, setSearch] = useState("");
  const filtered = customFields.filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Custom fields</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Reorder</Button>
          <Button variant="secondary">Show archived</Button>
          <Button variant="secondary">Learn</Button>
          <Button variant="primary">+ New custom field</Button>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <FormInput placeholder="Search for custom field name" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="secondary">Search</Button>
      </div>
      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Type</Th>
          <Th>Visible</Th>
          <Th>Required</Th>
          <Th>Actions</Th>
        </TableHead>
        <TableBody>
          {filtered.map((f, i) => (
            <tr key={i} className="border-b border-border">
              <Td>{f.name}</Td>
              <Td>{f.type}</Td>
              <Td><span className="text-green-600">Yes</span></Td>
              <Td><span className="text-red-500">No</span></Td>
              <Td><button className="text-text-secondary hover:text-text">•••</button></Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={filtered.length} itemsPerPage={10} />
    </div>
  );
}

/* ─── Rooms/Resources ─────────────────────────────────────────────── */

const rooms = [
  { name: "Red Room", color: "#ef4444", group: "Red", capacity: 1, available: "", location: "Sharon's" },
  { name: "Purple Room", color: "#a855f7", group: "Purple", capacity: 1, available: "", location: "Sharon's" },
  { name: "Room 1", color: "#22c55e", group: "1", capacity: 1000, available: "", location: "East Clinics" },
  { name: "Brainstorming room", color: "#9ca3af", group: "6", capacity: 6, available: "", location: "East Clinics" },
  { name: "Group Therapy Room", color: "#f59e0b", group: "Group Therapy", capacity: 5, available: "", location: "East Clinics" },
  { name: "Test room", color: "#6366f1", group: "Rooms", capacity: 0, available: "", location: "East Clinics" },
  { name: "Car", color: "#14b8a6", group: "Car", capacity: 1, available: "", location: "East Clinics" },
  { name: "Purple", color: "#7c3aed", group: "Green room", capacity: 5, available: "", location: "Northside" },
];

function RoomsResourcesContent() {
  const [search, setSearch] = useState("");
  const filtered = rooms.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Rooms/Resources</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Learn</Button>
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary">+ Room/resource</Button>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <FormInput placeholder="Search for rooms/resources" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="secondary">Search</Button>
      </div>
      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Group</Th>
          <Th>Capacity/Available</Th>
          <Th>Location</Th>
          <Th>Actions</Th>
        </TableHead>
        <TableBody>
          {filtered.map((r, i) => (
            <tr key={i} className="border-b border-border">
              <Td>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.name}
                </div>
              </Td>
              <Td>{r.group}</Td>
              <Td>{r.capacity}</Td>
              <Td>{r.location}</Td>
              <Td><button className="text-text-secondary hover:text-text">•••</button></Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={filtered.length} itemsPerPage={10} />
    </div>
  );
}

/* ─── Services ────────────────────────────────────────────────────── */

const services = [
  { name: "1:1 Consultation", color: "#a855f7", type: "1:1 Consultation", itemCode: "299sdsdds3234", duration: "40 minutes", price: "193.00 / Hour" },
  { name: "1x Initial 1:1 Assessment, 14 x Group Therapy Sessions, and 1x Review Session", color: "#9ca3af", type: "Group Package Deal", itemCode: "", duration: "60 minutes", price: "1000.00 / Each" },
  { name: "2:2 Consultations", color: "#22c55e", type: "2:2 Consultations", itemCode: "2997952838_6127l_abc", duration: "60 minutes", price: "193.99 / Hour" },
  { name: "2. Payment optional - partial - Online booking", color: "#6366f1", type: "1. Payment test - Online booking", itemCode: "sd", duration: "30 minutes", price: "200.00 / Hour" },
  { name: "3 cases services", color: "#f59e0b", type: "3 cases service", itemCode: "", duration: "45 minutes", price: "120.00 / Hour" },
  { name: "3. Payment required - partial - Online booking", color: "#ef4444", type: "1. Payment test - Online booking", itemCode: "", duration: "30 minutes", price: "200.00 / Hour" },
  { name: "4. Payment required - full - Online booking", color: "#14b8a6", type: "1. Payment test - Online booking", itemCode: "", duration: "30 minutes", price: "200.00 / Hour" },
];

function ServicesContent() {
  const [search, setSearch] = useState("");
  const filtered = services.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Services</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Learn</Button>
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary">+ New service</Button>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <FormInput placeholder="Search for service name, type, and item code" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="secondary">Search</Button>
      </div>
      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Type</Th>
          <Th>Item code</Th>
          <Th>Duration</Th>
          <Th>Price</Th>
          <Th>Actions</Th>
        </TableHead>
        <TableBody>
          {filtered.map((s, i) => (
            <tr key={i} className="border-b border-border">
              <Td>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="max-w-[200px] truncate">{s.name}</span>
                </div>
              </Td>
              <Td><span className="max-w-[150px] truncate block">{s.type}</span></Td>
              <Td><span className="text-xs text-text-secondary">{s.itemCode}</span></Td>
              <Td>{s.duration}</Td>
              <Td>{s.price}</Td>
              <Td><button className="text-text-secondary hover:text-text">•••</button></Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={filtered.length} itemsPerPage={10} />
    </div>
  );
}

/* ─── Busy Times ──────────────────────────────────────────────────── */

const busyTimes = [
  { name: "Leave me alone", color: "#ef4444", utilisation: "Excluded", duration: 15 },
  { name: "OT referral", color: "#f59e0b", utilisation: "Excluded", duration: 30 },
  { name: "Meeting", color: "#1f2937", utilisation: "Excluded", duration: 30 },
  { name: "Lunch", color: "#6366f1", utilisation: "Excluded", duration: 30 },
  { name: "Admin", color: "#a855f7", utilisation: "Included", duration: 30 },
  { name: "CPD", color: "#3b82f6", utilisation: "Excluded", duration: 30 },
  { name: "Travel", color: "#22c55e", utilisation: "Excluded", duration: 30 },
];

function BusyTimesContent() {
  return (
    <div className="p-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Busy time types</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary">+ New type</Button>
        </div>
      </div>
      <p className="mb-6 text-sm text-text-secondary">
        Use busy time to indicate non billable events in Practitioner calendars. You can change utilisation settings to control whether specific types of busy time are used in utilisation reports.
      </p>
      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Utilisation</Th>
          <Th>Duration (mins)</Th>
          <Th>Actions</Th>
        </TableHead>
        <TableBody>
          {busyTimes.map((b, i) => (
            <tr key={i} className="border-b border-border">
              <Td>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: b.color }} />
                  {b.name}
                </div>
              </Td>
              <Td>{b.utilisation}</Td>
              <Td>{b.duration}</Td>
              <Td><button className="text-text-secondary hover:text-text">•••</button></Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
    </div>
  );
}

/* ─── Cancellation Reasons ────────────────────────────────────────── */

const cancellationReasons = [
  { name: "Condition betteryyy", code: "" },
  { name: "Condition worse", code: "TEST" },
  { name: "Sick", code: "500" },
  { name: "No show due to health reason", code: "NSDH" },
  { name: "No show due to family issues", code: "NSDF" },
  { name: "No show due to unavailability of transport", code: "NSDT" },
  { name: "Cancelled 1", code: "" },
  { name: "No Show - sick", code: "" },
  { name: "Cancel", code: "CANCEL" },
  { name: "No show less than 2 days", code: "" },
];

function CancellationReasonsContent() {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Cancellation reasons</h1>
        <Button variant="secondary">Show archived</Button>
      </div>
      <div className="divide-y divide-border rounded-lg border border-border bg-white">
        {cancellationReasons.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text">{r.name}</span>
              {r.code && <Badge variant="gray">{r.code}</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded p-1 text-text-secondary hover:bg-gray-100 hover:text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button className="rounded p-1 text-text-secondary hover:bg-red-50 hover:text-red-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Communication Types ─────────────────────────────────────────── */

const communicationTypes = [
  { name: "SMS", defaultType: true },
  { name: "Email", defaultType: true },
  { name: "Phone call", defaultType: false },
  { name: "In-person", defaultType: false },
  { name: "fax", defaultType: false },
  { name: "Admin Notes", defaultType: false },
];

function CommunicationTypesContent() {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Communication types</h1>
        <Button variant="primary">+ Add communication type</Button>
      </div>
      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Default type</Th>
          <Th>Actions</Th>
        </TableHead>
        <TableBody>
          {communicationTypes.map((c, i) => (
            <tr key={i} className="border-b border-border">
              <Td>{c.name}</Td>
              <Td>
                <span className={c.defaultType ? "text-green-600" : "text-red-500"}>
                  {c.defaultType ? "Yes" : "No"}
                </span>
              </Td>
              <Td>
                {!c.defaultType ? (
                  <button className="text-text-secondary hover:text-text">•••</button>
                ) : (
                  <span className="text-text-secondary">-</span>
                )}
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={communicationTypes.length} itemsPerPage={10} />
    </div>
  );
}

/* ─── Referral Types ──────────────────────────────────────────────── */

const referralTypes = [
  { name: "Self-referral", defaultType: true },
  { name: "GP referral", defaultType: false },
  { name: "Specialist referral", defaultType: false },
  { name: "Hospital referral", defaultType: false },
  { name: "NDIS referral", defaultType: false },
  { name: "School referral", defaultType: false },
  { name: "Online search", defaultType: false },
  { name: "Word of mouth", defaultType: false },
];

function ReferralTypesContent() {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Referral types</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary">+ New referral type</Button>
        </div>
      </div>
      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Default type</Th>
          <Th>Actions</Th>
        </TableHead>
        <TableBody>
          {referralTypes.map((r, i) => (
            <tr key={i} className="border-b border-border">
              <Td>{r.name}</Td>
              <Td>
                <span className={r.defaultType ? "text-green-600" : "text-red-500"}>
                  {r.defaultType ? "Yes" : "No"}
                </span>
              </Td>
              <Td><button className="text-text-secondary hover:text-text">•••</button></Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={referralTypes.length} itemsPerPage={10} />
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
