import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowUpDown, Filter } from "lucide-react";
import { Button, PageHeader, SearchBar, EmptyState, TableHead, Th, TableBody, Td, Pagination, Badge } from "@/components/ds";

export const dynamic = "force-dynamic";

export default async function ClientInvoicesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      invoices: {
        include: { appointment: { include: { practitioner: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) notFound();

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <PageHeader title="Invoices">
        <Button>+ New invoice</Button>
      </PageHeader>

      <SearchBar placeholder="Search for invoice number, client name and contact name" />

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHead>
              <Th>
                <div className="flex items-center gap-1">
                  Invoice #
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  <Filter className="h-3 w-3 text-text-secondary" />
                </div>
              </Th>
              <Th>To</Th>
              <Th>
                <div className="flex items-center gap-1">
                  Location
                  <Filter className="h-3 w-3 text-text-secondary" />
                </div>
              </Th>
              <Th>
                <div className="flex items-center gap-1">
                  Practitioner
                  <Filter className="h-3 w-3 text-text-secondary" />
                </div>
              </Th>
              <Th>
                <div className="flex items-center gap-1">
                  Issue date
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                </div>
              </Th>
              <Th>
                <div className="flex items-center gap-1">Due date</div>
              </Th>
              <Th align="right">Amount</Th>
              <Th align="right">Outstanding</Th>
              <Th>
                <div className="flex items-center gap-1">
                  Status
                  <Filter className="h-3 w-3 text-text-secondary" />
                </div>
              </Th>
              <Th>
                <div className="flex items-center gap-1">
                  Sent status
                  <Filter className="h-3 w-3 text-text-secondary" />
                </div>
              </Th>
            </TableHead>
            <TableBody>
              {client.invoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 text-4xl">📋💵</div>
                      <p className="text-sm font-medium text-text">No invoices</p>
                      <button className="mt-1 text-sm text-primary hover:underline">Add new invoice</button>
                    </div>
                  </td>
                </tr>
              ) : (
                client.invoices.map((inv) => {
                  const outstanding = inv.status === "Paid" ? 0 : inv.total;
                  const practitioner = inv.appointment?.practitioner;
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <Td className="text-text">{inv.invoiceNumber}</Td>
                      <Td className="text-primary">
                        {client.firstName} {client.lastName} ({inv.billingType})
                      </Td>
                      <Td className="text-text-secondary">East Clinics</Td>
                      <Td className="text-text-secondary">{practitioner ? practitioner.name : "—"}</Td>
                      <Td className="text-text-secondary">{formatDate(inv.date)}</Td>
                      <Td className="text-text-secondary">{formatDate(inv.dueDate)}</Td>
                      <Td align="right" className="text-text">
                        {inv.total.toFixed(2)}
                      </Td>
                      <Td align="right" className="text-text">
                        {outstanding.toFixed(2)}
                      </Td>
                      <Td>
                        {inv.status === "Paid" ? (
                          <Badge variant="green" className="bg-green-500 text-white">
                            Paid
                          </Badge>
                        ) : inv.status === "Draft" ? (
                          <Badge variant="blue" className="bg-blue-500 text-white">
                            Draft
                          </Badge>
                        ) : (
                          <Badge variant="yellow" className="bg-yellow-500 text-white">
                            {inv.status}
                          </Badge>
                        )}
                      </Td>
                      <Td className="text-text-secondary">—</Td>
                    </tr>
                  );
                })
              )}
            </TableBody>
          </table>
        </div>
        <Pagination totalItems={client.invoices.length} itemsPerPage={10} />
      </div>
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
