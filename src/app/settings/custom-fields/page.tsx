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
  Modal,
  FormInput,
  FormSelect,
  Toggle,
  Dropdown,
  DropdownTriggerButton,
} from "@/components/ds";
import {
  GripVertical,
  Plus,
  Trash2,
  BookOpen,
} from "lucide-react";

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
  {
    id: 1,
    name: "Diagnosis",
    type: "Multiple choice",
    visible: true,
    required: false,
    options: ["ADD", "ADHD"],
  },
  {
    id: 2,
    name: "AAA",
    type: "Dropdown (Multiple select)",
    visible: true,
    required: false,
  },
  { id: 3, name: "Goal 1", type: "Long text", visible: true, required: false },
  {
    id: 4,
    name: "Client's deidentification code",
    type: "Numerical",
    visible: true,
    required: false,
  },
  {
    id: 5,
    name: "Personal Care",
    type: "Multiple choice",
    visible: true,
    required: false,
  },
  {
    id: 6,
    name: "Level of Education",
    type: "Short text",
    visible: true,
    required: false,
  },
  {
    id: 7,
    name: "Child Name",
    type: "Short text",
    visible: true,
    required: false,
  },
  {
    id: 8,
    name: "Custom Field Multi Choice - Single Select",
    type: "Multiple choice",
    visible: true,
    required: false,
  },
  {
    id: 9,
    name: "Custom Field 1",
    type: "Short text",
    visible: true,
    required: false,
  },
  {
    id: 10,
    name: "Custom Field Numerical - Phone number",
    type: "Numerical",
    visible: true,
    required: false,
  },
  {
    id: 11,
    name: "Custom Field Dropdown Single Select",
    type: "Dropdown (Single select)",
    visible: true,
    required: false,
  },
  {
    id: 12,
    name: "Custom Field Consent Form",
    type: "Multiple choice",
    visible: true,
    required: false,
  },
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

  const filteredFields = fields.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
    <div className="p-6">
      <PageHeader title="Custom fields">
        <Button variant="secondary" onClick={() => setShowReorderModal(true)}>
          Reorder
        </Button>
        <Button variant="secondary">Show archived</Button>
        <Button variant="secondary">
          <BookOpen className="h-4 w-4" />
          Learn
        </Button>
        <Button variant="primary">+ New custom field</Button>
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
          {filteredFields.map((field) => (
            <tr key={field.id} className="hover:bg-gray-50">
              <Td className="text-text">{field.name}</Td>
              <Td>{field.type}</Td>
              <Td>
                <span className="text-green-600">{field.visible ? "Yes" : "No"}</span>
              </Td>
              <Td>
                <span className="text-red-500 font-medium">{field.required ? "Yes" : "No"}</span>
              </Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={customFieldDropdownItems}
                  onSelect={(value) => { if (value === "edit") handleEdit(field); }}
                />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={filteredFields.length}
        itemsPerPage={10}
      />

      {/* Reorder modal */}
      {showReorderModal && (
        <ReorderModal
          fields={fields}
          onClose={() => setShowReorderModal(false)}
          onSave={handleReorder}
        />
      )}

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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reorder modal                                                      */
/* ------------------------------------------------------------------ */
function ReorderModal({
  fields,
  onClose,
  onSave,
}: {
  fields: CustomField[];
  onClose: () => void;
  onSave: (reordered: CustomField[]) => void;
}) {
  const [items, setItems] = useState<CustomField[]>([...fields]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...items];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setItems(updated);
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Reorder custom fields"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave(items)}>
            Save
          </Button>
        </>
      }
    >
      <div className="max-h-[60vh] -mx-6 overflow-y-auto px-6">
        <div className="space-y-2">
          {items.map((field, index) => (
            <div
              key={field.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex cursor-grab items-center gap-3 rounded-lg border border-border bg-white px-4 py-3 transition-colors active:cursor-grabbing ${
                dragIndex === index ? "border-primary bg-purple-50" : ""
              }`}
            >
              <GripVertical className="h-4 w-4 shrink-0 text-text-secondary" />
              <span className="text-body-md text-text">{field.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
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
      <div className="space-y-4">
        <FormInput
          label="Field name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FormSelect
          label="Field type *"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={fieldTypes.map((t) => ({ value: t, label: t }))}
        />

        {showOptions && (
          <div>
            <p className="mb-2 text-label-lg text-text-secondary">Options</p>
            <div className="space-y-2">
              {options.map((opt, index) => (
                <div key={index} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-text-secondary" />
                  <div className="flex-1">
                    <FormInput
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="rounded p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddOption}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-body-md text-text-secondary hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" />
              Add option
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-body-md text-text">Display in client details</span>
          <Toggle
            checked={displayInClientDetails}
            onChange={setDisplayInClientDetails}
            label={displayInClientDetails ? "Yes" : "No"}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-body-md text-text">Required</span>
          <Toggle checked={required} onChange={setRequired} />
        </div>
      </div>
    </Modal>
  );
}
