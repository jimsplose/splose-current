import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { Button, Card, DataTable, PageHeader, TableHead, Th } from "@/components/ds";

export const dynamic = "force-dynamic";

export default async function ClientSupportActivitiesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });

  if (!client) notFound();

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <PageHeader title="Support activities">
        <Button>
          <Plus className="h-4 w-4" />
          New support activity
        </Button>
      </PageHeader>

      <Card padding="none" className="overflow-x-auto">
        <DataTable>
          <TableHead>
            <Th>When</Th>
            <Th>Where</Th>
            <Th>Type</Th>
            <Th>Practitioner</Th>
            <Th>Invoice status</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <tbody>
            <tr>
              <td colSpan={6}>
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
                  <p className="text-sm text-text-secondary">No support activities</p>
                  <Button variant="ghost" className="mt-2 text-primary">
                    Add new support activity
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </DataTable>
      </Card>
    </div>
  );
}
