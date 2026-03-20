import {
  Button,
  PageHeader,
  Badge,
  DataTable,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
} from "@/components/ds";
import { MoreHorizontal, ExternalLink } from "lucide-react";

const bookings = [
  {
    name: "ACME Online Booking",
    status: "Active" as const,
    link: "book.splose.com/acme-clinic",
  },
  {
    name: "Main Clinic",
    status: "Active" as const,
    link: "book.splose.com/main-clinic",
  },
  {
    name: "North Branch",
    status: "Inactive" as const,
    link: "book.splose.com/north-branch",
  },
];

export default function OnlineBookingsPage() {
  return (
    <div className="p-6">
      <PageHeader title="Online bookings">
        <Button variant="primary">+ New booking page</Button>
      </PageHeader>

      <p className="mb-4 text-sm text-text-secondary">
        Create and manage online booking pages for your practice. Clients can
        book appointments directly through these links.
      </p>

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Status</Th>
          <Th>Link</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {bookings.map((b) => (
            <tr key={b.name} className="hover:bg-gray-50">
              <Td className="font-medium text-text">{b.name}</Td>
              <Td>
                <Badge
                  variant={b.status === "Active" ? "green" : "gray"}
                >
                  {b.status}
                </Badge>
              </Td>
              <Td>
                <a
                  href={`https://${b.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {b.link}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Td>
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
        totalItems={bookings.length}
        itemsPerPage={10}
        showPageSize={false}
      />
    </div>
  );
}
