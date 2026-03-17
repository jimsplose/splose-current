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

export default function SettingsPage() {
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
                    className={`w-full block rounded px-3 py-1.5 text-left text-sm transition-colors hover:bg-purple-50 hover:text-primary ${
                      item.name === "Details"
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
      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="mb-6 text-xl font-bold text-text">Details</h1>

        <div className="max-w-2xl space-y-8">
          {/* Practice/Clinic details */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Practice details
            </h2>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">
                Practice name
              </label>
              <input
                type="text"
                defaultValue="splose Demo Workspace"
                readOnly
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">
                ABN
              </label>
              <input
                type="text"
                defaultValue="12 345 678 901"
                readOnly
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">
                Phone
              </label>
              <input
                type="text"
                defaultValue="08 1234 5678"
                readOnly
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">
                Email
              </label>
              <input
                type="text"
                defaultValue="admin@splose.demo"
                readOnly
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
              />
            </div>
          </section>

          {/* Address */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Address
            </h2>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">
                Address line 1
              </label>
              <input
                type="text"
                defaultValue="123 Collins Street"
                readOnly
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">
                Address line 2
              </label>
              <input
                type="text"
                defaultValue=""
                readOnly
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text">
                  City / Suburb
                </label>
                <input
                  type="text"
                  defaultValue="Adelaide"
                  readOnly
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text">
                  State
                </label>
                <select
                  defaultValue="SA"
                  disabled
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                >
                  <option value="ACT">ACT</option>
                  <option value="NSW">NSW</option>
                  <option value="NT">NT</option>
                  <option value="QLD">QLD</option>
                  <option value="SA">SA</option>
                  <option value="TAS">TAS</option>
                  <option value="VIC">VIC</option>
                  <option value="WA">WA</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text">
                  Postcode
                </label>
                <input
                  type="text"
                  defaultValue="5000"
                  readOnly
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Logo */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Logo
            </h2>

            <div className="flex h-40 w-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-gray-50">
              <svg
                className="mb-2 h-8 w-8 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm font-medium text-text-secondary">
                Upload logo
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Recommended size: 200 x 200px
            </p>
          </section>

          {/* Save button */}
          <div>
            <button className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
