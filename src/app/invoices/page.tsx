import Link from "next/link";
import { PageHeader, Button, Card, Pagination, SearchBar, Badge, statusVariant, DataTable, TableHead, Th, TableBody, Tr, Td, LinkCell } from "@/components/ds";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { client: true, items: true, appointment: { include: { practitioner: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Invoices">
        <Button variant="secondary">Batch invoice</Button>
        <Link href="/invoices/new">
          <Button variant="secondary">
            <Plus className="h-4 w-4" />
            New invoice
          </Button>
        </Link>
      </PageHeader>

      <SearchBar placeholder="Search for invoice number, client name and contact name" />

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable>
            <TableHead>
              <Th sortable>Invoice #</Th>
              <Th>To</Th>
              <Th hidden="md" filterable>Location</Th>
              <Th hidden="md" filterable>Practitioner</Th>
              <Th hidden="lg" sortable>Issue date</Th>
              <Th hidden="lg" sortable>Due date</Th>
              <Th hidden="sm" align="right">Amount</Th>
              <Th hidden="sm" align="right">Outstanding</Th>
              <Th hidden="sm" filterable>Status</Th>
              <Th hidden="lg">Sent status</Th>
            </TableHead>
            <TableBody>
              {invoices.map((inv) => {
                const outstanding = inv.status === "Paid" ? 0 : inv.total;
                const practitioner = inv.appointment?.practitioner;
                return (
                  <Tr key={inv.id} clickable>
                    <Td>
                      <LinkCell href={`/invoices/${inv.id}`}>
                        {inv.invoiceNumber}
                      </LinkCell>
                    </Td>
                    <Td className="text-primary">
                      {inv.client.firstName} {inv.client.lastName} ({inv.billingType})
                    </Td>
                    <Td hidden="md" className="text-text-secondary">East Clinics</Td>
                    <Td hidden="md" className="text-text-secondary">
                      {practitioner ? practitioner.name : "—"}
                    </Td>
                    <Td hidden="lg" className="text-text-secondary">
                      {formatDate(inv.date)}
                    </Td>
                    <Td hidden="lg" className="text-text-secondary">
                      {formatDate(inv.dueDate)}
                    </Td>
                    <Td hidden="sm" align="right">
                      {inv.total.toFixed(2)}
                    </Td>
                    <Td hidden="sm" align="right">
                      {outstanding.toFixed(2)}
                    </Td>
                    <Td hidden="sm">
                      <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
                    </Td>
                    <Td hidden="lg">
                      {inv.status === "Sent" && <Badge variant={statusVariant("Sent")}>Sent</Badge>}
                    </Td>
                  </Tr>
                );
              })}
            </TableBody>
          </DataTable>
        </div>
        <Pagination currentPage={1} totalPages={1} totalItems={invoices.length} itemsPerPage={10} />
      </Card>
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}
