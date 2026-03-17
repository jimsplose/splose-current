import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Lock, CheckCircle, RotateCcw, ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NoteViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const note = await prisma.clinicalNote.findUnique({
    where: { id },
    include: { client: true, practitioner: true },
  });

  if (!note) return notFound();

  const clientName = `${note.client.firstName} ${note.client.lastName}`;

  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/notes"
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-bold text-text">{note.template}</h1>
          {note.signed ? (
            <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              <CheckCircle className="h-3 w-3" />
              Final
            </span>
          ) : (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              Draft
            </span>
          )}
          <Link href={`/clients/${note.clientId}`} className="text-sm font-medium text-primary hover:underline">
            {clientName}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {note.signed ? (
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
              <RotateCcw className="h-4 w-4" />
              Revert to draft
            </button>
          ) : (
            <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              <Lock className="h-3.5 w-3.5" />
              Sign &amp; lock
            </button>
          )}
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
            Edit <Pencil className="h-3.5 w-3.5" />
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-gray-50">
            Actions <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Note content as document */}
      <div className="mx-auto max-w-3xl p-8">
        <div className="rounded-lg border border-border bg-white p-10 shadow-sm">
          {/* Client name */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text">{clientName}</h2>
          </div>

          {/* Note title */}
          <h3 className="mb-4 text-xl font-bold text-text">{note.template}</h3>

          {/* Service info */}
          <div className="mb-6 rounded-lg bg-purple-50 p-4 text-sm">
            <div className="grid grid-cols-2 gap-y-2 gap-x-8">
              <div>
                <span className="text-text-secondary">Service date:</span>{" "}
                <span className="font-medium text-text">{formatNoteDate(note.date)}</span>
              </div>
              <div>
                <span className="text-text-secondary">Created by:</span>{" "}
                <span className="font-medium text-text">{note.practitioner.name}</span>
              </div>
              <div>
                <span className="text-text-secondary">Template:</span>{" "}
                <span className="font-medium text-text">{note.template}</span>
              </div>
              <div>
                <span className="text-text-secondary">Status:</span>{" "}
                {note.signed ? (
                  <span className="font-medium text-green-700">Signed</span>
                ) : (
                  <span className="font-medium text-gray-600">Draft</span>
                )}
              </div>
            </div>
          </div>

          {/* Note content */}
          <div className="prose prose-sm max-w-none text-text">
            {note.content ? (
              <div className="whitespace-pre-wrap">{note.content}</div>
            ) : (
              <p className="italic text-text-secondary">No content recorded.</p>
            )}
          </div>

          {/* Signature / metadata */}
          <div className="mt-10 border-t border-border pt-4">
            {note.signed ? (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">
                  Signed and locked by {note.practitioner.name} on {formatNoteDate(note.date)}
                </span>
              </div>
            ) : (
              <p className="text-sm text-text-secondary">
                This note has not been signed yet. Click &quot;Sign &amp; lock&quot; above to finalise.
              </p>
            )}
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
