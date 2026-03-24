"use client";

import { useState } from "react";
import { Upload, MessageCircle, BookOpen, FileSpreadsheet, Database } from "lucide-react";
import {
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Badge,
  Pagination,
  Dropdown,
  DropdownTriggerButton,
  Modal,
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
  { label: "View details", value: "view" },
  { label: "Re-import", value: "re-import" },
  { label: "Delete", value: "delete", danger: true },
];

export default function DataImportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [importOpen, setImportOpen] = useState(false);
  const [viewRow, setViewRow] = useState<ImportRow | null>(null);
  const [reImportRow, setReImportRow] = useState<ImportRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<ImportRow | null>(null);

  const totalPages = Math.ceil(importHistory.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = importHistory.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  function handleAction(value: string, row: ImportRow) {
    switch (value) {
      case "view":
        setViewRow(row);
        break;
      case "re-import":
        setReImportRow(row);
        break;
      case "delete":
        setDeleteRow(row);
        break;
    }
  }

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
        <Button variant="primary" onClick={() => setImportOpen(true)}>
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
            <Tr key={row.id}>
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
                  onSelect={(value) => handleAction(value, row)}
                />
              </Td>
            </Tr>
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

      {/* Import from modal */}
      <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Import from">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setImportOpen(false)}
            className="flex flex-col items-center gap-3 rounded-lg border border-border p-6 text-center transition-colors hover:border-primary hover:bg-purple-50"
          >
            <FileSpreadsheet className="h-10 w-10 text-primary" />
            <div>
              <p className="text-label-lg text-text">CSV</p>
              <p className="mt-1 text-body-sm text-text-secondary">
                Import clients, contacts, or appointments from a CSV file
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setImportOpen(false)}
            className="flex flex-col items-center gap-3 rounded-lg border border-border p-6 text-center transition-colors hover:border-primary hover:bg-purple-50"
          >
            <Database className="h-10 w-10 text-primary" />
            <div>
              <p className="text-label-lg text-text">Cliniko</p>
              <p className="mt-1 text-body-sm text-text-secondary">
                Migrate your data from Cliniko
              </p>
            </div>
          </button>
        </div>
      </Modal>

      {/* View details modal */}
      <Modal
        open={!!viewRow}
        onClose={() => setViewRow(null)}
        title="Import details"
        maxWidth="md"
        footer={
          <Button variant="secondary" onClick={() => setViewRow(null)}>Close</Button>
        }
      >
        {viewRow && (
          <div className="space-y-3">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-label-lg text-text-secondary">Type</span>
              <span className="text-body-md text-text">{viewRow.type}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-label-lg text-text-secondary">Status</span>
              <Badge variant={viewRow.statusVariant}>{viewRow.status}</Badge>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-label-lg text-text-secondary">Message</span>
              <span className="text-body-md text-text">{viewRow.message || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-label-lg text-text-secondary">Created</span>
              <span className="text-body-md text-text">{viewRow.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-label-lg text-text-secondary">Last updated</span>
              <span className="text-body-md text-text">{viewRow.updatedAt}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Re-import confirmation modal */}
      <Modal
        open={!!reImportRow}
        onClose={() => setReImportRow(null)}
        title="Re-import"
        maxWidth="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReImportRow(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => setReImportRow(null)}>Re-import</Button>
          </>
        }
      >
        <p className="text-body-md text-text-secondary">
          Re-import this file? This will process the original file again.
        </p>
        {reImportRow && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3">
            <p className="text-label-lg text-text">{reImportRow.type} import</p>
            <p className="text-body-sm text-text-secondary">Created: {reImportRow.createdAt}</p>
          </div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        title="Delete import"
        maxWidth="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteRow(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => setDeleteRow(null)}>Delete</Button>
          </>
        }
      >
        <p className="text-body-md text-text-secondary">
          Delete this import record? This action cannot be undone.
        </p>
        {deleteRow && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3">
            <p className="text-label-lg text-text">{deleteRow.type} import</p>
            <p className="text-body-sm text-text-secondary">Created: {deleteRow.createdAt}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
