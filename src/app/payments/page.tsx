"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { Plus, ArrowUpDown, Filter, ChevronRight, Minus, Search } from "lucide-react";

const mockPayments = [
  { id: "1", reference: "MYDD-01051", from: "Skyler Peterson", amount: 110.00, date: "6 Mar 2026", method: "Card", type: "", invoices: [{ number: "TRR-006295", amount: 110.00, date: "Fri 6 Mar 2026", status: "Paid" }] },
  { id: "2", reference: "MYDD-01052", from: "Skyler Peterson", amount: 110.00, date: "6 Mar 2026", method: "Card", type: "", invoices: [{ number: "TRR-006296", amount: 110.00, date: "Fri 6 Mar 2026", status: "Paid" }] },
  { id: "3", reference: "MYDD-01053", from: "Skyler Peterson", amount: 212.30, date: "6 Mar 2026", method: "Bank Transfer", type: "", invoices: [{ number: "TRR-006297", amount: 212.30, date: "Fri 6 Mar 2026", status: "Paid" }] },
  { id: "4", reference: "MYDD-01048", from: "elsa frozen", amount: 35.00, date: "4 Mar 2026", method: "Cash", type: "Credit", invoices: [] },
  { id: "5", reference: "MYDD-01046", from: "A Jr", amount: 110.00, date: "27 Feb 2026", method: "Card", type: "", invoices: [{ number: "TRR-006280", amount: 110.00, date: "Thu 27 Feb 2026", status: "Paid" }] },
  { id: "6", reference: "MYDD-01045", from: "A Jr", amount: 148.71, date: "25 Feb 2026", method: "Medicare", type: "", invoices: [{ number: "TRR-006279", amount: 148.71, date: "Tue 25 Feb 2026", status: "Paid" }] },
  { id: "7", reference: "MYDD-01042", from: "rakesh soni", amount: 110.00, date: "24 Feb 2026", method: "Card", type: "Credit", invoices: [] },
  { id: "8", reference: "MYDD-01044", from: "rakesh soni", amount: 2000.00, date: "24 Feb 2026", method: "Bank Transfer", type: "Credit", invoices: [] },
  { id: "9", reference: "MYDD-01043", from: "rakesh soni", amount: 1000.00, date: "24 Feb 2026", method: "Cash", type: "Credit", invoices: [] },
  { id: "10", reference: "MYDD-01041", from: "A test", amount: 100.00, date: "23 Feb 2026", method: "Card", type: "Credit", invoices: [] },
];

export default function PaymentsPage() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredPayments = mockPayments.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.reference.toLowerCase().includes(q) ||
      p.from.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Payments</h1>
        <Link
          href="/payments/new"
          className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New payment
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search for recipient name and payment number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50 transition-colors">
          Search
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-purple-50">
                <th className="w-10 px-2 py-3"></th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">
                  <div className="flex items-center gap-1">
                    Payment #
                    <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                    <Filter className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">From</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">Method</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text">Amount</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text">
                  <div className="flex items-center justify-end gap-1">
                    Payment date
                    <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments.map((payment) => {
                const isExpanded = expandedIds.has(payment.id);
                const hasInvoices = payment.invoices.length > 0;

                return (
                  <Fragment key={payment.id}>
                    <tr
                      className={`transition-colors ${hasInvoices ? "cursor-pointer" : ""} hover:bg-gray-50 ${isExpanded ? "bg-purple-50/50" : ""}`}
                      onClick={() => {
                        if (hasInvoices) {
                          toggleExpand(payment.id);
                        }
                      }}
                    >
                      <td className="px-2 py-3 text-center">
                        {hasInvoices ? (
                          <button
                            className="flex h-5 w-5 items-center justify-center rounded text-text-secondary hover:text-text hover:bg-gray-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(payment.id);
                            }}
                          >
                            {isExpanded ? (
                              <Minus className="h-3.5 w-3.5" />
                            ) : (
                              <Plus className="h-3.5 w-3.5" />
                            )}
                          </button>
                        ) : (
                          <span className="inline-block w-5" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-text font-medium">{payment.reference}</span>
                          {payment.type && (
                            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 uppercase">
                              {payment.type}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-primary hover:underline cursor-pointer">
                        {payment.from}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {payment.method}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-text">
                        ${payment.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-text-secondary">
                        {payment.date}
                      </td>
                    </tr>
                    {isExpanded && hasInvoices && (
                      <tr>
                        <td colSpan={6} className="bg-purple-50/30 px-0 py-0">
                          <div className="border-t border-border/50">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-border/50">
                                  <th className="w-10"></th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    Invoice #
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    Method
                                  </th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    Amount
                                  </th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    Date
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {payment.invoices.map((inv) => (
                                  <tr
                                    key={inv.number}
                                    className="border-b border-border/30 last:border-b-0 hover:bg-purple-50/50 transition-colors"
                                  >
                                    <td className="w-10 px-2 py-2 text-center">
                                      <ChevronRight className="h-3 w-3 text-text-secondary mx-auto" />
                                    </td>
                                    <td className="px-4 py-2 text-sm text-primary hover:underline cursor-pointer">
                                      {inv.number}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                        {inv.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-text-secondary">
                                      {payment.method}
                                    </td>
                                    <td className="px-4 py-2 text-right text-sm text-text">
                                      ${inv.amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-right text-sm text-text-secondary">
                                      {inv.date}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-text-secondary">
                    No payments found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-{filteredPayments.length} of 608 items</span>
          <div className="ml-4 flex items-center gap-1">
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50 transition-colors">
              &lt;
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
              1
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50 transition-colors">2</button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50 transition-colors">3</button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50 transition-colors">4</button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50 transition-colors">5</button>
            <span className="px-1 text-text-secondary">...</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50 transition-colors">61</button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50 transition-colors">
              &gt;
            </button>
          </div>
          <span className="ml-4">10 / page</span>
        </div>
      </div>
    </div>
  );
}
