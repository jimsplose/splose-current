"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import {
  Button,
  Tab,
  Navbar,
  Card,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
  FormSelect,
} from "@/components/ds";

const importTabs = [
  { label: "Clients", value: "clients" },
  { label: "Contacts", value: "contacts" },
  { label: "Appointments", value: "appointments" },
];

const fieldMappings: Record<string, { csvColumn: string; spField: string; mapped: boolean }[]> = {
  clients: [
    { csvColumn: "First Name", spField: "First name", mapped: true },
    { csvColumn: "Last Name", spField: "Last name", mapped: true },
    { csvColumn: "DOB", spField: "Date of birth", mapped: true },
    { csvColumn: "Phone", spField: "Phone number", mapped: true },
    { csvColumn: "Email Address", spField: "Email", mapped: true },
    { csvColumn: "Address Line 1", spField: "Address", mapped: true },
    { csvColumn: "Suburb", spField: "Suburb", mapped: true },
    { csvColumn: "Medicare No", spField: "Medicare number", mapped: false },
  ],
  contacts: [
    { csvColumn: "Name", spField: "Name", mapped: true },
    { csvColumn: "Type", spField: "Contact type", mapped: true },
    { csvColumn: "Company", spField: "Company", mapped: true },
    { csvColumn: "Email", spField: "Email", mapped: true },
    { csvColumn: "Phone", spField: "Work phone", mapped: true },
  ],
  appointments: [
    { csvColumn: "Date", spField: "Date", mapped: true },
    { csvColumn: "Time", spField: "Start time", mapped: true },
    { csvColumn: "Client", spField: "Client name", mapped: true },
    { csvColumn: "Service", spField: "Service type", mapped: true },
    { csvColumn: "Practitioner", spField: "Practitioner", mapped: true },
    { csvColumn: "Location", spField: "Location", mapped: false },
  ],
};

export default function CSVImportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("clients");
  const [fileUploaded, setFileUploaded] = useState(false);

  const mappings = fieldMappings[activeTab] || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar backHref="/settings/data-import" title="CSV Import">
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => router.push("/settings/data-import")}>Cancel</Button>
          <Button variant="primary" onClick={() => router.push("/settings/data-import")} disabled={!fileUploaded}>Import</Button>
        </div>
      </Navbar>

      <div className="border-b border-border px-6">
        <Tab items={importTabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Upload zone */}
          <div>
            <h3 className="mb-3 text-heading-md text-text">Upload CSV file</h3>
            {!fileUploaded ? (
              <button
                onClick={() => setFileUploaded(true)}
                className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-gray-50 py-12 transition-colors hover:border-primary hover:bg-primary/5"
              >
                <Upload className="mb-2 h-8 w-8 text-text-secondary" />
                <span className="text-body-md text-text">Click to upload or drag and drop</span>
                <span className="mt-1 text-caption-md text-text-secondary">CSV files only, max 10MB</span>
              </button>
            ) : (
              <Card padding="none" className="flex items-center gap-3 px-4 py-3">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <span className="text-body-md text-text">{activeTab}_import_2026.csv</span>
                  <span className="ml-2 text-caption-md text-text-secondary">245 rows</span>
                </div>
                <CheckCircle2 className="h-5 w-5 text-success" />
                <Button variant="secondary" size="sm" onClick={() => setFileUploaded(false)}>Remove</Button>
              </Card>
            )}
          </div>

          {/* Field mapping */}
          {fileUploaded && (
            <div>
              <h3 className="mb-3 text-heading-md text-text">Field mapping</h3>
              <p className="mb-4 text-body-md text-text-secondary">
                Map CSV columns to Splose fields. Unmapped columns will be skipped.
              </p>
              <Card padding="none" className="overflow-hidden">
                <DataTable>
                  <TableHead>
                    <Th>CSV column</Th>
                    <Th>Splose field</Th>
                    <Th align="center">Status</Th>
                  </TableHead>
                  <TableBody>
                    {mappings.map((m, i) => (
                      <Tr key={i}>
                        <Td>
                          <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-body-sm text-text">{m.csvColumn}</span>
                        </Td>
                        <Td>
                          <FormSelect
                            value={m.spField}
                            onChange={() => {}}
                            options={[
                              { value: "", label: "— Skip —" },
                              ...mappings.map((x) => ({ value: x.spField, label: x.spField })),
                            ]}
                          />
                        </Td>
                        <Td align="center">
                          {m.mapped ? (
                            <CheckCircle2 className="mx-auto h-4 w-4 text-success" />
                          ) : (
                            <span className="text-caption-md text-warning">Unmapped</span>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </TableBody>
                </DataTable>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
