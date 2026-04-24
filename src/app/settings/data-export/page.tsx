"use client";

import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Badge, FormSelect, FormInput, Pagination, Checkbox, Dropdown, DropdownTriggerButton, Modal, PageHeader } from "@/components/ds";
import FormLabel from "@/components/ds/FormLabel";

interface ExportRow {
  id: number;
  dataExport: string;
  dateRange: string;
  includeArchived: string;
  createdAt: string;
  createdBy: string;
  status: "Done" | "Error";
  records: string;
}

const exportHistory: ExportRow[] = [
  {
    id: 1,
    dataExport: "Appointment",
    dateRange: "17 Jan 2026 - 18 Mar 2026",
    includeArchived: "No",
    createdAt: "2:18 pm, 17 Mar 2026",
    createdBy: "Ruvi R.",
    status: "Done",
    records: "354(89.2 KB)",
  },
  {
    id: 2,
    dataExport: "Waitlist",
    dateRange: "1 Jan 2024 - 3 Apr 2025",
    includeArchived: "Yes",
    createdAt: "4:57 pm, 12 Mar 2026",
    createdBy: "Hrishikes h Koli",
    status: "Error",
    records: "0(0 B)",
  },
  {
    id: 3,
    dataExport: "Waitlist",
    dateRange: "1 Jan 2024 - 17 Mar 2024",
    includeArchived: "Yes",
    createdAt: "4:56 pm, 12 Mar 2026",
    createdBy: "Hrishikes h Koli",
    status: "Error",
    records: "0(0 B)",
  },
  {
    id: 4,
    dataExport: "Waitlist",
    dateRange: "5 Mar 2024 - 17 Mar 2024",
    includeArchived: "No",
    createdAt: "4:56 pm, 12 Mar 2026",
    createdBy: "Hrishikes h Koli",
    status: "Error",
    records: "0(0 B)",
  },
  {
    id: 5,
    dataExport: "Waitlist",
    dateRange: "5 Mar 2024 - 8 Apr 2024",
    includeArchived: "No",
    createdAt: "11:00 am, 12 Mar 2026",
    createdBy: "Hrishikes h Koli",
    status: "Error",
    records: "0(0 B)",
  },
  {
    id: 6,
    dataExport: "Case",
    dateRange: "5 Mar 2024 - 8 Apr 2024",
    includeArchived: "No",
    createdAt: "11:00 am, 12 Mar 2026",
    createdBy: "Hrishikes h Koli",
    status: "Done",
    records: "1(689 B)",
  },
];

const dropdownItems = [
  { label: "Download", value: "download" },
  { label: "Re-export", value: "re-export" },
  { label: "Delete", value: "delete", danger: true },
];

export default function DataExportPage() {
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const [reExportRow, setReExportRow] = useState<ExportRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<ExportRow | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(exportHistory.length / pageSize);
  const pageItems = exportHistory.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function handleAction(value: string, row: ExportRow) {
    switch (value) {
      case "download":
        setDownloadMessage(`Downloading export file for "${row.dataExport}"...`);
        setTimeout(() => setDownloadMessage(null), 2500);
        break;
      case "re-export":
        setReExportRow(row);
        break;
      case "delete":
        setDeleteRow(row);
        break;
    }
  }

  const columns: ColumnsType<ExportRow> = [
    {
      key: "dataExport",
      title: "Data export",
      render: (_, row) => <span style={{ fontWeight: 500 }}>{row.dataExport}</span>,
    },
    { key: "dateRange", title: "Date range", dataIndex: "dateRange" },
    { key: "includeArchived", title: "Include Archived", dataIndex: "includeArchived" },
    { key: "createdAt", title: "Created at", dataIndex: "createdAt" },
    { key: "createdBy", title: "Created by", dataIndex: "createdBy" },
    {
      key: "status",
      title: "Status",
      render: (_, row) => (
        <Badge variant={row.status === "Done" ? "green" : "red"}>{row.status}</Badge>
      ),
    },
    { key: "records", title: "Records", dataIndex: "records" },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <Dropdown
          align="right"
          trigger={<DropdownTriggerButton />}
          items={dropdownItems}
          onSelect={(value) => handleAction(value, row)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Data export" />

      {/* Download toast */}
      {downloadMessage && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 60, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white', padding: '12px 16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: 14 }}>{downloadMessage}</p>
        </div>
      )}

      {/* Export form */}
      <Flex wrap="wrap" align="flex-end" gap={16} style={{ marginBottom: 24 }}>
        <div style={{ width: 192 }}>
          <FormSelect
            label="Export"
            options={[
              { value: "appointments", label: "Appointments" },
              { value: "clients", label: "Clients" },
              { value: "contacts", label: "Contacts" },
              { value: "invoices", label: "Invoices" },
              { value: "payments", label: "Payments" },
              { value: "waitlist", label: "Waitlist" },
              { value: "cases", label: "Cases" },
            ]}
            defaultValue="appointments"
          />
        </div>
        <div>
          <FormLabel size="sm" style={{ color: 'var(--color-text-secondary)' }} required>Date</FormLabel>
          <Flex align="center" gap={8}>
            <FormInput
              type="date"
              placeholder="Start date"
            />
            <span style={{ color: 'var(--color-text-secondary)' }}>&ndash;</span>
            <FormInput
              type="date"
              placeholder="End date"
            />
          </Flex>
        </div>
        <Button type="primary">Export</Button>
      </Flex>

      <div style={{ marginBottom: 24 }}>
        <Checkbox label="Include archived" />
      </div>

      <hr style={{ margin: '24px 0', borderColor: 'var(--color-border)' }} />

      {/* Export history */}
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Export history</h2>

      <Table columns={columns} dataSource={pageItems} rowKey="id" pagination={false} />

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={exportHistory.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} />

      {/* Re-export confirmation modal */}
      <Modal
        open={!!reExportRow}
        onClose={() => setReExportRow(null)}
        title="Re-export"
        maxWidth="sm"
        footer={
          <>
            <Button onClick={() => setReExportRow(null)}>Cancel</Button>
            <Button type="primary" onClick={() => setReExportRow(null)}>Re-export</Button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Re-run this export with the same settings?
        </p>
        {reExportRow && (
          <div style={{ marginTop: 12, borderRadius: 8, backgroundColor: '#f9fafb', padding: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 500 }}>{reExportRow.dataExport}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{reExportRow.dateRange}</p>
          </div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteRow}
        onClose={() => setDeleteRow(null)}
        title="Delete export"
        maxWidth="sm"
        footer={
          <>
            <Button onClick={() => setDeleteRow(null)}>Cancel</Button>
            <Button danger onClick={() => setDeleteRow(null)}>Delete</Button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Delete this export record? This action cannot be undone.
        </p>
        {deleteRow && (
          <div style={{ marginTop: 12, borderRadius: 8, backgroundColor: '#f9fafb', padding: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 500 }}>{deleteRow.dataExport}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{deleteRow.dateRange}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
