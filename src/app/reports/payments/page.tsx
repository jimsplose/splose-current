"use client";

import { useState } from "react";
import { Button, Flex } from "antd";
import { DataTable, DateRangeFilter, ListPage, TableBody, TableHead, Td, Th, Tr } from "@/components/ds";

const mockPayments = [
  { number: "PAY-001", client: "Liam Nguyen", amount: "$185.00", method: "Credit Card", date: "03/03/2026", practitioner: "Dr Sarah Chen" },
  { number: "PAY-002", client: "Olivia Smith", amount: "$150.00", method: "Medicare", date: "05/03/2026", practitioner: "Emma Williams" },
  { number: "PAY-003", client: "Noah Wilson", amount: "$220.00", method: "EFTPOS", date: "12/03/2026", practitioner: "Dr Lisa Park" },
  { number: "PAY-004", client: "Charlotte Brown", amount: "$175.00", method: "Bank Transfer", date: "10/03/2026", practitioner: "James Anderson" },
  { number: "PAY-005", client: "Amelia Davis", amount: "$150.00", method: "Credit Card", date: "17/03/2026", practitioner: "Emma Williams" },
  { number: "PAY-006", client: "Jack Thompson", amount: "$95.00", method: "Medicare", date: "08/03/2026", practitioner: "Dr Sarah Chen" },
  { number: "PAY-007", client: "Oliver Martin", amount: "$260.00", method: "Bank Transfer", date: "20/03/2026", practitioner: "James Anderson" },
  { number: "PAY-008", client: "Mia Taylor", amount: "$185.00", method: "EFTPOS", date: "24/03/2026", practitioner: "Dr Lisa Park" },
];

const total = "$1,420.00";

export default function ReportsPaymentsPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ListPage
      title="Payments"
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
            <Button type="primary" onClick={() => setShowResults(true)}>Run report</Button>
          </Flex>
        </>
      }
      cardWrap={false}
    >
      {showResults && (
        <>
          <Flex align="center" gap={8} style={{ margin: '16px 0' }}>
            <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}>Total: {total}</span>
            <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>({mockPayments.length} payments)</span>
          </Flex>
          <DataTable>
            <TableHead>
              <Th>Payment #</Th>
              <Th>Client</Th>
              <Th>Amount</Th>
              <Th>Method</Th>
              <Th>Date</Th>
              <Th>Practitioner</Th>
            </TableHead>
            <TableBody>
              {mockPayments.map((row, i) => (
                <Tr key={i}>
                  <Td>{row.number}</Td>
                  <Td>{row.client}</Td>
                  <Td>{row.amount}</Td>
                  <Td>{row.method}</Td>
                  <Td>{row.date}</Td>
                  <Td>{row.practitioner}</Td>
                </Tr>
              ))}
            </TableBody>
          </DataTable>
        </>
      )}
    </ListPage>
  );
}
