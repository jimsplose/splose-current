"use client";

import { useState } from "react";
import {
  Button,
  PageHeader,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  FormInput,
} from "@/components/ds";

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

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export default function OnlineBookingsPage() {
  const [bookingList, setBookingList] = useState(bookings);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formName, setFormName] = useState("");

  function openCreate() {
    setEditingIndex(null);
    setFormName("");
    setModalOpen(true);
  }

  function openEdit(index: number) {
    setEditingIndex(index);
    setFormName(bookingList[index].name);
    setModalOpen(true);
  }

  function handleSave() {
    const now = new Date().toLocaleString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true, day: "numeric", month: "short", year: "numeric" });
    if (editingIndex !== null) {
      setBookingList((prev) => prev.map((b, i) => (i === editingIndex ? { ...b, name: formName, lastUpdated: now } : b)));
    } else {
      setBookingList((prev) => [...prev, { name: formName, createdAt: now, lastUpdated: now }]);
    }
    setModalOpen(false);
  }

  function handleAction(value: string, index: number) {
    if (value === "edit") openEdit(index);
  }

  return (
    <div className="p-6">
      <PageHeader title="Online booking settings">
        <Button variant="secondary">Show archived</Button>
        <Button variant="primary" onClick={openCreate}>+ New booking page</Button>
      </PageHeader>

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Created at</Th>
          <Th>Last updated</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {bookingList.map((b, i) => (
            <tr key={b.name + i} className="hover:bg-gray-50">
              <Td className="font-medium text-text">{b.name}</Td>
              <Td>{b.createdAt}</Td>
              <Td>{b.lastUpdated}</Td>
              <Td align="right">
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
        title={editingIndex !== null ? "Edit online booking" : "New online booking"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
