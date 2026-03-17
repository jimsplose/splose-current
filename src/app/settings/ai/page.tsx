import Link from "next/link";

const sidebarSections = [
  {
    title: "Workspace",
    items: ["Details", "Integrations", "Subscription", "SMS settings"],
  },
  {
    title: "Automation",
    items: ["Forms", "splose AI"],
  },
  {
    title: "Business",
    items: [
      "Locations", "Custom fields", "Rooms/Resources", "Services",
      "Busy times", "Cancel/Reschedule", "Online bookings",
      "Communication types", "Tags", "Referral types",
    ],
  },
  {
    title: "Team",
    items: ["Users", "User groups", "Permissions & Roles", "Security"],
  },
  {
    title: "Templates",
    items: ["Appointments", "Emails", "Progress notes", "Letters", "Body charts"],
  },
  {
    title: "Finances",
    items: ["Payments", "Invoices"],
  },
];

const aiPrompts = [
  { name: "Treatment Provided Prompt", userGroup: "Any user" },
  { name: "Objective Assessment Template", userGroup: "Any user" },
  { name: "Prognosis and Goals Template", userGroup: "Any user" },
  { name: "SOAP Note Template", userGroup: "Any user" },
  { name: "Initial Assessment Prompt", userGroup: "Physiotherapists" },
  { name: "Voice to text SOAP progress note", userGroup: "Any user" },
  { name: "Report summary", userGroup: "Any user" },
  { name: "Letter to doctor", userGroup: "Any user" },
  { name: "Letter to patient", userGroup: "Any user" },
];

export default function SettingsAIPage() {
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
                <li key={item}>
                  <button
                    className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors hover:bg-purple-50 hover:text-primary ${
                      item === "splose AI"
                        ? "border-l-2 border-primary bg-purple-50 text-primary font-medium"
                        : "text-text-secondary"
                    }`}
                  >
                    {item}
                    {item === "Online bookings" && (
                      <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        New
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
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text">splose AI</h1>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
              Learn
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              Save
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center gap-6 border-b border-border">
          <button className="border-b-2 border-transparent px-1 pb-3 text-sm text-text-secondary hover:text-text">
            Preferences
          </button>
          <button className="border-b-2 border-primary px-1 pb-3 text-sm font-medium text-primary">
            Saved prompts
          </button>
          <button className="flex items-center gap-1.5 border-b-2 border-transparent px-1 pb-3 text-sm text-text-secondary hover:text-text">
            AI block library
            <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold text-yellow-700">BETA</span>
          </button>
        </div>

        {/* AI Prompts section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text">AI prompts</h2>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            + New prompt
          </button>
        </div>

        <div className="rounded-lg border border-border bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Prompt</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">User group</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {aiPrompts.map((prompt) => (
                <tr key={prompt.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-text">{prompt.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{prompt.userGroup}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-text-secondary hover:text-text">...</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
            <span>&lt;</span>
            <button className="mx-2 flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
              1
            </button>
            <span>&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
