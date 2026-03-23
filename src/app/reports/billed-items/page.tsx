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

const mockBilledItems = [
  { code: "10960", description: "Initial consultation — Psychology", client: "Liam Nguyen", practitioner: "Dr Sarah Chen", qty: 1, rate: "$185.00", total: "$185.00", invoice: "INV-0421" },
  { code: "10968", description: "Subsequent consultation — Psychology", client: "Noah Wilson", practitioner: "Dr Lisa Park", qty: 1, rate: "$150.00", total: "$150.00", invoice: "INV-0425" },
  { code: "65070", description: "Speech pathology initial assessment", client: "Olivia Smith", practitioner: "Emma Williams", qty: 1, rate: "$195.00", total: "$195.00", invoice: "INV-0422" },
  { code: "65083", description: "Speech pathology subsequent session", client: "Amelia Davis", practitioner: "Emma Williams", qty: 2, rate: "$150.00", total: "$300.00", invoice: "INV-0428" },
  { code: "10960", description: "Initial consultation — Psychology", client: "Mia Taylor", practitioner: "Dr Lisa Park", qty: 1, rate: "$185.00", total: "$185.00", invoice: "INV-0430" },
  { code: "80110", description: "OT initial assessment", client: "Jack Thompson", practitioner: "Dr Sarah Chen", qty: 1, rate: "$210.00", total: "$210.00", invoice: "INV-0423" },
  { code: "80125", description: "OT subsequent consultation", client: "Charlotte Brown", practitioner: "James Anderson", qty: 1, rate: "$175.00", total: "$175.00", invoice: "INV-0424" },
  { code: "81315", description: "Exercise physiology consultation", client: "Oliver Martin", practitioner: "James Anderson", qty: 1, rate: "$130.00", total: "$130.00", invoice: "INV-0429" },
];

const totalInvoiced = "$1,530.00";

export default function ReportsBilledItemsPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      <PageHeader title="Billed items">
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
            <span className="text-heading-md font-semibold">Total invoiced: {totalInvoiced}</span>
            <span className="text-body-md text-text-secondary">({mockBilledItems.length} items)</span>
          </div>
          <DataTable>
            <TableHead>
              <Th>Item code</Th>
              <Th>Description</Th>
              <Th>Client</Th>
              <Th>Practitioner</Th>
              <Th>Qty</Th>
              <Th>Rate</Th>
              <Th>Total</Th>
              <Th>Invoice #</Th>
            </TableHead>
            <TableBody>
              {mockBilledItems.map((row, i) => (
                <Tr key={i}>
                  <Td>{row.code}</Td>
                  <Td>{row.description}</Td>
                  <Td>{row.client}</Td>
                  <Td>{row.practitioner}</Td>
                  <Td>{row.qty}</Td>
                  <Td>{row.rate}</Td>
                  <Td>{row.total}</Td>
                  <Td>{row.invoice}</Td>
                </Tr>
              ))}
            </TableBody>
          </DataTable>
        </>
      )}
    </>
  );
}
