"use client";

import Link from "next/link";
import { ListPage, Badge } from "@/components/ds";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface UploadRecord {
  id: string;
  date: string;
  items: number;
  status: string;
  practitioner: string;
}

const uploads: UploadRecord[] = [
  { id: "54901", date: "22 Mar 2026", items: 12, status: "Done", practitioner: "Sarah Chen" },
  { id: "54800", date: "15 Mar 2026", items: 8, status: "Error", practitioner: "James Wilson" },
  { id: "54700", date: "8 Mar 2026", items: 15, status: "Done", practitioner: "Sarah Chen" },
  { id: "54600", date: "1 Mar 2026", items: 6, status: "Done", practitioner: "Emily Rodriguez" },
];

const columns: ColumnsType<UploadRecord> = [
  {
    key: "date",
    title: "Date",
    dataIndex: "date",
    render: (_, u) => (
      <Link href={`/reports/ndis-bulk-upload/${u.id}`} style={{ color: 'var(--color-primary)' }}>
        {u.date}
      </Link>
    ),
  },
  { key: "practitioner", title: "Practitioner", dataIndex: "practitioner" },
  { key: "items", title: "Items", dataIndex: "items", align: "right" },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (_, u) => (
      <Badge variant={u.status === "Done" ? "green" : "red"}>{u.status}</Badge>
    ),
  },
];

export default function NdisBulkUploadPage() {
  return (
    <ListPage
      title="NDIS bulk upload"
      actions={
        <Link href="/reports/ndis-bulk-upload/new">
          <Button type="primary">New upload</Button>
        </Link>
      }
    >
      <Table columns={columns} dataSource={uploads} rowKey="id" pagination={false} />
    </ListPage>
  );
}
