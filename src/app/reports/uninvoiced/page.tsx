"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  Button,
  Card,
  DateRangeFilter,
  ListPage,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
} from "@/components/ds";

const mockUninvoicedRows = [
  { date: "11/03/2026", client: "Sarah Mitchell", service: "Initial Assessment", practitioner: "Dr Emily Watson", duration: "60 min", rate: "$180.00", amount: "$180.00" },
  { date: "11/03/2026", client: "James O'Brien", service: "Psychology Session", practitioner: "Dr Emily Watson", duration: "50 min", rate: "$220.00", amount: "$220.00" },
  { date: "10/03/2026", client: "Liam Nguyen", service: "Occupational Therapy", practitioner: "Rachel Kim", duration: "45 min", rate: "$165.00", amount: "$165.00" },
  { date: "10/03/2026", client: "Olivia Parker", service: "Speech Pathology", practitioner: "Tom Bradley", duration: "30 min", rate: "$140.00", amount: "$140.00" },
  { date: "09/03/2026", client: "Noah Williams", service: "Physiotherapy", practitioner: "Rachel Kim", duration: "60 min", rate: "$195.00", amount: "$195.00" },
  { date: "09/03/2026", client: "Emma Chen", service: "Psychology Session", practitioner: "Dr Emily Watson", duration: "50 min", rate: "$220.00", amount: "$220.00" },
  { date: "08/03/2026", client: "Ava Thompson", service: "Initial Assessment", practitioner: "Tom Bradley", duration: "60 min", rate: "$180.00", amount: "$180.00" },
  { date: "08/03/2026", client: "Lucas Brown", service: "Occupational Therapy", practitioner: "Rachel Kim", duration: "45 min", rate: "$165.00", amount: "$165.00" },
];

const totalValue = mockUninvoicedRows.reduce((sum, row) => {
  return sum + parseFloat(row.amount.replace("$", "").replace(",", ""));
}, 0);

export default function ReportsUninvoicedPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ListPage
      title="Uninvoiced"
      actions={<><Button>Export</Button><Button>Learn about this report</Button></>}
      cardWrap={false}
    >
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

      {showResults && (
        <>
          <Card padding="sm" style={{ marginBottom: 16, backgroundColor: 'var(--color-fill-quaternary)' }}>
            <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
              <span style={{ fontWeight: 600 }}>{mockUninvoicedRows.length} uninvoiced appointments</span> found, total value:{" "}
              <span style={{ fontWeight: 600 }}>${totalValue.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
            </p>
          </Card>

          <Card padding="none" style={{ overflowX: 'auto' }}>
            <DataTable>
              <TableHead>
                <Th>Date</Th>
                <Th>Client</Th>
                <Th>Service</Th>
                <Th>Practitioner</Th>
                <Th>Duration</Th>
                <Th align="right">Rate</Th>
                <Th align="right">Amount</Th>
              </TableHead>
              <TableBody>
                {mockUninvoicedRows.map((row, i) => (
                  <Tr key={i}>
                    <Td>{row.date}</Td>
                    <Td style={{ color: 'var(--color-primary)' }}>{row.client}</Td>
                    <Td>{row.service}</Td>
                    <Td>{row.practitioner}</Td>
                    <Td>{row.duration}</Td>
                    <Td align="right">{row.rate}</Td>
                    <Td align="right">{row.amount}</Td>
                  </Tr>
                ))}
              </TableBody>
            </DataTable>
          </Card>
        </>
      )}
    </ListPage>
  );
}
