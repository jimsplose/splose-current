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
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Invoices</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Batch invoice
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            <Plus className="h-4 w-4" />
            New invoice
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for invoice number, client name and contact name"
          className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Search
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-purple-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-text">
                  <div className="flex items-center gap-1">
                    Invoice #
                    <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">To</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">
                  <div className="flex items-center gap-1">
                    Location
                    <Filter className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">
                  <div className="flex items-center gap-1">
                    Practitioner
                    <Filter className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">
                  <div className="flex items-center gap-1">
                    Issue date
                    <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">
                  <div className="flex items-center gap-1">
                    Due date
                    <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text">Amount</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text">Outstanding</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">
                  <div className="flex items-center gap-1">
                    Status
                    <Filter className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text">
                  <div className="flex items-center gap-1">
                    Sent status
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv) => {
                const outstanding = inv.status === "Paid" ? 0 : inv.total;
                const practitioner = inv.appointment?.practitioner;
                return (
                  <tr
                    key={inv.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-text">
                      <Link href={`/invoices/${inv.id}`} className="text-primary hover:underline">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-primary">
                      {inv.client.firstName} {inv.client.lastName} ({inv.billingType})
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">East Clinics</td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {practitioner ? practitioner.name : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {formatDate(inv.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-text">
                      {inv.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-text">
                      {outstanding.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3">
                      {inv.status === "Sent" && (
                        <StatusBadge status="Sent" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-{invoices.length} of {invoices.length} items</span>
          <div className="ml-4 flex items-center gap-1">
            <span className="text-text-secondary">&lt;</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
              1
            </button>
            <span className="text-text-secondary">&gt;</span>
          </div>
          <span className="ml-4">10 / page</span>
        </div>
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
