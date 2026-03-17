export default function ClientCasesPage() {
  const mockCases = [
    { number: "0466", issueDate: "1 Mar 2026", expiryDate: "19 Mar 2026", assignee: "Hung Yee Wong", type: "Budget", allocated: "0.00 of 100.00", invoiced: "0.00 of 100.00" },
    { number: "0389", issueDate: "1 Oct 2025", expiryDate: "1 Nov 2025", assignee: "Unassigned", type: "Budget", allocated: "0.00 of 1,000.00", invoiced: "0.00 of 1,000.00" },
    { number: "0405", issueDate: "30 Sep 2025", expiryDate: "1 Nov 2025", assignee: "Unassigned", type: "Hours", allocated: "3.00 of 3.00 hours", invoiced: "3.00 of 3.00 hours" },
    { number: "indefinite", issueDate: "30 Sep 2025", expiryDate: "N/A", assignee: "Joseph Ge", type: "Appointments", allocated: "3 of 3 appointments", invoiced: "3 of 3 appointments" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Cases</h1>
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          + New case
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Case Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Issue date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Expiry date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Assignee</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Allocated</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Invoiced</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockCases.map((c) => (
              <tr key={c.number} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-text">{c.number}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{c.issueDate}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{c.expiryDate}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{c.assignee}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{c.type}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{c.allocated}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{c.invoiced}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-{mockCases.length} of {mockCases.length} items</span>
          <div className="ml-4 flex items-center gap-1">
            <span>&lt;</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">1</button>
            <span>&gt;</span>
          </div>
          <span className="ml-4">10 / page</span>
        </div>
      </div>
    </div>
  );
}
