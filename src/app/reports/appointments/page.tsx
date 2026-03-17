export default function ReportsAppointmentsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Appointments</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Export
          </button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Learn about this report
          </button>
        </div>
      </div>

      {/* Date range */}
      <div className="mb-4">
        <label className="text-sm text-text-secondary flex items-center gap-1 mb-1">
          <span>&#128197;</span> Date range *
        </label>
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">
            11 Mar 2026
          </div>
          <span className="text-text-secondary">&rarr;</span>
          <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">
            11 Mar 2026
          </div>
          <button className="rounded p-1 text-text-secondary hover:bg-gray-100">&#128197;</button>
        </div>
      </div>

      {/* Contains note filter */}
      <div className="mb-4">
        <label className="text-sm text-text-secondary flex items-center gap-1 mb-1">
          <span>&#128196;</span> Contains note
          <button className="ml-1 text-red-400 hover:text-red-600">&#10005;</button>
        </label>
        <select className="w-48 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary">
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      {/* Filter buttons */}
      <div className="flex items-center gap-2 mb-8">
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Add filter
        </button>
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Save filters
        </button>
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Load filters
        </button>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          Run report
        </button>
      </div>
    </>
  );
}
