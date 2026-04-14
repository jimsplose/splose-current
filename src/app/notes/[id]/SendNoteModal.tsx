"use client";

import { useState } from "react";
import {
  SendOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  FontSizeOutlined,
  TableOutlined,
  LinkOutlined,
  MinusOutlined,
  PictureOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  OrderedListOutlined,
  PaperClipOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Flex } from "antd";
import { Button, FormSelect, FormInput, Badge, Divider } from "@/components/ds";
import Modal from "@/components/ds/Modal";

interface SendNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientEmail?: string;
  noteDate: string;
  practitionerName: string;
}

export default function SendNoteModal({
  isOpen,
  onClose,
  clientName,
  clientEmail,
  noteDate,
  practitionerName,
}: SendNoteModalProps) {
  const [toEmails, setToEmails] = useState<string[]>(clientEmail ? [clientEmail] : []);
  const [toInput, setToInput] = useState("");
  const [subject, setSubject] = useState(`Progress note from Hands Together Therapies`);
  const [isGenerating, setIsGenerating] = useState(false);

  const firstName = clientName.split(" ")[0];

  const defaultBody = `Hi ${firstName},

Attached is the progress note for ${formatDisplayDate(noteDate)}.

Please reply to this email if you have any questions.

Regards,
Hands Together Therapies

4 Williamstown Rd
Kingsville VIC`;

  const [body, setBody] = useState(defaultBody);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  function handleAddEmail(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const email = toInput.trim().replace(/,$/g, "");
      if (email && !toEmails.includes(email)) {
        setToEmails([...toEmails, email]);
      }
      setToInput("");
    }
  }

  function handleRemoveEmail(email: string) {
    setToEmails(toEmails.filter((e) => e !== email));
  }

  function handleSummariseSession() {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const summary = `${clientName} attended Sharon Test 1 session on ${formatDisplayDate(noteDate)}.

Summary of session: **Summary:**

During the session on ${formatDisplayDate(noteDate)}, with practitioner ${practitionerName} at Hands Together Therapies, ${clientName} did not provide verbal input or a session transcript regarding communication progress, challenges, or specific goals. No changes in communication abilities or confidence were self-reported. Despite this, ${clientName} demonstrated consistent engagement and active participation throughout the session. While measurable data and detailed intervention notes were not available, observations indicate that ${clientName} has maintained steady progress over the past two months, regularly attending sessions and remaining motivated. No new barriers to progress were identified. However, due to the absence of session documentation, no specific progress, goals, or next steps could be recorded for this session. Future plans and recommendations will be determined once more information or a session transcript is provided. ${clientName} is encouraged to provide feedback or transcripts in upcoming sessions to better document progress and set targeted goals.

${clientName}'s next upcoming appointment is scheduled for 26 Mar 2028.`;

      // Replace body with AI summary + original body
      setBody(summary + "\n\nHi " + firstName + ",\n\nAttached is the progress note for " + formatDisplayDate(noteDate) + ".\n\nPlease reply to this email if you have any questions.\n\nRegards,\nHands Together Therapies\n\n4 Williamstown Rd\nKingsville VIC");
      setIsGenerating(false);
    }, 800);
  }

  const toolbarIcons = [
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    FontSizeOutlined,
    TableOutlined,
    LinkOutlined,
    MinusOutlined,
    PictureOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    OrderedListOutlined,
  ];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Send progress note"
      maxWidth="xl"
      footer={
        <Flex align="center" justify="space-between" style={{ width: '100%' }}>
          <Button variant="ghost" size="sm">
            <PaperClipOutlined style={{ fontSize: 16 }} />
            Attach files
          </Button>
          <Button variant="primary" onClick={onClose}>
            <SendOutlined style={{ fontSize: 14 }} />
            Send
          </Button>
        </Flex>
      }
    >
      <Flex vertical gap={16} style={{ maxHeight: 'calc(100vh - 20rem)', overflowY: 'auto' }}>
        {/* Mode toggle */}
        <Flex align="center" gap={8}>
          <FormSelect
            options={[
              { value: "progress-note", label: "#2_Progress note email template" },
              { value: "default", label: "Default template" },
            ]}
            defaultValue="progress-note"
            style={{ flex: 1 }}
          />
          <div style={{ display: 'flex', borderRadius: 8, border: '1px solid var(--color-border)' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("edit")}
              className="text-label-md"
              style={{ borderRadius: '8px 0 0 8px', border: 'none', ...(viewMode === "edit" ? { backgroundColor: 'rgba(var(--color-primary-rgb, 124, 58, 237), 0.1)', color: 'var(--color-primary)' } : {}) }}
            >
              <EditOutlined style={{ fontSize: 14 }} /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("preview")}
              className="text-label-md"
              style={{ borderRadius: '0 8px 8px 0', borderLeft: '1px solid var(--color-border)', ...(viewMode === "preview" ? { backgroundColor: 'rgba(var(--color-primary-rgb, 124, 58, 237), 0.1)', color: 'var(--color-primary)' } : {}) }}
            >
              <EyeOutlined style={{ fontSize: 14 }} /> Preview
            </Button>
          </div>
        </Flex>

        {viewMode === "edit" ? (
          <>
            {/* To field */}
            <Flex wrap align="center" gap={6} style={{ borderRadius: 8, border: '1px solid var(--color-border)', padding: '8px 12px' }}>
              {toEmails.map((email) => (
                <Badge
                  key={email}
                  variant="gray"
                  shape="pill"
                  onRemove={() => handleRemoveEmail(email)}
                  style={{ paddingTop: 2, paddingBottom: 2, fontSize: 12 }}
                >
                  {email}
                </Badge>
              ))}
              <FormInput
                type="email"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                onKeyDown={handleAddEmail}
                placeholder={toEmails.length === 0 ? "Add recipient email..." : ""}
                style={{ minWidth: 120, flex: 1, border: 'none', borderRadius: 0, padding: 0, fontSize: 12, boxShadow: 'none' }}
              />
            </Flex>

            {/* Reply to */}
            <div>
              <label className="text-label-lg" style={{ display: 'block', marginBottom: 4, color: 'var(--color-text-secondary)' }}>
                Reply to <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <FormSelect
                options={[
                  { value: "hands-together", label: "Hands Together Therapies (hello@hands-together-therapy.com)" },
                ]}
                value="hands-together"
                onChange={() => {}}
              />
            </div>

            {/* Subject + Summarise button row */}
            <Flex align="center" gap={8}>
              <div style={{ flex: 1 }}>
                <FormInput
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                onClick={handleSummariseSession}
                disabled={isGenerating}
                style={{ flexShrink: 0 }}
              >
                <ThunderboltOutlined style={{ fontSize: 16 }} />
                {isGenerating ? "Generating..." : "Summarise session"}
              </Button>
            </Flex>

            {/* Toolbar */}
            <Flex align="center" gap={2} style={{ paddingBottom: 8 }}>
              {toolbarIcons.map((Icon, i) => (
                <Button key={i} variant="icon">
                  <Icon style={{ fontSize: 16 }} />
                </Button>
              ))}
            </Flex>
            <Divider spacing="none" />

            {/* Body text area */}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              style={{ width: '100%', resize: 'none', borderRadius: 8, border: 'none', fontSize: 14, lineHeight: 1.625, outline: 'none' }}
            />
          </>
        ) : (
          /* Email preview */
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-tertiary)', padding: 20 }}>
            <Flex vertical gap={6} style={{ marginBottom: 16, paddingBottom: 16 }}>
              <Flex gap={8} className="text-body-sm">
                <span style={{ width: 64, color: 'var(--color-text-secondary)' }}>From:</span>
                <span>Hands Together Therapies &lt;hello@hands-together-therapy.com&gt;</span>
              </Flex>
              <Flex gap={8} className="text-body-sm">
                <span style={{ width: 64, color: 'var(--color-text-secondary)' }}>To:</span>
                <span>{toEmails.join(", ") || "No recipients"}</span>
              </Flex>
              <Flex gap={8} className="text-body-sm">
                <span style={{ width: 64, color: 'var(--color-text-secondary)' }}>Subject:</span>
                <span className="text-body-md-strong">{subject}</span>
              </Flex>
            </Flex>
            <Divider spacing="none" />

            {/* Email body preview */}
            <div style={{ borderRadius: 8, backgroundColor: '#fff', padding: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              {/* Logo header */}
              <div style={{ marginBottom: 16, paddingBottom: 16, textAlign: 'center' }}>
                <span className="text-heading-lg" style={{ color: 'var(--color-primary)' }}>splose</span>
              </div>
              <Divider variant="subtle" spacing="none" />

              {/* Body content */}
              <div className="text-body-md" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.625 }}>
                {body}
              </div>

              {/* Attachment indicator */}
              <Divider variant="subtle" spacing="none" style={{ marginTop: 24 }} />
              <div style={{ paddingTop: 16 }}>
                <Flex align="center" gap={8} style={{ borderRadius: 8, backgroundColor: 'var(--color-primary-bg)', padding: '8px 12px' }}>
                  <PaperClipOutlined style={{ fontSize: 16, color: 'var(--color-primary)' }} />
                  <span className="text-body-sm">Progress note — {clientName} — {formatDisplayDate(noteDate)}.pdf</span>
                  <Badge variant="purple">PDF</Badge>
                </Flex>
              </div>

              {/* Footer */}
              <Divider variant="subtle" spacing="none" style={{ marginTop: 24 }} />
              <div className="text-caption-md" style={{ paddingTop: 16, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <p>Sent via splose — Practice management software for allied health</p>
                <p style={{ marginTop: 4 }}>
                  <a href="#" style={{ color: 'var(--color-primary)' }}>Unsubscribe</a> · <a href="#" style={{ color: 'var(--color-primary)' }}>Privacy policy</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </Flex>
    </Modal>
  );
}

function formatDisplayDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}
