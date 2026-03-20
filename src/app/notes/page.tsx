import { prisma } from "@/lib/prisma";
import { Plus, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Badge, Button, PageHeader, SearchBar, TableHead, Th, TableBody, Td, Pagination, EmptyState } from "@/components/ds";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await prisma.clinicalNote.findMany({
    include: { client: true, practitioner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Progress notes">
        <Button>Scroll view</Button>
        <Link
          href="/notes/new"
          className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-label-lg text-text hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
          New note
        </Link>
      </PageHeader>

      <SearchBar placeholder="Search for content and title" />

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[600px]">
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
              <tr key={note.id} className="group cursor-pointer transition-colors hover:bg-purple-50/50">
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
              </tr>
            ))}
            {notes.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState message="No progress notes found. Create your first note to get started." className="py-12" />
                </td>
              </tr>
            )}
          </TableBody>
        </table>
        <Pagination currentPage={1} totalPages={1} totalItems={notes.length} itemsPerPage={10} />
      </div>
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
