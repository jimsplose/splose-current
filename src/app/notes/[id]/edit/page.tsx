"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  LayoutGrid,
  Columns2,
  Save,
  Lock,
  ChevronDown,
  Sparkles,
  CheckCircle,
  ChevronUp,
  Plus,
} from "lucide-react";

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
};

const DEFAULT_AI_SECTIONS: Omit<AISection, "id">[] = [
  {
    title: "Subjective",
    prompt:
      "Get the session transcript (transcription) and patient details. Complete the Subjective section of this progress note. In your output, use person-centred NDIS language refer to the patient as \"the participant\"",
    content: "",
    expanded: true,
    generating: false,
    generated: false,
  },
  {
    title: "Objective",
    prompt:
      "Get the session transcript (transcription), previous progress notes from the last 2 months, and patient details. Complete the Objective section of this progress note. In your output, use person-centred NDIS language.",
    content: "",
    expanded: true,
    generating: false,
    generated: false,
  },
  {
    title: "Assessment",
    prompt:
      "Get the session transcript (transcription) and previous progress notes from the last 2 months. Complete the Assessment section of this progress note. In your output, use person-centred NDIS language.",
    content: "",
    expanded: true,
    generating: false,
    generated: false,
  },
  {
    title: "Plan",
    prompt:
      "Get the session transcript (transcription). This is the Plan section of a progress note. Complete the Plan section of this progress note. In your output, use person-centred NDIS language.",
    content: "",
    expanded: true,
    generating: false,
    generated: false,
  },
  {
    title: "Goals",
    prompt:
      "Get the session transcript (transcription), previous progress notes from the last 2 months, and patient details. Then check the patient's file uploads for any PDF documents containing their NDIS plan goals.",
    content: "",
    expanded: true,
    generating: false,
    generated: false,
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

export default function EditProgressNotePage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<NoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"single" | "split">("single");
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<AISection[]>(() =>
    DEFAULT_AI_SECTIONS.map((s, i) => ({ ...s, id: `section-${i}` }))
  );
  const [service, setService] = useState(
    "Mon 16 Mar 2026, 10:30am – Sharon Test 1 (OT – Initial Consult)"
  );
  const [syncing, setSyncing] = useState(false);

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
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, expanded: !s.expanded } : s
      )
    );
  }, []);

  const generateSection = useCallback((sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, generating: true } : s
      )
    );

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
            : s
        )
      );
    }, 1500);
  }, []);

  const generateAll = useCallback(() => {
    setSections((prev) => prev.map((s) => ({ ...s, generating: true })));

    // Stagger generation
    sections.forEach((section, i) => {
      setTimeout(() => {
        setSections((prev) =>
          prev.map((s) =>
            s.id === section.id
              ? {
                  ...s,
                  generating: false,
                  generated: true,
                  content: GENERATED_CONTENT[s.title] || "Generated content for " + s.title,
                }
              : s
          )
        );
      }, 800 + i * 600);
    });
  }, [sections]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const clientName = note
    ? `${note.client.firstName} ${note.client.lastName}`
    : "Client";

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-gray-50/30">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/notes/${id}`}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold text-text">
            {note?.template || "Note"}
          </h1>
          <span className="text-sm text-primary hover:underline cursor-pointer">
            {clientName}
          </span>
          {note?.signed ? (
            <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              <CheckCircle className="h-3 w-3" />
              Saved
            </span>
          ) : (
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              onClick={() => setViewMode("single")}
              className={`p-2 transition-colors ${
                viewMode === "single"
                  ? "bg-primary text-white"
                  : "bg-white text-text-secondary hover:bg-gray-50"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`p-2 transition-colors ${
                viewMode === "split"
                  ? "bg-primary text-white"
                  : "bg-white text-text-secondary hover:bg-gray-50"
              }`}
            >
              <Columns2 className="h-4 w-4" />
            </button>
          </div>
          <button className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
            Save as final
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Editor panel */}
        <div className="flex-1 overflow-y-auto bg-white p-6" style={{ maxHeight: "calc(100vh - 6rem)" }}>
          <div className="mx-auto max-w-3xl">
            {/* Service selector */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-text">
                Service
              </label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary"
              />
            </div>

            {/* Rich text toolbar */}
            <div className="mb-4 flex items-center gap-1 rounded-lg border border-border bg-white px-2 py-1.5 text-text-secondary">
              <span className="px-2 text-xs">Arial</span>
              <span className="px-2 text-xs">T↓</span>
              <span className="h-4 w-px bg-border" />
              <button className="rounded p-1 text-xs font-bold hover:bg-gray-100">B</button>
              <button className="rounded p-1 text-xs italic hover:bg-gray-100">I</button>
              <button className="rounded p-1 text-xs underline hover:bg-gray-100">U</button>
              <button className="rounded p-1 text-xs hover:bg-gray-100">S̶</button>
              <span className="h-4 w-px bg-border" />
              <button className="rounded p-1 text-xs hover:bg-gray-100">🔗</button>
              <button className="rounded p-1 text-xs hover:bg-gray-100">📷</button>
              <button className="rounded p-1 text-xs hover:bg-gray-100">📊</button>
              <span className="flex-1" />
              <button
                onClick={generateAll}
                className="flex items-center gap-1.5 rounded-lg border border-primary bg-white px-3 py-1 text-sm font-medium text-primary hover:bg-purple-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate
              </button>
              <button className="flex items-center justify-center rounded-full bg-primary p-1 text-white hover:bg-primary-dark">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Syncing notice */}
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-xs text-text-secondary">
              <div className="flex items-center gap-1">
                <input type="checkbox" checked readOnly className="h-3 w-3 rounded accent-primary" />
                <span>Syncing client history</span>
              </div>
              <span className="text-text-secondary">
                Clients with more notes may take longer. AI will have full context once complete
              </span>
            </div>

            {/* Client info table */}
            <div className="mb-6 rounded-lg border border-border bg-white">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Client Name", clientName],
                    ["Date of Session", formatDate(note?.date || "2026-03-16")],
                    ["Time", "10:30 am"],
                    ["Organisation", "Hands Together Therapies"],
                    ["Location", "4 Williamstown Rd"],
                    ["Therapist", note?.practitioner?.name || "Jim Yencken"],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-2 font-medium text-text w-40">{label}</td>
                      <td className="px-4 py-2 text-text-secondary">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Sections */}
            {sections.map((section) => (
              <div key={section.id} className="mb-6">
                <h3 className="mb-2 text-lg font-bold text-text">{section.title}</h3>

                {/* AI Block */}
                <div className="rounded-lg border border-purple-200 bg-purple-50/50">
                  {/* AI block header */}
                  <div
                    className="flex cursor-pointer items-center justify-between px-4 py-3"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">AI block</span>
                    </div>
                    {section.expanded ? (
                      <ChevronUp className="h-4 w-4 text-text-secondary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-text-secondary" />
                    )}
                  </div>

                  {/* AI block content */}
                  {section.expanded && (
                    <div className="border-t border-purple-200 px-4 py-3">
                      {section.generating ? (
                        <div className="flex items-center gap-2 py-4">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span className="text-sm text-text-secondary">
                            Generating {section.title.toLowerCase()}...
                          </span>
                        </div>
                      ) : section.generated ? (
                        <div className="text-sm text-text leading-relaxed whitespace-pre-wrap">
                          {section.content}
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {section.prompt}
                          </p>
                          <button
                            onClick={() => generateSection(section.id)}
                            className="mt-3 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            Generate
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Accept button when generated */}
                {section.generated && (
                  <div className="mt-2 flex justify-end">
                    <button className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-600">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Accept
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Split view reference panel */}
        {viewMode === "split" && (
          <div className="w-80 shrink-0 border-l border-border bg-white p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 6rem)" }}>
            <h3 className="mb-3 text-sm font-semibold text-text">
              Filter previous progress notes
            </h3>
            <input
              type="text"
              placeholder="Search notes"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <p className="text-sm text-text-secondary">
                No reference notes found
              </p>
            </div>
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
