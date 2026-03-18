import { prisma } from "@/lib/prisma";
import { Plus, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Button, PageHeader, TableHead, Th, TableBody, Td, Pagination } from "@/components/ds";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await prisma.clinicalNote.findMany({
    include: { client: true, practitioner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 sm:p-6">
      <PageHeader title="Progress notes">
        <Button>
          Scroll view
        </Button>
        <Link
          href="/notes/new"
          className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
          New note
        </Link>
      </PageHeader>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for content and title"
          className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <Button>
          Search
        </Button>
      </div>

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
              <tr
                key={note.id}
                className="group cursor-pointer transition-colors hover:bg-purple-50/50"
              >
                <Td>
                  <Link href={`/notes/${note.id}`} className="flex items-center gap-2">
                    <span className="text-sm text-primary group-hover:underline">
                      {note.client.firstName} {note.client.lastName}
                    </span>
                    <span className="text-sm text-text-secondary">— {note.template}</span>
                    {note.signed ? (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                        Final
                      </span>
                    ) : (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                        Draft
                      </span>
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
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-text-secondary">
                  No progress notes found. Create your first note to get started.
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
