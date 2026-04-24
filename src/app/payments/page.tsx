"use client";

import { useState } from "react";
import { PlusOutlined, SwapOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ListPage, LinkCell, Pagination, Badge, Text } from "@/components/ds";

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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(mockPayments.length / pageSize);
  const paged = mockPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <ListPage
      title="Payments"
      actions={
        <Button>
          <PlusOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
          New payment
        </Button>
      }
      searchPlaceholder="Search for recipient name and payment number"
    >
      {(() => {
        type PaymentRow = typeof mockPayments[number];
        const paymentColumns: ColumnsType<PaymentRow> = [
          {
            key: "reference",
            title: (
              <Flex align="center" gap={6}>
                Payment #
                <SwapOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                <FilterOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
              </Flex>
            ),
            width: 280,
            render: (_, payment) => (
              <Flex align="center" gap={8}>
                {payment.invoices.length > 0 ? (
                  <Button type="text" size="small" style={{ height: 20, width: 20 }} shape="circle">
                    {expandedId === payment.id ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
                        <line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    ) : (
                      <Text variant="label/lg" as="span">+</Text>
                    )}
                  </Button>
                ) : (
                  <span style={{ width: 20 }} />
                )}
                <span>{payment.reference}</span>
                {payment.type && <Badge variant="gray">{payment.type}</Badge>}
              </Flex>
            ),
          },
          { key: "from", title: "From", render: (_, payment) => <LinkCell>{payment.from}</LinkCell> },
          {
            key: "amount",
            title: "Amount",
            align: "right" as const,
            render: (_, payment) => payment.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 }),
          },
          {
            key: "date",
            title: (
              <Flex align="center" justify="end" gap={6}>
                Payment date
                <SwapOutlined style={{ fontSize: 16, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
              </Flex>
            ),
            align: "right" as const,
            render: (_, payment) => <Text color="secondary" as="span">{payment.date}</Text>,
          },
        ];

        return (
          <Table
            columns={paymentColumns}
            dataSource={paged}
            rowKey="id"
            pagination={false}
            onRow={(payment) => ({
              style: { cursor: payment.invoices.length > 0 ? "pointer" : undefined },
              onClick: () => {
                if (payment.invoices.length > 0) {
                  setExpandedId(expandedId === payment.id ? null : payment.id);
                }
              },
            })}
            expandable={{
              expandedRowKeys: expandedId ? [expandedId] : [],
              showExpandColumn: false,
              expandedRowRender: (payment) => (
                <div style={{ padding: "8px 0 8px 28px" }}>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <th style={{ padding: "8px 0", textAlign: "left" }}><Text variant="label/lg" as="span">Invoice #</Text></th>
                        <th style={{ padding: "8px 0", textAlign: "left" }}><Text variant="label/lg" as="span">Amount</Text></th>
                        <th style={{ padding: "8px 0", textAlign: "left" }}><Text variant="label/lg" as="span">Date</Text></th>
                      </tr>
                    </thead>
                    <tbody>
                      {payment.invoices.map((inv) => (
                        <tr key={inv.number}>
                          <td style={{ padding: "8px 0", fontSize: 14 }}><LinkCell>{inv.number}</LinkCell></td>
                          <td style={{ padding: "8px 0", fontSize: 14 }}>{inv.amount.toFixed(2)}</td>
                          <td style={{ padding: "8px 0", fontSize: 14, color: "var(--color-text-secondary)" }}>{inv.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
            }}
          />
        );
      })()}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={mockPayments.length}
        itemsPerPage={pageSize}
        onPageChange={setCurrentPage}
      />
    </ListPage>
  );
}
