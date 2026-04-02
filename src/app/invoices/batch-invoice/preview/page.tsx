import Link from "next/link";
import { Flex } from "antd";
import { Button, FormPage, DataTable, TableHead, Th, TableBody, Td } from "@/components/ds";

const invoices = [
  { number: "INV-0142", client: "Emma Thompson", service: "Individual Therapy", amount: "$193.99" },
  { number: "INV-0143", client: "Liam Johnson", service: "Group Session", amount: "$97.00" },
  { number: "INV-0144", client: "Olivia Davis", service: "Plan Management", amount: "$65.09" },
  { number: "INV-0145", client: "Noah Wilson", service: "Individual Therapy", amount: "$193.99" },
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
          <Button variant="primary">Create invoices</Button>
        </>
      }
      style={{ minHeight: 'calc(100vh - 3.5rem)' }}
    >
      <p className="text-body-md" style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
        {invoices.length} invoices will be created. Review below before confirming.
      </p>

      <DataTable>
        <TableHead>
          <Th>Invoice #</Th>
          <Th>Client</Th>
          <Th>Service</Th>
          <Th align="right">Amount</Th>
        </TableHead>
        <TableBody>
          {invoices.map((inv) => (
            <tr key={inv.number} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Td className="text-primary" style={{ fontWeight: 500 }}>{inv.number}</Td>
              <Td>{inv.client}</Td>
              <Td>{inv.service}</Td>
              <Td align="right">{inv.amount}</Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Flex justify="end" style={{ marginTop: 16, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={{ textAlign: 'right' }}>
          <p className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Total</p>
          <p className="text-heading-md text-text">$550.07</p>
        </div>
      </Flex>
    </FormPage>
  );
}
