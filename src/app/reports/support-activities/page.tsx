"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Badge, DateRangeFilter, ListPage } from "@/components/ds";

interface ActivityRow {
  date: string;
  client: string;
  activityType: string;
  practitioner: string;
  duration: string;
  location: string;
  status: string;
}

const mockActivityRows: ActivityRow[] = [
  { date: "11/03/2026", client: "Sarah Mitchell", activityType: "Transport", practitioner: "Dr Emily Watson", duration: "30 min", location: "Mobile", status: "Completed" },
  { date: "11/03/2026", client: "James O'Brien", activityType: "Non-labour", practitioner: "Rachel Kim", duration: "15 min", location: "In clinic", status: "Completed" },
  { date: "10/03/2026", client: "Liam Nguyen", activityType: "Provider travel", practitioner: "Tom Bradley", duration: "45 min", location: "Mobile", status: "In progress" },
  { date: "10/03/2026", client: "Olivia Parker", activityType: "Transport", practitioner: "Dr Emily Watson", duration: "20 min", location: "Mobile", status: "Completed" },
  { date: "09/03/2026", client: "Noah Williams", activityType: "Non-labour", practitioner: "Rachel Kim", duration: "10 min", location: "In clinic", status: "Pending" },
  { date: "09/03/2026", client: "Emma Chen", activityType: "Provider travel", practitioner: "Tom Bradley", duration: "60 min", location: "Mobile", status: "Completed" },
];

function activityStatusVariant(status: string) {
  if (status === "Completed") return "green" as const;
  if (status === "In progress") return "blue" as const;
  if (status === "Pending") return "yellow" as const;
  return "gray" as const;
}

const columns: ColumnsType<ActivityRow> = [
  { key: "date", title: "Date", dataIndex: "date" },
  {
    key: "client",
    title: "Client",
    dataIndex: "client",
    render: (_, row) => <span style={{ color: 'var(--color-primary)' }}>{row.client}</span>,
  },
  { key: "activityType", title: "Activity type", dataIndex: "activityType" },
  { key: "practitioner", title: "Practitioner", dataIndex: "practitioner" },
  { key: "duration", title: "Duration", dataIndex: "duration" },
  { key: "location", title: "Location", dataIndex: "location" },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (_, row) => <Badge variant={activityStatusVariant(row.status)}>{row.status}</Badge>,
  },
];

export default function ReportsSupportActivitiesPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ListPage
      title="Support activities"
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
        <Table columns={columns} dataSource={mockActivityRows} rowKey={(_, index) => String(index)} pagination={false} />
      )}
    </ListPage>
  );
}
