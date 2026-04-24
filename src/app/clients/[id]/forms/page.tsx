"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Dropdown, DropdownTriggerButton, PageHeader, SearchBar, Pagination, Badge, Modal, Text } from "@/components/ds";
import type { DropdownItem } from "@/components/ds";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

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

  const columns: ColumnsType<typeof mockForms[number]> = [
    {
      key: "title",
      title: "Title",
      render: (_, form) => (
        <>
          <span>{form.title}</span>
          <Badge variant="gray" style={{ marginLeft: 8 }}>
            {form.status}
          </Badge>
        </>
      ),
    },
    {
      key: "createdAt",
      title: "Created at",
      render: (_, form) => <Text variant="body/md" as="span" color="secondary">{form.createdAt}</Text>,
    },
    {
      key: "completed",
      title: "Completed",
      render: (_, form) => <Text variant="body/md" as="span" color="secondary">{form.completed}</Text>,
    },
    {
      key: "relatedAppt",
      title: "Related appointment",
      render: (_, form) => <Text variant="body/md" as="span" color="primary">{form.relatedAppt}</Text>,
    },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, form) => (
        <Dropdown
          trigger={<DropdownTriggerButton />}
          items={formRowActions}
          onSelect={(val) => handleAction(val, form)}
          align="right"
        />
      ),
    },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Forms">
        <Button>+ New form</Button>
      </PageHeader>

      <SearchBar placeholder="Search for title" />

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={paged}
          rowKey="id"
          pagination={false}
        />
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
            <Button onClick={() => setResendModal({ open: false, formTitle: "" })}>
              Cancel
            </Button>
            <Button type="primary" onClick={() => setResendModal({ open: false, formTitle: "" })}>
              Resend
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
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
            <Button onClick={() => setArchiveModal({ open: false, formTitle: "" })}>
              Cancel
            </Button>
            <Button danger onClick={() => setArchiveModal({ open: false, formTitle: "" })}>
              Archive
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Are you sure you want to archive <strong>{archiveModal.formTitle}</strong>? Archived forms can be restored later.
        </p>
      </Modal>
    </div>
  );
}
