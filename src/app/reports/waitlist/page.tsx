"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  DataTable,
  DateRangeFilter,
  PageHeader,
  TableBody,
  TableHead,
  Td,
  Th,
  Tr,
} from "@/components/ds";

const mockWaitlist = [
  { client: "Sophie Lee", dateAdded: "01/03/2026", priority: "High", tags: ["NDIS"], status: "Waiting", practitioner: "Dr Sarah Chen" },
  { client: "Ethan Cooper", dateAdded: "05/03/2026", priority: "Medium", tags: ["Medicare"], status: "Contacted", practitioner: "Emma Williams" },
  { client: "Isabella Harris", dateAdded: "08/03/2026", priority: "High", tags: ["NDIS"], status: "Waiting", practitioner: "Dr Lisa Park" },
  { client: "Mason Clarke", dateAdded: "12/03/2026", priority: "Low", tags: [], status: "Booked", practitioner: "James Anderson" },
  { client: "Ava Robinson", dateAdded: "15/03/2026", priority: "Medium", tags: ["Medicare"], status: "Contacted", practitioner: "Dr Sarah Chen" },
  { client: "William Walker", dateAdded: "18/03/2026", priority: "Low", tags: ["NDIS"], status: "Waiting", practitioner: "Emma Williams" },
];

function priorityVariant(priority: string) {
  switch (priority) {
    case "High": return "red" as const;
    case "Medium": return "yellow" as const;
    case "Low": return "green" as const;
    default: return "gray" as const;
  }
}

function tagVariant(tag: string) {
  switch (tag) {
    case "NDIS": return "yellow" as const;
    case "Medicare": return "green" as const;
    default: return "gray" as const;
  }
}

export default function ReportsWaitlistPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      <PageHeader title="Waitlist">
        <Button>Export</Button>
        <Button>Learn about this report</Button>
      </PageHeader>

      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          Date range *
        </label>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </div>

      {showResults && (
        <>
          <p className="my-4 text-body-md text-text-secondary">{mockWaitlist.length} items found.</p>
          <DataTable>
            <TableHead>
              <Th>Client</Th>
              <Th>Date added</Th>
              <Th>Priority</Th>
              <Th>Tags</Th>
              <Th>Status</Th>
              <Th>Practitioner assigned</Th>
            </TableHead>
            <TableBody>
              {mockWaitlist.map((row, i) => (
                <Tr key={i}>
                  <Td>{row.client}</Td>
                  <Td>{row.dateAdded}</Td>
                  <Td><Badge variant={priorityVariant(row.priority)}>{row.priority}</Badge></Td>
                  <Td>
                    <div className="flex gap-1">
                      {row.tags.length > 0
                        ? row.tags.map((tag) => (
                            <Badge key={tag} variant={tagVariant(tag)}>{tag}</Badge>
                          ))
                        : <span className="text-text-tertiary">—</span>}
                    </div>
                  </Td>
                  <Td>{row.status}</Td>
                  <Td>{row.practitioner}</Td>
                </Tr>
              ))}
            </TableBody>
          </DataTable>
        </>
      )}
    </>
  );
}
