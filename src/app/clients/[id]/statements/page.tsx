"use client";

import { useParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function ClientStatementsPage() {
  const params = useParams();
  const _id = params.id as string;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Statements</h1>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Email statement
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Download PDF
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="mb-4 flex items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text">Type*</label>
          <button className="inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text hover:bg-gray-50 min-w-[140px]">
            Activity
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text">Date range*</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              defaultValue="1 Mar 2026"
              className="w-[130px] rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-sm text-text-secondary">&mdash;</span>
            <input
              type="text"
              defaultValue="31 Mar 2026"
              className="w-[130px] rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text">Location*</label>
          <button className="inline-flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text hover:bg-gray-50 min-w-[160px]">
            All Locations
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </button>
        </div>

        <button className="inline-flex items-center rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Update
        </button>
      </div>

      {/* Show client address checkbox */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="checkbox"
          defaultChecked
          id="show-client-address"
          className="h-4 w-4 rounded border-border text-teal-600 accent-teal-600 focus:ring-teal-500"
        />
        <label htmlFor="show-client-address" className="text-sm text-text">
          Show client address
        </label>
      </div>

      {/* Empty content area */}
      <div className="rounded-lg border border-border bg-white p-8">
        <div className="min-h-[200px]" />
      </div>
    </div>
  );
}
