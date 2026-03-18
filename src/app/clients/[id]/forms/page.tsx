export default function ClientFormsPage() {
  const mockForms = [
    { title: "baby due date test", status: "Incomplete", createdAt: "10:20 am, 2 Feb 2026", completed: "No", relatedAppt: "1:30 pm, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations" },
    { title: "Header test", status: "Incomplete", createdAt: "10:20 am, 2 Feb 2026", completed: "No", relatedAppt: "1:30 pm, 7 Feb 2026 – 2:3 Consultations 2:2 Consultations" },
    { title: "baby due date test", status: "Incomplete", createdAt: "10:16 am, 2 Feb 2026", completed: "No", relatedAppt: "11:30 am, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations" },
    { title: "Header test", status: "Incomplete", createdAt: "10:16 am, 2 Feb 2026", completed: "No", relatedAppt: "11:30 am, 7 Feb 2026 – 2:2 Consultations 2:3 Consultations" },
    { title: "baby due date test", status: "Incomplete", createdAt: "10:15 am, 2 Feb 2026", completed: "No", relatedAppt: "9:30 am, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations" },
    { title: "Header test", status: "Incomplete", createdAt: "10:15 am, 2 Feb 2026", completed: "No", relatedAppt: "9:30 am, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations" },
    { title: "Header test", status: "Incomplete", createdAt: "9:18 am, 12 Jan 2026", completed: "No", relatedAppt: "10:00 am, 14 Jan 2026 – Group booking Sharon Test" },
    { title: "baby due date test", status: "Incomplete", createdAt: "9:18 am, 12 Jan 2026", completed: "No", relatedAppt: "10:00 am, 14 Jan 2026 – Group booking Sharon Test" },
    { title: "baby due date test", status: "Incomplete", createdAt: "10:22 am, 30 Oct 2025", completed: "No", relatedAppt: "6:15 am, 28 Oct 2025 – 1:1 Consultation 1:1 Consultation" },
    { title: "Header test", status: "Incomplete", createdAt: "10:22 am, 30 Oct 2025", completed: "No", relatedAppt: "9:15 am, 28 Oct 2025 – 1:1 Consultation 1:1 Consultation" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">Forms</h1>
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          + New form
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for title"
          className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Search
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Created at</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Completed</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Related appointment</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockForms.map((form, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <span className="text-text">{form.title}</span>
                  <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                    {form.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{form.createdAt}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{form.completed}</td>
                <td className="px-4 py-3 text-sm text-primary">{form.relatedAppt}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-text-secondary hover:text-text">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-{mockForms.length} of {mockForms.length} items</span>
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
