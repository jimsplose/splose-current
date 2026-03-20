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
    title: "Appointment confirmation (new client)",
    createdAt: "3:22 pm, 5 Mar 2024",
  },
  {
    title: "Appointment confirmation (existing client)",
    createdAt: "3:22 pm, 5 Mar 2024",
  },
  {
    title: "Appointment reschedule",
    createdAt: "4:10 pm, 12 Apr 2024",
  },
  {
    title: "Cancellation notice",
    createdAt: "11:45 am, 20 Jun 2024",
  },
  {
    title: "Appointment reminder",
    createdAt: "9:00 am, 1 Aug 2024",
  },
];

export default function AppointmentTemplatesPage() {
  return (
    <div className="p-6">
      <PageHeader title="Appointment templates">
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
