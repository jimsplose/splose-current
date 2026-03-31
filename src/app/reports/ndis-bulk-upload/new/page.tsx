"use client";

import { useState } from "react";
import Link from "next/link";
import { UploadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { Flex } from "antd";
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
} from "@/components/ds";

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
        <PageHeader title="NDIS bulk upload — Confirmation">
          <Link href="/reports/ndis-bulk-upload">
            <Button>Close</Button>
          </Link>
        </PageHeader>

        <div style={{ maxWidth: 512, margin: '0 auto', padding: 24 }}>
          <Card padding="lg" style={{ textAlign: 'center' }}>
            <Flex justify="center" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', height: 56, width: 56, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#dcfce7' }}>
                <CheckCircleOutlined style={{ fontSize: 32, color: '#16a34a' }} />
              </div>
            </Flex>
            <h2 className="text-heading-lg" style={{ marginBottom: 4, color: 'var(--color-text)' }}>Upload submitted</h2>
            <p className="text-body-md" style={{ marginBottom: 24, color: 'var(--color-text-secondary)' }}>
              {validCount} valid claims have been submitted to the NDIS portal for processing.
              {errorCount > 0 && ` ${errorCount} items with errors were skipped.`}
            </p>

            <Flex vertical gap={12} style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, textAlign: 'left' }}>
              <Flex align="center" justify="space-between">
                <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>File</span>
                <span className="text-label-lg" style={{ color: 'var(--color-text)' }}>{fileName}</span>
              </Flex>
              <Flex align="center" justify="space-between">
                <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Total claims</span>
                <span className="text-label-lg" style={{ color: 'var(--color-text)' }}>{mockValidationResults.length}</span>
              </Flex>
              <Flex align="center" justify="space-between">
                <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Submitted</span>
                <span className="text-label-lg" style={{ color: '#16a34a' }}>{validCount}</span>
              </Flex>
              <Flex align="center" justify="space-between">
                <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Skipped (errors)</span>
                <span className="text-label-lg" style={{ color: '#dc2626' }}>{errorCount}</span>
              </Flex>
              <Flex align="center" justify="space-between">
                <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Total amount</span>
                <span className="text-label-lg" style={{ color: 'var(--color-text)' }}>
                  $
                  {mockValidationResults
                    .filter((r) => r.status === "valid")
                    .reduce((sum, r) => sum + parseFloat(r.amount.replace("$", "")), 0)
                    .toFixed(2)}
                </span>
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
        <PageHeader title="NDIS bulk upload — Validation">
          <Button onClick={() => setStep("upload")}>Back</Button>
          <Button variant="primary" onClick={() => setStep("confirmation")} disabled={validCount === 0}>
            Submit {validCount} valid claims
          </Button>
        </PageHeader>

        <div style={{ padding: 24 }}>
          <Flex align="center" gap={16} style={{ marginBottom: 16 }}>
            <Flex align="center" gap={8} style={{ borderRadius: 8, backgroundColor: '#f0fdf4', padding: '8px 12px' }}>
              <CheckCircleOutlined style={{ fontSize: 16, color: '#16a34a' }} />
              <span className="text-label-lg" style={{ color: '#15803d' }}>{validCount} valid</span>
            </Flex>
            <Flex align="center" gap={8} style={{ borderRadius: 8, backgroundColor: '#fef2f2', padding: '8px 12px' }}>
              <ExclamationCircleOutlined style={{ fontSize: 16, color: '#dc2626' }} />
              <span className="text-label-lg" style={{ color: '#b91c1c' }}>{errorCount} errors</span>
            </Flex>
            <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>
              from <strong>{fileName}</strong>
            </span>
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
                    <Td style={{ color: 'var(--color-text-secondary)' }}>{row.line}</Td>
                    <Td style={{ fontWeight: 500, color: 'var(--color-text)' }}>{row.client}</Td>
                    <Td style={{ color: 'var(--color-text-secondary)' }}>{row.serviceDate}</Td>
                    <Td className="text-body-sm" style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{row.item}</Td>
                    <Td align="right" style={{ color: 'var(--color-text)' }}>
                      {row.amount}
                    </Td>
                    <Td>
                      <Badge variant={row.status === "valid" ? "green" : "red"}>
                        {row.status === "valid" ? "Valid" : "Error"}
                      </Badge>
                    </Td>
                    <Td className="text-body-sm" style={{ color: '#dc2626' }}>{row.error || "—"}</Td>
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
          <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>Date range *</label>
          <DateRangeFilter startDate="2026-03-01" endDate="2026-03-27" />
          <p className="text-caption-md" style={{ marginTop: 4, color: 'var(--color-text-secondary)' }}>
            12 support items from 1 Mar 2026 to 27 Mar 2026 at all practitioners
          </p>
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
          <label className="text-label-lg" style={{ display: 'block', marginBottom: 4, color: 'var(--color-text-secondary)' }}>Upload file *</label>
          {fileName ? (
            <Card padding="md">
              <Flex align="center" gap={12}>
                <div style={{ display: 'flex', height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: 'var(--color-primary-bg)' }}>
                  <FileTextOutlined style={{ fontSize: 20, color: 'var(--color-primary)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p className="text-label-lg" style={{ color: 'var(--color-text)' }}>{fileName}</p>
                  <p className="text-caption-md" style={{ color: 'var(--color-text-secondary)' }}>CSV file — 5 rows</p>
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
              icon={<UploadOutlined style={{ fontSize: 32, color: 'var(--color-text-secondary)' }} />}
              label="Choose CSV file"
              onClick={handleFileUpload}
              style={{ cursor: 'pointer' }}
            />
          )}
          <p className="text-caption-md" style={{ marginTop: 4, color: 'var(--color-text-secondary)' }}>
            Upload a CSV file with NDIS claim data. Required columns: Client, Service Date, Support Item Number, Amount.
          </p>
        </div>
      </Flex>
    </>
  );
}
