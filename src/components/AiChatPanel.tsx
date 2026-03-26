"use client";

import { useState, useRef, useEffect } from "react";
import { X, ArrowUp, ClipboardList, Sparkles } from "lucide-react";
import Card from "@/components/ds/Card";

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
      <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-primary" />
          <span className="text-heading-sm text-text">Ask splose AI</span>
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main content area — scrollable */}
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
        {!hasMessages ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            {/* Greeting card */}
            <Card padding="md" className="mb-6 w-full text-center">
              <div className="mb-2 text-3xl">{variant === "calendar" ? "👋" : "🌸"}</div>
              <h2 className="text-heading-lg text-text">Hello, I&apos;m splose AI</h2>
            </Card>

            <p className="mb-6 text-center text-body-md text-text-secondary">
              {variant === "calendar"
                ? "How can I help you today?"
                : "Transcribe your session, ask a question or select a prompt"}
            </p>

            {/* Quick action pills */}
            <div className="flex w-full flex-col gap-3">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleQuickAction(action)}
                  className="rounded-full border border-primary px-4 py-2.5 text-left text-body-sm text-primary transition-colors hover:bg-primary/5"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-body-sm ${
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-text"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl bg-gray-100 px-4 py-3">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom section — fixed */}
      <div className="border-t border-border px-4 py-4">
        {/* Chat input */}
        <div className="mb-3 flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask splose AI anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-body-sm text-text outline-none placeholder:text-text-secondary"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>

        {/* Saved prompts button */}
        <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-body-sm text-text-secondary transition-colors hover:bg-gray-50">
          <ClipboardList className="h-4 w-4" />
          Saved prompts
        </button>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-caption-sm text-text-secondary">
            AI can make mistakes, double-check responses
          </span>
        </div>
      </div>
    </>
  );
}
