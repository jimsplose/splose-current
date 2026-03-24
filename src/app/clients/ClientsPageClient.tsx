"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import {
  Badge,
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Pagination,
} from "@/components/ds";

interface ClientRow {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  phone: string | null;
  email: string | null;
  ndisNumber: string | null;
  medicare: string | null;
}

export default function ClientsPageClient({ clients }: { clients: ClientRow[] }) {
  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Clients">
        <Link href="/clients/new">
          <Button>
            <Plus className="h-4 w-4" />
            New client
          </Button>
        </Link>
      </PageHeader>
      <SearchBar placeholder="Search for name, phone number, and email" />

      <DataTable>
        <TableHead>
          <Th sortable filterable>Name</Th>
          <Th hidden="sm">Date of birth</Th>
          <Th hidden="md">Phone</Th>
          <Th hidden="lg">Email</Th>
          <Th hidden="md" filterable>Tags</Th>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <Tr key={client.id} clickable className="group relative">
              <Td>
                <Link href={`/clients/${client.id}`} className="absolute inset-0" aria-label={`View ${client.firstName} ${client.lastName}`} />
                <span className="font-medium text-primary group-hover:underline">
                  {client.firstName} {client.lastName}
                </span>
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
            </Tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={clients.length} itemsPerPage={10} />
    </div>
  );
}
