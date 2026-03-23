import { Button, Card, PageHeader, SearchBar, TableHead, Th, TableBody, Td, Pagination, Badge } from "@/components/ds";

export default function ClientFormsPage() {
  const mockForms = [
    {
      title: "baby due date test",
      status: "Incomplete",
      createdAt: "10:20 am, 2 Feb 2026",
      completed: "No",
      relatedAppt: "1:30 pm, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations",
    },
    {
      title: "Header test",
      status: "Incomplete",
      createdAt: "10:20 am, 2 Feb 2026",
      completed: "No",
      relatedAppt: "1:30 pm, 7 Feb 2026 – 2:3 Consultations 2:2 Consultations",
    },
    {
      title: "baby due date test",
      status: "Incomplete",
      createdAt: "10:16 am, 2 Feb 2026",
      completed: "No",
      relatedAppt: "11:30 am, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations",
    },
    {
      title: "Header test",
      status: "Incomplete",
      createdAt: "10:16 am, 2 Feb 2026",
      completed: "No",
      relatedAppt: "11:30 am, 7 Feb 2026 – 2:2 Consultations 2:3 Consultations",
    },
    {
      title: "baby due date test",
      status: "Incomplete",
      createdAt: "10:15 am, 2 Feb 2026",
      completed: "No",
      relatedAppt: "9:30 am, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations",
    },
    {
      title: "Header test",
      status: "Incomplete",
      createdAt: "10:15 am, 2 Feb 2026",
      completed: "No",
      relatedAppt: "9:30 am, 7 Feb 2026 – 2:2 Consultations 2:2 Consultations",
    },
    {
      title: "Header test",
      status: "Incomplete",
      createdAt: "9:18 am, 12 Jan 2026",
      completed: "No",
      relatedAppt: "10:00 am, 14 Jan 2026 – Group booking Sharon Test",
    },
    {
      title: "baby due date test",
      status: "Incomplete",
      createdAt: "9:18 am, 12 Jan 2026",
      completed: "No",
      relatedAppt: "10:00 am, 14 Jan 2026 – Group booking Sharon Test",
    },
    {
      title: "baby due date test",
      status: "Incomplete",
      createdAt: "10:22 am, 30 Oct 2025",
      completed: "No",
      relatedAppt: "6:15 am, 28 Oct 2025 – 1:1 Consultation 1:1 Consultation",
    },
    {
      title: "Header test",
      status: "Incomplete",
      createdAt: "10:22 am, 30 Oct 2025",
      completed: "No",
      relatedAppt: "9:15 am, 28 Oct 2025 – 1:1 Consultation 1:1 Consultation",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <PageHeader title="Forms">
        <Button>+ New form</Button>
      </PageHeader>

      <SearchBar placeholder="Search for title" />

      <Card padding="none" className="overflow-x-auto">
        <table className="w-full">
          <TableHead>
            <Th>Title</Th>
            <Th>Created at</Th>
            <Th>Completed</Th>
            <Th>Related appointment</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {mockForms.map((form, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <Td>
                  <span className="text-text">{form.title}</span>
                  <Badge variant="gray" className="ml-2">
                    {form.status}
                  </Badge>
                </Td>
                <Td className="text-text-secondary">{form.createdAt}</Td>
                <Td className="text-text-secondary">{form.completed}</Td>
                <Td className="text-primary">{form.relatedAppt}</Td>
                <Td align="right">
                  <Button variant="ghost" size="sm" className="text-text-secondary">...</Button>
                </Td>
              </tr>
            ))}
          </TableBody>
        </table>
        <Pagination totalItems={mockForms.length} itemsPerPage={10} />
      </Card>
    </div>
  );
}
