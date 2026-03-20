import { Badge, Button, Card, DateRangeFilter, PageHeader, Status } from "@/components/ds";

export default function ReportsProgressNotesPage() {
  return (
    <>
      <PageHeader title="Progress notes">
        <Button>Export</Button>
        <Button>Learn about this report</Button>
      </PageHeader>

      {/* Date range */}
      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-body-md text-text-secondary">
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

      {/* Results */}
      <p className="mb-4 text-body-md text-text-secondary">2 progress notes found.</p>

      <h2 className="mb-4 text-heading-lg text-text">Summary</h2>

      {/* Summary tables and pie charts */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Note template breakdown */}
        <div>
          <Card padding="none" className="mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="px-4 py-2 text-left text-label-lg text-text">Note template</th>
                  <th className="px-4 py-2 text-right text-label-lg text-text">Number</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-body-md text-text">
                    <Status color="green" label="AAA TEST" />
                  </td>
                  <td className="px-4 py-2 text-right text-body-md text-text">1 (50.0%)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-body-md text-text">
                    <Status color="purple" label="Bill Gates Demo" />
                  </td>
                  <td className="px-4 py-2 text-right text-body-md text-text">1 (50.0%)</td>
                </tr>
              </tbody>
            </table>
            <div className="flex items-center justify-end border-t border-border px-4 py-2 text-body-md text-text-secondary">
              <span>&lt;</span>
              <Button variant="ghost" size="sm" className="mx-1 !h-6 !w-6 !rounded !border !border-primary !p-0 !text-xs !font-medium !text-primary">
                1
              </Button>
              <span>&gt;</span>
            </div>
          </Card>
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
          <Card padding="none" className="mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="px-4 py-2 text-left text-label-lg text-text">Practitioner</th>
                  <th className="px-4 py-2 text-right text-label-lg text-text">Number</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 text-body-md text-text">
                    <Status color="green" label="Ruvi R." />
                  </td>
                  <td className="px-4 py-2 text-right text-body-md text-text">1 (50.0%)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-body-md text-text">
                    <Status color="purple" label="Zoe Gomez" />
                  </td>
                  <td className="px-4 py-2 text-right text-body-md text-text">1 (50.0%)</td>
                </tr>
              </tbody>
            </table>
            <div className="flex items-center justify-end border-t border-border px-4 py-2 text-body-md text-text-secondary">
              <span>&lt;</span>
              <Button variant="ghost" size="sm" className="mx-1 !h-6 !w-6 !rounded !border !border-primary !p-0 !text-xs !font-medium !text-primary">
                1
              </Button>
              <span>&gt;</span>
            </div>
          </Card>
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
      <h2 className="mb-4 text-heading-lg text-text">Progress notes list</h2>
      <Card padding="none" className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="px-4 py-2 text-left text-label-lg text-text">Title</th>
              <th className="px-4 py-2 text-left text-label-lg text-text">Client</th>
              <th className="px-4 py-2 text-left text-label-lg text-text">Related service</th>
              <th className="px-4 py-2 text-left text-label-lg text-text">Practitioner</th>
              <th className="px-4 py-2 text-left text-label-lg text-text">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-3 text-body-md">
                <span className="text-primary">Bill Gates Demo</span>
                <Badge variant="gray" className="ml-2">Draft</Badge>
              </td>
              <td className="px-4 py-3 text-body-md text-primary">Skyler Peterson</td>
              <td className="px-4 py-3 text-body-md text-text-secondary"></td>
              <td className="px-4 py-3 text-body-md text-text">Ruvi R.</td>
              <td className="px-4 py-3 text-body-md text-text-secondary"></td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-body-md">
                <span className="text-primary">AAA TEST</span>
                <Badge variant="gray" className="ml-2">Draft</Badge>
              </td>
              <td className="px-4 py-3 text-body-md text-primary">A Del</td>
              <td className="px-4 py-3 text-body-md text-text-secondary"></td>
              <td className="px-4 py-3 text-body-md text-text">Zoe Gomez</td>
              <td className="px-4 py-3 text-body-md text-text-secondary"></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </>
  );
}
