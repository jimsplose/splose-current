"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  Button,
  PageHeader,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Tab,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
  FormSelect,
  FormColorPicker,
} from "@/components/ds";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

const tagTabs = ["Client tags", "Service tags", "Waitlist tags", "AI tags"] as const;
type TagTab = (typeof tagTabs)[number];

interface Tag {
  name: string;
  color: string;
  usedByCount: number;
}

const initialTagData: Record<TagTab, { tags: Tag[]; description?: string }> = {
  "Client tags": {
    tags: [
      { name: "2025-11-22", color: "#EAB308", usedByCount: 3 },
      { name: "Client consents to photography for promotional purposes", color: "#22C55E", usedByCount: 42 },
      { name: "Client DOES NOT consent to photography for promotional purposes", color: "#EF4444", usedByCount: 18 },
      { name: "Company A", color: "#EAB308", usedByCount: 7 },
      { name: "Dual funding", color: "#F59E0B", usedByCount: 12 },
      { name: "Exception", color: "#F59E0B", usedByCount: 5 },
      { name: "FORMS PENDING", color: "#EF4444", usedByCount: 31 },
      { name: "High risk", color: "#EF4444", usedByCount: 9 },
    ],
  },
  "Service tags": {
    tags: [
      { name: "1:1 consultation", color: "#EAB308", usedByCount: 56 },
      { name: "DVA", color: "#1E3A5F", usedByCount: 14 },
      { name: "Group", color: "#EAB308", usedByCount: 23 },
      { name: "Medicare", color: "#22C55E", usedByCount: 89 },
      { name: "NDIA", color: "#7C3AED", usedByCount: 34 },
      { name: "NDIS", color: "#2563EB", usedByCount: 67 },
    ],
  },
  "Waitlist tags": {
    tags: [
      { name: "Admin to review", color: "#F97316", usedByCount: 8 },
      { name: "Assessment only (SP)", color: "#6B8DAF", usedByCount: 4 },
      { name: "High", color: "#EF4444", usedByCount: 15 },
      { name: "Lengthy tag,Lengthy tag,Lengthy tag,Lengthy tag", color: "#EAB308", usedByCount: 0 },
      { name: "Low", color: "#F59E0B", usedByCount: 11 },
      { name: "Medium", color: "#F97316", usedByCount: 19 },
      { name: "NDIS referral", color: "#F59E0B", usedByCount: 22 },
      { name: "Other Diagnosis (see notes)", color: "#22C55E", usedByCount: 6 },
    ],
  },
  "AI tags": {
    tags: [
      { name: "Counselling Team", color: "#0891B2", usedByCount: 0 },
      { name: "Intake team", color: "#A78BFA", usedByCount: 0 },
      { name: "Physio Team", color: "#84CC16", usedByCount: 0 },
      { name: "Speech Team", color: "#A855F7", usedByCount: 0 },
    ],
    description:
      "AI tags are used to categorise AI blocks for easy filtering, such as by note type or team name.",
  },
};

export default function TagsPage() {
  const [activeTab, setActiveTab] = useState<TagTab>("Client tags");
  const [tagData, setTagData] = useState(initialTagData);

  const currentData = tagData[activeTab];
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(currentData.tags.length / pageSize);
  const paged = currentData.tags.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const [mergeTarget, setMergeTarget] = useState("");
  const [editingUsedBy, setEditingUsedBy] = useState(0);

  const { modalOpen, isEditing, form, setField, openCreate, openEdit: rawOpenEdit, closeModal: rawCloseModal, handleSave } =
    useFormModal<{ name: string; color: string }>({
      defaults: { name: "", color: "#EAB308" },
      onSave: (values, index) => {
        setTagData((prev) => {
          const updated = { ...prev };
          const tabData = { ...updated[activeTab], tags: [...updated[activeTab].tags] };
          if (index !== null) {
            tabData.tags[index] = { ...tabData.tags[index], name: values.name, color: values.color };
          } else {
            tabData.tags.push({ name: values.name, color: values.color, usedByCount: 0 });
          }
          updated[activeTab] = tabData;
          return updated;
        });
      },
    });

  function openEdit(index: number, values: { name: string; color: string }) {
    setEditingUsedBy(currentData.tags[index].usedByCount);
    setMergeTarget("");
    rawOpenEdit(index, values);
  }

  function closeModal() {
    setMergeTarget("");
    setEditingUsedBy(0);
    rawCloseModal();
  }

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index, currentData.tags[index]);
  }

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Tags">
        <Button variant="secondary" onClick={openCreate}>+ New tag</Button>
      </PageHeader>

      <Tab
        items={tagTabs.map((tab) => ({
          label: tab,
          value: tab,
          ...(tab === "AI tags" ? { badge: "New" } : {}),
        }))}
        value={activeTab}
        onChange={(val) => setActiveTab(val as TagTab)}
        style={{ marginBottom: 24 }}
      />

      {currentData.description && (
        <p style={{ marginBottom: 16, fontSize: 12, color: 'var(--color-text-secondary)' }}>{currentData.description}</p>
      )}

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Colour</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {paged.map((tag, i) => (
            <Tr key={tag.name}>
              <Td className="text-text">{tag.name}</Td>
              <Td>
                <div
                  style={{ height: 16, width: 80, borderRadius: 4, backgroundColor: tag.color }}
                />
              </Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={STANDARD_SETTINGS}
                  onSelect={(value) => handleAction(value, currentData.tags.indexOf(tag))}
                />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={currentData.tags.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} showPageSize={false} />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit tag" : "New tag"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormColorPicker value={form.color} onChange={(c) => setField("color", c)} />

          {isEditing && (
            <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-secondary)', padding: '8px 12px' }}>
              <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Used by <span style={{ fontWeight: 600 }} className="text-text">{editingUsedBy}</span>{" "}
                {activeTab === "Client tags" ? "client" : activeTab === "Service tags" ? "service" : activeTab === "Waitlist tags" ? "waitlist entry" : "block"}
                {editingUsedBy !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {isEditing && (
            <div>
              <FormSelect
                label="Merge into another tag"
                value={mergeTarget}
                onChange={setMergeTarget}
                options={[
                  { value: "", label: "— Don\u2019t merge —" },
                  ...currentData.tags
                    .filter((t) => t.name !== form.name)
                    .map((t) => ({ value: t.name, label: t.name })),
                ]}
              />
              {mergeTarget && (
                <p className="text-caption-md" style={{ marginTop: 4, color: '#d97706' }}>
                  This tag will be deleted and all {editingUsedBy} usage{editingUsedBy !== 1 ? "s" : ""} will be moved to &ldquo;{mergeTarget}&rdquo;.
                </p>
              )}
            </div>
          )}
        </Flex>
      </Modal>
    </div>
  );
}
