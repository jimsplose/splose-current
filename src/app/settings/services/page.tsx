"use client";

import { useState } from "react";
import { Button, FormInput, DataTable, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

const services = [
  { name: "1:1 Consultation", color: "#a855f7", type: "1:1 Consultation", itemCode: "299sdsdds3234", duration: "40 minutes", price: "193.00 / Hour" },
  { name: "1x Initial 1:1 Assessment, 14 x Group Therapy Sessions, and 1x Review Session", color: "#9ca3af", type: "Group Package Deal", itemCode: "", duration: "60 minutes", price: "1000.00 / Each" },
  { name: "2:2 Consultations", color: "#22c55e", type: "2:2 Consultations", itemCode: "2997952838_6127l_abc", duration: "60 minutes", price: "193.99 / Hour" },
  { name: "2. Payment optional - partial - Online booking", color: "#6366f1", type: "1. Payment test - Online booking", itemCode: "sd", duration: "30 minutes", price: "200.00 / Hour" },
  { name: "3 cases services", color: "#f59e0b", type: "3 cases service", itemCode: "", duration: "45 minutes", price: "120.00 / Hour" },
  { name: "3. Payment required - partial - Online booking", color: "#ef4444", type: "1. Payment test - Online booking", itemCode: "", duration: "30 minutes", price: "200.00 / Hour" },
  { name: "4. Payment required - full - Online booking", color: "#14b8a6", type: "1. Payment test - Online booking", itemCode: "", duration: "30 minutes", price: "200.00 / Hour" },
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const filtered = services.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Services</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Learn</Button>
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary">+ New service</Button>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <FormInput placeholder="Search for service name, type, and item code" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="secondary">Search</Button>
      </div>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Type</Th><Th>Item code</Th><Th>Duration</Th><Th>Price</Th><Th>Actions</Th></TableHead>
        <TableBody>
          {filtered.map((s, i) => (
            <tr key={i} className="border-b border-border">
              <Td><div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} /><span className="max-w-[200px] truncate">{s.name}</span></div></Td>
              <Td><span className="max-w-[150px] truncate block">{s.type}</span></Td>
              <Td><span className="text-xs text-text-secondary">{s.itemCode}</span></Td>
              <Td>{s.duration}</Td><Td>{s.price}</Td>
              <Td><button className="text-text-secondary hover:text-text">•••</button></Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={filtered.length} itemsPerPage={10} />
    </div>
  );
}
