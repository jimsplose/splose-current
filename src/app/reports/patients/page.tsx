"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  Badge,
  Button,
  DataTable,
  DateRangeFilter,
  FormSelect,
  PageHeader,
  TableBody,
  TableHead,
  Td,
  Th,
  Tr,
} from "@/components/ds";

const mockPatients = [
  { name: "Liam Nguyen", dob: "14/05/1992", phone: "0412 345 678", email: "liam.nguyen@email.com", tags: ["NDIS"], created: "01/02/2026", lastAppt: "03/03/2026" },
  { name: "Olivia Smith", dob: "22/11/1985", phone: "0423 456 789", email: "olivia.smith@email.com", tags: ["Medicare"], created: "15/01/2026", lastAppt: "05/03/2026" },
  { name: "Jack Thompson", dob: "09/03/2001", phone: "0434 567 890", email: "jack.t@email.com", tags: ["NDIS"], created: "20/12/2025", lastAppt: "08/03/2026" },
  { name: "Charlotte Brown", dob: "30/07/1978", phone: "0445 678 901", email: "charlotte.b@email.com", tags: ["Medicare", "NDIS"], created: "05/11/2025", lastAppt: "10/03/2026" },
  { name: "Noah Wilson", dob: "18/01/1995", phone: "0456 789 012", email: "noah.wilson@email.com", tags: [], created: "28/02/2026", lastAppt: "12/03/2026" },
  { name: "Amelia Davis", dob: "03/09/1988", phone: "0467 890 123", email: "amelia.d@email.com", tags: ["Medicare"], created: "10/01/2026", lastAppt: "17/03/2026" },
  { name: "Oliver Martin", dob: "25/12/2003", phone: "0478 901 234", email: "oliver.m@email.com", tags: ["NDIS"], created: "22/02/2026", lastAppt: "20/03/2026" },
  { name: "Mia Taylor", dob: "11/06/1990", phone: "0489 012 345", email: "mia.taylor@email.com", tags: ["Medicare"], created: "14/03/2026", lastAppt: "24/03/2026" },
];

function tagVariant(tag: string) {
  switch (tag) {
    case "NDIS": return "yellow" as const;
    case "Medicare": return "green" as const;
    default: return "gray" as const;
  }
}

export default function ReportsPatientsPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      <PageHeader title="Clients">
        <Button>Export</Button>
        <Button>Learn about this report</Button>
      </PageHeader>

      <div style={{ marginBottom: 16 }}>
        <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          Date range *
        </Flex>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          Status
        </Flex>
        <FormSelect
          options={[
            { value: "active", label: "Active" },
            { value: "archived", label: "Archived" },
            { value: "all", label: "All" },
          ]}
          className="!w-48"
        />
      </div>

      <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 32 }}>
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </Flex>

      {showResults && (
        <>
          <p className="text-body-md" style={{ margin: '16px 0', color: 'var(--color-text-secondary)' }}>{mockPatients.length} items found.</p>
          <DataTable>
            <TableHead>
              <Th>Name</Th>
              <Th>Date of birth</Th>
              <Th>Phone</Th>
              <Th>Email</Th>
              <Th>Tags</Th>
              <Th>Created</Th>
              <Th>Last appointment</Th>
            </TableHead>
            <TableBody>
              {mockPatients.map((row, i) => (
                <Tr key={i}>
                  <Td>{row.name}</Td>
                  <Td>{row.dob}</Td>
                  <Td>{row.phone}</Td>
                  <Td>{row.email}</Td>
                  <Td>
                    <Flex gap={4}>
                      {row.tags.length > 0
                        ? row.tags.map((tag) => (
                            <Badge key={tag} variant={tagVariant(tag)}>{tag}</Badge>
                          ))
                        : <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>}
                    </Flex>
                  </Td>
                  <Td>{row.created}</Td>
                  <Td>{row.lastAppt}</Td>
                </Tr>
              ))}
            </TableBody>
          </DataTable>
        </>
      )}
    </>
  );
}
