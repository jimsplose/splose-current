"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowUpDown, ChevronDown, Tag } from "lucide-react";
import {
  Badge,
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
  Dropdown,
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

const tagOptions = [
  "NDIS",
  "Medicare",
  "FORMS PENDING",
  "High risk",
  "Dual funding",
  "Exception",
  "Company A",
];

export default function ClientsPageClient({ clients }: { clients: ClientRow[] }) {
  const [statusFilter, setStatusFilter] = useState<"active" | "archived">("active");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Clients">
        <Button>
          <Plus className="h-4 w-4" />
          New client
        </Button>
      </PageHeader>
      <SearchBar placeholder="Search for name, phone number, and email" />

      {/* Filter bar */}
      <div className="mb-4 flex items-center gap-2">
        <Dropdown
          trigger={
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text hover:bg-gray-50">
              {statusFilter === "active" ? "Active" : "Archived"}
              <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
            </button>
          }
          items={[
            { label: "Active", value: "active" },
            { label: "Archived", value: "archived" },
          ]}
          onSelect={(val) => setStatusFilter(val as "active" | "archived")}
        />
        <Dropdown
          trigger={
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text hover:bg-gray-50">
              <Tag className="h-3.5 w-3.5 text-text-secondary" />
              {tagFilter || "Tags"}
              <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
            </button>
          }
          items={[
            { label: "All tags", value: "__all__" },
            ...tagOptions.map((t) => ({ label: t, value: t })),
          ]}
          onSelect={(val) => setTagFilter(val === "__all__" ? null : val)}
        />
      </div>

      <DataTable>
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
            <tr key={client.id} className="group relative cursor-pointer transition-colors hover:bg-purple-50/50">
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
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={clients.length} itemsPerPage={10} />
    </div>
  );
}
