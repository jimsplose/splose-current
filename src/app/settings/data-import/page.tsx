"use client";

import { useState } from "react";
import { Upload, MessageCircle, BookOpen } from "lucide-react";
import {
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Badge,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
} from "@/components/ds";

interface ImportRow {
  id: number;
  type: string;
  status: string;
  statusVariant: "gray" | "green" | "yellow";
  message: string;
  createdAt: string;
  updatedAt: string;
}

const importHistory: ImportRow[] = [
  {
    id: 1,
    type: "CSV",
    status: "Draft",
    statusVariant: "gray",
    message: "",
    createdAt: "6 Mar 2026, 1:51 pm",
    updatedAt: "6 Mar 2026, 1:51 pm",
  },
  {
    id: 2,
    type: "CSV",
    status: "Done",
    statusVariant: "green",
    message: "Import completed. (Nothing imported)",
    createdAt: "5 Feb 2026, 11:16 pm",
    updatedAt: "5 Feb 2026, 11:16 pm",
  },
  {
    id: 3,
    type: "CSV",
    status: "Review",
    statusVariant: "yellow",
    message: "",
    createdAt: "4 Feb 2026, 1:39 pm",
    updatedAt: "4 Feb 2026, 1:45 pm",
  },
  {
    id: 4,
    type: "CSV",
    status: "Review",
    statusVariant: "yellow",
    message: "",
    createdAt: "2 Feb 2026, 3:13 pm",
    updatedAt: "4 Feb 2026, 1:38 pm",
  },
];

const ITEMS_PER_PAGE = 10;

const dropdownItems = [
  { label: "View", value: "view" },
  { label: "Delete", value: "delete", danger: true },
];

export default function DataImportPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(importHistory.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = importHistory.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      {/* Concierge data import banner */}
      <div className="mb-8 flex items-start gap-4 rounded-lg border border-border bg-gray-50 p-6">
        <div className="shrink-0 text-4xl">
          <span role="img" aria-label="folder">
            📂
          </span>
        </div>
        <div>
          <h2 className="mb-1 text-heading-lg text-text">Concierge data import</h2>
          <p className="mb-3 text-body-md text-text-secondary">
            Data importing is complicated. Chat with us to schedule a data import.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-label-lg text-text hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              Chat with us
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-label-lg text-text hover:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              Help guide
            </a>
          </div>
        </div>
      </div>

      {/* Import data header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-display-lg text-text">Import data</h1>
        <Button variant="primary">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </div>

      {/* Import history table */}
      <DataTable>
        <TableHead>
          <Th>Type</Th>
          <Th>Status</Th>
          <Th>Message</Th>
          <Th>Last Activity</Th>
          <Th>Actions</Th>
        </TableHead>
        <TableBody>
          {pageItems.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <Td>
                <span className="font-medium text-text">{row.type}</span>
              </Td>
              <Td>
                <Badge variant={row.statusVariant}>{row.status}</Badge>
              </Td>
              <Td>
                <span className="text-text-secondary">{row.message || "—"}</span>
              </Td>
              <Td>
                <div className="text-body-md">
                  <div className="text-text-secondary">Created: {row.createdAt}</div>
                  <div className="text-text-secondary">Updated: {row.updatedAt}</div>
                </div>
              </Td>
              <Td>
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
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={importHistory.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
