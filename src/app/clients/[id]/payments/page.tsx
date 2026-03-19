import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Plus, ArrowUpDown, Filter } from "lucide-react";
import { Button, PageHeader, SearchBar, TableHead, Th } from "@/components/ds";

export const dynamic = "force-dynamic";

export default async function ClientPaymentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });

  if (!client) notFound();

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <PageHeader title="Payments">
        <Button>
          <Plus className="h-4 w-4" />
          New payment
        </Button>
      </PageHeader>

      <SearchBar placeholder="Search for recipient name and payment number" />

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full">
          <TableHead>
            <Th>
              <span className="inline-flex items-center gap-1">
                Payment # <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />{" "}
                <Filter className="h-3.5 w-3.5 text-text-secondary" />
              </span>
            </Th>
            <Th>From</Th>
            <Th>Amount</Th>
            <Th>
              <span className="inline-flex items-center gap-1">
                Payment date <ArrowUpDown className="h-3.5 w-3.5 text-text-secondary" />
              </span>
            </Th>
          </TableHead>
          <tbody>
            <tr>
              <td colSpan={4}>
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-text-secondary">No payments</p>
                  <Button variant="ghost" className="mt-2 text-primary">
                    Add new payment
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
