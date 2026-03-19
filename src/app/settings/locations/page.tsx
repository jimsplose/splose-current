import Link from "next/link";
import { Button, PageHeader, DataTable, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

const locations = [
  { id: 128, name: "East Clinics", address: "", lastUpdate: "12:24 pm, 6 Mar 2026" },
  { id: 129, name: "Splose OT", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
  { id: 130, name: "Ploc", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
  { id: 131, name: "Tasks", address: "", lastUpdate: "11:59 am, 5 Mar 2026" },
  { id: 132, name: "Sharon\u2019s", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
  { id: 133, name: "One service only", address: "297 Pirie St, Adelaide, SA, 5000", lastUpdate: "2:08 pm, 26 Feb 2026" },
];

export default function LocationsPage() {
  return (
    <div className="p-6">
      <PageHeader title="Locations">
        <Button variant="secondary">Show archived</Button>
        <Button variant="primary">+ New location</Button>
      </PageHeader>
      <DataTable>
        <TableHead>
          <Th>Name</Th>
          <Th>Address</Th>
          <Th>Last update</Th>
        </TableHead>
        <TableBody>
          {locations.map((loc) => (
            <tr key={loc.id} className="cursor-pointer hover:bg-gray-50">
              <Td>
                <Link
                  href={`/settings/locations/edit/${loc.id}`}
                  className="font-medium text-text hover:text-primary"
                >
                  {loc.name}
                </Link>
              </Td>
              <Td className="text-text-secondary">{loc.address}</Td>
              <Td className="text-text-secondary">{loc.lastUpdate}</Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={6} itemsPerPage={10} showPageSize={false} />
    </div>
  );
}
