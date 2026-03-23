import Link from "next/link";
import { Button, FormSelect, DateRangeFilter, PageHeader } from "@/components/ds";

export default function BatchInvoicePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <PageHeader title="Batch invoice">
        <Link href="/invoices">
          <Button>Cancel</Button>
        </Link>
      </PageHeader>

      <div className="max-w-2xl space-y-6 p-6">
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Date range *</label>
          <DateRangeFilter startDate="2026-03-01" endDate="2026-03-27" />
        </div>

        <FormSelect
          label="Practitioner"
          options={[
            { value: "all", label: "All practitioners" },
            { value: "sarah", label: "Sarah Chen" },
            { value: "james", label: "James Wilson" },
          ]}
        />

        <FormSelect
          label="Invoice type"
          options={[
            { value: "standard", label: "Standard" },
            { value: "ndis", label: "NDIS" },
            { value: "medicare", label: "Medicare" },
          ]}
        />

        <div className="flex gap-3">
          <Link href="/invoices/batch-invoice/preview">
            <Button variant="primary">Preview</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
