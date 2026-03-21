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

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export default function FormsPage() {
  const [forms, setForms] = useState(formTemplates);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formFormType, setFormFormType] = useState("Standard form");

  function openCreate() {
    setEditingIndex(null);
    setFormTitle("");
    setFormFormType("Standard form");
    setModalOpen(true);
  }

  function openEdit(index: number) {
    setEditingIndex(index);
    setFormTitle(forms[index].title);
    setFormFormType(forms[index].formType);
    setModalOpen(true);
  }

  function handleSave() {
    const now = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
    if (editingIndex !== null) {
      setForms((prev) => prev.map((f, i) => (i === editingIndex ? { ...f, title: formTitle, formType: formFormType, updatedAt: now } : f)));
    } else {
      setForms((prev) => [...prev, { title: formTitle, formType: formFormType, published: false, createdAt: now, updatedAt: now }]);
    }
    setModalOpen(false);
  }

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index);
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
          {filtered.map((form, i) => (
            <tr key={form.title + i} className="hover:bg-gray-50">
              <Td className="text-text">{form.title}</Td>
              <Td>
                <span className="flex items-center gap-2">
                  {form.formType}
                  {form.published && <Badge variant="green">Published</Badge>}
                </span>
              </Td>
              <Td>{form.createdAt}</Td>
              <Td>{form.updatedAt}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={dropdownItems}
                  onSelect={(value) => handleAction(value, forms.indexOf(form))}
                />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      {filtered.length === 0 && <EmptyState message="No form templates found" className="py-8" />}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIndex !== null ? "Edit form template" : "New form template"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          <FormSelect
            label="Form type"
            value={formFormType}
            onChange={(e) => setFormFormType(e.target.value)}
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
