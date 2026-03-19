"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Plus, Search } from "lucide-react";
import { Button, FormInput, FormSelect, Navbar, Select, TableHead, Th, TableBody, Td, EmptyState } from "@/components/ds";

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
    router.push("/payments");
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

  return (
    <div className="min-h-[calc(100vh-3rem)]">
      <Navbar backHref="/payments" title="New payment">
        <Link href="/payments">
          <Button variant="secondary" className="border-primary text-primary hover:bg-purple-50">
            Cancel
          </Button>
        </Link>
        <Button variant="primary" onClick={handleSubmit}>
          Add
        </Button>
      </Navbar>

      <div className="mx-auto max-w-5xl p-8">
        {/* Payment details row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Client / From */}
          <Select
            label="Client / From *"
            options={clientOptions}
            value={client}
            onChange={setClient}
            placeholder="Select client"
            searchable
          />

          {/* Payment date */}
          <FormInput label="Payment date *" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />

          {/* Payment method */}
          <FormSelect
            label="Payment method *"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            options={[{ value: "", label: "Select method" }, ...paymentMethods.map((m) => ({ value: m, label: m }))]}
          />

          {/* Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-text-secondary">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-border bg-white py-2 pr-3 pl-7 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Apply to outstanding invoices */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-text">Apply to outstanding invoices</p>
          <Button variant="secondary" size="sm" onClick={() => setShowLinkSearch(!showLinkSearch)}>
            <Plus className="h-3.5 w-3.5" />
            Link invoice
          </Button>
        </div>

        {showLinkSearch && (
          <div className="mb-3 rounded-lg border border-border bg-white p-3">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search invoices by number or client..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-white pr-4 pl-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>
            {searchableInvoices.length > 0 && (
              <div className="mt-2 max-h-40 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                {searchableInvoices.map((inv) => (
                  <button
                    key={inv.number}
                    type="button"
                    onClick={() => linkInvoice(inv.number)}
                    className="flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-purple-50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-primary">{inv.number}</span>
                      <span className="text-text">{inv.client}</span>
                      <span className="text-text-secondary">{inv.practitioner}</span>
                    </div>
                    <span className="font-medium text-text">${inv.due.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
            {searchableInvoices.length === 0 && (
              <p className="mt-2 text-sm text-text-secondary">No outstanding invoices found.</p>
            )}
          </div>
        )}

        <div className="mb-6 overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full">
            <TableHead>
              <Th>Invoice #</Th>
              <Th>Client</Th>
              <Th>Practitioner</Th>
              <Th>Issue date</Th>
              <Th>Due date</Th>
              <Th align="right">Due</Th>
              <Th align="right">Amount</Th>
              <Th align="right">Remaining</Th>
              <Th className="w-10" />
            </TableHead>
            <tbody>
              {linkedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState message='No invoices linked. Click "Link invoice" to apply this payment to outstanding invoices.' className="py-6" />
                  </td>
                </tr>
              ) : (
                linkedInvoices.map((invoiceNumber) => {
                  const inv = mockOutstandingInvoices.find((i) => i.number === invoiceNumber);
                  if (!inv) return null;
                  const appliedAmount = parseFloat(invoiceAmounts[invoiceNumber] || "0") || 0;
                  const remaining = Math.max(0, inv.due - appliedAmount);
                  return (
                    <tr key={inv.number} className="border-b border-border transition-colors hover:bg-gray-50">
                      <Td className="font-medium text-primary">{inv.number}</Td>
                      <Td className="text-text">{inv.client}</Td>
                      <Td className="text-text">{inv.practitioner}</Td>
                      <Td className="text-text-secondary">{inv.issueDate}</Td>
                      <Td className="text-text-secondary">{inv.dueDate}</Td>
                      <Td align="right" className="text-text">
                        {inv.due.toFixed(2)}
                      </Td>
                      <Td align="right">
                        <input
                          type="text"
                          value={invoiceAmounts[invoiceNumber] || ""}
                          onChange={(e) => setInvoiceAmounts((prev) => ({ ...prev, [invoiceNumber]: e.target.value }))}
                          className="w-24 rounded border border-border bg-white px-2 py-1 text-right text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </Td>
                      <Td align="right" className="text-text">
                        {remaining.toFixed(2)}
                      </Td>
                      <td className="px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => unlinkInvoice(invoiceNumber)}
                          className="flex h-6 w-6 items-center justify-center rounded text-text-secondary transition-colors hover:bg-red-50 hover:text-danger"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Note and totals */}
        <div className="flex items-start justify-between">
          <div>
            <label className="mb-1 block text-sm font-bold text-text">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional payment note..."
              className="w-64 resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              rows={3}
            />
          </div>
          <div className="space-y-1.5 text-right text-sm">
            <div className="flex items-center justify-end gap-8">
              <span className="text-text-secondary">Applied to invoices</span>
              <span className="w-20 text-right font-medium text-text">{appliedTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-end gap-8">
              <span className="text-text-secondary">Amount to credit</span>
              <span className="w-20 text-right font-medium text-text">{creditAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
