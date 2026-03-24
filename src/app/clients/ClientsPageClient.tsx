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
  usePagination,
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
  const { paged, paginationProps } = usePagination(clients, { pageKey: "/clients" });

  return (
    <div className="px-[22.5px] py-[10px]">
      <PageHeader title="Clients">
        <Link href="/clients/new">
          <Button variant="secondary">
            <Plus className="h-4 w-4" />
            New client
          </Button>
        </Link>
      </PageHeader>
      <SearchBar placeholder="Search for name, phone number, and email" />

      <DataTable className="table-fixed">
        <TableHead>
          <Th sortable filterable className="w-[25%] bg-table-header">Name</Th>
          <Th hidden="sm" className="w-[8%]">Date of birth</Th>
          <Th hidden="md" className="w-[28%]">Phone</Th>
          <Th hidden="lg" className="w-[16%]">Email</Th>
          <Th hidden="md" filterable className="w-[21%]">Tags</Th>
        </TableHead>
        <TableBody>
          {paged.map((client) => (
            <Tr key={client.id} clickable className="group relative">
              <Td className="bg-surface-header">
                <Link href={`/clients/${client.id}`} className="absolute inset-0" aria-label={`View ${client.firstName} ${client.lastName}`} />
                <span className="group-hover:underline">
                  {client.firstName} {client.lastName}
                </span>
              </Td>
              <Td hidden="sm">
                {client.dateOfBirth}
              </Td>
              <Td hidden="md">
                {client.phone}
              </Td>
              <Td hidden="lg">
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
      <Pagination {...paginationProps} />
    </div>
  );
}
