"use client";

import { SwapOutlined, FilterOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useState } from "react";
import { Badge, Button, Card, DataTable, TableHead, Th, TableBody, Tr, Td, Pagination } from "@/components/ds";

const mockPractitioners = [
    { name: "Delvin Khor", role: "Practitioner admin", roleType: "Practitioner admin", group: "---", status: "Linked" },
    {
      name: "Hrishikesh Koli",
      role: "Practitioner admin",
      roleType: "Practitioner admin",
      group: "---",
      status: "Linked",
    },
    {
      name: "Hung Yee Wong",
      role: "Practitioner admin",
      roleType: "Practitioner admin",
      group: "---",
      status: "Linked",
    },
];

export default function ClientPractitionerAccessPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(mockPractitioners.length / pageSize);
  const paged = mockPractitioners.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="mb-4 text-display-lg">Practitioner access</h1>
      <p style={{ marginBottom: 24, fontSize: 14, color: 'var(--color-text-secondary)' }}>
        You can link practitioners to clients via creating an appointment or support activity in the calendar tab.{" "}
        <span className="cursor-pointer" style={{ color: 'var(--color-primary)' }}>Learn more</span>
      </p>

      <Card padding="none" className="overflow-x-auto">
        <DataTable>
          <TableHead>
            <Th>
              <Flex align="center" gap={4} component="span" className="inline-flex">
                Name
                <SwapOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
              </Flex>
            </Th>
            <Th>Role name</Th>
            <Th>Role type</Th>
            <Th>
              <Flex align="center" gap={4} component="span" className="inline-flex">
                Group
                <SwapOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
                <FilterOutlined style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
              </Flex>
            </Th>
            <Th>Status</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {paged.map((p) => (
              <Tr key={p.name}>
                <Td>
                  <div>
                    <span>{p.name}</span>
                    <Badge variant="green" style={{ marginLeft: 8 }}>Account owner</Badge>
                  </div>
                </Td>
                <Td className="text-text-secondary">{p.role}</Td>
                <Td className="text-text-secondary">{p.roleType}</Td>
                <Td className="text-text-secondary">{p.group}</Td>
                <Td className="text-text-secondary">{p.status}</Td>
                <Td align="right">
                  <Button variant="ghost" size="sm" style={{ color: 'var(--color-text-secondary)' }}>...</Button>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={mockPractitioners.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
}
