"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SwapOutlined, FilterOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { PageHeader, SearchBar, Pagination, Dropdown, DropdownTriggerButton, Modal, ColorDot, FormColorPicker, FormInput } from "@/components/ds";
import { useFormModal } from "@/hooks/useFormModal";
import { STANDARD_SETTINGS } from "@/lib/dropdown-presets";

interface Room {
  id: number;
  name: string;
  color: string;
  group: string;
  capacity: number;
  location: string;
}

const initialRooms: Room[] = [
  { id: 1, name: "Red Room", color: "#ef4444", group: "Red", capacity: 1, location: "Sharon's" },
  { id: 2, name: "Purple Room", color: "#8b5cf6", group: "Purple", capacity: 1, location: "Sharon's" },
  { id: 3, name: "Room 1", color: "#22c55e", group: "1", capacity: 1000, location: "East Clinics" },
  { id: 4, name: "Brainstorming room", color: "#6b7280", group: "6", capacity: 6, location: "East Clinics" },
  { id: 5, name: "Group Therapy Room", color: "#f59e0b", group: "Group Therapy", capacity: 5, location: "East Clinics" },
  { id: 6, name: "Test room", color: "#06b6d4", group: "Rooms", capacity: 0, location: "East Clinics" },
  { id: 7, name: "Car", color: "#ef4444", group: "Car", capacity: 1, location: "East Clinics" },
  { id: 8, name: "Purple", color: "#3b82f6", group: "Green room", capacity: 5, location: "Northside" },
];

export default function SettingsRoomsResourcesPage() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(rooms.length / pageSize);
  const paged = rooms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const { modalOpen, isEditing, form, setField, openCreate, openEdit, closeModal, handleSave } =
    useFormModal<{ name: string; color: string }>({
      defaults: { name: "", color: "#3b82f6" },
      onSave: (values, index) => {
        if (index !== null) {
          setRooms((prev) =>
            prev.map((r, i) => (i === index ? { ...r, name: values.name, color: values.color } : r)),
          );
        } else {
          const newRoom: Room = {
            id: rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1,
            name: values.name,
            color: values.color,
            group: "",
            capacity: 0,
            location: "",
          };
          setRooms((prev) => [...prev, newRoom]);
        }
      },
    });

  const handleAction = (action: string, room: Room, index: number) => {
    switch (action) {
      case "edit":
        openEdit(index, { name: room.name, color: room.color });
        break;
      case "duplicate":
        setRooms((prev) => [
          ...prev,
          {
            id: Math.max(...prev.map((r) => r.id)) + 1,
            name: `${room.name} (copy)`,
            color: room.color,
            group: room.group,
            capacity: room.capacity,
            location: room.location,
          },
        ]);
        break;
      case "archive":
        setRooms((prev) => prev.filter((r) => r.id !== room.id));
        break;
    }
  };

  const columns: ColumnsType<Room> = [
    {
      key: "name",
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Name <Icon as={SwapOutlined} tone="secondary" />
        </span>
      ),
      render: (_, row) => (
        <Flex align="center" gap={10}>
          <ColorDot color={row.color} />
          {row.name}
        </Flex>
      ),
    },
    { key: "group", title: "Group", dataIndex: "group" },
    { key: "capacity", title: "Capacity/Available", dataIndex: "capacity" },
    {
      key: "location",
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Location <Icon as={FilterOutlined} tone="primary" />
        </span>
      ),
      dataIndex: "location",
    },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, row) => (
        <Dropdown
          align="right"
          trigger={<DropdownTriggerButton />}
          items={STANDARD_SETTINGS}
          onSelect={(action) => handleAction(action, row, rooms.indexOf(row))}
        />
      ),
    },
  ];

  return (
    <>
      <div style={{ flex: 1, padding: 24 }}>
        <PageHeader title="Rooms/Resources">
          <Button>Learn</Button>
          <Button>Show archived</Button>
          <Button onClick={openCreate}>+ Room/resource</Button>
        </PageHeader>

        <SearchBar placeholder="Search for rooms/resources" />

        <Table
          columns={columns}
          dataSource={paged}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
              No rooms or resources added yet.
            </div>
          ) }}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={rooms.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} />
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Update room/resource" : "Add room/resource"}
        maxWidth="md"
        footer={
          <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>{isEditing ? "Edit" : "Create"}</Button>
          </>
        }
      >
        <Flex vertical gap={16}>
          <FormInput
            label="Name"
            id="room-name"
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
          />
          <FormColorPicker value={form.color} onChange={(c) => setField("color", c)} variant="swatches" />
        </Flex>
      </Modal>
    </>
  );
}
