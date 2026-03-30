"use client";

import { useState } from "react";
import { Flex } from "antd";
import { UploadOutlined, MessageOutlined, ReadOutlined, FileExcelOutlined, DatabaseOutlined, CheckCircleOutlined, WarningOutlined, ArrowLeftOutlined, ArrowRightOutlined, FileTextOutlined } from "@ant-design/icons";
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
  usePagination,
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
  { id: 1, type: "CSV", status: "Draft", statusVariant: "gray", message: "", createdAt: "6 Mar 2026, 1:51 pm", updatedAt: "6 Mar 2026, 1:51 pm" },
  { id: 2, type: "CSV", status: "Done", statusVariant: "green", message: "Import completed. (Nothing imported)", createdAt: "5 Feb 2026, 11:16 pm", updatedAt: "5 Feb 2026, 11:16 pm" },
  { id: 3, type: "CSV", status: "Review", statusVariant: "yellow", message: "", createdAt: "4 Feb 2026, 1:39 pm", updatedAt: "4 Feb 2026, 1:45 pm" },
  { id: 4, type: "CSV", status: "Review", statusVariant: "yellow", message: "", createdAt: "2 Feb 2026, 3:13 pm", updatedAt: "4 Feb 2026, 1:38 pm" },
];

const dropdownItems = [
  { label: "View details", value: "view" },
  { label: "Re-import", value: "re-import" },
  { label: "Delete", value: "delete", danger: true },
];

