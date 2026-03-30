"use client";

import { useState } from "react";
import { Flex } from "antd";
import {
  Button,
  Badge,
  DateRangeFilter,
  FormSelect,
  PageHeader,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Tr,
  Td,
} from "@/components/ds";

const mockFormRows = [
  { form: "Intake Form", client: "Sarah Mitchell", status: "Completed", submitted: "11/03/2026", practitioner: "Dr Emily Watson" },
  { form: "Consent Form", client: "James O'Brien", status: "Completed", submitted: "11/03/2026", practitioner: "Dr Emily Watson" },
  { form: "Assessment Form", client: "Liam Nguyen", status: "Incomplete", submitted: "10/03/2026", practitioner: "Rachel Kim" },
  { form: "Intake Form", client: "Olivia Parker", status: "Not sent", submitted: "—", practitioner: "Rachel Kim" },
  { form: "Consent Form", client: "Noah Williams", status: "Completed", submitted: "09/03/2026", practitioner: "Tom Bradley" },
  { form: "Assessment Form", client: "Emma Chen", status: "Incomplete", submitted: "08/03/2026", practitioner: "Tom Bradley" },
];

function formStatusVariant(status: string) {
  if (status === "Completed") return "green" as const;
  if (status === "Incomplete") return "yellow" as const;
  return "gray" as const;
}

export default function ReportsFormPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      <PageHeader title="Forms">
        <Button>Export</Button>
        <Button>Learn about this report</Button>
      </PageHeader>

      <div style={{ marginBottom: 16 }}>
        <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          Date range *
        </Flex>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Flex align="center" gap={4} style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          Form type
        </Flex>
        <FormSelect
          options={[
            { value: "all", label: "All" },
            { value: "intake", label: "Intake" },
            { value: "consent", label: "Consent" },
            { value: "assessment", label: "Assessment" },
          ]}
          className="!w-48"
        />
      </div>

      <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 32 }}>
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </Flex>

      {showResults && (
        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--color-border)' }}>
          <DataTable>
            <TableHead>
              <Th>Form name</Th>
              <Th>Client</Th>
              <Th>Status</Th>
              <Th>Submitted date</Th>
              <Th>Practitioner</Th>
            </TableHead>
            <TableBody>
              {mockFormRows.map((row, i) => (
                <Tr key={i}>
                  <Td>{row.form}</Td>
                  <Td style={{ color: 'var(--color-primary)' }}>{row.client}</Td>
                  <Td><Badge variant={formStatusVariant(row.status)}>{row.status}</Badge></Td>
                  <Td>{row.submitted}</Td>
                  <Td>{row.practitioner}</Td>
                </Tr>
              ))}
            </TableBody>
          </DataTable>
        </div>
      )}
    </>
  );
}
