"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { Tag, ListPage, Pagination, Skeleton } from "@/components/ds";
import styles from "./ClientsPageClient.module.css";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

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

  const columns: ColumnsType<ClientRow> = [
    {
      key: "name",
      title: "Name",
      width: "25%",
      render: (_, client) => (
        <div style={{ backgroundColor: 'var(--color-surface-header, #fff)', position: 'relative' }}>
          <Link href={`/clients/${client.id}`} style={{ position: 'absolute', inset: 0 }} aria-label={`View ${client.firstName} ${client.lastName}`} />
          <span className={styles.hoverUnderline}>
            {client.firstName} {client.lastName}
          </span>
        </div>
      ),
    },
    {
      key: "dateOfBirth",
      title: "Date of birth",
      width: "8%",
      render: (_, client) => formatDOB(client.dateOfBirth),
    },
    {
      key: "phone",
      title: "Phone",
      width: "28%",
      render: (_, client) => formatPhone(client.phone),
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      width: "16%",
    },
    {
      key: "tags",
      title: "Tags",
      width: "21%",
      render: (_, client) =>
        client.ndisNumber ? (
          <Tag color="rgb(249,202,36)" size="sm">NDIS</Tag>
        ) : client.medicare ? (
          <Tag color="rgb(249,202,36)" size="sm">Medicare</Tag>
        ) : null,
    },
  ];

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
        <Table
          columns={columns}
          dataSource={paged}
          rowKey="id"
          pagination={false}
          onRow={(client) => ({
            style: { cursor: 'pointer', position: 'relative' },
          })}
        />
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
