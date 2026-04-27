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
import { Button, Flex, Form, Select, Input } from "antd";
import { Badge, Divider, Card } from "@/components/ds";
import Modal from "@/components/ds/Modal";
import styles from "./SendNoteModal.module.css";

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
  const [form] = Form.useForm();

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

  const editBtnClasses = `${styles.segmentedBtn} ${styles.segmentedBtnLeft}${viewMode === "edit" ? ` ${styles.segmentedBtnActive}` : ""}`;
  const previewBtnClasses = `${styles.segmentedBtn} ${styles.segmentedBtnRight}${viewMode === "preview" ? ` ${styles.segmentedBtnActive}` : ""}`;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Send progress note"
      maxWidth="xl"
      footer={
        <Flex align="center" justify="space-between" className={styles.footerBar}>
          <Button type="text" size="small">
            <PaperClipOutlined className={styles.iconText} />
            Attach files
          </Button>
          <Button type="primary" onClick={onClose}>
            <SendOutlined className={styles.iconText} />
            Send
          </Button>
        </Flex>
      }
    >
      <Flex vertical gap={16} className={styles.bodyScroll}>
        {/* Mode toggle */}
        <Flex align="center" gap={8}>
          <Select
            options={[
              { value: "progress-note", label: "#2_Progress note email template" },
              { value: "default", label: "Default template" },
            ]}
            defaultValue="progress-note"
            className={styles.templateSelect}
          />
          {/* eslint-disable-next-line no-restricted-syntax -- segmented button container border matches production; no DS segmented-control variant yet */}
          <div className={styles.segmentedGroup}>
            <Button
              type="text"
              size="small"
              onClick={() => setViewMode("edit")}
              className={editBtnClasses}
            >
              <EditOutlined className={styles.iconText} /> Edit
            </Button>
            <Button
              type="text"
              size="small"
              onClick={() => setViewMode("preview")}
              className={previewBtnClasses}
            >
              <EyeOutlined className={styles.iconText} /> Preview
            </Button>
          </div>
        </Flex>

        {viewMode === "edit" ? (
          <>
            {/* To field */}
            {/* eslint-disable-next-line no-restricted-syntax -- multi-value chip-input container border matches production; no DS chip-input component exists */}
            <Flex wrap align="center" gap={6} className={styles.chipInputRow}>
              {toEmails.map((email) => (
                <Badge
                  key={email}
                  variant="gray"
                  shape="pill"
                  onRemove={() => handleRemoveEmail(email)}
                  className={styles.emailChip}
                >
                  {email}
                </Badge>
              ))}
              <Input
                type="email"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                onKeyDown={handleAddEmail}
                placeholder={toEmails.length === 0 ? "Add recipient email..." : ""}
                className={styles.chipInput}
              />
            </Flex>

            {/* Reply to */}
            <Form form={form} layout="vertical">
              <Form.Item label="Reply to" required>
                <Select
                  options={[
                    { value: "hands-together", label: "Hands Together Therapies (hello@hands-together-therapy.com)" },
                  ]}
                  value="hands-together"
                  onChange={() => {}}
                  className={styles.fullWidth}
                />
              </Form.Item>
            </Form>

            {/* Subject + Summarise button row */}
            <Flex align="center" gap={8}>
              <div className={styles.subjectWrap}>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <Button
                type="primary"
                onClick={handleSummariseSession}
                disabled={isGenerating}
                className={styles.summariseBtn}
              >
                <ThunderboltOutlined className={styles.iconText} />
                {isGenerating ? "Generating..." : "Summarise session"}
              </Button>
            </Flex>

            {/* Toolbar */}
            <Flex align="center" gap={2} className={styles.toolbar}>
              {toolbarIcons.map((ToolbarIcon, i) => (
                <Button key={i} type="text">
                  <ToolbarIcon className={styles.iconText} />
                </Button>
              ))}
            </Flex>
            <Divider spacing="none" />

            {/* Body text area */}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className={styles.bodyTextarea}
            />
          </>
        ) : (
          /* Email preview */
          <Card tint="muted" padding={20}>
            <Flex vertical gap={6} className={styles.previewHeader}>
              <Flex gap={8} className={styles.previewMetaRow}>
                <span className={styles.previewMetaLabel}>From:</span>
                <span>Hands Together Therapies &lt;hello@hands-together-therapy.com&gt;</span>
              </Flex>
              <Flex gap={8} className={styles.previewMetaRow}>
                <span className={styles.previewMetaLabel}>To:</span>
                <span>{toEmails.join(", ") || "No recipients"}</span>
              </Flex>
              <Flex gap={8} className={styles.previewMetaRow}>
                <span className={styles.previewMetaLabel}>Subject:</span>
                <span className={styles.previewSubjectValue}>{subject}</span>
              </Flex>
            </Flex>
            <Divider spacing="none" />

            {/* Email body preview */}
            <Card shadow padding={20}>
              {/* Logo header */}
              <div className={styles.previewLogoWrap}>
                <span className={styles.previewLogo}>splose</span>
              </div>
              <Divider variant="subtle" spacing="none" />

              {/* Body content */}
              {/* eslint-disable-next-line no-restricted-syntax -- custom email-body line-height 1.625 for email readability; no DS variant */}
              <div className={styles.previewBody}>
                {body}
              </div>

              {/* Attachment indicator */}
              <Divider variant="subtle" spacing="none" className={styles.previewDividerSpaced} />
              <div className={styles.previewAttachmentWrap}>
                {/* eslint-disable-next-line no-restricted-syntax -- primary-bg tint for attachment chip; no DS attachment-chip component */}
                <Flex align="center" gap={8} className={styles.attachmentChip}>
                  <PaperClipOutlined className={styles.iconPrimary} />
                  <span className={styles.attachmentLabel}>Progress note — {clientName} — {formatDisplayDate(noteDate)}.pdf</span>
                  <Badge variant="purple">PDF</Badge>
                </Flex>
              </div>

              {/* Footer */}
              <Divider variant="subtle" spacing="none" className={styles.previewDividerSpaced} />
              <div className={styles.previewFooter}>
                <p>Sent via splose — Practice management software for allied health</p>
                <p className={styles.previewFooterLinks}>
                  <a href="#" className={styles.previewFooterLink}>Unsubscribe</a> · <a href="#" className={styles.previewFooterLink}>Privacy policy</a>
                </p>
              </div>
            </Card>
          </Card>
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
