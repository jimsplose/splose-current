import { Button, PageHeader } from "@/components/ds";

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
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">11 Mar 2026</div>
          <span className="text-text-secondary">&rarr;</span>
          <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">11 Mar 2026</div>
          <button className="rounded p-1 text-text-secondary hover:bg-gray-100">&#128197;</button>
        </div>
      </div>

      {/* Contains note filter */}
      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          <span>&#128196;</span> Contains note
          <button className="ml-1 text-red-400 hover:text-red-600">&#10005;</button>
        </label>
        <select className="w-48 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary">
          <option>Yes</option>
          <option>No</option>
        </select>
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
