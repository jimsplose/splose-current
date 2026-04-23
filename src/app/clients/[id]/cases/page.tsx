"use client";

import { useState } from "react";
import { Card, DataTable, PageHeader, TableHead, Th, TableBody, Tr, Td, Pagination, Badge, statusVariant } from "@/components/ds";
import { Button } from "antd";

const mockCases = [
    // ── Active cases ────────────────────────────────────────────────────
    {
      number: "0482",
      issueDate: "1 Mar 2026",
      expiryDate: "28 Feb 2027",
      assignee: "Sarah Chen",
      type: "Budget",
      allocated: "1,240.00 of 8,500.00",
      invoiced: "970.00 of 8,500.00",
      status: "Active",
      caseName: "NDIS Plan — Core Supports",
    },
    {
      number: "0466",
      issueDate: "1 Mar 2026",
      expiryDate: "19 Mar 2026",
      assignee: "Hung Yee Wong",
      type: "Budget",
      allocated: "0.00 of 100.00",
      invoiced: "0.00 of 100.00",
      status: "Active",
      caseName: "Private — Initial Assessment",
    },
    {
      number: "0460",
      issueDate: "15 Feb 2026",
      expiryDate: "15 Feb 2027",
      assignee: "James Wilson",
      type: "Hours",
      allocated: "8.50 of 20.00 hours",
      invoiced: "6.00 of 20.00 hours",
      status: "Active",
      caseName: "Medicare EPC — GP Referral",
    },
    {
      number: "indefinite",
      issueDate: "30 Sep 2025",
      expiryDate: "N/A",
      assignee: "Joseph Ge",
      type: "Appointments",
      allocated: "3 of 5 appointments",
      invoiced: "3 of 5 appointments",
      status: "Active",
      caseName: "DVA — Allied Health",
    },
    {
      number: "0360",
      issueDate: "1 Aug 2025",
      expiryDate: "2 Aug 2026",
      assignee: "Cheng Ma",
      type: "Budget",
      allocated: "420.00 of 1,000.00",
      invoiced: "420.00 of 1,000.00",
      status: "Active",
      caseName: "NDIS Plan — Capacity Building",
    },
    // ── Pending cases ───────────────────────────────────────────────────
    {
      number: "0490",
      issueDate: "20 Mar 2026",
      expiryDate: "20 Mar 2027",
      assignee: "Unassigned",
      type: "Budget",
      allocated: "0.00 of 12,000.00",
      invoiced: "0.00 of 12,000.00",
      status: "Pending",
      caseName: "WorkCover SA — Claim #WC-2026-1847",
    },
    {
      number: "0488",
      issueDate: "18 Mar 2026",
      expiryDate: "18 Sep 2026",
      assignee: "Unassigned",
      type: "Appointments",
      allocated: "0 of 6 appointments",
      invoiced: "0 of 6 appointments",
      status: "Pending",
      caseName: "Medicare EPC — Mental Health Plan",
    },
    // ── Closed case ─────────────────────────────────────────────────────
    {
      number: "0337",
      issueDate: "1 Jul 2025",
      expiryDate: "31 Dec 2025",
      assignee: "Sarah Chen",
      type: "Budget",
      allocated: "980.00 of 1,000.00",
      invoiced: "980.00 of 1,000.00",
      status: "Closed",
      caseName: "Private — Physiotherapy Program",
    },
    // ── Expired cases ───────────────────────────────────────────────────
    {
      number: "0405",
      issueDate: "30 Sep 2025",
      expiryDate: "1 Nov 2025",
      assignee: "Unassigned",
      type: "Hours",
      allocated: "3.00 of 3.00 hours",
      invoiced: "3.00 of 3.00 hours",
      status: "Expired",
      caseName: "Medicare EPC — OT Sessions",
    },
    {
      number: "0391",
      issueDate: "29 Sep 2025",
      expiryDate: "1 Nov 2025",
      assignee: "Joseph Ge",
      type: "Hours",
      allocated: "2.25 of 1.00 hour",
      invoiced: "2.25 of 1.00 hour",
      status: "Expired",
      caseName: "NDIS Plan — Therapy (Old)",
    },
    {
      number: "0389",
      issueDate: "1 Oct 2025",
      expiryDate: "1 Nov 2025",
      assignee: "Unassigned",
      type: "Budget",
      allocated: "0.00 of 1,000.00",
      invoiced: "0.00 of 1,000.00",
      status: "Expired",
      caseName: "Private — Assessment Block",
    },
    {
      number: "0388",
      issueDate: "28 Aug 2025",
      expiryDate: "1 Sep 2025",
      assignee: "Unassigned",
      type: "Appointments",
      allocated: "0 of 1000 appointments",
      invoiced: "0 of 1000 appointments",
      status: "Expired",
      caseName: "DVA — Bulk Appointments",
    },
    {
      number: "0361",
      issueDate: "15 Aug 2025",
      expiryDate: "22 Aug 2025",
      assignee: "Unassigned",
      type: "Budget",
      allocated: "0.00",
      invoiced: "0.00",
      status: "Expired",
      caseName: "Private — Trial Session",
    },
    {
      number: "0297 (BSB)",
      issueDate: "5 Jun 2025",
      expiryDate: "29 Jun 2025",
      assignee: "Unassigned",
      type: "Appointments",
      allocated: "0 of 10 appointments",
      invoiced: "0 of 10 appointments",
      status: "Expired",
      caseName: "WorkCover SA — BSB Review",
    },
];

export default function ClientCasesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(mockCases.length / pageSize);
  const paged = mockCases.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <PageHeader title="Cases">
        <Button>+ New case</Button>
      </PageHeader>

      <Card padding="none" style={{ overflowX: 'auto' }}>
        <DataTable>
          <TableHead>
            <Th>Case Number</Th>
            <Th>Case Name</Th>
            <Th>Issue date</Th>
            <Th>Expiry date</Th>
            <Th>Assignee</Th>
            <Th>Type</Th>
            <Th>Allocated</Th>
            <Th>Invoiced</Th>
            <Th>Status</Th>
          </TableHead>
          <TableBody>
            {paged.map((c) => (
              <Tr key={c.number + c.caseName}>
                <Td>{c.number}</Td>
                <Td style={{ fontWeight: 500 }}>{c.caseName}</Td>
                <Td color="secondary">{c.issueDate}</Td>
                <Td color="secondary">{c.expiryDate}</Td>
                <Td color="secondary">{c.assignee}</Td>
                <Td color="secondary">{c.type}</Td>
                <Td color="secondary">{c.allocated}</Td>
                <Td color="secondary">{c.invoiced}</Td>
                <Td>
                  <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={mockCases.length}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
}
