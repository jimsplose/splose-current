import { Button, PageHeader, TableHead, Th, TableBody, Td, Pagination, Badge, statusVariant } from "@/components/ds";

export default function ClientCasesPage() {
  const mockCases = [
    { number: "0466", issueDate: "1 Mar 2026", expiryDate: "19 Mar 2026", assignee: "Hung Yee Wong", type: "Budget", allocated: "0.00 of 100.00", invoiced: "0.00 of 100.00", status: "Active" },
    { number: "0389", issueDate: "1 Oct 2025", expiryDate: "1 Nov 2025", assignee: "Unassigned", type: "Budget", allocated: "0.00 of 1,000.00", invoiced: "0.00 of 1,000.00", status: "Expired" },
    { number: "0405", issueDate: "30 Sep 2025", expiryDate: "1 Nov 2025", assignee: "Unassigned", type: "Hours", allocated: "3.00 of 3.00 hours", invoiced: "3.00 of 3.00 hours", status: "Expired" },
    { number: "indefinite", issueDate: "30 Sep 2025", expiryDate: "N/A", assignee: "Joseph Ge", type: "Appointments", allocated: "3 of 3 appointments", invoiced: "3 of 3 appointments", status: "Active" },
    { number: "0391", issueDate: "29 Sep 2025", expiryDate: "1 Nov 2025", assignee: "Joseph Ge", type: "Hours", allocated: "2.25 of 1.00 hour", invoiced: "2.25 of 1.00 hour", status: "Expired" },
    { number: "0388", issueDate: "28 Aug 2025", expiryDate: "1 Sep 2025", assignee: "Unassigned", type: "Appointments", allocated: "0 of 1000 appointments", invoiced: "0 of 1000 appointments", status: "Expired" },
    { number: "0361", issueDate: "15 Aug 2025", expiryDate: "22 Aug 2025", assignee: "Unassigned", type: "Budget", allocated: "0.00", invoiced: "0.00", status: "Expired" },
    { number: "0360", issueDate: "1 Aug 2025", expiryDate: "2 Aug 2026", assignee: "Cheng Ma", type: "Budget", allocated: "0.00 of 1,000.00", invoiced: "0.00 of 1,000.00", status: "Active" },
    { number: "0337", issueDate: "1 Jul 2025", expiryDate: "2 Jul 2026", assignee: "Unassigned", type: "Budget", allocated: "0.00 of 1,000.00", invoiced: "0.00 of 1,000.00", status: "Active" },
    { number: "0297 (BSB)", issueDate: "5 Jun 2025", expiryDate: "29 Jun 2025", assignee: "Unassigned", type: "Appointments", allocated: "0 of 10 appointments", invoiced: "0 of 10 appointments", status: "Expired" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <PageHeader title="Cases">
        <Button>+ New case</Button>
      </PageHeader>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full">
          <TableHead>
            <Th>Case Number</Th>
            <Th>Issue date</Th>
            <Th>Expiry date</Th>
            <Th>Assignee</Th>
            <Th>Type</Th>
            <Th>Allocated</Th>
            <Th>Invoiced</Th>
            <Th>Status</Th>
          </TableHead>
          <TableBody>
            {mockCases.map((c) => (
              <tr key={c.number} className="hover:bg-gray-50">
                <Td className="text-text">{c.number}</Td>
                <Td className="text-text-secondary">{c.issueDate}</Td>
                <Td className="text-text-secondary">{c.expiryDate}</Td>
                <Td className="text-text-secondary">{c.assignee}</Td>
                <Td className="text-text-secondary">{c.type}</Td>
                <Td className="text-text-secondary">{c.allocated}</Td>
                <Td className="text-text-secondary">{c.invoiced}</Td>
                <Td>
                  <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
                </Td>
              </tr>
            ))}
          </TableBody>
        </table>
        <Pagination totalItems={18} totalPages={2} itemsPerPage={10} />
      </div>
    </div>
  );
}
