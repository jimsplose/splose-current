"use client";

import { useState } from "react";
import {
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  Badge,
  FormSelect,
  FormInput,
  Pagination,
  Checkbox,
  Dropdown,
  DropdownTriggerButton,
  Modal,
} from "@/components/ds";

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

  return (
    <div className="p-6">
      <h1 className="mb-6 text-display-lg">Data export</h1>

      {/* Download toast */}
      {downloadMessage && (
        <div className="fixed top-4 right-4 z-[60] rounded-lg border border-border bg-white px-4 py-3 shadow-lg">
          <p className="text-body-md text-text">{downloadMessage}</p>
        </div>
      )}

      {/* Export form */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="w-48">
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
          <label className="mb-1 block text-label-lg text-text-secondary">Date *</label>
          <div className="flex items-center gap-2">
            <FormInput
              type="date"
              placeholder="Start date"
            />
            <span className="text-text-secondary">–</span>
            <FormInput
              type="date"
              placeholder="End date"
            />
          </div>
        </div>
        <Button variant="primary">Export</Button>
      </div>

      <div className="mb-6">
        <Checkbox label="Include archived" />
      </div>

      <hr className="my-6 border-border" />

      {/* Export history */}
      <h2 className="mb-4 text-heading-lg text-text">Export history</h2>

      <DataTable>
        <TableHead>
          <Th>Data export</Th>
          <Th>Date range</Th>
          <Th>Include Archived</Th>
          <Th>Created at</Th>
          <Th>Created by</Th>
          <Th>Status</Th>
          <Th>Records</Th>
          <Th>Actions</Th>
        </TableHead>
        <TableBody>
          {pageItems.map((row) => (
            <Tr key={row.id}>
              <Td>
                <span className="font-medium text-text">{row.dataExport}</span>
              </Td>
              <Td>{row.dateRange}</Td>
              <Td>{row.includeArchived}</Td>
              <Td>{row.createdAt}</Td>
              <Td>{row.createdBy}</Td>
              <Td>
                <Badge variant={row.status === "Done" ? "green" : "red"}>{row.status}</Badge>
              </Td>
              <Td>{row.records}</Td>
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

      <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={exportHistory.length} itemsPerPage={pageSize} onPageChange={setCurrentPage} />

      {/* Re-export confirmation modal */}
      <Modal
        open={!!reExportRow}
        onClose={() => setReExportRow(null)}
        title="Re-export"
        maxWidth="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReExportRow(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => setReExportRow(null)}>Re-export</Button>
          </>
        }
      >
        <p className="text-body-md text-text-secondary">
          Re-run this export with the same settings?
        </p>
        {reExportRow && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3">
            <p className="text-label-lg text-text">{reExportRow.dataExport}</p>
            <p className="text-body-sm text-text-secondary">{reExportRow.dateRange}</p>
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
            <Button variant="secondary" onClick={() => setDeleteRow(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => setDeleteRow(null)}>Delete</Button>
          </>
        }
      >
        <p className="text-body-md text-text-secondary">
          Delete this export record? This action cannot be undone.
        </p>
        {deleteRow && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3">
            <p className="text-label-lg text-text">{deleteRow.dataExport}</p>
            <p className="text-body-sm text-text-secondary">{deleteRow.dateRange}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
