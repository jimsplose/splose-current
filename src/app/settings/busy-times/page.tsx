"use client";

import { useState } from "react";
import { Button, DataTable, TableHead, Th, TableBody, Td, Dropdown, DropdownTriggerButton, Modal, FormInput, FormSelect } from "@/components/ds";

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

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export default function BusyTimesPage() {
  const [busyTimes, setBusyTimes] = useState(initialBusyTimes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formColor, setFormColor] = useState("#ef4444");
  const [formUtilisation, setFormUtilisation] = useState("Excluded");
  const [formDuration, setFormDuration] = useState("30");

  function openCreate() {
    setEditingIndex(null);
    setFormName("");
    setFormColor("#ef4444");
    setFormUtilisation("Excluded");
    setFormDuration("30");
    setModalOpen(true);
  }

  function openEdit(index: number) {
    const bt = busyTimes[index];
    setEditingIndex(index);
    setFormName(bt.name);
    setFormColor(bt.color);
    setFormUtilisation(bt.utilisation);
    setFormDuration(String(bt.duration));
    setModalOpen(true);
  }

  function handleSave() {
    const entry: BusyTime = { name: formName, color: formColor, utilisation: formUtilisation, duration: parseInt(formDuration) || 30 };
    if (editingIndex !== null) {
      setBusyTimes((prev) => prev.map((b, i) => (i === editingIndex ? entry : b)));
    } else {
      setBusyTimes((prev) => [...prev, entry]);
    }
    setModalOpen(false);
  }

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index);
  }

  return (
    <div className="p-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-display-lg text-text">Busy time types</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary" onClick={openCreate}>+ New type</Button>
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
              <Td><div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: b.color }} />{b.name}</div></Td>
              <Td>{b.utilisation}</Td><Td>{b.duration}</Td>
              <Td>
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={dropdownItems}
                  onSelect={(value) => handleAction(value, i)}
                />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIndex !== null ? "Edit busy time type" : "New busy time type"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Colour</label>
            <div className="flex items-center gap-3">
              <input type="color" value={formColor} onChange={(e) => setFormColor(e.target.value)} className="h-10 w-10 cursor-pointer rounded border border-border" />
              <span className="text-sm text-text-secondary">{formColor}</span>
            </div>
          </div>
          <FormSelect
            label="Utilisation"
            value={formUtilisation}
            onChange={(e) => setFormUtilisation(e.target.value)}
            options={[
              { value: "Excluded", label: "Excluded" },
              { value: "Included", label: "Included" },
            ]}
          />
          <FormInput label="Duration (mins)" type="number" value={formDuration} onChange={(e) => setFormDuration(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
