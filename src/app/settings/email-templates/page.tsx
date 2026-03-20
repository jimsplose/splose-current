import {
  Button,
  PageHeader,
  SearchBar,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
} from "@/components/ds";
import { MoreHorizontal } from "lucide-react";

const templates = [
  {
    title: "#1 Invoice email template",
    createdAt: "3:22 pm, 5 Mar 2024",
  },
  {
    title: "Appointment confirmation email",
    createdAt: "3:22 pm, 5 Mar 2024",
  },
  {
    title: "New client welcome email",
    createdAt: "10:15 am, 18 Apr 2024",
  },
  {
    title: "Appointment cancellation email",
    createdAt: "2:30 pm, 22 May 2024",
  },
  {
    title: "Payment receipt email",
    createdAt: "9:00 am, 1 Jul 2024",
  },
];

export default function EmailTemplatesPage() {
  return (
    <div className="p-6">
      <PageHeader title="Email templates">
        <Button variant="secondary">Show archived</Button>
        <Button variant="primary">+ New template</Button>
      </PageHeader>

      <SearchBar placeholder="Search for title" />

      <DataTable>
        <TableHead>
          <Th>Title</Th>
          <Th>Created at</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {templates.map((t) => (
            <tr key={t.title} className="hover:bg-gray-50">
              <Td className="text-text">{t.title}</Td>
              <Td>{t.createdAt}</Td>
              <Td align="right">
                <button className="rounded p-1 text-text-secondary hover:bg-gray-100 hover:text-text">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>

      <Pagination
        currentPage={1}
        totalPages={1}
        totalItems={templates.length}
        itemsPerPage={10}
        showPageSize={false}
      />
    </div>
  );
}
