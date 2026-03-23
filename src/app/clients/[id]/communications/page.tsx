"use client";

import { Plus, ArrowUpDown, Filter } from "lucide-react";
import { Button, Card, DataTable, PageHeader, SearchBar, TableHead, Th, TableBody, Tr, Td, LinkCell, Pagination, Badge, statusVariant, Dropdown, DropdownTriggerButton } from "@/components/ds";

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

const dropdownItems = [
  { label: "View", value: "view" },
  { label: "Resend", value: "resend" },
  { label: "Delete", value: "delete", danger: true },
];

export default function ClientCommunicationsPage() {

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <PageHeader title="Communications">
        <Button>
          <Plus className="h-4 w-4" />
          Log communication
        </Button>
      </PageHeader>

      <SearchBar placeholder="Search for message, to and from" />

      <Card padding="none" className="overflow-x-auto">
        <DataTable>
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
              <Tr key={comm.id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <Button variant="icon" size="sm" className="h-5 w-5 rounded border border-border text-xs">
                      +
                    </Button>
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
                  {comm.link ? <LinkCell>{comm.link}</LinkCell> : "—"}
                </Td>
                <Td align="right">
                  <Dropdown
                    align="right"
                    trigger={<DropdownTriggerButton />}
                    items={dropdownItems}
                    onSelect={() => {}}
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination totalItems={7} itemsPerPage={10} />
      </Card>
    </div>
  );
}
