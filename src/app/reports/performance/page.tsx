import { PageHeader, Button } from "@/components/ds";

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
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">11 Mar 2026</div>
          <span className="text-text-secondary">&rarr;</span>
          <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">11 Mar 2026</div>
          <button className="rounded p-1 text-text-secondary hover:bg-gray-100">&#128197;</button>
        </div>
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
          <select className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text outline-none">
            <option>Ever</option>
            <option>Last 12 months</option>
            <option>Last 6 months</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-80 text-text">Exclude busy time from utilisation calculation:</span>
          <select className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text outline-none">
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-80 text-text">
            Include all appointments regardless of status <span className="text-text-secondary">&#9432;</span>:
          </span>
          <select className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text outline-none">
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-80 text-text">
            Exclude items marked as do not invoice <span className="text-text-secondary">&#9432;</span>:
          </span>
          <select className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text outline-none">
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
      </div>
    </>
  );
}
