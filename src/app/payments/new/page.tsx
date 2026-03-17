export default function AddPaymentPage() {
  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <h1 className="text-2xl font-bold text-text">Add payment to TRR-006299</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-purple-50">
            Cancel
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            Add
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-8">
        {/* Payment details row */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-text">Location *</label>
            <select className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary">
              <option>East Clinics</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-text">
              Payment date <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex items-center gap-1">
              <input
                type="text"
                defaultValue="11 Mar 2026"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary"
              />
              <button className="rounded p-1 text-text-secondary hover:bg-gray-100">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text">
              Payment method <span className="text-red-500">*</span>
            </label>
            <select className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-secondary outline-none focus:border-primary">
              <option value="">Select method</option>
              <option>Cash</option>
              <option>Credit card</option>
              <option>Direct deposit</option>
              <option>EFTPOS</option>
              <option>Medicare</option>
              <option>NDIS</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-text">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="148.71"
              className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Apply to outstanding invoices */}
        <p className="text-sm text-text-secondary mb-3">Apply to outstanding invoices</p>

        <div className="rounded-lg border border-border bg-white overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-text">Invoice #</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text">Client</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text">Practitioner</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text">Issue date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-text">Due date</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-text">Due</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-text">Amount</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-text">Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-sm text-primary">TRR-006299</td>
                <td className="px-4 py-3 text-sm text-text">Alex Anders</td>
                <td className="px-4 py-3 text-sm text-text">Franky Lu</td>
                <td className="px-4 py-3 text-sm text-text-secondary">10 Mar 2026</td>
                <td className="px-4 py-3 text-sm text-text-secondary">10 Mar 2026</td>
                <td className="px-4 py-3 text-right text-sm text-text">148.71</td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="text"
                    defaultValue="148.71"
                    className="w-20 rounded border border-border bg-white px-2 py-1 text-right text-sm text-text outline-none focus:border-primary"
                  />
                </td>
                <td className="px-4 py-3 text-right text-sm text-text">0.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Note and totals */}
        <div className="flex items-start justify-between">
          <div>
            <label className="text-sm font-bold text-text">Note</label>
            <textarea
              className="mt-1 w-48 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary resize-none"
              rows={3}
            />
          </div>
          <div className="text-sm space-y-1 text-right">
            <div className="flex items-center justify-end gap-8">
              <span className="text-text-secondary">Applied to invoices</span>
              <span className="text-text font-medium">148.71</span>
            </div>
            <div className="flex items-center justify-end gap-8">
              <span className="text-text-secondary">Amount to credit</span>
              <span className="text-text font-medium">0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
