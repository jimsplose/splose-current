"use client";

import { SwapOutlined, FilterOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { Badge, Card, Pagination, Text } from "@/components/ds";

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

type PractitionerRow = typeof mockPractitioners[number];

const columns: ColumnsType<PractitionerRow> = [
  {
    key: "name",
    title: (
      <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
        Name
        <Icon as={SwapOutlined} size="sm" tone="secondary" />
      </Flex>
    ),
    render: (_, p) => (
      <div>
        <span>{p.name}</span>
        <Badge variant="green" style={{ marginLeft: 8 }}>Account owner</Badge>
      </div>
    ),
  },
  {
    key: "role",
    title: "Role name",
    render: (_, p) => <Text variant="body/md" as="span" color="secondary">{p.role}</Text>,
  },
  {
    key: "roleType",
    title: "Role type",
    render: (_, p) => <Text variant="body/md" as="span" color="secondary">{p.roleType}</Text>,
  },
  {
    key: "group",
    title: (
      <Flex align="center" gap={4} component="span" style={{ display: 'inline-flex' }}>
        Group
        <Icon as={SwapOutlined} size="sm" tone="secondary" />
        <Icon as={FilterOutlined} size="sm" tone="secondary" />
      </Flex>
    ),
    render: (_, p) => <Text variant="body/md" as="span" color="secondary">{p.group}</Text>,
  },
  {
    key: "status",
    title: "Status",
    render: (_, p) => <Text variant="body/md" as="span" color="secondary">{p.status}</Text>,
  },
  {
    key: "actions",
    title: "",
    align: "right" as const,
    render: () => (
      <Button type="text" size="small" style={{ color: 'var(--color-text-secondary)' }}>...</Button>
    ),
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
        <Table
          columns={columns}
          dataSource={paged}
          rowKey="name"
          pagination={false}
        />
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
