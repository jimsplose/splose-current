"use client";

import { useState } from "react";
import Link from "next/link";
import { UploadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import Icon from "@/components/ds/Icon";
import {
  Button,
  FormInput,
  FormSelect,
  DateRangeFilter,
  PageHeader,
  FileUpload,
  Card,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Badge,
  Text,
  Divider,
  Breadcrumbs,
} from "@/components/ds";

const ndisBreadcrumbs = (
  <div style={{ padding: "8px 24px 0" }}>
    <Breadcrumbs items={[
      { label: "Reports", href: "/reports" },
      { label: "NDIS bulk upload", href: "/reports/ndis-bulk-upload" },
      { label: "New upload" },
    ]} />
  </div>
);

type Step = "upload" | "validation" | "confirmation";

const mockValidationResults = [
  { line: 1, client: "Emma Thompson", serviceDate: "3 Mar 2026", item: "15_038_0117_1_3", amount: "$193.99", status: "valid" as const, error: null },
  { line: 2, client: "Liam Johnson", serviceDate: "5 Mar 2026", item: "15_040_0128_1_3", amount: "$97.00", status: "valid" as const, error: null },
  { line: 3, client: "Olivia Davis", serviceDate: "10 Mar 2026", item: "15_038_0117_1_3", amount: "$65.09", status: "error" as const, error: "NDIS number not found" },
  { line: 4, client: "Noah Wilson", serviceDate: "12 Mar 2026", item: "15_040_0128_1_3", amount: "$193.99", status: "valid" as const, error: null },
  { line: 5, client: "Ava Martinez", serviceDate: "18 Mar 2026", item: "INVALID_CODE", amount: "$148.50", status: "error" as const, error: "Invalid support item number" },
];

export default function NdisBulkUploadNewPage() {
  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState<string | null>(null);

  const validCount = mockValidationResults.filter((r) => r.status === "valid").length;
  const errorCount = mockValidationResults.filter((r) => r.status === "error").length;

  const handleFileUpload = () => {
    setFileName("ndis-claims-march-2026.csv");
  };

  const handleUpload = () => {
    if (fileName) {
      setStep("validation");
    }
  };

  if (step === "confirmation") {
    return (
      <>
        {ndisBreadcrumbs}
        <PageHeader title="NDIS bulk upload — Confirmation">
          <Link href="/reports/ndis-bulk-upload">
            <Button>Close</Button>
          </Link>
        </PageHeader>

        <div style={{ maxWidth: 512, margin: '0 auto', padding: 24 }}>
          <Card padding="lg" className="text-center">
            <Flex justify="center" style={{ marginBottom: 16 }}>
              <Flex align="center" justify="center" style={{ height: 56, width: 56, borderRadius: '50%', backgroundColor: '#dcfce7' }}>
                <Icon as={CheckCircleOutlined} size="4xl" style={{ color: '#16a34a' }} />
              </Flex>
            </Flex>
            <Text variant="heading/lg" style={{ marginBottom: 4 }}>Upload submitted</Text>
            <Text variant="body/md" color="secondary" style={{ marginBottom: 24 }}>
              {validCount} valid claims have been submitted to the NDIS portal for processing.
              {errorCount > 0 && ` ${errorCount} items with errors were skipped.`}
            </Text>

            <Divider spacing="none" />
            <Flex vertical gap={12} className="text-left" style={{ paddingTop: 16 }}>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" as="span" color="secondary">File</Text>
                <Text variant="label/lg" as="span">{fileName}</Text>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" as="span" color="secondary">Total claims</Text>
                <Text variant="label/lg" as="span">{mockValidationResults.length}</Text>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" as="span" color="secondary">Submitted</Text>
                <Text variant="label/lg" as="span" color="success">{validCount}</Text>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" as="span" color="secondary">Skipped (errors)</Text>
                <Text variant="label/lg" as="span" color="danger">{errorCount}</Text>
              </Flex>
              <Flex align="center" justify="space-between">
                <Text variant="body/md" as="span" color="secondary">Total amount</Text>
                <Text variant="label/lg" as="span">
                  $
                  {mockValidationResults
                    .filter((r) => r.status === "valid")
                    .reduce((sum, r) => sum + parseFloat(r.amount.replace("$", "")), 0)
                    .toFixed(2)}
                </Text>
              </Flex>
            </Flex>

            <Flex justify="center" gap={12} style={{ marginTop: 24 }}>
              <Link href="/reports/ndis-bulk-upload">
                <Button variant="primary">Back to uploads</Button>
              </Link>
            </Flex>
          </Card>
        </div>
      </>
    );
  }

  if (step === "validation") {
    return (
      <>
        {ndisBreadcrumbs}
        <PageHeader title="NDIS bulk upload — Validation">
          <Button onClick={() => setStep("upload")}>Back</Button>
          <Button variant="primary" onClick={() => setStep("confirmation")} disabled={validCount === 0}>
            Submit {validCount} valid claims
          </Button>
        </PageHeader>

        <div style={{ padding: 24 }}>
          <Flex align="center" gap={16} style={{ marginBottom: 16 }}>
            <Flex align="center" gap={8} style={{ borderRadius: 8, backgroundColor: '#f0fdf4', padding: '8px 12px' }}>
              <Icon as={CheckCircleOutlined} style={{ color: '#16a34a' }} />
              <Text variant="label/lg" as="span" color="#15803d">{validCount} valid</Text>
            </Flex>
            <Flex align="center" gap={8} style={{ borderRadius: 8, backgroundColor: '#fef2f2', padding: '8px 12px' }}>
              <Icon as={ExclamationCircleOutlined} style={{ color: '#dc2626' }} />
              <Text variant="label/lg" as="span" color="#b91c1c">{errorCount} errors</Text>
            </Flex>
            <Text variant="body/md" as="span" color="secondary">
              from <strong>{fileName}</strong>
            </Text>
          </Flex>

          <Card padding="none" style={{ overflow: 'hidden' }}>
            <DataTable>
              <TableHead>
                <Th>Line</Th>
                <Th>Client</Th>
                <Th>Service date</Th>
                <Th>Support item</Th>
                <Th align="right">Amount</Th>
                <Th>Status</Th>
                <Th>Error</Th>
              </TableHead>
              <TableBody>
                {mockValidationResults.map((row) => (
                  <tr
                    key={row.line}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: row.status === "error" ? 'rgba(254, 242, 242, 0.5)' : undefined,
                    }}
                  >
                    <Td><Text variant="body/md" as="span" color="secondary">{row.line}</Text></Td>
                    <Td><Text variant="label/lg" as="span">{row.client}</Text></Td>
                    <Td><Text variant="body/md" as="span" color="secondary">{row.serviceDate}</Text></Td>
                    <Td><Text variant="body/sm" as="span" color="secondary" style={{ fontFamily: 'monospace' }}>{row.item}</Text></Td>
                    <Td align="right">
                      {row.amount}
                    </Td>
                    <Td>
                      <Badge variant={row.status === "valid" ? "green" : "red"}>
                        {row.status === "valid" ? "Valid" : "Error"}
                      </Badge>
                    </Td>
                    <Td><Text variant="body/sm" as="span" color="danger">{row.error || "—"}</Text></Td>
                  </tr>
                ))}
              </TableBody>
            </DataTable>
          </Card>
        </div>
      </>
    );
  }

  // Step: upload (default)
  return (
    <>
      {ndisBreadcrumbs}
      <PageHeader title="New NDIS bulk upload">
        <Link href="/reports/ndis-bulk-upload">
          <Button>Cancel</Button>
        </Link>
        <Button variant="primary" onClick={handleUpload} disabled={!fileName}>
          Upload
        </Button>
      </PageHeader>

      <Flex vertical gap={24} style={{ maxWidth: 672, padding: 24 }}>
        <div>
          <Text variant="body/sm" as="label" color="secondary" style={{ display: 'block', marginBottom: 4 }}>Date range *</Text>
          <DateRangeFilter startDate="2026-03-01" endDate="2026-03-27" />
          <Text variant="caption/md" as="p" color="secondary" style={{ marginTop: 4 }}>
            12 support items from 1 Mar 2026 to 27 Mar 2026 at all practitioners
          </Text>
        </div>

        <FormSelect
          label="Practitioner"
          options={[
            { value: "all", label: "All practitioners" },
            { value: "sarah", label: "Sarah Chen" },
            { value: "james", label: "James Wilson" },
          ]}
        />

        <FormInput label="Reference (optional)" placeholder="e.g. March 2026 upload" />

        <div>
          <Text variant="label/lg" as="label" color="secondary" style={{ display: 'block', marginBottom: 4 }}>Upload file *</Text>
          {fileName ? (
            <Card padding="md">
              <Flex align="center" gap={12}>
                <Flex align="center" justify="center" style={{ height: 40, width: 40, borderRadius: 8, backgroundColor: 'var(--color-primary-bg)' }}>
                  <Icon as={FileTextOutlined} size="2xl" tone="primary" />
                </Flex>
                <div style={{ flex: 1 }}>
                  <Text variant="label/lg" as="p">{fileName}</Text>
                  <Text variant="caption/md" as="p" color="secondary">CSV file — 5 rows</Text>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFileName(null)}
                >
                  Remove
                </Button>
              </Flex>
            </Card>
          ) : (
            <FileUpload
              icon={<Icon as={UploadOutlined} size="4xl" tone="secondary" />}
              label="Choose CSV file"
              onClick={handleFileUpload}
              className="cursor-pointer"
            />
          )}
          <Text variant="caption/md" as="p" color="secondary" style={{ marginTop: 4 }}>
            Upload a CSV file with NDIS claim data. Required columns: Client, Service Date, Support Item Number, Amount.
          </Text>
        </div>
      </Flex>
    </>
  );
}
