import { Plus, Filter, Map, Eye, HelpCircle } from "lucide-react";

const screenerData = [
  { triage: { yes: false, no: false }, tags: "---", client: "DDDDDDD Hun", dob: "---", address: "---", form: "Test form saved in A jr", dateSubmitted: "6 Mar 2026 (5 days)" },
  { triage: { yes: false, no: false }, tags: "---", client: "Hao Wang", dob: "---", address: "---", form: "Test EMB", dateSubmitted: "25 Feb 2026 (14 days)" },
  { triage: { yes: false, no: false }, tags: "---", client: "Hao Wang", dob: "---", address: "---", form: "Test EMB", dateSubmitted: "25 Feb 2026 (14 days)" },
  { triage: { yes: false, no: false }, tags: "---", client: "de qwe", dob: "---", address: "---", form: "Untitled form", dateSubmitted: "19 Jan 2026 (51 days)" },
  { triage: { yes: false, no: false }, tags: "---", client: "hello qqq", dob: "---", address: "---", form: "Untitled form", dateSubmitted: "19 Jan 2026 (51 days)" },
];

const waitlistData = [
  { tags: ["To assign a unique ID"], client: "kai win", dob: "1 Mar 2022", address: "---", dateAdded: "5 Mar 2026 (6 days)", service: "First Appointment ()" },
  { tags: ["---"], client: "New client", dob: "---", address: "Adelaide 5000", dateAdded: "5 Mar 2026 (6 days)", service: "Copy of ..." },
  { tags: ["Admin to review"], client: "test test", dob: "---", address: "---", dateAdded: "19 Feb 2026 (20 days)", service: "1:1 Consultation" },
  { tags: ["---"], client: "Ella Thompson", dob: "18 Feb 2015", address: "Adelaide 5000", dateAdded: "3 Feb 2026 (36 days)", service: "First Appointment" },
  { tags: ["Admin to review"], client: "splose Ruvi", dob: "2 Feb 1998", address: "---", dateAdded: "19 Jan 2026 (51 days)", service: "1:1 Consultation" },
  { tags: ["Admin to review"], client: "test ruvi", dob: "2 Apr 2021", address: "---", dateAdded: "19 Jan 2026 (51 days)", service: "1:1 Consultation" },
  { tags: ["Low"], client: "Jenny Jenkins", dob: "2 Feb 2002", address: "---", dateAdded: "29 Dec 2025 (72 days)", service: "First Appointment" },
  { tags: ["Admin to review", "Medium", "NDIS referral"], client: "Harry James", dob: "5 Jul 1985", address: "Adelaide 5000", dateAdded: "22 Dec 2025 (79 days)", service: "Back Re-Alignment" },
];

const tagColors: Record<string, string> = {
  "To assign a unique ID": "bg-red-100 text-red-700",
  "Admin to review": "bg-yellow-100 text-yellow-700",
  "Low": "bg-green-100 text-green-700",
  "Medium": "bg-orange-100 text-orange-700",
  "NDIS referral": "bg-purple-100 text-purple-700",
};

export default function WaitlistPage() {
  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex items-center gap-4 border-b border-border px-6 pt-2">
        <button className="border-b-2 border-transparent px-1 pb-2 text-sm text-text-secondary hover:text-text">
          Screener
        </button>
        <button className="border-b-2 border-primary px-1 pb-2 text-sm font-medium text-primary">
          Waitlist
        </button>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Waitlist</h1>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Reset all filters
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
              <HelpCircle className="h-4 w-4" />
              Learn
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
              <Eye className="h-4 w-4" />
              Show/hide fields
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
              <Map className="h-4 w-4" />
              Map
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
              <Plus className="h-4 w-4" />
              Add client
            </button>
          </div>
        </div>

        {/* Active / Closed tabs */}
        <div className="mb-4 flex items-center gap-4">
          <button className="border-b-2 border-primary pb-1 text-sm font-medium text-primary">Active</button>
          <button className="border-b-2 border-transparent pb-1 text-sm text-text-secondary hover:text-text">Closed</button>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search for client name"
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
                <th className="px-4 py-3 text-left text-sm font-medium text-text">
                  <div className="flex items-center gap-1">
                    Tags
                    <Filter className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Client</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Date of birth</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Address</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Date added</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Service</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {waitlistData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.tags.map((tag) =>
                        tag === "---" ? (
                          <span key={tag} className="text-sm text-text-secondary">---</span>
                        ) : (
                          <span
                            key={tag}
                            className={`rounded px-2 py-0.5 text-[11px] font-medium ${tagColors[tag] || "bg-gray-100 text-gray-700"}`}
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-primary">{row.client}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{row.dob}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{row.address}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{row.dateAdded}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{row.service}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-text-secondary hover:text-text">...</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
            <span>1-10 of 88 items</span>
            <div className="ml-4 flex items-center gap-1">
              <span>&lt;</span>
              <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">1</button>
              <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary">2</button>
              <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary">3</button>
              <span>...</span>
              <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary">9</button>
              <span>&gt;</span>
            </div>
            <span className="ml-4">10 / page</span>
          </div>
        </div>
      </div>
    </div>
  );
}
