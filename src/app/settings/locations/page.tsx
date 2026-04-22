"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, PageHeader, DataTable, TableHead, Th, TableBody, Tr, Td, Pagination, Modal, FormInput, FormSelect } from "@/components/ds";

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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(locations.length / pageSize);
  const paged = locations.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [openingHours, setOpeningHours] = useState(defaultHours);
  const [newRoomCount, setNewRoomCount] = useState("1");

  return (
    <div style={{ padding: 24 }}>
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
                  style={{ fontWeight: 500 }}
                >
                  {loc.name}
                </Link>
              </Td>
              <Td color="secondary">{loc.address}</Td>
              <Td color="secondary">{loc.lastUpdate}</Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={locations.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} showPageSize={false} />

      <Modal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="New location"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setShowNewModal(false); router.push("/settings/locations/new"); }}>Create & edit</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            <p style={{ marginBottom: 8, fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)' }}>Opening hours</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {weekdays.map((day) => (
                <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 96, fontSize: 12 }}>{day}</span>
                  <input
                    type="time"
                    style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white', paddingLeft: 8, paddingRight: 8, paddingTop: 6, paddingBottom: 6, outline: 'none', fontSize: 12 }}
                    value={openingHours[day].start}
                    onChange={(e) =>
                      setOpeningHours((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], start: e.target.value },
                      }))
                    }
                  />
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>to</span>
                  <input
                    type="time"
                    style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white', paddingLeft: 8, paddingRight: 8, paddingTop: 6, paddingBottom: 6, outline: 'none', fontSize: 12 }}
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
