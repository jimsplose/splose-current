"use client";

import Link from "next/link";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PaymentStatusBadge, dbStatusToPaymentStatus, Pagination, Text, Breadcrumbs } from "@/components/ds";

const items = [
  { number: "INV-0142", client: "Emma Thompson", to: "NDIS", location: "East Clinics", practitioner: "Christina Vagnoni", itemCount: 1, issueDate: "22 Mar 2026", dueDate: "22 Mar 2026", total: 193.99, status: "Sent" as const },
  { number: "INV-0143", client: "Liam Johnson", to: "Liam Johnson", location: "East Clinics", practitioner: "Ruvi R.", itemCount: 1, issueDate: "22 Mar 2026", dueDate: "22 Mar 2026", total: 97.00, status: "Draft" as const },
  { number: "INV-0144", client: "Olivia Davis", to: "Olivia Davis", location: "East Clinics", practitioner: "Hao Wang", itemCount: 1, issueDate: "22 Mar 2026", dueDate: "22 Mar 2026", total: 65.09, status: "Sent" as const },
];

type BatchItem = typeof items[number];

const batchColumns: ColumnsType<BatchItem> = [
  {
    key: "number",
    title: "Invoice #",
    render: (_, inv) => (
      <Text color="primary" as="span">
        <Link href={`/invoices/${inv.number}`}>{inv.number}</Link>
      </Text>
    ),
  },
  {
    key: "client",
    title: "Client",
    render: (_, inv) => <Text color="primary" as="span"><Link href="#">{inv.client}</Link></Text>,
  },
  {
    key: "to",
    title: "To",
    render: (_, inv) => <Text color="primary" as="span"><Link href="#">{inv.to}</Link></Text>,
  },
  { key: "location", title: "Location", dataIndex: "location" },
  { key: "practitioner", title: "Practitioner", dataIndex: "practitioner" },
  { key: "itemCount", title: "# of items", align: "right" as const, dataIndex: "itemCount" },
  { key: "issueDate", title: "Issue date", dataIndex: "issueDate" },
  { key: "dueDate", title: "Due date", dataIndex: "dueDate" },
  { key: "total", title: "Total", align: "right" as const, render: (_, inv) => inv.total.toFixed(2) },
  {
    key: "status",
    title: "Status",
    render: (_, inv) => <PaymentStatusBadge status={dbStatusToPaymentStatus(inv.status)} />,
  },
];

const totalAmount = items.reduce((sum, i) => sum + i.total, 0).toFixed(2);

export default function BatchInvoiceDetailPage() {
  return (
    <div style={{ padding: "24px 32px", minHeight: "calc(100vh - 57px)" }}>
      {/* Breadcrumbs */}
      <div style={{ marginBottom: 12 }}>
        <Breadcrumbs items={[
          { label: "Invoices", href: "/invoices" },
          { label: "Batch invoices", href: "/invoices" },
          { label: "BATCH-001" },
        ]} />
      </div>
      {/* Title row */}
      <Flex align="baseline" justify="space-between" style={{ marginBottom: 8 }}>
        <Flex align="baseline" gap={16}>
          <Text variant="display/lg" as="span">Batch invoice</Text>
          <span style={{ fontSize: 18, fontWeight: 400, color: "rgb(65, 69, 73)" }}>BATCH-001</span>
        </Flex>
        <Flex gap={8}>
          <Button style={{ borderColor: "rgb(65, 69, 73)", color: "rgb(65, 69, 73)" }}>Mark as Sent</Button>
          <Button style={{ borderColor: "rgb(65, 69, 73)", color: "rgb(65, 69, 73)" }}>Email invoices</Button>
        </Flex>
      </Flex>

      {/* Summary */}
      <p style={{ fontSize: 15, color: "rgb(65, 69, 73)", marginBottom: 24 }}>
        This batch contains {items.length} invoices totalling {totalAmount} AUD.
      </p>

      {/* Table */}
      <Table columns={batchColumns} dataSource={items} rowKey="number" pagination={false} />

      {/* Pagination */}
      <Pagination
        currentPage={1}
        totalItems={3}
        itemsPerPage={10}
        showPageSize
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}
