"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { Tag, ListPage, DataTable, TableHead, Th, TableBody, Tr, Td, Pagination, Skeleton } from "@/components/ds";
import styles from "./ClientsPageClient.module.css";
import { Button } from "antd";

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
  return <Button type="link" href={`tel:${phone}`}>{phone}</Button>;
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
  const [loaded, setLoaded] = useState(false);
  const pageSize = 10;
  const totalPages = Math.ceil(clients.length / pageSize);
  const paged = clients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => { setLoaded(true); }, []);

  return (
    <ListPage
      title="Clients"
      actions={
        <Link href="/clients/new">
          <Button>
            <Icon as={PlusOutlined} />
            New client
          </Button>
        </Link>
      }
      searchPlaceholder="Search for name, phone number, and email"
      cardWrap={false}
    >
      <Skeleton.Loading
        loaded={loaded}
        fallback={
          <div style={{ padding: "0 0 8px" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
                <Skeleton.Block width="25%" height={18} />
                <Skeleton.Block width="10%" height={18} />
                <Skeleton.Block width="20%" height={18} />
                <Skeleton.Block width="15%" height={18} />
                <Skeleton.Block width="18%" height={18} />
              </div>
            ))}
          </div>
        }
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
                <span className={styles.hoverUnderline}>
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
                  <Tag color="rgb(249,202,36)" size="sm">NDIS</Tag>
                ) : client.medicare ? (
                  <Tag color="rgb(249,202,36)" size="sm">Medicare</Tag>
                ) : null}
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>
      </Skeleton.Loading>
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
