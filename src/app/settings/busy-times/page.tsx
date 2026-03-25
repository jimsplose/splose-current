"use client";

import { useState } from "react";
import { Button, DataTable, TableHead, Th, TableBody, Td, ColorDot, Dropdown, DropdownTriggerButton, Modal, FormInput, FormSelect, FormColorPicker } from "@/components/ds";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

interface BusyTime {
  name: string;
  color: string;
  utilisation: string;
  duration: number;
}

const initialBusyTimes: BusyTime[] = [
  { name: "Leave me alone", color: "#ef4444", utilisation: "Excluded", duration: 15 },
  { name: "OT referral", color: "#f59e0b", utilisation: "Excluded", duration: 30 },
  { name: "Meeting", color: "#1f2937", utilisation: "Excluded", duration: 30 },
  { name: "Lunch", color: "#6366f1", utilisation: "Excluded", duration: 30 },
  { name: "Admin", color: "#a855f7", utilisation: "Included", duration: 30 },
  { name: "CPD", color: "#3b82f6", utilisation: "Excluded", duration: 30 },
  { name: "Travel", color: "#22c55e", utilisation: "Excluded", duration: 30 },
];

export default function BusyTimesPage() {
  const [busyTimes, setBusyTimes] = useState(initialBusyTimes);

  const { modalOpen, isEditing, editingIndex, form, setField, openCreate, openEdit, closeModal, handleSave } =
    useFormModal<{ name: string; color: string; utilisation: string; duration: string }>({
      defaults: { name: "", color: "#ef4444", utilisation: "Excluded", duration: "30" },
      onSave: (values, index) => {
        const entry: BusyTime = { name: values.name, color: values.color, utilisation: values.utilisation, duration: parseInt(values.duration) || 30 };
        if (index !== null) {
          setBusyTimes((prev) => prev.map((b, i) => (i === index ? entry : b)));
        } else {
          setBusyTimes((prev) => [...prev, entry]);
        }
      },
    });

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index, {
      name: busyTimes[index].name,
      color: busyTimes[index].color,
      utilisation: busyTimes[index].utilisation,
      duration: String(busyTimes[index].duration),
    });
  }

  return (
    <div className="p-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-display-lg">Busy time types</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Show archived</Button>
          <Button variant="secondary" onClick={openCreate}>+ New type</Button>
        </div>
      </div>
      <p className="mb-6 text-sm text-text-secondary">
        Use busy time to indicate non billable events in Practitioner calendars. You can change utilisation settings to control whether specific types of busy time are used in utilisation reports.
      </p>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Utilisation</Th><Th>Duration (mins)</Th><Th>Actions</Th></TableHead>
        <TableBody>
          {busyTimes.map((b, i) => (
            <tr key={i} className="border-b border-border">
              <Td><div className="flex items-center gap-2"><ColorDot color={b.color} />{b.name}</div></Td>
              <Td>{b.utilisation}</Td><Td>{b.duration}</Td>
              <Td>
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={STANDARD_SETTINGS}
                  onSelect={(value) => handleAction(value, i)}
                />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit busy time type" : "New busy time type"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormColorPicker value={form.color} onChange={(c) => setField("color", c)} />
          <FormSelect
            label="Utilisation"
            value={form.utilisation}
            onChange={(e) => setField("utilisation", e.target.value)}
            options={[
              { value: "Excluded", label: "Excluded" },
              { value: "Included", label: "Included" },
            ]}
          />
          <FormInput label="Duration (mins)" type="number" value={form.duration} onChange={(e) => setField("duration", e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
