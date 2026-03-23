"use client";

import { useState } from "react";
import {
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
    <>
      <PageHeader title="Payments">
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
          <div className="my-4 flex items-center gap-2">
            <span className="text-heading-md font-semibold">Total: {total}</span>
            <span className="text-body-md text-text-secondary">({mockPayments.length} payments)</span>
          </div>
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
    </>
  );
}
