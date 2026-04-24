"use client";

import { useState } from "react";
import { Button, Flex, Form, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  HolderOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { PageHeader, SearchBar, Pagination, Modal, FormInput, FormSelect, Toggle, Dropdown, DropdownTriggerButton, ReorderModal } from "@/components/ds";

/* ------------------------------------------------------------------ */
/*  Custom fields mock data                                            */
/* ------------------------------------------------------------------ */
interface CustomField {
  id: number;
  name: string;
  type: string;
  visible: boolean;
  required: boolean;
  options?: string[];
}

const initialFields: CustomField[] = [
  { id: 1, name: "Diagnosis", type: "Multiple choice", visible: true, required: false, options: ["ADD", "ADHD"] },
  { id: 2, name: "AAA", type: "Dropdown (Multiple select)", visible: true, required: false },
  { id: 3, name: "Goal 1", type: "Long text", visible: true, required: false },
  { id: 4, name: "Client's deidentification code", type: "Numerical", visible: true, required: false },
  { id: 5, name: "Personal Care", type: "Multiple choice", visible: true, required: false },
  { id: 6, name: "Level of Education", type: "Short text", visible: true, required: false },
  { id: 7, name: "Child Name", type: "Short text", visible: true, required: false },
  { id: 8, name: "Custom Field Multi Choice - Single Select", type: "Multiple choice", visible: true, required: false },
  { id: 9, name: "Custom Field 1", type: "Short text", visible: true, required: false },
  { id: 10, name: "Custom Field Numerical - Phone number", type: "Numerical", visible: true, required: false },
  { id: 11, name: "Custom Field Dropdown Single Select", type: "Dropdown (Single select)", visible: true, required: false },
  { id: 12, name: "Custom Field Consent Form", type: "Multiple choice", visible: true, required: false },
];

const fieldTypes = [
  "Short text",
  "Long text",
  "Numerical",
  "Date",
  "Multiple choice",
  "Dropdown (Single select)",
  "Dropdown (Multiple select)",
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function CustomFieldsPage() {
  const [fields, setFields] = useState<CustomField[]>(initialFields);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newField, setNewField] = useState({ name: "", type: "Short text", required: false });

  const filteredFields = fields.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredFields.length / pageSize);
  const paged = filteredFields.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const customFieldDropdownItems = [
    { label: "Edit", value: "edit" },
    { label: "Change log", value: "change-log" },
    { label: "", value: "divider-1", divider: true },
    { label: "Archive", value: "archive", danger: true },
  ];

  function handleEdit(field: CustomField) {
    setEditingField({ ...field, options: field.options ? [...field.options] : [] });
    setShowEditModal(true);
  }

  function handleSaveEdit(updated: CustomField) {
    setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    setShowEditModal(false);
    setEditingField(null);
  }

  function handleReorder(reordered: CustomField[]) {
    setFields(reordered);
    setShowReorderModal(false);
  }

  const columns: ColumnsType<CustomField> = [
    { key: "name", title: "Name", dataIndex: "name" },
    { key: "type", title: "Type", dataIndex: "type" },
    {
      key: "visible",
      title: "Visible",
      render: (_, row) => (
        <span style={{ color: '#16a34a' }}>{row.visible ? "Yes" : "No"}</span>
      ),
    },
    {
      key: "required",
      title: "Required",
      render: (_, row) => (
        <span style={{ fontWeight: 500, color: '#ef4444' }}>{row.required ? "Yes" : "No"}</span>
      ),
    },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, row) => (
        <Dropdown
          align="right"
          trigger={<DropdownTriggerButton />}
          items={customFieldDropdownItems}
          onSelect={(value) => { if (value === "edit") handleEdit(row); }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Custom fields">
        <Button onClick={() => setShowReorderModal(true)}>
          Reorder
        </Button>
        <Button>Show archived</Button>
        <Button>
          <ReadOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
          Learn
        </Button>
        <Button onClick={() => { setNewField({ name: "", type: "Short text", required: false }); setShowNewModal(true); }}>+ New custom field</Button>
      </PageHeader>

      <SearchBar
        placeholder="Search for custom field name"
        onSearch={(q) => setSearchQuery(q)}
      />

      <Table columns={columns} dataSource={paged} rowKey="id" pagination={false} />

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredFields.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} />

      {/* Reorder modal (DS component with dnd-kit) */}
      <ReorderModal
        open={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        title="Reorder custom fields"
        items={fields.map((f) => ({ id: String(f.id), label: f.name }))}
        onReorder={(reordered) => {
          const reorderedFields = reordered.map((r) => fields.find((f) => String(f.id) === r.id)!);
          handleReorder(reorderedFields);
        }}
      />

      {/* Edit modal */}
      {showEditModal && editingField && (
        <EditFieldModal
          field={editingField}
          onClose={() => {
            setShowEditModal(false);
            setEditingField(null);
          }}
          onSave={handleSaveEdit}
        />
      )}

      {/* New custom field modal */}
      <Modal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="New custom field"
        footer={
          <Flex justify="flex-end" gap={8}>
            <Button onClick={() => setShowNewModal(false)}>Cancel</Button>
            <Button type="primary" onClick={() => {
              if (newField.name.trim()) {
                setFields((prev) => [...prev, {
                  id: Date.now(),
                  name: newField.name,
                  type: newField.type,
                  required: newField.required,
                  visible: true,
                  options: newField.type.includes("Multiple") || newField.type.includes("Dropdown") ? ["Option 1", "Option 2"] : undefined,
                }]);
                setShowNewModal(false);
              }
            }}>Save</Button>
          </Flex>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Field name" value={newField.name} onChange={(e) => setNewField((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Referral source" />
          <FormSelect
            label="Field type"
            value={newField.type}
            onChange={(value) => setNewField((p) => ({ ...p, type: value }))}
            options={fieldTypes.map((t) => ({ value: t, label: t }))}
          />
          <Flex align="center" gap={8}>
            <input
              type="checkbox"
              checked={newField.required}
              onChange={(e) => setNewField((p) => ({ ...p, required: e.target.checked }))}
              style={{ height: 16, width: 16, borderRadius: 4 }}
            />
            <span style={{ fontSize: 14 }}>Required field</span>
          </Flex>

          {/* Field type preview */}
          <div style={{ borderRadius: 8, border: '1px dashed #d1d5db', backgroundColor: 'var(--color-fill-tertiary)', padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: 'var(--color-text-secondary)' }}>Field preview</p>
            <FieldTypePreview type={newField.type} name={newField.name} options={[]} />
          </div>
        </Flex>
      </Modal>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  Edit / Update custom field modal                                   */
/* ------------------------------------------------------------------ */
function EditFieldModal({
  field,
  onClose,
  onSave,
}: {
  field: CustomField;
  onClose: () => void;
  onSave: (updated: CustomField) => void;
}) {
  const [name, setName] = useState(field.name);
  const [type, setType] = useState(field.type);
  const [options, setOptions] = useState<string[]>(field.options ?? []);
  const [displayInClientDetails, setDisplayInClientDetails] = useState(true);
  const [required, setRequired] = useState(field.required);

  const showOptions =
    type === "Multiple choice" ||
    type === "Dropdown (Single select)" ||
    type === "Dropdown (Multiple select)";

  function handleSave() {
    onSave({
      ...field,
      name,
      type,
      required,
      options: showOptions ? options : undefined,
    });
  }

  function handleAddOption() {
    setOptions([...options, ""]);
  }

  function handleRemoveOption(index: number) {
    setOptions(options.filter((_, i) => i !== index));
  }

  function handleOptionChange(index: number, value: string) {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Update custom field"
      footer={
        <>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
      <Flex vertical gap={16}>
        <FormInput
          label="Field name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FormSelect
          label="Field type *"
          value={type}
          onChange={setType}
          options={fieldTypes.map((t) => ({ value: t, label: t }))}
        />

        {showOptions && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: 'var(--color-text-secondary)' }}>Options</p>
            <Flex vertical gap={8}>
              {options.map((opt, index) => (
                <Flex key={index} align="center" gap={8}>
                  <HolderOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)', flexShrink: 0, cursor: 'grab' }} />
                  <div style={{ flex: 1 }}>
                    <FormInput
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      style={{ height: 40 }}
                    />
                  </div>
                  <Button
                    type="text"
                    size="small"
                    style={{ color: '#f87171' }}
                    onClick={() => handleRemoveOption(index)}
                  >
                    <DeleteOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
                  </Button>
                </Flex>
              ))}
            </Flex>
            <Button
              style={{ marginTop: 8, width: '100%', borderStyle: 'dashed' }}
              onClick={handleAddOption}
            >
              <PlusOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
              Add option
            </Button>
          </div>
        )}

        {/* Field type preview */}
        <div style={{ borderRadius: 8, border: '1px dashed #d1d5db', backgroundColor: 'var(--color-fill-tertiary)', padding: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: 'var(--color-text-secondary)' }}>Field preview</p>
          <FieldTypePreview type={type} name={name} options={options} />
        </div>

        <Flex align="center" justify="space-between">
          <span style={{ fontSize: 14 }}>Display in client details</span>
          <Toggle
            checked={displayInClientDetails}
            onChange={setDisplayInClientDetails}
            label={displayInClientDetails ? "Yes" : "No"}
          />
        </Flex>

        <Flex align="center" justify="space-between">
          <span style={{ fontSize: 14 }}>Required</span>
          <Toggle checked={required} onChange={setRequired} />
        </Flex>
      </Flex>
    </Modal>
  );
}


/* ------------------------------------------------------------------ */
/*  Field type preview — shows what the custom field looks like        */
/* ------------------------------------------------------------------ */
function FieldTypePreview({
  type,
  name,
  options,
}: {
  type: string;
  name: string;
  options: string[];
}) {
  const label = name || "Field name";

  if (type === "Short text") {
    return (
      <FormInput
        label={label}
        value=""
        onChange={() => {}}
        placeholder="Short text value..."
        disabled
      />
    );
  }

  if (type === "Long text") {
    return (
      <div>
        <Form.Item label={label} style={{ marginBottom: 4 }}>
          <textarea
            disabled
            rows={3}
            placeholder="Long text value..."
            style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white', padding: '8px 12px', opacity: 0.7, fontSize: 14, color: 'var(--color-text-secondary)' }}
          />
        </Form.Item>
      </div>
    );
  }

  if (type === "Numerical") {
    return (
      <FormInput
        label={label}
        type="number"
        value=""
        onChange={() => {}}
        placeholder="0"
        disabled
      />
    );
  }

  if (type === "Date") {
    return (
      <FormInput
        label={label}
        type="date"
        value=""
        onChange={() => {}}
        disabled
      />
    );
  }

  if (type === "Multiple choice") {
    const previewOpts = options.length > 0 ? options : ["Option 1", "Option 2"];
    return (
      <div>
        <Form.Item label={label} style={{ marginBottom: 4 }}>
          <Flex vertical gap={6}>
            {previewOpts.map((opt, i) => (
              <label key={i} className="flex items-center gap-2" style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                <input
                  type="checkbox"
                  disabled
                  checked={i === 0}
                  style={{ height: 16, width: 16, borderRadius: 4 }}
                />
                {opt || `Option ${i + 1}`}
              </label>
            ))}
          </Flex>
        </Form.Item>
      </div>
    );
  }

  if (type.includes("Dropdown")) {
    const previewOpts = options.length > 0 ? options : ["Option 1", "Option 2"];
    return (
      <FormSelect
        label={label}
        value=""
        onChange={() => {}}
        options={[
          { value: "", label: `Select ${type.includes("Multiple") ? "one or more" : "one"}...` },
          ...previewOpts.map((opt, i) => ({ value: String(i), label: opt || `Option ${i + 1}` })),
        ]}
        disabled
      />
    );
  }

  // Fallback
  return (
    <p className="italic" style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Select a field type to see a preview.</p>
  );
}
