"use client";

import { useState } from "react";
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

      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          Date range *
        </label>
        <DateRangeFilter startDate="2026-03-11" endDate="2026-03-11" />
      </div>

      <div className="mb-4">
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          Form type
        </label>
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

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Button>Add filter</Button>
        <Button>Save filters</Button>
        <Button>Load filters</Button>
        <Button variant="primary" onClick={() => setShowResults(true)}>Run report</Button>
      </div>

      {showResults && (
        <div className="overflow-x-auto rounded-lg border border-border">
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
                  <Td className="text-primary">{row.client}</Td>
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
