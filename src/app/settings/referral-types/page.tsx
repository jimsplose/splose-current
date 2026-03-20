import {
  Button,
  TableHead,
  Th,
  TableBody,
  Td,
  Pagination,
} from "@/components/ds";

const referralTypes = [
  { name: "Client", defaultType: true },
  { name: "Contact", defaultType: true },
  { name: "Other", defaultType: true },
  { name: "Facebook", defaultType: false },
  { name: "Google", defaultType: false },
  { name: "Doctor", defaultType: false },
  { name: "GP", defaultType: false },
];

export default function ReferralTypesPage() {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Referral types</h1>
        <Button variant="secondary">+ Add referral type</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full">
          <TableHead>
            <Th>Name</Th>
            <Th>Default type</Th>
            <Th>Actions</Th>
          </TableHead>
          <TableBody>
            {referralTypes.map((r) => (
              <tr key={r.name} className="border-b border-border">
                <Td>{r.name}</Td>
                <Td>
                  <span
                    className={
                      r.defaultType ? "text-green-600" : "text-red-500"
                    }
                  >
                    {r.defaultType ? "Yes" : "No"}
                  </span>
                </Td>
                <Td>
                  {r.defaultType ? (
                    <span className="text-text-secondary">-</span>
                  ) : (
                    <button className="text-text-secondary hover:text-text text-lg leading-none">
                      &bull;&bull;&bull;
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </TableBody>
        </table>
        <Pagination
          currentPage={1}
          totalPages={1}
          totalItems={referralTypes.length}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
