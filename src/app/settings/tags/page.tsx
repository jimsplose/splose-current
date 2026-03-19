"use client";

import { useState } from "react";
import { Button, DataTable, TableHead, Th, TableBody, Td } from "@/components/ds";

const tagTabs = ["Client tags", "Service tags", "Waitlist tags", "AI tags"] as const;
const clientTags = [
  { name: "2025-11-22", color: "#EAB308" },
  { name: "Client consents to photography for promotional purposes", color: "#22C55E" },
  { name: "Client DOES NOT consent to photography for promotional purposes", color: "#EF4444" },
  { name: "Company A", color: "#EAB308" },
  { name: "Dual funding", color: "#F59E0B" },
  { name: "Exception", color: "#F59E0B" },
  { name: "FORMS PENDING", color: "#EF4444" },
  { name: "High risk", color: "#EF4444" },
];

export default function TagsPage() {
  const [activeTab, setActiveTab] = useState<typeof tagTabs[number]>("Client tags");
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">Tags</h1>
        <Button variant="primary">+ New tag</Button>
      </div>
      <div className="mb-6 flex items-center gap-4 border-b border-border">
        {tagTabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`border-b-2 px-1 pb-3 text-sm transition-colors ${activeTab === tab ? "border-primary font-medium text-primary" : "border-transparent text-text-secondary hover:text-text"}`}>
            {tab}
            {tab === "AI tags" && <span className="ml-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">New</span>}
          </button>
        ))}
      </div>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Colour</Th><Th align="right">Actions</Th></TableHead>
        <TableBody>
          {clientTags.map((tag) => (
            <tr key={tag.name} className="hover:bg-gray-50">
              <Td className="text-text">{tag.name}</Td>
              <Td><div className="h-4 w-20 rounded" style={{ backgroundColor: tag.color }} /></Td>
              <Td align="right"><button className="text-text-secondary hover:text-text text-lg font-bold">&middot;&middot;&middot;</button></Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
    </div>
  );
}
