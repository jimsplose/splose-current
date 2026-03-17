"use client";

import { useState } from "react";
import { Upload, Building2 } from "lucide-react";

interface SidebarItem {
  name: string;
  key: string;
  badge?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Workspace",
    items: [
      { name: "Details", key: "details" },
      { name: "Integrations", key: "integrations" },
      { name: "Subscription", key: "subscription" },
      { name: "SMS settings", key: "sms-settings" },
    ],
  },
  {
    title: "Automation",
    items: [
      { name: "Forms", key: "forms" },
      { name: "splose AI", key: "ai" },
    ],
  },
  {
    title: "Business",
    items: [
      { name: "Locations", key: "locations" },
      { name: "Custom fields", key: "custom-fields" },
      { name: "Rooms/Resources", key: "rooms-resources" },
      { name: "Services", key: "services" },
      { name: "Busy times", key: "busy-times" },
      { name: "Cancel/Reschedule", key: "cancel-reschedule" },
      { name: "Online bookings", key: "online-bookings", badge: "New" },
      { name: "Communication types", key: "communication-types" },
      { name: "Tags", key: "tags" },
      { name: "Referral types", key: "referral-types" },
    ],
  },
  {
    title: "Team",
    items: [
      { name: "Users", key: "users" },
      { name: "User groups", key: "user-groups" },
      { name: "Permissions & Roles", key: "permissions-roles" },
      { name: "Security", key: "security" },
    ],
  },
  {
    title: "Templates",
    items: [
      { name: "Appointments", key: "appointments" },
      { name: "Emails", key: "emails" },
      { name: "Progress notes", key: "progress-notes" },
      { name: "Letters", key: "letters" },
      { name: "Body charts", key: "body-charts" },
    ],
  },
];

const australianStates = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];

function DetailsForm() {
  const [form, setForm] = useState({
    practiceName: "Acme Allied Health",
    abn: "12 345 678 901",
    streetAddress: "123 Collins Street",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
    phone: "(03) 9123 4567",
    email: "admin@acmealliedhealth.com.au",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border px-8 py-3">
        <h1 className="text-lg font-bold text-text">Details</h1>
        <button className="rounded-md bg-primary px-5 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark">
          Save
        </button>
      </div>

      <div className="max-w-xl px-8 py-8">
        {/* Logo upload */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-medium text-text">
            Practice logo
          </label>
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-gray-50">
              <Building2 className="h-8 w-8 text-text-secondary" />
            </div>
            <div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text shadow-sm transition-colors hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                Upload logo
              </button>
              <p className="mt-1.5 text-xs text-text-secondary">
                PNG, JPG or SVG. Max 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Practice name */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-text">
            Practice name
          </label>
          <input
            type="text"
            value={form.practiceName}
            onChange={(e) => handleChange("practiceName", e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* ABN */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-text">
            ABN
          </label>
          <input
            type="text"
            value={form.abn}
            onChange={(e) => handleChange("abn", e.target.value)}
            placeholder="XX XXX XXX XXX"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Address section */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-text">
            Street address
          </label>
          <input
            type="text"
            value={form.streetAddress}
            onChange={(e) => handleChange("streetAddress", e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="mb-5 grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">
              Suburb
            </label>
            <input
              type="text"
              value={form.suburb}
              onChange={(e) => handleChange("suburb", e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">
              State
            </label>
            <select
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {australianStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">
              Postcode
            </label>
            <input
              type="text"
              value={form.postcode}
              onChange={(e) => handleChange("postcode", e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-text">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-text">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </div>
  );
}

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="mb-6 text-6xl">&#9881;</div>
      <h2 className="text-xl font-bold text-text">{title}</h2>
      <p className="mt-2 text-sm text-text-secondary">
        This settings page is coming soon.
      </p>
    </div>
  );
}

export default function SettingsPage() {
  const [activeItem, setActiveItem] = useState("details");

  const activeLabel =
    sidebarSections
      .flatMap((s) => s.items)
      .find((i) => i.key === activeItem)?.name ?? "Details";

  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left sidebar */}
      <aside className="w-52 shrink-0 border-r border-border bg-white py-4 overflow-y-auto">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-3">
            <h3 className="mb-0.5 px-5 text-xs font-bold text-text">
              {section.title}
            </h3>
            <ul>
              {section.items.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => setActiveItem(item.key)}
                    className={`w-full block px-5 py-1 text-left text-[13px] transition-colors hover:bg-purple-50 hover:text-primary ${
                      activeItem === item.key
                        ? "border-l-[3px] border-primary bg-purple-50 text-primary font-medium"
                        : "border-l-[3px] border-transparent text-text-secondary"
                    }`}
                  >
                    {item.name}
                    {item.badge && (
                      <span className="ml-2 inline-flex items-center rounded bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main content */}
      {activeItem === "details" ? (
        <DetailsForm />
      ) : (
        <PlaceholderContent title={activeLabel} />
      )}
    </div>
  );
}
