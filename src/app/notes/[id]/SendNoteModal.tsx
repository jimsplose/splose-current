"use client";

import { useState } from "react";
import { Send, Bold, Italic, Underline, Type, Grid3X3, Link2, Minus, Image, AlignLeft, AlignCenter, AlignRight, ListOrdered, Paperclip, Sparkles, Eye, Edit3 } from "lucide-react";
import { Button, FormSelect, FormInput, Badge, Chip } from "@/components/ds";
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

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Send progress note"
      maxWidth="xl"
      footer={
        <div className="flex w-full items-center justify-between">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
            Attach files
          </Button>
          <Button variant="primary" onClick={onClose}>
            <Send className="h-3.5 w-3.5" />
            Send
          </Button>
        </div>
      }
    >
      <div className="max-h-[calc(100vh-20rem)] space-y-4 overflow-y-auto">
        {/* Mode toggle */}
        <div className="flex items-center gap-2">
          <FormSelect
            options={[
              { value: "progress-note", label: "#2_Progress note email template" },
              { value: "default", label: "Default template" },
            ]}
            defaultValue="progress-note"
            className="flex-1"
          />
          <div className="flex rounded-lg border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("edit")}
              className={`rounded-none rounded-l-lg border-0 text-label-md ${viewMode === "edit" ? "bg-primary/10 text-primary hover:bg-primary/10" : ""}`}
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("preview")}
              className={`rounded-none rounded-r-lg border-l border-border text-label-md ${viewMode === "preview" ? "bg-primary/10 text-primary hover:bg-primary/10" : ""}`}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </Button>
          </div>
        </div>

        {viewMode === "edit" ? (
          <>
            {/* To field */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border px-3 py-2">
              {toEmails.map((email) => (
                <Chip
                  key={email}
                  variant="gray"
                  onRemove={() => handleRemoveEmail(email)}
                  className="py-0.5 text-sm"
                >
                  {email}
                </Chip>
              ))}
              <FormInput
                type="email"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                onKeyDown={handleAddEmail}
                placeholder={toEmails.length === 0 ? "Add recipient email..." : ""}
                className="min-w-[120px] flex-1 !border-none !rounded-none !p-0 !ring-0 text-sm !shadow-none"
              />
            </div>

            {/* Reply to */}
            <div>
              <label className="mb-1 block text-label-lg text-text-secondary">
                Reply to <span className="text-red-500">*</span>
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
            <div className="flex items-center gap-2">
              <div className="flex-1">
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
                className="shrink-0"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Summarise session"}
              </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-0.5 border-b border-border pb-2">
              {[Bold, Italic, Underline, Type, Grid3X3, Link2, Minus, Image, AlignLeft, AlignCenter, AlignRight, ListOrdered].map((Icon, i) => (
                <Button key={i} variant="icon">
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            {/* Body text area */}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full resize-none rounded-lg border-none text-sm leading-relaxed text-text outline-none placeholder:text-text-secondary"
            />
          </>
        ) : (
          /* Email preview */
          <div className="rounded-lg border border-border bg-gray-50 p-5">
            <div className="mb-4 space-y-1.5 border-b border-border pb-4">
              <div className="flex gap-2 text-body-sm">
                <span className="w-16 text-text-secondary">From:</span>
                <span className="text-text">Hands Together Therapies &lt;hello@hands-together-therapy.com&gt;</span>
              </div>
              <div className="flex gap-2 text-body-sm">
                <span className="w-16 text-text-secondary">To:</span>
                <span className="text-text">{toEmails.join(", ") || "No recipients"}</span>
              </div>
              <div className="flex gap-2 text-body-sm">
                <span className="w-16 text-text-secondary">Subject:</span>
                <span className="text-body-md-strong text-text">{subject}</span>
              </div>
            </div>

            {/* Email body preview */}
            <div className="rounded-lg bg-white p-5 shadow-sm">
              {/* Logo header */}
              <div className="mb-4 border-b border-gray-100 pb-4 text-center">
                <span className="text-heading-lg text-primary">splose</span>
              </div>

              {/* Body content */}
              <div className="whitespace-pre-wrap text-body-md leading-relaxed text-text">
                {body}
              </div>

              {/* Attachment indicator */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2">
                  <Paperclip className="h-4 w-4 text-primary" />
                  <span className="text-body-sm text-text">Progress note — {clientName} — {formatDisplayDate(noteDate)}.pdf</span>
                  <Badge variant="purple">PDF</Badge>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 border-t border-gray-100 pt-4 text-center text-caption-md text-text-secondary">
                <p>Sent via splose — Practice management software for allied health</p>
                <p className="mt-1">
                  <a href="#" className="text-primary hover:underline">Unsubscribe</a> · <a href="#" className="text-primary hover:underline">Privacy policy</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
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
