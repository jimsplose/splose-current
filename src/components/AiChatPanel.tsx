"use client";

import { useState, useRef, useEffect } from "react";
import { CloseOutlined, ArrowUpOutlined, UnorderedListOutlined } from "@ant-design/icons";
import Card from "@/components/ds/Card";
import Icon from "@/components/ds/Icon";
import styles from "./AiChatPanel.module.css";

/* Sparkles icon — no direct AntD equivalent, use a custom SVG */
function SparklesIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      <path d="M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.936A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.963 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.581a.5.5 0 010 .964L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
    </svg>
  );
}

const SILLY_PROMPTS = [
  "Write a clinically relevant haiku about bears",
  "Generate a clinically relevant report about the contents of my fridge",
  "Summarise my patient's treatment plan in the style of a pirate",
  "Write a progress note for my cat's therapy session",
  "Analyse the therapeutic benefits of arguing with my GPS",
  "Create an evidence-based intervention plan for my houseplants",
  "Write a SOAP note for a patient who refuses to stop doing backflips",
  "Draft a referral letter for my neighbour's extremely loud parrot",
  "Evaluate the clinical significance of my patient's extensive sock collection",
  "Write a discharge summary for a patient who only communicates through interpretive dance",
  "Generate treatment goals for a patient who insists they are a professional cheese taster",
  "Assess the risks and benefits of prescribing interpretive jazz hands as a treatment modality",
];

