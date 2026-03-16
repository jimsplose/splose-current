import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    where: { active: true },
    include: {
      _count: {
        select: { appointments: true, invoices: true },
      },
    },
    orderBy: { lastName: "asc" },
  });

  return (
    <>
      <Header title="Clients" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search clients..."
              className="h-10 w-80 rounded-lg border border-border bg-surface pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            <Plus className="h-4 w-4" />
            New Client
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  DOB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Funding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Appointments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Invoices
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-background transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/clients/${client.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {client.firstName} {client.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{client.email}</p>
                    <p className="text-xs text-text-secondary">
                      {client.phone}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm">{client.dateOfBirth}</td>
                  <td className="px-6 py-4 text-sm">
                    {client.ndisNumber ? (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                        NDIS
                      </span>
                    ) : client.medicare ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Medicare
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        Private
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {client._count.appointments}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {client._count.invoices}
                  </td>
                  <td className="px-6 py-4">
                    <button className="rounded-lg p-1 text-text-secondary hover:bg-background">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
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