export default function DataImportPage() {
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

  function startImportFlow() { setImportStep("source"); setImportOpen(true); }
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
  function handleImportClose() { setImportOpen(false); setImportStep("source"); }

  const { paged: pageItems, paginationProps } = usePagination(importHistory, { pageKey: "/settings/data-import" });

  function handleAction(value: string, row: ImportRow) {
    switch (value) { case "view": setViewRow(row); break; case "re-import": setReImportRow(row); break; case "delete": setDeleteRow(row); break; }
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Concierge data import banner */}
      <Flex align="flex-start" gap={16} style={{ marginBottom: 32, borderRadius: 8, border: '1px solid var(--ant-color-border)', backgroundColor: 'var(--ant-color-bg-layout)', padding: 24 }}>
        <div style={{ flexShrink: 0, fontSize: '2.25rem' }}><span role="img" aria-label="folder">📂</span></div>
        <div>
          <h2 className="text-heading-lg text-text" style={{ marginBottom: 4 }}>Concierge data import</h2>
          <p className="text-body-md text-text-secondary" style={{ marginBottom: 12 }}>Data importing is complicated. Chat with us to schedule a data import.</p>
          <Flex align="center" gap={16}>
            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} className="text-label-lg text-text hover:text-primary">
              <MessageOutlined style={{ fontSize: 16 }} /> Chat with us
            </a>
            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} className="text-label-lg text-text hover:text-primary">
              <ReadOutlined style={{ fontSize: 16 }} /> Help guide
            </a>
          </Flex>
        </div>
      </Flex>

      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <h1 className="text-display-lg">Import data</h1>
        <Button variant="primary" onClick={startImportFlow}>
          <UploadOutlined style={{ fontSize: 16 }} /> Import
        </Button>
      </Flex>

      <DataTable>
        <TableHead><Th>Type</Th><Th>Status</Th><Th>Message</Th><Th>Last Activity</Th><Th>Actions</Th></TableHead>
        <TableBody>
          {pageItems.map((row) => (
            <Tr key={row.id}>
              <Td><span style={{ fontWeight: 500 }} className="text-text">{row.type}</span></Td>
              <Td><Badge variant={row.statusVariant}>{row.status}</Badge></Td>
              <Td><span className="text-text-secondary">{row.message || "\u2014"}</span></Td>
              <Td>
                <div className="text-body-md">
                  <div className="text-text-secondary">Created: {row.createdAt}</div>
                  <div className="text-text-secondary">Updated: {row.updatedAt}</div>
                </div>
              </Td>
              <Td>
                <Dropdown align="right" trigger={<DropdownTriggerButton />} items={dropdownItems} onSelect={(value) => handleAction(value, row)} />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination {...paginationProps} />

      {/* Import multi-step modal */}
      <Modal
        open={importOpen}
        onClose={handleImportClose}
        title={importStep === "source" ? "Import from" : importStep === "upload" ? "Upload CSV file" : importStep === "mapping" ? "Map columns" : importStep === "preview" ? "Preview import" : "Import complete"}
        maxWidth={importStep === "mapping" || importStep === "preview" ? "xl" : "md"}
        footer={
          importStep === "done" ? (
            <Button variant="primary" onClick={handleImportClose}>Done</Button>
          ) : importStep !== "source" ? (
            <Flex justify="space-between" align="center" style={{ width: '100%' }}>
              <Button variant="ghost" onClick={handleImportBack}>
                <ArrowLeftOutlined style={{ fontSize: 16 }} /> Back
              </Button>
              <Flex align="center" gap={8}>
                <span className="text-caption-md text-text-secondary">
                  Step {importStep === "upload" ? "1" : importStep === "mapping" ? "2" : "3"} of 3
                </span>
                <Button variant="primary" onClick={handleImportNext}>
                  {importStep === "preview" ? "Start import" : "Continue"} <ArrowRightOutlined style={{ fontSize: 16 }} />
                </Button>
              </Flex>
            </Flex>
          ) : undefined
        }
      >
        {importStep === "source" && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <button type="button" onClick={handleImportNext} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, borderRadius: 8, border: '1px solid var(--ant-color-border)', padding: 24, textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer', backgroundColor: 'transparent' }} className="hover:border-primary hover:bg-purple-50">
              <FileExcelOutlined style={{ fontSize: 40, color: 'var(--ant-color-primary)' }} />
              <div>
                <p className="text-label-lg text-text">CSV</p>
                <p className="text-body-sm text-text-secondary" style={{ marginTop: 4 }}>Import clients, contacts, or appointments from a CSV file</p>
              </div>
            </button>
            <button type="button" onClick={handleImportNext} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, borderRadius: 8, border: '1px solid var(--ant-color-border)', padding: 24, textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer', backgroundColor: 'transparent' }} className="hover:border-primary hover:bg-purple-50">
              <DatabaseOutlined style={{ fontSize: 40, color: 'var(--ant-color-primary)' }} />
              <div>
                <p className="text-label-lg text-text">Cliniko</p>
                <p className="text-body-sm text-text-secondary" style={{ marginTop: 4 }}>Migrate your data from Cliniko</p>
              </div>
            </button>
          </div>
        )}

        {importStep === "upload" && (
          <Flex vertical gap={16}>
            <FormSelect label="Import type" options={[{ value: "clients", label: "Clients" }, { value: "contacts", label: "Contacts" }, { value: "appointments", label: "Appointments" }]} defaultValue="clients" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, borderRadius: 8, border: '2px dashed var(--ant-color-border)', padding: 40, textAlign: 'center', transition: 'all 0.2s' }} className="hover:border-primary hover:bg-purple-50">
              <UploadOutlined style={{ fontSize: 40, color: 'var(--ant-color-text-secondary)' }} />
              <div>
                <p className="text-body-md text-text">Drag and drop your CSV file here</p>
                <p className="text-body-sm text-text-secondary">or click to browse</p>
              </div>
            </div>
            <Flex align="center" gap={8} style={{ borderRadius: 8, backgroundColor: '#f0fdf4', padding: '8px 12px' }}>
              <FileTextOutlined style={{ fontSize: 16, color: '#16a34a' }} />
              <span className="text-body-sm" style={{ color: '#15803d' }}>client_export_march_2026.csv</span>
              <Badge variant="green">Ready</Badge>
              <span className="text-caption-md text-text-secondary" style={{ marginLeft: 'auto' }}>10 rows · 10 columns</span>
            </Flex>
          </Flex>
        )}

        {importStep === "mapping" && (
          <Flex vertical gap={16}>
            <Alert variant="info">Map each CSV column to a splose field. Unmapped columns will be skipped.</Alert>
            <DataTable>
              <TableHead><Th>CSV column</Th><Th>Sample data</Th><Th>splose field</Th><Th>Status</Th></TableHead>
              <TableBody>
                {csvColumns.map((col) => (
                  <Tr key={col}>
                    <Td><span style={{ fontFamily: 'monospace' }} className="text-body-sm text-text">{col}</span></Td>
                    <Td><span className="text-body-sm text-text-secondary">{previewData[0][col as keyof typeof previewData[0]] || "\u2014"}</span></Td>
                    <Td><FormSelect options={sploseFields} value={columnMapping[col] || ""} onChange={(value) => setColumnMapping((prev) => ({ ...prev, [col]: value }))} /></Td>
                    <Td>
                      {columnMapping[col] ? (
                        <Flex align="center" gap={4} style={{ color: '#16a34a' }}>
                          <CheckCircleOutlined style={{ fontSize: 16 }} />
                          <span className="text-body-sm">Mapped</span>
                        </Flex>
                      ) : (
                        <span className="text-body-sm text-text-secondary">Skipped</span>
                      )}
                    </Td>
                  </Tr>
                ))}
              </TableBody>
            </DataTable>
            <p className="text-caption-md text-text-secondary">{Object.values(columnMapping).filter(Boolean).length} of {csvColumns.length} columns mapped</p>
          </Flex>
        )}

        {importStep === "preview" && (
          <Flex vertical gap={16}>
            <Alert variant="info">Review the data below. {previewData.length} records will be imported as clients.</Alert>
            <div style={{ overflowX: 'auto' }}>
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
                        <Td key={col}><span className="text-body-sm text-text">{row[col as keyof typeof row] || "\u2014"}</span></Td>
                      ))}
                      <Td>
                        {i === 3 ? (
                          <Flex align="center" gap={4} style={{ color: '#ca8a04' }}>
                            <WarningOutlined style={{ fontSize: 14 }} />
                            <span className="text-body-sm">Under 18</span>
                          </Flex>
                        ) : (
                          <Flex align="center" gap={4} style={{ color: '#16a34a' }}>
                            <CheckCircleOutlined style={{ fontSize: 14 }} />
                            <span className="text-body-sm">Valid</span>
                          </Flex>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </TableBody>
              </DataTable>
            </div>
            <Flex align="center" gap={16} style={{ borderRadius: 8, backgroundColor: 'var(--ant-color-bg-layout)', padding: 12 }}>
              <Flex align="center" gap={6}><CheckCircleOutlined style={{ fontSize: 16, color: '#16a34a' }} /><span className="text-body-sm text-text">4 valid</span></Flex>
              <Flex align="center" gap={6}><WarningOutlined style={{ fontSize: 16, color: '#ca8a04' }} /><span className="text-body-sm text-text">1 warning</span></Flex>
              <Flex align="center" gap={6}><span className="text-body-sm text-text-secondary">0 errors</span></Flex>
            </Flex>
          </Flex>
        )}

        {importStep === "done" && (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', height: 64, width: 64, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#dcfce7' }}>
                <CheckCircleOutlined style={{ fontSize: 32, color: '#16a34a' }} />
              </div>
            </div>
            <h3 className="text-heading-lg text-text" style={{ marginBottom: 8 }}>Import complete!</h3>
            <p className="text-body-md text-text-secondary" style={{ marginBottom: 16 }}>Successfully imported 5 clients into splose.</p>
            <div style={{ maxWidth: 320, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8, borderRadius: 8, backgroundColor: 'var(--ant-color-bg-layout)', padding: 16 }}>
              <Flex justify="space-between" className="text-body-sm"><span className="text-text-secondary">Total records</span><span className="text-text">5</span></Flex>
              <Flex justify="space-between" className="text-body-sm"><span className="text-text-secondary">Imported</span><span style={{ color: '#16a34a' }}>5</span></Flex>
              <Flex justify="space-between" className="text-body-sm"><span className="text-text-secondary">Skipped</span><span className="text-text">0</span></Flex>
              <Flex justify="space-between" className="text-body-sm"><span className="text-text-secondary">Errors</span><span className="text-text">0</span></Flex>
            </div>
          </div>
        )}
      </Modal>

      {/* View details modal */}
      <Modal open={!!viewRow} onClose={() => setViewRow(null)} title="Import details" maxWidth="md" footer={<Button variant="secondary" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow && (
          <Flex vertical gap={12}>
            <Flex justify="space-between" style={{ borderBottom: '1px solid var(--ant-color-border)', paddingBottom: 8 }}><span className="text-label-lg text-text-secondary">Type</span><span className="text-body-md text-text">{viewRow.type}</span></Flex>
            <Flex justify="space-between" style={{ borderBottom: '1px solid var(--ant-color-border)', paddingBottom: 8 }}><span className="text-label-lg text-text-secondary">Status</span><Badge variant={viewRow.statusVariant}>{viewRow.status}</Badge></Flex>
            <Flex justify="space-between" style={{ borderBottom: '1px solid var(--ant-color-border)', paddingBottom: 8 }}><span className="text-label-lg text-text-secondary">Message</span><span className="text-body-md text-text">{viewRow.message || "\u2014"}</span></Flex>
            <Flex justify="space-between" style={{ borderBottom: '1px solid var(--ant-color-border)', paddingBottom: 8 }}><span className="text-label-lg text-text-secondary">Created</span><span className="text-body-md text-text">{viewRow.createdAt}</span></Flex>
            <Flex justify="space-between"><span className="text-label-lg text-text-secondary">Last updated</span><span className="text-body-md text-text">{viewRow.updatedAt}</span></Flex>
          </Flex>
        )}
      </Modal>

      {/* Re-import confirmation modal */}
      <Modal open={!!reImportRow} onClose={() => setReImportRow(null)} title="Re-import" maxWidth="sm" footer={<><Button variant="secondary" onClick={() => setReImportRow(null)}>Cancel</Button><Button variant="primary" onClick={() => setReImportRow(null)}>Re-import</Button></>}>
        <p className="text-body-md text-text-secondary">Re-import this file? This will process the original file again.</p>
        {reImportRow && (<div style={{ marginTop: 12, borderRadius: 8, backgroundColor: 'var(--ant-color-bg-layout)', padding: 12 }}><p className="text-label-lg text-text">{reImportRow.type} import</p><p className="text-body-sm text-text-secondary">Created: {reImportRow.createdAt}</p></div>)}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal open={!!deleteRow} onClose={() => setDeleteRow(null)} title="Delete import" maxWidth="sm" footer={<><Button variant="secondary" onClick={() => setDeleteRow(null)}>Cancel</Button><Button variant="danger" onClick={() => setDeleteRow(null)}>Delete</Button></>}>
        <p className="text-body-md text-text-secondary">Delete this import record? This action cannot be undone.</p>
        {deleteRow && (<div style={{ marginTop: 12, borderRadius: 8, backgroundColor: 'var(--ant-color-bg-layout)', padding: 12 }}><p className="text-label-lg text-text">{deleteRow.type} import</p><p className="text-body-sm text-text-secondary">Created: {deleteRow.createdAt}</p></div>)}
      </Modal>
    </div>
  );
}
