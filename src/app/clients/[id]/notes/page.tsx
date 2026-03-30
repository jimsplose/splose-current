import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SwapOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Badge, Button, Card, DataTable, PageHeader, SearchBar, TableHead, Th, TableBody, Tr, Td, LinkCell, Pagination } from "@/components/ds";

export const dynamic = "force-dynamic";

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

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Progress notes">
        <Button>Scroll view</Button>
        <Button>+ New note</Button>
      </PageHeader>

      <SearchBar placeholder="Search for content and title" />

      <Card padding="none" className="overflow-x-auto">
        <DataTable>
          <TableHead>
            <Th>Name</Th>
            <Th>
              <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                Created by
                <SwapOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
              </Flex>
            </Th>
            <Th>Service date</Th>
            <Th>Last update</Th>
            <Th>
              <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                Created at
                <SwapOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
              </Flex>
            </Th>
          </TableHead>
          <TableBody>
            {client.clinicalNotes.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  No progress notes
                </td>
              </tr>
            ) : (
              client.clinicalNotes.map((note) => (
                <Tr key={note.id} clickable>
                  <Td>
                    <Flex align="center" gap={8}>
                      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>&raquo;</span>
                      <span style={{ fontSize: 14 }}>{note.template}</span>
                      {note.signed ? (
                        <Badge variant="green">Final</Badge>
                      ) : (
                        <Badge variant="gray">Draft</Badge>
                      )}
                    </Flex>
                  </Td>
                  <Td className="text-text-secondary">{note.practitioner.name}</Td>
                  <Td>
                    <LinkCell>{note.date ? formatDate(note.date) : "\u2014"}</LinkCell>
                  </Td>
                  <Td className="text-text-secondary">{formatDateTime(note.createdAt)}</Td>
                  <Td className="text-text-secondary">{formatDateTime(note.createdAt)}</Td>
                </Tr>
              ))
            )}
          </TableBody>
        </DataTable>
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
