export default function ReportsPerformancePage() {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Performance</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Export
          </button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Definitions
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

      {/* Filter buttons */}
      <div className="flex items-center gap-2 mb-6">
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
    </div>
  );
}
