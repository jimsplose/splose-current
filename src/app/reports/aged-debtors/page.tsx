"use client";

import { useState } from "react";
import {
  Button,
  Card,
  DateRangeFilter,
  FormSelect,
  PageHeader,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
} from "@/components/ds";

const agingSummary = [
  { label: "Current", amount: "$2,450.00", color: "text-green-600" },
  { label: "30 days", amount: "$1,200.00", color: "text-yellow-600" },
  { label: "60 days", amount: "$800.00", color: "text-orange-600" },
  { label: "90+ days", amount: "$350.00", color: "text-red-600" },
];

const mockDebtorRows = [
  { client: "James O'Brien", invoice: "INV-1042", amount: "$220.00", outstanding: "$220.00", dueDate: "22/03/2026", daysOverdue: 0 },
  { client: "Sarah Mitchell", invoice: "INV-1038", amount: "$360.00", outstanding: "$180.00", dueDate: "18/03/2026", daysOverdue: 6 },
  { client: "Lucas Brown", invoice: "INV-1031", amount: "$165.00", outstanding: "$165.00", dueDate: "10/03/2026", daysOverdue: 14 },
  { client: "Olivia Parker", invoice: "INV-1024", amount: "$280.00", outstanding: "$280.00", dueDate: "22/02/2026", daysOverdue: 30 },
  { client: "Noah Williams", invoice: "INV-1019", amount: "$390.00", outstanding: "$390.00", dueDate: "15/02/2026", daysOverdue: 37 },
  { client: "Emma Chen", invoice: "INV-1012", amount: "$440.00", outstanding: "$440.00", dueDate: "20/01/2026", daysOverdue: 63 },
  { client: "Ava Thompson", invoice: "INV-1005", amount: "$195.00", outstanding: "$195.00", dueDate: "05/01/2026", daysOverdue: 78 },
  { client: "Liam Nguyen", invoice: "INV-0998", amount: "$350.00", outstanding: "$350.00", dueDate: "15/12/2025", daysOverdue: 99 },
];

export default function ReportsAgedDebtorsPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      <PageHeader title="Aged debtors">
        <Button>Export</Button>
        <Button>Learn about this report</Button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-start gap-4">
        <div>
          <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
            Date range *
          </label>
          <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
        </div>
        <div className="w-48">
          <FormSelect
            label="Ageing by *"
            options={[
              { value: "invoice-date", label: "Invoice date" },
              { value: "due-date", label: "Due date" },
            ]}
            required
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </div>

      {showResults && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {agingSummary.map((item) => (
              <Card key={item.label}>
                <p className="text-label-md text-text-secondary">{item.label}</p>
                <p className={`mt-1 text-heading-lg ${item.color}`}>{item.amount}</p>
              </Card>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <DataTable>
              <TableHead>
                <Th>Client</Th>
                <Th>Invoice #</Th>
                <Th align="right">Amount</Th>
                <Th align="right">Outstanding</Th>
                <Th>Due date</Th>
                <Th align="right">Days overdue</Th>
              </TableHead>
              <TableBody>
                {mockDebtorRows.map((row, i) => (
                  <Tr key={i}>
                    <Td className="text-primary">{row.client}</Td>
                    <Td className="text-primary">{row.invoice}</Td>
                    <Td align="right">{row.amount}</Td>
                    <Td align="right">{row.outstanding}</Td>
                    <Td>{row.dueDate}</Td>
                    <Td align="right">
                      <span className={row.daysOverdue >= 90 ? "font-semibold text-red-600" : row.daysOverdue >= 60 ? "text-orange-600" : row.daysOverdue >= 30 ? "text-yellow-600" : ""}>
                        {row.daysOverdue}
                      </span>
                    </Td>
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
