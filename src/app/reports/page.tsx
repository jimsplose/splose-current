export default function ReportsPage() {
  const sections = [
    { title: "Overview", items: ["Performance overview"] },
    { title: "Calendar", items: ["Appointments", "Support activities"] },
    { title: "Clients", items: ["Cases", "Waitlist", "Clients"] },
    { title: "Compliance", items: ["Progress notes", "Forms"] },
    { title: "Financial", items: ["Uninvoiced", "Payments", "Aged debtors", "NDIS bulk upload"] },
    { title: "Practitioners", items: ["Billed items", "Performance"] },
  ];

  const practitioners = [
    { initials: "SC", name: "Sarah Chen", color: "#6366f1", utilisation: 10.09, revenue: 393.00 },
    { initials: "JW", name: "James Wilson", color: "#8b5cf6", utilisation: 6.88, revenue: 289.50 },
    { initials: "ET", name: "Emma Thompson", color: "#ec4899", utilisation: 5.00, revenue: 0.00 },
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
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-text">Performance overview</h1>
          <button className="rounded p-2 text-text-secondary hover:bg-gray-100">
            <span className="text-lg">&#9881;</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="rounded-full border border-primary bg-purple-50 px-3 py-1 text-sm text-primary">
            {new Date(Date.now() - 7 * 86400000).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "2-digit" })}
          </span>
          <span className="text-text-secondary">→</span>
          <span className="rounded-full border border-primary bg-purple-50 px-3 py-1 text-sm text-primary">
            {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "2-digit" })}
          </span>
          <button className="rounded-full border border-primary bg-purple-50 px-3 py-1 text-sm text-primary font-medium">
            Daily
          </button>
          <button className="rounded-full border border-border bg-white px-3 py-1 text-sm text-text hover:bg-gray-50">
            All locations
          </button>
          <button className="rounded-full border border-border bg-white px-3 py-1 text-sm text-text hover:bg-gray-50">
            All practitioners
          </button>
          <button className="rounded-full border border-border bg-white px-3 py-1 text-sm text-text hover:bg-gray-50">
            Compare
          </button>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Utilisation card */}
          <div className="rounded-lg border border-border bg-white p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-text">Utilisation</h3>
              <button className="text-text-secondary">...</button>
            </div>
            <p className="text-xs text-text-secondary mb-2">Percentage of available time utilised</p>
            <p className="text-3xl font-bold text-text mb-1">0.85%</p>
            <p className="text-xs text-text-secondary mb-4">
              {new Date(Date.now() - 7 * 86400000).toLocaleDateString("en-AU", { day: "2-digit", month: "short" })} - {new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short" })}
            </p>
            {/* Chart placeholder */}
            <div className="h-32 flex items-end gap-1">
              {[0.2, 0.3, 0.5, 1.5, 3.5, 4.8, 2.0].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary/20 rounded-t" style={{ height: `${(val / 5) * 100}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {new Date(Date.now() - 7 * 86400000).toLocaleDateString("en-AU", { day: "2-digit", month: "short" })} - {new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short" })}
            </div>
          </div>

          {/* Revenue card */}
          <div className="rounded-lg border border-border bg-white p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-text">Revenue</h3>
              <button className="text-text-secondary">...</button>
            </div>
            <p className="text-xs text-text-secondary mb-2">Total invoiced revenue from appointments and support activities (tax exclusive)</p>
            <p className="text-3xl font-bold text-text mb-1">$1.09K</p>
            <p className="text-xs text-text-secondary mb-4">
              {new Date(Date.now() - 7 * 86400000).toLocaleDateString("en-AU", { day: "2-digit", month: "short" })} - {new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short" })}
            </p>
            {/* Bar chart placeholder */}
            <div className="h-32 flex items-end gap-1">
              {[200, 150, 350, 300, 100, 250, 180].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary rounded-t" style={{ height: `${(val / 400) * 100}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {new Date(Date.now() - 7 * 86400000).toLocaleDateString("en-AU", { day: "2-digit", month: "short" })} - {new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short" })}
            </div>
          </div>
        </div>

        {/* Practitioners table */}
        <div className="rounded-lg border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-text">Practitioners</h3>
              <p className="text-xs text-text-secondary">Breakdown of performance by individual practitioner</p>
            </div>
            <button className="text-text-secondary">...</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left text-sm font-medium text-text">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text">
                  <div className="flex items-center gap-1">
                    Utilisation rate
                    <span className="text-text-secondary">&#9660;</span>
                  </div>
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-text">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {practitioners.map((p) => (
                <tr key={p.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.initials}
                      </div>
                      <span className="text-sm text-text">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-primary"
                          style={{ width: `${Math.min(p.utilisation * 10, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-text-secondary">{p.utilisation.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-text">
                    ${p.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
