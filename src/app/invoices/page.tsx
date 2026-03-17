import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { Plus, ArrowUpDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { client: true, items: true },
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
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((inv) => {
              const outstanding = inv.status === "Paid" ? 0 : inv.total;
              return (
                <tr
                  key={inv.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-text">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-sm text-primary">
                    {inv.client.firstName} {inv.client.lastName} ({inv.billingType})
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{inv.date}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{inv.dueDate}</td>
                  <td className="px-4 py-3 text-right text-sm text-text">
                    {inv.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-text">
                    {outstanding.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-{invoices.length} of {invoices.length} items</span>
          <div className="ml-4 flex items-center gap-1">
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
              1
            </button>
          </div>
          <span className="ml-4">10 / page</span>
        </div>
      </div>
    </div>
  );
}
