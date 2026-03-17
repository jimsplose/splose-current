export default function ReportsPage() {
  const sections = [
    {
      title: "Overview",
      items: ["Performance overview"],
    },
    {
      title: "Calendar",
      items: ["Appointments", "Support activities"],
    },
    {
      title: "Clients",
      items: ["Cases", "Waitlist", "Clients"],
    },
    {
      title: "Compliance",
      items: ["Progress notes", "Forms"],
    },
    {
      title: "Financial",
      items: ["Uninvoiced", "Payments", "Aged debtors", "NDIS bulk upload"],
    },
    {
      title: "Practitioners",
      items: ["Billed items", "Performance"],
    },
  ];

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
              {section.items.map((item, i) => (
                <li key={item}>
                  <button
                    className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors hover:bg-purple-50 hover:text-primary ${
                      section.title === "Overview" && i === 0
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
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-text mb-4">Performance overview</h1>
        <div className="flex items-center gap-2 mb-6">
          <span className="rounded-full border border-primary bg-purple-50 px-3 py-1 text-sm text-primary">
            {new Date(Date.now() - 7 * 86400000).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "2-digit" })}
          </span>
          <span className="text-text-secondary">→</span>
          <span className="rounded-full border border-primary bg-purple-50 px-3 py-1 text-sm text-primary">
            {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "2-digit" })}
          </span>
          <button className="rounded-full border border-border bg-white px-3 py-1 text-sm text-text hover:bg-gray-50">
            Daily
          </button>
          <button className="rounded-full border border-border bg-white px-3 py-1 text-sm text-text hover:bg-gray-50">
            All locations
          </button>
          <button className="rounded-full border border-border bg-white px-3 py-1 text-sm text-text hover:bg-gray-50">
            All practitioners
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Utilisation card */}
          <div className="rounded-lg border border-border bg-white p-4">
            <h3 className="text-sm font-semibold text-text">Utilisation</h3>
            <p className="text-xs text-text-secondary">Percentage of available time utilised</p>
            <p className="mt-2 text-3xl font-bold text-text">0.00%</p>
            <div className="mt-4 h-32 rounded bg-gray-50" />
          </div>
          {/* Revenue card */}
          <div className="rounded-lg border border-border bg-white p-4">
            <h3 className="text-sm font-semibold text-text">Revenue</h3>
            <p className="text-xs text-text-secondary">Total invoiced revenue from appointments</p>
            <p className="mt-2 text-3xl font-bold text-text">$0.00</p>
            <div className="mt-4 h-32 rounded bg-gray-50" />
          </div>
        </div>

        {/* Practitioners table */}
        <div className="rounded-lg border border-border bg-white">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-text">Practitioners</h3>
            <p className="text-xs text-text-secondary">Breakdown of performance by individual practitioner</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-purple-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-text">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text">Utilisation rate</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-text">Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-text-secondary">
                  No data for selected period
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
