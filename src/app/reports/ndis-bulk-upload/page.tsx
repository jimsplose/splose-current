import Link from "next/link";
import { Button, PageHeader, DataTable, TableHead, Th, TableBody, Td, Badge, Pagination } from "@/components/ds";

const uploads = [
  { id: "54901", date: "22 Mar 2026", items: 12, status: "Done", practitioner: "Sarah Chen" },
  { id: "54800", date: "15 Mar 2026", items: 8, status: "Error", practitioner: "James Wilson" },
  { id: "54700", date: "8 Mar 2026", items: 15, status: "Done", practitioner: "Sarah Chen" },
  { id: "54600", date: "1 Mar 2026", items: 6, status: "Done", practitioner: "Emily Rodriguez" },
];

export default function NdisBulkUploadPage() {
  return (
    <>
      <PageHeader title="NDIS bulk upload">
        <Link href="/reports/ndis-bulk-upload/new">
          <Button variant="primary">New upload</Button>
        </Link>
      </PageHeader>

      <DataTable>
        <TableHead>
          <Th>Date</Th>
          <Th>Practitioner</Th>
          <Th align="right">Items</Th>
          <Th>Status</Th>
        </TableHead>
        <TableBody>
          {uploads.map((u) => (
            <tr key={u.id} className="border-b border-border hover:bg-gray-50">
              <Td>
                <Link href={`/reports/ndis-bulk-upload/${u.id}`} className="text-primary hover:underline">
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
      <Pagination currentPage={1} totalPages={1} totalItems={4} />
    </>
  );
}
