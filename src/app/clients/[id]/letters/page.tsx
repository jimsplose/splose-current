import { Plus, MoreHorizontal } from "lucide-react";
import { Button, Card, DataTable, PageHeader, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

export const dynamic = "force-dynamic";

const lettersData = [
  {
    id: "1",
    title: "DVA",
    location: "East Clinics",
    writtenBy: "Hung Yee Wong",
    createdAt: "4:54 pm, 5 Mar 2026",
    lastUpdated: "4:54 pm, 5 Mar 2026",
  },
];

export default async function ClientLettersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  void id;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <PageHeader title="Letters">
        <Button>
          <Plus className="h-4 w-4" />
          New letter
        </Button>
      </PageHeader>

      <Card padding="none" className="overflow-x-auto">
        <DataTable>
          <TableHead>
            <Th>Title</Th>
            <Th>Location</Th>
            <Th>Written by</Th>
            <Th>Created at</Th>
            <Th>Last updated</Th>
            <Th align="right">Actions</Th>
          </TableHead>
          <TableBody>
            {lettersData.map((letter) => (
              <tr key={letter.id} className="hover:bg-gray-50">
                <Td className="text-text">{letter.title}</Td>
                <Td className="text-text-secondary">{letter.location}</Td>
                <Td className="text-text-secondary">{letter.writtenBy}</Td>
                <Td className="text-text-secondary">{letter.createdAt}</Td>
                <Td className="text-text-secondary">{letter.lastUpdated}</Td>
                <Td align="right">
                  <Button variant="ghost" size="sm" className="text-text-secondary">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </Td>
              </tr>
            ))}
          </TableBody>
        </DataTable>
        <Pagination totalItems={1} itemsPerPage={10} />
      </Card>
    </div>
  );
}
