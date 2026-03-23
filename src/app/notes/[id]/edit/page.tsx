"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  LayoutGrid,
  Columns2,
  ChevronDown,
  Sparkles,
  CheckCircle,
  ChevronUp,
  Plus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  Image,
  Table,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Pencil,
  Copy,
  AlignLeft,
  List,
  ListOrdered,
  Palette,
  Type,
} from "lucide-react";
import { Button, Badge, Card, FormSelect, FormInput, EmptyState, Navbar, Filter, Spinner } from "@/components/ds";

type NoteData = {
  id: string;
  template: string;
  date: string;
  content: string;
  signed: boolean;
  client: { id: string; firstName: string; lastName: string };
  practitioner: { id: string; name: string };
};

type AISection = {
  id: string;
  title: string;
  prompt: string;
  content: string;
  expanded: boolean;
  generating: boolean;
  generated: boolean;
  actionsOpen: boolean;
  feedback: "up" | "down" | null;
};

const DEFAULT_AI_SECTIONS: Omit<AISection, "id">[] = [
  {
    title: "Subjective",
    prompt:
      'Get the session transcript (transcription) and patient details. Complete the Subjective section of this progress note. In your output, use person-centred NDIS language refer to the patient as "the participant"',
    content: "",
    expanded: true,
    generating: false,
    generated: false,
    actionsOpen: false,
    feedback: null,
  },
  {
    title: "Objective",
    prompt:
      "Get the session transcript (transcription), previous progress notes from the last 2 months, and patient details. Complete the Objective section of this progress note. In your output, use person-centred NDIS language.",
    content: "",
    expanded: true,
    generating: false,
    generated: false,
    actionsOpen: false,
    feedback: null,
  },
  {
    title: "Assessment",
    prompt:
      "Get the session transcript (transcription) and previous progress notes from the last 2 months. Complete the Assessment section of this progress note. In your output, use person-centred NDIS language.",
    content: "",
    expanded: true,
    generating: false,
    generated: false,
    actionsOpen: false,
    feedback: null,
  },
  {
    title: "Plan",
    prompt:
      "Get the session transcript (transcription). This is the Plan section of a progress note. Complete the Plan section of this progress note. In your output, use person-centred NDIS language.",
    content: "",
    expanded: true,
    generating: false,
    generated: false,
    actionsOpen: false,
    feedback: null,
  },
  {
    title: "Goals",
    prompt:
      "Get the session transcript (transcription), previous progress notes from the last 2 months, and patient details. Then check the patient's file uploads for any PDF documents containing their NDIS plan goals.",
    content: "",
    expanded: true,
    generating: false,
    generated: false,
    actionsOpen: false,
    feedback: null,
  },
];

const GENERATED_CONTENT: Record<string, string> = {
  Subjective: `• The participant did not provide a session transcript or verbal report regarding communication progress, challenges, or concerns since the last session.
• No changes in the participant's communication abilities or confidence were reported.
• The participant did not state any specific goals or priorities for today's session.
• No preferences or choices about activities or approaches were expressed by the participant.`,
  Objective: `• The participant demonstrated consistent engagement throughout the session, responding to prompts and completing assigned activities as directed.
• Measurable results from today's activities were not recorded in the available documentation; no assessment data or specific performance metrics provided.
• Interventions and strategies used during the session were not detailed in the available records.
• No week-on-week changes or progression data could be established due to absence of comparative measurable information in previous notes.`,
  Assessment: `• The participant has demonstrated consistent engagement in therapy sessions over the past two months, with active participation observed at each session.
• Week-on-week trends indicate the participant is maintaining current skill levels, with no significant improvement or decline noted in recent sessions.
• Progress towards NDIS plan goals appears steady, with the participant continuing to work towards identified objectives without regression.
• Factors supporting progress include regular attendance and sustained motivation; no new barriers to progress have been identified during this period.`,
  Plan: `No transcript available for this session. Unable to complete the Plan section as requested due to lack of source information.`,
  Goals: `• No session transcript (transcription) is available for today's session; therefore, no measurable progress, evidence of choice and control, or next steps/homework can be documented for any NDIS plan goal at this time.
• No NDIS plan goals can be addressed in this section without relevant information from the current session transcript.
• If a transcript or relevant session data is provided, progress towards Shan's NDIS plan goals will be documented accordingly.`,
};

