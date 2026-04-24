"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CloseOutlined, PlusOutlined, SearchOutlined, PrinterOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Card, Divider, FormPage, Grid, EmptyState, Text } from "@/components/ds";

const mockClients = [
  "Skyler Peterson",
  "elsa frozen",
  "A Jr",
  "rakesh soni",
  "A test",
  "Alex Anders",
  "Sarah Johnson",
  "Michael Chen",
];

const paymentMethods = ["Cash", "Credit card", "Direct deposit", "EFTPOS", "Medicare", "NDIS"];

const mockOutstandingInvoices = [
  {
    number: "TRR-006299",
    client: "Alex Anders",
    practitioner: "Franky Lu",
    issueDate: "10 Mar 2026",
    dueDate: "10 Mar 2026",
    due: 148.71,
  },
  {
    number: "TRR-006295",
    client: "Skyler Peterson",
    practitioner: "Franky Lu",
    issueDate: "6 Mar 2026",
    dueDate: "6 Mar 2026",
    due: 110.0,
  },
  {
    number: "TRR-006296",
    client: "Skyler Peterson",
    practitioner: "Franky Lu",
    issueDate: "6 Mar 2026",
    dueDate: "6 Mar 2026",
    due: 110.0,
  },
  {
    number: "TRR-006280",
    client: "A Jr",
    practitioner: "Franky Lu",
    issueDate: "27 Feb 2026",
    dueDate: "27 Feb 2026",
    due: 110.0,
  },
  {
    number: "TRR-006279",
    client: "A Jr",
    practitioner: "Franky Lu",
    issueDate: "25 Feb 2026",
    dueDate: "25 Feb 2026",
    due: 148.71,
  },
];

