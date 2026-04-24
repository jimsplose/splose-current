import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SwapOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Icon from "@/components/ds/Icon";
import { Card, PageHeader, SearchBar, EmptyState, Pagination, PaymentStatusBadge, dbStatusToPaymentStatus, Text } from "@/components/ds";

export const dynamic = "force-dynamic";

type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  billingType: string;
  date: string;
  dueDate: string;
  total: number;
  status: string;
  appointment: { practitioner: { name: string } | null } | null;
};

function buildColumns(client: { firstName: string; lastName: string }): ColumnsType<InvoiceRow> {
  return [
    {
      key: "invoiceNumber",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
          Invoice #
          <Icon as={SwapOutlined} size="sm" tone="secondary" />
          <Icon as={FilterOutlined} size="sm" tone="secondary" />
        </Flex>
      ),
      dataIndex: "invoiceNumber",
    },
    {
      key: "to",
      title: "To",
      render: (_, inv) => (
        <Text variant="body/md" as="span" color="primary">
          {client.firstName} {client.lastName} ({inv.billingType})
        </Text>
      ),
    },
    {
      key: "location",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
          Location
          <Icon as={FilterOutlined} size="sm" tone="secondary" />
        </Flex>
      ),
      render: () => <Text variant="body/md" as="span" color="secondary">East Clinics</Text>,
    },
    {
      key: "practitioner",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
          Practitioner
          <Icon as={FilterOutlined} size="sm" tone="secondary" />
        </Flex>
      ),
      render: (_, inv) => (
        <Text variant="body/md" as="span" color="secondary">
          {inv.appointment?.practitioner ? inv.appointment.practitioner.name : "\u2014"}
        </Text>
      ),
    },
    {
      key: "issueDate",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
          Issue date
          <Icon as={SwapOutlined} size="sm" tone="secondary" />
        </Flex>
      ),
      render: (_, inv) => <Text variant="body/md" as="span" color="secondary">{formatDate(inv.date)}</Text>,
    },
    {
      key: "dueDate",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>Due date</Flex>
      ),
      render: (_, inv) => <Text variant="body/md" as="span" color="secondary">{formatDate(inv.dueDate)}</Text>,
    },
    {
      key: "amount",
      title: "Amount",
      align: "right" as const,
      render: (_, inv) => inv.total.toFixed(2),
    },
    {
      key: "outstanding",
      title: "Outstanding",
      align: "right" as const,
      render: (_, inv) => {
        const outstanding = inv.status === "Paid" ? 0 : inv.total;
        return outstanding.toFixed(2);
      },
    },
    {
      key: "status",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
          Status
          <Icon as={FilterOutlined} size="sm" tone="secondary" />
        </Flex>
      ),
      render: (_, inv) => <PaymentStatusBadge status={dbStatusToPaymentStatus(inv.status)} />,
    },
    {
      key: "sentStatus",
      title: (
        <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
          Sent status
          <Icon as={FilterOutlined} size="sm" tone="secondary" />
        </Flex>
      ),
      render: () => <Text variant="body/md" as="span" color="secondary">{"\u2014"}</Text>,
    },
  ];
}

export default async function ClientInvoicesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      invoices: {
        include: { appointment: { include: { practitioner: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) notFound();

  const columns = buildColumns(client);

  const emptyLocale = client.invoices.length === 0
    ? {
        emptyText: (
          <Flex vertical align="center" style={{ padding: '64px 16px' }}>
            <div style={{ marginBottom: 12, fontSize: 32 }}>&#x1F4CB;&#x1F4B5;</div>
            <Text variant="label/lg" as="p">No invoices</Text>
            <Button type="link" size="small" style={{ marginTop: 4 }}>Add new invoice</Button>
          </Flex>
        ),
      }
    : undefined;

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
      <PageHeader title="Invoices">
        <Button>+ New invoice</Button>
      </PageHeader>

      <SearchBar placeholder="Search for invoice number, client name and contact name" />

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={columns}
            dataSource={client.invoices as InvoiceRow[]}
            rowKey="id"
            pagination={false}
            locale={emptyLocale}
          />
        </div>
        <Pagination totalItems={client.invoices.length} itemsPerPage={10} />
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
