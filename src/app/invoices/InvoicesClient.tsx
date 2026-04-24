"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { ListPage, Pagination, Badge, PaymentStatusBadge, dbStatusToPaymentStatus, LinkCell, Text, Skeleton } from "@/components/ds";

export interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  clientName: string;
  billingType: string;
  location: string;
  practitioner: string;
  date: string;
  dueDate: string;
  total: number;
  status: string;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function InvoicesClient({
  invoices,
}: {
  invoices: InvoiceRow[];
}) {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [practitionerFilter, setPractitionerFilter] = useState<string | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showPractitionerDropdown, setShowPractitionerDropdown] =
    useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  // Unique values for filter dropdowns
  const uniqueLocations = useMemo(
    () => [...new Set(invoices.map((inv) => inv.location))].sort(),
    [invoices],
  );
  const uniquePractitioners = useMemo(
    () =>
      [...new Set(invoices.map((inv) => inv.practitioner).filter(Boolean))].sort(),
    [invoices],
  );
  const uniqueStatuses = useMemo(
    () => [...new Set(invoices.map((inv) => inv.status))].sort(),
    [invoices],
  );

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.clientName.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      // Column filters
      if (locationFilter && inv.location !== locationFilter) return false;
      if (practitionerFilter && inv.practitioner !== practitionerFilter)
        return false;
      if (statusFilter && inv.status !== statusFilter) return false;
      return true;
    });
  }, [invoices, search, locationFilter, practitionerFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / 20);
  const paged = filtered.slice(0, 20);

  const activeFilterCount = [locationFilter, practitionerFilter, statusFilter].filter(Boolean).length;

  const filterChips = activeFilterCount > 0 ? (
    <>
      <Text variant="label/md" as="span" color="secondary">Filters:</Text>
      {locationFilter && (
        <Badge shape="pill" onRemove={() => setLocationFilter(null)}>
          Location: {locationFilter}
        </Badge>
      )}
      {practitionerFilter && (
        <Badge shape="pill" onRemove={() => setPractitionerFilter(null)}>
          Practitioner: {practitionerFilter}
        </Badge>
      )}
      {statusFilter && (
        <Badge shape="pill" onRemove={() => setStatusFilter(null)}>
          Status: {statusFilter}
        </Badge>
      )}
      <Button
        type="link"
        size="small"
        onClick={() => {
          setLocationFilter(null);
          setPractitionerFilter(null);
          setStatusFilter(null);
        }}
      >
        Clear all
      </Button>
    </>
  ) : undefined;

  return (
    <ListPage
      title="Invoices"
      actions={
        <>
          <Button>Batch invoice</Button>
          <Link href="/invoices/new">
            <Button>
              <PlusOutlined style={{ fontSize: 14, color: 'var(--ant-color-text, #414549)' }} />
              New invoice
            </Button>
          </Link>
        </>
      }
      searchPlaceholder="Search for invoice number, client name and contact name"
      onSearch={(query) => setSearch(query)}
      filters={filterChips}
    >
      <Skeleton.Loading
        loaded={loaded}
        fallback={
          <div style={{ padding: "0 0 8px" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
                <Skeleton.Block width="10%" height={18} />
                <Skeleton.Block width="20%" height={18} />
                <Skeleton.Block width="12%" height={18} />
                <Skeleton.Block width="18%" height={18} />
                <Skeleton.Block width="12%" height={18} />
                <Skeleton.Block width="10%" height={18} />
                <Skeleton.Block width="10%" height={18} />
              </div>
            ))}
          </div>
        }
      >
        {/* Filter dropdown panel */}
        {(showLocationDropdown || showPractitionerDropdown || showStatusDropdown) && (
          <div style={{ borderBottom: '1px solid var(--color-border)', background: '#f9fafb', padding: '8px 16px' }}>
            <Flex wrap="wrap" gap={8}>
              {showLocationDropdown &&
                uniqueLocations.map((loc) => (
                  <Button
                    key={loc}
                    type={locationFilter === loc ? "primary" : "default"}
                    size="small"
                    onClick={() => {
                      setLocationFilter(locationFilter === loc ? null : loc);
                      setShowLocationDropdown(false);
                    }}
                  >
                    {loc}
                  </Button>
                ))}
              {showPractitionerDropdown &&
                uniquePractitioners.map((prac) => (
                  <Button
                    key={prac}
                    type={practitionerFilter === prac ? "primary" : "default"}
                    size="small"
                    onClick={() => {
                      setPractitionerFilter(practitionerFilter === prac ? null : prac);
                      setShowPractitionerDropdown(false);
                    }}
                  >
                    {prac}
                  </Button>
                ))}
              {showStatusDropdown &&
                uniqueStatuses.map((st) => (
                  <Button
                    key={st}
                    type={statusFilter === st ? "primary" : "default"}
                    size="small"
                    onClick={() => {
                      setStatusFilter(statusFilter === st ? null : st);
                      setShowStatusDropdown(false);
                    }}
                  >
                    <PaymentStatusBadge status={dbStatusToPaymentStatus(st)} />
                  </Button>
                ))}
            </Flex>
          </div>
        )}
        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={[
              {
                key: "invoiceNumber",
                title: "Invoice #",
                sorter: true,
                render: (_, inv) => <LinkCell href={`/invoices/${inv.id}`}>{inv.invoiceNumber}</LinkCell>,
              },
              {
                key: "to",
                title: "To",
                render: (_, inv) => <Text color="primary" as="span">{inv.clientName} ({inv.billingType})</Text>,
              },
              {
                key: "location",
                title: (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowLocationDropdown((p) => !p);
                      setShowPractitionerDropdown(false);
                      setShowStatusDropdown(false);
                    }}
                  >
                    Location ▾
                  </span>
                ),
                render: (_, inv) => <Text color="secondary" as="span">{inv.location}</Text>,
              },
              {
                key: "practitioner",
                title: (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowPractitionerDropdown((p) => !p);
                      setShowLocationDropdown(false);
                      setShowStatusDropdown(false);
                    }}
                  >
                    Practitioner ▾
                  </span>
                ),
                render: (_, inv) => <Text color="secondary" as="span">{inv.practitioner || "—"}</Text>,
              },
              {
                key: "date",
                title: "Issue date",
                sorter: true,
                render: (_, inv) => <Text color="secondary" as="span">{formatDate(inv.date)}</Text>,
              },
              {
                key: "dueDate",
                title: "Due date",
                sorter: true,
                render: (_, inv) => <Text color="secondary" as="span">{formatDate(inv.dueDate)}</Text>,
              },
              {
                key: "total",
                title: "Amount",
                align: "right" as const,
                render: (_, inv) => inv.total.toFixed(2),
              },
              {
                key: "outstanding",
                title: "Outstanding",
                align: "right" as const,
                render: (_, inv) => (inv.status === "Paid" ? 0 : inv.total).toFixed(2),
              },
              {
                key: "status",
                title: (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setShowStatusDropdown((p) => !p);
                      setShowLocationDropdown(false);
                      setShowPractitionerDropdown(false);
                    }}
                  >
                    Status ▾
                  </span>
                ),
                render: (_, inv) => <PaymentStatusBadge status={dbStatusToPaymentStatus(inv.status)} />,
              },
              {
                key: "sentStatus",
                title: "Sent status",
                render: (_, inv) => inv.status === "Sent" ? <PaymentStatusBadge status="sent" /> : null,
              },
            ] as ColumnsType<InvoiceRow>}
            dataSource={paged}
            rowKey="id"
            pagination={false}
            onRow={() => ({ style: { cursor: "pointer" } })}
          />
        </div>
      </Skeleton.Loading>
      <Pagination
        currentPage={1}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={20}
        onPageChange={() => {}}
      />
    </ListPage>
  );
}
