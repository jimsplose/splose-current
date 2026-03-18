import { Search, Plus, MoreHorizontal, ArrowUpDown, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

const communicationsData = [
  {
    id: "1",
    dateTime: "4:56 pm, 5 Mar 2026",
    subject: "Please complete A from Hands Together Therapies",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "A",
  },
  {
    id: "2",
    dateTime: "4:56 pm, 5 Mar 2026",
    subject: "Please complete A from Hands Together Therapies",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "A",
  },
  {
    id: "3",
    dateTime: "4:55 pm, 5 Mar 2026",
    subject: "Copy of your completed form attached",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Failed" as const,
    link: "A",
  },
  {
    id: "4",
    dateTime: "4:54 pm, 5 Mar 2026",
    subject: "Letter DVA from Hands Together Therapies",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "Letter DVA",
  },
  {
    id: "5",
    dateTime: "11:20 am, 25 Feb 2026",
    subject: "",
    type: "SMS" as const,
    direction: "Outbound" as const,
    status: "Failed" as const,
    link: "",
  },
  {
    id: "6",
    dateTime: "3:39 pm, 13 Feb 2026",
    subject: "",
    type: "SMS" as const,
    direction: "Outbound" as const,
    status: "Failed" as const,
    link: "Appointment 14 Feb 2026 12:00 PM",
  },
  {
    id: "7",
    dateTime: "3:39 pm, 13 Feb 2026",
    subject: "Appointment with Hands Together Therapy",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Failed" as const,
    link: "Appointment 14 Feb 2026 12:00 PM",
  },
];

export default async function ClientCommunicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void id;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">Communications</h1>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Log communication
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for message, to and from"
          className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <span className="inline-flex items-center gap-1">
                  Date and time <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Subject</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <span className="inline-flex items-center gap-1">
                  Direction <Filter className="h-3.5 w-3.5 text-text-secondary" />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Links</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {communicationsData.map((comm) => (
              <tr key={comm.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-text">{comm.dateTime}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{comm.subject || "—"}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{comm.type}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-text-secondary">{comm.direction}</span>
                    {comm.status === "Delivered" ? (
                      <span className="inline-flex w-fit items-center rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex w-fit items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                        Failed
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {comm.link ? (
                    <span className="text-primary hover:underline cursor-pointer">{comm.link}</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-text-secondary hover:text-text">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-7 of 7 items</span>
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
