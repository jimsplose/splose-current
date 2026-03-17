import { prisma } from "@/lib/prisma";
import { Plus, MoreHorizontal, ArrowUpDown } from "lucide-react";
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
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Clients</h1>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            <Plus className="h-4 w-4" />
            New client
          </button>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for name, phone number, and email"
                className="h-10 w-full rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
              Search
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-purple-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-text">
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium text-text sm:table-cell">
                  Date of birth
                </th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium text-text md:table-cell">
                  Phone
                </th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium text-text lg:table-cell">
                  Email
                </th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium text-text md:table-cell">
                  <div className="flex items-center gap-1">
                    Tags
                    <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="transition-colors hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-sm text-text hover:text-primary"
                    >
                      {client.firstName} {client.lastName}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-text-secondary sm:table-cell">
                    {client.dateOfBirth}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-primary md:table-cell">
                    {client.phone}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-text-secondary lg:table-cell">
                    {client.email}
                  </td>
                  <td className="hidden px-4 py-3 text-sm md:table-cell">
                    {client.ndisNumber ? (
                      <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        NDIS
                      </span>
                    ) : client.medicare ? (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        Medicare
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
            <span>1-{clients.length} of {clients.length} items</span>
            <div className="ml-4 flex items-center gap-1">
              <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
                1
              </button>
            </div>
            <span className="ml-4">10 / page</span>
          </div>
        </div>
      </div>
    </>
  );
}
