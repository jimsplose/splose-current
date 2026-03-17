"use client";

import { useState } from "react";
import Link from "next/link";

const sidebarSections = [
  {
    title: "Workspace",
    items: [
      { name: "Details", href: "/settings" },
      { name: "Integrations", href: "/settings" },
      { name: "Subscription", href: "/settings" },
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
      { name: "Cancel/Reschedule", href: "/settings" },
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
      { name: "Permissions & Roles", href: "/settings" },
      { name: "Security", href: "/settings" },
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
  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Details</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          Save
        </button>
      </div>

      <div className="space-y-6">
        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Clinic logo
          </label>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <button className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
                Upload logo
              </button>
              <p className="mt-1 text-xs text-text-secondary">
                PNG or JPG, max 2MB. Recommended size: 200x200px
              </p>
            </div>
          </div>
        </div>

        {/* Clinic name */}
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Clinic name
          </label>
          <input
            type="text"
            defaultValue="Acme Allied Health"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* ABN */}
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            ABN
          </label>
          <input
            type="text"
            defaultValue="12 345 678 901"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Address
          </label>
          <input
            type="text"
            defaultValue="123 Collins Street, Melbourne VIC 3000"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Phone & Email row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Phone
            </label>
            <input
              type="text"
              defaultValue="(03) 9876 5432"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue="admin@acmealliedhealth.com.au"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Timezone
          </label>
          <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
            <option>Australia/Melbourne (AEDT, UTC+11)</option>
            <option>Australia/Sydney (AEDT, UTC+11)</option>
            <option>Australia/Brisbane (AEST, UTC+10)</option>
            <option>Australia/Perth (AWST, UTC+8)</option>
            <option>Australia/Adelaide (ACDT, UTC+10:30)</option>
          </select>
        </div>

        {/* Country & Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Country
            </label>
            <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
              <option>Australia</option>
              <option>New Zealand</option>
              <option>United Kingdom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Currency
            </label>
            <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
              <option>AUD ($)</option>
              <option>NZD ($)</option>
              <option>GBP (&pound;)</option>
            </select>
          </div>
        </div>

        {/* Financial year start */}
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Financial year start
          </label>
          <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
            <option>July</option>
            <option>January</option>
          </select>
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
        <input
          type="text"
          placeholder="Search integrations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64"
        />
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
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Connected
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary mb-4">
              {integration.description}
            </p>
            <button
              className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                integration.connected
                  ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                  : "border border-primary bg-white text-primary hover:bg-purple-50"
              }`}
            >
              {integration.connected ? "Disconnect" : "Connect"}
            </button>
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
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          Save
        </button>
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
          <button className="rounded-lg border border-primary bg-white px-3 py-1.5 text-sm font-medium text-primary hover:bg-purple-50">
            Top up
          </button>
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
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              SMS provider
            </label>
            <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
              <option>Twilio</option>
              <option>MessageMedia</option>
              <option>Burst SMS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Sender name / number
            </label>
            <input
              type="text"
              defaultValue="AcmeHealth"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          + New template
        </button>
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
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      template.active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {template.active ? "Active" : "Inactive"}
                  </span>
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
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === "Delivered"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
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
