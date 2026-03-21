"use client";

import { Button, Badge, Dropdown, DropdownTriggerButton } from "@/components/ds";

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

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Delete", value: "delete", danger: true },
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
            <Dropdown
              align="right"
              trigger={<DropdownTriggerButton />}
              items={dropdownItems}
              onSelect={() => {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
