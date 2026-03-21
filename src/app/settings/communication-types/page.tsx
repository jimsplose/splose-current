"use client";

import { useState } from "react";
import { Button, DataTable, TableHead, Th, TableBody, Td, Pagination, Dropdown, DropdownTriggerButton, Modal, FormInput, Toggle, OnOffBadge } from "@/components/ds";
import { SIMPLE_CRUD } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

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

export default function CommunicationTypesPage() {
  const [types, setTypes] = useState(initialTypes);

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } = useFormModal<{ name: string; defaultType: boolean }>({
    defaults: { name: "", defaultType: false },
    onSave: (values, index) => {
      if (index !== null) {
        setTypes((prev) => prev.map((t, i) => (i === index ? { name: values.name, defaultType: values.defaultType } : t)));
      } else {
        setTypes((prev) => [...prev, { name: values.name, defaultType: values.defaultType }]);
      }
    },
  });

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index, types[index]);
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
              <Td><OnOffBadge value={c.defaultType} onLabel="Yes" offLabel="No" /></Td>
              <Td>{!c.defaultType ? (
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={SIMPLE_CRUD}
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
        onClose={closeModal}
        title={isEditing ? "Edit communication type" : "New communication type"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <Toggle label="Default type" checked={form.defaultType} onChange={(v) => setField("defaultType", v)} />
        </div>
      </Modal>
    </div>
  );
}
