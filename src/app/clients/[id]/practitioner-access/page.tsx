import { ArrowUpDown, Filter } from "lucide-react";

export default function ClientPractitionerAccessPage() {
  const mockPractitioners = [
    { name: "Delvin Khor", role: "Practitioner admin", roleType: "Practitioner admin", group: "---", status: "Linked" },
    { name: "Hrishikesh Koli", role: "Practitioner admin", roleType: "Practitioner admin", group: "---", status: "Linked" },
    { name: "Hung Yee Wong", role: "Practitioner admin", roleType: "Practitioner admin", group: "---", status: "Linked" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-text mb-4">Practitioner access</h1>
      <p className="text-sm text-text-secondary mb-6">
        You can link practitioners to clients via creating an appointment or support activity in the calendar tab.{" "}
        <span className="text-primary cursor-pointer hover:underline">Learn more</span>
      </p>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  Name
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Role name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Role type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  Group
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  <Filter className="h-3 w-3 text-text-secondary" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockPractitioners.map((p) => (
              <tr key={p.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div>
                    <span className="text-text">{p.name}</span>
                    <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                      Account owner
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{p.role}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{p.roleType}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{p.group}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{p.status}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-text-secondary hover:text-text">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-{mockPractitioners.length} of {mockPractitioners.length} items</span>
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
