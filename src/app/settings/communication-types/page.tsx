import { Button, DataTable, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

const communicationTypes = [
  { name: "SMS", defaultType: true },
  { name: "Email", defaultType: true },
  { name: "Phone call", defaultType: false },
  { name: "In-person", defaultType: false },
  { name: "fax", defaultType: false },
  { name: "Admin Notes", defaultType: false },
];

export default function CommunicationTypesPage() {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Communication types</h1>
        <Button variant="primary">+ Add communication type</Button>
      </div>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Default type</Th><Th>Actions</Th></TableHead>
        <TableBody>
          {communicationTypes.map((c, i) => (
            <tr key={i} className="border-b border-border">
              <Td>{c.name}</Td>
              <Td><span className={c.defaultType ? "text-green-600" : "text-red-500"}>{c.defaultType ? "Yes" : "No"}</span></Td>
              <Td>{!c.defaultType ? <button className="text-text-secondary hover:text-text">•••</button> : <span className="text-text-secondary">-</span>}</Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={communicationTypes.length} itemsPerPage={10} />
    </div>
  );
}
