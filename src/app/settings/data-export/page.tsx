"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  Button,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Badge,
  FormSelect,
  Pagination,
  Dropdown,
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

const ITEMS_PER_PAGE = 10;

const dropdownItems = [
  { label: "Download", value: "download" },
  { label: "Delete", value: "delete", danger: true },
];

export default function DataExportPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(exportHistory.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = exportHistory.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-text">Data export</h1>

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
          <label className="mb-1 block text-sm font-medium text-text-secondary">Date *</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder="Start date"
            />
            <span className="text-text-secondary">–</span>
            <input
              type="date"
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder="End date"
            />
          </div>
        </div>
        <Button variant="primary">Export</Button>
      </div>

      <label className="mb-6 flex items-center gap-2 text-sm text-text">
        <input type="checkbox" className="rounded border-border" />
        Include archived
      </label>

      <hr className="my-6 border-border" />

      {/* Export history */}
      <h2 className="mb-4 text-lg font-bold text-text">Export history</h2>

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
            <tr key={row.id} className="hover:bg-gray-50">
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
                  trigger={
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4 text-text-secondary" />
                    </button>
                  }
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
        totalItems={exportHistory.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
