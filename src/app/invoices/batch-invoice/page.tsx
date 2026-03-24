"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  FormSelect,
  DateRangeFilter,
  PageHeader,
  Checkbox,
  Card,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Navbar,
} from "@/components/ds";

const mockClients = [
  { id: "emma", name: "Emma Thompson", appointments: 3, total: "$193.99" },
  { id: "liam", name: "Liam Johnson", appointments: 2, total: "$97.00" },
  { id: "olivia", name: "Olivia Davis", appointments: 1, total: "$65.09" },
  { id: "noah", name: "Noah Wilson", appointments: 3, total: "$193.99" },
  { id: "ava", name: "Ava Martinez", appointments: 2, total: "$148.50" },
  { id: "ethan", name: "Ethan Brown", appointments: 1, total: "$110.00" },
  { id: "sophia", name: "Sophia Lee", appointments: 4, total: "$387.96" },
];

const mockPreviewInvoices = [
  { number: "INV-0142", client: "Emma Thompson", service: "Individual Therapy", amount: "$193.99" },
  { number: "INV-0143", client: "Liam Johnson", service: "Group Session", amount: "$97.00" },
  { number: "INV-0144", client: "Olivia Davis", service: "Plan Management", amount: "$65.09" },
  { number: "INV-0145", client: "Noah Wilson", service: "Individual Therapy", amount: "$193.99" },
  { number: "INV-0146", client: "Ava Martinez", service: "Support Coordination", amount: "$148.50" },
  { number: "INV-0147", client: "Ethan Brown", service: "Individual Therapy", amount: "$110.00" },
  { number: "INV-0148", client: "Sophia Lee", service: "Group Session", amount: "$387.96" },
];

type Step = "filters" | "clients" | "preview";

export default function BatchInvoicePage() {
  const [step, setStep] = useState<Step>("filters");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleClient = (id: string) => {
    setSelectedClients((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      setSelectAll(next.length === mockClients.length);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectAll) {
      setSelectedClients([]);
      setSelectAll(false);
    } else {
      setSelectedClients(mockClients.map((c) => c.id));
      setSelectAll(true);
    }
  };

  const selectedPreviewInvoices = mockPreviewInvoices.filter((inv) =>
    selectedClients.some((id) => {
      const client = mockClients.find((c) => c.id === id);
      return client && inv.client === client.name;
    }),
  );

  const previewTotal = selectedPreviewInvoices.reduce((sum, inv) => {
    return sum + parseFloat(inv.amount.replace("$", ""));
  }, 0);

  if (step === "preview") {
    return (
      <div className="min-h-[calc(100vh-3.5rem)]">
        <Navbar backHref="#" title="Preview batch invoice">
          <Button onClick={() => setStep("clients")}>Back</Button>
          <Link href="/invoices">
            <Button variant="primary">Create invoices</Button>
          </Link>
        </Navbar>

        <div className="p-6">
          <p className="mb-4 text-body-md text-text-secondary">
            {selectedPreviewInvoices.length} invoices will be created for {selectedClients.length} clients. Review below
            before confirming.
          </p>

          <Card padding="none" className="overflow-hidden">
            <DataTable>
              <TableHead>
                <Th>Invoice #</Th>
                <Th>Client</Th>
                <Th>Service</Th>
                <Th align="right">Amount</Th>
              </TableHead>
              <TableBody>
                {selectedPreviewInvoices.map((inv) => (
                  <tr key={inv.number} className="border-b border-border hover:bg-gray-50">
                    <Td className="font-medium text-primary">{inv.number}</Td>
                    <Td>{inv.client}</Td>
                    <Td>{inv.service}</Td>
                    <Td align="right">{inv.amount}</Td>
                  </tr>
                ))}
              </TableBody>
            </DataTable>
          </Card>

          <div className="mt-4 flex justify-end border-t border-border pt-4">
            <div className="text-right">
              <p className="text-body-md text-text-secondary">Total</p>
              <p className="text-heading-md text-text">${previewTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "clients") {
    return (
      <div className="min-h-[calc(100vh-3.5rem)]">
        <PageHeader title="Batch invoice — Select clients">
          <Button onClick={() => setStep("filters")}>Back</Button>
          <Button variant="primary" onClick={() => setStep("preview")} disabled={selectedClients.length === 0}>
            Next ({selectedClients.length} selected)
          </Button>
        </PageHeader>

        <div className="max-w-3xl p-6">
          <p className="mb-4 text-body-md text-text-secondary">
            Select which clients to include in this batch invoice.
          </p>

          <Card padding="none" className="overflow-hidden">
            <DataTable>
              <TableHead>
                <Th className="w-10">
                  <Checkbox checked={selectAll} onChange={toggleAll} />
                </Th>
                <Th>Client</Th>
                <Th align="right">Appointments</Th>
                <Th align="right">Total</Th>
              </TableHead>
              <TableBody>
                {mockClients.map((client) => (
                  <tr
                    key={client.id}
                    className="cursor-pointer border-b border-border transition-colors hover:bg-gray-50"
                    onClick={() => toggleClient(client.id)}
                  >
                    <Td className="w-10">
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onChange={() => toggleClient(client.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Td>
                    <Td className="font-medium text-text">{client.name}</Td>
                    <Td align="right" className="text-text-secondary">
                      {client.appointments}
                    </Td>
                    <Td align="right" className="font-medium text-text">
                      {client.total}
                    </Td>
                  </tr>
                ))}
              </TableBody>
            </DataTable>
          </Card>

          <div className="mt-4 text-body-sm text-text-secondary">
            {selectedClients.length} of {mockClients.length} clients selected
          </div>
        </div>
      </div>
    );
  }

  // Step: filters (default)
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <PageHeader title="Batch invoice">
        <Link href="/invoices">
          <Button>Cancel</Button>
        </Link>
      </PageHeader>

      <div className="max-w-2xl space-y-6 p-6">
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Date range *</label>
          <DateRangeFilter startDate="2026-03-01" endDate="2026-03-27" />
        </div>

        <FormSelect
          label="Practitioner"
          options={[
            { value: "all", label: "All practitioners" },
            { value: "sarah", label: "Sarah Chen" },
            { value: "james", label: "James Wilson" },
          ]}
        />

        <FormSelect
          label="Invoice type"
          options={[
            { value: "standard", label: "Standard" },
            { value: "ndis", label: "NDIS" },
            { value: "medicare", label: "Medicare" },
          ]}
        />

        <div className="flex gap-3">
          <Button variant="primary" onClick={() => setStep("clients")}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
