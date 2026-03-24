"use client";

import { useState } from "react";
import { Upload, MessageCircle, BookOpen, FileSpreadsheet, Database, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, FileText } from "lucide-react";
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
  FormSelect,
  Alert,
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
  const [importStep, setImportStep] = useState<"source" | "upload" | "mapping" | "preview" | "done">("source");
  const [viewRow, setViewRow] = useState<ImportRow | null>(null);
  const [reImportRow, setReImportRow] = useState<ImportRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<ImportRow | null>(null);

  const csvColumns = ["first_name", "last_name", "email", "phone", "date_of_birth", "address", "suburb", "postcode", "state", "notes"];
  const sploseFields = [
    { value: "", label: "Skip this column" },
    { value: "first_name", label: "First name" },
    { value: "last_name", label: "Last name" },
    { value: "preferred_name", label: "Preferred name" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "mobile", label: "Mobile" },
    { value: "date_of_birth", label: "Date of birth" },
    { value: "address_line_1", label: "Address line 1" },
    { value: "suburb", label: "Suburb" },
    { value: "postcode", label: "Postcode" },
    { value: "state", label: "State" },
    { value: "notes", label: "Notes" },
    { value: "medicare_number", label: "Medicare number" },
    { value: "ndis_number", label: "NDIS number" },
  ];
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    csvColumns.forEach((c) => {
      const match = sploseFields.find((f) => f.value === c);
      initial[c] = match ? c : "";
    });
    return initial;
  });

  const previewData = [
    { first_name: "Sarah", last_name: "Mitchell", email: "sarah.m@email.com", phone: "0412 345 678", date_of_birth: "15/03/1985", address: "42 Collins St", suburb: "Melbourne", postcode: "3000", state: "VIC", notes: "Referred by GP" },
    { first_name: "James", last_name: "Chen", email: "j.chen@email.com", phone: "0423 456 789", date_of_birth: "22/07/1992", address: "18 King William St", suburb: "Adelaide", postcode: "5000", state: "SA", notes: "" },
    { first_name: "Emily", last_name: "Brown", email: "emily.b@email.com", phone: "0434 567 890", date_of_birth: "08/11/1978", address: "7 George St", suburb: "Sydney", postcode: "2000", state: "NSW", notes: "NDIS participant" },
    { first_name: "Michael", last_name: "Torres", email: "m.torres@email.com", phone: "0445 678 901", date_of_birth: "30/01/2001", address: "55 Queen St", suburb: "Brisbane", postcode: "4000", state: "QLD", notes: "Under 18 — parental consent" },
    { first_name: "Priya", last_name: "Sharma", email: "priya.s@email.com", phone: "0456 789 012", date_of_birth: "14/09/1990", address: "3 Flinders Ln", suburb: "Melbourne", postcode: "3000", state: "VIC", notes: "" },
  ];

  function startImportFlow() {
    setImportStep("source");
    setImportOpen(true);
  }

  function handleImportNext() {
    if (importStep === "source") setImportStep("upload");
    else if (importStep === "upload") setImportStep("mapping");
    else if (importStep === "mapping") setImportStep("preview");
    else if (importStep === "preview") setImportStep("done");
  }

  function handleImportBack() {
    if (importStep === "upload") setImportStep("source");
    else if (importStep === "mapping") setImportStep("upload");
    else if (importStep === "preview") setImportStep("mapping");
  }

  function handleImportClose() {
    setImportOpen(false);
    setImportStep("source");
  }

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
        <Button variant="primary" onClick={startImportFlow}>
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

      {/* Import multi-step modal */}
      <Modal
        open={importOpen}
        onClose={handleImportClose}
        title={
          importStep === "source" ? "Import from" :
          importStep === "upload" ? "Upload CSV file" :
          importStep === "mapping" ? "Map columns" :
          importStep === "preview" ? "Preview import" :
          "Import complete"
        }
        maxWidth={importStep === "mapping" || importStep === "preview" ? "xl" : "md"}
        footer={
          importStep === "done" ? (
            <Button variant="primary" onClick={handleImportClose}>Done</Button>
          ) : importStep !== "source" ? (
            <div className="flex w-full items-center justify-between">
              <Button variant="ghost" onClick={handleImportBack}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-caption-md text-text-secondary">
                  Step {importStep === "upload" ? "1" : importStep === "mapping" ? "2" : "3"} of 3
                </span>
                <Button variant="primary" onClick={handleImportNext}>
                  {importStep === "preview" ? "Start import" : "Continue"} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
        {importStep === "source" && (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleImportNext}
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
              onClick={handleImportNext}
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
        )}

        {importStep === "upload" && (
          <div className="space-y-4">
            <FormSelect
              label="Import type"
              options={[
                { value: "clients", label: "Clients" },
                { value: "contacts", label: "Contacts" },
                { value: "appointments", label: "Appointments" },
              ]}
              defaultValue="clients"
            />
            <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border p-10 text-center transition-colors hover:border-primary hover:bg-purple-50">
              <Upload className="h-10 w-10 text-text-secondary" />
              <div>
                <p className="text-body-md text-text">Drag and drop your CSV file here</p>
                <p className="text-body-sm text-text-secondary">or click to browse</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
              <FileText className="h-4 w-4 text-green-600" />
              <span className="text-body-sm text-green-700">client_export_march_2026.csv</span>
              <Badge variant="green">Ready</Badge>
              <span className="ml-auto text-caption-md text-text-secondary">10 rows · 10 columns</span>
            </div>
          </div>
        )}

        {importStep === "mapping" && (
          <div className="space-y-4">
            <Alert variant="info">
              Map each CSV column to a splose field. Unmapped columns will be skipped.
            </Alert>
            <DataTable>
              <TableHead>
                <Th>CSV column</Th>
                <Th>Sample data</Th>
                <Th>splose field</Th>
                <Th>Status</Th>
              </TableHead>
              <TableBody>
                {csvColumns.map((col) => (
                  <Tr key={col}>
                    <Td><span className="font-mono text-body-sm text-text">{col}</span></Td>
                    <Td><span className="text-body-sm text-text-secondary">{previewData[0][col as keyof typeof previewData[0]] || "—"}</span></Td>
                    <Td>
                      <FormSelect
                        options={sploseFields}
                        value={columnMapping[col] || ""}
                        onChange={(e) => setColumnMapping((prev) => ({ ...prev, [col]: e.target.value }))}
                      />
                    </Td>
                    <Td>
                      {columnMapping[col] ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-body-sm">Mapped</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-text-secondary">
                          <span className="text-body-sm">Skipped</span>
                        </div>
                      )}
                    </Td>
                  </Tr>
                ))}
              </TableBody>
            </DataTable>
            <p className="text-caption-md text-text-secondary">
              {Object.values(columnMapping).filter(Boolean).length} of {csvColumns.length} columns mapped
            </p>
          </div>
        )}

        {importStep === "preview" && (
          <div className="space-y-4">
            <Alert variant="info">
              Review the data below. {previewData.length} records will be imported as clients.
            </Alert>
            <div className="overflow-x-auto">
              <DataTable>
                <TableHead>
                  {csvColumns.filter((c) => columnMapping[c]).map((col) => (
                    <Th key={col}>{sploseFields.find((f) => f.value === columnMapping[col])?.label ?? col}</Th>
                  ))}
                  <Th>Status</Th>
                </TableHead>
                <TableBody>
                  {previewData.map((row, i) => (
                    <Tr key={i}>
                      {csvColumns.filter((c) => columnMapping[c]).map((col) => (
                        <Td key={col}>
                          <span className="text-body-sm text-text">{row[col as keyof typeof row] || "—"}</span>
                        </Td>
                      ))}
                      <Td>
                        {i === 3 ? (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span className="text-body-sm">Under 18</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span className="text-body-sm">Valid</span>
                          </div>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </TableBody>
              </DataTable>
            </div>
            <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-body-sm text-text">4 valid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-body-sm text-text">1 warning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-body-sm text-text-secondary">0 errors</span>
              </div>
            </div>
          </div>
        )}

        {importStep === "done" && (
          <div className="py-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="mb-2 text-heading-lg text-text">Import complete!</h3>
            <p className="mb-4 text-body-md text-text-secondary">
              Successfully imported 5 clients into splose.
            </p>
            <div className="mx-auto flex max-w-xs flex-col gap-2 rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between text-body-sm">
                <span className="text-text-secondary">Total records</span>
                <span className="text-text">5</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-text-secondary">Imported</span>
                <span className="text-green-600">5</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-text-secondary">Skipped</span>
                <span className="text-text">0</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-text-secondary">Errors</span>
                <span className="text-text">0</span>
              </div>
            </div>
          </div>
        )}
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
