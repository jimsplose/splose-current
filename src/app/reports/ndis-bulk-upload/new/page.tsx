import { Button, FormInput, FormSelect, DateRangeFilter, PageHeader } from "@/components/ds";

export default function NdisBulkUploadNewPage() {
  return (
    <>
      <PageHeader title="New NDIS bulk upload">
        <Button>Cancel</Button>
        <Button variant="primary">Upload</Button>
      </PageHeader>

      <div className="max-w-2xl space-y-6">
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
      </div>
    </>
  );
}
