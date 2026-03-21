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
} from "@/components/ds";

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

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Delete", value: "delete", danger: true },
];

export default function ReferralTypesPage() {
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
                  <span className={r.defaultType ? "text-green-600" : "text-red-500"}>
                    {r.defaultType ? "Yes" : "No"}
                  </span>
                </Td>
                <Td>
                  {r.defaultType ? (
                    <span className="text-text-secondary">-</span>
                  ) : (
                    <Dropdown
                      align="right"
                      trigger={<DropdownTriggerButton />}
                      items={dropdownItems}
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
        onClose={() => setModalOpen(false)}
        title={editingIndex !== null ? "Edit referral type" : "New referral type"}
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
