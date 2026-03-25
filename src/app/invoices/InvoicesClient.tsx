"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  PageHeader,
  Button,
  Card,
  Chip,
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
import { Plus } from "lucide-react";

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
            <Chip onRemove={() => setLocationFilter(null)}>
              Location: {locationFilter}
            </Chip>
          )}
          {practitionerFilter && (
            <Chip onRemove={() => setPractitionerFilter(null)}>
              Practitioner: {practitionerFilter}
            </Chip>
          )}
          {statusFilter && (
            <Chip onRemove={() => setStatusFilter(null)}>
              Status: {statusFilter}
            </Chip>
          )}
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setLocationFilter(null);
              setPractitionerFilter(null);
              setStatusFilter(null);
            }}
          >
            Clear all
          </Button>
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
                          <Button
                            key={loc}
                            variant={locationFilter === loc ? "primary" : "secondary"}
                            size="sm"
                            onClick={() => {
                              setLocationFilter(
                                locationFilter === loc ? null : loc,
                              );
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
                            variant={practitionerFilter === prac ? "primary" : "secondary"}
                            size="sm"
                            onClick={() => {
                              setPractitionerFilter(
                                practitionerFilter === prac ? null : prac,
                              );
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
                            variant={statusFilter === st ? "primary" : "secondary"}
                            size="sm"
                            onClick={() => {
                              setStatusFilter(
                                statusFilter === st ? null : st,
                              );
                              setShowStatusDropdown(false);
                            }}
                          >
                            <Badge variant={statusVariant(st)}>{st}</Badge>
                          </Button>
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
                      <Badge variant={statusVariant(inv.status)} solid>
                        {inv.status}
                      </Badge>
                    </Td>
                    <Td hidden="lg">
                      {inv.status === "Sent" && (
                        <Badge variant={statusVariant("Sent")} solid>Sent</Badge>
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
