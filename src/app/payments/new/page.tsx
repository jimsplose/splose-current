"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CloseOutlined, PlusOutlined, SearchOutlined, PrinterOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Button, Card, DataTable, Divider, FormInput, FormPage, FormSelect, FormTextarea, Grid, TableHead, Th, TableBody, Td, EmptyState, Text } from "@/components/ds";

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
            <Button variant="secondary" onClick={() => window.print()}>
              <PrinterOutlined style={{ fontSize: 16 }} />
              Print receipt
            </Button>
            <Link href="/payments">
              <Button variant="primary">Done</Button>
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
                <CheckCircleOutlined style={{ fontSize: 32, color: 'var(--color-success)' }} />
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
      backHref="/payments"
      actions={
        <>
          <Link href="/payments">
            <Button variant="secondary" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
              Cancel
            </Button>
          </Link>
          <Button variant="primary" onClick={handleSubmit}>
            Add
          </Button>
        </>
      }
      style={{ minHeight: 'calc(100vh - 3rem)' }}
    >
        {/* Payment details row */}
        <Grid cols={4} gap="md" style={{ marginBottom: 32, gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {/* Client / From */}
          <FormSelect
            label="Client / From *"
            options={clientOptions}
            value={client}
            onChange={setClient}
            placeholder="Select client"
            searchable
          />

          {/* Location */}
          <FormSelect
            label="Location *"
            value=""
            onChange={() => {}}
            options={[
              { value: "", label: "Select location" },
              { value: "east-clinics", label: "East Clinics" },
              { value: "splose-ot", label: "Splose OT" },
              { value: "tasks", label: "Tasks" },
            ]}
          />

          {/* Payment date */}
          <FormInput label="Payment date *" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />

          {/* Payment method */}
          <FormSelect
            label="Payment method *"
            value={method}
            onChange={setMethod}
            options={[{ value: "", label: "Select method" }, ...paymentMethods.map((m) => ({ value: m, label: m }))]}
          />

          {/* Amount */}
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: 'rgb(34, 34, 34)' }}>
              Amount <span style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Text variant="body/md" as="span" color="secondary" style={{ position: 'absolute', top: '50%', left: 12, zIndex: 10, transform: 'translateY(-50%)' }}>$</Text>
              <FormInput
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ paddingLeft: 28 }}
              />
            </div>
          </div>
        </Grid>

        {/* Apply to outstanding invoices */}
        <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
          <Text variant="label/lg" as="p">Apply to outstanding invoices</Text>
          <Button variant="secondary" size="sm" onClick={() => setShowLinkSearch(!showLinkSearch)}>
            <PlusOutlined style={{ fontSize: 14 }} />
            Link invoice
          </Button>
        </Flex>

        {showLinkSearch && (
          <Card padding="sm" style={{ marginBottom: 12 }}>
            <div style={{ position: 'relative' }}>
              <SearchOutlined style={{ position: 'absolute', top: '50%', left: 12, zIndex: 10, fontSize: 16, transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
              <FormInput
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
                    variant="ghost"
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

        <Card padding="none" style={{ marginBottom: 24, overflow: 'hidden' }}>
          <DataTable>
            <TableHead>
              <Th>Invoice #</Th>
              <Th>Client</Th>
              <Th>Practitioner</Th>
              <Th>Issue date</Th>
              <Th>Due date</Th>
              <Th align="right">Due</Th>
              <Th align="right">Amount</Th>
              <Th align="right">Remaining</Th>
              <Th style={{ width: 40 }} />
            </TableHead>
            <tbody>
              {linkedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState message='No invoices linked. Click "Link invoice" to apply this payment to outstanding invoices.' style={{ padding: '24px 0' }} />
                  </td>
                </tr>
              ) : (
                linkedInvoices.map((invoiceNumber) => {
                  const inv = mockOutstandingInvoices.find((i) => i.number === invoiceNumber);
                  if (!inv) return null;
                  const appliedAmount = parseFloat(invoiceAmounts[invoiceNumber] || "0") || 0;
                  const remaining = Math.max(0, inv.due - appliedAmount);
                  return (
                    <tr key={inv.number} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.2s' }}>
                      <Td><Text variant="label/lg" as="span" color="primary">{inv.number}</Text></Td>
                      <Td>{inv.client}</Td>
                      <Td>{inv.practitioner}</Td>
                      <Td><Text variant="body/md" as="span" color="secondary">{inv.issueDate}</Text></Td>
                      <Td><Text variant="body/md" as="span" color="secondary">{inv.dueDate}</Text></Td>
                      <Td align="right">
                        {inv.due.toFixed(2)}
                      </Td>
                      <Td align="right">
                        <FormInput
                          type="text"
                          value={invoiceAmounts[invoiceNumber] || ""}
                          onChange={(e) => setInvoiceAmounts((prev) => ({ ...prev, [invoiceNumber]: e.target.value }))}
                          style={{ width: 96, borderRadius: 4, border: '1px solid var(--color-border)', padding: '4px 8px', textAlign: 'right', fontSize: 14 }}
                        />
                      </Td>
                      <Td align="right">
                        {remaining.toFixed(2)}
                      </Td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <Button
                          variant="icon"
                          size="sm"
                          htmlType="button"
                          onClick={() => unlinkInvoice(invoiceNumber)}
                          style={{ height: 24, width: 24 }}
                        >
                          <CloseOutlined style={{ fontSize: 14 }} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </DataTable>
        </Card>

        {/* Note and totals */}
        <Flex align="start" justify="space-between">
          <FormTextarea
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional payment note..."
            style={{ width: 256, resize: 'none', fontSize: 14 }}
            rows={3}
          />
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
