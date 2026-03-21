"use client";

import { useState } from "react";
import {
  Button,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
  Toggle,
  OnOffBadge,
} from "@/components/ds";
import { SIMPLE_CRUD } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

interface ReferralType {
  name: string;
  defaultType: boolean;
}

const initialTypes: ReferralType[] = [
  { name: "Client", defaultType: true },
  { name: "Contact", defaultType: true },
  { name: "Other", defaultType: true },
  { name: "Facebook", defaultType: false },
  { name: "Google", defaultType: false },
  { name: "Doctor", defaultType: false },
  { name: "GP", defaultType: false },
];

export default function ReferralTypesPage() {
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
        <h1 className="text-display-lg text-text">Referral types</h1>
        <Button variant="secondary" onClick={openCreate}>+ Add referral type</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full">
          <TableHead>
            <Th>Name</Th>
            <Th>Default type</Th>
            <Th>Actions</Th>
          </TableHead>
          <TableBody>
            {types.map((r, i) => (
              <tr key={i} className="border-b border-border">
                <Td>{r.name}</Td>
                <Td>
                  <OnOffBadge value={r.defaultType} onLabel="Yes" offLabel="No" />
                </Td>
                <Td>
                  {r.defaultType ? (
                    <span className="text-text-secondary">-</span>
                  ) : (
                    <Dropdown
                      align="right"
                      trigger={<DropdownTriggerButton />}
                      items={SIMPLE_CRUD}
                      onSelect={(value) => handleAction(value, i)}
                    />
                  )}
                </Td>
              </tr>
            ))}
          </TableBody>
        </table>
        <Pagination
          currentPage={1}
          totalPages={1}
          totalItems={types.length}
          itemsPerPage={10}
        />
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit referral type" : "New referral type"}
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
