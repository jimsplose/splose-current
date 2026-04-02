"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  ListPage,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Pagination,
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
  return <a href={`tel:${phone}`} style={{ color: 'var(--color-primary)' }} onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>{phone}</a>;
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(clients.length / pageSize);
  const paged = clients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <ListPage
      title="Clients"
      actions={
        <Link href="/clients/new">
          <Button variant="secondary">
            <PlusOutlined style={{ fontSize: 16 }} />
            New client
          </Button>
        </Link>
      }
      searchPlaceholder="Search for name, phone number, and email"
      cardWrap={false}
    >
      <DataTable style={{ tableLayout: 'fixed' }}>
        <TableHead>
          <Th sortable filterable style={{ width: '25%' }}>Name</Th>
          <Th hidden="sm" style={{ width: '8%' }}>Date of birth</Th>
          <Th hidden="md" style={{ width: '28%' }}>Phone</Th>
          <Th hidden="lg" style={{ width: '16%' }}>Email</Th>
          <Th hidden="md" filterable style={{ width: '21%' }}>Tags</Th>
        </TableHead>
        <TableBody>
          {paged.map((client) => (
            <Tr key={client.id} clickable style={{ position: 'relative' }}>
              <Td style={{ backgroundColor: 'var(--color-surface-header, #fff)' }}>
                <Link href={`/clients/${client.id}`} style={{ position: 'absolute', inset: 0 }} aria-label={`View ${client.firstName} ${client.lastName}`} />
                <span className="hover-underline-on-row-hover">
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
                  <Badge variant="yellow" className="text-body-sm" style={{ borderRadius: 8, backgroundColor: 'rgb(249,202,36)', paddingLeft: 7, paddingRight: 7, paddingTop: 0, paddingBottom: 0, color: '#000' }}>NDIS</Badge>
                ) : client.medicare ? (
                  <Badge variant="yellow" className="text-body-sm" style={{ borderRadius: 8, backgroundColor: 'rgb(249,202,36)', paddingLeft: 7, paddingRight: 7, paddingTop: 0, paddingBottom: 0, color: '#000' }}>Medicare</Badge>
                ) : null}
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={clients.length}
        itemsPerPage={pageSize}
        onPageChange={setCurrentPage}
      />
    </ListPage>
  );
}
