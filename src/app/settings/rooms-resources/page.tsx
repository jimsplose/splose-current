"use client";

import { useState, useRef, useEffect } from "react";

// Color palette for room color picker
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
}

const initialRooms: Room[] = [
  { id: 1, name: "Room 1", color: "#3b82f6" },
  { id: 2, name: "Room 2", color: "#22c55e" },
  { id: 3, name: "Room 3", color: "#f59e0b" },
  { id: 4, name: "Room 4", color: "#ef4444" },
  { id: 5, name: "Gym", color: "#8b5cf6" },
  { id: 6, name: "Pool", color: "#06b6d4" },
];

function ActionsDropdown({ onSelect }: { onSelect: (action: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const items = [
    { label: "Edit", value: "edit" },
    { label: "Duplicate", value: "duplicate" },
    { label: "Change log", value: "changelog" },
    { label: "Archive", value: "archive", danger: true },
  ];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="rounded p-1 text-text-secondary hover:bg-gray-100 hover:text-text"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="4" cy="10" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="16" cy="10" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-border bg-white py-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                onSelect(item.value);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                item.danger ? "text-red-600" : "text-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RoomModal({
  open,
  onClose,
  title,
  room,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  room: { name: string; color: string };
  onSave: (name: string, color: string) => void;
}) {
  const [name, setName] = useState(room.name);
  const [color, setColor] = useState(room.color);

  useEffect(() => {
    setName(room.name);
    setColor(room.color);
  }, [room.name, room.color]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-3 pt-4 pb-4 sm:px-0 sm:pt-12 sm:pb-12"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-text">{title}</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-secondary hover:bg-gray-100"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Name field */}
          <div>
            <label
              htmlFor="room-name"
              className="mb-1 block text-sm font-medium text-text-secondary"
            >
              Name
            </label>
            <input
              id="room-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              Colour
            </label>
            <div className="grid grid-cols-10 gap-2">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  onClick={() => setColor(swatch)}
                  className={`h-7 w-7 rounded-full transition-all ${
                    color === swatch
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: swatch }}
                  aria-label={`Select colour ${swatch}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(name, color)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsRoomsResourcesPage() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add room/resource");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [modalDefaults, setModalDefaults] = useState({ name: "", color: "#3b82f6" });

  const handleAddRoom = () => {
    setEditingRoom(null);
    setModalTitle("Add room/resource");
    setModalDefaults({ name: "", color: "#3b82f6" });
    setModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setModalTitle("Update room/resource");
    setModalDefaults({ name: room.name, color: room.color });
    setModalOpen(true);
  };

  const handleDuplicateRoom = (room: Room) => {
    const newRoom: Room = {
      id: Math.max(...rooms.map((r) => r.id)) + 1,
      name: `${room.name} (copy)`,
      color: room.color,
    };
    setRooms([...rooms, newRoom]);
  };

  const handleArchiveRoom = (room: Room) => {
    setRooms(rooms.filter((r) => r.id !== room.id));
  };

  const handleSave = (name: string, color: string) => {
    if (editingRoom) {
      setRooms(
        rooms.map((r) =>
          r.id === editingRoom.id ? { ...r, name, color } : r
        )
      );
    } else {
      const newRoom: Room = {
        id: rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1,
        name,
        color,
      };
      setRooms([...rooms, newRoom]);
    }
    setModalOpen(false);
  };

  const handleAction = (action: string, room: Room) => {
    switch (action) {
      case "edit":
        handleEditRoom(room);
        break;
      case "duplicate":
        handleDuplicateRoom(room);
        break;
      case "archive":
        handleArchiveRoom(room);
        break;
      case "changelog":
        // No-op for prototype
        break;
    }
  };

  return (
    <>
      <div className="flex-1 p-6">
        {/* Page header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Rooms/Resources</h1>
          <button
            onClick={handleAddRoom}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            + Add room/resource
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-purple-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-text">
                  Name
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-text">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-block h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: room.color }}
                      />
                      {room.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ActionsDropdown
                      onSelect={(action) => handleAction(action, room)}
                    />
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-8 text-center text-sm text-text-secondary"
                  >
                    No rooms or resources added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
            <span>&lt;</span>
            <button className="mx-2 flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
              1
            </button>
            <span>&gt;</span>
          </div>
        </div>
      </div>

      {/* Room Modal */}
      <RoomModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        room={modalDefaults}
        onSave={handleSave}
      />
    </>
  );
}
