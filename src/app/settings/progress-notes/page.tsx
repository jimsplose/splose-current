"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ThunderboltOutlined, CloseOutlined } from "@ant-design/icons";
import { PageHeader, SearchBar, Pagination, Badge, Dropdown, DropdownTriggerButton, Modal, FormInput, Toggle } from "@/components/ds";
import { useFormModal } from "@/hooks/useFormModal";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
import { formatTimestamp } from "@/lib/format";

const templates = [
  { title: "Exercise Physiology Follow-up Report", createdAt: "4:39 pm, 16 Oct 2023", hasAi: true },
  { title: "ST | Note", createdAt: "3:35 pm, 5 Jun 2024", hasAi: true },
  { title: "Standard Consultation. 123", createdAt: "11:32 am, 12 Jun 2024", hasAi: false },
  { title: "Standard Consultation", createdAt: "8:21 pm, 5 Mar 2014", hasAi: false },
  { title: "Initial Consultation", createdAt: "8:21 pm, 5 Mar 2014", hasAi: false },
];

interface TemplateRow {
  title: string;
  createdAt: string;
  hasAi: boolean;
}

export default function ProgressNotesPage() {
  const router = useRouter();
  const [templateList, setTemplateList] = useState(templates);
  const [showBanner, setShowBanner] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(templateList.length / pageSize);
  const paged = templateList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } =
    useFormModal<{ title: string; hasAi: boolean }>({
      defaults: { title: "", hasAi: false },
      onSave: (values, index) => {
        if (index !== null) {
          setTemplateList((prev) =>
            prev.map((t, i) =>
              i === index ? { title: values.title, createdAt: t.createdAt, hasAi: values.hasAi } : t,
            ),
          );
        } else {
          const now = formatTimestamp();
          setTemplateList((prev) => [...prev, { title: values.title, createdAt: now, hasAi: values.hasAi }]);
        }
      },
    });

  function handleAction(value: string, index: number) {
    if (value === "edit") {
      router.push(`/settings/progress-notes/edit/${index + 1}`);
      return;
    }
  }

  const columns: ColumnsType<TemplateRow> = [
    {
      key: "title",
      title: "Title",
      render: (_, row) => (
        <Flex align="center" gap={8}>
          {row.hasAi && (
            <ThunderboltOutlined style={{ fontSize: 14, color: 'var(--ant-color-primary, #8250FF)', flexShrink: 0 }} />
          )}
          <span>{row.title}</span>
        </Flex>
      ),
    },
    { key: "createdAt", title: "Created at", dataIndex: "createdAt" },
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
      <PageHeader title="Progress note templates">
        <Button>Show archived</Button>
        <Button onClick={openCreate}>+ New template</Button>
      </PageHeader>

      {showBanner && (
        <Flex align="flex-start" gap={12} style={{ marginBottom: 16, borderRadius: 8, border: '1px solid rgba(var(--color-primary-rgb, 130, 80, 255), 0.2)', backgroundColor: 'rgba(var(--color-primary-rgb, 130, 80, 255), 0.1)', padding: '12px 16px' }}>
          <Badge variant="purple">New</Badge>
          <p style={{ flex: 1, fontSize: 12 }}>
            Add AI blocks to templates to generate instant drafts, every
            session. Try a template{" "}
            <a href="#" style={{ fontWeight: 500, textDecoration: 'underline', color: 'var(--color-primary)' }}>
              created by splose
            </a>
            .
          </p>
          <Button
            type="text"
            size="small"
            style={{ flexShrink: 0 }}
            onClick={() => setShowBanner(false)}
          >
            <CloseOutlined style={{ fontSize: 14, color: 'var(--ant-color-text, #414549)' }} />
          </Button>
        </Flex>
      )}

      <p style={{ marginBottom: 16, fontSize: 12, color: 'var(--color-text-secondary)' }}>
        Create templates for any appointment type to save time and keep
        documentation consistent. Add tables, auto-fill placeholders,
        interactive fields and AI blocks.
      </p>

      <SearchBar placeholder="Search for title" />

      <Table columns={columns} dataSource={paged} rowKey={(row) => row.title + templateList.indexOf(row)} pagination={false} />

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={templateList.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} showPageSize={false} />
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit progress note template" : "New progress note template"}
        footer={
          <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Title" value={form.title} onChange={(e) => setField("title", e.target.value)} />
          <Toggle label="AI-powered" checked={form.hasAi} onChange={(v) => setField("hasAi", v)} />
        </Flex>
      </Modal>
    </div>
  );
}
