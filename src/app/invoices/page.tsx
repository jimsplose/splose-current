import StatusBadge from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { Plus, Download, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    draft: invoices.filter((i) => i.status === "Draft").length,
    sent: invoices.filter((i) => i.status === "Sent").length,
    paid: invoices.filter((i) => i.status === "Paid").length,
    overdue: invoices.filter((i) => i.status === "Overdue").length,
    totalOutstanding: invoices
      .filter((i) => i.status === "Sent" || i.status === "Overdue")
      .reduce((sum, i) => sum + i.total, 0),
  };

  return (
    <>
      <div className="p-6">
        {/* Invoice stats */}
        <div className="mb-6 grid grid-cols-5 gap-4">
          {[
            { label: "Draft", value: stats.draft, color: "text-gray-600" },
            { label: "Sent", value: stats.sent, color: "text-blue-600" },
            { label: "Paid", value: stats.paid, color: "text-green-600" },
            { label: "Overdue", value: stats.overdue, color: "text-red-600" },
            {
              label: "Outstanding",
              value: `$${stats.totalOutstanding.toFixed(2)}`,
              color: "text-amber-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface p-4 text-center"
            >
              <p className="text-sm text-text-secondary">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-background">
              <Filter className="h-4 w-4" />
              All Status
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-background">
              <Filter className="h-4 w-4" />
              All Billing Types
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-background">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              <Plus className="h-4 w-4" />
              New Invoice
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Billing
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-background transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium text-primary">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {inv.client.firstName} {inv.client.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm">{inv.date}</td>
                  <td className="px-6 py-4 text-sm">{inv.dueDate}</td>
                  <td className="px-6 py-4 text-sm">{inv.billingType}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    ${inv.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
