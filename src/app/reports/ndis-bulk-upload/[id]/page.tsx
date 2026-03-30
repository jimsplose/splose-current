import { Button, PageHeader, DataTable, TableHead, Th, TableBody, Td, Badge, Alert } from "@/components/ds";

const items = [
  { client: "Emma Thompson", service: "Individual Therapy", date: "22 Mar 2026", amount: "$193.99", status: "Success" },
  { client: "Liam Johnson", service: "Group Session", date: "21 Mar 2026", amount: "$97.00", status: "Success" },
  { client: "Olivia Davis", service: "Plan Management", date: "20 Mar 2026", amount: "$65.09", status: "Error" },
  { client: "Noah Wilson", service: "Individual Therapy", date: "19 Mar 2026", amount: "$193.99", status: "Success" },
];

export default function NdisBulkUploadDetailPage() {
  const hasErrors = items.some((i) => i.status === "Error");

  return (
    <>
      <PageHeader title="NDIS bulk upload #54901">
        <Button>Export</Button>
      </PageHeader>

      {hasErrors && (
        <Alert variant="error" className="mb-4">
          1 item failed to upload. Please review and retry.
        </Alert>
      )}

      <DataTable>
        <TableHead>
          <Th>Client</Th>
          <Th>Service</Th>
          <Th>Date</Th>
          <Th align="right">Amount</Th>
          <Th>Status</Th>
        </TableHead>
        <TableBody>
          {items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-gray-50">
              <Td>{item.client}</Td>
              <Td>{item.service}</Td>
              <Td>{item.date}</Td>
              <Td align="right">{item.amount}</Td>
              <Td>
                <Badge variant={item.status === "Success" ? "green" : "red"}>{item.status}</Badge>
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
    </>
  );
}
