"use client";

import { useState } from "react";
import {
  Button,
  PageHeader,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Tab,
  Pagination,
} from "@/components/ds";
import { MoreHorizontal } from "lucide-react";

const tagTabs = ["Client tags", "Service tags", "Waitlist tags", "AI tags"] as const;
type TagTab = (typeof tagTabs)[number];

interface Tag {
  name: string;
  color: string;
}

const tagData: Record<TagTab, { tags: Tag[]; description?: string }> = {
  "Client tags": {
    tags: [
      { name: "2025-11-22", color: "#EAB308" },
      { name: "Client consents to photography for promotional purposes", color: "#22C55E" },
      { name: "Client DOES NOT consent to photography for promotional purposes", color: "#EF4444" },
      { name: "Company A", color: "#EAB308" },
      { name: "Dual funding", color: "#F59E0B" },
      { name: "Exception", color: "#F59E0B" },
      { name: "FORMS PENDING", color: "#EF4444" },
      { name: "High risk", color: "#EF4444" },
    ],
  },
  "Service tags": {
    tags: [
      { name: "1:1 consultation", color: "#EAB308" },
      { name: "DVA", color: "#1E3A5F" },
      { name: "Group", color: "#EAB308" },
      { name: "Medicare", color: "#22C55E" },
      { name: "NDIA", color: "#7C3AED" },
      { name: "NDIS", color: "#2563EB" },
    ],
  },
  "Waitlist tags": {
    tags: [
      { name: "Admin to review", color: "#F97316" },
      { name: "Assessment only (SP)", color: "#6B8DAF" },
      { name: "High", color: "#EF4444" },
      { name: "Lengthy tag,Lengthy tag,Lengthy tag,Lengthy tag", color: "#EAB308" },
      { name: "Low", color: "#F59E0B" },
      { name: "Medium", color: "#F97316" },
      { name: "NDIS referral", color: "#F59E0B" },
      { name: "Other Diagnosis (see notes)", color: "#22C55E" },
    ],
  },
  "AI tags": {
    tags: [
      { name: "Counselling Team", color: "#0891B2" },
      { name: "Intake team", color: "#A78BFA" },
      { name: "Physio Team", color: "#84CC16" },
      { name: "Speech Team", color: "#A855F7" },
    ],
    description:
      "AI tags are used to categorise AI blocks for easy filtering, such as by note type or team name.",
  },
};

export default function TagsPage() {
  const [activeTab, setActiveTab] = useState<TagTab>("Client tags");
  const currentData = tagData[activeTab];

  return (
    <div className="p-6">
      <PageHeader title="Tags">
        <Button variant="primary">+ New tag</Button>
      </PageHeader>

      <Tab
        items={tagTabs.map((tab) => ({
          label: tab,
          value: tab,
          ...(tab === "AI tags" ? { badge: "New" } : {}),
        }))}
        value={activeTab}
        onChange={(val) => setActiveTab(val as TagTab)}
        className="mb-6"
      />

      {currentData.description && (
        <p className="mb-4 text-sm text-text-secondary">{currentData.description}</p>
      )}

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Colour</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {currentData.tags.map((tag) => (
            <tr key={tag.name} className="hover:bg-gray-50">
              <Td className="text-text">{tag.name}</Td>
              <Td>
                <div
                  className="h-4 w-20 rounded"
                  style={{ backgroundColor: tag.color }}
                />
              </Td>
              <Td align="right">
                <button className="rounded p-1 text-text-secondary hover:bg-gray-100 hover:text-text">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={currentData.tags.length}
        itemsPerPage={10}
        showPageSize={false}
      />
    </div>
  );
}
