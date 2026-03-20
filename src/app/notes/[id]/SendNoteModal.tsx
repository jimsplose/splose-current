"use client";

import { useState } from "react";
import { Send, Bold, Italic, Underline, Type, Grid3X3, Link2, Minus, Image, AlignLeft, AlignCenter, AlignRight, ListOrdered, Paperclip, Sparkles } from "lucide-react";
import { Button, FormSelect } from "@/components/ds";
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
          <button className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text">
            <Paperclip className="h-4 w-4" />
            Attach files
          </button>
          <Button variant="primary" onClick={onClose}>
            <Send className="h-3.5 w-3.5" />
            Send
          </Button>
        </div>
      }
    >
      <div className="max-h-[calc(100vh-20rem)] space-y-4 overflow-y-auto">
        {/* Email template dropdown */}
        <FormSelect
          options={[
            { value: "progress-note", label: "#2_Progress note email template" },
            { value: "default", label: "Default template" },
          ]}
          defaultValue="progress-note"
        />

        {/* To field */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border px-3 py-2">
          {toEmails.map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-sm text-text"
            >
              {email}
              <button
                onClick={() => handleRemoveEmail(email)}
                className="text-text-secondary hover:text-text"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <input
            type="email"
            value={toInput}
            onChange={(e) => setToInput(e.target.value)}
            onKeyDown={handleAddEmail}
            placeholder={toEmails.length === 0 ? "Add recipient email..." : ""}
            className="min-w-[120px] flex-1 border-none text-sm outline-none placeholder:text-text-secondary"
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
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          <button
            onClick={handleSummariseSession}
            disabled={isGenerating}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-label-lg text-white hover:bg-primary-dark disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Summarise session"}
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-0.5 border-b border-border pb-2">
          {[Bold, Italic, Underline, Type, Grid3X3, Link2, Minus, Image, AlignLeft, AlignCenter, AlignRight, ListOrdered].map((Icon, i) => (
            <button
              key={i}
              className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Body text area */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="w-full resize-none rounded-lg border-none text-sm leading-relaxed text-text outline-none placeholder:text-text-secondary"
        />
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
