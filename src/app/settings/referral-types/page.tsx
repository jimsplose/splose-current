import { Button, DataTable, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

const referralTypes = [
  { name: "Self-referral", defaultType: true },
  { name: "GP referral", defaultType: false },
  { name: "Specialist referral", defaultType: false },
  { name: "Hospital referral", defaultType: false },
  { name: "NDIS referral", defaultType: false },
  { name: "School referral", defaultType: false },
  { name: "Online search", defaultType: false },
  { name: "Word of mouth", defaultType: false },
];

export default function ReferralTypesPage() {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Referral types</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Show archived</Button>
          <Button variant="primary">+ New referral type</Button>
        </div>
      </div>
      <DataTable>
        <TableHead><Th>Name</Th><Th>Default type</Th><Th>Actions</Th></TableHead>
        <TableBody>
          {referralTypes.map((r, i) => (
            <tr key={i} className="border-b border-border">
              <Td>{r.name}</Td>
              <Td><span className={r.defaultType ? "text-green-600" : "text-red-500"}>{r.defaultType ? "Yes" : "No"}</span></Td>
              <Td><button className="text-text-secondary hover:text-text">•••</button></Td>
            </tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination currentPage={1} totalPages={1} totalItems={referralTypes.length} itemsPerPage={10} />
    </div>
  );
}
