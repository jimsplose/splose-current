"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Plus, Search, ChevronDown } from "lucide-react";

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

const paymentMethods = [
  "Cash",
  "Credit card",
  "Direct deposit",
  "EFTPOS",
  "Medicare",
  "NDIS",
];

const mockOutstandingInvoices = [
  { number: "TRR-006299", client: "Alex Anders", practitioner: "Franky Lu", issueDate: "10 Mar 2026", dueDate: "10 Mar 2026", due: 148.71 },
  { number: "TRR-006295", client: "Skyler Peterson", practitioner: "Franky Lu", issueDate: "6 Mar 2026", dueDate: "6 Mar 2026", due: 110.00 },
  { number: "TRR-006296", client: "Skyler Peterson", practitioner: "Franky Lu", issueDate: "6 Mar 2026", dueDate: "6 Mar 2026", due: 110.00 },
  { number: "TRR-006280", client: "A Jr", practitioner: "Franky Lu", issueDate: "27 Feb 2026", dueDate: "27 Feb 2026", due: 110.00 },
  { number: "TRR-006279", client: "A Jr", practitioner: "Franky Lu", issueDate: "25 Feb 2026", dueDate: "25 Feb 2026", due: 148.71 },
];

export default function NewPaymentPage() {
  const router = useRouter();
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("17 Mar 2026");
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [invoiceAmounts, setInvoiceAmounts] = useState<Record<string, string>>({});
  const [linkedInvoices, setLinkedInvoices] = useState<string[]>([]);
  const [showLinkSearch, setShowLinkSearch] = useState(false);
  const [invoiceSearch, setInvoiceSearch] = useState("");

  const filteredClients = mockClients.filter((c) =>
    c.toLowerCase().includes(clientSearch.toLowerCase())
  );

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
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/payments"
            className="flex items-center text-text-secondary hover:text-text transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-text">New payment</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/payments"
            className="rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-purple-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl p-8">
        {/* Payment details row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Client / From */}
          <div className="lg:col-span-1">
            <label className="mb-1 block text-sm font-medium text-text">
              Client / From <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
                className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-white px-3 text-sm text-left outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <span className={client ? "text-text" : "text-text-secondary"}>
                  {client || "Select client"}
                </span>
                <ChevronDown className="h-4 w-4 text-text-secondary" />
              </button>
              {clientDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-white shadow-lg">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary" />
                      <input
                        type="text"
                        placeholder="Search clients..."
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="h-8 w-full rounded border border-border bg-white pl-8 pr-3 text-sm outline-none focus:border-primary"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredClients.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setClient(c);
                          setClientDropdownOpen(false);
                          setClientSearch("");
                        }}
                        className={`flex w-full items-center px-3 py-2 text-sm hover:bg-purple-50 transition-colors ${client === c ? "bg-purple-50 text-primary font-medium" : "text-text"}`}
                      >
                        {c}
                      </button>
                    ))}
                    {filteredClients.length === 0 && (
                      <div className="px-3 py-2 text-sm text-text-secondary">No clients found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text">
              Payment date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Payment method */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text">
              Payment method <span className="text-red-500">*</span>
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="" disabled>Select method</option>
              {paymentMethods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-white pl-7 pr-3 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Apply to outstanding invoices */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-text">Apply to outstanding invoices</p>
          <button
            type="button"
            onClick={() => setShowLinkSearch(!showLinkSearch)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Link invoice
          </button>
        </div>

        {showLinkSearch && (
          <div className="mb-3 rounded-lg border border-border bg-white p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search invoices by number or client..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>
            {searchableInvoices.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-border divide-y divide-border">
                {searchableInvoices.map((inv) => (
                  <button
                    key={inv.number}
                    type="button"
                    onClick={() => linkInvoice(inv.number)}
                    className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-primary font-medium">{inv.number}</span>
                      <span className="text-text">{inv.client}</span>
                      <span className="text-text-secondary">{inv.practitioner}</span>
                    </div>
                    <span className="text-text font-medium">${inv.due.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
            {searchableInvoices.length === 0 && (
              <p className="mt-2 text-sm text-text-secondary">No outstanding invoices found.</p>
            )}
          </div>
        )}

        <div className="rounded-lg border border-border bg-white overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="px-4 py-2.5 text-left text-sm font-medium text-text">Invoice #</th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-text">Client</th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-text">Practitioner</th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-text">Issue date</th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-text">Due date</th>
                <th className="px-4 py-2.5 text-right text-sm font-medium text-text">Due</th>
                <th className="px-4 py-2.5 text-right text-sm font-medium text-text">Amount</th>
                <th className="px-4 py-2.5 text-right text-sm font-medium text-text">Remaining</th>
                <th className="w-10 px-2 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {linkedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-sm text-text-secondary">
                    No invoices linked. Click &quot;Link invoice&quot; to apply this payment to outstanding invoices.
                  </td>
                </tr>
              ) : (
                linkedInvoices.map((invoiceNumber) => {
                  const inv = mockOutstandingInvoices.find((i) => i.number === invoiceNumber);
                  if (!inv) return null;
                  const appliedAmount = parseFloat(invoiceAmounts[invoiceNumber] || "0") || 0;
                  const remaining = Math.max(0, inv.due - appliedAmount);
                  return (
                    <tr key={inv.number} className="border-b border-border hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-primary font-medium">{inv.number}</td>
                      <td className="px-4 py-3 text-sm text-text">{inv.client}</td>
                      <td className="px-4 py-3 text-sm text-text">{inv.practitioner}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{inv.issueDate}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{inv.dueDate}</td>
                      <td className="px-4 py-3 text-right text-sm text-text">{inv.due.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="text"
                          value={invoiceAmounts[invoiceNumber] || ""}
                          onChange={(e) =>
                            setInvoiceAmounts((prev) => ({ ...prev, [invoiceNumber]: e.target.value }))
                          }
                          className="w-24 rounded border border-border bg-white px-2 py-1 text-right text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-text">{remaining.toFixed(2)}</td>
                      <td className="px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => unlinkInvoice(invoiceNumber)}
                          className="flex h-6 w-6 items-center justify-center rounded text-text-secondary hover:text-danger hover:bg-red-50 transition-colors"
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
              className="w-64 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              rows={3}
            />
          </div>
          <div className="text-sm space-y-1.5 text-right">
            <div className="flex items-center justify-end gap-8">
              <span className="text-text-secondary">Applied to invoices</span>
              <span className="text-text font-medium w-20 text-right">{appliedTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-end gap-8">
              <span className="text-text-secondary">Amount to credit</span>
              <span className="text-text font-medium w-20 text-right">{creditAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
