"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  DataTable,
  DateRangeFilter,
  FormSelect,
  PageHeader,
  TableBody,
  TableHead,
  Td,
  Th,
  Tr,
} from "@/components/ds";

const mockAppointments = [
  { date: "03/03/2026", time: "9:00 AM", client: "Liam Nguyen", service: "Initial Assessment", practitioner: "Dr Sarah Chen", location: "Melbourne CBD", status: "Completed", invoice: "Paid" },
  { date: "05/03/2026", time: "10:30 AM", client: "Olivia Smith", service: "Speech Therapy", practitioner: "Emma Williams", location: "Richmond", status: "Completed", invoice: "Paid" },
  { date: "08/03/2026", time: "2:00 PM", client: "Jack Thompson", service: "Occupational Therapy", practitioner: "Dr Sarah Chen", location: "Melbourne CBD", status: "No-show", invoice: "Unpaid" },
  { date: "10/03/2026", time: "11:00 AM", client: "Charlotte Brown", service: "Physiotherapy", practitioner: "James Anderson", location: "South Yarra", status: "Cancelled", invoice: "Voided" },
  { date: "12/03/2026", time: "3:30 PM", client: "Noah Wilson", service: "Psychology Session", practitioner: "Dr Lisa Park", location: "Melbourne CBD", status: "Completed", invoice: "Paid" },
  { date: "17/03/2026", time: "9:30 AM", client: "Amelia Davis", service: "Speech Therapy", practitioner: "Emma Williams", location: "Richmond", status: "Completed", invoice: "Unpaid" },
  { date: "20/03/2026", time: "1:00 PM", client: "Oliver Martin", service: "Exercise Physiology", practitioner: "James Anderson", location: "South Yarra", status: "Upcoming", invoice: "Pending" },
  { date: "24/03/2026", time: "4:00 PM", client: "Mia Taylor", service: "Initial Assessment", practitioner: "Dr Lisa Park", location: "Melbourne CBD", status: "Upcoming", invoice: "Pending" },
];

function statusVariantFor(status: string) {
  switch (status) {
    case "Completed": return "green" as const;
    case "Cancelled": return "red" as const;
    case "No-show": return "yellow" as const;
    case "Upcoming": return "blue" as const;
    default: return "gray" as const;
  }
}

export default function ReportsAppointmentsPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      <PageHeader title="Appointments">
        <Button>Export</Button>
        <Button>Learn about this report</Button>
      </PageHeader>

      {/* Date range */}
      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          <span>&#128197;</span> Date range *
        </label>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      {/* Contains note filter */}
      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          <span>&#128196;</span> Contains note
          <Button variant="ghost" size="sm" className="ml-1 text-red-400 hover:text-red-600">&#10005;</Button>
        </label>
        <FormSelect
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          className="!w-48"
        />
      </div>

      {/* Filter buttons */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </div>

      {showResults && (
        <>
          <p className="my-4 text-body-md text-text-secondary">{mockAppointments.length} items found.</p>
          <DataTable>
            <TableHead>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Client</Th>
              <Th>Service</Th>
              <Th>Practitioner</Th>
              <Th>Location</Th>
              <Th>Status</Th>
              <Th>Invoice status</Th>
            </TableHead>
            <TableBody>
              {mockAppointments.map((row, i) => (
                <Tr key={i}>
                  <Td>{row.date}</Td>
                  <Td>{row.time}</Td>
                  <Td>{row.client}</Td>
                  <Td>{row.service}</Td>
                  <Td>{row.practitioner}</Td>
                  <Td>{row.location}</Td>
                  <Td><Badge variant={statusVariantFor(row.status)}>{row.status}</Badge></Td>
                  <Td>{row.invoice}</Td>
                </Tr>
              ))}
            </TableBody>
          </DataTable>
        </>
      )}
    </>
  );
}
