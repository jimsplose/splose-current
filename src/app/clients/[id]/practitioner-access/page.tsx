"use client";

import { SwapOutlined, FilterOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { Button, Flex } from "antd";
import { useState } from "react";
import { Badge, Card, DataTable, TableHead, Th, TableBody, Tr, Td, Pagination, Text } from "@/components/ds";

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
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <Text variant="display/lg" as="h1" style={{ marginBottom: 16 }}>Practitioner access</Text>
      <p style={{ marginBottom: 24, fontSize: 14, color: 'var(--color-text-secondary)' }}>
        You can link practitioners to clients via creating an appointment or support activity in the calendar tab.{" "}
        <span className="cursor-pointer" style={{ color: 'var(--color-primary)' }}>Learn more</span>
      </p>

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <DataTable>
          <TableHead>
            <Th>
              <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                Name
                <Icon as={SwapOutlined} size="sm" tone="secondary" />
              </Flex>
            </Th>
            <Th>Role name</Th>
            <Th>Role type</Th>
            <Th>
              <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                Group
                <Icon as={SwapOutlined} size="sm" tone="secondary" />
                <Icon as={FilterOutlined} size="sm" tone="secondary" />
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
                <Td color="secondary">{p.role}</Td>
                <Td color="secondary">{p.roleType}</Td>
                <Td color="secondary">{p.group}</Td>
                <Td color="secondary">{p.status}</Td>
                <Td align="right">
                  <Button type="text" size="small" style={{ color: 'var(--color-text-secondary)' }}>...</Button>
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
