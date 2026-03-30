"use client";

import { SwapOutlined, FilterOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Badge, Button, Card, DataTable, TableHead, Th, TableBody, Tr, Td, Pagination, usePagination } from "@/components/ds";

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
  const { paged, paginationProps } = usePagination(mockPractitioners, { pageKey: "/clients/practitioner-access" });

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <h1 className="text-display-lg" style={{ marginBottom: 16 }}>Practitioner access</h1>
      <p style={{ marginBottom: 24, fontSize: 14, color: 'var(--ant-color-text-secondary)' }}>
        You can link practitioners to clients via creating an appointment or support activity in the calendar tab.{" "}
        <span style={{ cursor: 'pointer', color: 'var(--ant-color-primary)' }} className="hover:underline">Learn more</span>
      </p>

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <DataTable>
          <TableHead>
            <Th>
              <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                Name
                <SwapOutlined style={{ fontSize: 12, color: 'var(--ant-color-text-secondary)' }} />
              </Flex>
            </Th>
            <Th>Role name</Th>
            <Th>Role type</Th>
            <Th>
              <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
                Group
                <SwapOutlined style={{ fontSize: 12, color: 'var(--ant-color-text-secondary)' }} />
                <FilterOutlined style={{ fontSize: 12, color: 'var(--ant-color-text-secondary)' }} />
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
                <Td style={{ color: 'var(--ant-color-text-secondary)' }}>{p.role}</Td>
                <Td style={{ color: 'var(--ant-color-text-secondary)' }}>{p.roleType}</Td>
                <Td style={{ color: 'var(--ant-color-text-secondary)' }}>{p.group}</Td>
                <Td style={{ color: 'var(--ant-color-text-secondary)' }}>{p.status}</Td>
                <Td align="right">
                  <Button variant="ghost" size="sm" style={{ color: 'var(--ant-color-text-secondary)' }}>...</Button>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination {...paginationProps} />
      </Card>
    </div>
  );
}
