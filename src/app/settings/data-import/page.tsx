"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UploadOutlined, MessageOutlined, ReadOutlined, FileExcelOutlined, DatabaseOutlined, CheckCircleOutlined, WarningOutlined, ArrowLeftOutlined, ArrowRightOutlined, FileTextOutlined } from "@ant-design/icons";
import { Card, Badge, Pagination, Dropdown, DropdownTriggerButton, Modal, FormSelect, Alert, PageHeader, Text, Grid } from "@/components/ds";
import styles from "./DataImport.module.css";

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
      render: (_, row) => <Text as="span" color="secondary">{row.message || "—"}</Text>,
    },
    {
      key: "lastActivity",
      title: "Last Activity",
      render: (_, row) => (
        <div className={styles.lastActivityCell}>
          <Text as="div" color="secondary">Created: {row.createdAt}</Text>
          <Text as="div" color="secondary">Updated: {row.updatedAt}</Text>
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
      render: (_, row) => <span className={styles.mono}>{row.col}</span>,
    },
    {
      key: "sampleData",
      title: "Sample data",
      render: (_, row) => (
        <Text as="span" variant="body/sm" color="secondary">
          {previewData[0][row.col as keyof typeof previewData[0]] || "—"}
        </Text>
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
          <Flex align="center" gap={4} className={styles.statusValid}>
            <CheckCircleOutlined className={styles.iconMd} />
            <Text as="span" variant="body/sm">Mapped</Text>
          </Flex>
        ) : (
          <Text as="span" variant="body/sm" color="secondary">Skipped</Text>
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
        <Text as="span" variant="body/sm">{row[col as keyof typeof row] || "—"}</Text>
      ),
    })),
    {
      key: "rowStatus",
      title: "Status",
      render: (_: unknown, row: typeof previewData[number], i: number) => (
        i === 3 ? (
          <Flex align="center" gap={4} className={styles.statusWarn}>
            <WarningOutlined className={styles.iconMd} />
            <Text as="span" variant="body/sm">Under 18</Text>
          </Flex>
        ) : (
          <Flex align="center" gap={4} className={styles.statusValid}>
            <CheckCircleOutlined className={styles.iconMd} />
            <Text as="span" variant="body/sm">Valid</Text>
          </Flex>
        )
      ),
    },
  ];

  return (
    <div className={styles.shell}>
      {/* Concierge data import banner */}
      <Card tint="muted" padding={24} className={styles.banner}>
        <Flex align="flex-start" gap={16}>
          <div className={styles.bannerEmoji}><span role="img" aria-label="folder">📂</span></div>
          <div>
            <Text variant="heading/lg" mb={4}>Concierge data import</Text>
            <Text variant="body/md" color="secondary" mb={12}>Data importing is complicated. Chat with us to schedule a data import.</Text>
            <Flex align="center" gap={16}>
              <Button type="link" size="small" href="#" icon={<MessageOutlined />}>Chat with us</Button>
              <Button type="link" size="small" href="#" icon={<ReadOutlined />}>Help guide</Button>
            </Flex>
          </div>
        </Flex>
      </Card>

      <PageHeader title="Import data">
        <Button type="primary" onClick={startImportFlow} icon={<UploadOutlined />}>Import</Button>
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
            <Flex justify="space-between" align="center" className={styles.modalFooter}>
              <Button type="text" onClick={handleImportBack} icon={<ArrowLeftOutlined />}>Back</Button>
              <Flex align="center" gap={8}>
                <Text as="span" variant="caption/sm" color="secondary">
                  Step {importStep === "upload" ? "1" : importStep === "mapping" ? "2" : "3"} of 3
                </Text>
                <Button type="primary" onClick={handleImportNext}>
                  {importStep === "preview" ? "Start import" : "Continue"} <ArrowRightOutlined />
                </Button>
              </Flex>
            </Flex>
          ) : undefined
        }
      >
        {importStep === "source" && (
          <Grid cols={2} gap="md">
            <Card interactive onClick={handleImportNext} padding={24}>
              <div className={styles.uploadStep}>
                <FileExcelOutlined className={styles.iconLgPrimary} />
                <div>
                  <Text variant="label/lg">CSV</Text>
                  <Text variant="body/sm" color="secondary" mt={4}>Import clients, contacts, or appointments from a CSV file</Text>
                </div>
              </div>
            </Card>
            <Card interactive onClick={handleImportNext} padding={24}>
              <div className={styles.uploadStep}>
                <DatabaseOutlined className={styles.iconLgPrimary} />
                <div>
                  <Text variant="label/lg">Cliniko</Text>
                  <Text variant="body/sm" color="secondary" mt={4}>Migrate your data from Cliniko</Text>
                </div>
              </div>
            </Card>
          </Grid>
        )}

        {importStep === "upload" && (
          <Flex vertical gap={16}>
            <FormSelect label="Import type" options={[{ value: "clients", label: "Clients" }, { value: "contacts", label: "Contacts" }, { value: "appointments", label: "Appointments" }]} defaultValue="clients" />
            <Card variant="dashed" padding={40}>
              <Flex vertical align="center" gap={12} className={styles.uploadStepCenter}>
                <UploadOutlined className={styles.iconLgMuted} />
                <div>
                  <Text variant="body/md">Drag and drop your CSV file here</Text>
                  <Text variant="body/sm" color="secondary">or click to browse</Text>
                </div>
              </Flex>
            </Card>
            <Flex align="center" gap={8} className={styles.successPill}>
              <FileTextOutlined className={styles.iconStatusValid} />
              <span className={styles.successPillFile}>client_export_march_2026.csv</span>
              <Badge variant="green">Ready</Badge>
              <span className={styles.successPillMeta}>10 rows · 10 columns</span>
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
            <Text variant="caption/sm" color="secondary">{Object.values(columnMapping).filter(Boolean).length} of {csvColumns.length} columns mapped</Text>
          </Flex>
        )}

        {importStep === "preview" && (
          <Flex vertical gap={16}>
            <Alert variant="info">Review the data below. {previewData.length} records will be imported as clients.</Alert>
            <div className={styles.tableScroll}>
              <Table
                columns={previewColumns}
                dataSource={previewData}
                rowKey={(_, i) => String(i)}
                pagination={false}
              />
            </div>
            <Flex align="center" gap={16} className={styles.summaryBar}>
              <Flex align="center" gap={6}><CheckCircleOutlined className={styles.iconStatusValid} /><Text as="span" variant="body/sm">4 valid</Text></Flex>
              <Flex align="center" gap={6}><WarningOutlined className={styles.iconStatusWarn} /><Text as="span" variant="body/sm">1 warning</Text></Flex>
              <Flex align="center" gap={6}><Text as="span" variant="body/sm" color="secondary">0 errors</Text></Flex>
            </Flex>
          </Flex>
        )}

        {importStep === "done" && (
          <div className={styles.doneBlock}>
            <Flex justify="center" className={styles.successCircleWrap}>
              <Flex align="center" justify="center" className={styles.successCircle}>
                <CheckCircleOutlined className={styles.iconStatusValidLg} />
              </Flex>
            </Flex>
            <Text variant="heading/lg" as="h3" mb={8}>Import complete!</Text>
            <Text variant="body/md" color="secondary" mb={16}>Successfully imported 5 clients into splose.</Text>
            <Flex vertical gap={8} className={styles.summaryStats}>
              <Flex justify="space-between" className={styles.statRow}><Text as="span" variant="body/sm" color="secondary">Total records</Text><Text as="span" variant="body/sm">5</Text></Flex>
              <Flex justify="space-between" className={styles.statRow}><Text as="span" variant="body/sm" color="secondary">Imported</Text><span className={styles.statValueSuccess}>5</span></Flex>
              <Flex justify="space-between" className={styles.statRow}><Text as="span" variant="body/sm" color="secondary">Skipped</Text><Text as="span" variant="body/sm">0</Text></Flex>
              <Flex justify="space-between" className={styles.statRow}><Text as="span" variant="body/sm" color="secondary">Errors</Text><Text as="span" variant="body/sm">0</Text></Flex>
            </Flex>
          </div>
        )}
      </Modal>

      {/* View details modal */}
      <Modal open={!!viewRow} onClose={() => setViewRow(null)} title="Import details" maxWidth="md" footer={<Button onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow && (
          <Flex vertical gap={12}>
            <Flex justify="space-between" className={styles.detailRow}><Text as="span" variant="label/lg" color="secondary">Type</Text><Text as="span" variant="body/md">{viewRow.type}</Text></Flex>
            <Flex justify="space-between" className={styles.detailRow}><Text as="span" variant="label/lg" color="secondary">Status</Text><Badge variant={viewRow.statusVariant}>{viewRow.status}</Badge></Flex>
            <Flex justify="space-between" className={styles.detailRow}><Text as="span" variant="label/lg" color="secondary">Message</Text><Text as="span" variant="body/md">{viewRow.message || "—"}</Text></Flex>
            <Flex justify="space-between" className={styles.detailRow}><Text as="span" variant="label/lg" color="secondary">Created</Text><Text as="span" variant="body/md">{viewRow.createdAt}</Text></Flex>
            <Flex justify="space-between"><Text as="span" variant="label/lg" color="secondary">Last updated</Text><Text as="span" variant="body/md">{viewRow.updatedAt}</Text></Flex>
          </Flex>
        )}
      </Modal>

      {/* Re-import confirmation modal */}
      <Modal open={!!reImportRow} onClose={() => setReImportRow(null)} title="Re-import" maxWidth="sm" footer={<><Button onClick={() => setReImportRow(null)}>Cancel</Button><Button type="primary" onClick={() => setReImportRow(null)}>Re-import</Button></>}>
        <Text variant="body/md" color="secondary">Re-import this file? This will process the original file again.</Text>
        {reImportRow && (<div className={styles.infoBox}><Text variant="label/lg">{reImportRow.type} import</Text><Text variant="body/sm" color="secondary">Created: {reImportRow.createdAt}</Text></div>)}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal open={!!deleteRow} onClose={() => setDeleteRow(null)} title="Delete import" maxWidth="sm" footer={<><Button onClick={() => setDeleteRow(null)}>Cancel</Button><Button danger onClick={() => setDeleteRow(null)}>Delete</Button></>}>
        <Text variant="body/md" color="secondary">Delete this import record? This action cannot be undone.</Text>
        {deleteRow && (<div className={styles.infoBox}><Text variant="label/lg">{deleteRow.type} import</Text><Text variant="body/sm" color="secondary">Created: {deleteRow.createdAt}</Text></div>)}
      </Modal>
    </div>
  );
}
