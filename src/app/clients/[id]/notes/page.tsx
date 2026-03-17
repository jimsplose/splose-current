import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientNotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      clinicalNotes: {
        include: { practitioner: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) notFound();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text">Progress notes</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Scroll view
          </button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            + New note
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
            {client.clinicalNotes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-text-secondary">
                  No progress notes
                </td>
              </tr>
            ) : (
              client.clinicalNotes.map((note) => (
                <tr key={note.id} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text">{note.template}</span>
                      {note.signed ? (
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">Final</span>
                      ) : (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">Draft</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{note.practitioner.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{note.date ? formatDate(note.date) : "—"}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{formatDateTime(note.createdAt)}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{formatDateTime(note.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>1-{client.clinicalNotes.length} of {client.clinicalNotes.length} items</span>
          <div className="ml-4 flex items-center gap-1">
            <span>&lt;</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">1</button>
            <span>&gt;</span>
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
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
