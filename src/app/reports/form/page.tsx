import { Button, DateRangeFilter, FormSelect, PageHeader } from "@/components/ds";

export default function ReportsFormPage() {
  return (
    <>
      <PageHeader title="Forms">
        <Button>Export</Button>
        <Button>Learn about this report</Button>
      </PageHeader>

      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          Date range *
        </label>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          Form type
        </label>
        <FormSelect
          options={[
            { value: "all", label: "All" },
            { value: "intake", label: "Intake" },
            { value: "consent", label: "Consent" },
            { value: "assessment", label: "Assessment" },
          ]}
          className="!w-48"
        />
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary">Run report</Button>
      </div>
    </>
  );
}
