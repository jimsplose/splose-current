"use client";

import { Button, DataTable, TableHead, Th, TableBody, Td, Dropdown, DropdownTriggerButton } from "@/components/ds";

const busyTimes = [
  { name: "Leave me alone", color: "#ef4444", utilisation: "Excluded", duration: 15 },
  { name: "OT referral", color: "#f59e0b", utilisation: "Excluded", duration: 30 },
  { name: "Meeting", color: "#1f2937", utilisation: "Excluded", duration: 30 },
  { name: "Lunch", color: "#6366f1", utilisation: "Excluded", duration: 30 },
  { name: "Admin", color: "#a855f7", utilisation: "Included", duration: 30 },
  { name: "CPD", color: "#3b82f6", utilisation: "Excluded", duration: 30 },
  { name: "Travel", color: "#22c55e", utilisation: "Excluded", duration: 30 },
];

const dropdownItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export default function BusyTimesPage() {
  return (
    <div className="p-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-display-lg text-text">Busy time types</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary">+ New type</Button>
        </div>
      </div>
      <p className="mb-6 text-sm text-text-secondary">
        Use busy time to indicate non billable events in Practitioner calendars. You can change utilisation settings to control whether specific types of busy time are used in utilisation reports.
      </p>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Utilisation</Th><Th>Duration (mins)</Th><Th>Actions</Th></TableHead>
        <TableBody>
          {busyTimes.map((b, i) => (
            <tr key={i} className="border-b border-border">
              <Td><div className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: b.color }} />{b.name}</div></Td>
              <Td>{b.utilisation}</Td><Td>{b.duration}</Td>
              <Td>
                <Dropdown
                  align="right"
                  trigger={<DropdownTriggerButton />}
                  items={dropdownItems}
                  onSelect={() => {}}
                />
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
    </div>
  );
}
