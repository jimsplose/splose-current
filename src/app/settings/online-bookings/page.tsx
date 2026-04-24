"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PageHeader, Dropdown, DropdownTriggerButton, Modal, FormInput } from "@/components/ds";
import { useFormModal } from "@/hooks/useFormModal";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";
import { formatTimestamp } from "@/lib/format";

const bookings = [
  {
    name: "ACME Online Booking",
    createdAt: "12:12 pm, 30 Oct 2025",
    lastUpdated: "10:01 am, 5 Mar 2026",
  },
  {
    name: "Online booking test payment",
    createdAt: "2:56 pm, 4 Nov 2025",
    lastUpdated: "8:48 am, 9 Dec 2025",
  },
  {
    name: "Sharon's",
    createdAt: "2:39 pm, 25 Nov 2025",
    lastUpdated: "4:10 pm, 9 Feb 2026",
  },
  {
    name: "Wei Online booking test",
    createdAt: "9:56 pm, 26 Nov 2025",
    lastUpdated: "4:26 pm, 3 Dec 2025",
  },
  {
    name: "Phyllis Physiotherapy",
    createdAt: "11:53 am, 27 Nov 2025",
    lastUpdated: "1:33 pm, 27 Nov 2025",
  },
  {
    name: "OB-QA test",
    createdAt: "11:55 am, 27 Nov 2025",
    lastUpdated: "3:33 pm, 27 Nov 2025",
  },
  {
    name: "TEST Practice Manager",
    createdAt: "10:28 am, 11 Dec 2025",
    lastUpdated: "11:16 am, 7 Jan 2026",
  },
  {
    name: "Test hung",
    createdAt: "3:32 pm, 22 Dec 2025",
    lastUpdated: "3:34 pm, 22 Dec 2025",
  },
  {
    name: "Hung test 2",
    createdAt: "3:51 pm, 22 Dec 2025",
    lastUpdated: "3:51 pm, 22 Dec 2025",
  },
];

interface BookingRow {
  name: string;
  createdAt: string;
  lastUpdated: string;
}

export default function OnlineBookingsPage() {
  const [bookingList, setBookingList] = useState(bookings);

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } =
    useFormModal<{ name: string }>({
      defaults: { name: "" },
      onSave: (values, index) => {
        const now = formatTimestamp();
        if (index !== null) {
          setBookingList((prev) =>
            prev.map((b, i) => (i === index ? { ...b, name: values.name, lastUpdated: now } : b)),
          );
        } else {
          setBookingList((prev) => [...prev, { name: values.name, createdAt: now, lastUpdated: now }]);
        }
      },
    });

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index, { name: bookingList[index].name });
  }

  const columns: ColumnsType<BookingRow> = [
    {
      key: "name",
      title: "Name",
      render: (_, row) => <span style={{ fontWeight: 500 }}>{row.name}</span>,
    },
    { key: "createdAt", title: "Created at", dataIndex: "createdAt" },
    { key: "lastUpdated", title: "Last updated", dataIndex: "lastUpdated" },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, row) => (
        <Dropdown
          align="right"
          trigger={<DropdownTriggerButton />}
          items={STANDARD_SETTINGS}
          onSelect={(value) => handleAction(value, bookingList.indexOf(row))}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Online booking settings">
        <Button>Show archived</Button>
        <Button onClick={openCreate}>+ New booking page</Button>
      </PageHeader>

      <Table columns={columns} dataSource={bookingList} rowKey={(row) => row.name + bookingList.indexOf(row)} pagination={false} />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit online booking" : "New online booking"}
        footer={
          <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput label="Name *" value={form.name} onChange={(e) => setField("name", e.target.value)} />
        </Flex>
      </Modal>
    </div>
  );
}
