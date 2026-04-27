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
} from "@ant-design/icons";
import { Button, Flex, Select } from "antd";
import { Card, Checkbox, List, Navbar, Filter, Spinner, Dropdown, Text, Divider, Tooltip } from "@/components/ds";
import AiChatPanel from "@/components/AiChatPanel";
import styles from "./NoteEdit.module.css";

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
      <Flex align="center" justify="center" className={styles.spinnerShell}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  const clientName = note ? `${note.client.firstName} ${note.client.lastName}` : "Client";

  return (
    <div className={styles.shell}>
      {/* Header bar */}
      <Navbar
        backHref={`/notes/${id}`}
        title={note?.name || "Note"}
        badge={
          <>
            <span className={styles.clientNameBadge}>{clientName}</span>
            <span className={styles.autosavedBadge}>Note has been autosaved</span>
          </>
        }
      >
        {/* AI sparkle button */}
        <Button
          type={aiChatOpen ? "primary" : "text"}
          shape="circle"
          size="small"
          onClick={() => setAiChatOpen(!aiChatOpen)}
          title="Splose AI"
          className={aiChatOpen ? styles.aiSparkleBtnActive : styles.aiSparkleBtn}
        >
          <SnippetsOutlined className={styles.iconInherit} />
        </Button>
        {/* View toggle */}
        <Filter
          items={[
            { label: <AppstoreOutlined className={styles.iconText} />, value: "single" },
            { label: <ColumnWidthOutlined className={styles.iconText} />, value: "split" },
          ]}
          value={viewMode}
          onChange={(v) => setViewMode(v as "single" | "split")}
        />
        {/* Save as final — purple split button */}
        <Flex>
          {/* ds-exempt: split-button border-radius */}
          <Button type="primary" className={styles.saveBtnLeft}>
            Save as final
          </Button>
          {/* ds-exempt: split-button border-radius */}
          <Button type="primary" className={styles.saveBtnRight}>
            <DownOutlined className={styles.iconInheritSm} />
          </Button>
        </Flex>
      </Navbar>

      <div className={styles.body}>
        {/* Editor panel */}
        <div className={styles.editorPane}>
          <div className={styles.editorInner}>
            {/* Service selector */}
            <div className={styles.serviceField}>
              <div className={styles.serviceLabel}>Service</div>
              <Select
                options={SERVICE_OPTIONS}
                value={service}
                onChange={setService}
                className={styles.serviceSelect}
              />
            </div>

            {/* Rich text toolbar */}
            <Card padding="none" className={styles.toolbar}>
              <Button type="text" size="small" className={styles.toolbarFontBtn}>
                Arial
                <DownOutlined className={styles.iconTextSm} />
              </Button>
              <Button type="text" size="small" className={styles.toolbarFontSizeBtn}>
                <FontSizeOutlined className={styles.iconText} />
                <DownOutlined className={styles.iconTextSm} />
              </Button>
              <Divider orientation="vertical" spacing="none" />
              <Tooltip content="Bold"><Button type="text"><BoldOutlined className={styles.iconText} /></Button></Tooltip>
              <Tooltip content="Italic"><Button type="text"><ItalicOutlined className={styles.iconText} /></Button></Tooltip>
              <Tooltip content="Underline"><Button type="text"><UnderlineOutlined className={styles.iconText} /></Button></Tooltip>
              <Tooltip content="Strikethrough"><Button type="text"><StrikethroughOutlined className={styles.iconText} /></Button></Tooltip>
              <Divider orientation="vertical" spacing="none" />
              <Tooltip content="Insert link"><Button type="text"><LinkOutlined className={styles.iconText} /></Button></Tooltip>
              <Tooltip content="Insert image"><Button type="text"><PictureOutlined className={styles.iconText} /></Button></Tooltip>
              <Tooltip content="Insert table"><Button type="text"><TableOutlined className={styles.iconText} /></Button></Tooltip>
              <Tooltip content="Bulleted list"><Button type="text"><UnorderedListOutlined className={styles.iconText} /></Button></Tooltip>
              <Tooltip content="Numbered list"><Button type="text"><OrderedListOutlined className={styles.iconText} /></Button></Tooltip>
              <Tooltip content="Align left"><Button type="text"><AlignLeftOutlined className={styles.iconText} /></Button></Tooltip>
              <Tooltip content="Text colour"><Button type="text"><BgColorsOutlined className={styles.iconText} /></Button></Tooltip>
              <span className={styles.toolbarSpacer} />
              <Button onClick={generateAll} className={styles.generateBtn}>
                <ThunderboltOutlined className={styles.iconText} />
                Generate
              </Button>
              <Button
                type={aiChatOpen ? "primary" : "text"}
                size="small"
                onClick={() => setAiChatOpen(!aiChatOpen)}
                title="Splose AI Chat"
                className={aiChatOpen ? styles.aiChatBtnActive : undefined}
              >
                <MessageOutlined className={styles.iconInherit} />
              </Button>
              <Button type="primary" shape="circle" size="small">
                <PlusOutlined className={styles.iconInherit} />
              </Button>
            </Card>

            {/* Syncing notice */}
            <Flex align="center" gap={8} className={styles.syncingNotice}>
              <Flex align="center" gap={4}>
                <Checkbox checked readOnly className={styles.syncingCheckbox} />
                <Text variant="body/sm" as="span" color="secondary">Syncing client history</Text>
              </Flex>
              <Text variant="body/sm" as="span" color="secondary">
                Clients with more notes may take longer. AI will have full context once complete
              </Text>
            </Flex>

            {/* Client info table */}
            <Card padding="sm" className={styles.clientInfoCard}>
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
              <div key={section.id} className={styles.section}>
                <h3 className={styles.sectionHeading}>{section.title}</h3>

                {/* Show accepted content directly under heading */}
                {accepted[section.id] && section.generated && (
                  <Text variant="body/md" as="div" className={styles.acceptedContent}>
                    {section.content}
                  </Text>
                )}

                {/* AI Block — hidden once accepted */}
                {!accepted[section.id] && (
                  <div className={styles.aiBlock}>
                    {/* AI block header */}
                    <Flex
                      align="center"
                      justify="space-between"
                      className={styles.aiBlockHeader}
                      onClick={() => toggleSection(section.id)}
                    >
                      <Flex align="center" gap={8}>
                        <ThunderboltOutlined className={styles.iconPrimary} />
                        <span className={styles.aiBlockTitle}>AI block</span>
                      </Flex>
                      <Flex align="center" gap={8}>
                        <Tooltip content="Dismiss">
                          <Button
                            type="text"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissSection(section.id);
                            }}
                          >
                            <span className={styles.aiBlockDismiss}>&times;</span>
                          </Button>
                        </Tooltip>
                        {section.expanded ? (
                          <UpOutlined className={styles.iconSecondary} />
                        ) : (
                          <DownOutlined className={styles.iconSecondary} />
                        )}
                      </Flex>
                    </Flex>

                    {/* AI block content */}
                    {section.expanded && (
                      <div className={styles.aiBlockBody}>
                        {section.generating ? (
                          <Flex align="center" gap={8} className={styles.thinkingRow}>
                            <Spinner size="sm" />
                            <Text variant="body/md" as="span" color="secondary">
                              Thinking<span>...</span>
                            </Text>
                          </Flex>
                        ) : section.generated ? (
                          <div>
                            <Text variant="body/md" as="div" className={styles.aiContent}>
                              {section.content}
                            </Text>
                            {/* Feedback and actions row */}
                            <Flex align="center" justify="space-between" className={styles.actionsRow}>
                              <Dropdown
                                trigger={
                                  <Button type="text" size="small">
                                    Actions
                                    <DownOutlined className={styles.iconTextSm} />
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
                                    type="text"
                                    size="small"
                                    onClick={() => setFeedback(section.id, "up")}
                                    className={section.feedback === "up" ? styles.feedbackUp : undefined}
                                  >
                                    <LikeOutlined className={styles.iconText} />
                                  </Button>
                                </Tooltip>
                                <Tooltip content="Poor response">
                                  <Button
                                    type="text"
                                    size="small"
                                    onClick={() => setFeedback(section.id, "down")}
                                    className={section.feedback === "down" ? styles.feedbackDown : undefined}
                                  >
                                    <DislikeOutlined className={styles.iconText} />
                                  </Button>
                                </Tooltip>
                                {/* Accept button */}
                                <Button
                                  type="primary"
                                  size="small"
                                  onClick={() => acceptSection(section.id)}
                                >
                                  <CheckCircleOutlined className={styles.iconText} />
                                  Accept
                                </Button>
                              </Flex>
                            </Flex>
                          </div>
                        ) : (
                          <div>
                            <Text variant="body/md" color="secondary" className={styles.aiPrompt}>{section.prompt}</Text>
                            {/* Actions dropdown and Generate button row */}
                            <Flex align="center" justify="space-between" className={styles.actionsRow}>
                              <Dropdown
                                trigger={
                                  <Button type="text" size="small">
                                    Actions
                                    <DownOutlined className={styles.iconTextSm} />
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
                                type="primary"
                                size="small"
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
          <div className={styles.transcriptPanel}>
            {/* Audio player */}
            <Flex align="center" gap={8} className={styles.audioBar}>
              <Button size="small">Restart</Button>
              <div className={styles.waveform}>
                {Array.from({ length: 40 }).map((_, i) => (
                  // ds-exempt: dynamic randomized waveform bar height
                  <div key={i} className={styles.waveformBar} style={{ height: Math.random() * 16 + 4 }} />
                ))}
              </div>
              <span className={styles.audioTime}>00:00</span>
              <Button type="primary" shape="circle" size="small" className={styles.playBtn}>▶</Button>
            </Flex>
            {/* Transcript */}
            <div className={styles.transcriptBody}>
              {[
                { speaker: 0, text: "Don\'t worry about coffee. We\'ll have a bite." },
                { speaker: 1, text: "Okay. Good. So," },
                { speaker: 2, text: "Rosa, Ida, my name is Datt. I\'m an occupational therapist. Yeah. Looks like you\'ve seen occupational therapist before with the rails and Yeah." },
                { speaker: 1, text: "Yeah. For years. For years. Because I got back at the trouble." },
                { speaker: 0, text: "Around last time. Yeah." },
                { speaker: 2, text: "Yeah." },
              ].map((line, i) => (
                <Flex key={i} gap={8} className={styles.transcriptLine}>
                  <span className={styles.transcriptIcon}>✎</span>
                  <Text variant="body/md" className={styles.transcriptText}>
                    Speaker {line.speaker}: {line.text}
                  </Text>
                </Flex>
              ))}
            </div>
          </div>
        )}

        {/* Splose AI Chat Side Panel */}
        {aiChatOpen && (
          <div className={styles.aiChatPanel}>
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
