import Link from "next/link";
import { Flex } from "antd";
import { Button, DataTable, TableHead, Th, TableBody, Td, PaymentStatusBadge, dbStatusToPaymentStatus, Pagination, Text } from "@/components/ds";

const items = [
  { number: "INV-0142", client: "Emma Thompson", to: "NDIS", location: "East Clinics", practitioner: "Christina Vagnoni", itemCount: 1, issueDate: "22 Mar 2026", dueDate: "22 Mar 2026", total: 193.99, status: "Sent" as const },
  { number: "INV-0143", client: "Liam Johnson", to: "Liam Johnson", location: "East Clinics", practitioner: "Ruvi R.", itemCount: 1, issueDate: "22 Mar 2026", dueDate: "22 Mar 2026", total: 97.00, status: "Draft" as const },
  { number: "INV-0144", client: "Olivia Davis", to: "Olivia Davis", location: "East Clinics", practitioner: "Hao Wang", itemCount: 1, issueDate: "22 Mar 2026", dueDate: "22 Mar 2026", total: 65.09, status: "Sent" as const },
];

const totalAmount = items.reduce((sum, i) => sum + i.total, 0).toFixed(2);

export default function BatchInvoiceDetailPage() {
  return (
    <div style={{ padding: "24px 32px", minHeight: "calc(100vh - 57px)" }}>
      {/* Title row */}
      <Flex align="baseline" justify="space-between" style={{ marginBottom: 8 }}>
        <Flex align="baseline" gap={16}>
          <Text variant="display/lg" as="span">Batch invoice</Text>
          <span style={{ fontSize: 18, fontWeight: 400, color: "rgb(65, 69, 73)" }}>BATCH-001</span>
        </Flex>
        <Flex gap={8}>
          <Button style={{ borderColor: "rgb(65, 69, 73)", color: "rgb(65, 69, 73)" }}>Mark as Sent</Button>
          <Button style={{ borderColor: "rgb(65, 69, 73)", color: "rgb(65, 69, 73)" }}>Email invoices</Button>
        </Flex>
      </Flex>

      {/* Summary */}
      <p style={{ fontSize: 15, color: "rgb(65, 69, 73)", marginBottom: 24 }}>
        This batch contains {items.length} invoices totalling {totalAmount} AUD.
      </p>

      {/* Table */}
      <DataTable>
        <TableHead>
          <Th>Invoice #</Th>
          <Th>Client</Th>
          <Th>To</Th>
          <Th>Location</Th>
          <Th>Practitioner</Th>
          <Th align="right"># of items</Th>
          <Th>Issue date</Th>
          <Th>Due date</Th>
          <Th align="right">Total</Th>
          <Th>Status</Th>
        </TableHead>
        <TableBody>
          {items.map((inv) => (
            <tr key={inv.number} style={{ borderBottom: "1px solid rgb(240, 240, 240)" }}>
              <Td color="primary">
                <Link href={`/invoices/${inv.number}`}>
                  {inv.number}
                </Link>
              </Td>
              <Td color="primary">
                <Link href="#">{inv.client}</Link>
              </Td>
              <Td color="primary">
                <Link href="#">{inv.to}</Link>
              </Td>
              <Td>{inv.location}</Td>
              <Td>{inv.practitioner}</Td>
              <Td align="right">{inv.itemCount}</Td>
              <Td>{inv.issueDate}</Td>
              <Td>{inv.dueDate}</Td>
              <Td align="right">{inv.total.toFixed(2)}</Td>
              <Td>
                <PaymentStatusBadge status={dbStatusToPaymentStatus(inv.status)} />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      {/* Pagination */}
      <Pagination
        currentPage={1}
        totalItems={3}
        itemsPerPage={10}
        showPageSize
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}
