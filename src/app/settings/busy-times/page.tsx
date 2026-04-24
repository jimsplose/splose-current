"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ColorDot, Dropdown, DropdownTriggerButton, Modal, FormInput, FormSelect, FormColorPicker, PageHeader } from "@/components/ds";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
import { useFormModal } from "@/hooks/useFormModal";

interface BusyTime {
  name: string;
  color: string;
  utilisation: string;
  duration: number;
  defaultNote: string;
}

const initialBusyTimes: BusyTime[] = [
  { name: "Leave me alone", color: "#ef4444", utilisation: "Excluded", duration: 15, defaultNote: "" },
  { name: "OT referral", color: "#f59e0b", utilisation: "Excluded", duration: 30, defaultNote: "" },
  { name: "Meeting", color: "#1f2937", utilisation: "Excluded", duration: 30, defaultNote: "" },
  { name: "Lunch", color: "#6366f1", utilisation: "Excluded", duration: 30, defaultNote: "" },
  { name: "Admin", color: "#a855f7", utilisation: "Included", duration: 30, defaultNote: "" },
  { name: "CPD", color: "#3b82f6", utilisation: "Excluded", duration: 30, defaultNote: "" },
  { name: "Travel", color: "#22c55e", utilisation: "Excluded", duration: 30, defaultNote: "" },
];

export default function BusyTimesPage() {
  const [busyTimes, setBusyTimes] = useState(initialBusyTimes);

  const { modalOpen, isEditing, editingIndex, form, setField, openCreate, openEdit, closeModal, handleSave } =
    useFormModal<{ name: string; color: string; utilisation: string; duration: string; defaultNote: string }>({
      defaults: { name: "", color: "#ef4444", utilisation: "Excluded", duration: "30", defaultNote: "" },
      onSave: (values, index) => {
        const entry: BusyTime = { name: values.name, color: values.color, utilisation: values.utilisation, duration: parseInt(values.duration) || 30, defaultNote: values.defaultNote };
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
      defaultNote: busyTimes[index].defaultNote,
    });
  }

  const columns: ColumnsType<BusyTime> = [
    {
      key: "name",
      title: "Name",
      render: (_, row) => (
        <Flex align="center" gap={8}><ColorDot color={row.color} />{row.name}</Flex>
      ),
    },
    { key: "utilisation", title: "Utilisation", dataIndex: "utilisation" },
    { key: "duration", title: "Duration (mins)", dataIndex: "duration" },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <Dropdown
          align="right"
          trigger={<DropdownTriggerButton />}
          items={STANDARD_SETTINGS}
          onSelect={(value) => handleAction(value, busyTimes.indexOf(row))}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Busy time types">
        <Button>Show archived</Button>
        <Button onClick={openCreate}>+ New type</Button>
      </PageHeader>
      <p style={{ marginBottom: 24, fontSize: 12, color: 'var(--color-text-secondary)' }}>
        Use busy time to indicate non billable events in Practitioner calendars. You can change utilisation settings to control whether specific types of busy time are used in utilisation reports.
      </p>
      <Table columns={columns} dataSource={busyTimes} rowKey="name" pagination={false} />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit busy time type" : "New busy time type"}
        footer={
          <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name *" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormSelect
            label="Utilisation calculations *"
            value={form.utilisation}
            onChange={(value) => setField("utilisation", value)}
            options={[
              { value: "Excluded", label: "Excluded" },
              { value: "Included", label: "Included" },
            ]}
          />
          <FormColorPicker value={form.color} onChange={(c) => setField("color", c)} />
          <FormInput label="Default duration (minutes)" type="number" value={form.duration} onChange={(e) => setField("duration", e.target.value)} />
          <FormInput label="Default note" value={form.defaultNote} onChange={(e) => setField("defaultNote", e.target.value)} />
        </Flex>
      </Modal>
    </div>
  );
}
