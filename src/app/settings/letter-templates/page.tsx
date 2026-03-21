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
} from "@/components/ds";

const templates = [
  {
    title: "Chronic Disease Management plan first appointment",
    createdAt: "4:44 pm, 6 Oct 2020",
    lastUpdated: "12:17 pm, 6 Feb 2026",
  },
  {
    title: "Chronic Disease Management plan last appointment",
    createdAt: "4:44 pm, 6 Oct 2020",
    lastUpdated: "12:50 pm, 8 Nov 2021",
  },
  {
    title: "DVA",
    createdAt: "10:54 am, 15 Aug 2023",
    lastUpdated: "10:54 am, 15 Aug 2023",
  },
  {
    title: "Test 123 contact",
    createdAt: "4:36 pm, 4 Jun 2024",
    lastUpdated: "11:41 am, 3 Mar 2026",
  },
  {
    title: "Case note",
    createdAt: "2:05 pm, 14 Jun 2024",
    lastUpdated: "2:05 pm, 14 Jun 2024",
  },
  {
    title: "Case hours",
    createdAt: "10:32 am, 23 Aug 2024",
    lastUpdated: "10:32 am, 23 Aug 2024",
  },
  {
    title: "Test",
    createdAt: "2:39 pm, 27 May 2025",
    lastUpdated: "2:29 pm, 4 Jun 2025",
  },
];

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export default function LetterTemplatesPage() {
  const [templateList, setTemplateList] = useState(templates);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");

  function openCreate() {
    setEditingIndex(null);
    setFormTitle("");
    setModalOpen(true);
  }

  function openEdit(index: number) {
    setEditingIndex(index);
    setFormTitle(templateList[index].title);
    setModalOpen(true);
  }

  function handleSave() {
    const now = new Date().toLocaleString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true, day: "numeric", month: "short", year: "numeric" });
    if (editingIndex !== null) {
      setTemplateList((prev) => prev.map((t, i) => (i === editingIndex ? { ...t, title: formTitle, lastUpdated: now } : t)));
    } else {
      setTemplateList((prev) => [...prev, { title: formTitle, createdAt: now, lastUpdated: now }]);
    }
    setModalOpen(false);
  }

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index);
  }

  return (
    <div className="p-6">
      <PageHeader title="Letter templates">
        <Button variant="secondary">Show archived</Button>
        <Button variant="primary" onClick={openCreate}>+ New template</Button>
      </PageHeader>

      <SearchBar placeholder="Search for title" />

      <DataTable>
        <TableHead>
          <Th>Title</Th>
          <Th>Created at</Th>
          <Th>Last updated</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {templateList.map((t, i) => (
            <tr key={t.title + i} className="hover:bg-gray-50">
              <Td className="text-text">{t.title}</Td>
              <Td>{t.createdAt}</Td>
              <Td>{t.lastUpdated}</Td>
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
        title={editingIndex !== null ? "Edit letter template" : "New letter template"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
