import { PageHeader, Button, DateRangeFilter, FormSelect } from "@/components/ds";

export default function ReportsPerformancePage() {
  return (
    <>
      <PageHeader title="Performance">
        <Button>Export</Button>
        <Button>Definitions</Button>
      </PageHeader>

      {/* Date range */}
      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          <span>&#128197;</span> Date range *
        </label>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      {/* Filter buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary">Run report</Button>
      </div>

      {/* Configuration options */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-4">
          <span className="w-80 text-text">Identify as new client if no previous service:</span>
          <FormSelect
            options={[
              { value: "ever", label: "Ever" },
              { value: "12months", label: "Last 12 months" },
              { value: "6months", label: "Last 6 months" },
            ]}
            className="!w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="w-80 text-text">Exclude busy time from utilisation calculation:</span>
          <FormSelect
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
            className="!w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="w-80 text-text">
            Include all appointments regardless of status <span className="text-text-secondary">&#9432;</span>:
          </span>
          <FormSelect
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
            className="!w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="w-80 text-text">
            Exclude items marked as do not invoice <span className="text-text-secondary">&#9432;</span>:
          </span>
          <FormSelect
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
            className="!w-auto"
          />
        </div>
      </div>
    </>
  );
}
