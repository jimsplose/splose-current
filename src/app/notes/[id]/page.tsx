import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NoteViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const note = await prisma.clinicalNote.findUnique({
    where: { id },
    include: { client: true, practitioner: true },
  });

  if (!note) return notFound();

  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-text">{note.template}</h1>
          {note.signed ? (
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Final</span>
          ) : (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Draft</span>
          )}
          <span className="text-sm text-primary font-medium">
            {note.client.firstName} {note.client.lastName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {note.signed && (
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Revert to draft
            </button>
          )}
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Actions &#9660;
          </button>
        </div>
      </div>

      {/* Note content as document */}
      <div className="mx-auto max-w-3xl p-8">
        <div className="rounded-lg border border-border bg-white p-10 shadow-sm">
          {/* Client name and icon */}
          <div className="flex items-start justify-between mb-8">
            <h2 className="text-2xl font-bold text-text">
              {note.client.firstName} {note.client.lastName}
            </h2>
            <div className="text-5xl">&#128203;</div>
          </div>

          {/* Note title */}
          <h3 className="text-xl font-bold text-text mb-4">{note.template}</h3>

          {/* Service info */}
          <p className="text-sm text-text mb-6">
            <strong>Service:</strong> {formatNoteDate(note.date)}, 20 mins (1 interval testing))
          </p>

          {/* Note content */}
          <div className="prose prose-sm max-w-none text-text whitespace-pre-wrap">
            {note.content || (
              <p className="text-text-secondary italic">No content</p>
            )}
          </div>

          {/* Signature / metadata */}
          <div className="mt-10 border-t border-border pt-4 text-sm text-text-secondary">
            <p>Created by: {note.practitioner.name}</p>
            <p>Date: {formatNoteDate(note.date)}</p>
            {note.signed && <p className="mt-1 text-green-600 font-medium">Signed as final</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatNoteDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}
