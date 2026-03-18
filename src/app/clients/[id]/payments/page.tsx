import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Plus, ArrowUpDown, Search, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientPaymentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });

  if (!client) notFound();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Payments</h1>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          <Plus className="h-4 w-4" />
          New payment
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search for recipient name and payment number"
            className="w-full rounded-lg border border-border bg-white px-4 py-2 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Search
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <span className="inline-flex items-center gap-1">
                  Payment # <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" /> <Filter className="h-3.5 w-3.5 text-text-secondary" />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">From</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <span className="inline-flex items-center gap-1">
                  Payment date <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4}>
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="mb-4 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-secondary">No payments</p>
                  <button className="mt-2 text-sm text-primary hover:underline">Add new payment</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
