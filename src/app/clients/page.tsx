import { prisma } from "@/lib/prisma";
import { Plus, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Badge, Button, PageHeader, SearchBar, DataTable, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

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
      <div className="p-4 sm:p-6">
        <PageHeader title="Clients">
          <Button>
            <Plus className="h-4 w-4" />
            New client
          </Button>
        </PageHeader>
        <SearchBar placeholder="Search for name, phone number, and email" />

        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full">
            <TableHead>
              <Th>
                <div className="flex items-center gap-1">
                  Name
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                </div>
              </Th>
              <Th hidden="sm">Date of birth</Th>
              <Th hidden="md">Phone</Th>
              <Th hidden="lg">Email</Th>
              <Th hidden="md">
                <div className="flex items-center gap-1">
                  Tags
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                </div>
              </Th>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <tr key={client.id} className="cursor-pointer transition-colors hover:bg-gray-50">
                  <Td>
                    <Link href={`/clients/${client.id}`} className="text-sm text-text hover:text-primary">
                      {client.firstName} {client.lastName}
                    </Link>
                  </Td>
                  <Td hidden="sm" className="text-text-secondary">
                    {client.dateOfBirth}
                  </Td>
                  <Td hidden="md" className="text-primary">
                    {client.phone}
                  </Td>
                  <Td hidden="lg" className="text-text-secondary">
                    {client.email}
                  </Td>
                  <Td hidden="md">
                    {client.ndisNumber ? (
                      <Badge variant="yellow">NDIS</Badge>
                    ) : client.medicare ? (
                      <Badge variant="green">Medicare</Badge>
                    ) : null}
                  </Td>
                </tr>
              ))}
            </TableBody>
          </table>
          <Pagination currentPage={1} totalPages={1} totalItems={clients.length} itemsPerPage={10} />
        </div>
      </div>
    </>
  );
}
