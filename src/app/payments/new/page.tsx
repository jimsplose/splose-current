"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CloseOutlined, PlusOutlined, SearchOutlined, PrinterOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Button, Card, DataTable, FormInput, FormSelect, FormTextarea, Navbar, Select, TableHead, Th, TableBody, Td, EmptyState } from "@/components/ds";

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
      <div style={{ minHeight: 'calc(100vh - 3rem)' }}>
        <Navbar backHref="/payments" title="Payment receipt">
          <Button variant="secondary" onClick={() => window.print()}>
            <PrinterOutlined style={{ fontSize: 16 }} />
            Print receipt
          </Button>
          <Link href="/payments">
            <Button variant="primary">Done</Button>
          </Link>
        </Navbar>

        <div style={{ maxWidth: 512, margin: '0 auto', padding: 32 }}>
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
            <h2 className="text-heading-lg" style={{ marginBottom: 4 }}>Payment recorded</h2>
            <p className="text-body-md" style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
              Payment has been successfully added.
            </p>

            <Flex vertical gap={12} style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, textAlign: 'left' }}>
              <Flex align="center" justify="space-between">
                <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Payment number</span>
                <span className="text-label-lg" style={{ color: 'var(--color-primary)' }}>{paymentNumber}</span>
              </Flex>
              <Flex align="center" justify="space-between">
                <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Date</span>
                <span className="text-label-lg">{paymentDate}</span>
              </Flex>
              <Flex align="center" justify="space-between">
                <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Client</span>
                <span className="text-label-lg">{client || "—"}</span>
              </Flex>
              <Flex align="center" justify="space-between">
                <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Amount</span>
                <span className="text-label-lg">${parseFloat(amount || "0").toFixed(2)}</span>
              </Flex>
              <Flex align="center" justify="space-between">
                <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Method</span>
                <span className="text-label-lg">{method || "—"}</span>
              </Flex>
              {linkedInvoices.length > 0 && (
                <Flex align="center" justify="space-between">
                  <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Applied to</span>
                  <span className="text-label-lg">
                    {linkedInvoices.length} invoice{linkedInvoices.length !== 1 ? "s" : ""}
                  </span>
                </Flex>
              )}
              {note && (
                <Flex align="start" justify="space-between">
                  <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Note</span>
                  <span className="text-label-lg" style={{ maxWidth: 200, textAlign: 'right' }}>{note}</span>
                </Flex>
              )}
            </Flex>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 3rem)' }}>
      <Navbar backHref="/payments" title="Add payment">
        <Link href="/payments">
          <Button variant="secondary" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
            Cancel
          </Button>
        </Link>
        <Button variant="primary" onClick={handleSubmit}>
          Add
        </Button>
      </Navbar>

      <div style={{ maxWidth: 1024, margin: '0 auto', padding: 32 }}>
        {/* Payment details row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 32 }}>
          {/* Client / From */}
          <Select
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
            <label className="text-label-lg" style={{ display: 'block', marginBottom: 4, color: 'var(--color-text-secondary)' }}>
              Amount <span style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: 12, zIndex: 10, transform: 'translateY(-50%)', fontSize: 14, color: 'var(--color-text-secondary)' }}>$</span>
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
        </div>

        {/* Apply to outstanding invoices */}
        <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
          <p className="text-label-lg">Apply to outstanding invoices</p>
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
                      <span style={{ fontWeight: 500, color: 'var(--color-primary)' }}>{inv.number}</span>
                      <span>{inv.client}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{inv.practitioner}</span>
                    </Flex>
                    <span style={{ fontWeight: 500 }}>${inv.due.toFixed(2)}</span>
                  </Button>
                ))}
              </div>
            )}
            {searchableInvoices.length === 0 && (
              <p style={{ marginTop: 8, fontSize: 14, color: 'var(--color-text-secondary)' }}>No outstanding invoices found.</p>
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
                      <Td style={{ fontWeight: 500, color: 'var(--color-primary)' }}>{inv.number}</Td>
                      <Td>{inv.client}</Td>
                      <Td>{inv.practitioner}</Td>
                      <Td style={{ color: 'var(--color-text-secondary)' }}>{inv.issueDate}</Td>
                      <Td style={{ color: 'var(--color-text-secondary)' }}>{inv.dueDate}</Td>
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
          <Flex vertical gap={6} style={{ textAlign: 'right', fontSize: 14 }}>
            <Flex align="center" justify="end" gap={32}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Applied to invoices</span>
              <span style={{ width: 80, textAlign: 'right', fontWeight: 500 }}>{appliedTotal.toFixed(2)}</span>
            </Flex>
            <Flex align="center" justify="end" gap={32}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Amount to credit</span>
              <span style={{ width: 80, textAlign: 'right', fontWeight: 500 }}>{creditAmount.toFixed(2)}</span>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
