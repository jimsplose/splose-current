"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownOutlined } from "@ant-design/icons";
import { PageHeader, SearchBar, Badge, EmptyState, Dropdown, DropdownTriggerButton, Modal, FormInput, FormSelect } from "@/components/ds";
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

  const columns: ColumnsType<typeof formTemplates[number]> = [
    { key: "title", title: "Title", dataIndex: "title" },
    {
      key: "formType",
      title: "Form type",
      render: (_, row) => (
        <Flex align="center" gap={8}>
          {row.formType}
          {row.published && <Badge variant="green">Published</Badge>}
        </Flex>
      ),
    },
    { key: "createdAt", title: "Created at", dataIndex: "createdAt" },
    { key: "updatedAt", title: "Updated at", dataIndex: "updatedAt" },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, row) => (
        <Dropdown
          align="right"
          trigger={<DropdownTriggerButton />}
          items={STANDARD_SETTINGS}
          onSelect={(value) => handleAction(value, forms.indexOf(row))}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Form templates">
        <Dropdown
          trigger={
            <Button>
              <Flex align="center" gap={4}>Learn <DownOutlined style={{ fontSize: 14, color: 'var(--ant-color-text, #414549)' }} /></Flex>
            </Button>
          }
          items={[
            { label: "Help guide", value: "help" },
            { label: "Watch a video", value: "video" },
          ]}
          onSelect={(value) => console.log("Learn:", value)}
        />
        <Button>Show archived</Button>
        <Button onClick={openCreate}>+ New template</Button>
      </PageHeader>

      <SearchBar
        placeholder="Search for title"
        onSearch={(q) => setSearch(q)}
      />

      <Table columns={columns} dataSource={filtered} rowKey={(row) => row.title + filtered.indexOf(row)} pagination={false} />
      {filtered.length === 0 && <EmptyState message="No form templates found" style={{ paddingTop: 32, paddingBottom: 32 }} />}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit form template" : "New form template"}
        footer={
          <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Title" value={form.title} onChange={(e) => setField("title", e.target.value)} />
          <FormSelect
            label="Form type"
            value={form.formType}
            onChange={(value) => setField("formType", value)}
            options={[
              { value: "Standard form", label: "Standard form" },
              { value: "Embeddable form", label: "Embeddable form" },
            ]}
          />
        </Flex>
      </Modal>
    </div>
  );
}
