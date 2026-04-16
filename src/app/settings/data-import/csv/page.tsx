"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex } from "antd";
import { UploadOutlined, FileExcelOutlined, CheckCircleFilled } from "@ant-design/icons";
import {
  Button,
  Tab,
  FormPage,
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
    <FormPage
      backHref="/settings/data-import"
      title="CSV Import"
      maxWidth={99999}
      actions={
        <Flex align="center" gap={8}>
          <Button variant="secondary" onClick={() => router.push("/settings/data-import")}>Cancel</Button>
          <Button variant="primary" onClick={() => router.push("/settings/data-import")} disabled={!fileUploaded}>Import</Button>
        </Flex>
      }
      className="flex flex-col"
      style={{ minHeight: '100vh' }}
    >
      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '0 24px', margin: '-24px -24px 0' }}>
        <Tab items={importTabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24, margin: '0 -24px -24px' }}>
        <div style={{ maxWidth: 768, margin: '0 auto' }}>
          <Flex vertical gap={24}>
            {/* Upload zone */}
            <div>
              <h3 className="text-heading-md text-text" style={{ marginBottom: 12 }}>Upload CSV file</h3>
              {!fileUploaded ? (
                <button
                  onClick={() => setFileUploaded(true)}
                  className="flex w-full flex-col items-center justify-center"
                  style={{ borderRadius: 8, border: '2px dashed var(--color-border)', backgroundColor: 'var(--color-fill-tertiary)', padding: '48px 0', transition: 'all 0.2s', cursor: 'pointer' }}
                >
                  <UploadOutlined style={{ fontSize: 32, marginBottom: 8, color: 'var(--color-text-secondary)' }} />
                  <span className="text-body-md text-text">Click to upload or drag and drop</span>
                  <span className="text-caption-md text-text-secondary" style={{ marginTop: 4 }}>CSV files only, max 10MB</span>
                </button>
              ) : (
                <Card padding="none">
                  <Flex align="center" gap={12} style={{ padding: '12px 16px' }}>
                    <FileExcelOutlined style={{ fontSize: 20, color: 'var(--color-primary)' }} />
                    <div style={{ flex: 1 }}>
                      <span className="text-body-md text-text">{activeTab}_import_2026.csv</span>
                      <span className="text-caption-md text-text-secondary" style={{ marginLeft: 8 }}>245 rows</span>
                    </div>
                    <CheckCircleFilled style={{ fontSize: 20, color: 'var(--color-success)' }} />
                    <Button variant="secondary" size="sm" onClick={() => setFileUploaded(false)}>Remove</Button>
                  </Flex>
                </Card>
              )}
            </div>

            {/* Field mapping */}
            {fileUploaded && (
              <div>
                <h3 className="text-heading-md text-text" style={{ marginBottom: 12 }}>Field mapping</h3>
                <p className="text-body-md text-text-secondary" style={{ marginBottom: 16 }}>
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
                            <span style={{ borderRadius: 4, backgroundColor: '#f3f4f6', padding: '2px 8px', fontFamily: 'monospace' }} className="text-body-sm text-text">{m.csvColumn}</span>
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
                              <CheckCircleFilled className="block mx-auto" style={{ fontSize: 16, color: 'var(--color-success)' }} />
                            ) : (
                              <span className="text-caption-md" style={{ color: '#d97706' }}>Unmapped</span>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </TableBody>
                  </DataTable>
                </Card>
              </div>
            )}
          </Flex>
        </div>
      </div>
    </FormPage>
  );
}
