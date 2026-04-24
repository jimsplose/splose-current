"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PageHeader, SearchBar, Pagination, Dropdown, DropdownTriggerButton, Modal, FormInput } from "@/components/ds";
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
  const router = useRouter();
  const [templateList, setTemplateList] = useState(templates);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(templateList.length / pageSize);
  const paged = templateList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    if (value === "edit") {
      router.push(`/settings/letter-templates/edit/${index + 1}`);
      return;
    }
  }

  const columns: ColumnsType<typeof templates[number]> = [
    { key: "title", title: "Title", dataIndex: "title" },
    { key: "createdAt", title: "Created at", dataIndex: "createdAt" },
    { key: "lastUpdated", title: "Last updated", dataIndex: "lastUpdated" },
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
      <PageHeader title="Letter templates">
        <Button>Show archived</Button>
        <Button onClick={openCreate}>+ New template</Button>
      </PageHeader>

      <SearchBar placeholder="Search for title" />

      <Table columns={columns} dataSource={paged} rowKey={(row) => row.title + templateList.indexOf(row)} pagination={false} />

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={templateList.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} showPageSize={false} />
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit letter template" : "New letter template"}
        footer={
          <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Title" value={form.title} onChange={(e) => setField("title", e.target.value)} />
        </Flex>
      </Modal>
    </div>
  );
}
