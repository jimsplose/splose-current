"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  AppstoreOutlined,
  ColumnWidthOutlined,
  DownOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  UpOutlined,
  PlusOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  LinkOutlined,
  PictureOutlined,
  TableOutlined,
  LikeOutlined,
  DislikeOutlined,
  AlignLeftOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  MessageOutlined,
  SnippetsOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Flex } from "antd";
import { Button, Badge, Card, Checkbox, FormSelect, FormInput, EmptyState, List, Navbar, Filter, Spinner, Dropdown } from "@/components/ds";
import AiChatPanel from "@/components/AiChatPanel";

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
  const [aiChatOpen, setAiChatOpen] = useState(false);

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
      <Flex align="center" justify="center" style={{ height: 'calc(100vh - 3rem)' }}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  const clientName = note ? `${note.client.firstName} ${note.client.lastName}` : "Client";

  return (
    <div style={{ minHeight: 'calc(100vh - 3rem)', backgroundColor: 'rgba(249, 250, 251, 0.3)' }}>
      {/* Header bar */}
      <Navbar
        backHref={`/notes/${id}`}
        title={note?.template || "Note"}
        badge={
          <>
            <span className="text-body-md" style={{ cursor: 'pointer', color: 'var(--color-primary)' }}>{clientName}</span>
            {note?.signed ? (
              <Badge variant="green">
                <CheckCircleOutlined style={{ fontSize: 12 }} />
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
            { label: <AppstoreOutlined style={{ fontSize: 16 }} />, value: "single" },
            { label: <ColumnWidthOutlined style={{ fontSize: 16 }} />, value: "split" },
          ]}
          value={viewMode}
          onChange={(v) => setViewMode(v as "single" | "split")}
        />
        <Button variant="primary" style={{ borderColor: '#22c55e', background: '#22c55e' }}>
          Save as final
        </Button>
      </Navbar>

      <div style={{ display: 'flex' }}>
        {/* Editor panel */}
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fff', padding: 24, maxHeight: 'calc(100vh - 6rem)' }}>
          <div style={{ maxWidth: 768, margin: '0 auto' }}>
            {/* Service selector */}
            <div style={{ marginBottom: 16 }}>
              <FormSelect
                label="Service"
                options={SERVICE_OPTIONS}
                value={service}
                onChange={setService}
              />
            </div>

            {/* Rich text toolbar */}
            <Card padding="none" style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, padding: '6px 8px', color: 'var(--color-text-secondary)' }}>
              <Button variant="toolbar" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12 }}>
                Arial
                <DownOutlined style={{ fontSize: 12 }} />
              </Button>
              <Button variant="toolbar" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FontSizeOutlined style={{ fontSize: 16 }} />
                <DownOutlined style={{ fontSize: 12 }} />
              </Button>
              <span style={{ height: 16, width: 1, backgroundColor: 'var(--color-border)' }} />
              <Button variant="icon">
                <BoldOutlined style={{ fontSize: 16 }} />
              </Button>
              <Button variant="icon">
                <ItalicOutlined style={{ fontSize: 16 }} />
              </Button>
              <Button variant="icon">
                <UnderlineOutlined style={{ fontSize: 16 }} />
              </Button>
              <Button variant="icon">
                <StrikethroughOutlined style={{ fontSize: 16 }} />
              </Button>
              <span style={{ height: 16, width: 1, backgroundColor: 'var(--color-border)' }} />
              <Button variant="icon">
                <LinkOutlined style={{ fontSize: 16 }} />
              </Button>
              <Button variant="icon">
                <PictureOutlined style={{ fontSize: 16 }} />
              </Button>
              <Button variant="icon">
                <TableOutlined style={{ fontSize: 16 }} />
              </Button>
              <Button variant="icon">
                <UnorderedListOutlined style={{ fontSize: 16 }} />
              </Button>
              <Button variant="icon">
                <OrderedListOutlined style={{ fontSize: 16 }} />
              </Button>
              <Button variant="icon">
                <AlignLeftOutlined style={{ fontSize: 16 }} />
              </Button>
              <Button variant="icon">
                <BgColorsOutlined style={{ fontSize: 16 }} />
              </Button>
              <span style={{ flex: 1 }} />
              <Button
                variant="secondary"
                onClick={generateAll}
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              >
                <ThunderboltOutlined style={{ fontSize: 14 }} />
                Generate
              </Button>
              <Button
                variant={aiChatOpen ? "primary" : "icon"}
                size="sm"
                onClick={() => setAiChatOpen(!aiChatOpen)}
                title="Splose AI Chat"
                style={aiChatOpen ? { backgroundColor: 'var(--color-primary)', color: '#fff' } : undefined}
              >
                <MessageOutlined style={{ fontSize: 16 }} />
              </Button>
              <Button variant="primary" round size="sm">
                <PlusOutlined style={{ fontSize: 16 }} />
              </Button>
            </Card>

            {/* Syncing notice */}
            <Flex align="center" gap={8} style={{ marginBottom: 16, borderRadius: 8, backgroundColor: 'var(--color-primary-bg)', padding: '8px 12px', fontSize: 12, color: 'var(--color-text-secondary)' }}>
              <Flex align="center" gap={4}>
                <Checkbox checked readOnly style={{ height: 12, width: 12 }} />
                <span>Syncing client history</span>
              </Flex>
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Clients with more notes may take longer. AI will have full context once complete
              </span>
            </Flex>

            {/* Client info table */}
            <Card padding="sm" style={{ marginBottom: 24 }}>
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
              <div key={section.id} style={{ marginBottom: 24 }}>
                <h3 className="text-heading-lg" style={{ marginBottom: 8 }}>{section.title}</h3>

                {/* Show accepted content directly under heading */}
                {accepted[section.id] && section.generated && (
                  <div style={{ marginBottom: 8, fontSize: 14, lineHeight: 1.625, whiteSpace: 'pre-wrap' }}>
                    {section.content}
                  </div>
                )}

                {/* AI Block — hidden once accepted */}
                {!accepted[section.id] && (
                  <div style={{ borderRadius: 8, border: '1px solid rgba(var(--color-primary-rgb, 124, 58, 237), 0.2)', backgroundColor: 'rgba(var(--color-primary-rgb, 124, 58, 237), 0.05)' }}>
                    {/* AI block header */}
                    <Flex
                      align="center"
                      justify="space-between"
                      style={{ padding: '12px 16px', cursor: 'pointer' }}
                      onClick={() => toggleSection(section.id)}
                    >
                      <Flex align="center" gap={8}>
                        <ThunderboltOutlined style={{ fontSize: 16, color: 'var(--color-primary)' }} />
                        <span className="text-label-lg" style={{ color: 'var(--color-primary)' }}>AI block</span>
                      </Flex>
                      <Flex align="center" gap={8}>
                        <Button
                          variant="icon"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissSection(section.id);
                          }}
                          title="Dismiss"
                        >
                          <span className="text-label-lg">&times;</span>
                        </Button>
                        {section.expanded ? (
                          <UpOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
                        ) : (
                          <DownOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
                        )}
                      </Flex>
                    </Flex>

                    {/* AI block content */}
                    {section.expanded && (
                      <div style={{ borderTop: '1px solid rgba(168, 85, 247, 0.3)', padding: '12px 16px' }}>
                        {section.generating ? (
                          <Flex align="center" gap={8} style={{ padding: '16px 0' }}>
                            <Spinner size="sm" />
                            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                              Thinking<span>...</span>
                            </span>
                          </Flex>
                        ) : section.generated ? (
                          <div>
                            <div style={{ fontSize: 14, lineHeight: 1.625, whiteSpace: 'pre-wrap' }}>
                              {section.content}
                            </div>
                            {/* Feedback and actions row */}
                            <Flex align="center" justify="space-between" style={{ marginTop: 12 }}>
                              <Dropdown
                                trigger={
                                  <Button variant="ghost" size="sm">
                                    Actions
                                    <DownOutlined style={{ fontSize: 12 }} />
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
                              <Flex align="center" gap={8}>
                                {/* Thumbs up/down feedback */}
                                <Button
                                  variant="icon"
                                  size="sm"
                                  onClick={() => setFeedback(section.id, "up")}
                                  style={
                                    section.feedback === "up"
                                      ? { backgroundColor: '#dcfce7', color: '#16a34a' }
                                      : undefined
                                  }
                                  title="Good response"
                                >
                                  <LikeOutlined style={{ fontSize: 14 }} />
                                </Button>
                                <Button
                                  variant="icon"
                                  size="sm"
                                  onClick={() => setFeedback(section.id, "down")}
                                  style={
                                    section.feedback === "down"
                                      ? { backgroundColor: '#fee2e2', color: '#dc2626' }
                                      : undefined
                                  }
                                  title="Poor response"
                                >
                                  <DislikeOutlined style={{ fontSize: 14 }} />
                                </Button>
                                {/* Accept button */}
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => acceptSection(section.id)}
                                >
                                  <CheckCircleOutlined style={{ fontSize: 14 }} />
                                  Accept
                                </Button>
                              </Flex>
                            </Flex>
                          </div>
                        ) : (
                          <div>
                            <p style={{ fontSize: 14, lineHeight: 1.625, color: 'var(--color-text-secondary)' }}>{section.prompt}</p>
                            {/* Actions dropdown and Generate button row */}
                            <Flex align="center" justify="space-between" style={{ marginTop: 12 }}>
                              <Dropdown
                                trigger={
                                  <Button variant="ghost" size="sm">
                                    Actions
                                    <DownOutlined style={{ fontSize: 12 }} />
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
                            </Flex>
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
            style={{ width: 320, flexShrink: 0, overflowY: 'auto', borderLeft: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24, maxHeight: 'calc(100vh - 6rem)' }}
          >
            <h3 className="text-heading-sm" style={{ marginBottom: 12 }}>Filter previous progress notes</h3>
            <FormInput
              type="text"
              placeholder="Search notes"
            />
            <EmptyState
              message="No reference notes found"
              style={{ marginTop: 64 }}
            />
          </div>
        )}

        {/* Splose AI Chat Side Panel */}
        {aiChatOpen && (
          <div
            style={{ display: 'flex', width: 350, flexShrink: 0, flexDirection: 'column', borderLeft: '1px solid var(--color-border)', backgroundColor: '#fff', boxShadow: '-4px 0 12px rgba(0,0,0,0.1)', maxHeight: 'calc(100vh - 6rem)' }}
          >
            <AiChatPanel onClose={() => setAiChatOpen(false)} variant="notes" />
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
