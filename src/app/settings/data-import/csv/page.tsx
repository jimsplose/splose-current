"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex } from "antd";
import { UploadOutlined, FileExcelOutlined, CheckCircleFilled } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import { Tab, FormPage, Card, DataTable, TableHead, Th, TableBody, Tr, Td, FormSelect } from "@/components/ds";

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
          <Button onClick={() => router.push("/settings/data-import")}>Cancel</Button>
          <Button type="primary" onClick={() => router.push("/settings/data-import")} disabled={!fileUploaded}>Import</Button>
        </Flex>
      }
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '0 24px', margin: '-24px -24px 0' }}>
        <Tab items={importTabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24, margin: '0 -24px -24px' }}>
        <div style={{ maxWidth: 768, margin: '0 auto' }}>
          <Flex vertical gap={24}>
            {/* Upload zone */}
            <div>
              <h3 style={{ marginBottom: 12, fontSize: 18, fontWeight: 600 }}>Upload CSV file</h3>
              {!fileUploaded ? (
                <button
                  onClick={() => setFileUploaded(true)}
                  style={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '2px dashed var(--color-border)', backgroundColor: 'var(--color-fill-tertiary)', padding: '48px 0', transition: 'all 0.2s', cursor: 'pointer' }}
                >
                  <Icon as={UploadOutlined} size="4xl" tone="secondary" style={{ marginBottom: 8 }} />
                  <span style={{ fontSize: 14 }}>Click to upload or drag and drop</span>
                  <span style={{ marginTop: 4, fontSize: 11, color: 'var(--color-text-secondary)' }}>CSV files only, max 10MB</span>
                </button>
              ) : (
                <Card padding="none">
                  <Flex align="center" gap={12} style={{ padding: '12px 16px' }}>
                    <Icon as={FileExcelOutlined} size="2xl" tone="primary" />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14 }}>{activeTab}_import_2026.csv</span>
                      <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--color-text-secondary)' }}>245 rows</span>
                    </div>
                    <Icon as={CheckCircleFilled} size="2xl" tone="success" />
                    <Button size="small" onClick={() => setFileUploaded(false)}>Remove</Button>
                  </Flex>
                </Card>
              )}
            </div>

            {/* Field mapping */}
            {fileUploaded && (
              <div>
                <h3 style={{ marginBottom: 12, fontSize: 18, fontWeight: 600 }}>Field mapping</h3>
                <p style={{ marginBottom: 16, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  Map CSV columns to Splose fields. Unmapped columns will be skipped.
                </p>
                <Card padding="none" style={{ overflow: 'hidden' }}>
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
                            <span style={{ borderRadius: 4, backgroundColor: '#f3f4f6', padding: '2px 8px', fontFamily: 'monospace', fontSize: 12 }}>{m.csvColumn}</span>
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
                              <span style={{ fontSize: 11, color: '#d97706' }}>Unmapped</span>
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
