import { prisma } from "@/lib/prisma";
import { Plus, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, DataTable, PageHeader, SearchBar, TableHead, Th, TableBody, Tr, Td, Pagination, EmptyState } from "@/components/ds";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await prisma.clinicalNote.findMany({
    include: { client: true, practitioner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-[22.5px] py-[5px]">
      <PageHeader title="Progress notes">
        <Button>Scroll view</Button>
        <Button>
          <Link href="/notes/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New note
          </Link>
        </Button>
      </PageHeader>

      <SearchBar placeholder="Search for content and title" />

      <Card padding="none" className="overflow-x-auto">
        <DataTable minWidth="600px">
          <TableHead>
            <Th>Name</Th>
            <Th>
              <div className="flex items-center gap-1">
                Created by
                <ArrowUpDown className="h-3 w-3 text-text-secondary" />
              </div>
            </Th>
            <Th hidden="md">Service date</Th>
            <Th hidden="lg">Last update</Th>
            <Th hidden="md">
              <div className="flex items-center gap-1">
                Created at
                <ArrowUpDown className="h-3 w-3 text-text-secondary" />
              </div>
            </Th>
          </TableHead>
          <TableBody>
            {notes.map((note) => (
              <Tr key={note.id} clickable className="group">
                <Td>
                  <Link href={`/notes/${note.id}`} className="flex items-center gap-2">
                    <span className="text-sm text-primary group-hover:underline">
                      {note.client.firstName} {note.client.lastName}
                    </span>
                    <span className="text-sm text-text-secondary">— {note.template}</span>
                    {note.signed ? (
                      <Badge variant="green">Final</Badge>
                    ) : (
                      <Badge variant="gray">Draft</Badge>
                    )}
                  </Link>
                </Td>
                <Td className="text-text-secondary">
                  <Link href={`/notes/${note.id}`} className="block">
                    {note.practitioner.name}
                  </Link>
                </Td>
                <Td hidden="md" className="text-text-secondary">
                  <Link href={`/notes/${note.id}`} className="block">
                    {formatDate(note.date)}
                  </Link>
                </Td>
                <Td hidden="lg" className="text-text-secondary">
                  <Link href={`/notes/${note.id}`} className="block">
                    {formatDate(note.date)}
                  </Link>
                </Td>
                <Td hidden="md" className="text-text-secondary">
                  <Link href={`/notes/${note.id}`} className="block">
                    {formatDate(note.date)}
                  </Link>
                </Td>
              </Tr>
            ))}
            {notes.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState message="No progress notes found. Create your first note to get started." className="py-12" />
                </td>
              </tr>
            )}
          </TableBody>
        </DataTable>
        <Pagination currentPage={1} totalPages={1} totalItems={notes.length} itemsPerPage={10} />
      </Card>
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