export default function NewPaymentPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("17 Mar 2026");
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");
  const [invoiceAmounts, setInvoiceAmounts] = useState<Record<string, string>>({});
  const [linkedInvoices, setLinkedInvoices] = useState<string[]>([]);
  const [showLinkSearch, setShowLinkSearch] = useState(false);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [view, setView] = useState<"form" | "receipt">("form");
  const [paymentNumber] = useState("PAY-003871");

  const clientOptions = mockClients.map((c) => ({ label: c, value: c }));

  // Filter invoices by selected client (if any) and exclude already linked
  const availableInvoices = mockOutstandingInvoices.filter((inv) => {
    if (linkedInvoices.includes(inv.number)) return true; // already linked, keep showing
    if (!invoiceSearch) return !linkedInvoices.includes(inv.number);
    const q = invoiceSearch.toLowerCase();
    return (
      !linkedInvoices.includes(inv.number) &&
      (inv.number.toLowerCase().includes(q) || inv.client.toLowerCase().includes(q))
    );
  });

  const searchableInvoices = mockOutstandingInvoices.filter((inv) => {
    if (linkedInvoices.includes(inv.number)) return false;
    if (!invoiceSearch) return true;
    const q = invoiceSearch.toLowerCase();
    return inv.number.toLowerCase().includes(q) || inv.client.toLowerCase().includes(q);
  });

  const appliedTotal = linkedInvoices.reduce((sum, num) => {
    const val = parseFloat(invoiceAmounts[num] || "0");
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const totalAmount = parseFloat(amount) || 0;
  const creditAmount = Math.max(0, totalAmount - appliedTotal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView("receipt");
  };

  const linkInvoice = (invoiceNumber: string) => {
    const inv = mockOutstandingInvoices.find((i) => i.number === invoiceNumber);
    if (inv) {
      setLinkedInvoices((prev) => [...prev, invoiceNumber]);
      setInvoiceAmounts((prev) => ({ ...prev, [invoiceNumber]: inv.due.toFixed(2) }));
      setInvoiceSearch("");
      setShowLinkSearch(false);
    }
  };

  const unlinkInvoice = (invoiceNumber: string) => {
    setLinkedInvoices((prev) => prev.filter((n) => n !== invoiceNumber));
    setInvoiceAmounts((prev) => {
      const next = { ...prev };
      delete next[invoiceNumber];
      return next;
    });
  };

  if (view === "receipt") {
    return (
      <FormPage
        title="Payment receipt"
        backHref="/payments"
        maxWidth={512}
        actions={
          <>
            <Button onClick={() => window.print()}>
              <PrinterOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
              Print receipt
            </Button>
            <Link href="/payments">
              <Button type="primary">Done</Button>
            </Link>
          </>
        }
        style={{ minHeight: 'calc(100vh - 3rem)' }}
      >
          <Card padding="lg" style={{ textAlign: 'center' }}>
            <Flex justify="center" style={{ marginBottom: 16 }}>
              <Flex
                align="center"
                justify="center"
                style={{ height: 56, width: 56, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)' }}
              >
                <CheckCircleOutlined style={{ fontSize: 32, color: 'var(--ant-color-success, #00C269)' }} />
              </Flex>
            </Flex>
            <Text variant="heading/lg" style={{ marginBottom: 4 }}>Payment recorded</Text>
            <Text variant="body/md" color="secondary" style={{ marginBottom: 24 }}>
              Payment has been successfully added.
            </Text>

            <Flex vertical gap={12} style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, textAlign: 'left' }}>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" as="span" color="secondary">Payment number</Text>
                <Text variant="label/lg" as="span" color="primary">{paymentNumber}</Text>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" as="span" color="secondary">Date</Text>
                <Text variant="label/lg" as="span">{paymentDate}</Text>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" as="span" color="secondary">Client</Text>
                <Text variant="label/lg" as="span">{client || "—"}</Text>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" as="span" color="secondary">Amount</Text>
                <Text variant="label/lg" as="span">${parseFloat(amount || "0").toFixed(2)}</Text>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" as="span" color="secondary">Method</Text>
                <Text variant="label/lg" as="span">{method || "—"}</Text>
              </Flex>
              {linkedInvoices.length > 0 && (
                <Flex align="center" justify="space-between">
                  <Text variant="body/md" as="span" color="secondary">Applied to</Text>
                  <Text variant="label/lg" as="span">
                    {linkedInvoices.length} invoice{linkedInvoices.length !== 1 ? "s" : ""}
                  </Text>
                </Flex>
              )}
              {note && (
                <Flex align="start" justify="space-between">
                  <Text variant="body/md" as="span" color="secondary">Note</Text>
                  <Text variant="label/lg" as="span" style={{ maxWidth: 200, textAlign: 'right' }}>{note}</Text>
                </Flex>
              )}
            </Flex>
          </Card>
      </FormPage>
    );
  }

  return (
    <FormPage
      title="Add payment"
      actions={
        <>
          <Link href="/payments">
            <Button style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
              Cancel
            </Button>
          </Link>
          <Button type="primary" onClick={handleSubmit}>
            Add
          </Button>
        </>
      }
      style={{ minHeight: 'calc(100vh - 3rem)' }}
    >
      <Form form={form} layout="vertical">
        {/* Client field — own row */}
        <div style={{ marginBottom: 24 }}>
          <Form.Item label="Client *" style={{ maxWidth: 360 }}>
            <Select
              options={clientOptions}
              value={client}
              onChange={setClient}
              placeholder="Start typing to search client"
              showSearch={true}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>

        {/* 4-field row */}
        <Grid cols={4} gap="md" style={{ marginBottom: 32 }}>
          {/* Location */}
          <Form.Item label="Location *">
            <Select
              value=""
              onChange={() => {}}
              options={[
                { value: "", label: "Select location" },
                { value: "east-clinics", label: "East Clinics" },
                { value: "splose-ot", label: "Splose OT" },
                { value: "tasks", label: "Tasks" },
              ]}
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* Payment date */}
          <Form.Item label="Payment date *">
            <Input value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
          </Form.Item>

          {/* Payment method */}
          <Form.Item label="Payment method *">
            <Select
              value={method}
              onChange={setMethod}
              options={[{ value: "", label: "Select method" }, ...paymentMethods.map((m) => ({ value: m, label: m }))]}
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* Amount */}
          <Form.Item label="Amount *">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Item>
        </Grid>
      </Form>

        {/* Apply to outstanding invoices */}
        <Text variant="label/lg" as="p" style={{ marginBottom: 12 }}>Apply to outstanding invoices</Text>

        {showLinkSearch && (
          <Card padding="sm" style={{ marginBottom: 12 }}>
            <div style={{ position: 'relative' }}>
              <SearchOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)', position: 'absolute', top: '50%', left: 12, zIndex: 10, transform: 'translateY(-50%)' }} />
              <Input
                type="text"
                placeholder="Search invoices by number or client..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                style={{ height: 36, paddingLeft: 40 }}
                autoFocus
              />
            </div>
            {searchableInvoices.length > 0 && (
              <div style={{ marginTop: 8, maxHeight: 160, overflowY: 'auto', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                {searchableInvoices.map((inv) => (
                  <Button
                    key={inv.number}
                    type="text"
                    htmlType="button"
                    onClick={() => linkInvoice(inv.number)}
                    style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', fontSize: 14 }}
                  >
                    <Flex align="center" gap={16}>
                      <Text variant="label/lg" as="span" color="primary">{inv.number}</Text>
                      <Text variant="body/md" as="span">{inv.client}</Text>
                      <Text variant="body/md" as="span" color="secondary">{inv.practitioner}</Text>
                    </Flex>
                    <Text variant="label/lg" as="span">${inv.due.toFixed(2)}</Text>
                  </Button>
                ))}
              </div>
            )}
            {searchableInvoices.length === 0 && (
              <Text variant="body/md" as="p" color="secondary" style={{ marginTop: 8 }}>No outstanding invoices found.</Text>
            )}
          </Card>
        )}

        <div style={{ marginBottom: 24 }}>
          {(() => {
            type OutstandingInvoice = typeof mockOutstandingInvoices[number];
            const linkedInvoiceData = linkedInvoices
              .map((num) => mockOutstandingInvoices.find((i) => i.number === num))
              .filter((inv): inv is OutstandingInvoice => inv !== undefined);

            const linkedInvoiceColumns: ColumnsType<OutstandingInvoice> = [
              { key: "number", title: "Invoice #", render: (_, inv) => <Text variant="label/lg" as="span" color="primary">{inv.number}</Text> },
              { key: "client", title: "Client", dataIndex: "client" },
              { key: "practitioner", title: "Practitioner", dataIndex: "practitioner" },
              { key: "issueDate", title: "Issue date", render: (_, inv) => <Text variant="body/md" as="span" color="secondary">{inv.issueDate}</Text> },
              { key: "dueDate", title: "Due date", render: (_, inv) => <Text variant="body/md" as="span" color="secondary">{inv.dueDate}</Text> },
              { key: "due", title: "Due", align: "right" as const, render: (_, inv) => inv.due.toFixed(2) },
              {
                key: "amount",
                title: "Amount",
                align: "right" as const,
                render: (_, inv) => (
                  <Input
                    type="text"
                    value={invoiceAmounts[inv.number] || ""}
                    onChange={(e) => setInvoiceAmounts((prev) => ({ ...prev, [inv.number]: e.target.value }))}
                    style={{ width: 96, borderRadius: 4, border: "1px solid var(--color-border)", padding: "4px 8px", textAlign: "right", fontSize: 14 }}
                  />
                ),
              },
              {
                key: "remaining",
                title: "Remaining",
                align: "right" as const,
                render: (_, inv) => {
                  const appliedAmount = parseFloat(invoiceAmounts[inv.number] || "0") || 0;
                  return Math.max(0, inv.due - appliedAmount).toFixed(2);
                },
              },
              {
                key: "unlink",
                title: "",
                render: (_, inv) => (
                  <Button
                    type="text"
                    size="small"
                    htmlType="button"
                    onClick={() => unlinkInvoice(inv.number)}
                    style={{ height: 24, width: 24 }}
                  >
                    <CloseOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
                  </Button>
                ),
              },
            ];

            return (
              <Table
                columns={linkedInvoiceColumns}
                dataSource={linkedInvoiceData}
                rowKey="number"
                pagination={false}
                locale={{ emptyText: <EmptyState message="No outstanding invoices" style={{ padding: "24px 0" }} /> }}
              />
            );
          })()}
        </div>

        {/* Note and totals */}
        <Flex align="start" justify="space-between">
          <Form form={form} layout="vertical">
            <Form.Item label="Note" style={{ width: 256 }}>
              <Input.TextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder=""
                style={{ resize: 'none', fontSize: 14 }}
                rows={3}
              />
            </Form.Item>
          </Form>
          <Flex vertical gap={6} style={{ textAlign: 'right' }}>
            <Flex align="center" justify="end" gap={32}>
              <Text variant="body/md" as="span" color="secondary">Applied to invoices</Text>
              <Text variant="label/lg" as="span" style={{ width: 80, textAlign: 'right' }}>{appliedTotal.toFixed(2)}</Text>
            </Flex>
            <Flex align="center" justify="end" gap={32}>
              <Text variant="body/md" as="span" color="secondary">Amount to credit</Text>
              <Text variant="label/lg" as="span" style={{ width: 80, textAlign: 'right' }}>{creditAmount.toFixed(2)}</Text>
            </Flex>
          </Flex>
        </Flex>
    </FormPage>
  );
}
