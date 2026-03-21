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
  Td,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
  FormSelect,
  Toggle,
} from "@/components/ds";

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

function OnOffText({ value }: { value: boolean }) {
  return (
    <span className={value ? "text-green-600" : "text-red-500"}>
      {value ? "On" : "Off"}
    </span>
  );
}

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export default function AppointmentTemplatesPage() {
  const [templateList, setTemplateList] = useState(initialTemplates);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("Confirmation");
  const [formSms, setFormSms] = useState(false);
  const [formEmail, setFormEmail] = useState(false);

  function openCreate() {
    setEditingIndex(null);
    setFormName("");
    setFormType("Confirmation");
    setFormSms(false);
    setFormEmail(false);
    setModalOpen(true);
  }

  function openEdit(index: number) {
    const t = templateList[index];
    setEditingIndex(index);
    setFormName(t.name);
    setFormType(t.type);
    setFormSms(t.sms);
    setFormEmail(t.email);
    setModalOpen(true);
  }

  function handleSave() {
    const now = new Date().toLocaleString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true, day: "numeric", month: "short", year: "numeric" });
    const entry: Template = { name: formName, type: formType, sms: formSms, email: formEmail, lastModified: now };
    if (editingIndex !== null) {
      setTemplateList((prev) => prev.map((t, i) => (i === editingIndex ? entry : t)));
    } else {
      setTemplateList((prev) => [...prev, entry]);
    }
    setModalOpen(false);
  }

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index);
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
            <tr key={t.name + i} className="hover:bg-gray-50">
              <Td className="text-text">{t.name}</Td>
              <Td>{t.type}</Td>
              <Td>
                <OnOffText value={t.sms} />
              </Td>
              <Td>
                <OnOffText value={t.email} />
              </Td>
              <Td>{t.lastModified}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={dropdownItems}
                  onSelect={(value) => handleAction(value, i)}
                />
              </Td>
            </tr>
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
        onClose={() => setModalOpen(false)}
        title={editingIndex !== null ? "Edit appointment template" : "New appointment template"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
          <FormSelect
            label="Type"
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            options={[
              { value: "Confirmation", label: "Confirmation" },
              { value: "Reschedule", label: "Reschedule" },
              { value: "Cancellation", label: "Cancellation" },
              { value: "Reminder", label: "Reminder" },
            ]}
          />
          <Toggle label="SMS" checked={formSms} onChange={setFormSms} />
          <Toggle label="Email" checked={formEmail} onChange={setFormEmail} />
        </div>
      </Modal>
    </div>
  );
}
