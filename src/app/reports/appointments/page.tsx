import { Button, DateRangeFilter, FormSelect, PageHeader } from "@/components/ds";

export default function ReportsAppointmentsPage() {
  return (
    <>
      <PageHeader title="Appointments">
        <Button>Export</Button>
        <Button>Learn about this report</Button>
      </PageHeader>

      {/* Date range */}
      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          <span>&#128197;</span> Date range *
        </label>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      {/* Contains note filter */}
      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          <span>&#128196;</span> Contains note
          <button className="ml-1 text-red-400 hover:text-red-600">&#10005;</button>
        </label>
        <FormSelect
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          className="!w-48"
        />
      </div>

      {/* Filter buttons */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary">Run report</Button>
      </div>
    </>
  );
}
