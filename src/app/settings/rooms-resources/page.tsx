"use client";

import { useState } from "react";
import { ArrowUpDown, Filter as FilterIcon } from "lucide-react";
import {
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
  ColorDot,
  FormColorPicker,
  FormInput,
} from "@/components/ds";
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

  return (
    <>
      <div className="flex-1 p-6">
        <PageHeader title="Rooms/Resources">
          <Button variant="secondary">Learn</Button>
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary" onClick={openCreate}>+ Room/resource</Button>
        </PageHeader>

        <SearchBar placeholder="Search for rooms/resources" />

        <DataTable>
          <TableHead>
            <Th>
              <span className="inline-flex items-center gap-1">
                Name <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
              </span>
            </Th>
            <Th>Group</Th>
            <Th>Capacity/Available</Th>
            <Th>
              <span className="inline-flex items-center gap-1">
                Location <FilterIcon className="h-3.5 w-3.5 text-primary" />
              </span>
            </Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {rooms.map((room, index) => (
              <Tr key={room.id}>
                <Td>
                  <div className="flex items-center gap-2.5">
                    <ColorDot color={room.color} />
                    {room.name}
                  </div>
                </Td>
                <Td>{room.group}</Td>
                <Td>{room.capacity}</Td>
                <Td>{room.location}</Td>
                <Td align="right">
                  <Dropdown
                    align="right"
                    trigger={<DropdownTriggerButton />}
                    items={STANDARD_SETTINGS}
                    onSelect={(action) => handleAction(action, room, index)}
                  />
                </Td>
              </Tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-body-md text-text-secondary">
                  No rooms or resources added yet.
                </td>
              </tr>
            )}
          </TableBody>
        </DataTable>

        <Pagination currentPage={1} totalPages={1} totalItems={rooms.length} itemsPerPage={10} />
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Update room/resource" : "Add room/resource"}
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput
            label="Name"
            id="room-name"
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
          />
          <FormColorPicker value={form.color} onChange={(c) => setField("color", c)} variant="swatches" />
        </div>
      </Modal>
    </>
  );
}
