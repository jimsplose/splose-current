"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  Button,
  Badge,
  DateRangeFilter,
  PageHeader,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
} from "@/components/ds";

const mockActivityRows = [
  { date: "11/03/2026", client: "Sarah Mitchell", activityType: "Transport", practitioner: "Dr Emily Watson", duration: "30 min", location: "Mobile", status: "Completed" },
  { date: "11/03/2026", client: "James O'Brien", activityType: "Non-labour", practitioner: "Rachel Kim", duration: "15 min", location: "In clinic", status: "Completed" },
  { date: "10/03/2026", client: "Liam Nguyen", activityType: "Provider travel", practitioner: "Tom Bradley", duration: "45 min", location: "Mobile", status: "In progress" },
  { date: "10/03/2026", client: "Olivia Parker", activityType: "Transport", practitioner: "Dr Emily Watson", duration: "20 min", location: "Mobile", status: "Completed" },
  { date: "09/03/2026", client: "Noah Williams", activityType: "Non-labour", practitioner: "Rachel Kim", duration: "10 min", location: "In clinic", status: "Pending" },
  { date: "09/03/2026", client: "Emma Chen", activityType: "Provider travel", practitioner: "Tom Bradley", duration: "60 min", location: "Mobile", status: "Completed" },
];

function activityStatusVariant(status: string) {
  if (status === "Completed") return "green" as const;
  if (status === "In progress") return "blue" as const;
  if (status === "Pending") return "yellow" as const;
  return "gray" as const;
}

export default function ReportsSupportActivitiesPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      <PageHeader title="Support activities">
        <Button>Export</Button>
        <Button>Learn about this report</Button>
      </PageHeader>

      <div style={{ marginBottom: 16 }}>
        <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--ant-color-text-secondary)' }}>
          Date range *
        </Flex>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 32 }}>
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </Flex>

      {showResults && (
        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--ant-color-border)' }}>
          <DataTable>
            <TableHead>
              <Th>Date</Th>
              <Th>Client</Th>
              <Th>Activity type</Th>
              <Th>Practitioner</Th>
              <Th>Duration</Th>
              <Th>Location</Th>
              <Th>Status</Th>
            </TableHead>
            <TableBody>
              {mockActivityRows.map((row, i) => (
                <Tr key={i}>
                  <Td>{row.date}</Td>
                  <Td style={{ color: 'var(--ant-color-primary)' }}>{row.client}</Td>
                  <Td>{row.activityType}</Td>
                  <Td>{row.practitioner}</Td>
                  <Td>{row.duration}</Td>
                  <Td>{row.location}</Td>
                  <Td><Badge variant={activityStatusVariant(row.status)}>{row.status}</Badge></Td>
                </Tr>
              ))}
            </TableBody>
          </DataTable>
        </div>
      )}
    </>
  );
}
