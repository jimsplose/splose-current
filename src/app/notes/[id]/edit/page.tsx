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
import { Button, Card, Checkbox, FormSelect, Icon, List, Navbar, Filter, Spinner, Dropdown, Text, Divider, Tooltip } from "@/components/ds";
import AiChatPanel from "@/components/AiChatPanel";

type NoteData = {
  id: string;
  name: string;
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
          name: "Initial Consultation Notes",
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
        title={note?.name || "Note"}
        badge={
          <>
            <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-primary)', cursor: 'pointer' }}>{clientName}</span>
            <span style={{ fontSize: 13, fontWeight: 400, color: 'rgb(66, 105, 74)' }}>Note has been autosaved</span>
          </>
        }
      >
        {/* AI sparkle button */}
        <Button
          variant={aiChatOpen ? "primary" : "icon"}
          round
          size="sm"
          onClick={() => setAiChatOpen(!aiChatOpen)}
          title="Splose AI"
          style={aiChatOpen ? { backgroundColor: 'var(--color-primary)', color: '#fff', width: 36, height: 36 } : { width: 36, height: 36, border: '1px solid var(--color-border)' }}
        >
          <Icon as={SnippetsOutlined} size="lg" style={{ color: 'inherit' }} />
        </Button>
        {/* View toggle */}
        <Filter
          items={[
            { label: <Icon as={AppstoreOutlined} size="lg" />, value: "single" },
            { label: <Icon as={ColumnWidthOutlined} size="lg" />, value: "split" },
          ]}
          value={viewMode}
          onChange={(v) => setViewMode(v as "single" | "split")}
        />
        {/* Save as final — purple split button */}
        <Flex>
          <Button variant="primary" style={{ borderRadius: '8px 0px 0px 8px' }}>
            Save as final
          </Button>
          <Button variant="primary" style={{ borderRadius: '0px 8px 8px 0px', borderLeft: '1px solid rgba(255,255,255,0.3)', padding: '0 8px', minWidth: 0 }}>
            <Icon as={DownOutlined} size="sm" style={{ color: 'inherit' }} />
          </Button>
        </Flex>
      </Navbar>

      <div style={{ display: 'flex' }}>
        {/* Editor panel */}
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#fff', maxHeight: 'calc(100vh - 6rem)' }}>
          <div style={{ maxWidth: 768, margin: '0 auto' }}>
            {/* Service selector */}
            <div className="mb-4">
              <div className="mb-1" style={{ fontSize: 14, fontWeight: 400, color: 'rgb(65, 69, 73)' }}>Service</div>
              <FormSelect
                options={SERVICE_OPTIONS}
                value={service}
                onChange={setService}
              />
            </div>

            {/* Rich text toolbar */}
            <Card padding="none" className="mb-4" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, padding: '6px 8px', color: 'var(--color-text-secondary)' }}>
              <Button variant="toolbar" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12 }}>
                Arial
                <Icon as={DownOutlined} size="sm" />
              </Button>
              <Button variant="toolbar" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Icon as={FontSizeOutlined} size="lg" />
                <Icon as={DownOutlined} size="sm" />
              </Button>
              <Divider orientation="vertical" spacing="none" />
              <Tooltip content="Bold"><Button variant="icon"><Icon as={BoldOutlined} size="lg" /></Button></Tooltip>
              <Tooltip content="Italic"><Button variant="icon"><Icon as={ItalicOutlined} size="lg" /></Button></Tooltip>
              <Tooltip content="Underline"><Button variant="icon"><Icon as={UnderlineOutlined} size="lg" /></Button></Tooltip>
              <Tooltip content="Strikethrough"><Button variant="icon"><Icon as={StrikethroughOutlined} size="lg" /></Button></Tooltip>
              <Divider orientation="vertical" spacing="none" />
              <Tooltip content="Insert link"><Button variant="icon"><Icon as={LinkOutlined} size="lg" /></Button></Tooltip>
              <Tooltip content="Insert image"><Button variant="icon"><Icon as={PictureOutlined} size="lg" /></Button></Tooltip>
              <Tooltip content="Insert table"><Button variant="icon"><Icon as={TableOutlined} size="lg" /></Button></Tooltip>
              <Tooltip content="Bulleted list"><Button variant="icon"><Icon as={UnorderedListOutlined} size="lg" /></Button></Tooltip>
              <Tooltip content="Numbered list"><Button variant="icon"><Icon as={OrderedListOutlined} size="lg" /></Button></Tooltip>
              <Tooltip content="Align left"><Button variant="icon"><Icon as={AlignLeftOutlined} size="lg" /></Button></Tooltip>
              <Tooltip content="Text colour"><Button variant="icon"><Icon as={BgColorsOutlined} size="lg" /></Button></Tooltip>
              <span className="flex-1" />
              <Button
                variant="secondary"
                onClick={generateAll}
                style={{ backgroundColor: 'rgb(239, 239, 239)', borderColor: 'transparent', color: 'rgb(65, 69, 73)', borderRadius: 12, height: 32 }}
              >
                <Icon as={ThunderboltOutlined} size="lg" />
                Generate
              </Button>
              <Button
                variant={aiChatOpen ? "primary" : "icon"}
                size="sm"
                onClick={() => setAiChatOpen(!aiChatOpen)}
                title="Splose AI Chat"
                style={aiChatOpen ? { backgroundColor: 'var(--color-primary)', color: '#fff' } : undefined}
              >
                <Icon as={MessageOutlined} size="lg" style={{ color: 'inherit' }} />
              </Button>
              <Button variant="primary" round size="sm">
                <Icon as={PlusOutlined} size="lg" style={{ color: 'inherit' }} />
              </Button>
            </Card>

            {/* Syncing notice */}
            <Flex align="center" gap={8} className="mb-4" style={{ borderRadius: 8, backgroundColor: 'var(--color-primary-bg)', padding: '8px 12px' }}>
              <Flex align="center" gap={4}>
                <Checkbox checked readOnly style={{ height: 12, width: 12 }} />
                <Text variant="body/sm" as="span" color="secondary">Syncing client history</Text>
              </Flex>
              <Text variant="body/sm" as="span" color="secondary">
                Clients with more notes may take longer. AI will have full context once complete
              </Text>
            </Flex>

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
                <h3 className="text-heading-lg mb-2">{section.title}</h3>

                {/* Show accepted content directly under heading */}
                {accepted[section.id] && section.generated && (
                  <Text variant="body/md" as="div" className="mb-2" style={{ lineHeight: 1.625, whiteSpace: 'pre-wrap' }}>
                    {section.content}
                  </Text>
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
                        <Icon as={ThunderboltOutlined} size="lg" tone="primary" />
                        <span className="text-label-lg" style={{ color: 'var(--color-primary)' }}>AI block</span>
                      </Flex>
                      <Flex align="center" gap={8}>
                        <Tooltip content="Dismiss">
                          <Button
                            variant="icon"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissSection(section.id);
                            }}
                          >
                            <span style={{ fontSize: 14, fontWeight: 500 }}>&times;</span>
                          </Button>
                        </Tooltip>
                        {section.expanded ? (
                          <Icon as={UpOutlined} size="lg" tone="secondary" />
                        ) : (
                          <Icon as={DownOutlined} size="lg" tone="secondary" />
                        )}
                      </Flex>
                    </Flex>

                    {/* AI block content */}
                    {section.expanded && (
                      <div style={{ borderTop: '1px solid rgba(168, 85, 247, 0.3)', padding: '12px 16px' }}>
                        {section.generating ? (
                          <Flex align="center" gap={8} style={{ padding: '16px 0' }}>
                            <Spinner size="sm" />
                            <Text variant="body/md" as="span" color="secondary">
                              Thinking<span>...</span>
                            </Text>
                          </Flex>
                        ) : section.generated ? (
                          <div>
                            <Text variant="body/md" as="div" style={{ lineHeight: 1.625, whiteSpace: 'pre-wrap' }}>
                              {section.content}
                            </Text>
                            {/* Feedback and actions row */}
                            <Flex align="center" justify="space-between" className="mt-3">
                              <Dropdown
                                trigger={
                                  <Button variant="ghost" size="sm">
                                    Actions
                                    <Icon as={DownOutlined} size="sm" />
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
                                <Tooltip content="Good response">
                                  <Button
                                    variant="icon"
                                    size="sm"
                                    onClick={() => setFeedback(section.id, "up")}
                                    style={
                                      section.feedback === "up"
                                        ? { backgroundColor: '#dcfce7', color: '#16a34a' }
                                        : undefined
                                    }
                                  >
                                    <Icon as={LikeOutlined} size="md" />
                                  </Button>
                                </Tooltip>
                                <Tooltip content="Poor response">
                                  <Button
                                    variant="icon"
                                    size="sm"
                                    onClick={() => setFeedback(section.id, "down")}
                                    style={
                                      section.feedback === "down"
                                        ? { backgroundColor: '#fee2e2', color: '#dc2626' }
                                        : undefined
                                    }
                                  >
                                    <Icon as={DislikeOutlined} size="md" />
                                  </Button>
                                </Tooltip>
                                {/* Accept button */}
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => acceptSection(section.id)}
                                >
                                  <Icon as={CheckCircleOutlined} size="md" />
                                  Accept
                                </Button>
                              </Flex>
                            </Flex>
                          </div>
                        ) : (
                          <div>
                            <Text variant="body/md" color="secondary" style={{ lineHeight: 1.625 }}>{section.prompt}</Text>
                            {/* Actions dropdown and Generate button row */}
                            <Flex align="center" justify="space-between" className="mt-3">
                              <Dropdown
                                trigger={
                                  <Button variant="ghost" size="sm">
                                    Actions
                                    <Icon as={DownOutlined} size="sm" />
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

        {/* Split view transcript panel */}
        {viewMode === "split" && (
          <div
            className="shrink-0 overflow-y-auto"
            style={{ width: 420, borderLeft: '1px solid var(--color-border)', backgroundColor: '#fff', maxHeight: 'calc(100vh - 6rem)' }}
          >
            {/* Audio player */}
            <Flex align="center" gap={8} style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
              <Button variant="secondary" size="sm">Restart</Button>
              <div className="flex-1" style={{ height: 24, backgroundColor: 'rgb(243, 245, 247)', borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} style={{ width: 2, height: Math.random() * 16 + 4, backgroundColor: 'rgb(130, 80, 255)', marginRight: 2, borderRadius: 1 }} />
                ))}
              </div>
              <span className="text-body-sm" style={{ color: 'rgb(65, 69, 73)' }}>00:00</span>
              <Button variant="primary" round size="sm" style={{ width: 28, height: 28, minWidth: 0, padding: 0 }}>▶</Button>
            </Flex>
            {/* Transcript */}
            <div className="p-4">
              {[
                { speaker: 0, text: "Don\'t worry about coffee. We\'ll have a bite." },
                { speaker: 1, text: "Okay. Good. So," },
                { speaker: 2, text: "Rosa, Ida, my name is Datt. I\'m an occupational therapist. Yeah. Looks like you\'ve seen occupational therapist before with the rails and Yeah." },
                { speaker: 1, text: "Yeah. For years. For years. Because I got back at the trouble." },
                { speaker: 0, text: "Around last time. Yeah." },
                { speaker: 2, text: "Yeah." },
              ].map((line, i) => (
                <Flex key={i} gap={8} className="mb-2">
                  <span className="shrink-0" style={{ fontSize: 13, color: 'rgb(130, 80, 255)' }}>✎</span>
                  <Text variant="body/md" style={{ color: 'rgb(130, 80, 255)' }}>
                    Speaker {line.speaker}: {line.text}
                  </Text>
                </Flex>
              ))}
            </div>
          </div>
        )}

        {/* Splose AI Chat Side Panel */}
        {aiChatOpen && (
          <div
            className="shrink-0"
            style={{ display: 'flex', width: 350, flexDirection: 'column', borderLeft: '1px solid var(--color-border)', backgroundColor: '#fff', boxShadow: '-4px 0 12px rgba(0,0,0,0.1)', maxHeight: 'calc(100vh - 6rem)' }}
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
