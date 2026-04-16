"use client";

import { useParams } from "next/navigation";
import { DownOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Button, Checkbox, PageHeader, FormInput, Card } from "@/components/ds";

export default function ClientStatementsPage() {
  const params = useParams();
  const _id = params.id as string;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <PageHeader title="Statements">
        <Button>Email statement</Button>
        <Button>Download PDF</Button>
      </PageHeader>

      {/* Filter row */}
      <Flex align="flex-end" gap={16} className="mb-4">
        <Flex vertical gap={4}>
          <label className="text-label-lg">Type*</label>
          <Button style={{ minWidth: 140, justifyContent: 'space-between' }}>
            Activity
            <DownOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
          </Button>
        </Flex>

        <Flex vertical gap={4}>
          <label className="text-label-lg">Date range*</label>
          <Flex align="center" gap={8}>
            <FormInput
              type="text"
              defaultValue="1 Mar 2026"
              style={{ width: 130 }}
            />
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>&mdash;</span>
            <FormInput
              type="text"
              defaultValue="31 Mar 2026"
              style={{ width: 130 }}
            />
          </Flex>
        </Flex>

        <Flex vertical gap={4}>
          <label className="text-label-lg">Location*</label>
          <Button style={{ minWidth: 160, justifyContent: 'space-between' }}>
            All Locations
            <DownOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
          </Button>
        </Flex>

        <Button>Update</Button>
      </Flex>

      {/* Show client address checkbox */}
      <div className="mb-6">
        <Checkbox label="Show client address" defaultChecked />
      </div>

      {/* Empty content area */}
      <Card padding="none" style={{ padding: 32 }}>
        <div style={{ minHeight: 200 }} />
      </Card>
    </div>
  );
}
