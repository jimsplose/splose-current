"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  PageHeader,
  Button,
  Card,
  Pagination,
  SearchBar,
  Badge,
  statusVariant,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  LinkCell,
  usePagination,
} from "@/components/ds";
import { Plus, X } from "lucide-react";

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

  const { paged, paginationProps } = usePagination(filtered, { pageKey: "/invoices" });

  const activeFilterCount = [locationFilter, practitionerFilter, statusFilter].filter(Boolean).length;

  return (
    <div className="px-[22.5px] py-[10px]">
      <PageHeader title="Invoices">
        <Button variant="secondary">Batch invoice</Button>
        <Link href="/invoices/new">
          <Button variant="secondary">
            <Plus className="h-4 w-4" />
            New invoice
          </Button>
        </Link>
      </PageHeader>

      <SearchBar
        placeholder="Search for invoice number, client name and contact name"
        onSearch={(query) => setSearch(query)}
      />

      {/* Active filters */}
      {activeFilterCount > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-label-md text-text-secondary">Filters:</span>
          {locationFilter && (
            <button
              onClick={() => setLocationFilter(null)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-gray-50 px-2.5 py-1 text-caption-md text-text hover:bg-gray-100"
            >
              Location: {locationFilter}
              <X className="h-3 w-3" />
            </button>
          )}
          {practitionerFilter && (
            <button
              onClick={() => setPractitionerFilter(null)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-gray-50 px-2.5 py-1 text-caption-md text-text hover:bg-gray-100"
            >
              Practitioner: {practitionerFilter}
              <X className="h-3 w-3" />
            </button>
          )}
          {statusFilter && (
            <button
              onClick={() => setStatusFilter(null)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-gray-50 px-2.5 py-1 text-caption-md text-text hover:bg-gray-100"
            >
              Status: {statusFilter}
              <X className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={() => {
              setLocationFilter(null);
              setPractitionerFilter(null);
              setStatusFilter(null);
            }}
            className="text-caption-md text-primary hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable>
            <TableHead>
              <Th sortable>Invoice #</Th>
              <Th>To</Th>
              <Th
                hidden="md"
                filterable
                onFilter={() => {
                  setShowLocationDropdown((p) => !p);
                  setShowPractitionerDropdown(false);
                  setShowStatusDropdown(false);
                }}
              >
                Location
              </Th>
              <Th
                hidden="md"
                filterable
                onFilter={() => {
                  setShowPractitionerDropdown((p) => !p);
                  setShowLocationDropdown(false);
                  setShowStatusDropdown(false);
                }}
              >
                Practitioner
              </Th>
              <Th hidden="lg" sortable>
                Issue date
              </Th>
              <Th hidden="lg" sortable>
                Due date
              </Th>
              <Th hidden="sm" align="right">
                Amount
              </Th>
              <Th hidden="sm" align="right">
                Outstanding
              </Th>
              <Th
                hidden="sm"
                filterable
                onFilter={() => {
                  setShowStatusDropdown((p) => !p);
                  setShowLocationDropdown(false);
                  setShowPractitionerDropdown(false);
                }}
              >
                Status
              </Th>
              <Th hidden="lg">Sent status</Th>
            </TableHead>
            <TableBody>
              {/* Filter dropdown rows */}
              {(showLocationDropdown ||
                showPractitionerDropdown ||
                showStatusDropdown) && (
                <tr>
                  <td colSpan={10} className="border-b border-border bg-gray-50 px-4 py-2">
                    <div className="flex flex-wrap gap-2">
                      {showLocationDropdown &&
                        uniqueLocations.map((loc) => (
                          <button
                            key={loc}
                            onClick={() => {
                              setLocationFilter(
                                locationFilter === loc ? null : loc,
                              );
                              setShowLocationDropdown(false);
                            }}
                            className={`rounded-md border px-3 py-1 text-body-sm transition-colors ${
                              locationFilter === loc
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-white text-text hover:bg-gray-50"
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      {showPractitionerDropdown &&
                        uniquePractitioners.map((prac) => (
                          <button
                            key={prac}
                            onClick={() => {
                              setPractitionerFilter(
                                practitionerFilter === prac ? null : prac,
                              );
                              setShowPractitionerDropdown(false);
                            }}
                            className={`rounded-md border px-3 py-1 text-body-sm transition-colors ${
                              practitionerFilter === prac
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-white text-text hover:bg-gray-50"
                            }`}
                          >
                            {prac}
                          </button>
                        ))}
                      {showStatusDropdown &&
                        uniqueStatuses.map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              setStatusFilter(
                                statusFilter === st ? null : st,
                              );
                              setShowStatusDropdown(false);
                            }}
                            className={`rounded-md border px-3 py-1 text-body-sm transition-colors ${
                              statusFilter === st
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-white text-text hover:bg-gray-50"
                            }`}
                          >
                            <Badge variant={statusVariant(st)}>{st}</Badge>
                          </button>
                        ))}
                    </div>
                  </td>
                </tr>
              )}
              {paged.map((inv) => {
                const outstanding = inv.status === "Paid" ? 0 : inv.total;
                return (
                  <Tr key={inv.id} clickable>
                    <Td>
                      <LinkCell href={`/invoices/${inv.id}`}>
                        {inv.invoiceNumber}
                      </LinkCell>
                    </Td>
                    <Td className="text-primary">
                      {inv.clientName} ({inv.billingType})
                    </Td>
                    <Td hidden="md" className="text-text-secondary">
                      {inv.location}
                    </Td>
                    <Td hidden="md" className="text-text-secondary">
                      {inv.practitioner || "\u2014"}
                    </Td>
                    <Td hidden="lg" className="text-text-secondary">
                      {formatDate(inv.date)}
                    </Td>
                    <Td hidden="lg" className="text-text-secondary">
                      {formatDate(inv.dueDate)}
                    </Td>
                    <Td hidden="sm" align="right">
                      {inv.total.toFixed(2)}
                    </Td>
                    <Td hidden="sm" align="right">
                      {outstanding.toFixed(2)}
                    </Td>
                    <Td hidden="sm">
                      <Badge variant={statusVariant(inv.status)}>
                        {inv.status}
                      </Badge>
                    </Td>
                    <Td hidden="lg">
                      {inv.status === "Sent" && (
                        <Badge variant={statusVariant("Sent")}>Sent</Badge>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </TableBody>
          </DataTable>
        </div>
        <Pagination {...paginationProps} />
      </Card>
    </div>
  );
}
