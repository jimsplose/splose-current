import { PageHeader, Button, Card, Pagination, SearchBar, Badge, statusVariant, DataTable, TableHead, Th, TableBody, Tr, Td, LinkCell } from "@/components/ds";
import { prisma } from "@/lib/prisma";
import { Plus, ArrowUpDown, Filter } from "lucide-react";

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
        <Button variant="secondary">
          <Plus className="h-4 w-4" />
          New invoice
        </Button>
      </PageHeader>

      <SearchBar placeholder="Search for invoice number, client..." />

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-table-header">
                <th className="px-4 py-3 text-left text-label-lg text-text">
                  <div className="flex items-center gap-1">
                    Invoice #
                    <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-label-lg text-text">To</th>
                <th className="hidden px-4 py-3 text-left text-label-lg text-text md:table-cell">
                  <div className="flex items-center gap-1">
                    Location
                    <Filter className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="hidden px-4 py-3 text-left text-label-lg text-text md:table-cell">
                  <div className="flex items-center gap-1">
                    Practitioner
                    <Filter className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="hidden px-4 py-3 text-left text-label-lg text-text lg:table-cell">
                  <div className="flex items-center gap-1">
                    Issue date
                    <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="hidden px-4 py-3 text-left text-label-lg text-text lg:table-cell">
                  <div className="flex items-center gap-1">
                    Due date
                    <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="hidden px-4 py-3 text-right text-label-lg text-text sm:table-cell">Amount</th>
                <th className="hidden px-4 py-3 text-right text-label-lg text-text sm:table-cell">Outstanding</th>
                <th className="hidden px-4 py-3 text-left text-label-lg text-text sm:table-cell">
                  <div className="flex items-center gap-1">
                    Status
                    <Filter className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="hidden px-4 py-3 text-left text-label-lg text-text lg:table-cell">
                  <div className="flex items-center gap-1">Sent status</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
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
            </tbody>
          </table>
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
