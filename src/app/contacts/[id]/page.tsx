import Link from "next/link";

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left sidebar */}
      <aside className="w-48 shrink-0 border-r border-border bg-white p-4 overflow-y-auto">
        <div className="space-y-0.5">
          {[
            { label: "Details", active: true },
            { label: "Cases", active: false },
            { label: "Letters", active: false },
            { label: "Invoices", active: false, count: 96 },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors ${
                item.active
                  ? "border-l-2 border-primary bg-purple-50 text-primary font-medium"
                  : "text-text-secondary hover:bg-purple-50 hover:text-primary"
              }`}
            >
              {item.label}
              {item.count && (
                <span className="ml-1 text-xs text-text-secondary">{item.count}</span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text">Contact</h1>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-sm text-text-secondary">NDIS</span>
          </div>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Actions &#9660;
          </button>
        </div>

        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text">Details</h2>
            <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
              Edit
            </button>
          </div>

          {/* General details */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text mb-3">General details</h3>
            <div className="rounded-lg border border-border bg-white">
              <div className="flex border-b border-border">
                <div className="w-40 shrink-0 px-4 py-3 text-sm text-text-secondary">Name</div>
                <div className="px-4 py-3 text-sm text-text">NDIS</div>
              </div>
              <div className="flex">
                <div className="w-40 shrink-0 px-4 py-3 text-sm text-text-secondary">Type</div>
                <div className="px-4 py-3 text-sm text-text">3rd party payer</div>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text mb-3">Contact details</h3>
            <div className="rounded-lg border border-border bg-white">
              <div className="flex border-b border-border">
                <div className="w-40 shrink-0 px-4 py-3 text-sm text-text-secondary">Email</div>
                <div className="px-4 py-3 text-sm text-primary">ruvishka.info@gmail.com</div>
              </div>
              <div className="flex">
                <div className="w-40 shrink-0 px-4 py-3 text-sm text-text-secondary">Note</div>
                <div className="px-4 py-3 text-sm text-text">additional notes / imported info under splose templates column W</div>
              </div>
            </div>
          </div>

          {/* Associated clients */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text mb-3">Associated clients</h3>
            <div className="rounded-lg border border-border bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-text">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-text">DOB</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-text">Appts</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-text">Invoices</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-text">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2 text-sm text-primary">Skyler Peterson</td>
                    <td className="px-4 py-2 text-sm text-text-secondary">5 Jun 2011</td>
                    <td className="px-4 py-2 text-center text-sm text-text-secondary"></td>
                    <td className="px-4 py-2 text-center text-sm text-text-secondary"></td>
                    <td className="px-4 py-2 text-center text-sm text-text-secondary"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center">
            <button className="text-sm text-primary hover:underline">View change log</button>
          </div>
        </div>
      </div>
    </div>
  );
}