const SERVICE_OPTIONS = [
  {
    value: "Mon 16 Mar 2026, 10:30am – Sharon Test 1 (OT – Initial Consult)",
    label: "Mon 16 Mar 2026, 10:30am – Sharon Test 1 (OT – Initial Consult)",
  },
  {
    value: "Wed 11 Mar 2026, 2:00pm – Sharon Test 1 (OT – Review)",
    label: "Wed 11 Mar 2026, 2:00pm – Sharon Test 1 (OT – Review)",
  },
  {
    value: "Mon 3 Mar 2026, 10:30am – Sharon Test 1 (OT – Follow Up)",
    label: "Mon 3 Mar 2026, 10:30am – Sharon Test 1 (OT – Follow Up)",
  },
];

export default function EditProgressNotePage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<NoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"single" | "split">("single");
  const [sections, setSections] = useState<AISection[]>(() =>
    DEFAULT_AI_SECTIONS.map((s, i) => ({ ...s, id: `section-${i}` })),
  );
  const [service, setService] = useState("Mon 16 Mar 2026, 10:30am – Sharon Test 1 (OT – Initial Consult)");
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`/api/notes/${id}`)
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error("Not found");
      })
      .then((data: NoteData) => {
        setNote(data);
        setLoading(false);
      })
      .catch(() => {
        // Use placeholder data if API doesn't exist
        setNote({
          id: id,
          template: "ST | Note",
          date: "2026-03-16",
          content: "",
          signed: false,
          client: { id: "1", firstName: "Shannon", lastName: "Ford" },
          practitioner: { id: "1", name: "Jim Yencken" },
        });
        setLoading(false);
      });
  }, [id]);

  const toggleSection = useCallback((sectionId: string) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, expanded: !s.expanded } : s)));
  }, []);

  const generateSection = useCallback((sectionId: string) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, generating: true } : s)));

    // Simulate AI generation
    setTimeout(() => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                generating: false,
                generated: true,
                content: GENERATED_CONTENT[s.title] || "Generated content for " + s.title,
              }
            : s,
        ),
      );
    }, 1500);
  }, []);

  const generateAll = useCallback(() => {
    setSections((prev) => prev.map((s) => ({ ...s, generating: true })));

    // Stagger generation
    sections.forEach((section, i) => {
      setTimeout(
        () => {
          setSections((prev) =>
            prev.map((s) =>
              s.id === section.id
                ? {
                    ...s,
                    generating: false,
                    generated: true,
                    content: GENERATED_CONTENT[s.title] || "Generated content for " + s.title,
                  }
                : s,
            ),
          );
        },
        800 + i * 600,
      );
    });
  }, [sections]);

  const toggleActions = useCallback((sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, actionsOpen: !s.actionsOpen } : { ...s, actionsOpen: false })),
    );
  }, []);

  const setFeedback = useCallback((sectionId: string, feedback: "up" | "down") => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, feedback: s.feedback === feedback ? null : feedback } : s)),
    );
  }, []);

  const regenerateSection = useCallback(
    (sectionId: string) => {
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, generating: true, actionsOpen: false } : s)),
      );
      setTimeout(() => {
        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  generating: false,
                  generated: true,
                  content: GENERATED_CONTENT[s.title] || "Generated content for " + s.title,
                }
              : s,
          ),
        );
      }, 1500);
    },
    [],
  );

  const acceptSection = useCallback((sectionId: string) => {
    setAccepted((prev) => ({ ...prev, [sectionId]: true }));
  }, []);

  const dismissSection = useCallback((sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, expanded: false, generated: false, generating: false, content: "", feedback: null, actionsOpen: false }
          : s,
      ),
    );
    setAccepted((prev) => ({ ...prev, [sectionId]: false }));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3rem)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const clientName = note ? `${note.client.firstName} ${note.client.lastName}` : "Client";

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-gray-50/30">
      {/* Header bar */}
      <Navbar
        backHref={`/notes/${id}`}
        title={note?.template || "Note"}
        badge={
          <>
            <span className="cursor-pointer text-body-md text-primary hover:underline">{clientName}</span>
            {note?.signed ? (
              <Badge variant="green">
                <CheckCircle className="h-3 w-3" />
                Saved
              </Badge>
            ) : (
              <Badge variant="green">Saved</Badge>
            )}
          </>
        }
      >
        {/* View toggle */}
        <Filter
          items={[
            { label: <LayoutGrid className="h-4 w-4" />, value: "single" },
            { label: <Columns2 className="h-4 w-4" />, value: "split" },
          ]}
          value={viewMode}
          onChange={(v) => setViewMode(v as "single" | "split")}
        />
        <Button variant="primary" className="border-green-500 bg-green-500 hover:bg-green-600">
          Save as final
        </Button>
      </Navbar>

      <div className="flex">
        {/* Editor panel */}
        <div className="flex-1 overflow-y-auto bg-white p-6" style={{ maxHeight: "calc(100vh - 6rem)" }}>
          <div className="mx-auto max-w-3xl">
            {/* Service selector */}
            <div className="mb-4">
              <FormSelect
                label="Service"
                options={SERVICE_OPTIONS}
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
            </div>

            {/* Rich text toolbar */}
            <div className="mb-4 flex flex-wrap items-center gap-1 rounded-lg border border-border bg-white px-2 py-1.5 text-text-secondary">
              <button className="flex items-center gap-0.5 rounded px-2 py-1 text-xs hover:bg-gray-100">
                Arial
                <ChevronDown className="h-3 w-3" />
              </button>
              <button className="flex items-center gap-0.5 rounded px-2 py-1 hover:bg-gray-100">
                <Type className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </button>
              <span className="h-4 w-px bg-border" />
              <button className="rounded p-1.5 hover:bg-gray-100">
                <Bold className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <Italic className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <Underline className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <Strikethrough className="h-4 w-4" />
              </button>
              <span className="h-4 w-px bg-border" />
              <button className="rounded p-1.5 hover:bg-gray-100">
                <Link2 className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <Image className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <Table className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <List className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <ListOrdered className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <AlignLeft className="h-4 w-4" />
              </button>
              <button className="rounded p-1.5 hover:bg-gray-100">
                <Palette className="h-4 w-4" />
              </button>
              <span className="flex-1" />
              <button
                onClick={generateAll}
                className="flex items-center gap-1.5 rounded-lg border border-primary bg-white px-3 py-1 text-label-lg text-primary hover:bg-purple-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate
              </button>
              <button className="flex items-center justify-center rounded-full bg-primary p-1 text-white hover:bg-primary-dark">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Syncing notice */}
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-xs text-text-secondary">
              <div className="flex items-center gap-1">
                <input type="checkbox" checked readOnly className="h-3 w-3 rounded accent-primary" />
                <span>Syncing client history</span>
              </div>
              <span className="text-text-secondary">
                Clients with more notes may take longer. AI will have full context once complete
              </span>
            </div>

            {/* Client info table */}
            <Card padding="none" className="mb-6">
              <table className="w-full text-body-md">
                <tbody>
                  {[
                    ["Client Name", clientName],
                    ["Date of Session", formatDate(note?.date || "2026-03-16")],
                    ["Time", "10:30 am"],
                    ["Organisation", "Hands Together Therapies"],
                    ["Location", "4 Williamstown Rd"],
                    ["Therapist", note?.practitioner?.name || "Jim Yencken"],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-b border-border last:border-b-0">
                      <td className="w-40 px-4 py-2 text-label-lg text-text">{label}</td>
                      <td className="px-4 py-2 text-text-secondary">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* AI Sections */}
            {sections.map((section) => (
              <div key={section.id} className="mb-6">
                <h3 className="mb-2 text-heading-lg text-text">{section.title}</h3>

                {/* Show accepted content directly under heading */}
                {accepted[section.id] && section.generated && (
                  <div className="mb-2 text-sm leading-relaxed whitespace-pre-wrap text-text">
                    {section.content}
                  </div>
                )}

                {/* AI Block — hidden once accepted */}
                {!accepted[section.id] && (
                  <div className="rounded-lg border border-purple-200 bg-purple-50/50">
                    {/* AI block header */}
                    <div
                      className="flex cursor-pointer items-center justify-between px-4 py-3"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-label-lg text-primary">AI block</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissSection(section.id);
                          }}
                          className="rounded p-0.5 text-text-secondary hover:bg-purple-100 hover:text-text"
                          title="Dismiss"
                        >
                          <span className="text-label-lg">&times;</span>
                        </button>
                        {section.expanded ? (
                          <ChevronUp className="h-4 w-4 text-text-secondary" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-text-secondary" />
                        )}
                      </div>
                    </div>

                    {/* AI block content */}
                    {section.expanded && (
                      <div className="border-t border-purple-200 px-4 py-3">
                        {section.generating ? (
                          <div className="flex items-center gap-2 py-4">
                            <Spinner size="sm" />
                            <span className="text-sm text-text-secondary">
                              Thinking<span className="animate-pulse">...</span>
                            </span>
                          </div>
                        ) : section.generated ? (
                          <div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-text">
                              {section.content}
                            </div>
                            {/* Feedback and actions row */}
                            <div className="mt-3 flex items-center justify-between">
                              <div className="relative flex items-center gap-1">
                                {/* Actions dropdown */}
                                <button
                                  onClick={() => toggleActions(section.id)}
                                  className="flex items-center gap-1 rounded px-2 py-1 text-label-md text-text-secondary hover:bg-purple-100"
                                >
                                  Actions
                                  <ChevronDown className="h-3 w-3" />
                                </button>
                                {section.actionsOpen && (
                                  <div className="absolute top-full left-0 z-10 mt-1 w-40 rounded-lg border border-border bg-white py-1 shadow-lg">
                                    <button
                                      onClick={() => regenerateSection(section.id)}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text hover:bg-gray-50"
                                    >
                                      <RotateCcw className="h-3.5 w-3.5" />
                                      Regenerate
                                    </button>
                                    <button
                                      onClick={() => toggleActions(section.id)}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text hover:bg-gray-50"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                      Edit prompt
                                    </button>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(section.content);
                                        toggleActions(section.id);
                                      }}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text hover:bg-gray-50"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
                                      Copy
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Thumbs up/down feedback */}
                                <button
                                  onClick={() => setFeedback(section.id, "up")}
                                  className={`rounded p-1 ${
                                    section.feedback === "up"
                                      ? "bg-green-100 text-green-600"
                                      : "text-text-secondary hover:bg-gray-100"
                                  }`}
                                  title="Good response"
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setFeedback(section.id, "down")}
                                  className={`rounded p-1 ${
                                    section.feedback === "down"
                                      ? "bg-red-100 text-red-600"
                                      : "text-text-secondary hover:bg-gray-100"
                                  }`}
                                  title="Poor response"
                                >
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                </button>
                                {/* Accept button */}
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => acceptSection(section.id)}
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Accept
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm leading-relaxed text-text-secondary">{section.prompt}</p>
                            {/* Actions dropdown and Generate button row */}
                            <div className="mt-3 flex items-center justify-between">
                              <div className="relative">
                                <button
                                  onClick={() => toggleActions(section.id)}
                                  className="flex items-center gap-1 rounded px-2 py-1 text-label-md text-text-secondary hover:bg-purple-100"
                                >
                                  Actions
                                  <ChevronDown className="h-3 w-3" />
                                </button>
                                {section.actionsOpen && (
                                  <div className="absolute top-full left-0 z-10 mt-1 w-40 rounded-lg border border-border bg-white py-1 shadow-lg">
                                    <button
                                      onClick={() => toggleActions(section.id)}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text hover:bg-gray-50"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                      Edit prompt
                                    </button>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(section.prompt);
                                        toggleActions(section.id);
                                      }}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text hover:bg-gray-50"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
                                      Copy prompt
                                    </button>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => generateSection(section.id)}
                              >
                                Generate
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Split view reference panel */}
        {viewMode === "split" && (
          <div
            className="w-80 shrink-0 overflow-y-auto border-l border-border bg-white p-6"
            style={{ maxHeight: "calc(100vh - 6rem)" }}
          >
            <h3 className="mb-3 text-heading-sm text-text">Filter previous progress notes</h3>
            <FormInput
              type="text"
              placeholder="Search notes"
            />
            <EmptyState
              message="No reference notes found"
              className="mt-16"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
