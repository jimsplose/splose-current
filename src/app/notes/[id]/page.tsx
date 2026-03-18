import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Lock, CheckCircle, RotateCcw, ChevronDown } from "lucide-react";
import { Button, Badge } from "@/components/ds";

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
            <Badge variant="green">
              <CheckCircle className="h-3 w-3" />
              Final
            </Badge>
          ) : (
            <Badge variant="gray">
              Draft
            </Badge>
          )}
          <Link href={`/clients/${note.clientId}`} className="text-sm font-medium text-primary hover:underline">
            {clientName}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {note.signed ? (
            <Button variant="secondary">
              <RotateCcw className="h-4 w-4" />
              Revert to draft
            </Button>
          ) : (
            <Button variant="primary">
              <Lock className="h-3.5 w-3.5" />
              Sign &amp; lock
            </Button>
          )}
          <Link
            href={`/notes/${id}/edit`}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50"
          >
            Edit <Pencil className="h-3.5 w-3.5" />
          </Link>
          <Button variant="secondary">
            Actions <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Note content as document */}
      <div className="mx-auto max-w-3xl p-8">
        <div className="rounded-lg border border-border bg-white p-10 shadow-sm">
          {/* Client name with logo */}
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-2xl font-bold text-text">{clientName}</h2>
            <div className="h-12 w-12 text-3xl">🦆</div>
          </div>

          {/* Service info */}
          <div className="mb-2 text-sm text-text-secondary">
            Service: {note.date ? `10:30 am, ${formatNoteDate(note.date)} – Sharon Test 1 (OT – Initial Consult)` : "—"}
          </div>

          {/* Client info table */}
          <div className="mb-8 rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Client Name", clientName],
                  ["Date of Session", formatNoteDate(note.date)],
                  ["Time", "10:30 am"],
                  ["Organisation", "Hands Together Therapies"],
                  ["Location", "4 Williamstown Rd"],
                  ["Therapist", note.practitioner.name],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-2 font-medium text-text w-40">{label}</td>
                    <td className="px-4 py-2 text-text-secondary">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SOAP Sections */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-bold text-text">Subjective</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-text leading-relaxed">
                <li>The participant did not provide a session transcript or verbal report regarding communication progress, challenges, or concerns since the last session.</li>
                <li>No changes in the participant&apos;s communication abilities or confidence were reported.</li>
                <li>The participant did not state any specific goals or priorities for today&apos;s session.</li>
                <li>No preferences or choices about activities or approaches were expressed by the participant.</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-text">Objective</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-text leading-relaxed">
                <li>The participant demonstrated consistent engagement throughout the session, responding to prompts and completing assigned activities as directed.</li>
                <li>Measurable results from today&apos;s activities were not recorded in the available documentation; no assessment data or specific performance metrics provided.</li>
                <li>Interventions and strategies used during the session were not detailed in the available records.</li>
                <li>No week-on-week changes or progression data could be established due to absence of comparative measurable information in previous notes.</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-text">Assessment</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-text leading-relaxed">
                <li>The participant has demonstrated consistent engagement in therapy sessions over the past two months, with active participation observed at each session.</li>
                <li>Week-on-week trends indicate the participant is maintaining current skill levels, with no significant improvement or decline noted in recent sessions.</li>
                <li>Progress towards NDIS plan goals appears steady, with the participant continuing to work towards identified objectives without regression.</li>
                <li>Factors supporting progress include regular attendance and sustained motivation; no new barriers to progress have been identified during this period.</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-text">Plan</h3>
              <p className="text-sm text-text leading-relaxed">
                No transcript available for this session. Unable to complete the Plan section as requested due to lack of source information.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-text">Goals</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm text-text leading-relaxed">
                <li>No session transcript (transcription) is available for today&apos;s session; therefore, no measurable progress, evidence of choice and control, or next steps/homework can be documented for any NDIS plan goal at this time.</li>
                <li>No NDIS plan goals can be addressed in this section without relevant information from the current session transcript.</li>
                <li>If a transcript or relevant session data is provided, progress towards the participant&apos;s NDIS plan goals will be documented accordingly.</li>
              </ul>
            </div>
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
    return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}
