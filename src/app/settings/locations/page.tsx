import { Button, DataTable, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

const locations = [
  { name: "East Clinics", address: "", lastUpdate: "12:24 pm, 6 Mar 2026" },
  { name: "Splose OT", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
  { name: "Ploc", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
  { name: "Tasks", address: "", lastUpdate: "11:59 am, 5 Mar 2026" },
  { name: "Sharon\u2019s", address: "", lastUpdate: "2:08 pm, 26 Feb 2026" },
  { name: "One service only", address: "297 Pirie St, Adelaide, SA, 5000", lastUpdate: "2:08 pm, 26 Feb 2026" },
];

export default function LocationsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Locations</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary">+ New location</Button>
        </div>
      </div>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Address</Th><Th>Last update</Th></TableHead>
        <TableBody>
          {locations.map((loc) => (
            <tr key={loc.name} className="hover:bg-gray-50 cursor-pointer">
              <Td className="font-medium text-text">{loc.name}</Td>
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
