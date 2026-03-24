"use client";

import { Fragment, useState } from "react";
import { Plus, ArrowUpDown, Filter } from "lucide-react";
import { Button, Card, DataTable, PageHeader, SearchBar, TableHead, Th, TableBody, Tr, Td, LinkCell, Pagination, Badge, usePagination } from "@/components/ds";

const mockPayments = [
  {
    id: "1",
    reference: "MYDD-01051",
    from: "Skyler Peterson",
    amount: 110.0,
    date: "6 Mar 2026",
    type: "",
    invoices: [{ number: "TRR-006295", amount: 110.0, date: "Fri 6 Mar 2026" }],
  },
  {
    id: "2",
    reference: "MYDD-01052",
    from: "Skyler Peterson",
    amount: 110.0,
    date: "6 Mar 2026",
    type: "",
    invoices: [{ number: "TRR-006296", amount: 110.0, date: "Fri 6 Mar 2026" }],
  },
  {
    id: "3",
    reference: "MYDD-01053",
    from: "Skyler Peterson",
    amount: 212.3,
    date: "6 Mar 2026",
    type: "",
    invoices: [{ number: "TRR-006297", amount: 212.3, date: "Fri 6 Mar 2026" }],
  },
  {
    id: "4",
    reference: "MYDD-01048",
    from: "elsa frozen",
    amount: 35.0,
    date: "4 Mar 2026",
    type: "Credit",
    invoices: [],
  },
  {
    id: "5",
    reference: "MYDD-01046",
    from: "A Jr",
    amount: 110.0,
    date: "27 Feb 2026",
    type: "",
    invoices: [{ number: "TRR-006280", amount: 110.0, date: "Thu 27 Feb 2026" }],
  },
  {
    id: "6",
    reference: "MYDD-01045",
    from: "A Jr",
    amount: 148.71,
    date: "25 Feb 2026",
    type: "",
    invoices: [{ number: "TRR-006279", amount: 148.71, date: "Tue 25 Feb 2026" }],
  },
  {
    id: "7",
    reference: "MYDD-01042",
    from: "rakesh soni",
    amount: 110.0,
    date: "24 Feb 2026",
    type: "Credit",
    invoices: [],
  },
  {
    id: "8",
    reference: "MYDD-01044",
    from: "rakesh soni",
    amount: 2000.0,
    date: "24 Feb 2026",
    type: "Credit",
    invoices: [],
  },
  {
    id: "9",
    reference: "MYDD-01043",
    from: "rakesh soni",
    amount: 1000.0,
    date: "24 Feb 2026",
    type: "Credit",
    invoices: [],
  },
  {
    id: "10",
    reference: "MYDD-01041",
    from: "A test",
    amount: 100.0,
    date: "23 Feb 2026",
    type: "Credit",
    invoices: [],
  },
];

export default function PaymentsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { paged, paginationProps } = usePagination(mockPayments, { pageKey: "/payments" });

  return (
    <div className="px-[22.5px] py-[10px]">
      {/* Header */}
      <PageHeader title="Payments">
        <Button variant="secondary">
          <Plus className="h-4 w-4" />
          New payment
        </Button>
      </PageHeader>

      {/* Search */}
      <SearchBar placeholder="Search for recipient name and payment number" />

      {/* Table */}
      <Card padding="none" className="overflow-x-auto">
        <DataTable>
          <TableHead>
            <Th className="w-[280px]">
              <div className="flex items-center gap-1.5">
                Payment #
                <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
                <Filter className="h-3.5 w-3.5 text-text-secondary" />
              </div>
            </Th>
            <Th>From</Th>
            <Th align="right">Amount</Th>
            <Th align="right">
              <div className="flex items-center justify-end gap-1.5">
                Payment date
                <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
              </div>
            </Th>
          </TableHead>
          <TableBody>
            {paged.map((payment) => (
              <Fragment key={payment.id}>
                <Tr
                  clickable
                  onClick={() => {
                    if (payment.invoices.length > 0) {
                      setExpandedId(expandedId === payment.id ? null : payment.id);
                    }
                  }}
                >
                  <Td>
                    <div className="flex items-center gap-2">
                      {payment.invoices.length > 0 ? (
                        <Button variant="icon" size="sm" className="h-5 w-5" round>
                          {expandedId === payment.id ? (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
                              <line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          ) : (
                            <span className="text-label-lg">+</span>
                          )}
                        </Button>
                      ) : (
                        <span className="w-5" />
                      )}
                      <span className="text-text">{payment.reference}</span>
                      {payment.type && <Badge variant="gray">{payment.type}</Badge>}
                    </div>
                  </Td>
                  <Td><LinkCell>{payment.from}</LinkCell></Td>
                  <Td align="right" className="text-text">
                    {payment.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                  </Td>
                  <Td align="right" className="text-text-secondary">
                    {payment.date}
                  </Td>
                </Tr>
                {expandedId === payment.id && payment.invoices.length > 0 && (
                  <tr>
                    <td colSpan={4} className="bg-gray-50/70 px-4 py-0">
                      <div className="py-2 pl-7">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="py-2 text-left text-label-lg text-text">Invoice #</th>
                              <th className="py-2 text-left text-label-lg text-text">Amount</th>
                              <th className="py-2 text-left text-label-lg text-text">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payment.invoices.map((inv) => (
                              <tr key={inv.number}>
                                <td className="py-2 text-sm"><LinkCell>{inv.number}</LinkCell></td>
                                <td className="py-2 text-sm text-text">{inv.amount.toFixed(2)}</td>
                                <td className="py-2 text-sm text-text-secondary">{inv.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </TableBody>
        </DataTable>
        <Pagination {...paginationProps} />
      </Card>
    </div>
  );
}
