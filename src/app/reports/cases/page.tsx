"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Badge, DateRangeFilter, ListPage } from "@/components/ds";

interface CaseRow {
  number: string;
  client: string;
  type: string;
  practitioner: string;
  status: string;
  created: string;
  budget: string;
}

const mockCases: CaseRow[] = [
  { number: "CASE-001", client: "Liam Nguyen", type: "NDIS", practitioner: "Dr Sarah Chen", status: "Active", created: "15/01/2026", budget: "$12,500 / 40 hrs" },
  { number: "CASE-002", client: "Charlotte Brown", type: "NDIS", practitioner: "James Anderson", status: "Active", created: "20/11/2025", budget: "$8,200 / 25 hrs" },
  { number: "CASE-003", client: "Jack Thompson", type: "DVA", practitioner: "Dr Sarah Chen", status: "Closed", created: "05/09/2025", budget: "$5,000 / 15 hrs" },
  { number: "CASE-004", client: "Noah Wilson", type: "Private", practitioner: "Dr Lisa Park", status: "Active", created: "01/03/2026", budget: "$3,600 / 12 hrs" },
  { number: "CASE-005", client: "Oliver Martin", type: "NDIS", practitioner: "Emma Williams", status: "Active", created: "22/02/2026", budget: "$15,000 / 50 hrs" },
  { number: "CASE-006", client: "Amelia Davis", type: "DVA", practitioner: "James Anderson", status: "Closed", created: "10/07/2025", budget: "$4,800 / 16 hrs" },
];

function caseStatusVariant(status: string) {
  switch (status) {
    case "Active": return "green" as const;
    case "Closed": return "gray" as const;
    default: return "gray" as const;
  }
}

const columns: ColumnsType<CaseRow> = [
  { key: "number", title: "Case #", dataIndex: "number" },
  { key: "client", title: "Client", dataIndex: "client" },
  { key: "type", title: "Type", dataIndex: "type" },
  { key: "practitioner", title: "Practitioner", dataIndex: "practitioner" },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (_, row) => <Badge variant={caseStatusVariant(row.status)}>{row.status}</Badge>,
  },
  { key: "created", title: "Created", dataIndex: "created" },
  { key: "budget", title: "Budget / Hours", dataIndex: "budget" },
];

export default function ReportsCasesPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ListPage
      title="Cases"
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
          <p style={{ fontSize: 14, lineHeight: 1.57, margin: '16px 0', color: 'var(--color-text-secondary)' }}>{mockCases.length} items found.</p>
          <Table columns={columns} dataSource={mockCases} rowKey={(_, index) => String(index)} pagination={false} />
        </>
      )}
    </ListPage>
  );
}
