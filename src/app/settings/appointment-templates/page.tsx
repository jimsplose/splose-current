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
    name: "Appointment confirmation (new client)",
    type: "Confirmation",
    sms: true,
    email: true,
    lastModified: "4:51 pm, 10 Feb 2026",
  },
  {
    name: "Appointment rescheduled",
    type: "Reschedule",
    sms: true,
    email: true,
    lastModified: "3:46 pm, 20 Jun 2025",
  },
  {
    name: "Appointment cancellation",
    type: "Cancellation",
    sms: true,
    email: true,
    lastModified: "2:39 pm, 2 Feb 2026",
  },
  {
    name: "Appointment reminder",
    type: "Reminder",
    sms: false,
    email: false,
    lastModified: "10:51 am, 9 Mar 2026",
  },
  {
    name: "Confirmation Zoom",
    type: "Confirmation",
    sms: false,
    email: true,
    lastModified: "12:59 pm, 10 Jun 2025",
  },
  {
    name: "Zoom Reminder 24hr",
    type: "Reminder",
    sms: false,
    email: true,
    lastModified: "12:15 pm, 28 Apr 2025",
  },
  {
    name: "Zoom Reminder 48hrs",
    type: "Reminder",
    sms: false,
    email: false,
    lastModified: "2:37 pm, 13 Dec 2023",
  },
];

function OnOffText({ value }: { value: boolean }) {
  return (
    <span className={value ? "text-green-600" : "text-red-500"}>
      {value ? "On" : "Off"}
    </span>
  );
}

export default function AppointmentTemplatesPage() {
  return (
    <div className="p-6">
      <PageHeader title="Appointment templates">
        <Button variant="primary">+ New template</Button>
      </PageHeader>

      <SearchBar placeholder="Search for template and type" />

      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Type</Th>
          <Th>SMS</Th>
          <Th>Email</Th>
          <Th>Last modified</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {templates.map((t) => (
            <tr key={t.name} className="hover:bg-gray-50">
              <Td className="text-text">{t.name}</Td>
              <Td>{t.type}</Td>
              <Td>
                <OnOffText value={t.sms} />
              </Td>
              <Td>
                <OnOffText value={t.email} />
              </Td>
              <Td>{t.lastModified}</Td>
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
