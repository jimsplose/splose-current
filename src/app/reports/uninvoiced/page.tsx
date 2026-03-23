"use client";

import { useState } from "react";
import {
  Button,
  DateRangeFilter,
  PageHeader,
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
    <>
      <PageHeader title="Uninvoiced">
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
          <div className="mb-4 rounded-lg border border-border bg-surface-header px-4 py-3">
            <p className="text-body-md text-text">
              <span className="font-semibold">{mockUninvoicedRows.length} uninvoiced appointments</span> found, total value:{" "}
              <span className="font-semibold">${totalValue.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
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
                    <Td className="text-primary">{row.client}</Td>
                    <Td>{row.service}</Td>
                    <Td>{row.practitioner}</Td>
                    <Td>{row.duration}</Td>
                    <Td align="right">{row.rate}</Td>
                    <Td align="right">{row.amount}</Td>
                  </Tr>
                ))}
              </TableBody>
            </DataTable>
          </div>
        </>
      )}
    </>
  );
}
