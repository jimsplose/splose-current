import Link from "next/link";
import { Button, Navbar, DataTable, TableHead, Th, TableBody, Td, Badge } from "@/components/ds";

const items = [
  { number: "INV-0142", client: "Emma Thompson", service: "Individual Therapy", amount: "$193.99", status: "Sent" },
  { number: "INV-0143", client: "Liam Johnson", service: "Group Session", amount: "$97.00", status: "Draft" },
  { number: "INV-0144", client: "Olivia Davis", service: "Plan Management", amount: "$65.09", status: "Sent" },
];

export default function BatchInvoiceDetailPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
      <Navbar backHref="/invoices/batch-invoice" title="Batch invoice #330044">
        <Button>Export</Button>
      </Navbar>

      <div style={{ padding: 24 }}>
        <div className="text-body-md" style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
          Created on 22 Mar 2026 &middot; 3 invoices
        </div>

        <DataTable>
          <TableHead>
            <Th>Invoice #</Th>
            <Th>Client</Th>
            <Th>Service</Th>
            <Th align="right">Amount</Th>
            <Th>Status</Th>
          </TableHead>
          <TableBody>
            {items.map((inv) => (
              <tr key={inv.number} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <Td>
                  <Link href={`/invoices/${inv.number}`} style={{ fontWeight: 500 }} className="text-primary">
                    {inv.number}
                  </Link>
                </Td>
                <Td>{inv.client}</Td>
                <Td>{inv.service}</Td>
                <Td align="right">{inv.amount}</Td>
                <Td>
                  <Badge variant={inv.status === "Sent" ? "green" : "gray"}>{inv.status}</Badge>
                </Td>
              </tr>
            ))}
          </TableBody>
        </DataTable>
      </div>
    </div>
  );
}
