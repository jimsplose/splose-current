import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SwapOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Badge, Card, PageHeader, SearchBar, Pagination, Text } from "@/components/ds";

export const dynamic = "force-dynamic";

type NoteRow = {
  id: string;
  template: string;
  signed: boolean;
  date: string | null;
  createdAt: Date;
  practitioner: { name: string };
};

const columns: ColumnsType<NoteRow> = [
  {
    key: "name",
    title: "Name",
    render: (_, note) => (
      <Flex align="center" gap={8}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>&raquo;</span>
        <span style={{ fontSize: 14 }}>{note.template}</span>
        {note.signed ? (
          <Badge variant="green">Final</Badge>
        ) : (
          <Badge variant="gray">Draft</Badge>
        )}
      </Flex>
    ),
  },
  {
    key: "createdBy",
    title: (
      <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
        Created by
        <Icon as={SwapOutlined} size="sm" tone="secondary" />
      </Flex>
    ),
    render: (_, note) => <Text variant="body/md" as="span" color="secondary">{note.practitioner.name}</Text>,
  },
  {
    key: "serviceDate",
    title: "Service date",
    render: (_, note) => (
      <a style={{ color: "var(--color-primary)" }}>
        {note.date ? formatDate(note.date) : "\u2014"}
      </a>
    ),
  },
  {
    key: "lastUpdate",
    title: "Last update",
    render: (_, note) => <Text variant="body/md" as="span" color="secondary">{formatDateTime(note.createdAt)}</Text>,
  },
  {
    key: "createdAt",
    title: (
      <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
        Created at
        <Icon as={SwapOutlined} size="sm" tone="secondary" />
      </Flex>
    ),
    render: (_, note) => <Text variant="body/md" as="span" color="secondary">{formatDateTime(note.createdAt)}</Text>,
  },
];

export default async function ClientNotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      clinicalNotes: {
        include: { practitioner: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) notFound();

  const emptyLocale =
    client.clinicalNotes.length === 0
      ? {
          emptyText: (
            <div style={{ padding: '32px 16px', textAlign: 'center' as const, fontSize: 14, color: 'var(--color-text-secondary)' }}>
              No progress notes
            </div>
          ),
        }
      : undefined;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Progress notes">
        <Button>Scroll view</Button>
        <Button>+ New note</Button>
      </PageHeader>

      <SearchBar placeholder="Search for content and title" />

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={client.clinicalNotes as NoteRow[]}
          rowKey="id"
          pagination={false}
          locale={emptyLocale}
          onRow={() => ({ style: { cursor: 'pointer' } })}
        />
        <Pagination totalItems={client.clinicalNotes.length} itemsPerPage={10} />
      </Card>
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
