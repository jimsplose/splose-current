"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UploadOutlined, MessageOutlined, ReadOutlined, FileExcelOutlined, DatabaseOutlined, CheckCircleOutlined, WarningOutlined, ArrowLeftOutlined, ArrowRightOutlined, FileTextOutlined } from "@ant-design/icons";
import { Card, Badge, Pagination, Dropdown, DropdownTriggerButton, Modal, FormSelect, Alert, PageHeader, Text, Grid, Divider } from "@/components/ds";

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

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(importHistory.length / pageSize);
  const pageItems = importHistory.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function handleAction(value: string, row: ImportRow) {
    switch (value) { case "view": setViewRow(row); break; case "re-import": setReImportRow(row); break; case "delete": setDeleteRow(row); break; }
  }

  const columns: ColumnsType<ImportRow> = [
    {
      key: "type",
      title: "Type",
      render: (_, row) => <Text as="span" variant="label/lg">{row.type}</Text>,
    },
    {
      key: "status",
      title: "Status",
      render: (_, row) => <Badge variant={row.statusVariant}>{row.status}</Badge>,
    },
    {
      key: "message",
      title: "Message",
      render: (_, row) => <span style={{ color: 'var(--color-text-secondary)' }}>{row.message || "\u2014"}</span>,
    },
    {
      key: "lastActivity",
      title: "Last Activity",
      render: (_, row) => (
        <div style={{ fontSize: 14 }}>
          <div style={{ color: 'var(--color-text-secondary)' }}>Created: {row.createdAt}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>Updated: {row.updatedAt}</div>
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <Dropdown align="right" trigger={<DropdownTriggerButton />} items={dropdownItems} onSelect={(value) => handleAction(value, row)} />
      ),
    },
  ];

  // Mapping step columns
  const mappingColumns: ColumnsType<{ col: string }> = [
    {
      key: "csvColumn",
      title: "CSV column",
      render: (_, row) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{row.col}</span>,
    },
    {
      key: "sampleData",
      title: "Sample data",
      render: (_, row) => (
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {previewData[0][row.col as keyof typeof previewData[0]] || "\u2014"}
        </span>
      ),
    },
    {
      key: "sploseField",
      title: "splose field",
      render: (_, row) => (
        <FormSelect
          options={sploseFields}
          value={columnMapping[row.col] || ""}
          onChange={(value) => setColumnMapping((prev) => ({ ...prev, [row.col]: value }))}
        />
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (_, row) => (
        columnMapping[row.col] ? (
          <Flex align="center" gap={4} style={{ color: '#16a34a' }}>
            <CheckCircleOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
            <span style={{ fontSize: 12 }}>Mapped</span>
          </Flex>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Skipped</span>
        )
      ),
    },
  ];

  // Preview step: build dynamic columns from mapped csvColumns
  const mappedCols = csvColumns.filter((c) => columnMapping[c]);
  const previewColumns: ColumnsType<typeof previewData[number]> = [
    ...mappedCols.map((col) => ({
      key: col,
      title: sploseFields.find((f) => f.value === columnMapping[col])?.label ?? col,
      render: (_: unknown, row: typeof previewData[number]) => (
        <span style={{ fontSize: 12 }}>{row[col as keyof typeof row] || "\u2014"}</span>
      ),
    })),
    {
      key: "rowStatus",
      title: "Status",
      render: (_: unknown, row: typeof previewData[number], i: number) => (
        i === 3 ? (
          <Flex align="center" gap={4} style={{ color: '#ca8a04' }}>
            <WarningOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
            <span style={{ fontSize: 12 }}>Under 18</span>
          </Flex>
        ) : (
          <Flex align="center" gap={4} style={{ color: '#16a34a' }}>
            <CheckCircleOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} />
            <span style={{ fontSize: 12 }}>Valid</span>
          </Flex>
        )
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Concierge data import banner */}
      <Card tint="muted" padding={24} style={{ marginBottom: 32 }}>
        <Flex align="flex-start" gap={16}>
          <div style={{ flexShrink: 0, fontSize: '2.25rem' }}><span role="img" aria-label="folder">📂</span></div>
          <div>
            <Text variant="heading/lg" style={{ marginBottom: 4 }}>Concierge data import</Text>
            <Text variant="body/md" color="secondary" style={{ marginBottom: 12 }}>Data importing is complicated. Chat with us to schedule a data import.</Text>
            <Flex align="center" gap={16}>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500 }}>
                <MessageOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} /> Chat with us
              </a>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500 }}>
                <ReadOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} /> Help guide
              </a>
            </Flex>
          </div>
        </Flex>
      </Card>

      <PageHeader title="Import data">
        <Button type="primary" onClick={startImportFlow}>
          <UploadOutlined style={{ fontSize: 16, color: 'inherit' }} /> Import
        </Button>
      </PageHeader>

      <Table columns={columns} dataSource={pageItems} rowKey="id" pagination={false} />
      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={importHistory.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} />

      {/* Import multi-step modal */}
      <Modal
        open={importOpen}
        onClose={handleImportClose}
        title={importStep === "source" ? "Import from" : importStep === "upload" ? "Upload CSV file" : importStep === "mapping" ? "Map columns" : importStep === "preview" ? "Preview import" : "Import complete"}
        maxWidth={importStep === "mapping" || importStep === "preview" ? "xl" : "md"}
        footer={
          importStep === "done" ? (
            <Button type="primary" onClick={handleImportClose}>Done</Button>
          ) : importStep !== "source" ? (
            <Flex justify="space-between" align="center" style={{ width: '100%' }}>
              <Button type="text" onClick={handleImportBack}>
                <ArrowLeftOutlined style={{ fontSize: 16, color: 'var(--ant-color-text, #414549)' }} /> Back
              </Button>
              <Flex align="center" gap={8}>
                <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                  Step {importStep === "upload" ? "1" : importStep === "mapping" ? "2" : "3"} of 3
                </span>
                <Button type="primary" onClick={handleImportNext}>
                  {importStep === "preview" ? "Start import" : "Continue"} <ArrowRightOutlined style={{ fontSize: 16, color: 'inherit' }} />
                </Button>
              </Flex>
            </Flex>
          ) : undefined
        }
      >
        {importStep === "source" && (
          <Grid cols={2} gap="md">
            <Card interactive onClick={handleImportNext} padding={24}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                <FileExcelOutlined style={{ fontSize: 40, color: 'var(--ant-color-primary, #8250FF)' }} />
                <div>
                  <Text variant="label/lg">CSV</Text>
                  <Text variant="body/sm" color="secondary" style={{ marginTop: 4 }}>Import clients, contacts, or appointments from a CSV file</Text>
                </div>
              </div>
            </Card>
            <Card interactive onClick={handleImportNext} padding={24}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                <DatabaseOutlined style={{ fontSize: 40, color: 'var(--ant-color-primary, #8250FF)' }} />
                <div>
                  <Text variant="label/lg">Cliniko</Text>
                  <Text variant="body/sm" color="secondary" style={{ marginTop: 4 }}>Migrate your data from Cliniko</Text>
                </div>
              </div>
            </Card>
          </Grid>
        )}

        {importStep === "upload" && (
          <Flex vertical gap={16}>
            <FormSelect label="Import type" options={[{ value: "clients", label: "Clients" }, { value: "contacts", label: "Contacts" }, { value: "appointments", label: "Appointments" }]} defaultValue="clients" />
            <Card variant="dashed" padding={40}>
              <Flex vertical align="center" gap={12} style={{ textAlign: 'center' }}>
                <UploadOutlined style={{ fontSize: 40, color: 'var(--ant-color-text-secondary, #6E6E64)' }} />
                <div>
                  <p style={{ fontSize: 14 }}>Drag and drop your CSV file here</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>or click to browse</p>
                </div>
              </Flex>
            </Card>
            <Flex align="center" gap={8} style={{ borderRadius: 8, backgroundColor: '#f0fdf4', padding: '8px 12px' }}>
              <FileTextOutlined style={{ fontSize: 16, color: '#16a34a' }} />
              <span style={{ fontSize: 12, color: '#15803d' }}>client_export_march_2026.csv</span>
              <Badge variant="green">Ready</Badge>
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>10 rows · 10 columns</span>
            </Flex>
          </Flex>
        )}

        {importStep === "mapping" && (
          <Flex vertical gap={16}>
            <Alert variant="info">Map each CSV column to a splose field. Unmapped columns will be skipped.</Alert>
            <Table
              columns={mappingColumns}
              dataSource={csvColumns.map((col) => ({ col }))}
              rowKey="col"
              pagination={false}
            />
            <p style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{Object.values(columnMapping).filter(Boolean).length} of {csvColumns.length} columns mapped</p>
          </Flex>
        )}

        {importStep === "preview" && (
          <Flex vertical gap={16}>
            <Alert variant="info">Review the data below. {previewData.length} records will be imported as clients.</Alert>
            <div style={{ overflowX: 'auto' }}>
              <Table
                columns={previewColumns}
                dataSource={previewData}
                rowKey={(_, i) => String(i)}
                pagination={false}
              />
            </div>
            <Flex align="center" gap={16} style={{ borderRadius: 8, backgroundColor: 'var(--color-fill-tertiary)', padding: 12 }}>
              <Flex align="center" gap={6}><CheckCircleOutlined style={{ fontSize: 16, color: '#16a34a' }} /><span style={{ fontSize: 12 }}>4 valid</span></Flex>
              <Flex align="center" gap={6}><WarningOutlined style={{ fontSize: 16, color: '#ca8a04' }} /><span style={{ fontSize: 12 }}>1 warning</span></Flex>
              <Flex align="center" gap={6}><span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>0 errors</span></Flex>
            </Flex>
          </Flex>
        )}

        {importStep === "done" && (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <Flex justify="center" style={{ marginBottom: 16 }}>
              <Flex align="center" justify="center" style={{ height: 64, width: 64, borderRadius: '50%', backgroundColor: '#dcfce7' }}>
                <CheckCircleOutlined style={{ fontSize: 32, color: '#16a34a' }} />
              </Flex>
            </Flex>
            <Text variant="heading/lg" as="h3" style={{ marginBottom: 8 }}>Import complete!</Text>
            <Text variant="body/md" color="secondary" style={{ marginBottom: 16 }}>Successfully imported 5 clients into splose.</Text>
            <Flex vertical gap={8} style={{ padding: 16, maxWidth: 320, margin: '0 auto', borderRadius: 8, backgroundColor: 'var(--color-fill-tertiary)' }}>
              <Flex justify="space-between" style={{ fontSize: 12 }}><span style={{ color: 'var(--color-text-secondary)' }}>Total records</span><span>5</span></Flex>
              <Flex justify="space-between" style={{ fontSize: 12 }}><span style={{ color: 'var(--color-text-secondary)' }}>Imported</span><span style={{ color: '#16a34a' }}>5</span></Flex>
              <Flex justify="space-between" style={{ fontSize: 12 }}><span style={{ color: 'var(--color-text-secondary)' }}>Skipped</span><span>0</span></Flex>
              <Flex justify="space-between" style={{ fontSize: 12 }}><span style={{ color: 'var(--color-text-secondary)' }}>Errors</span><span>0</span></Flex>
            </Flex>
          </div>
        )}
      </Modal>

      {/* View details modal */}
      <Modal open={!!viewRow} onClose={() => setViewRow(null)} title="Import details" maxWidth="md" footer={<Button onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow && (
          <Flex vertical gap={12}>
            <Flex justify="space-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}><Text as="span" variant="label/lg" color="secondary">Type</Text><Text as="span" variant="body/md">{viewRow.type}</Text></Flex>
            <Flex justify="space-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}><Text as="span" variant="label/lg" color="secondary">Status</Text><Badge variant={viewRow.statusVariant}>{viewRow.status}</Badge></Flex>
            <Flex justify="space-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}><Text as="span" variant="label/lg" color="secondary">Message</Text><Text as="span" variant="body/md">{viewRow.message || "\u2014"}</Text></Flex>
            <Flex justify="space-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}><Text as="span" variant="label/lg" color="secondary">Created</Text><Text as="span" variant="body/md">{viewRow.createdAt}</Text></Flex>
            <Flex justify="space-between"><Text as="span" variant="label/lg" color="secondary">Last updated</Text><Text as="span" variant="body/md">{viewRow.updatedAt}</Text></Flex>
          </Flex>
        )}
      </Modal>

      {/* Re-import confirmation modal */}
      <Modal open={!!reImportRow} onClose={() => setReImportRow(null)} title="Re-import" maxWidth="sm" footer={<><Button onClick={() => setReImportRow(null)}>Cancel</Button><Button type="primary" onClick={() => setReImportRow(null)}>Re-import</Button></>}>
        <Text variant="body/md" color="secondary">Re-import this file? This will process the original file again.</Text>
        {reImportRow && (<div style={{ marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: 'var(--color-fill-tertiary)' }}><Text variant="label/lg">{reImportRow.type} import</Text><Text variant="body/sm" color="secondary">Created: {reImportRow.createdAt}</Text></div>)}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal open={!!deleteRow} onClose={() => setDeleteRow(null)} title="Delete import" maxWidth="sm" footer={<><Button onClick={() => setDeleteRow(null)}>Cancel</Button><Button danger onClick={() => setDeleteRow(null)}>Delete</Button></>}>
        <Text variant="body/md" color="secondary">Delete this import record? This action cannot be undone.</Text>
        {deleteRow && (<div style={{ marginTop: 12, padding: 12, borderRadius: 8, backgroundColor: 'var(--color-fill-tertiary)' }}><Text variant="label/lg">{deleteRow.type} import</Text><Text variant="body/sm" color="secondary">Created: {deleteRow.createdAt}</Text></div>)}
      </Modal>
    </div>
  );
}
