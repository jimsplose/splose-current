"use client";

import Link from "next/link";
import { Button, ListPage, DataTable, TableHead, Th, TableBody, Td, Badge } from "@/components/ds";

const uploads = [
  { id: "54901", date: "22 Mar 2026", items: 12, status: "Done", practitioner: "Sarah Chen" },
  { id: "54800", date: "15 Mar 2026", items: 8, status: "Error", practitioner: "James Wilson" },
  { id: "54700", date: "8 Mar 2026", items: 15, status: "Done", practitioner: "Sarah Chen" },
  { id: "54600", date: "1 Mar 2026", items: 6, status: "Done", practitioner: "Emily Rodriguez" },
];

export default function NdisBulkUploadPage() {
  return (
    <ListPage
      title="NDIS bulk upload"
      actions={
        <Link href="/reports/ndis-bulk-upload/new">
          <Button variant="primary">New upload</Button>
        </Link>
      }
    >
      <DataTable>
        <TableHead>
          <Th>Date</Th>
          <Th>Practitioner</Th>
          <Th align="right">Items</Th>
          <Th>Status</Th>
        </TableHead>
        <TableBody>
          {uploads.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <Td>
                <Link href={`/reports/ndis-bulk-upload/${u.id}`} style={{ color: 'var(--color-primary)' }}>
                  {u.date}
                </Link>
              </Td>
              <Td>{u.practitioner}</Td>
              <Td align="right">{u.items}</Td>
              <Td>
                <Badge variant={u.status === "Done" ? "green" : "red"}>{u.status}</Badge>
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
    </ListPage>
  );
}
