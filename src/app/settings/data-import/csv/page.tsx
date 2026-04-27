"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UploadOutlined, FileExcelOutlined, CheckCircleFilled } from "@ant-design/icons";
import { Tab, FormPage, Card, FormSelect, Text } from "@/components/ds";
import styles from "./DataImportCsv.module.css";

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

interface MappingRow {
  csvColumn: string;
  spField: string;
  mapped: boolean;
}

export default function CSVImportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("clients");
  const [fileUploaded, setFileUploaded] = useState(false);

  const mappings = fieldMappings[activeTab] || [];

  const columns: ColumnsType<MappingRow> = [
    {
      key: "csvColumn",
      title: "CSV column",
      render: (_, row) => (
        <span className={styles.csvColumn}>{row.csvColumn}</span>
      ),
    },
    {
      key: "spField",
      title: "Splose field",
      render: (_, row) => (
        <FormSelect
          value={row.spField}
          onChange={() => {}}
          options={[
            { value: "", label: "— Skip —" },
            ...mappings.map((x) => ({ value: x.spField, label: x.spField })),
          ]}
        />
      ),
    },
    {
      key: "status",
      title: "Status",
      align: "center" as const,
      render: (_, row) => (
        row.mapped ? (
          <CheckCircleFilled className={`block mx-auto ${styles.statusIconSuccess}`} />
        ) : (
          <Text as="span" variant="caption/sm" color="warning">Unmapped</Text>
        )
      ),
    },
  ];

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
      className={styles.formPageRoot}
    >
      <div className={styles.tabsBar}>
        <Tab items={importTabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.contentInner}>
          <Flex vertical gap={24}>
            {/* Upload zone */}
            <div>
              <h3 className={styles.sectionHeading}>Upload CSV file</h3>
              {!fileUploaded ? (
                <button
                  onClick={() => setFileUploaded(true)}
                  className={styles.uploadButton}
                >
                  <UploadOutlined className={styles.uploadIcon} />
                  <Text variant="body/md">Click to upload or drag and drop</Text>
                  <Text variant="caption/sm" color="secondary" mt={4}>CSV files only, max 10MB</Text>
                </button>
              ) : (
                <Card padding="none">
                  <Flex align="center" gap={12} className={styles.fileRow}>
                    <FileExcelOutlined className={styles.fileIcon} />
                    <div className={styles.fileNameWrap}>
                      <Text as="span" variant="body/md">{activeTab}_import_2026.csv</Text>
                      <Text as="span" variant="caption/sm" color="secondary" style={{ marginLeft: 8 }}>245 rows</Text>
                    </div>
                    <CheckCircleFilled className={styles.fileSuccessIcon} />
                    <Button size="small" onClick={() => setFileUploaded(false)}>Remove</Button>
                  </Flex>
                </Card>
              )}
            </div>

            {/* Field mapping */}
            {fileUploaded && (
              <div>
                <h3 className={styles.sectionHeading}>Field mapping</h3>
                <Text variant="body/md" color="secondary" mb={16}>
                  Map CSV columns to Splose fields. Unmapped columns will be skipped.
                </Text>
                <Card padding="none" className={styles.tableCard}>
                  <Table columns={columns} dataSource={mappings} rowKey="csvColumn" pagination={false} />
                </Card>
              </div>
            )}
          </Flex>
        </div>
      </div>
    </FormPage>
  );
}
