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
  AlignLeft,
  List as ListIcon,
  ListOrdered,
  Palette,
  Type,
} from "lucide-react";
import { Button, Badge, Card, Checkbox, FormSelect, FormInput, EmptyState, List, Navbar, Filter, Spinner, Dropdown } from "@/components/ds";

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

  const setFeedback = useCallback((sectionId: string, feedback: "up" | "down") => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, feedback: s.feedback === feedback ? null : feedback } : s)),
    );
  }, []);

  const regenerateSection = useCallback(
    (sectionId: string) => {
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, generating: true } : s)),
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
          ? { ...s, expanded: false, generated: false, generating: false, content: "", feedback: null }
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
            <Card padding="none" className="mb-4 flex flex-wrap items-center gap-1 px-2 py-1.5 text-text-secondary">
              <Button variant="toolbar" size="sm" className="flex items-center gap-0.5 text-xs">
                Arial
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Button variant="toolbar" size="sm" className="flex items-center gap-0.5">
                <Type className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </Button>
              <span className="h-4 w-px bg-border" />
              <Button variant="icon">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="icon">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="icon">
                <Underline className="h-4 w-4" />
              </Button>
              <Button variant="icon">
                <Strikethrough className="h-4 w-4" />
              </Button>
              <span className="h-4 w-px bg-border" />
              <Button variant="icon">
                <Link2 className="h-4 w-4" />
              </Button>
              <Button variant="icon">
                <Image className="h-4 w-4" />
              </Button>
              <Button variant="icon">
                <Table className="h-4 w-4" />
              </Button>
              <Button variant="icon">
                <ListIcon className="h-4 w-4" />
              </Button>
              <Button variant="icon">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button variant="icon">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="icon">
                <Palette className="h-4 w-4" />
              </Button>
              <span className="flex-1" />
              <Button
                variant="secondary"
                onClick={generateAll}
                className="border-primary text-primary hover:bg-purple-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate
              </Button>
              <Button variant="primary" round size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </Card>

            {/* Syncing notice */}
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-xs text-text-secondary">
              <div className="flex items-center gap-1">
                <Checkbox checked readOnly className="h-3 w-3" />
                <span>Syncing client history</span>
              </div>
              <span className="text-text-secondary">
                Clients with more notes may take longer. AI will have full context once complete
              </span>
            </div>

            {/* Client info table */}
            <Card padding="sm" className="mb-6">
              <List
                labelWidth="w-40"
                items={[
                  { label: "Client Name", value: clientName },
                  { label: "Date of Session", value: formatDate(note?.date || "2026-03-16") },
                  { label: "Time", value: "10:30 am" },
                  { label: "Organisation", value: "Hands Together Therapies" },
                  { label: "Location", value: "4 Williamstown Rd" },
                  { label: "Therapist", value: note?.practitioner?.name || "Jim Yencken" },
                ]}
              />
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
                        <Button
                          variant="icon"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissSection(section.id);
                          }}
                          className="hover:bg-purple-100"
                          title="Dismiss"
                        >
                          <span className="text-label-lg">&times;</span>
                        </Button>
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
                              <Dropdown
                                trigger={
                                  <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                                    Actions
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                }
                                items={[
                                  { label: "Regenerate", value: "regenerate" },
                                  { label: "Edit prompt", value: "edit-prompt" },
                                  { label: "Copy", value: "copy" },
                                ]}
                                onSelect={(v) => {
                                  if (v === "regenerate") regenerateSection(section.id);
                                  else if (v === "copy") navigator.clipboard.writeText(section.content);
                                }}
                              />
                              <div className="flex items-center gap-2">
                                {/* Thumbs up/down feedback */}
                                <Button
                                  variant="icon"
                                  size="sm"
                                  onClick={() => setFeedback(section.id, "up")}
                                  className={
                                    section.feedback === "up"
                                      ? "bg-green-100 text-green-600"
                                      : ""
                                  }
                                  title="Good response"
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="icon"
                                  size="sm"
                                  onClick={() => setFeedback(section.id, "down")}
                                  className={
                                    section.feedback === "down"
                                      ? "bg-red-100 text-red-600"
                                      : ""
                                  }
                                  title="Poor response"
                                >
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                </Button>
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
                              <Dropdown
                                trigger={
                                  <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                                    Actions
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                }
                                items={[
                                  { label: "Edit prompt", value: "edit-prompt" },
                                  { label: "Copy prompt", value: "copy-prompt" },
                                ]}
                                onSelect={(v) => {
                                  if (v === "copy-prompt") navigator.clipboard.writeText(section.prompt);
                                }}
                              />
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
