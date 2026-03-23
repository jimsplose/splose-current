import { ArrowUpDown, Filter } from "lucide-react";
import { Button, Card, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

export default function ClientPractitionerAccessPage() {
  const mockPractitioners = [
    { name: "Delvin Khor", role: "Practitioner admin", roleType: "Practitioner admin", group: "---", status: "Linked" },
    {
      name: "Hrishikesh Koli",
      role: "Practitioner admin",
      roleType: "Practitioner admin",
      group: "---",
      status: "Linked",
    },
    {
      name: "Hung Yee Wong",
      role: "Practitioner admin",
      roleType: "Practitioner admin",
      group: "---",
      status: "Linked",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <h1 className="mb-4 text-display-lg text-text">Practitioner access</h1>
      <p className="mb-6 text-sm text-text-secondary">
        You can link practitioners to clients via creating an appointment or support activity in the calendar tab.{" "}
        <span className="cursor-pointer text-primary hover:underline">Learn more</span>
      </p>

      <Card padding="none" className="overflow-x-auto">
        <table className="w-full">
          <TableHead>
            <Th>
              <div className="flex items-center gap-1">
                Name
                <ArrowUpDown className="h-3 w-3 text-text-secondary" />
              </div>
            </Th>
            <Th>Role name</Th>
            <Th>Role type</Th>
            <Th>
              <div className="flex items-center gap-1">
                Group
                <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                <Filter className="h-3 w-3 text-text-secondary" />
              </div>
            </Th>
            <Th>Status</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {mockPractitioners.map((p) => (
              <tr key={p.name} className="hover:bg-gray-50">
                <Td>
                  <div>
                    <span className="text-text">{p.name}</span>
                    <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-caption-sm font-medium text-green-700">
                      Account owner
                    </span>
                  </div>
                </Td>
                <Td className="text-text-secondary">{p.role}</Td>
                <Td className="text-text-secondary">{p.roleType}</Td>
                <Td className="text-text-secondary">{p.group}</Td>
                <Td className="text-text-secondary">{p.status}</Td>
                <Td align="right">
                  <Button variant="ghost" size="sm" className="text-text-secondary">...</Button>
                </Td>
              </tr>
            ))}
          </TableBody>
        </table>
        <Pagination totalItems={mockPractitioners.length} itemsPerPage={10} />
      </Card>
    </div>
  );
}
