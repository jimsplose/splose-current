"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex } from "antd";
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
} from "@/components/ds";
import { useFormModal } from "@/hooks/useFormModal";
import { formatTimestamp } from "@/lib/format";

type TemplateType =
  | "Invoice"
  | "Payment"
  | "Progress note"
  | "Form"
  | "Letter"
  | "General";

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
  const router = useRouter();
  const [templates, setTemplates] = useState(initialTemplates);
  const [search, setSearch] = useState("");

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } = useFormModal<{
    name: string;
    type: TemplateType;
  }>({
    defaults: { name: "", type: "Invoice" },
    onSave: (values, editingIndex) => {
      const now = formatTimestamp();
      if (editingIndex !== null) {
        setTemplates((prev) => prev.map((t, i) => (i === editingIndex ? { name: values.name, type: values.type, lastModified: now } : t)));
      } else {
        setTemplates((prev) => [...prev, { name: values.name, type: values.type, lastModified: now }]);
      }
    },
  });

  function handleAction(value: string, index: number) {
    if (value === "edit") {
      router.push(`/settings/email-templates/edit/${index + 1}`);
      return;
    }
  }

  const filtered = templates.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Email templates">
        <Button variant="secondary" onClick={openCreate}>+ New template</Button>
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
          {paged.map((t, i) => (
            <Tr key={t.name + i}>
              <Td className="text-text">{t.name}</Td>
              <Td>{t.type}</Td>
              <Td>{t.lastModified}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={dropdownItems}
                  onSelect={(value) => handleAction(value, templates.indexOf(t))}
                />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} showPageSize={false} />
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit email template" : "New email template"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormSelect
            label="Type"
            value={form.type}
            onChange={(value) => setField("type", value as TemplateType)}
            options={templateTypes.map((t) => ({ value: t, label: t }))}
          />
        </Flex>
      </Modal>
    </div>
  );
}
