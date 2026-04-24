import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Card, PageHeader } from "@/components/ds";

export const dynamic = "force-dynamic";

type SupportActivityRow = Record<string, never>;

const columns: ColumnsType<SupportActivityRow> = [
  { key: "when", title: "When" },
  { key: "where", title: "Where" },
  { key: "type", title: "Type" },
  { key: "practitioner", title: "Practitioner" },
  { key: "invoiceStatus", title: "Invoice status" },
  { key: "actions", title: "", align: "right" as const },
];

export default async function ClientSupportActivitiesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });

  if (!client) notFound();

  const emptyLocale = {
    emptyText: (
      <Flex vertical align="center" justify="center" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <Flex align="center" justify="center" style={{ marginBottom: 16, height: 96, width: 96, borderRadius: '50%', backgroundColor: 'var(--color-fill-quaternary)' }}>
          <svg style={{ height: 48, width: 48, color: 'var(--color-text-quaternary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </Flex>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>No support activities</p>
        <Button type="text" style={{ marginTop: 8, color: 'var(--color-primary)' }}>
          Add new support activity
        </Button>
      </Flex>
    ),
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Support activities">
        <Button>
          <PlusOutlined style={{ fontSize: 14, color: 'var(--ant-color-text, #414549)' }} />
          New support activity
        </Button>
      </PageHeader>

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={[]}
          rowKey={() => "empty"}
          pagination={false}
          locale={emptyLocale}
        />
      </Card>
    </div>
  );
}
