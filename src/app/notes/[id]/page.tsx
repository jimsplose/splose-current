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
              Revert to draft
            </button>
          )}
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Actions
          </button>
        </div>
      </div>

      {/* Note content */}
      <div className="mx-auto max-w-3xl p-8">
        <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-text">
              {note.client.firstName} {note.client.lastName}
            </h2>
            <div className="text-4xl">📋</div>
          </div>

          <h3 className="text-lg font-semibold text-text mb-2">{note.template}</h3>

          <p className="text-sm text-text-secondary mb-6">
            <strong>Service:</strong> {note.date}
          </p>

          <div className="prose prose-sm max-w-none text-text">
            <p>{note.content}</p>
          </div>

          <div className="mt-8 border-t border-border pt-4 text-sm text-text-secondary">
            <p>Created by: {note.practitioner.name}</p>
            <p>Date: {note.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
