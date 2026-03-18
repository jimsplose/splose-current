export default function ReportsPage() {
  const practitioners = [
    { initials: "RR", name: "Ruvi R.", color: "#ef4444", utilisation: 10.09, revenue: 393.00 },
    { initials: "HW", name: "Hung Yee Wong", color: "#8b5cf6", utilisation: 6.88, revenue: 289.50 },
    { initials: "DB", name: "Dominica Barrett", color: "#06b6d4", utilisation: 5.00, revenue: 0.00 },
    { initials: "HK", name: "Hrishikesh Koli", color: "#ec4899", utilisation: 4.87, revenue: 0.00 },
    { initials: "JG", name: "Joseph Ge", color: "#22c55e", utilisation: 4.69, revenue: 0.00 },
    { initials: "ST", name: "Sharon Tan", color: "#f59e0b", utilisation: 2.58, revenue: 193.00 },
    { initials: "HW", name: "Hao Wang", color: "#3b82f6", utilisation: 2.50, revenue: 0.00 },
    { initials: "NH", name: "Nghia Hoang", color: "#6366f1", utilisation: 2.29, revenue: 0.00 },
  ];

  const dateStart = new Date(Date.now() - 7 * 86400000);
  const dateEnd = new Date();
  const fmtShort = (d: Date) => d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "2-digit" });
  const fmtDay = (d: Date) => d.toLocaleDateString("en-AU", { day: "2-digit", month: "short" });

  const chartDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(dateStart.getTime() + i * 86400000);
    return fmtDay(d);
  });

  const utilisationData = [0.0, 0.0, 0.5, 0.3, 0.2, 4.8, 2.0];
  const revenueData = [0, 50, 100, 350, 250, 400, 150];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">Performance overview</h1>
        <button className="rounded p-2 text-text-secondary hover:bg-gray-100">
          <span className="text-lg">&#9881;</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="rounded-full border border-primary bg-purple-50 px-3 py-1 text-sm text-primary">
          {fmtShort(dateStart)}
        </span>
        <span className="text-text-secondary">&rarr;</span>
        <span className="rounded-full border border-primary bg-purple-50 px-3 py-1 text-sm text-primary">
          {fmtShort(dateEnd)}
        </span>
        <select className="rounded-full border border-primary bg-purple-50 px-3 py-1 text-sm text-primary font-medium outline-none cursor-pointer">
          <option>Frequency: Daily</option>
          <option>Frequency: Weekly</option>
          <option>Frequency: Monthly</option>
          <option>Frequency: Quarterly</option>
          <option>Frequency: Yearly</option>
        </select>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Utilisation card - LINE chart */}
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-text">Utilisation</h3>
            <button className="text-text-secondary">...</button>
          </div>
          <p className="text-xs text-text-secondary mb-2">Percentage of available time utilised</p>
          <p className="text-3xl font-bold text-text mb-1">0.85%</p>
          <p className="text-xs text-text-secondary mb-4">
            {fmtDay(dateStart)} - {fmtDay(dateEnd)}
          </p>
          {/* SVG Line chart */}
          <div className="relative h-32">
            <svg viewBox="0 0 280 100" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="#f0f0f0" strokeWidth="0.5" />
              ))}
              {/* Line chart path */}
              <polyline
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2"
                points={utilisationData.map((v, i) => `${i * 46.67},${100 - (v / 5) * 100}`).join(" ")}
              />
              {/* Area fill */}
              <polygon
                fill="rgba(124, 58, 237, 0.1)"
                points={`0,100 ${utilisationData.map((v, i) => `${i * 46.67},${100 - (v / 5) * 100}`).join(" ")} 280,100`}
              />
              {/* Data points */}
              {utilisationData.map((v, i) => (
                <circle key={i} cx={i * 46.67} cy={100 - (v / 5) * 100} r="3" fill="#7c3aed" />
              ))}
            </svg>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-text-secondary -ml-1">
              <span>6%</span>
              <span>4%</span>
              <span>2%</span>
              <span>0%</span>
            </div>
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between mt-1 text-[9px] text-text-secondary px-2">
            {chartDays.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {fmtDay(dateStart)} - {fmtDay(dateEnd)}
          </div>
        </div>

        {/* Revenue card - BAR chart */}
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-text">Revenue</h3>
            <button className="text-text-secondary">...</button>
          </div>
          <p className="text-xs text-text-secondary mb-2">Total invoiced revenue from appointments and support activities (tax exclusive)</p>
          <p className="text-3xl font-bold text-text mb-1">$1.09K</p>
          <p className="text-xs text-text-secondary mb-4">
            {fmtDay(dateStart)} - {fmtDay(dateEnd)}
          </p>
          {/* Bar chart */}
          <div className="relative h-32">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-text-secondary">
              <span>$600</span>
              <span>$400</span>
              <span>$200</span>
              <span>$0</span>
            </div>
            <div className="ml-8 flex h-full items-end gap-2">
              {revenueData.map((val, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                  <div
                    className="w-full bg-primary rounded-t"
                    style={{ height: `${(val / 600) * 100}%`, minHeight: val > 0 ? "2px" : "0px" }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between mt-1 text-[9px] text-text-secondary ml-8">
            {chartDays.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {fmtDay(dateStart)} - {fmtDay(dateEnd)}
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
    </>
  );
}
