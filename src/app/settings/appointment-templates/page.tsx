"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, SearchBar, Pagination, Dropdown, DropdownTriggerButton, Modal, FormInput, FormSelect, Toggle, Text, EmailPreview } from "@/components/ds";
import { useFormModal } from "@/hooks/useFormModal";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
import { formatTimestamp } from "@/lib/format";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Template {
  name: string;
  type: string;
  sms: boolean;
  email: boolean;
  lastModified: string;
}

const initialTemplates: Template[] = [
  {
    name: "Appointment confirmation (new client)",
    type: "Confirmation",
    sms: true,
    email: true,
    lastModified: "4:51 pm, 10 Feb 2026",
  },
  {
    name: "Appointment rescheduled",
    type: "Reschedule",
    sms: true,
    email: true,
    lastModified: "3:46 pm, 20 Jun 2025",
  },
  {
    name: "Appointment cancellation",
    type: "Cancellation",
    sms: true,
    email: true,
    lastModified: "2:39 pm, 2 Feb 2026",
  },
  {
    name: "Appointment reminder",
    type: "Reminder",
    sms: false,
    email: false,
    lastModified: "10:51 am, 9 Mar 2026",
  },
  {
    name: "Confirmation Zoom",
    type: "Confirmation",
    sms: false,
    email: true,
    lastModified: "12:59 pm, 10 Jun 2025",
  },
  {
    name: "Zoom Reminder 24hr",
    type: "Reminder",
    sms: false,
    email: true,
    lastModified: "12:15 pm, 28 Apr 2025",
  },
  {
    name: "Zoom Reminder 48hrs",
    type: "Reminder",
    sms: false,
    email: false,
    lastModified: "2:37 pm, 13 Dec 2023",
  },
];

export default function AppointmentTemplatesPage() {
  const router = useRouter();
  const [templateList, setTemplateList] = useState(initialTemplates);
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(templateList.length / pageSize);
  const paged = templateList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } = useFormModal<{
    name: string;
    type: string;
    sms: boolean;
    email: boolean;
  }>({
    defaults: { name: "", type: "Confirmation", sms: false, email: false },
    onSave: (values, editingIndex) => {
      const now = formatTimestamp();
      const entry: Template = { name: values.name, type: values.type, sms: values.sms, email: values.email, lastModified: now };
      if (editingIndex !== null) {
        setTemplateList((prev) => prev.map((t, i) => (i === editingIndex ? entry : t)));
      } else {
        setTemplateList((prev) => [...prev, entry]);
      }
    },
  });

  function handleAction(value: string, index: number) {
    if (value === "edit") {
      router.push(`/settings/appointment-templates/new`);
      return;
    }
  }

  const columns: ColumnsType<Template> = [
    { key: "name", title: "Name", dataIndex: "name" },
    { key: "type", title: "Type", dataIndex: "type" },
    {
      key: "sms",
      title: "SMS",
      render: (_, row) => (
        <Text variant="body/md" color={row.sms ? "success" : "danger"}>{row.sms ? "On" : "Off"}</Text>
      ),
    },
    {
      key: "email",
      title: "Email",
      render: (_, row) => (
        <Text variant="body/md" color={row.email ? "success" : "danger"}>{row.email ? "On" : "Off"}</Text>
      ),
    },
    { key: "lastModified", title: "Last modified", dataIndex: "lastModified" },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, row) => (
        <Dropdown
          align="right"
          trigger={<DropdownTriggerButton />}
          items={STANDARD_SETTINGS}
          onSelect={(value) => handleAction(value, templateList.indexOf(row))}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Appointment templates">
        <Button onClick={openCreate}>+ New template</Button>
      </PageHeader>

      <SearchBar placeholder="Search for template and type" />

      <Table columns={columns} dataSource={paged} rowKey={(row) => row.name + templateList.indexOf(row)} pagination={false} />

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={templateList.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} showPageSize={false} />
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit appointment template" : "New appointment template"}
        footer={
          <>
            <Button onClick={() => setEmailPreviewOpen(true)}>Email preview</Button>
            <div style={{ flex: 1 }} />
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormInput label="Name *" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormSelect
            label="Type"
            value={form.type}
            onChange={(value) => setField("type", value)}
            options={[
              { value: "Confirmation", label: "Confirmation" },
              { value: "Reschedule", label: "Reschedule" },
              { value: "Cancellation", label: "Cancellation" },
              { value: "Reminder", label: "Reminder" },
            ]}
          />
          <Toggle label="SMS" checked={form.sms} onChange={(v) => setField("sms", v)} />
          <Toggle label="Email" checked={form.email} onChange={(v) => setField("email", v)} />
        </div>
      </Modal>

      <EmailPreview
        open={emailPreviewOpen}
        onClose={() => setEmailPreviewOpen(false)}
        subject="Appointment Confirmation"
        recipientName="Skyler Peterson"
        body={"Hi Skyler,\n\nThis is to confirm your appointment on Monday, 24 March 2026 at 10:00 AM with Dr. James Wilson at East Clinics.\n\nPlease arrive 10 minutes early.\n\nRegards,\nHands Together Therapies"}
      />
    </div>
  );
}
