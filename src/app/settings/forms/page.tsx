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
  Badge,
  EmptyState,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
  FormSelect,
} from "@/components/ds";
import { ChevronDown } from "lucide-react";
import { useFormModal } from "@/hooks/useFormModal";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";

const formTemplates = [
  { title: "(Copy of) Test form saved in A jr", formType: "Embeddable form", published: false, createdAt: "6 Mar 2026", updatedAt: "6 Mar 2026" },
  { title: "Test form saved in A jr", formType: "Embeddable form", published: true, createdAt: "27 Feb 2026", updatedAt: "6 Mar 2026" },
  { title: "FORM FILE UPLOADS", formType: "Standard form", published: false, createdAt: "27 Feb 2026", updatedAt: "13 Mar 2026" },
  { title: "test 1 2 3", formType: "Standard form", published: false, createdAt: "9 Feb 2026", updatedAt: "9 Feb 2026" },
  { title: "Service agreement - Sharon", formType: "Standard form", published: false, createdAt: "5 Feb 2026", updatedAt: "5 Feb 2026" },
  { title: "Test EMB", formType: "Embeddable form", published: true, createdAt: "29 Jan 2026", updatedAt: "16 Feb 2026" },
  { title: "TESTTESTTEST", formType: "Standard form", published: false, createdAt: "2 Jan 2026", updatedAt: "16 Jan 2026" },
  { title: "Intake Form", formType: "Embeddable form", published: true, createdAt: "22 Dec 2025", updatedAt: "23 Jan 2026" },
];

export default function FormsPage() {
  const [forms, setForms] = useState(formTemplates);
  const [search, setSearch] = useState("");

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } =
    useFormModal<{ title: string; formType: string }>({
      defaults: { title: "", formType: "Standard form" },
      onSave: (values, index) => {
        const now = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
        if (index !== null) {
          setForms((prev) =>
            prev.map((f, i) =>
              i === index ? { ...f, title: values.title, formType: values.formType, updatedAt: now } : f,
            ),
          );
        } else {
          setForms((prev) => [
            ...prev,
            { title: values.title, formType: values.formType, published: false, createdAt: now, updatedAt: now },
          ]);
        }
      },
    });

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index, { title: forms[index].title, formType: forms[index].formType });
  }

  const filtered = forms.filter((f) => {
    if (search && !f.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6">
      <PageHeader title="Form templates">
        <Button variant="secondary">
          <span className="flex items-center gap-1">Learn <ChevronDown className="h-4 w-4" /></span>
        </Button>
        <Button variant="secondary">Show archived</Button>
        <Button variant="primary" onClick={openCreate}>+ New template</Button>
      </PageHeader>

      <SearchBar
        placeholder="Search for title"
        onSearch={(q) => setSearch(q)}
      />

      <DataTable>
        <TableHead>
          <Th>Title</Th>
          <Th>Form type</Th>
          <Th>Created at</Th>
          <Th>Updated at</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {filtered.map((f, i) => (
            <tr key={f.title + i} className="hover:bg-gray-50">
              <Td className="text-text">{f.title}</Td>
              <Td>
                <span className="flex items-center gap-2">
                  {f.formType}
                  {f.published && <Badge variant="green">Published</Badge>}
                </span>
              </Td>
              <Td>{f.createdAt}</Td>
              <Td>{f.updatedAt}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={STANDARD_SETTINGS}
                  onSelect={(value) => handleAction(value, forms.indexOf(f))}
                />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      {filtered.length === 0 && <EmptyState message="No form templates found" className="py-8" />}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit form template" : "New form template"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Title" value={form.title} onChange={(e) => setField("title", e.target.value)} />
          <FormSelect
            label="Form type"
            value={form.formType}
            onChange={(e) => setField("formType", e.target.value)}
            options={[
              { value: "Standard form", label: "Standard form" },
              { value: "Embeddable form", label: "Embeddable form" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
