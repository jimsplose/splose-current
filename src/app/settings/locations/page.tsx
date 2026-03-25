"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, PageHeader, DataTable, TableHead, Th, TableBody, Tr, Td, Pagination, Modal, FormInput, FormSelect, usePagination } from "@/components/ds";

const locations = [
  { id: 128, name: "East Clinics", address: "", lastUpdate: "12:24 pm, 6 Mar 2026", rooms: 4 },
  { id: 129, name: "Splose OT", address: "", lastUpdate: "2:08 pm, 26 Feb 2026", rooms: 2 },
  { id: 130, name: "Ploc", address: "", lastUpdate: "2:08 pm, 26 Feb 2026", rooms: 1 },
  { id: 131, name: "Tasks", address: "", lastUpdate: "11:59 am, 5 Mar 2026", rooms: 3 },
  { id: 132, name: "Sharon\u2019s", address: "", lastUpdate: "2:08 pm, 26 Feb 2026", rooms: 2 },
  { id: 133, name: "One service only", address: "297 Pirie St, Adelaide, SA, 5000", lastUpdate: "2:08 pm, 26 Feb 2026", rooms: 1 },
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

const defaultHours: Record<string, { start: string; end: string }> = {
  Monday: { start: "08:00", end: "17:00" },
  Tuesday: { start: "08:00", end: "17:00" },
  Wednesday: { start: "08:00", end: "17:00" },
  Thursday: { start: "08:00", end: "17:00" },
  Friday: { start: "08:00", end: "17:00" },
};

export default function LocationsPage() {
  const router = useRouter();
  const { paged, paginationProps } = usePagination(locations, { pageKey: "/settings/locations" });
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [openingHours, setOpeningHours] = useState(defaultHours);
  const [newRoomCount, setNewRoomCount] = useState("1");

  return (
    <div className="p-6">
      <PageHeader title="Locations">
        <Button variant="secondary">Show archived</Button>
        <Button variant="secondary" onClick={() => { setNewName(""); setNewAddress(""); setOpeningHours(defaultHours); setNewRoomCount("1"); setShowNewModal(true); }}>+ New location</Button>
      </PageHeader>
      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Address</Th>
          <Th>Last update</Th>
        </TableHead>
        <TableBody>
          {paged.map((loc) => (
            <Tr key={loc.id} clickable>
              <Td>
                <Link
                  href={`/settings/locations/edit/${loc.id}`}
                  className="font-medium text-text hover:text-primary"
                >
                  {loc.name}
                </Link>
              </Td>
              <Td className="text-text-secondary">{loc.address}</Td>
              <Td className="text-text-secondary">{loc.lastUpdate}</Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination {...paginationProps} showPageSize={false} />

      <Modal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="New location"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setShowNewModal(false); router.push("/settings/locations/new"); }}>Create & edit</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormInput label="Location name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. North Clinics" />
          <FormInput label="Address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="e.g. 123 Main St, Adelaide SA 5000" />

          {/* Room count */}
          <FormInput
            label="Number of rooms"
            type="number"
            min={1}
            max={50}
            value={newRoomCount}
            onChange={(e) => setNewRoomCount(e.target.value)}
          />

          {/* Opening hours */}
          <div>
            <p className="mb-2 text-label-lg text-text-secondary">Opening hours</p>
            <div className="space-y-2">
              {weekdays.map((day) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-24 text-body-sm text-text">{day}</span>
                  <input
                    type="time"
                    className="rounded-lg border border-border bg-white px-2 py-1.5 text-body-sm text-text outline-none focus:border-primary"
                    value={openingHours[day].start}
                    onChange={(e) =>
                      setOpeningHours((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], start: e.target.value },
                      }))
                    }
                  />
                  <span className="text-body-sm text-text-secondary">to</span>
                  <input
                    type="time"
                    className="rounded-lg border border-border bg-white px-2 py-1.5 text-body-sm text-text outline-none focus:border-primary"
                    value={openingHours[day].end}
                    onChange={(e) =>
                      setOpeningHours((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], end: e.target.value },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
