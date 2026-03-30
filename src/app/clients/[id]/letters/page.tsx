"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, DataTable, PageHeader, TableHead, Th, TableBody, Tr, Td, ActionsCell, Pagination, usePagination } from "@/components/ds";

const lettersData = [
  {
    id: "1",
    title: "DVA",
    location: "East Clinics",
    writtenBy: "Hung Yee Wong",
    createdAt: "4:54 pm, 5 Mar 2026",
    lastUpdated: "4:54 pm, 5 Mar 2026",
  },
];

export default function ClientLettersPage() {
  const { paged, paginationProps } = usePagination(lettersData, { pageKey: "/clients/letters" });

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Letters">
        <Button>
          <PlusOutlined style={{ fontSize: 16 }} />
          New letter
        </Button>
      </PageHeader>

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <DataTable>
          <TableHead>
            <Th>Title</Th>
            <Th>Location</Th>
            <Th>Written by</Th>
            <Th>Created at</Th>
            <Th>Last updated</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {paged.map((letter) => (
              <Tr key={letter.id}>
                <Td>{letter.title}</Td>
                <Td style={{ color: 'var(--ant-color-text-secondary)' }}>{letter.location}</Td>
                <Td style={{ color: 'var(--ant-color-text-secondary)' }}>{letter.writtenBy}</Td>
                <Td style={{ color: 'var(--ant-color-text-secondary)' }}>{letter.createdAt}</Td>
                <Td style={{ color: 'var(--ant-color-text-secondary)' }}>{letter.lastUpdated}</Td>
                <ActionsCell
                  items={[
                    { label: "Edit", value: "edit" },
                    { label: "Delete", value: "delete", danger: true },
                  ]}
                />
              </Tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination {...paginationProps} />
      </Card>
    </div>
  );
}
