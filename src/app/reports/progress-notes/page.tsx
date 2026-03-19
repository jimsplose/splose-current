import { PageHeader, Button } from "@/components/ds";

export default function ReportsProgressNotesPage() {
  return (
    <>
      <PageHeader title="Progress notes">
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

      {/* Filter buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary">Run report</Button>
      </div>

      {/* Results */}
      <p className="mb-4 text-sm text-text-secondary">2 progress notes found.</p>

      <h2 className="mb-4 text-lg font-bold text-text">Summary</h2>

      {/* Summary tables and pie charts */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Note template breakdown */}
        <div>
          <div className="mb-4 overflow-hidden rounded-lg border border-border bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-text">Note template</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-text">Number</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-sm text-text">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
                    AAA TEST
                  </td>
                  <td className="px-4 py-2 text-right text-sm text-text">1 (50.0%)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-text">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                    Bill Gates Demo
                  </td>
                  <td className="px-4 py-2 text-right text-sm text-text">1 (50.0%)</td>
                </tr>
              </tbody>
            </table>
            <div className="flex items-center justify-end border-t border-border px-4 py-2 text-sm text-text-secondary">
              <span>&lt;</span>
              <button className="mx-2 flex h-6 w-6 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
                1
              </button>
              <span>&gt;</span>
            </div>
          </div>
          {/* Pie chart */}
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="#7c3aed" />
              <path d="M100,100 L100,10 A90,90 0 0,1 190,100 Z" fill="#22c55e" />
            </svg>
          </div>
        </div>

        {/* Practitioner breakdown */}
        <div>
          <div className="mb-4 overflow-hidden rounded-lg border border-border bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-text">Practitioner</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-text">Number</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-sm text-text">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
                    Ruvi R.
                  </td>
                  <td className="px-4 py-2 text-right text-sm text-text">1 (50.0%)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-text">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                    Zoe Gomez
                  </td>
                  <td className="px-4 py-2 text-right text-sm text-text">1 (50.0%)</td>
                </tr>
              </tbody>
            </table>
            <div className="flex items-center justify-end border-t border-border px-4 py-2 text-sm text-text-secondary">
              <span>&lt;</span>
              <button className="mx-2 flex h-6 w-6 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
                1
              </button>
              <span>&gt;</span>
            </div>
          </div>
          {/* Pie chart */}
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="#7c3aed" />
              <path d="M100,100 L100,10 A90,90 0 0,1 190,100 Z" fill="#22c55e" />
            </svg>
          </div>
        </div>
      </div>

      {/* Progress notes list */}
      <h2 className="mb-4 text-lg font-bold text-text">Progress notes list</h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-text">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-text">Client</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-text">Related service</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-text">Practitioner</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-text">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-3 text-sm">
                <span className="text-primary">Bill Gates Demo</span>
                <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                  Draft
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-primary">Skyler Peterson</td>
              <td className="px-4 py-3 text-sm text-text-secondary"></td>
              <td className="px-4 py-3 text-sm text-text">Ruvi R.</td>
              <td className="px-4 py-3 text-sm text-text-secondary"></td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">
                <span className="text-primary">AAA TEST</span>
                <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                  Draft
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-primary">A Del</td>
              <td className="px-4 py-3 text-sm text-text-secondary"></td>
              <td className="px-4 py-3 text-sm text-text">Zoe Gomez</td>
              <td className="px-4 py-3 text-sm text-text-secondary"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
