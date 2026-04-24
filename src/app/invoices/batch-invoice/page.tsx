"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FormSelect, DateRangeFilter, Checkbox, Card, FormPage, ListPage, Text } from "@/components/ds";

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
      <FormPage
        title="Preview batch invoice"
        backHref="#"
        style={{ minHeight: 'calc(100vh - 3.5rem)' }}
        actions={
          <>
            <Button onClick={() => setStep("clients")}>Back</Button>
            <Link href="/invoices">
              <Button type="primary">Create invoices</Button>
            </Link>
          </>
        }
      >
        <Text variant="body/md" as="p" color="secondary" style={{ marginBottom: 16 }}>
          {selectedPreviewInvoices.length} invoices will be created for {selectedClients.length} clients. Review below
          before confirming.
        </Text>

        <Card padding="none" style={{ overflow: 'hidden' }}>
          {(() => {
            type PreviewInvoice = typeof mockPreviewInvoices[number];
            const previewColumns: ColumnsType<PreviewInvoice> = [
              { key: "number", title: "Invoice #", render: (_, inv) => <Text color="primary" as="span" style={{ fontWeight: 500 }}>{inv.number}</Text> },
              { key: "client", title: "Client", dataIndex: "client" },
              { key: "service", title: "Service", dataIndex: "service" },
              { key: "amount", title: "Amount", align: "right" as const, dataIndex: "amount" },
            ];
            return <Table columns={previewColumns} dataSource={selectedPreviewInvoices} rowKey="number" pagination={false} />;
          })()}
        </Card>

        <Flex justify="end" style={{ marginTop: 16, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <Text variant="body/md" as="p" color="secondary">Total</Text>
            <Text variant="heading/md" as="p">${previewTotal.toFixed(2)}</Text>
          </div>
        </Flex>
      </FormPage>
    );
  }

  if (step === "clients") {
    return (
      <ListPage
        title="Batch invoice — Select clients"
        cardWrap={false}
        style={{ minHeight: 'calc(100vh - 3.5rem)' }}
        actions={
          <>
            <Button onClick={() => setStep("filters")}>Back</Button>
            <Button type="primary" onClick={() => setStep("preview")} disabled={selectedClients.length === 0}>
              Next ({selectedClients.length} selected)
            </Button>
          </>
        }
      >
        <div style={{ maxWidth: 768 }}>
          <Text variant="body/md" as="p" color="secondary" style={{ marginBottom: 16 }}>
            Select which clients to include in this batch invoice.
          </Text>

          <Card padding="none" style={{ overflow: 'hidden' }}>
            {(() => {
              type ClientRow = typeof mockClients[number];
              const clientColumns: ColumnsType<ClientRow> = [
                {
                  key: "select",
                  title: <Checkbox checked={selectAll} onChange={toggleAll} />,
                  width: 40,
                  render: (_, client) => (
                    <Checkbox
                      checked={selectedClients.includes(client.id)}
                      onChange={() => toggleClient(client.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ),
                },
                { key: "name", title: "Client", render: (_, client) => <span style={{ fontWeight: 500 }}>{client.name}</span> },
                { key: "appointments", title: "Appointments", align: "right" as const, render: (_, client) => <Text color="secondary" as="span">{client.appointments}</Text> },
                { key: "total", title: "Total", align: "right" as const, render: (_, client) => <span style={{ fontWeight: 500 }}>{client.total}</span> },
              ];
              return (
                <Table
                  columns={clientColumns}
                  dataSource={mockClients}
                  rowKey="id"
                  pagination={false}
                  onRow={(client) => ({ onClick: () => toggleClient(client.id), style: { cursor: "pointer" } })}
                />
              );
            })()}
          </Card>

          <Text variant="body/sm" as="div" color="secondary" style={{ marginTop: 16 }}>
            {selectedClients.length} of {mockClients.length} clients selected
          </Text>
        </div>
      </ListPage>
    );
  }

  // Step: filters (default)
  return (
    <ListPage
      title="Batch invoice"
      cardWrap={false}
      style={{ minHeight: 'calc(100vh - 3.5rem)' }}
      actions={
        <Link href="/invoices">
          <Button>Cancel</Button>
        </Link>
      }
    >
      <div style={{ maxWidth: 672 }}>
        <Flex vertical gap={24}>
          <div>
            <Text variant="label/sm" as="label" color="secondary" style={{ display: 'block', marginBottom: 4 }}>Date range *</Text>
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

          <Flex gap={12}>
            <Button type="primary" onClick={() => setStep("clients")}>
              Next
            </Button>
          </Flex>
        </Flex>
      </div>
    </ListPage>
  );
}
