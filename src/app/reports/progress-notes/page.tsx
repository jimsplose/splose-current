const sections = [
  { title: "Overview", items: ["Performance overview"] },
  { title: "Calendar", items: ["Appointments", "Support activities"] },
  { title: "Clients", items: ["Cases", "Waitlist", "Clients"] },
  { title: "Compliance", items: ["Progress notes", "Forms"] },
  { title: "Financial", items: ["Uninvoiced", "Payments", "Aged debtors", "NDIS bulk upload"] },
  { title: "Practitioners", items: ["Billed items", "Performance"] },
];

export default function ReportsProgressNotesPage() {
  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-white p-4 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-text">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item}>
                  <button
                    className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors hover:bg-purple-50 hover:text-primary ${
                      item === "Progress notes"
                        ? "border-l-2 border-primary bg-purple-50 text-primary font-medium"
                        : "text-text-secondary"
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text">Progress notes</h1>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
              Export
            </button>
            <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
              Learn about this report
            </button>
          </div>
        </div>

        {/* Date range */}
        <div className="mb-4">
          <label className="text-sm text-text-secondary flex items-center gap-1 mb-1">
            <span>&#128197;</span> Date range *
          </label>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">
              11 Mar 2026
            </div>
            <span className="text-text-secondary">→</span>
            <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">
              11 Mar 2026
            </div>
            <button className="rounded p-1 text-text-secondary hover:bg-gray-100">&#128197;</button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 mb-8">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Add filter
          </button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Save filters
          </button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Load filters
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            Run report
          </button>
        </div>
      </div>
    </div>
  );
}
