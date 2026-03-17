import { LayoutGrid, Columns2, Copy } from "lucide-react";

export default function NewProgressNotePage() {
  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-text">New progress note</h1>
          <span className="text-sm text-primary font-medium">Franky Lu</span>
          <span className="text-sm text-text-secondary">Note has been autosaved</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Add new note button */}
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600">
            <span className="text-lg font-bold">+</span>
          </button>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button className="bg-primary p-2 text-white">
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button className="bg-white p-2 text-text-secondary hover:bg-gray-50">
              <Columns2 className="h-4 w-4" />
            </button>
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark flex items-center gap-1">
            Save as final
            <span className="ml-1">&#9660;</span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Left editor panel */}
        <div className="flex-1 p-6 border-r border-border">
          <div className="max-w-2xl">
            {/* Service field */}
            <div className="mb-4">
              <label className="text-sm font-medium text-text">Service</label>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text">
                  Mon 9 Feb 2026, 10:30am — 20 mins (1 interval testing))
                </div>
                <button className="rounded p-1 text-text-secondary hover:bg-gray-100">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Template field */}
            <div className="mb-4">
              <label className="text-sm font-medium text-text">Template</label>
              <select className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-primary">
                <option>Select template</option>
                <option>Default note template all</option>
                <option>Progress Note</option>
                <option>NDIS Progress Note</option>
                <option>Initial Assessment</option>
                <option>SOAP Note</option>
              </select>
            </div>

            {/* Quick action buttons */}
            <div className="mb-8 flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                <LayoutGrid className="h-3.5 w-3.5" />
                Select
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                <Copy className="h-3.5 w-3.5" />
                Copy recent note
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                <Copy className="h-3.5 w-3.5" />
                Copy recent practitioner note
              </button>
            </div>
          </div>
        </div>

        {/* Right reference panel */}
        <div className="w-80 shrink-0 p-6">
          <h3 className="text-sm font-semibold text-text mb-3">Filter previous progress notes</h3>
          <input
            type="text"
            placeholder="Search notes"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            {/* Clipboard illustration */}
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="mb-4">
              <rect x="30" y="20" width="60" height="80" rx="8" fill="#E9D5FF" stroke="#7c3aed" strokeWidth="2" />
              <rect x="40" y="12" width="40" height="16" rx="4" fill="#7c3aed" />
              <rect x="38" y="40" width="44" height="4" rx="2" fill="#c4b5fd" />
              <rect x="38" y="50" width="36" height="4" rx="2" fill="#c4b5fd" />
              <rect x="38" y="60" width="40" height="4" rx="2" fill="#c4b5fd" />
              <rect x="38" y="70" width="28" height="4" rx="2" fill="#c4b5fd" />
              <circle cx="82" cy="82" r="16" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
              <path d="M76 82l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm text-text-secondary">No reference notes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
