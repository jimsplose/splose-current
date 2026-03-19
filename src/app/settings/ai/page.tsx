"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, FormInput } from "@/components/ds";

const sidebarSections = [
  {
    title: "Workspace",
    items: [
      { name: "Details", href: "/settings" },
      { name: "Integrations", href: "/settings" },
      { name: "Subscription", href: "/settings" },
      { name: "SMS settings", href: "/settings" },
    ],
  },
  {
    title: "Automation",
    items: [
      { name: "Forms", href: "/settings" },
      { name: "splose AI", href: "/settings/ai" },
    ],
  },
  {
    title: "Business",
    items: [
      { name: "Locations", href: "/settings" },
      { name: "Custom fields", href: "/settings" },
      { name: "Rooms/Resources", href: "/settings" },
      { name: "Services", href: "/settings" },
      { name: "Busy times", href: "/settings" },
      { name: "Cancel/Reschedule", href: "/settings" },
      { name: "Online bookings", href: "/settings", badge: "New" },
      { name: "Communication types", href: "/settings" },
      { name: "Tags", href: "/settings" },
      { name: "Referral types", href: "/settings" },
    ],
  },
  {
    title: "Team",
    items: [
      { name: "Users", href: "/settings" },
      { name: "User groups", href: "/settings" },
      { name: "Permissions & Roles", href: "/settings" },
      { name: "Security", href: "/settings" },
    ],
  },
  {
    title: "Templates",
    items: [
      { name: "Appointments", href: "/settings" },
      { name: "Emails", href: "/settings" },
      { name: "Progress notes", href: "/settings" },
      { name: "Letters", href: "/settings" },
      { name: "Body charts", href: "/settings" },
    ],
  },
];

const aiPrompts = [
  { name: "Treatment Provided Prompt", userGroup: "Any user" },
  { name: "Objective Assessment Template", userGroup: "Any user" },
  { name: "Prognosis and Goals Template", userGroup: "Any user" },
  { name: "sss", userGroup: "Any user" },
  { name: "Test 1", userGroup: "Physiotherapists" },
  { name: "Test 2", userGroup: "Any user" },
  { name: "Voice to text SOAP progress note", userGroup: "Any user" },
  { name: "Report summary", userGroup: "Any user" },
  { name: "Letter to doctor", userGroup: "Any user" },
  { name: "Letter to patient", userGroup: "Any user" },
];

type Tab = "preferences" | "saved-prompts" | "ai-block-library";

export default function SettingsAIPage() {
  return (
    <Suspense>
      <SettingsAIPageInner />
    </Suspense>
  );
}

function SettingsAIPageInner() {
  const [activeTab, setActiveTab] = useState<Tab>("preferences");

  // Dev Navigator: ?state= param wiring
  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");
  useEffect(() => {
    if (!forcedState) return;
    const actions: Record<string, () => void> = {
      "saved-prompts": () => setActiveTab("saved-prompts"),
      "ai-block-library": () => setActiveTab("ai-block-library"),
    };
    actions[forcedState]?.();
  }, [forcedState]);

  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left sidebar */}
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-white p-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-4">
            <h3 className="mb-1 text-xs font-bold tracking-wider text-text uppercase">{section.title}</h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`block w-full rounded px-3 py-1.5 text-left text-sm transition-colors hover:bg-purple-50 hover:text-primary ${
                      item.name === "splose AI"
                        ? "border-l-2 border-primary bg-purple-50 font-medium text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {item.name}
                    {item.badge && (
                      <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">splose AI</h1>
          <div className="flex items-center gap-2">
            <Button variant="secondary">Learn</Button>
            <Button variant="primary">Save</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center gap-6 border-b border-border">
          <button
            onClick={() => setActiveTab("preferences")}
            className={`border-b-2 px-1 pb-3 text-sm ${
              activeTab === "preferences"
                ? "border-primary font-medium text-primary"
                : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab("saved-prompts")}
            className={`border-b-2 px-1 pb-3 text-sm ${
              activeTab === "saved-prompts"
                ? "border-primary font-medium text-primary"
                : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            Saved prompts
          </button>
          <button
            onClick={() => setActiveTab("ai-block-library")}
            className={`flex items-center gap-1.5 border-b-2 px-1 pb-3 text-sm ${
              activeTab === "ai-block-library"
                ? "border-primary font-medium text-primary"
                : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            AI block library
            <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold text-yellow-700">BETA</span>
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "preferences" && <PreferencesTab />}
        {activeTab === "saved-prompts" && <SavedPromptsTab />}
        {activeTab === "ai-block-library" && <AIBlockLibraryTab />}
      </div>
    </div>
  );
}

