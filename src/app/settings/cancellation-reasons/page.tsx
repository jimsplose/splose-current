import { Button, Badge } from "@/components/ds";

const cancellationReasons = [
  { name: "Condition betteryyy", code: "" },
  { name: "Condition worse", code: "TEST" },
  { name: "Sick", code: "500" },
  { name: "No show due to health reason", code: "NSDH" },
  { name: "No show due to family issues", code: "NSDF" },
  { name: "No show due to unavailability of transport", code: "NSDT" },
  { name: "Cancelled 1", code: "" },
  { name: "No Show - sick", code: "" },
  { name: "Cancel", code: "CANCEL" },
  { name: "No show less than 2 days", code: "" },
];

export default function CancellationReasonsPage() {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-display-lg text-text">Cancellation reasons</h1>
        <Button variant="secondary">Show archived</Button>
      </div>
      <div className="divide-y divide-border rounded-lg border border-border bg-white">
        {cancellationReasons.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text">{r.name}</span>
              {r.code && <Badge variant="gray">{r.code}</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded p-1 text-text-secondary hover:bg-gray-100 hover:text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button className="rounded p-1 text-text-secondary hover:bg-red-50 hover:text-red-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
