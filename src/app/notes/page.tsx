import { prisma } from "@/lib/prisma";
import { Plus, ArrowUpDown } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await prisma.clinicalNote.findMany({
    include: { client: true, practitioner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-text">Progress notes</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Scroll view
          </button>
          <Link
            href="/notes/new"
            className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            New note
          </Link>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search for content and title"
          className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
          Search
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-purple-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  Created by
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                </div>
              </th>
              <th className="hidden px-4 py-3 text-left text-sm font-medium text-text md:table-cell">Service date</th>
              <th className="hidden px-4 py-3 text-left text-sm font-medium text-text lg:table-cell">Last update</th>
              <th className="hidden px-4 py-3 text-left text-sm font-medium text-text md:table-cell">
                <div className="flex items-center gap-1">
                  Created at
                  <ArrowUpDown className="h-3 w-3 text-text-secondary" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {notes.map((note) => (
              <tr
                key={note.id}
                className="group cursor-pointer transition-colors hover:bg-purple-50/50"
              >
                <td className="px-4 py-3">
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
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  <Link href={`/notes/${note.id}`} className="block">
                    {note.practitioner.name}
                  </Link>
                </td>
                <td className="hidden px-4 py-3 text-sm text-text-secondary md:table-cell">
                  <Link href={`/notes/${note.id}`} className="block">
                    {formatDate(note.date)}
                  </Link>
                </td>
                <td className="hidden px-4 py-3 text-sm text-text-secondary lg:table-cell">
                  <Link href={`/notes/${note.id}`} className="block">
                    {formatDate(note.date)}
                  </Link>
                </td>
                <td className="hidden px-4 py-3 text-sm text-text-secondary md:table-cell">
                  <Link href={`/notes/${note.id}`} className="block">
                    {formatDate(note.date)}
                  </Link>
                </td>
              </tr>
            ))}
            {notes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-text-secondary">
                  No progress notes found. Create your first note to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-{notes.length} of {notes.length} items</span>
          <div className="ml-4 flex items-center gap-1">
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
              1
            </button>
          </div>
          <span className="ml-4">10 / page</span>
        </div>
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
