import { Search, Plus, MoreHorizontal, ArrowUpDown, Filter } from "lucide-react";
import { Button, PageHeader, TableHead, Th, TableBody, Td, Pagination, Badge, statusVariant } from "@/components/ds";

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

export default async function ClientCommunicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  void id;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <PageHeader title="Communications">
        <Button>
          <Plus className="h-4 w-4" />
          Log communication
        </Button>
      </PageHeader>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for message, to and from"
          className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <Button>
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full">
          <TableHead>
            <Th>
              <span className="inline-flex items-center gap-1">
                Date and time <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
              </span>
            </Th>
            <Th>Subject</Th>
            <Th>Type</Th>
            <Th>
              <span className="inline-flex items-center gap-1">
                Direction <Filter className="h-3.5 w-3.5 text-text-secondary" />
              </span>
            </Th>
            <Th>Links</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {communicationsData.map((comm) => (
              <tr key={comm.id} className="hover:bg-gray-50">
                <Td>
                  <div className="flex items-center gap-2">
                    <button className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border text-xs text-text-secondary hover:bg-gray-100">
                      +
                    </button>
                    {comm.dateTime}
                  </div>
                </Td>
                <Td className="text-text-secondary">{comm.subject || "—"}</Td>
                <Td className="text-text-secondary">{comm.type}</Td>
                <Td>
                  <div className="flex flex-col gap-1">
                    <span className="text-text-secondary">{comm.direction}</span>
                    <Badge variant={statusVariant(comm.status)}>{comm.status}</Badge>
                  </div>
                </Td>
                <Td>
                  {comm.link ? <span className="cursor-pointer text-primary hover:underline">{comm.link}</span> : "—"}
                </Td>
                <Td align="right">
                  <button className="text-text-secondary hover:text-text">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </Td>
              </tr>
            ))}
          </TableBody>
        </table>
        <Pagination totalItems={7} itemsPerPage={10} />
      </div>
    </div>
  );
}
