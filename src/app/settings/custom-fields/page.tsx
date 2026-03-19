"use client";

import { useState } from "react";
import { Button, FormInput, DataTable, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

const customFields = [
  { name: "Diagnosis", type: "Multiple choice", visible: true, required: false },
  { name: "AAA", type: "Dropdown (Multiple select)", visible: true, required: false },
  { name: "Goal 1", type: "Long text", visible: true, required: false },
  { name: "Client's deidentification code", type: "Numerical", visible: true, required: false },
  { name: "Personal Care", type: "Multiple choice", visible: true, required: false },
  { name: "Level of Education", type: "Short text", visible: true, required: false },
  { name: "Child Name", type: "Short text", visible: true, required: false },
  { name: "Custom Field Multi Choice - Single Select", type: "Multiple choice", visible: true, required: false },
];

export default function CustomFieldsPage() {
  const [search, setSearch] = useState("");
  const filtered = customFields.filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Custom fields</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Reorder</Button>
          <Button variant="secondary">Show archived</Button>
          <Button variant="secondary">Learn</Button>
          <Button variant="primary">+ New custom field</Button>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <FormInput placeholder="Search for custom field name" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="secondary">Search</Button>
      </div>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Type</Th><Th>Visible</Th><Th>Required</Th><Th>Actions</Th></TableHead>
        <TableBody>
          {filtered.map((f, i) => (
            <tr key={i} className="border-b border-border">
              <Td>{f.name}</Td><Td>{f.type}</Td>
              <Td><span className="text-green-600">Yes</span></Td>
              <Td><span className="text-red-500">No</span></Td>
              <Td><button className="text-text-secondary hover:text-text">•••</button></Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={filtered.length} itemsPerPage={10} />
    </div>
  );
}
