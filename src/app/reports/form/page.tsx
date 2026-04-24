"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Badge, Card, DateRangeFilter, FormSelect, ListPage } from "@/components/ds";

interface FormRow {
  form: string;
  client: string;
  status: string;
  submitted: string;
  practitioner: string;
}

const mockFormRows: FormRow[] = [
  { form: "Intake Form", client: "Sarah Mitchell", status: "Completed", submitted: "11/03/2026", practitioner: "Dr Emily Watson" },
  { form: "Consent Form", client: "James O'Brien", status: "Completed", submitted: "11/03/2026", practitioner: "Dr Emily Watson" },
  { form: "Assessment Form", client: "Liam Nguyen", status: "Incomplete", submitted: "10/03/2026", practitioner: "Rachel Kim" },
  { form: "Intake Form", client: "Olivia Parker", status: "Not sent", submitted: "—", practitioner: "Rachel Kim" },
  { form: "Consent Form", client: "Noah Williams", status: "Completed", submitted: "09/03/2026", practitioner: "Tom Bradley" },
  { form: "Assessment Form", client: "Emma Chen", status: "Incomplete", submitted: "08/03/2026", practitioner: "Tom Bradley" },
];

function formStatusVariant(status: string) {
  if (status === "Completed") return "green" as const;
  if (status === "Incomplete") return "yellow" as const;
  return "gray" as const;
}

const columns: ColumnsType<FormRow> = [
  { key: "form", title: "Form name", dataIndex: "form" },
  {
    key: "client",
    title: "Client",
    dataIndex: "client",
    render: (_, row) => <span style={{ color: 'var(--color-primary)' }}>{row.client}</span>,
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    render: (_, row) => <Badge variant={formStatusVariant(row.status)}>{row.status}</Badge>,
  },
  { key: "submitted", title: "Submitted date", dataIndex: "submitted" },
  { key: "practitioner", title: "Practitioner", dataIndex: "practitioner" },
];

export default function ReportsFormPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ListPage
      title="Forms"
      actions={
        <>
          <Button>Export</Button>
          <Button>Learn about this report</Button>
        </>
      }
      cardWrap={false}
    >
      <div style={{ marginBottom: 16 }}>
        <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          Date range *
        </Flex>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          Form type
        </Flex>
        <FormSelect
          options={[
            { value: "all", label: "All" },
            { value: "intake", label: "Intake" },
            { value: "consent", label: "Consent" },
            { value: "assessment", label: "Assessment" },
          ]}
          style={{ width: 192 }}
        />
      </div>

      <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 32 }}>
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button type="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </Flex>

      {showResults && (
        <Card padding="none" style={{ overflowX: 'auto' }}>
          <Table columns={columns} dataSource={mockFormRows} rowKey={(_, index) => String(index)} pagination={false} />
        </Card>
      )}
    </ListPage>
  );
}
