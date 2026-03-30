import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PlusOutlined, SwapOutlined, FilterOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Button, Card, DataTable, PageHeader, SearchBar, TableHead, Th } from "@/components/ds";

export const dynamic = "force-dynamic";

export default async function ClientPaymentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });

  if (!client) notFound();

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Payments">
        <Button>
          <PlusOutlined style={{ fontSize: 16 }} />
          New payment
        </Button>
      </PageHeader>

      <SearchBar placeholder="Search for recipient name and payment number" />

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <DataTable>
          <TableHead>
            <Th>
              <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                Payment # <SwapOutlined style={{ fontSize: 14, color: 'var(--ant-color-text-secondary)' }} />{" "}
                <FilterOutlined style={{ fontSize: 14, color: 'var(--ant-color-text-secondary)' }} />
              </Flex>
            </Th>
            <Th>From</Th>
            <Th>Amount</Th>
            <Th>
              <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                Payment date <SwapOutlined style={{ fontSize: 14, color: 'var(--ant-color-text-secondary)' }} />
              </Flex>
            </Th>
          </TableHead>
          <tbody>
            <tr>
              <td colSpan={4}>
                <Flex vertical align="center" justify="center" style={{ paddingTop: 64, paddingBottom: 64 }}>
                  <Flex align="center" justify="center" style={{ marginBottom: 16, height: 96, width: 96, borderRadius: '50%', backgroundColor: 'var(--ant-color-fill-quaternary)' }}>
                    <svg style={{ height: 48, width: 48, color: 'var(--ant-color-text-quaternary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </Flex>
                  <p style={{ fontSize: 14, color: 'var(--ant-color-text-secondary)' }}>No payments</p>
                  <Button variant="ghost" style={{ marginTop: 8, color: 'var(--ant-color-primary)' }}>
                    Add new payment
                  </Button>
                </Flex>
              </td>
            </tr>
          </tbody>
        </DataTable>
      </Card>
    </div>
  );
}
