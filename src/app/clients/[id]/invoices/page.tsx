import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SwapOutlined, FilterOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Button, Card, DataTable, PageHeader, SearchBar, EmptyState, TableHead, Th, TableBody, Tr, Td, Pagination, PaymentStatusBadge, dbStatusToPaymentStatus, Text } from "@/components/ds";

export const dynamic = "force-dynamic";

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

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
      <PageHeader title="Invoices">
        <Button>+ New invoice</Button>
      </PageHeader>

      <SearchBar placeholder="Search for invoice number, client name and contact name" />

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <div style={{ overflowX: 'auto' }}>
          <DataTable>
            <TableHead>
              <Th>
                <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                  Invoice #
                  <SwapOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                  <FilterOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                </Flex>
              </Th>
              <Th>To</Th>
              <Th>
                <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                  Location
                  <FilterOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                </Flex>
              </Th>
              <Th>
                <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                  Practitioner
                  <FilterOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                </Flex>
              </Th>
              <Th>
                <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                  Issue date
                  <SwapOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                </Flex>
              </Th>
              <Th>
                <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>Due date</Flex>
              </Th>
              <Th align="right">Amount</Th>
              <Th align="right">Outstanding</Th>
              <Th>
                <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                  Status
                  <FilterOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                </Flex>
              </Th>
              <Th>
                <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                  Sent status
                  <FilterOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                </Flex>
              </Th>
            </TableHead>
            <TableBody>
              {client.invoices.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '64px 16px' }}>
                    <Flex vertical align="center">
                      <div style={{ marginBottom: 12, fontSize: 32 }}>&#x1F4CB;&#x1F4B5;</div>
                      <Text variant="label/lg" as="p">No invoices</Text>
                      <Button variant="link" size="sm" style={{ marginTop: 4 }}>Add new invoice</Button>
                    </Flex>
                  </td>
                </tr>
              ) : (
                client.invoices.map((inv) => {
                  const outstanding = inv.status === "Paid" ? 0 : inv.total;
                  const practitioner = inv.appointment?.practitioner;
                  return (
                    <Tr key={inv.id}>
                      <Td>{inv.invoiceNumber}</Td>
                      <Td color="primary">
                        {client.firstName} {client.lastName} ({inv.billingType})
                      </Td>
                      <Td color="secondary">East Clinics</Td>
                      <Td color="secondary">{practitioner ? practitioner.name : "\u2014"}</Td>
                      <Td color="secondary">{formatDate(inv.date)}</Td>
                      <Td color="secondary">{formatDate(inv.dueDate)}</Td>
                      <Td align="right">
                        {inv.total.toFixed(2)}
                      </Td>
                      <Td align="right">
                        {outstanding.toFixed(2)}
                      </Td>
                      <Td>
                        <PaymentStatusBadge status={dbStatusToPaymentStatus(inv.status)} />
                      </Td>
                      <Td color="secondary">{"\u2014"}</Td>
                    </Tr>
                  );
                })
              )}
            </TableBody>
          </DataTable>
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
