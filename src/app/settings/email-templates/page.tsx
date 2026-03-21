"use client";

import { useState } from "react";
import {
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
  Badge,
  Dropdown,
  DropdownTriggerButton,
} from "@/components/ds";

type TemplateType =
  | "Invoice"
  | "Payment"
  | "Progress note"
  | "Form"
  | "Letter"
  | "General";

const typeBadgeVariant: Record<
  TemplateType,
  "blue" | "green" | "purple" | "yellow" | "gray"
> = {
  Invoice: "blue",
  Payment: "green",
  "Progress note": "purple",
  Form: "yellow",
  Letter: "gray",
  General: "gray",
};

const templates: {
  name: string;
  type: TemplateType;
  lastModified: string;
}[] = [
  {
    name: "#1_Invoice email template",
    type: "Invoice",
    lastModified: "10:45 am, 2 Oct 2025",
  },
  {
    name: "Receipt email template",
    type: "Payment",
    lastModified: "3:03 pm, 21 Feb 2024",
  },
  {
    name: "#2_Progress note email template",
    type: "Progress note",
    lastModified: "5:09 pm, 28 May 2025",
  },
  {
    name: "Form email template 1",
    type: "Form",
    lastModified: "4:46 pm, 17 Mar 2026",
  },
  {
    name: "Letter email template",
    type: "Letter",
    lastModified: "10:30 am, 7 Oct 2025",
  },
  {
    name: "General email template",
    type: "General",
    lastModified: "2:58 pm, 14 Jan 2026",
  },
  {
    name: "Receipt",
    type: "Invoice",
    lastModified: "9:22 am, 12 Sep 2025",
  },
  {
    name: "Reschedule",
    type: "Progress note",
    lastModified: "12:58 pm, 28 Jan 2022",
  },
];

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Delete", value: "delete", danger: true },
];

export default function EmailTemplatesPage() {
  const [search, setSearch] = useState("");

  const filtered = templates.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6">
      <PageHeader title="Email templates">
        <Button variant="primary">+ New template</Button>
      </PageHeader>

      <SearchBar
        placeholder="Search for template and type"
        onSearch={setSearch}
      />

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Type</Th>
          <Th>Last modified</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {filtered.map((t) => (
            <tr key={t.name} className="hover:bg-gray-50">
              <Td className="text-text">{t.name}</Td>
              <Td>
                <Badge variant={typeBadgeVariant[t.type]}>{t.type}</Badge>
              </Td>
              <Td>{t.lastModified}</Td>
              <Td align="right">
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={dropdownItems}
                  onSelect={() => {}}
                />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={filtered.length}
        itemsPerPage={10}
        showPageSize={false}
      />
    </div>
  );
}
