import { PageHeader, Button, Pagination, SearchBar } from "@/components/ds";
import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
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

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-purple-50">
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
                  <tr key={inv.id} className="cursor-pointer transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 text-body-md text-text">
                      <Link href={`/invoices/${inv.id}`} className="text-primary hover:underline">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-body-md text-primary">
                      {inv.client.firstName} {inv.client.lastName} ({inv.billingType})
                    </td>
                    <td className="hidden px-4 py-3 text-body-md text-text-secondary md:table-cell">East Clinics</td>
                    <td className="hidden px-4 py-3 text-body-md text-text-secondary md:table-cell">
                      {practitioner ? practitioner.name : "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-body-md text-text-secondary lg:table-cell">
                      {formatDate(inv.date)}
                    </td>
                    <td className="hidden px-4 py-3 text-body-md text-text-secondary lg:table-cell">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="hidden px-4 py-3 text-right text-body-md text-text sm:table-cell">
                      {inv.total.toFixed(2)}
                    </td>
                    <td className="hidden px-4 py-3 text-right text-body-md text-text sm:table-cell">
                      {outstanding.toFixed(2)}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      {inv.status === "Sent" && <StatusBadge status="Sent" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={1} totalPages={1} totalItems={invoices.length} itemsPerPage={10} />
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
