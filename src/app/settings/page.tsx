"use client";

import { useState } from "react";
import Link from "next/link";

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

const pagesWithContent = ["Details", "Integrations", "SMS settings", "Forms", "Locations", "Tags", "Users", "Referral types", "User groups", "Payments", "Communication types", "Cancellation reasons", "Busy times"];

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
        {activePage === "Locations" && <LocationsContent />}
        {activePage === "Tags" && <TagsContent />}
        {activePage === "Users" && <UsersContent />}
        {activePage === "Referral types" && <ReferralTypesContent />}
        {activePage === "User groups" && <UserGroupsContent />}
        {activePage === "Payments" && <PaymentSettingsContent />}
        {activePage === "Communication types" && <CommunicationTypesContent />}
        {activePage === "Cancellation reasons" && <CancellationReasonsContent />}
        {activePage === "Busy times" && <BusyTimesContent />}
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

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const labelClass = "block text-sm font-medium text-text mb-1";

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Details</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          Save
        </button>
      </div>

      <div className="space-y-6">
        {/* Business name & Upload area */}
        <div className="flex gap-8">
          <div className="flex-1 space-y-4">
            {/* Business name */}
            <div>
              <label className={labelClass}>
                Business name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Hands Together Therapies"
                className={inputClass}
              />
            </div>

            {/* Workspace URL */}
            <div>
              <label className={labelClass}>
                Workspace URL{" "}
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-300 text-[10px] text-gray-400 cursor-help ml-0.5">i</span>
              </label>
              <input
                type="text"
                defaultValue="acme.splose.com"
                className={inputClass}
              />
            </div>

            {/* Website */}
            <div>
              <label className={labelClass}>Website</label>
              <input
                type="text"
                defaultValue="hands-together-therapy.com"
                className={inputClass}
              />
            </div>

            {/* Business email */}
            <div>
              <label className={labelClass}>
                Business email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                defaultValue="hello@hands-together-therapy.com"
                className={inputClass}
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
              <button className="rounded-lg border border-border bg-white px-4 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* Row: Patient terminology & Currency code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Patient terminology{" "}
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-300 text-[10px] text-gray-400 cursor-help ml-0.5">i</span>
              <span className="text-red-500">*</span>
            </label>
            <select className={inputClass}>
              <option>Client</option>
              <option>Patient</option>
              <option>Participant</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>
              Currency code<span className="text-red-500">*</span>
            </label>
            <input type="text" defaultValue="AUD" className={inputClass} />
          </div>
        </div>

        {/* Row: Country & Currency symbol */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Country<span className="text-red-500">*</span>
            </label>
            <select className={inputClass}>
              <option>Australia</option>
              <option>New Zealand</option>
              <option>United Kingdom</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>
              Currency symbol<span className="text-red-500">*</span>
            </label>
            <input type="text" defaultValue="$" className={inputClass} />
          </div>
        </div>

        {/* Row: Default appointment communication preferences & Tax Label */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Default appointment communication preferences{" "}
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-300 text-[10px] text-gray-400 cursor-help ml-0.5">i</span>
              <span className="text-red-500">*</span>
            </label>
            <select className={inputClass}>
              <option>SMS &amp; Email</option>
              <option>SMS only</option>
              <option>Email only</option>
              <option>None</option>
            </select>
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
            <label className={labelClass}>
              Tax Label for invoices (E.g. ABN)<span className="text-red-500">*</span>
            </label>
            <input type="text" defaultValue="ABN" className={inputClass} />
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
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                emailSigTab === "User"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              User
            </button>
          </div>
          {/* Rich text toolbar */}
          <div className="rounded-t-lg border border-border bg-gray-50 px-2 py-1.5 flex items-center gap-1">
            <button className="rounded px-2 py-1 text-sm font-bold text-text hover:bg-gray-200">B</button>
            <button className="rounded px-2 py-1 text-sm italic text-text hover:bg-gray-200">I</button>
            <div className="mx-1 h-4 w-px bg-gray-300" />
            <button className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-gray-200">AI</button>
            <div className="mx-1 h-4 w-px bg-gray-300" />
            <button className="rounded px-2 py-1 text-sm text-text hover:bg-gray-200">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18M3 6h18M3 18h18" /></svg>
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
          <div className="rounded-b-lg border border-t-0 border-border bg-white p-4 min-h-[160px] text-sm text-text">
            <p>Warm Regards,</p>
            <p className="text-primary mt-1">{"{user_fullName}"}</p>
            <p className="text-primary">{"{user_professionTitle}"}</p>
            <p className="text-primary">{"{user_qualifications}"}</p>
            <p className="text-primary">{"{business_name}"}</p>
            <p className="text-primary">{"{location_address}"}</p>
            <p className="text-primary">{"{business_phone}"}</p>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="#7c3aed" /><text x="10" y="14" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">S</text></svg>
                </div>
                <span className="text-xs text-text-secondary">splose</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar lock dates */}
        <div>
          <h2 className="text-base font-semibold text-text mb-3">Calendar lock dates</h2>
          <p className="text-sm text-text-secondary mb-2">
            Prevent users with the practitioner role from making changes on the calendar on and before
          </p>
          <input
            type="text"
            defaultValue="19 Dec 2025"
            className={`${inputClass} max-w-xs`}
          />
        </div>

        {/* Google Tag Manager */}
        <div>
          <h2 className="text-base font-semibold text-text mb-3">Google Tag Manager</h2>
          <div>
            <label className={labelClass}>Google Tag Manager ID</label>
            <input
              type="text"
              defaultValue="GTM-TEST1231"
              className={`${inputClass} max-w-xs`}
            />
          </div>
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

const integrationsList = [
  {
    name: "Xero",
    logoText: "xero",
    logoColor: "#13B5EA",
    connected: true,
    description:
      "Xero is a world leading online accounting software built for small business. splose syncs all invoices, payments, clients, contacts, chart of accounts and line items with Xero automatically. We recommend that all Xero users have two factor authentication enabled.",
    buttonText: "Settings",
  },
  {
    name: "QuickBooks",
    logoText: "INTUIT QuickBooks",
    logoColor: "#2CA01C",
    connected: false,
    description:
      "QuickBooks is a leading online accounting solution designed for small businesses. splose syncs all invoices, payments, clients, contacts, chart of accounts, and line items with QuickBooks automatically. We encourage all users to enable two-factor authentication to enhance the security of their accounts.",
    buttonText: "Connect to QuickBooks",
  },
  {
    name: "Stripe",
    logoText: "stripe",
    logoColor: "#635BFF",
    connected: true,
    description:
      "Stripe is a payment processing platform that helps you get paid online. Accept credit card payments via online bookings, and add a Pay now button to your invoices. Standard Stripe fees apply + splose 0.6% platform fee applies to successful payments.",
    buttonText: "Settings",
    extraLink: "Your profile in Stripe",
  },
  {
    name: "Mailchimp",
    logoText: "Mailchimp",
    logoColor: "#FFE01B",
    logoBg: "#FFE01B",
    logoTextColor: "#241C15",
    connected: false,
    description:
      "Mailchimp is a marketing automation platform and email marketing service used to design and send email campaigns and newsletters to your mailing lists and track results. splose sends clients to your selected audience in Mailchimp.",
    buttonText: "Connect",
  },
  {
    name: "HICAPS",
    logoText: "HICAPS",
    logoColor: "#004225",
    connected: false,
    description:
      "HICAPS is an online claiming platform that allows you to easily claim invoices to the TAC, WorkSafe Victoria, NDIS, Medicare, DVA and more. With HICAPS and splose, you can run a gap determination for NDIS plan managed invoices and submit them for fast payment.",
    buttonText: "Connect",
  },
  {
    name: "Tyro Health",
    logoText: "tyro Health",
    logoColor: "#6B2D99",
    connected: false,
    description:
      "Tyro is dedicated to helping healthcare providers process digital payments and claims online. This includes Medicare, Bulk Bill and Patient Claims, DVA, health fund claims and contactless debit and credit cards (incl NFC, via scanning a card directly within an invoice window).",
    buttonText: "Connect",
  },
  {
    name: "Zoom",
    logoText: "Zoom",
    logoColor: "#2D8CFF",
    connected: true,
    description:
      "Zoom is the leader in modern enterprise video communications with an easy, reliable cloud platform for video and audio conferencing and chat. Automatically create and attach Zoom Meetings for appointments scheduled or synced to a room at a Zoom URL.",
    buttonText: "Settings",
  },
  {
    name: "Physitrack",
    logoText: "Physitrack",
    logoColor: "#00B4D8",
    connected: false,
    description:
      "Physitrack is an online platform that encompasses clinical home exercise and education prescription, outcome tracking, and Telehealth. By integrating splose directly sending exercise programs created in Physitrack to the Files section of the client's splose profile.",
    buttonText: "Connect",
  },
];

function IntegrationsContent() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-text mb-6">Integrations</h1>

      <div className="space-y-4">
        {integrationsList.map((integration) => (
          <div
            key={integration.name}
            className="rounded-lg border border-border bg-white p-6"
          >
            <div className="flex items-start gap-6">
              {/* Logo area */}
              <div
                className="flex h-16 w-40 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: integration.logoBg || `${integration.logoColor}10`,
                }}
              >
                <span
                  className="text-xl font-bold"
                  style={{
                    color: integration.logoTextColor || integration.logoColor,
                  }}
                >
                  {integration.logoText}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {integration.description}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                      integration.connected
                        ? "border border-border bg-white text-text hover:bg-gray-50"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    {integration.buttonText}
                  </button>
                  {integration.extraLink && (
                    <span className="text-sm text-primary cursor-pointer hover:underline">
                      {integration.extraLink}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SMS Settings ────────────────────────────────────────────────── */

function SMSSettingsContent() {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const creditOptions = [
    { credits: 200, price: "A$22.00" },
    { credits: 500, price: "A$55.00" },
    { credits: 1000, price: "A$110.00" },
    { credits: 2500, price: "A$275.00" },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">SMS settings</h1>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM4 11a1 1 0 100-2H3a1 1 0 000 2h1zM10 18a1 1 0 001-1v-1a1 1 0 10-2 0v1a1 1 0 001 1z" /></svg>
          Learn
        </button>
      </div>

      {/* SMS credit balance */}
      <div className="rounded-lg border border-border bg-white p-5 mb-6">
        <p className="text-sm text-text-secondary mb-1">SMS credit balance</p>
        <p className="text-4xl font-bold text-text">884</p>
      </div>

      {/* Recharge credits */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text mb-3">Recharge credits</h2>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {creditOptions.map((option, i) => (
            <button
              key={option.credits}
              onClick={() => setSelectedPlan(i)}
              className={`rounded-lg border-2 p-4 text-center transition-colors ${
                selectedPlan === i
                  ? "border-primary bg-purple-50"
                  : "border-border bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-lg font-bold text-text">{option.credits} credits</p>
              <p className="text-sm text-text-secondary">{option.price}</p>
            </button>
          ))}
        </div>
        <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          Recharge
        </button>
      </div>

      {/* SMS pricing */}
      <div>
        <h2 className="text-base font-semibold text-text mb-3">SMS pricing</h2>
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            A standard SMS message contains 160 characters per segment (if a message has more than 160 characters, the message is split into segments, each consisting of 153 characters). SMS messages which include special characters such as emojis require a different type of SMS. These messages are able to contain up to 70 characters (Messages with special characters longer than 70 characters are split into 67 character segments).
          </p>
          <p>
            Credits are purchased in advance and cost A$0.10 + GST per credit. Outbound SMS messages cost one credit per segment, and inbound messages cost 0.5 credits per segment. SMS credits purchased get billed to the credit card attached to your splose account. Receipts will appear in your{" "}
            <span className="text-primary cursor-pointer hover:underline">billing history</span>.
          </p>
        </div>
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
        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          + New form
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64"
        />
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
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      form.status === "Published"
                        ? "bg-green-50 text-green-700"
                        : form.status === "Draft"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {form.status}
                  </span>
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

function LocationsContent() {
  const locations = [
    { name: "East Clinics", address: "", lastUpdate: "12:24 pm, 6 Mar 2026" },
    { name: "Splose OT", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
    { name: "Ploc", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
    { name: "Tasks", address: "", lastUpdate: "11:59 am, 5 Mar 2026" },
    { name: "Sharon's", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
    { name: "One service only", address: "297 Pirie St, Adelaide, SA, 5000", lastUpdate: "2:08 pm, 26 Feb 2026" },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Locations</h1>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Show archived
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            + New location
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Address</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Last update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {locations.map((loc) => (
              <tr key={loc.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-text">{loc.name}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{loc.address}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{loc.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-1 mt-4">
        <button className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-gray-100">&lt;</button>
        <button className="rounded border border-primary px-2.5 py-1 text-sm font-medium text-primary bg-purple-50">1</button>
        <button className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-gray-100">&gt;</button>
      </div>
    </div>
  );
}

/* ─── Tags ────────────────────────────────────────────────────────── */

function TagsContent() {
  const [activeTab, setActiveTab] = useState("Client tags");
  const tabs = [
    { name: "Client tags" },
    { name: "Service tags" },
    { name: "Waitlist tags" },
    { name: "AI tags", badge: "New" },
  ];

  const clientTags = [
    { name: "2025-11-22", color: "#f59e0b" },
    { name: "Client consents to photography for promotional purposes", color: "#22c55e" },
    { name: "Client DOES NOT consent to photography for promotional purposes", color: "#ef4444" },
    { name: "Company A", color: "#f59e0b" },
    { name: "Dual funding", color: "#f59e0b" },
    { name: "Exception", color: "#f97316" },
    { name: "FORMS PENDING", color: "#ef4444" },
    { name: "High risk", color: "#ef4444" },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Tags</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          + New tag
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`border-b-2 px-1 pb-3 text-sm flex items-center gap-1.5 ${
              activeTab === tab.name
                ? "border-primary font-medium text-primary"
                : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            {tab.name}
            {tab.badge && (
              <span className="rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tags table */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Colour</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clientTags.map((tag) => (
              <tr key={tag.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-text">{tag.name}</td>
                <td className="px-4 py-3">
                  <div
                    className="h-5 w-8 rounded"
                    style={{ backgroundColor: tag.color }}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-text-secondary hover:text-text">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
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

/* ─── Users ───────────────────────────────────────────────────────── */

function UsersContent() {
  const users = [
    { name: "Nicholas Smithson", badge: "Account owner", email: "nick@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "OT", status: "Active" },
    { name: "Splose Support", badge: null, email: "support@splose.com", roleName: "Practice manager", roleType: "Practice manager", group: "---", status: "Active" },
    { name: "nick sand", badge: null, email: "nick1@splose.com", roleName: "Practitioner", roleType: "Practitioner", group: "---", status: "Active" },
    { name: "Harry Nguyen", badge: "Account owner", email: "harry@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "OT", status: "Active" },
    { name: "Cheng Ma", badge: "Account owner", email: "cheng@splose.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "Intake team, +1 more", status: "Active" },
    { name: "Rakesh Soni", badge: "Account owner", email: "rakesh@splose.com", roleName: "Practice manager", roleType: "Practice manager", group: "Physio", status: "Active" },
    { name: "Cheng Test", badge: null, email: "machengjam@gmail.com", roleName: "Practitioner admin", roleType: "Practitioner admin", group: "---", status: "Active" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Users</h1>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Invite users
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search for user name and email"
          className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Search
        </button>
      </div>

      {/* Users table */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                Name <span className="text-xs">&#8597;</span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                Email <span className="text-xs">&#8597;</span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Role name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                Role type <span className="text-xs">&#9661;</span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                Group <span className="text-xs">&#9661;</span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                Status <span className="text-xs">&#9661;</span>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.email} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <span className="text-sm text-text">{user.name}</span>
                    {user.badge && (
                      <span className="ml-2 inline-flex rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {user.badge}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{user.email}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{user.roleName}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{user.roleType}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{user.group}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{user.status}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-text-secondary hover:text-text">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
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

/* ─── Referral Types ──────────────────────────────────────────────── */

function ReferralTypesContent() {
  const referralTypes = [
    { name: "Client", defaultType: true },
    { name: "Contact", defaultType: true },
    { name: "Other", defaultType: true },
    { name: "Facebook", defaultType: false },
    { name: "Google", defaultType: false },
    { name: "Doctor", defaultType: false },
    { name: "GP", defaultType: false },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Referral types</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          + Add referral type
        </button>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Default type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {referralTypes.map((rt) => (
              <tr key={rt.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-text">{rt.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-medium ${rt.defaultType ? "text-green-600" : "text-red-500"}`}>
                    {rt.defaultType ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {rt.defaultType ? (
                    <span className="text-text-secondary">-</span>
                  ) : (
                    <button className="text-text-secondary hover:text-text">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <button className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-gray-100">&lt;</button>
        <button className="rounded border border-primary px-2.5 py-1 text-sm font-medium text-primary bg-purple-50">1</button>
        <button className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-gray-100">&gt;</button>
        <span className="text-sm text-text-secondary ml-2">10 / page</span>
      </div>
    </div>
  );
}

/* ─── User Groups ─────────────────────────────────────────────────── */

function UserGroupsContent() {
  const groups = [
    { name: "Intake team", users: 3 },
    { name: "OT", users: 7 },
    { name: "Physio", users: 7 },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">User groups</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM4 11a1 1 0 100-2H3a1 1 0 000 2h1zM10 18a1 1 0 001-1v-1a1 1 0 10-2 0v1a1 1 0 001 1z" /></svg>
            Learn
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            + New group
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search for group name"
          className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Search
        </button>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-green-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                Name <span className="text-xs">&#8597;</span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Users</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {groups.map((g) => (
              <tr key={g.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-text">{g.name}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{g.users}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-text-secondary hover:text-text">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-sm text-text-secondary">1-3 of 3 items</span>
        <button className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-gray-100">&lt;</button>
        <button className="rounded border border-primary px-2.5 py-1 text-sm font-medium text-primary bg-purple-50">1</button>
        <button className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-gray-100">&gt;</button>
        <span className="text-sm text-text-secondary ml-2">10 / page</span>
      </div>
    </div>
  );
}

/* ─── Payment Settings ────────────────────────────────────────────── */

function PaymentSettingsContent() {
  const paymentMethods = [
    { name: "Credit Card", description: "stripe payment", status: "Active" },
    { name: "EFTPOS", description: "", status: "Active" },
    { name: "Medicare", description: "", status: "Active" },
    { name: "HICAPS", description: "", status: "Active" },
    { name: "Cash", description: "Pay by cash", status: "Active" },
    { name: "Bank Transfer (Xero)", description: "", status: "Active" },
    { name: "DVA", description: "", status: "Active" },
    { name: "Other", description: "", status: "Active" },
    { name: "CC", description: "Credit Card", status: "Active" },
    { name: "PE CC", description: "PE Credit Card", status: "Active" },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-text mb-6">Payment settings</h1>

      {/* Next payment number */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text mb-3">Next payment number</h2>
        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-sm text-text-secondary mb-1">
              Prefix <span className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-300 text-[10px] text-gray-400 cursor-help">i</span>
            </label>
            <input type="text" defaultValue="MYDD" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">
              Padding <span className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-300 text-[10px] text-gray-400 cursor-help">i</span>
            </label>
            <input type="text" defaultValue="5" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
        </div>
      </div>

      {/* PDF settings */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text mb-3">PDF settings</h2>
        <div className="max-w-md">
          <label className="block text-sm text-text-secondary mb-1">Brand colour</label>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-10 w-10 rounded border border-border" style={{ backgroundColor: "#8689FC" }} />
            <input type="text" defaultValue="#8689FC" className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <button className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
            Save
          </button>
        </div>
      </div>

      {/* Accepted forms of payment */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text mb-4">Accepted forms of payment</h2>
        <div className="rounded-lg border border-border bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paymentMethods.map((pm) => (
                <tr key={pm.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-text">{pm.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{pm.description}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                      {pm.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-text-secondary hover:text-primary">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button className="text-text-secondary hover:text-red-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <button className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-gray-100">&lt;</button>
          <button className="rounded border border-primary px-2.5 py-1 text-sm font-medium text-primary bg-purple-50">1</button>
          <button className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-gray-100">2</button>
          <button className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-gray-100">&gt;</button>
        </div>
      </div>

      {/* Add payment method */}
      <div className="mb-6">
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          + Add payment method
        </button>
      </div>

      <hr className="border-border mb-6" />

      {/* NDIS bulk upload */}
      <div>
        <h2 className="text-base font-semibold text-text mb-3">NDIS bulk upload</h2>
        <div className="max-w-md">
          <label className="block text-sm text-text mb-1">
            Payment method<span className="text-red-500">*</span>
          </label>
          <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-3">
            <option>Credit Card</option>
          </select>
          <button className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Communication Types ─────────────────────────────────────────── */

function CommunicationTypesContent() {
  const types = [
    { name: "SMS", defaultType: true },
    { name: "Email", defaultType: true },
    { name: "Phone call", defaultType: false },
    { name: "In-person", defaultType: false },
    { name: "fax", defaultType: false },
    { name: "Admin Notes", defaultType: false },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Communication types</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          + Add communication type
        </button>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Default type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {types.map((t) => (
              <tr key={t.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-text">{t.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-medium ${t.defaultType ? "text-green-600" : "text-red-500"}`}>
                    {t.defaultType ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {t.defaultType ? (
                    <span className="text-text-secondary">-</span>
                  ) : (
                    <button className="text-text-secondary hover:text-text">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <button className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-gray-100">&lt;</button>
        <button className="rounded border border-primary px-2.5 py-1 text-sm font-medium text-primary bg-purple-50">1</button>
        <button className="rounded px-2 py-1 text-sm text-text-secondary hover:bg-gray-100">&gt;</button>
        <span className="text-sm text-text-secondary ml-2">10 / page</span>
      </div>
    </div>
  );
}

/* ─── Cancellation Reasons ────────────────────────────────────────── */

function CancellationReasonsContent() {
  const reasons = [
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

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Cancellation reasons</h1>
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Show archived
        </button>
      </div>

      <div className="space-y-0 divide-y divide-border">
        {reasons.map((r) => (
          <div key={r.name} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text">{r.name}</span>
              {r.code && (
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-text-secondary">{r.code}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="text-text-secondary hover:text-primary">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button className="text-text-secondary hover:text-red-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Busy Times ──────────────────────────────────────────────────── */

function BusyTimesContent() {
  const busyTypes = [
    { name: "Leave me alone", color: "#ef4444", utilisation: "Excluded", duration: 15 },
    { name: "OT referral", color: "#f97316", utilisation: "Excluded", duration: 30 },
    { name: "Meeting", color: "#374151", utilisation: "Excluded", duration: 30 },
    { name: "Lunch", color: "#6366f1", utilisation: "Excluded", duration: 30 },
    { name: "Admin", color: "#ec4899", utilisation: "Included", duration: 30 },
    { name: "CPD", color: "#3b82f6", utilisation: "Excluded", duration: 30 },
    { name: "Travel", color: "#22c55e", utilisation: "Excluded", duration: 30 },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">Busy time types</h1>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Show archived
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            + New type
          </button>
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-6">
        Use busy time to indicate non billable events in Practitioner calendars. You can change utilisation settings to control whether specific types of busy time are used in utilisation reports.
      </p>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Utilisation</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Duration (mins)</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {busyTypes.map((bt) => (
              <tr key={bt.name} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: bt.color }} />
                    <span className="text-sm text-text">{bt.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{bt.utilisation}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{bt.duration}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-text-secondary hover:text-text">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
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
