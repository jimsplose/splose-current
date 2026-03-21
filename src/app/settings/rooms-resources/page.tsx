"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, Filter as FilterIcon } from "lucide-react";
import {
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
} from "@/components/ds";

const COLOR_SWATCHES = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#78716c", "#6b7280", "#1e293b",
];

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

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "changelog" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-label-lg text-text-secondary">Colour</label>
      <div className="grid grid-cols-10 gap-2">
        {COLOR_SWATCHES.map((swatch) => (
          <button
            key={swatch}
            onClick={() => onChange(swatch)}
            className={`h-7 w-7 rounded-full transition-all ${
              value === swatch ? "ring-2 ring-primary ring-offset-2" : "hover:scale-110"
            }`}
            style={{ backgroundColor: swatch }}
            aria-label={`Select colour ${swatch}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function SettingsRoomsResourcesPage() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formName, setFormName] = useState("");
  const [formColor, setFormColor] = useState("#3b82f6");

  useEffect(() => {
    if (editingRoom) {
      setFormName(editingRoom.name);
      setFormColor(editingRoom.color);
    } else {
      setFormName("");
      setFormColor("#3b82f6");
    }
  }, [editingRoom]);

  const handleAddRoom = () => {
    setEditingRoom(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === editingRoom.id ? { ...r, name: formName, color: formColor } : r)));
    } else {
      const newRoom: Room = {
        id: rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1,
        name: formName,
        color: formColor,
        group: "",
        capacity: 0,
        location: "",
      };
      setRooms([...rooms, newRoom]);
    }
    setModalOpen(false);
  };

  const handleAction = (action: string, room: Room) => {
    switch (action) {
      case "edit":
        setEditingRoom(room);
        setModalOpen(true);
        break;
      case "duplicate":
        setRooms([...rooms, {
          id: Math.max(...rooms.map((r) => r.id)) + 1,
          name: `${room.name} (copy)`,
          color: room.color,
          group: room.group,
          capacity: room.capacity,
          location: room.location,
        }]);
        break;
      case "archive":
        setRooms(rooms.filter((r) => r.id !== room.id));
        break;
    }
  };

  return (
    <>
      <div className="flex-1 p-6">
        <PageHeader title="Rooms/Resources">
          <Button variant="secondary">Learn</Button>
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary" onClick={handleAddRoom}>+ Room/resource</Button>
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
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <Td>
                  <div className="flex items-center gap-2.5">
                    <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: room.color }} />
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
                    items={dropdownItems}
                    onSelect={(action) => handleAction(action, room)}
                  />
                </Td>
              </tr>
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
        onClose={() => setModalOpen(false)}
        title={editingRoom ? "Update room/resource" : "Add room/resource"}
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="room-name" className="mb-1 block text-label-lg text-text-secondary">Name</label>
            <input
              id="room-name"
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <ColorPicker value={formColor} onChange={setFormColor} />
        </div>
      </Modal>
    </>
  );
}
