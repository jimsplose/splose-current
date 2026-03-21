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
import { Sparkles, X } from "lucide-react";

const templates = [
  {
    title: "Exercise Physiology Follow-up Report",
    createdAt: "4:39 pm, 16 Oct 2023",
    hasAi: true,
  },
  {
    title: "ST | Note",
    createdAt: "3:35 pm, 5 Jun 2024",
    hasAi: true,
  },
  {
    title: "Standard Consultation. 123",
    createdAt: "11:32 am, 12 Jun 2024",
    hasAi: false,
  },
  {
    title: "Standard Consultation",
    createdAt: "8:21 pm, 5 Mar 2014",
    hasAi: false,
  },
  {
    title: "Initial Consultation",
    createdAt: "8:21 pm, 5 Mar 2014",
    hasAi: false,
  },
];

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export default function ProgressNotesPage() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="p-6">
      <PageHeader title="Progress note templates">
        <Button variant="secondary">Show archived</Button>
        <Button variant="primary">+ New template</Button>
      </PageHeader>

      {showBanner && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3">
          <Badge variant="purple">New</Badge>
          <p className="flex-1 text-sm text-text">
            Add AI blocks to templates to generate instant drafts, every
            session. Try a template{" "}
            <a href="#" className="font-medium text-primary underline">
              created by splose
            </a>
            .
          </p>
          <button
            onClick={() => setShowBanner(false)}
            className="shrink-0 rounded p-0.5 text-text-secondary hover:bg-purple-100 hover:text-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <p className="mb-4 text-sm text-text-secondary">
        Create templates for any appointment type to save time and keep
        documentation consistent. Add tables, auto-fill placeholders,
        interactive fields and AI blocks.
      </p>

      <SearchBar placeholder="Search for title" />

      <DataTable>
        <TableHead>
          <Th>Title</Th>
          <Th>Created at</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {templates.map((t) => (
            <tr key={t.title} className="hover:bg-gray-50">
              <Td>
                <div className="flex items-center gap-2">
                  {t.hasAi && (
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  <span className="text-text">{t.title}</span>
                </div>
              </Td>
              <Td>{t.createdAt}</Td>
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
        totalItems={templates.length}
        itemsPerPage={10}
        showPageSize={false}
      />
    </div>
  );
}
