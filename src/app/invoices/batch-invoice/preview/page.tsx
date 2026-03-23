import Link from "next/link";
import { Button, Navbar, DataTable, TableHead, Th, TableBody, Td } from "@/components/ds";

const invoices = [
  { number: "INV-0142", client: "Emma Thompson", service: "Individual Therapy", amount: "$193.99" },
  { number: "INV-0143", client: "Liam Johnson", service: "Group Session", amount: "$97.00" },
  { number: "INV-0144", client: "Olivia Davis", service: "Plan Management", amount: "$65.09" },
  { number: "INV-0145", client: "Noah Wilson", service: "Individual Therapy", amount: "$193.99" },
];

export default function BatchInvoicePreviewPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <Navbar backHref="/invoices/batch-invoice" title="Preview batch invoice">
        <Link href="/invoices/batch-invoice">
          <Button>Back</Button>
        </Link>
        <Button variant="primary">Create invoices</Button>
      </Navbar>

      <div className="p-6">
        <p className="mb-4 text-body-md text-text-secondary">
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
              <tr key={inv.number} className="border-b border-border hover:bg-gray-50">
                <Td className="font-medium text-primary">{inv.number}</Td>
                <Td>{inv.client}</Td>
                <Td>{inv.service}</Td>
                <Td align="right">{inv.amount}</Td>
              </tr>
            ))}
          </TableBody>
        </DataTable>

        <div className="mt-4 flex justify-end border-t border-border pt-4">
          <div className="text-right">
            <p className="text-body-md text-text-secondary">Total</p>
            <p className="text-heading-md text-text">$550.07</p>
          </div>
        </div>
      </div>
    </div>
  );
}
