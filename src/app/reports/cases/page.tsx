"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  Badge,
  Button,
  DataTable,
  DateRangeFilter,
  ListPage,
  TableBody,
  TableHead,
  Td,
  Th,
  Tr,
} from "@/components/ds";

const mockCases = [
  { number: "CASE-001", client: "Liam Nguyen", type: "NDIS", practitioner: "Dr Sarah Chen", status: "Active", created: "15/01/2026", budget: "$12,500 / 40 hrs" },
  { number: "CASE-002", client: "Charlotte Brown", type: "NDIS", practitioner: "James Anderson", status: "Active", created: "20/11/2025", budget: "$8,200 / 25 hrs" },
  { number: "CASE-003", client: "Jack Thompson", type: "DVA", practitioner: "Dr Sarah Chen", status: "Closed", created: "05/09/2025", budget: "$5,000 / 15 hrs" },
  { number: "CASE-004", client: "Noah Wilson", type: "Private", practitioner: "Dr Lisa Park", status: "Active", created: "01/03/2026", budget: "$3,600 / 12 hrs" },
  { number: "CASE-005", client: "Oliver Martin", type: "NDIS", practitioner: "Emma Williams", status: "Active", created: "22/02/2026", budget: "$15,000 / 50 hrs" },
  { number: "CASE-006", client: "Amelia Davis", type: "DVA", practitioner: "James Anderson", status: "Closed", created: "10/07/2025", budget: "$4,800 / 16 hrs" },
];

function caseStatusVariant(status: string) {
  switch (status) {
    case "Active": return "green" as const;
    case "Closed": return "gray" as const;
    default: return "gray" as const;
  }
}

export default function ReportsCasesPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ListPage
      title="Cases"
      actions={
        <>
          <Button>Export</Button>
          <Button>Learn about this report</Button>
        </>
      }
      toolbar={
        <>
          <div style={{ marginBottom: 16 }}>
            <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              Date range *
            </Flex>
            <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
          </div>

          <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 32 }}>
            <Button>Add filter</Button>
            <Button>Save filters</Button>
            <Button>Load filters</Button>
            <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
          </Flex>
        </>
      }
      cardWrap={false}
    >
      {showResults && (
        <>
          <p style={{ fontSize: 14, lineHeight: 1.57, margin: '16px 0', color: 'var(--color-text-secondary)' }}>{mockCases.length} items found.</p>
          <DataTable>
            <TableHead>
              <Th>Case #</Th>
              <Th>Client</Th>
              <Th>Type</Th>
              <Th>Practitioner</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th>Budget / Hours</Th>
            </TableHead>
            <TableBody>
              {mockCases.map((row, i) => (
                <Tr key={i}>
                  <Td>{row.number}</Td>
                  <Td>{row.client}</Td>
                  <Td>{row.type}</Td>
                  <Td>{row.practitioner}</Td>
                  <Td><Badge variant={caseStatusVariant(row.status)}>{row.status}</Badge></Td>
                  <Td>{row.created}</Td>
                  <Td>{row.budget}</Td>
                </Tr>
              ))}
            </TableBody>
          </DataTable>
        </>
      )}
    </ListPage>
  );
}
