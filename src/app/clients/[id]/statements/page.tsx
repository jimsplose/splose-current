"use client";

import { useParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button, PageHeader } from "@/components/ds";

export default function ClientStatementsPage() {
  const params = useParams();
  const _id = params.id as string;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <PageHeader title="Statements">
        <Button>Email statement</Button>
        <Button>Download PDF</Button>
      </PageHeader>

      {/* Filter row */}
      <div className="mb-4 flex items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-label-lg text-text">Type*</label>
          <Button className="min-w-[140px] justify-between">
            Activity
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-label-lg text-text">Date range*</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              defaultValue="1 Mar 2026"
              className="w-[130px] rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <span className="text-sm text-text-secondary">&mdash;</span>
            <input
              type="text"
              defaultValue="31 Mar 2026"
              className="w-[130px] rounded-lg border border-border bg-white px-3 py-2 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-label-lg text-text">Location*</label>
          <Button className="min-w-[160px] justify-between">
            All Locations
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </Button>
        </div>

        <Button>Update</Button>
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
