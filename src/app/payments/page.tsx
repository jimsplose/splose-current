"use client";

import { useState } from "react";
import { Plus, ArrowUpDown, Filter } from "lucide-react";

const mockPayments = [
  { id: "1", reference: "MYDD-01051", from: "Skyler Peterson", amount: 110.00, date: "6 Mar 2026", type: "", invoices: [{ number: "TRR-006295", amount: 110.00, date: "Fri 6 Mar 2026" }] },
  { id: "2", reference: "MYDD-01052", from: "Skyler Peterson", amount: 110.00, date: "6 Mar 2026", type: "", invoices: [{ number: "TRR-006296", amount: 110.00, date: "Fri 6 Mar 2026" }] },
  { id: "3", reference: "MYDD-01053", from: "Skyler Peterson", amount: 212.30, date: "6 Mar 2026", type: "", invoices: [{ number: "TRR-006297", amount: 212.30, date: "Fri 6 Mar 2026" }] },
  { id: "4", reference: "MYDD-01048", from: "elsa frozen", amount: 35.00, date: "4 Mar 2026", type: "Credit", invoices: [] },
  { id: "5", reference: "MYDD-01046", from: "A Jr", amount: 110.00, date: "27 Feb 2026", type: "", invoices: [{ number: "TRR-006280", amount: 110.00, date: "Thu 27 Feb 2026" }] },
  { id: "6", reference: "MYDD-01045", from: "A Jr", amount: 148.71, date: "25 Feb 2026", type: "", invoices: [{ number: "TRR-006279", amount: 148.71, date: "Tue 25 Feb 2026" }] },
  { id: "7", reference: "MYDD-01042", from: "rakesh soni", amount: 110.00, date: "24 Feb 2026", type: "Credit", invoices: [] },
  { id: "8", reference: "MYDD-01044", from: "rakesh soni", amount: 2000.00, date: "24 Feb 2026", type: "Credit", invoices: [] },
  { id: "9", reference: "MYDD-01043", from: "rakesh soni", amount: 1000.00, date: "24 Feb 2026", type: "Credit", invoices: [] },
  { id: "10", reference: "MYDD-01041", from: "A test", amount: 100.00, date: "23 Feb 2026", type: "Credit", invoices: [] },
];

export default function PaymentsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Payments</h1>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          <Plus className="h-4 w-4" />
          New payment
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for recipient name and payment number"
          className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Search
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  Payment #
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  <Filter className="h-3 w-3 text-text-secondary" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">From</th>
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
            {mockPayments.map((payment) => (
              <>
                <tr
                  key={payment.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => {
                    if (payment.invoices.length > 0) {
                      setExpandedId(expandedId === payment.id ? null : payment.id);
                    }
                  }}
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {payment.invoices.length > 0 ? (
                        <span className="text-text-secondary font-medium">
                          {expandedId === payment.id ? "−" : "+"}
                        </span>
                      ) : (
                        <span className="w-3" />
                      )}
                      <span className="text-text">{payment.reference}</span>
                      {payment.type && (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                          {payment.type}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-primary">{payment.from}</td>
                  <td className="px-4 py-3 text-right text-sm text-text">
                    {payment.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-text-secondary">{payment.date}</td>
                </tr>
                {expandedId === payment.id && payment.invoices.length > 0 && (
                  <tr key={`${payment.id}-expanded`}>
                    <td colSpan={4} className="bg-gray-50 px-12 py-2">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="py-2 text-left text-sm font-medium text-text">Invoice #</th>
                            <th className="py-2 text-right text-sm font-medium text-text">Amount</th>
                            <th className="py-2 text-right text-sm font-medium text-text">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payment.invoices.map((inv) => (
                            <tr key={inv.number}>
                              <td className="py-2 text-sm text-primary">{inv.number}</td>
                              <td className="py-2 text-right text-sm text-text">{inv.amount.toFixed(2)}</td>
                              <td className="py-2 text-right text-sm text-text-secondary">{inv.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-10 of 608 items</span>
          <div className="ml-4 flex items-center gap-1">
            <span className="text-text-secondary">&lt;</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
              1
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50">2</button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50">3</button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50">4</button>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50">5</button>
            <span className="text-text-secondary">...</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-white text-xs font-medium text-text-secondary hover:bg-gray-50">61</button>
            <span className="text-text-secondary">&gt;</span>
          </div>
          <span className="ml-4">10 / page</span>
        </div>
      </div>
    </div>
  );
}
