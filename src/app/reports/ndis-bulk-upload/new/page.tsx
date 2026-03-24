"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";
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

        <div className="mx-auto max-w-lg p-6">
          <Card padding="lg" className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="mb-1 text-heading-lg text-text">Upload submitted</h2>
            <p className="mb-6 text-body-md text-text-secondary">
              {validCount} valid claims have been submitted to the NDIS portal for processing.
              {errorCount > 0 && ` ${errorCount} items with errors were skipped.`}
            </p>

            <div className="space-y-3 border-t border-border pt-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-body-md text-text-secondary">File</span>
                <span className="text-label-lg text-text">{fileName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-text-secondary">Total claims</span>
                <span className="text-label-lg text-text">{mockValidationResults.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-text-secondary">Submitted</span>
                <span className="text-label-lg text-green-600">{validCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-text-secondary">Skipped (errors)</span>
                <span className="text-label-lg text-red-600">{errorCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-md text-text-secondary">Total amount</span>
                <span className="text-label-lg text-text">
                  $
                  {mockValidationResults
                    .filter((r) => r.status === "valid")
                    .reduce((sum, r) => sum + parseFloat(r.amount.replace("$", "")), 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <Link href="/reports/ndis-bulk-upload">
                <Button variant="primary">Back to uploads</Button>
              </Link>
            </div>
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

        <div className="p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-label-lg text-green-700">{validCount} valid</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-label-lg text-red-700">{errorCount} errors</span>
            </div>
            <span className="text-body-md text-text-secondary">
              from <strong>{fileName}</strong>
            </span>
          </div>

          <Card padding="none" className="overflow-hidden">
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
                    className={`border-b border-border ${row.status === "error" ? "bg-red-50/50" : "hover:bg-gray-50"}`}
                  >
                    <Td className="text-text-secondary">{row.line}</Td>
                    <Td className="font-medium text-text">{row.client}</Td>
                    <Td className="text-text-secondary">{row.serviceDate}</Td>
                    <Td className="font-mono text-body-sm text-text-secondary">{row.item}</Td>
                    <Td align="right" className="text-text">
                      {row.amount}
                    </Td>
                    <Td>
                      <Badge variant={row.status === "valid" ? "green" : "red"}>
                        {row.status === "valid" ? "Valid" : "Error"}
                      </Badge>
                    </Td>
                    <Td className="text-body-sm text-red-600">{row.error || "—"}</Td>
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

      <div className="max-w-2xl space-y-6 p-6">
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Date range *</label>
          <DateRangeFilter startDate="2026-03-01" endDate="2026-03-27" />
          <p className="mt-1 text-caption-md text-text-secondary">
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
          <label className="mb-1 block text-label-lg text-text-secondary">Upload file *</label>
          {fileName ? (
            <Card padding="md" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-label-lg text-text">{fileName}</p>
                <p className="text-caption-md text-text-secondary">CSV file — 5 rows</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFileName(null)}
              >
                Remove
              </Button>
            </Card>
          ) : (
            <FileUpload
              icon={<Upload className="h-8 w-8 text-text-secondary" />}
              label="Choose CSV file"
              onClick={handleFileUpload}
              className="cursor-pointer"
            />
          )}
          <p className="mt-1 text-caption-md text-text-secondary">
            Upload a CSV file with NDIS claim data. Required columns: Client, Service Date, Support Item Number, Amount.
          </p>
        </div>
      </div>
    </>
  );
}
