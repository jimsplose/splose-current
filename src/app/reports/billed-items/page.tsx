"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DateRangeFilter, ListPage } from "@/components/ds";

interface BilledItem {
  code: string;
  description: string;
  client: string;
  practitioner: string;
  qty: number;
  rate: string;
  total: string;
  invoice: string;
}

const mockBilledItems: BilledItem[] = [
  { code: "10960", description: "Initial consultation — Psychology", client: "Liam Nguyen", practitioner: "Dr Sarah Chen", qty: 1, rate: "$185.00", total: "$185.00", invoice: "INV-0421" },
  { code: "10968", description: "Subsequent consultation — Psychology", client: "Noah Wilson", practitioner: "Dr Lisa Park", qty: 1, rate: "$150.00", total: "$150.00", invoice: "INV-0425" },
  { code: "65070", description: "Speech pathology initial assessment", client: "Olivia Smith", practitioner: "Emma Williams", qty: 1, rate: "$195.00", total: "$195.00", invoice: "INV-0422" },
  { code: "65083", description: "Speech pathology subsequent session", client: "Amelia Davis", practitioner: "Emma Williams", qty: 2, rate: "$150.00", total: "$300.00", invoice: "INV-0428" },
  { code: "10960", description: "Initial consultation — Psychology", client: "Mia Taylor", practitioner: "Dr Lisa Park", qty: 1, rate: "$185.00", total: "$185.00", invoice: "INV-0430" },
  { code: "80110", description: "OT initial assessment", client: "Jack Thompson", practitioner: "Dr Sarah Chen", qty: 1, rate: "$210.00", total: "$210.00", invoice: "INV-0423" },
  { code: "80125", description: "OT subsequent consultation", client: "Charlotte Brown", practitioner: "James Anderson", qty: 1, rate: "$175.00", total: "$175.00", invoice: "INV-0424" },
  { code: "81315", description: "Exercise physiology consultation", client: "Oliver Martin", practitioner: "James Anderson", qty: 1, rate: "$130.00", total: "$130.00", invoice: "INV-0429" },
];

const totalInvoiced = "$1,530.00";

const columns: ColumnsType<BilledItem> = [
  { key: "code", title: "Item code", dataIndex: "code" },
  { key: "description", title: "Description", dataIndex: "description" },
  { key: "client", title: "Client", dataIndex: "client" },
  { key: "practitioner", title: "Practitioner", dataIndex: "practitioner" },
  { key: "qty", title: "Qty", dataIndex: "qty" },
  { key: "rate", title: "Rate", dataIndex: "rate" },
  { key: "total", title: "Total", dataIndex: "total" },
  { key: "invoice", title: "Invoice #", dataIndex: "invoice" },
];

export default function ReportsBilledItemsPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <ListPage
      title="Billed items"
      actions={<><Button>Export</Button><Button>Learn about this report</Button></>}
      cardWrap={false}
    >
      <div style={{ marginBottom: 16 }}>
        <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          Date range *
        </Flex>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 32 }}>
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button type="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </Flex>

      {showResults && (
        <>
          <Flex align="center" gap={8} style={{ margin: '16px 0' }}>
            <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}>Total invoiced: {totalInvoiced}</span>
            <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>({mockBilledItems.length} items)</span>
          </Flex>
          <Table columns={columns} dataSource={mockBilledItems} rowKey={(_, index) => String(index)} pagination={false} />
        </>
      )}
    </ListPage>
  );
}
