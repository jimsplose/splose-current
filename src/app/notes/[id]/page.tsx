import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import { Badge, Card, List, Navbar } from "@/components/ds";
import NoteViewToolbar from "./NoteViewToolbar";

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
    <div style={{ minHeight: 'calc(100vh - 3rem)' }}>
      {/* Header bar */}
      <Navbar
        backHref="/"
        title={note.template}
        badge={
          <>
            {note.signed ? (
              <Badge variant="green">
                <CheckCircleOutlined style={{ fontSize: 12, color: 'var(--ant-color-text, #414549)' }} />
                Final
              </Badge>
            ) : (
              <Badge variant="gray">Draft</Badge>
            )}
            <Button type="link" href={`/clients/${note.clientId}`}>
              {clientName}
            </Button>
          </>
        }
      >
        <NoteViewToolbar
          noteId={id}
          signed={note.signed}
          clientName={clientName}
          noteDate={note.date}
          practitionerName={note.practitioner.name}
        />
      </Navbar>

      {/* Note content as document */}
      <div style={{ maxWidth: 768, margin: '0 auto', padding: 32 }}>
        <Card padding="none" style={{ padding: 40, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          {/* Client name with logo */}
          <Flex align="start" justify="space-between" style={{ marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Sprig Sans', 'Inter', sans-serif", fontSize: 30, fontWeight: 700, lineHeight: 1.2, color: 'rgb(66, 105, 74)' }}>{clientName}</h2>
            <div style={{ height: 48, width: 48, fontSize: 30 }}>🦆</div>
          </Flex>

          {/* Service info */}
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
            Service: {note.date ? `10:30 am, ${formatNoteDate(note.date)} – Sharon Test 1 (OT – Initial Consult)` : "—"}
          </div>

          {/* Client info table */}
          <div style={{ marginBottom: 32, borderRadius: 8, border: '1px solid var(--color-border)', padding: '8px 16px' }}>
            <List
              labelWidth="w-40"
              items={[
                { label: "Client Name", value: clientName },
                { label: "Date of Session", value: formatNoteDate(note.date) },
                { label: "Time", value: "10:30 am" },
                { label: "Organisation", value: "Hands Together Therapies" },
                { label: "Location", value: "4 Williamstown Rd" },
                { label: "Therapist", value: note.practitioner.name },
              ]}
            />
          </div>

          {/* SOAP Sections */}
          <Flex vertical gap={24}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>Subjective</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: 24, fontSize: 14, lineHeight: 1.625 }}>
                <li style={{ marginBottom: 4 }}>
                  The participant did not provide a session transcript or verbal report regarding communication
                  progress, challenges, or concerns since the last session.
                </li>
                <li style={{ marginBottom: 4 }}>No changes in the participant&apos;s communication abilities or confidence were reported.</li>
                <li style={{ marginBottom: 4 }}>The participant did not state any specific goals or priorities for today&apos;s session.</li>
                <li>No preferences or choices about activities or approaches were expressed by the participant.</li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>Objective</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: 24, fontSize: 14, lineHeight: 1.625 }}>
                <li style={{ marginBottom: 4 }}>
                  The participant demonstrated consistent engagement throughout the session, responding to prompts and
                  completing assigned activities as directed.
                </li>
                <li style={{ marginBottom: 4 }}>
                  Measurable results from today&apos;s activities were not recorded in the available documentation; no
                  assessment data or specific performance metrics provided.
                </li>
                <li style={{ marginBottom: 4 }}>
                  Interventions and strategies used during the session were not detailed in the available records.
                </li>
                <li>
                  No week-on-week changes or progression data could be established due to absence of comparative
                  measurable information in previous notes.
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>Assessment</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: 24, fontSize: 14, lineHeight: 1.625 }}>
                <li style={{ marginBottom: 4 }}>
                  The participant has demonstrated consistent engagement in therapy sessions over the past two months,
                  with active participation observed at each session.
                </li>
                <li style={{ marginBottom: 4 }}>
                  Week-on-week trends indicate the participant is maintaining current skill levels, with no significant
                  improvement or decline noted in recent sessions.
                </li>
                <li style={{ marginBottom: 4 }}>
                  Progress towards NDIS plan goals appears steady, with the participant continuing to work towards
                  identified objectives without regression.
                </li>
                <li>
                  Factors supporting progress include regular attendance and sustained motivation; no new barriers to
                  progress have been identified during this period.
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>Plan</h3>
              <p style={{ fontSize: 14, lineHeight: 1.625 }}>
                No transcript available for this session. Unable to complete the Plan section as requested due to lack
                of source information.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>Goals</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: 24, fontSize: 14, lineHeight: 1.625 }}>
                <li style={{ marginBottom: 4 }}>
                  No session transcript (transcription) is available for today&apos;s session; therefore, no measurable
                  progress, evidence of choice and control, or next steps/homework can be documented for any NDIS plan
                  goal at this time.
                </li>
                <li style={{ marginBottom: 4 }}>
                  No NDIS plan goals can be addressed in this section without relevant information from the current
                  session transcript.
                </li>
                <li>
                  If a transcript or relevant session data is provided, progress towards the participant&apos;s NDIS
                  plan goals will be documented accordingly.
                </li>
              </ul>
            </div>
          </Flex>

          {/* Signature / metadata */}
          <div style={{ marginTop: 40, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
            {note.signed ? (
              <Flex align="center" gap={8} style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-success)' }}>
                <Icon as={CheckCircleOutlined} />
                <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57 }}>
                  Signed and locked by {note.practitioner.name} on {formatNoteDate(note.date)}
                </span>
              </Flex>
            ) : (
              <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
                This note has not been signed yet. Click &quot;Sign &amp; lock&quot; above to finalise.
              </p>
            )}
          </div>
        </Card>
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
