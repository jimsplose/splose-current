import Link from "next/link";
import { Flex } from "antd";
import { Button, DataTable, TableHead, Th, TableBody, Td, Badge, Pagination } from "@/components/ds";

const TH_BG = "rgb(243, 245, 247)";

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
          <span className="text-display-lg">Batch invoice</span>
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
          <Th style={{ backgroundColor: TH_BG }}>Invoice #</Th>
          <Th style={{ backgroundColor: TH_BG }}>Client</Th>
          <Th style={{ backgroundColor: TH_BG }}>To</Th>
          <Th style={{ backgroundColor: TH_BG }}>Location</Th>
          <Th style={{ backgroundColor: TH_BG }}>Practitioner</Th>
          <Th style={{ backgroundColor: TH_BG }} align="right"># of items</Th>
          <Th style={{ backgroundColor: TH_BG }}>Issue date</Th>
          <Th style={{ backgroundColor: TH_BG }}>Due date</Th>
          <Th style={{ backgroundColor: TH_BG }} align="right">Total</Th>
          <Th style={{ backgroundColor: TH_BG }}>Status</Th>
        </TableHead>
        <TableBody>
          {items.map((inv) => (
            <tr key={inv.number} style={{ borderBottom: "1px solid rgb(240, 240, 240)" }}>
              <Td>
                <Link href={`/invoices/${inv.number}`} className="text-primary">
                  {inv.number}
                </Link>
              </Td>
              <Td>
                <Link href="#" className="text-primary">{inv.client}</Link>
              </Td>
              <Td>
                <Link href="#" className="text-primary">{inv.to}</Link>
              </Td>
              <Td>{inv.location}</Td>
              <Td>{inv.practitioner}</Td>
              <Td align="right">{inv.itemCount}</Td>
              <Td>{inv.issueDate}</Td>
              <Td>{inv.dueDate}</Td>
              <Td align="right">{inv.total.toFixed(2)}</Td>
              <Td>
                <Badge variant={inv.status === "Draft" ? "gray" : "green"} solid>{inv.status}</Badge>
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
