"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Badge, DateRangeFilter, ListPage } from "@/components/ds";

interface WaitlistRow {
  client: string;
  dateAdded: string;
  priority: string;
  tags: string[];
  status: string;
  practitioner: string;
}

const mockWaitlist: WaitlistRow[] = [
  { client: "Sophie Lee", dateAdded: "01/03/2026", priority: "High", tags: ["NDIS"], status: "Waiting", practitioner: "Dr Sarah Chen" },
  { client: "Ethan Cooper", dateAdded: "05/03/2026", priority: "Medium", tags: ["Medicare"], status: "Contacted", practitioner: "Emma Williams" },
  { client: "Isabella Harris", dateAdded: "08/03/2026", priority: "High", tags: ["NDIS"], status: "Waiting", practitioner: "Dr Lisa Park" },
  { client: "Mason Clarke", dateAdded: "12/03/2026", priority: "Low", tags: [], status: "Booked", practitioner: "James Anderson" },
  { client: "Ava Robinson", dateAdded: "15/03/2026", priority: "Medium", tags: ["Medicare"], status: "Contacted", practitioner: "Dr Sarah Chen" },
  { client: "William Walker", dateAdded: "18/03/2026", priority: "Low", tags: ["NDIS"], status: "Waiting", practitioner: "Emma Williams" },
];

function priorityVariant(priority: string) {
  switch (priority) {
    case "High": return "red" as const;
    case "Medium": return "yellow" as const;
    case "Low": return "green" as const;
    default: return "gray" as const;
  }
}

function tagVariant(tag: string) {
  switch (tag) {
    case "NDIS": return "yellow" as const;
    case "Medicare": return "green" as const;
    default: return "gray" as const;
  }
}

const columns: ColumnsType<WaitlistRow> = [
  { key: "client", title: "Client", dataIndex: "client" },
  { key: "dateAdded", title: "Date added", dataIndex: "dateAdded" },
  {
    key: "priority",
    title: "Priority",
    dataIndex: "priority",
    render: (_, row) => <Badge variant={priorityVariant(row.priority)}>{row.priority}</Badge>,
  },
  {
    key: "tags",
    title: "Tags",
    dataIndex: "tags",
    render: (_, row) => (
      <Flex gap={4}>
        {row.tags.length > 0
          ? row.tags.map((tag) => (
              <Badge key={tag} variant={tagVariant(tag)}>{tag}</Badge>
            ))
          : <span style={{ color: 'var(--color-text-tertiary)' }}>--</span>}
      </Flex>
    ),
  },
  { key: "status", title: "Status", dataIndex: "status" },
  { key: "practitioner", title: "Practitioner assigned", dataIndex: "practitioner" },
];

export default function ReportsWaitlistPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ListPage
      title="Waitlist"
      actions={
        <>
          <Button>Export</Button>
          <Button>Learn about this report</Button>
        </>
      }
      toolbar={
        <>
          <div style={{ marginBottom: 16 }}>
            <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              Date range *
            </Flex>
            <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
          </div>

          <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 32 }}>
            <Button>Add filter</Button>
            <Button>Save filters</Button>
            <Button>Load filters</Button>
            <Button type="primary" onClick={() => setShowResults(true)}>Run report</Button>
          </Flex>
        </>
      }
      cardWrap={false}
    >
      {showResults && (
        <>
          <p style={{ fontSize: 14, lineHeight: 1.57, margin: '16px 0', color: 'var(--color-text-secondary)' }}>{mockWaitlist.length} items found.</p>
          <Table columns={columns} dataSource={mockWaitlist} rowKey={(_, index) => String(index)} pagination={false} />
        </>
      )}
    </ListPage>
  );
}
