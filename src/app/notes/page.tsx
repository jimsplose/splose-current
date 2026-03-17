import { prisma } from "@/lib/prisma";
import { Plus, ArrowUpDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await prisma.clinicalNote.findMany({
    include: { client: true, practitioner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Progress notes</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Scroll view
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            <Plus className="h-4 w-4" />
            New note
          </button>
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
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Service date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Last update</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
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
                className="cursor-pointer transition-colors hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text">
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
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {note.practitioner.name}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {note.date}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {note.date}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {note.date}
                </td>
              </tr>
            ))}
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
