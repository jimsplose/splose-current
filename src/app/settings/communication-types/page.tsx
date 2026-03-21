"use client";

import { useState } from "react";
import { Button, DataTable, TableHead, Th, TableBody, Td, Pagination, Dropdown, DropdownTriggerButton, Modal, FormInput, Toggle } from "@/components/ds";

interface CommType {
  name: string;
  defaultType: boolean;
}

const initialTypes: CommType[] = [
  { name: "SMS", defaultType: true },
  { name: "Email", defaultType: true },
  { name: "Phone call", defaultType: false },
  { name: "In-person", defaultType: false },
  { name: "fax", defaultType: false },
  { name: "Admin Notes", defaultType: false },
];

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Delete", value: "delete", danger: true },
];

export default function CommunicationTypesPage() {
  const [types, setTypes] = useState(initialTypes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formDefault, setFormDefault] = useState(false);

  function openCreate() {
    setEditingIndex(null);
    setFormName("");
    setFormDefault(false);
    setModalOpen(true);
  }

  function openEdit(index: number) {
    setEditingIndex(index);
    setFormName(types[index].name);
    setFormDefault(types[index].defaultType);
    setModalOpen(true);
  }

  function handleSave() {
    if (editingIndex !== null) {
      setTypes((prev) => prev.map((t, i) => (i === editingIndex ? { name: formName, defaultType: formDefault } : t)));
    } else {
      setTypes((prev) => [...prev, { name: formName, defaultType: formDefault }]);
    }
    setModalOpen(false);
  }

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index);
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-display-lg text-text">Communication types</h1>
        <Button variant="primary" onClick={openCreate}>+ Add communication type</Button>
      </div>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Default type</Th><Th>Actions</Th></TableHead>
        <TableBody>
          {types.map((c, i) => (
            <tr key={i} className="border-b border-border">
              <Td>{c.name}</Td>
              <Td><span className={c.defaultType ? "text-green-600" : "text-red-500"}>{c.defaultType ? "Yes" : "No"}</span></Td>
              <Td>{!c.defaultType ? (
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={dropdownItems}
                  onSelect={(value) => handleAction(value, i)}
                />
              ) : <span className="text-text-secondary">-</span>}</Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={types.length} itemsPerPage={10} />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIndex !== null ? "Edit communication type" : "New communication type"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
          <Toggle label="Default type" checked={formDefault} onChange={setFormDefault} />
        </div>
      </Modal>
    </div>
  );
}
