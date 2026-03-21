"use client";

import { useState } from "react";
import { Button, Badge, Dropdown, DropdownTriggerButton, Modal, FormInput } from "@/components/ds";
import { SIMPLE_CRUD } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

interface CancellationReason {
  name: string;
  code: string;
}

const initialReasons: CancellationReason[] = [
  { name: "Condition betteryyy", code: "" },
  { name: "Condition worse", code: "TEST" },
  { name: "Sick", code: "500" },
  { name: "No show due to health reason", code: "NSDH" },
  { name: "No show due to family issues", code: "NSDF" },
  { name: "No show due to unavailability of transport", code: "NSDT" },
  { name: "Cancelled 1", code: "" },
  { name: "No Show - sick", code: "" },
  { name: "Cancel", code: "CANCEL" },
  { name: "No show less than 2 days", code: "" },
];

export default function CancellationReasonsPage() {
  const [reasons, setReasons] = useState(initialReasons);

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } =
    useFormModal<{ name: string; code: string }>({
      defaults: { name: "", code: "" },
      onSave: (values, index) => {
        if (index !== null) {
          setReasons((prev) => prev.map((r, i) => (i === index ? { name: values.name, code: values.code } : r)));
        } else {
          setReasons((prev) => [...prev, { name: values.name, code: values.code }]);
        }
      },
    });

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index, reasons[index]);
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-display-lg text-text">Cancellation reasons</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary" onClick={openCreate}>+ New reason</Button>
        </div>
      </div>
      <div className="divide-y divide-border rounded-lg border border-border bg-white">
        {reasons.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text">{r.name}</span>
              {r.code && <Badge variant="gray">{r.code}</Badge>}
            </div>
            <Dropdown
              align="right"
              trigger={<DropdownTriggerButton />}
              items={SIMPLE_CRUD}
              onSelect={(value) => handleAction(value, i)}
            />
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit cancellation reason" : "New cancellation reason"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormInput label="Code" value={form.code} onChange={(e) => setField("code", e.target.value)} placeholder="Optional" />
        </div>
      </Modal>
    </div>
  );
}