function PreferencesTab() {
  const [voiceToText, setVoiceToText] = useState(true);
  const [saveRecording, setSaveRecording] = useState(true);
  const [emailAssistant, setEmailAssistant] = useState(true);
  const [calendarAI, setCalendarAI] = useState(true);
  const [cancelledSlots, setCancelledSlots] = useState(true);

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-text">splose AI settings: More control, your way</h2>
      <hr className="mb-6 border-border" />

      <h3 className="mb-6 text-xl font-bold text-text">Preferences</h3>

      {/* Progress notes */}
      <div className="mb-8">
        <h4 className="mb-4 text-lg font-bold text-text">splose AI - progress notes</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text">Enable voice to text and ask splose AI</span>
            <Toggle checked={voiceToText} onChange={setVoiceToText} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text">Save recording to client file</span>
            <Toggle checked={saveRecording} onChange={setSaveRecording} />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="mb-8">
        <h4 className="mb-4 text-lg font-bold text-text">splose AI - email</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text">Enable splose AI email assistant</span>
          <Toggle checked={emailAssistant} onChange={setEmailAssistant} />
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-8">
        <h4 className="mb-4 text-lg font-bold text-text">splose AI - calendar</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text">Enable splose AI for calendar</span>
            <Toggle checked={calendarAI} onChange={setCalendarAI} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text">Include cancelled appointment slots in splose AI for calendar</span>
            <Toggle checked={cancelledSlots} onChange={setCancelledSlots} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-primary" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SavedPromptsTab() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">AI prompts</h2>
        <Button variant="secondary">+ New prompt</Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">Prompt</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">User group</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {aiPrompts.map((prompt) => (
              <tr key={prompt.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-text">{prompt.name}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{prompt.userGroup}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-text-secondary hover:text-text">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end border-t border-border px-4 py-3 text-sm text-text-secondary">
          <span>&lt;</span>
          <button className="mx-2 flex h-7 w-7 items-center justify-center rounded border border-primary bg-white text-xs font-medium text-primary">
            1
          </button>
          <span>&gt;</span>
        </div>
      </div>
    </div>
  );
}

function AIBlockLibraryTab() {
  return (
    <div>
      {/* Beta banner */}
      <div className="mb-4 flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-bold text-yellow-700">BETA</span>
          <span className="text-sm text-text">We need your feedback on AI blocks</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-secondary">Fill a</span>
          <span className="cursor-pointer text-primary underline">short survey</span>
          <span className="text-text-secondary">or</span>
          <span className="cursor-pointer text-primary underline">book a time</span>
          <span className="text-text-secondary">to chat</span>
          <button className="ml-2 text-text-secondary hover:text-text">&times;</button>
        </div>
      </div>

      <p className="mb-4 text-sm text-text-secondary">
        Spend less time writing prompts with your saved library of AI blocks, organised by{" "}
        <span className="cursor-pointer text-primary underline">tags</span>. AI blocks are reusable, customisable and
        adjust to your client&apos;s context. Insert them into a template or progress note.{" "}
        <span className="cursor-pointer text-primary underline">Learn more</span>.
      </p>

      {/* Search and new button */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <FormInput placeholder="Search" className="h-10 px-4" />
        </div>
        <Button variant="primary" size="sm" className="px-2 py-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </Button>
        <Button variant="primary">+ New AI block</Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  AI block
                  <span className="text-xs text-text-secondary">&#8645;</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  Tag
                  <span className="text-xs text-text-secondary">&#8645;</span>
                  <span className="text-xs text-text-secondary">&#9660;</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  Created by
                  <span className="text-xs text-text-secondary">&#9660;</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-text">
                <div className="flex items-center gap-1">
                  Last modified
                  <span className="text-xs text-text-secondary">&#8645;</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-text">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-sm text-text-secondary">
                No results
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
