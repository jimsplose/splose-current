"use client";

import { useState } from "react";
import { Plus, ArrowUpDown, Filter } from "lucide-react";
import { Button, Card, DataTable, PageHeader, SearchBar, TableHead, Th, TableBody, Tr, Td, LinkCell, Pagination, Badge, statusVariant, Dropdown, DropdownTriggerButton, Modal } from "@/components/ds";

const communicationsData = [
  {
    id: "1",
    dateTime: "4:56 pm, 5 Mar 2026",
    subject: "Please complete A from Hands Together Therapies",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "A",
    body: "Dear Client,\n\nPlease complete form A from Hands Together Therapies at your earliest convenience. You can access the form using the link below.\n\nIf you have any questions, please don't hesitate to contact us.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "2",
    dateTime: "4:56 pm, 5 Mar 2026",
    subject: "Please complete A from Hands Together Therapies",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "A",
    body: "Dear Client,\n\nPlease complete form A from Hands Together Therapies at your earliest convenience. You can access the form using the link below.\n\nIf you have any questions, please don't hesitate to contact us.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "3",
    dateTime: "4:55 pm, 5 Mar 2026",
    subject: "Copy of your completed form attached",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Failed" as const,
    link: "A",
    body: "Dear Client,\n\nPlease find attached a copy of your completed form for your records.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "4",
    dateTime: "4:54 pm, 5 Mar 2026",
    subject: "Letter DVA from Hands Together Therapies",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Delivered" as const,
    link: "Letter DVA",
    body: "Dear Client,\n\nPlease find attached your DVA letter from Hands Together Therapies.\n\nKind regards,\nHands Together Therapies",
  },
  {
    id: "5",
    dateTime: "11:20 am, 25 Feb 2026",
    subject: "",
    type: "SMS" as const,
    direction: "Outbound" as const,
    status: "Failed" as const,
    link: "",
    body: "Hi, this is a reminder from Hands Together Therapies about your upcoming appointment.",
  },
  {
    id: "6",
    dateTime: "3:39 pm, 13 Feb 2026",
    subject: "",
    type: "SMS" as const,
    direction: "Outbound" as const,
    status: "Failed" as const,
    link: "Appointment 14 Feb 2026 12:00 PM",
    body: "Hi, this is a reminder from Hands Together Therapies. You have an appointment on 14 Feb 2026 at 12:00 PM. Reply YES to confirm or call us to reschedule.",
  },
  {
    id: "7",
    dateTime: "3:39 pm, 13 Feb 2026",
    subject: "Appointment with Hands Together Therapy",
    type: "Email" as const,
    direction: "Outbound" as const,
    status: "Failed" as const,
    link: "Appointment 14 Feb 2026 12:00 PM",
    body: "Dear Client,\n\nThis is a reminder about your upcoming appointment with Hands Together Therapies on 14 Feb 2026 at 12:00 PM.\n\nPlease let us know if you need to reschedule.\n\nKind regards,\nHands Together Therapies",
  },
];

const dropdownItems = [
  { label: "View", value: "view" },
  { label: "Resend", value: "resend" },
  { label: "Delete", value: "delete", danger: true },
];

export default function ClientCommunicationsPage() {
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    subject: string;
    dateTime: string;
    type: string;
    status: string;
    body: string;
  }>({
    open: false,
    subject: "",
    dateTime: "",
    type: "",
    status: "",
    body: "",
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; commId: string; subject: string }>({
    open: false,
    commId: "",
    subject: "",
  });

  function handleAction(value: string, comm: (typeof communicationsData)[number]) {
    if (value === "view") {
      setViewModal({
        open: true,
        subject: comm.subject || `${comm.type} message`,
        dateTime: comm.dateTime,
        type: comm.type,
        status: comm.status,
        body: comm.body,
      });
    } else if (value === "resend") {
      // no-op: resend is a fire-and-forget action in the prototype
    } else if (value === "delete") {
      setDeleteModal({
        open: true,
        commId: comm.id,
        subject: comm.subject || `${comm.type} message`,
      });
    }
  }

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
                    onSelect={(val) => handleAction(val, comm)}
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination totalItems={7} itemsPerPage={10} />
      </Card>

      {/* View communication modal */}
      <Modal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, subject: "", dateTime: "", type: "", status: "", body: "" })}
        title={viewModal.subject}
        maxWidth="lg"
        footer={
          <Button variant="secondary" onClick={() => setViewModal({ open: false, subject: "", dateTime: "", type: "", status: "", body: "" })}>
            Close
          </Button>
        }
      >
        <div className="mb-4 flex flex-wrap gap-4 text-caption-md text-text-secondary">
          <span><strong className="text-text">Date:</strong> {viewModal.dateTime}</span>
          <span><strong className="text-text">Type:</strong> {viewModal.type}</span>
          <span><strong className="text-text">Status:</strong> {viewModal.status}</span>
        </div>
        <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-body-md text-text">
          {viewModal.body}
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, commId: "", subject: "" })}
        title="Delete communication"
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, commId: "", subject: "" })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setDeleteModal({ open: false, commId: "", subject: "" })}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-body-md text-text-secondary">
          Are you sure you want to delete <strong className="text-text">{deleteModal.subject}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
