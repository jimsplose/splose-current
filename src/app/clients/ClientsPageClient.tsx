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

function formatDOB(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatPhone(phone: string | null): React.ReactNode {
  if (!phone) return null;
  return <a href={`tel:${phone}`} className="text-primary hover:underline">{phone}</a>;
}

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
          <Th sortable filterable className="w-[25%]">Name</Th>
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
                {formatDOB(client.dateOfBirth)}
              </Td>
              <Td hidden="md">
                {formatPhone(client.phone)}
              </Td>
              <Td hidden="lg">
                {client.email}
              </Td>
              <Td hidden="md">
                {client.ndisNumber ? (
                  <Badge variant="yellow" className="!rounded-lg !bg-[rgb(249,202,36)] !px-[7px] !py-0 !text-[12px] !text-black">NDIS</Badge>
                ) : client.medicare ? (
                  <Badge variant="yellow" className="!rounded-lg !bg-[rgb(249,202,36)] !px-[7px] !py-0 !text-[12px] !text-black">Medicare</Badge>
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
