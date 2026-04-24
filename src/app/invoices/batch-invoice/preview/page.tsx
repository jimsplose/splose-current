import Link from "next/link";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FormPage, Text } from "@/components/ds";

const invoices = [
  { number: "INV-0142", client: "Emma Thompson", service: "Individual Therapy", amount: "$193.99" },
  { number: "INV-0143", client: "Liam Johnson", service: "Group Session", amount: "$97.00" },
  { number: "INV-0144", client: "Olivia Davis", service: "Plan Management", amount: "$65.09" },
  { number: "INV-0145", client: "Noah Wilson", service: "Individual Therapy", amount: "$193.99" },
];

type PreviewInvoice = typeof invoices[number];

const previewColumns: ColumnsType<PreviewInvoice> = [
  { key: "number", title: "Invoice #", render: (_, inv) => <Text color="primary" as="span" style={{ fontWeight: 500 }}>{inv.number}</Text> },
  { key: "client", title: "Client", dataIndex: "client" },
  { key: "service", title: "Service", dataIndex: "service" },
  { key: "amount", title: "Amount", align: "right" as const, dataIndex: "amount" },
];

export default function BatchInvoicePreviewPage() {
  return (
    <FormPage
      title="Preview batch invoice"
      backHref="/invoices/batch-invoice"
      actions={
        <>
          <Link href="/invoices/batch-invoice">
            <Button>Back</Button>
          </Link>
          <Button type="primary">Create invoices</Button>
        </>
      }
      style={{ minHeight: 'calc(100vh - 3.5rem)' }}
    >
      <Text variant="body/md" as="p" color="secondary" style={{ marginBottom: 16 }}>
        {invoices.length} invoices will be created. Review below before confirming.
      </Text>

      <Table columns={previewColumns} dataSource={invoices} rowKey="number" pagination={false} />

      <Flex justify="end" style={{ marginTop: 16, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={{ textAlign: 'right' }}>
          <Text variant="body/md" as="p" color="secondary">Total</Text>
          <Text variant="heading/md" as="p">$550.07</Text>
        </div>
      </Flex>
    </FormPage>
  );
}
