"use client";

import { PlusOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { useState } from "react";
import { Card, PageHeader, Pagination, Dropdown, DropdownTriggerButton, Text } from "@/components/ds";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

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

const letterActions = [
  { label: "Edit", value: "edit" },
  { label: "Delete", value: "delete", danger: true },
];

const columns: ColumnsType<typeof lettersData[number]> = [
  { key: "title", title: "Title", dataIndex: "title" },
  {
    key: "location",
    title: "Location",
    render: (_, letter) => <Text variant="body/md" as="span" color="secondary">{letter.location}</Text>,
  },
  {
    key: "writtenBy",
    title: "Written by",
    render: (_, letter) => <Text variant="body/md" as="span" color="secondary">{letter.writtenBy}</Text>,
  },
  {
    key: "createdAt",
    title: "Created at",
    render: (_, letter) => <Text variant="body/md" as="span" color="secondary">{letter.createdAt}</Text>,
  },
  {
    key: "lastUpdated",
    title: "Last updated",
    render: (_, letter) => <Text variant="body/md" as="span" color="secondary">{letter.lastUpdated}</Text>,
  },
  {
    key: "actions",
    title: "",
    align: "right" as const,
    render: () => (
      <Dropdown
        align="right"
        trigger={<DropdownTriggerButton />}
        items={letterActions}
        onSelect={() => undefined}
      />
    ),
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
        <Table
          columns={columns}
          dataSource={paged}
          rowKey="id"
          pagination={false}
        />
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
