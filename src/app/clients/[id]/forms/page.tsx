"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, DataTable, Dropdown, DropdownTriggerButton, PageHeader, SearchBar, TableHead, Th, TableBody, Tr, Td, Pagination, Badge, Modal } from "@/components/ds";
import type { DropdownItem } from "@/components/ds";

const formRowActions: DropdownItem[] = [
  { label: "View", value: "view" },
  { label: "Copy link", value: "copy-link" },
  { label: "Open in new tab", value: "open-tab" },
  { label: "Email form", value: "email" },
  { label: "", value: "divider-1", divider: true },
  { label: "Change log", value: "changelog" },
  { label: "Archive", value: "archive", danger: true },
];

const mockForms = [
  {
    id: "f1",
    title: "baby due date test",
    status: "Incomplete",
    createdAt: "10:20 am, 2 Feb 2026",
    completed: "No",
    relatedAppt: "1:30 pm, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations",
  },
  {
    id: "f2",
    title: "Header test",
    status: "Incomplete",
    createdAt: "10:20 am, 2 Feb 2026",
    completed: "No",
    relatedAppt: "1:30 pm, 7 Feb 2026 – 2:3 Consultations 2:2 Consultations",
  },
  {
    id: "f3",
    title: "baby due date test",
    status: "Incomplete",
    createdAt: "10:16 am, 2 Feb 2026",
    completed: "No",
    relatedAppt: "11:30 am, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations",
  },
  {
    id: "f4",
    title: "Header test",
    status: "Incomplete",
    createdAt: "10:16 am, 2 Feb 2026",
    completed: "No",
    relatedAppt: "11:30 am, 7 Feb 2026 – 2:2 Consultations 2:3 Consultations",
  },
  {
    id: "f5",
    title: "baby due date test",
    status: "Incomplete",
    createdAt: "10:15 am, 2 Feb 2026",
    completed: "No",
    relatedAppt: "9:30 am, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations",
  },
  {
    id: "f6",
    title: "Header test",
    status: "Incomplete",
    createdAt: "10:15 am, 2 Feb 2026",
    completed: "No",
    relatedAppt: "9:30 am, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations",
  },
  {
    id: "f7",
    title: "Header test",
    status: "Incomplete",
    createdAt: "9:18 am, 12 Jan 2026",
    completed: "No",
    relatedAppt: "10:00 am, 14 Jan 2026 – Group booking Sharon Test",
  },
  {
    id: "f8",
    title: "baby due date test",
    status: "Incomplete",
    createdAt: "9:18 am, 12 Jan 2026",
    completed: "No",
    relatedAppt: "10:00 am, 14 Jan 2026 – Group booking Sharon Test",
  },
  {
    id: "f9",
    title: "baby due date test",
    status: "Incomplete",
    createdAt: "10:22 am, 30 Oct 2025",
    completed: "No",
    relatedAppt: "6:15 am, 28 Oct 2025 – 1:1 Consultation 1:1 Consultation",
  },
  {
    id: "f10",
    title: "Header test",
    status: "Incomplete",
    createdAt: "10:22 am, 30 Oct 2025",
    completed: "No",
    relatedAppt: "9:15 am, 28 Oct 2025 – 1:1 Consultation 1:1 Consultation",
  },
];

export default function ClientFormsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(mockForms.length / pageSize);
  const paged = mockForms.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const [resendModal, setResendModal] = useState<{ open: boolean; formTitle: string }>({
    open: false,
    formTitle: "",
  });
  const [archiveModal, setArchiveModal] = useState<{ open: boolean; formTitle: string }>({
    open: false,
    formTitle: "",
  });

  function handleAction(value: string, form: (typeof mockForms)[number]) {
    if (value === "view") {
      router.push(`/patient-form/${form.id}/view`);
    } else if (value === "copy-link") {
      // no-op for copy link
    } else if (value === "open-tab") {
      window.open(`/patient-form/${form.id}/view`, "_blank");
    } else if (value === "email") {
      setResendModal({ open: true, formTitle: form.title });
    } else if (value === "archive") {
      setArchiveModal({ open: true, formTitle: form.title });
    }
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Forms">
        <Button>+ New form</Button>
      </PageHeader>

      <SearchBar placeholder="Search for title" />

      <Card padding="none" className="overflow-x-auto">
        <DataTable>
          <TableHead>
            <Th>Title</Th>
            <Th>Created at</Th>
            <Th>Completed</Th>
            <Th>Related appointment</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {paged.map((form) => (
              <Tr key={form.id}>
                <Td>
                  <span>{form.title}</span>
                  <Badge variant="gray" className="ml-2">
                    {form.status}
                  </Badge>
                </Td>
                <Td className="text-text-secondary">{form.createdAt}</Td>
                <Td className="text-text-secondary">{form.completed}</Td>
                <Td className="text-primary">{form.relatedAppt}</Td>
                <Td align="right">
                  <Dropdown
                    trigger={<DropdownTriggerButton />}
                    items={formRowActions}
                    onSelect={(val) => handleAction(val, form)}
                    align="right"
                  />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={mockForms.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* Resend form modal */}
      <Modal
        open={resendModal.open}
        onClose={() => setResendModal({ open: false, formTitle: "" })}
        title="Resend form"
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setResendModal({ open: false, formTitle: "" })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setResendModal({ open: false, formTitle: "" })}>
              Resend
            </Button>
          </>
        }
      >
        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>
          Resend <strong>{resendModal.formTitle}</strong> to the client&apos;s email?
        </p>
      </Modal>

      {/* Archive form modal */}
      <Modal
        open={archiveModal.open}
        onClose={() => setArchiveModal({ open: false, formTitle: "" })}
        title="Archive form"
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setArchiveModal({ open: false, formTitle: "" })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setArchiveModal({ open: false, formTitle: "" })}>
              Archive
            </Button>
          </>
        }
      >
        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>
          Are you sure you want to archive <strong>{archiveModal.formTitle}</strong>? Archived forms can be restored later.
        </p>
      </Modal>
    </div>
  );
}
