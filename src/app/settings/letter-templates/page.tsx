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
} from "@/components/ds";
import { useFormModal } from "@/hooks/useFormModal";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
import { formatTimestamp } from "@/lib/format";

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

export default function LetterTemplatesPage() {
  const [templateList, setTemplateList] = useState(templates);

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } =
    useFormModal<{ title: string }>({
      defaults: { title: "" },
      onSave: (values, index) => {
        const now = formatTimestamp();
        if (index !== null) {
          setTemplateList((prev) =>
            prev.map((t, i) => (i === index ? { ...t, title: values.title, lastUpdated: now } : t)),
          );
        } else {
          setTemplateList((prev) => [...prev, { title: values.title, createdAt: now, lastUpdated: now }]);
        }
      },
    });

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index, { title: templateList[index].title });
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
            <Tr key={t.title + i}>
              <Td className="text-text">{t.title}</Td>
              <Td>{t.createdAt}</Td>
              <Td>{t.lastUpdated}</Td>
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
        title={isEditing ? "Edit letter template" : "New letter template"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Title" value={form.title} onChange={(e) => setField("title", e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
