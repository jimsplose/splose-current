"use client";

import { PlusOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { useState } from "react";
import { Button, Card, DataTable, PageHeader, TableHead, Th, TableBody, Tr, Td, ActionsCell, Pagination } from "@/components/ds";

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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(lettersData.length / pageSize);
  const paged = lettersData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Letters">
        <Button>
          <Icon as={PlusOutlined} />
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
                <Td color="secondary">{letter.location}</Td>
                <Td color="secondary">{letter.writtenBy}</Td>
                <Td color="secondary">{letter.createdAt}</Td>
                <Td color="secondary">{letter.lastUpdated}</Td>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={lettersData.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
}
