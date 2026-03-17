import { LayoutGrid, Columns2 } from "lucide-react";

export default function NewProgressNotePage() {
  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-text">New progress note</h1>
          <span className="text-sm text-primary font-medium">Client Name</span>
          <span className="text-sm text-text-secondary">Note has been autosaved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button className="bg-primary p-2 text-white">
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button className="bg-white p-2 text-text-secondary hover:bg-gray-50">
              <Columns2 className="h-4 w-4" />
            </button>
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            Save as final
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Left editor panel */}
        <div className="flex-1 p-6 border-r border-border">
          <div className="max-w-2xl">
            {/* Service field */}
            <div className="mb-6">
              <label className="text-sm font-medium text-text">Service</label>
              <div className="mt-1 rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text-secondary">
                Mon 17 Mar 2026, 10:00am — 45 mins (Standard Consultation)
              </div>
            </div>

            {/* Template field */}
            <div className="mb-6">
              <label className="text-sm font-medium text-text">Template</label>
              <select className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-primary">
                <option>Select template</option>
                <option>Progress Note</option>
                <option>NDIS Progress Note</option>
                <option>Initial Assessment</option>
                <option>SOAP Note</option>
              </select>
            </div>

            {/* Quick action buttons */}
            <div className="mb-6 flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                <LayoutGrid className="h-3.5 w-3.5" />
                Select
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                Copy recent note
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-text hover:bg-gray-50">
                Copy recent practitioner note
              </button>
            </div>

            {/* Rich text editor area */}
            <div className="min-h-[400px] rounded-lg border border-border bg-white p-4">
              {/* Toolbar */}
              <div className="mb-3 flex items-center gap-1 border-b border-border pb-3 text-text-secondary">
                <button className="rounded p-1.5 hover:bg-gray-100 font-bold text-sm">B</button>
                <button className="rounded p-1.5 hover:bg-gray-100 italic text-sm">I</button>
                <button className="rounded p-1.5 hover:bg-gray-100 underline text-sm">U</button>
                <span className="mx-1 text-border">|</span>
                <button className="rounded p-1.5 hover:bg-gray-100 text-sm">Aa</button>
                <button className="rounded p-1.5 hover:bg-gray-100 text-sm">H</button>
                <span className="mx-1 text-border">|</span>
                <button className="rounded px-2 py-1 hover:bg-gray-100 text-sm">More</button>
                <div className="flex-1" />
                <button className="rounded-lg border border-primary bg-white px-3 py-1 text-sm text-primary hover:bg-purple-50">
                  AI blocks
                </button>
              </div>

              <div className="text-sm text-text-secondary italic">
                Start typing your progress note...
              </div>
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
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm text-text-secondary">No reference notes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