const SILLY_RESPONSES = [
  "Bears in the clinic\nRoaring through the waiting room\nInsurance denied\n\n— splose AI, MD (not really)",
  "**Clinical Fridge Assessment**\n\nRisk factors identified:\n- 3 expired yogurts (HIGH RISK)\n- Leftover pizza from unknown epoch (MODERATE)\n- Mysterious tupperware container (DO NOT OPEN)\n\nTherapeutic items:\n- One apple (evidence-based snack)\n- Sparkling water (hydration goals met)\n\n**Recommendation:** Immediate fridge intervention required.",
  "Ahoy! This scallywag's treatment plan be as follows: weekly plunderin' of occupational therapy, twice-daily stretches o' the seven seas, and a strict no-parrot-on-shoulder policy durin' sessions. Arr, progress be steady — the patient can now tie a bowline with their affected hand. Shiver me therapy goals!",
  "**Patient:** Mittens (DSH, 4yo)\n**Presenting concern:** Excessive napping (18hrs/day) and unprovoked aggression toward curtains.\n\n**Assessment:** Patient exhibits selective attention (responds only to can opener), poor impulse control (knocked glass off table during session), and intermittent vocalisation of unknown clinical significance.\n\n**Plan:** Continue monitoring. Consider referral for curtain desensitisation therapy.",
  "A systematic review of 47 coffee cooling episodes reveals a statistically significant correlation (p < 0.001) between \"being about to take first sip\" and \"someone asking you a question.\" The therapeutic alliance between clinician and coffee remains strained. Recommend insulated mug as evidence-based intervention.",
  "**Evidence-Based Houseplant Intervention Protocol:**\n\n1. Establish therapeutic rapport (talk to fern daily, min 3 compliments)\n2. Graded exposure to sunlight (15min increments)\n3. Hydrotherapy (water when soil is dry, not when you remember)\n4. Group therapy (cluster plants together for peer support)\n5. Discharge criteria: One new leaf within 6 weeks\n\n*Note: The succulent does not require therapy. It is fine. It has always been fine.*",
  "**S:** Patient reports \"I just feel like flipping, you know?\" States backflips provide \"emotional regulation.\"\n**O:** Observed 3 spontaneous backflips during intake. Form is excellent. Stuck the landing each time. Other patients in waiting room applauded.\n**A:** Unconventional but effective coping strategy. No safety concerns identified (yet).\n**P:** Continue to monitor. Provide crash mat for sessions. Consider gymnastics referral.",
  "**Therapeutic Alliance Assessment: Patient vs GPS**\n\nThe patient exhibits persistent route-dependent anxiety, exacerbated by GPS recalculations. Attempts at CBT have failed as the patient insists the GPS \"started it.\" The GPS remains non-verbal in sessions but has been observed making passive-aggressive recalculation sounds. Recommend couples counselling.",
  "Dear colleague,\n\nI am writing to refer Polly (Amazona aestiva, 12yo) for urgent noise reduction therapy. Polly presents with persistent vocalisation disorder (120dB peak output, 5am onset). Current interventions (earplugs, white noise machine, begging) have proven ineffective.\n\nPolly's owner reports significant psychosocial impact including sleep disruption and strained neighbourly relations.\n\nThank you for seeing this patient at your earliest convenience (please bring ear protection).",
  "**Clinical Significance of Extensive Sock Collection (n=247 pairs)**\n\nThe patient's sock collection represents a complex interplay of executive function, sensory preference, and retail therapy. Notably, 43% feature novelty patterns (pizza, dinosaurs, motivational quotes), suggesting a compensatory humour-based coping mechanism.\n\nOf clinical concern: patient cannot locate matching pairs, indicating possible organisational deficits — or the existence of a sock-eating entity within the laundry.",
  "**Discharge Summary**\n\n**Communication modality:** Interpretive dance exclusively\n\n**Progress:** Patient has achieved all treatment goals. Pirouette technique improved 40%. Jazz hands indicate pain reduction. The \"angry stomp\" frequency decreased from 12 to 3 per session.\n\n**Outcome measures:** Patient performed a 4-minute contemporary piece expressing satisfaction with treatment. Standing ovation from therapy team.\n\n**Follow-up:** PRN appointments via interpretive voicemail.",
  "**Treatment Goals — Professional Cheese Tasting**\n\n1. Patient will distinguish between cheddar and gouda without visual cues in 4 out of 5 trials\n2. Patient will reduce unsolicited cheese opinions in social settings by 60%\n3. Patient will develop coping strategies for encountering pre-sliced cheese\n4. Patient will attend at least one social event without bringing a cheese board\n\n*Long-term goal: Patient will accept that Kraft Singles are, technically, cheese.*",
  "**Risk-Benefit Analysis: Interpretive Jazz Hands as Treatment Modality**\n\nBenefits:\n- Improved upper limb range of motion\n- Enhanced self-expression\n- Measurable sparkle increase (p < 0.05)\n\nRisks:\n- Carpal tunnel from excessive jazz-handing\n- Social misinterpretation in supermarket settings\n- May spontaneously break into spirit fingers during MDT meetings\n\n**Verdict:** Proceed with caution. Ensure informed consent includes \"may become fabulous.\"",
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AiChatPanelProps {
  onClose: () => void;
  variant?: "calendar" | "notes";
}

export default function AiChatPanel({ onClose, variant = "calendar" }: AiChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [promptIndex, setPromptIndex] = useState(() => Math.floor(Math.random() * SILLY_PROMPTS.length));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleInputFocus = () => {
    if (!inputValue) {
      const prompt = SILLY_PROMPTS[promptIndex % SILLY_PROMPTS.length];
      setInputValue(prompt);
      setPromptIndex((prev) => prev + 1);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsTyping(true);

    // Pick a random response (different from consecutive ones)
    const responseIdx = Math.floor(Math.random() * SILLY_RESPONSES.length);
    const delay = 1500 + Math.random() * 2000; // 1.5-3.5s

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: SILLY_RESPONSES[responseIdx] }]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = variant === "calendar"
    ? ["Summarise my day", "Show availability gaps", "Find open slots"]
    : ["Summarise the client's details", "Summarise the last 3 months of notes", "List the appointments for the next 2 weeks"];

  const handleQuickAction = (action: string) => {
    setMessages((prev) => [...prev, { role: "user", content: action }]);
    setIsTyping(true);

    const responseIdx = Math.floor(Math.random() * SILLY_RESPONSES.length);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: SILLY_RESPONSES[responseIdx] }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Header */}
      {/* eslint-disable-next-line no-restricted-syntax -- one-off container with design-token border */}
      <div style={{ display: "flex", height: 60, flexShrink: 0, alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-border)", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SparklesIcon size={18} className="text-primary" />
          <span className="text-heading-sm text-text">Ask splose AI</span>
        </div>
        <button
          className={`text-text-secondary ${styles.buttonReset}`}
          style={{ display: "flex", height: 32, width: 32, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "transparent", cursor: "pointer" }}
          onClick={onClose}
        >
          <Icon as={CloseOutlined} size="lg" />
        </button>
      </div>

      {/* Main content area — scrollable */}
      <div style={{ display: "flex", flex: 1, flexDirection: "column", overflowY: "auto", padding: 24 }}>
        {!hasMessages ? (
          <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {/* Greeting card */}
            <Card padding="md" style={{ marginBottom: 24, width: '100%', textAlign: 'center' }}>
              {/* eslint-disable-next-line no-restricted-syntax -- emoji glyph sizing; no DS typography variant exists for 30px emoji */}
              <div style={{ marginBottom: 8, fontSize: 30 }}>{variant === "calendar" ? "👋" : "🌸"}</div>
              <h2 className="text-heading-lg text-text">Hello, I&apos;m splose AI</h2>
            </Card>

            <p style={{ marginBottom: 24, textAlign: "center" }} className="text-body-md text-text-secondary">
              {variant === "calendar"
                ? "How can I help you today?"
                : "Transcribe your session, ask a question or select a prompt"}
            </p>

            {/* Quick action pills */}
            <div style={{ display: "flex", width: "100%", flexDirection: "column", gap: 12 }}>
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  className="text-body-sm text-primary border-primary"
                  style={{ borderRadius: 9999, borderWidth: 1, borderStyle: "solid", padding: "10px 16px", textAlign: "left", background: "transparent", cursor: "pointer" }}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div
                  className={`text-body-sm ${msg.role === "user" ? "text-text-inverted" : "text-text"}`}
                  style={{
                    maxWidth: "85%",
                    borderRadius: 16,
                    padding: "12px 16px",
                    background: msg.role === "user" ? "var(--color-primary)" : "var(--color-gray-100, #f3f4f6)",
                  }}
                >
                  <div style={{ whiteSpace: "pre-line" }}>{msg.content}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 16, background: "var(--color-gray-100, #f3f4f6)", padding: "12px 16px" }}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom section — fixed */}
      {/* eslint-disable-next-line no-restricted-syntax -- one-off container with design-token top border */}
      <div style={{ borderTop: "1px solid var(--color-border)", padding: 16 }}>
        {/* Chat input */}
        {/* eslint-disable-next-line no-restricted-syntax -- pill-shaped input wrapper with design-token border; no DS SearchBar variant matches */}
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8, borderRadius: 9999, border: "1px solid var(--color-border)", background: "#fff", padding: "10px 16px" }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask splose AI anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className={`text-body-sm text-text ${styles.inputReset}`}
            style={{ flex: 1, background: "transparent", outline: "none" }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className={`text-text-inverted bg-primary ${styles.buttonReset}`}
            style={{
              display: "flex",
              height: 32,
              width: 32,
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              cursor: !inputValue.trim() || isTyping ? "not-allowed" : "pointer",
              opacity: !inputValue.trim() || isTyping ? 0.4 : 1,
            }}
          >
            <Icon as={ArrowUpOutlined} size="lg" tone="inverted" />
          </button>
        </div>

        {/* Saved prompts button */}
        <button
          className={`text-body-sm text-text-secondary ${styles.buttonReset}`}
          style={{ display: "flex", width: "100%", alignItems: "center", gap: 8, borderRadius: 8, padding: "8px 8px", background: "transparent", cursor: "pointer" }}
        >
          <Icon as={UnorderedListOutlined} size="lg" tone="secondary" />
          Saved prompts
        </button>

        {/* Footer */}
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="text-caption-sm text-text-secondary">
            AI can make mistakes, double-check responses
          </span>
        </div>
      </div>
    </>
  );
}
