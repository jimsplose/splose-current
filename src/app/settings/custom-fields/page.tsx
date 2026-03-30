"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  HolderOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReadOutlined,
} from "@ant-design/icons";
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
  Modal,
  FormInput,
  FormSelect,
  Toggle,
  Dropdown,
  DropdownTriggerButton,
  ReorderModal,
  usePagination,
} from "@/components/ds";

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

  const { paged, paginationProps } = usePagination(filteredFields, { pageKey: "/settings/custom-fields" });

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

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Custom fields">
        <Button variant="secondary" onClick={() => setShowReorderModal(true)}>
          Reorder
        </Button>
        <Button variant="secondary">Show archived</Button>
        <Button variant="secondary">
          <ReadOutlined style={{ fontSize: 16 }} />
          Learn
        </Button>
        <Button variant="secondary" onClick={() => { setNewField({ name: "", type: "Short text", required: false }); setShowNewModal(true); }}>+ New custom field</Button>
      </PageHeader>

      <SearchBar
        placeholder="Search for custom field name"
        onSearch={(q) => setSearchQuery(q)}
      />

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Type</Th>
          <Th>Visible</Th>
          <Th>Required</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {paged.map((field) => (
            <Tr key={field.id}>
              <Td className="text-text">{field.name}</Td>
              <Td>{field.type}</Td>
              <Td>
                <span className="text-green-600">{field.visible ? "Yes" : "No"}</span>
              </Td>
              <Td>
                <span className="text-red-500" style={{ fontWeight: 500 }}>{field.required ? "Yes" : "No"}</span>
              </Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={customFieldDropdownItems}
                  onSelect={(value) => { if (value === "edit") handleEdit(field); }}
                />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination {...paginationProps} />

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
            <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => {
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
              className="h-4 w-4 rounded border-border text-primary"
            />
            <span className="text-body-md text-text">Required field</span>
          </Flex>

          {/* Field type preview */}
          <div style={{ borderRadius: 8, border: '1px dashed #d1d5db', backgroundColor: 'var(--ant-color-bg-layout)', padding: 16 }}>
            <p className="text-label-lg" style={{ marginBottom: 8, color: 'var(--ant-color-text-secondary)' }}>Field preview</p>
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
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
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
            <p className="text-label-lg" style={{ marginBottom: 8, color: 'var(--ant-color-text-secondary)' }}>Options</p>
            <Flex vertical gap={8}>
              {options.map((opt, index) => (
                <Flex key={index} align="center" gap={8}>
                  <HolderOutlined style={{ fontSize: 16, flexShrink: 0, cursor: 'grab', color: 'var(--ant-color-text-secondary)' }} />
                  <div style={{ flex: 1 }}>
                    <FormInput
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <Button
                    variant="icon"
                    size="sm"
                    className="text-red-400 hover:text-red-600"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <DeleteOutlined style={{ fontSize: 16 }} />
                  </Button>
                </Flex>
              ))}
            </Flex>
            <Button
              variant="secondary"
              className="mt-2 w-full border-dashed hover:border-primary hover:text-primary"
              onClick={handleAddOption}
            >
              <PlusOutlined style={{ fontSize: 16 }} />
              Add option
            </Button>
          </div>
        )}

        {/* Field type preview */}
        <div style={{ borderRadius: 8, border: '1px dashed #d1d5db', backgroundColor: 'var(--ant-color-bg-layout)', padding: 16 }}>
          <p className="text-label-lg" style={{ marginBottom: 8, color: 'var(--ant-color-text-secondary)' }}>Field preview</p>
          <FieldTypePreview type={type} name={name} options={options} />
        </div>

        <Flex align="center" justify="space-between">
          <span className="text-body-md text-text">Display in client details</span>
          <Toggle
            checked={displayInClientDetails}
            onChange={setDisplayInClientDetails}
            label={displayInClientDetails ? "Yes" : "No"}
          />
        </Flex>

        <Flex align="center" justify="space-between">
          <span className="text-body-md text-text">Required</span>
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
        <label className="text-label-lg text-text" style={{ display: 'block', marginBottom: 4 }}>{label}</label>
        <textarea
          disabled
          rows={3}
          placeholder="Long text value..."
          style={{ width: '100%', borderRadius: 8, border: '1px solid var(--ant-color-border)', backgroundColor: 'white', padding: '8px 12px', opacity: 0.7 }}
          className="text-body-md text-text-secondary"
        />
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
        <label className="text-label-lg text-text" style={{ display: 'block', marginBottom: 4 }}>{label}</label>
        <Flex vertical gap={6}>
          {previewOpts.map((opt, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="text-body-md text-text-secondary">
              <input
                type="checkbox"
                disabled
                checked={i === 0}
                className="h-4 w-4 rounded border-border text-primary"
              />
              {opt || `Option ${i + 1}`}
            </label>
          ))}
        </Flex>
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
    <p className="text-body-md text-text-secondary" style={{ fontStyle: 'italic' }}>Select a field type to see a preview.</p>
  );
}
