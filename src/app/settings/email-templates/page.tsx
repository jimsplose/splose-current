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
  Badge,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
  FormSelect,
} from "@/components/ds";

type TemplateType =
  | "Invoice"
  | "Payment"
  | "Progress note"
  | "Form"
  | "Letter"
  | "General";

const typeBadgeVariant: Record<
  TemplateType,
  "blue" | "green" | "purple" | "yellow" | "gray"
> = {
  Invoice: "blue",
  Payment: "green",
  "Progress note": "purple",
  Form: "yellow",
  Letter: "gray",
  General: "gray",
};

const templateTypes: TemplateType[] = ["Invoice", "Payment", "Progress note", "Form", "Letter", "General"];

const initialTemplates: {
  name: string;
  type: TemplateType;
  lastModified: string;
}[] = [
  {
    name: "#1_Invoice email template",
    type: "Invoice",
    lastModified: "10:45 am, 2 Oct 2025",
  },
  {
    name: "Receipt email template",
    type: "Payment",
    lastModified: "3:03 pm, 21 Feb 2024",
  },
  {
    name: "#2_Progress note email template",
    type: "Progress note",
    lastModified: "5:09 pm, 28 May 2025",
  },
  {
    name: "Form email template 1",
    type: "Form",
    lastModified: "4:46 pm, 17 Mar 2026",
  },
  {
    name: "Letter email template",
    type: "Letter",
    lastModified: "10:30 am, 7 Oct 2025",
  },
  {
    name: "General email template",
    type: "General",
    lastModified: "2:58 pm, 14 Jan 2026",
  },
  {
    name: "Receipt",
    type: "Invoice",
    lastModified: "9:22 am, 12 Sep 2025",
  },
  {
    name: "Reschedule",
    type: "Progress note",
    lastModified: "12:58 pm, 28 Jan 2022",
  },
];

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Delete", value: "delete", danger: true },
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<TemplateType>("Invoice");

  function openCreate() {
    setEditingIndex(null);
    setFormName("");
    setFormType("Invoice");
    setModalOpen(true);
  }

  function openEdit(index: number) {
    setEditingIndex(index);
    setFormName(templates[index].name);
    setFormType(templates[index].type);
    setModalOpen(true);
  }

  function handleSave() {
    const now = new Date().toLocaleString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true, day: "numeric", month: "short", year: "numeric" });
    if (editingIndex !== null) {
      setTemplates((prev) => prev.map((t, i) => (i === editingIndex ? { name: formName, type: formType, lastModified: now } : t)));
    } else {
      setTemplates((prev) => [...prev, { name: formName, type: formType, lastModified: now }]);
    }
    setModalOpen(false);
  }

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index);
  }

  const filtered = templates.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6">
      <PageHeader title="Email templates">
        <Button variant="primary" onClick={openCreate}>+ New template</Button>
      </PageHeader>

      <SearchBar
        placeholder="Search for template and type"
        onSearch={setSearch}
      />

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Type</Th>
          <Th>Last modified</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {filtered.map((t, i) => (
            <tr key={t.name + i} className="hover:bg-gray-50">
              <Td className="text-text">{t.name}</Td>
              <Td>
                <Badge variant={typeBadgeVariant[t.type]}>{t.type}</Badge>
              </Td>
              <Td>{t.lastModified}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={dropdownItems}
                  onSelect={(value) => handleAction(value, templates.indexOf(t))}
                />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={filtered.length}
        itemsPerPage={10}
        showPageSize={false}
      />
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIndex !== null ? "Edit email template" : "New email template"}
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
            onChange={(e) => setFormType(e.target.value as TemplateType)}
            options={templateTypes.map((t) => ({ value: t, label: t }))}
          />
        </div>
      </Modal>
    </div>
  );
}
