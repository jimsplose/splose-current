"use client";

import { useState } from "react";
import { Button, FormInput, DataTable, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

const rooms = [
  { name: "Red Room", color: "#ef4444", group: "Red", capacity: 1, location: "Sharon's" },
  { name: "Purple Room", color: "#a855f7", group: "Purple", capacity: 1, location: "Sharon's" },
  { name: "Room 1", color: "#22c55e", group: "1", capacity: 1000, location: "East Clinics" },
  { name: "Brainstorming room", color: "#9ca3af", group: "6", capacity: 6, location: "East Clinics" },
  { name: "Group Therapy Room", color: "#f59e0b", group: "Group Therapy", capacity: 5, location: "East Clinics" },
  { name: "Test room", color: "#6366f1", group: "Rooms", capacity: 0, location: "East Clinics" },
  { name: "Car", color: "#14b8a6", group: "Car", capacity: 1, location: "East Clinics" },
  { name: "Purple", color: "#7c3aed", group: "Green room", capacity: 5, location: "Northside" },
];

export default function RoomsResourcesPage() {
  const [search, setSearch] = useState("");
  const filtered = rooms.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Rooms/Resources</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Learn</Button>
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary">+ Room/resource</Button>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <FormInput placeholder="Search for rooms/resources" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="secondary">Search</Button>
      </div>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Group</Th><Th>Capacity/Available</Th><Th>Location</Th><Th>Actions</Th></TableHead>
        <TableBody>
          {filtered.map((r, i) => (
            <tr key={i} className="border-b border-border">
              <Td><div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: r.color }} />{r.name}</div></Td>
              <Td>{r.group}</Td><Td>{r.capacity}</Td><Td>{r.location}</Td>
              <Td><button className="text-text-secondary hover:text-text">•••</button></Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={filtered.length} itemsPerPage={10} />
    </div>
  );
}
