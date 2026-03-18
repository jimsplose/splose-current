export default function ClientCasesPage() {
  const mockCases = [
    { number: "0466", issueDate: "1 Mar 2026", expiryDate: "19 Mar 2026", assignee: "Hung Yee Wong", type: "Budget", allocated: "0.00 of 100.00", invoiced: "0.00 of 100.00", status: "Active" },
    { number: "0389", issueDate: "1 Oct 2025", expiryDate: "1 Nov 2025", assignee: "Unassigned", type: "Budget", allocated: "0.00 of 1,000.00", invoiced: "0.00 of 1,000.00", status: "Expired" },
    { number: "0405", issueDate: "30 Sep 2025", expiryDate: "1 Nov 2025", assignee: "Unassigned", type: "Hours", allocated: "3.00 of 3.00 hours", invoiced: "3.00 of 3.00 hours", status: "Expired" },
    { number: "indefinite", issueDate: "30 Sep 2025", expiryDate: "N/A", assignee: "Joseph Ge", type: "Appointments", allocated: "3 of 3 appointments", invoiced: "3 of 3 appointments", status: "Active" },
    { number: "0391", issueDate: "29 Sep 2025", expiryDate: "1 Nov 2025", assignee: "Joseph Ge", type: "Hours", allocated: "2.25 of 1.00 hour", invoiced: "2.25 of 1.00 hour", status: "Expired" },
    { number: "0388", issueDate: "28 Aug 2025", expiryDate: "1 Sep 2025", assignee: "Unassigned", type: "Appointments", allocated: "0 of 1000 appointments", invoiced: "0 of 1000 appointments", status: "Expired" },
    { number: "0361", issueDate: "15 Aug 2025", expiryDate: "22 Aug 2025", assignee: "Unassigned", type: "Budget", allocated: "0.00", invoiced: "0.00", status: "Expired" },
    { number: "0360", issueDate: "1 Aug 2025", expiryDate: "2 Aug 2026", assignee: "Cheng Ma", type: "Budget", allocated: "0.00 of 1,000.00", invoiced: "0.00 of 1,000.00", status: "Active" },
    { number: "0337", issueDate: "1 Jul 2025", expiryDate: "2 Jul 2026", assignee: "Unassigned", type: "Budget", allocated: "0.00 of 1,000.00", invoiced: "0.00 of 1,000.00", status: "Active" },
    { number: "0297 (BSB)", issueDate: "5 Jun 2025", expiryDate: "29 Jun 2025", assignee: "Unassigned", type: "Appointments", allocated: "0 of 10 appointments", invoiced: "0 of 10 appointments", status: "Expired" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Cases</h1>
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          + New case
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
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
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Status</th>
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
                <td className="px-4 py-3 text-sm">
                  {c.status === "Active" ? (
                    <span className="inline-flex items-center rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">Active</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-400 px-2 py-0.5 text-xs font-medium text-white">Expired</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-10 of 18 items</span>
          <div className="ml-4 flex items-center gap-1">
            <span className="text-text-secondary/40">&lt;</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">1</button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50">2</button>
            <span>&gt;</span>
          </div>
          <span className="ml-4">10 / page</span>
        </div>
      </div>
    </div>
  );
}
