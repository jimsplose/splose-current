"use client";

import { useState } from "react";
import {
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
  FormSelect,
  Toggle,
  OnOffBadge,
  EmailPreview,
} from "@/components/ds";
import { useFormModal } from "@/hooks/useFormModal";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
import { formatTimestamp } from "@/lib/format";

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
  const [templateList, setTemplateList] = useState(initialTemplates);
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);

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
      const t = templateList[index];
      openEdit(index, { name: t.name, type: t.type, sms: t.sms, email: t.email });
    }
  }

  return (
    <div className="p-6">
      <PageHeader title="Appointment templates">
        <Button variant="primary" onClick={openCreate}>+ New template</Button>
      </PageHeader>

      <SearchBar placeholder="Search for template and type" />

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Type</Th>
          <Th>SMS</Th>
          <Th>Email</Th>
          <Th>Last modified</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {templateList.map((t, i) => (
            <Tr key={t.name + i}>
              <Td className="text-text">{t.name}</Td>
              <Td>{t.type}</Td>
              <Td>
                <OnOffBadge value={t.sms} />
              </Td>
              <Td>
                <OnOffBadge value={t.email} />
              </Td>
              <Td>{t.lastModified}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={STANDARD_SETTINGS}
                  onSelect={(value) => handleAction(value, i)}
                />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={templateList.length}
        itemsPerPage={10}
        showPageSize={false}
      />
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit appointment template" : "New appointment template"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEmailPreviewOpen(true)}>Email preview</Button>
            <div className="flex-1" />
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormSelect
            label="Type"
            value={form.type}
            onChange={(e) => setField("type", e.target.value)}
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
