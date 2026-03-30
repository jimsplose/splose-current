"use client";

import { useParams } from "next/navigation";
import { DownOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Button, Checkbox, PageHeader, FormInput, Card } from "@/components/ds";

export default function ClientStatementsPage() {
  const params = useParams();
  const _id = params.id as string;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Statements">
        <Button>Email statement</Button>
        <Button>Download PDF</Button>
      </PageHeader>

      {/* Filter row */}
      <Flex align="flex-end" gap={16} style={{ marginBottom: 16 }}>
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
      <div style={{ marginBottom: 24 }}>
        <Checkbox label="Show client address" defaultChecked />
      </div>

      {/* Empty content area */}
      <Card padding="none" className="p-8">
        <div style={{ minHeight: 200 }} />
      </Card>
    </div>
  );
}
