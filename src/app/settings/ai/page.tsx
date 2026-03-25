"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button, FormInput, FormTextarea, FormSelect, Tab, Toggle, DataTable, TableHead, Th, TableBody, Tr, Td, Pagination, Dropdown, Modal, EmptyState, Badge, Alert, usePagination } from "@/components/ds";

const aiBlocks = [
  { name: "Subjective Assessment", tag: "SOAP", createdBy: "Jim Yencken", lastModified: "12 Mar 2026" },
  { name: "Objective Assessment", tag: "SOAP", createdBy: "Jim Yencken", lastModified: "12 Mar 2026" },
  { name: "Treatment Plan", tag: "Treatment", createdBy: "Sarah Chen", lastModified: "10 Mar 2026" },
  { name: "Goals & Prognosis", tag: "Assessment", createdBy: "Jim Yencken", lastModified: "8 Mar 2026" },
  { name: "Session Summary", tag: "Summary", createdBy: "Sarah Chen", lastModified: "5 Mar 2026" },
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

type TabValue = "preferences" | "saved-prompts" | "ai-block-library";

export default function SettingsAIPage() {
  return (
    <Suspense>
      <SettingsAIPageInner />
    </Suspense>
  );
}

function SettingsAIPageInner() {
  const [activeTab, setActiveTab] = useState<TabValue>("preferences");

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
    <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-display-lg">splose AI</h1>
          <div className="flex items-center gap-2">
            <Button variant="secondary">Learn</Button>
            <Button variant="primary">Save</Button>
          </div>
        </div>

        {/* Tabs */}
        <Tab
          items={[
            { label: "Preferences", value: "preferences" },
            { label: "Saved prompts", value: "saved-prompts" },
            { label: "AI block library", value: "ai-block-library", badge: "BETA" },
          ]}
          value={activeTab}
          onChange={(v) => setActiveTab(v as TabValue)}
          className="mb-6"
        />

        {/* Tab content */}
        {activeTab === "preferences" && <PreferencesTab />}
        {activeTab === "saved-prompts" && <SavedPromptsTab />}
        {activeTab === "ai-block-library" && <AIBlockLibraryTab />}
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
      <h2 className="mb-2 text-heading-lg text-text">splose AI settings: More control, your way</h2>
      <hr className="mb-6 border-border" />

      <h3 className="mb-6 text-display-md text-text">Preferences</h3>

      {/* Progress notes */}
      <div className="mb-8">
        <h4 className="mb-4 text-heading-lg text-text">splose AI - progress notes</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-body-md text-text">Enable voice to text and ask splose AI</span>
            <Toggle checked={voiceToText} onChange={setVoiceToText} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-md text-text">Save recording to client file</span>
            <Toggle checked={saveRecording} onChange={setSaveRecording} />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="mb-8">
        <h4 className="mb-4 text-heading-lg text-text">splose AI - email</h4>
        <div className="flex items-center justify-between">
          <span className="text-body-md text-text">Enable splose AI email assistant</span>
          <Toggle checked={emailAssistant} onChange={setEmailAssistant} />
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-8">
        <h4 className="mb-4 text-heading-lg text-text">splose AI - calendar</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-body-md text-text">Enable splose AI for calendar</span>
            <Toggle checked={calendarAI} onChange={setCalendarAI} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-md text-text">Include cancelled appointment slots in splose AI for calendar</span>
            <Toggle checked={cancelledSlots} onChange={setCancelledSlots} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SavedPromptsTab() {
  const [editPrompt, setEditPrompt] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editGroup, setEditGroup] = useState("Any user");
  const { paged: pagedPrompts, paginationProps: promptPaginationProps } = usePagination(aiPrompts, { pageKey: "/settings/ai" });

  const handleEdit = (name: string) => {
    setEditName(name);
    const prompt = aiPrompts.find((p) => p.name === name);
    setEditGroup(prompt?.userGroup || "Any user");
    setEditPrompt(name);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-heading-lg text-text">AI prompts</h2>
        <Button variant="secondary">+ New prompt</Button>
      </div>

      <DataTable>
        <TableHead>
          <Th>Prompt</Th>
          <Th>User group</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {pagedPrompts.map((prompt) => (
            <Tr key={prompt.name}>
              <Td>{prompt.name}</Td>
              <Td className="text-text-secondary">{prompt.userGroup}</Td>
              <Td align="right">
                <Dropdown
                  trigger={<Button variant="ghost" size="sm" className="text-text-secondary">...</Button>}
                  items={[
                    { label: "Edit", value: "edit" },
                    { label: "Duplicate", value: "duplicate" },
                    { label: "Delete", value: "delete", danger: true },
                  ]}
                  onSelect={(val) => { if (val === "edit") handleEdit(prompt.name); }}
                  align="right"
                />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>
      <Pagination {...promptPaginationProps} />

      <Modal
        open={editPrompt !== null}
        onClose={() => setEditPrompt(null)}
        title="Edit prompt"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditPrompt(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => setEditPrompt(null)}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Prompt name" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <FormSelect
            label="User group"
            value={editGroup}
            onChange={(e) => setEditGroup(e.target.value)}
            options={[
              { value: "Any user", label: "Any user" },
              { value: "Physiotherapists", label: "Physiotherapists" },
              { value: "Occupational Therapists", label: "Occupational Therapists" },
              { value: "Speech Pathologists", label: "Speech Pathologists" },
            ]}
          />
          <FormTextarea
            label="Prompt"
            rows={6}
            defaultValue="Write a professional progress note based on the session."
          />
        </div>
      </Modal>
    </div>
  );
}

function AIBlockLibraryTab() {
  const [editBlock, setEditBlock] = useState<string | null>(null);
  const [editBlockName, setEditBlockName] = useState("");
  const [editBlockTag, setEditBlockTag] = useState("");

  const handleEditBlock = (name: string) => {
    const block = aiBlocks.find((b) => b.name === name);
    setEditBlockName(name);
    setEditBlockTag(block?.tag || "");
    setEditBlock(name);
  };

  return (
    <div>
      {/* Beta banner */}
      <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />} className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="yellow">BETA</Badge>
            <span className="text-body-md text-text">We need your feedback on AI blocks</span>
          </div>
          <div className="flex items-center gap-2 text-body-md">
            <span className="text-text-secondary">Fill a</span>
            <span className="cursor-pointer text-primary underline">short survey</span>
            <span className="text-text-secondary">or</span>
            <span className="cursor-pointer text-primary underline">book a time</span>
            <span className="text-text-secondary">to chat</span>
            <Button variant="ghost" size="sm" className="ml-2 text-text-secondary">&times;</Button>
          </div>
        </div>
      </Alert>

      <p className="mb-4 text-body-md text-text-secondary">
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
        <Button variant="secondary">+ New AI block</Button>
      </div>

      {/* Table */}
      <DataTable>
        <TableHead>
          <Th><div className="flex items-center gap-1">AI block <span className="text-caption-md text-text-secondary">&#8645;</span></div></Th>
          <Th><div className="flex items-center gap-1">Tag <span className="text-caption-md text-text-secondary">&#8645;</span></div></Th>
          <Th><div className="flex items-center gap-1">Created by <span className="text-caption-md text-text-secondary">&#9660;</span></div></Th>
          <Th><div className="flex items-center gap-1">Last modified <span className="text-caption-md text-text-secondary">&#8645;</span></div></Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <TableBody>
          {aiBlocks.map((block) => (
            <Tr key={block.name}>
              <Td>{block.name}</Td>
              <Td><Badge variant="purple">{block.tag}</Badge></Td>
              <Td className="text-text-secondary">{block.createdBy}</Td>
              <Td className="text-text-secondary">{block.lastModified}</Td>
              <Td align="right">
                <Dropdown
                  trigger={<Button variant="ghost" size="sm" className="text-text-secondary">...</Button>}
                  items={[
                    { label: "Edit", value: "edit" },
                    { label: "Duplicate", value: "duplicate" },
                    { label: "Delete", value: "delete", danger: true },
                  ]}
                  onSelect={(val) => { if (val === "edit") handleEditBlock(block.name); }}
                  align="right"
                />
              </Td>
            </Tr>
          ))}
        </TableBody>
      </DataTable>

      <Modal
        open={editBlock !== null}
        onClose={() => setEditBlock(null)}
        title="Edit AI block"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditBlock(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => setEditBlock(null)}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput label="Block name" value={editBlockName} onChange={(e) => setEditBlockName(e.target.value)} />
          <FormInput label="Tag" value={editBlockTag} onChange={(e) => setEditBlockTag(e.target.value)} />
          <FormTextarea
            label="Prompt"
            rows={6}
            defaultValue="Generate a detailed {block_name} section based on the session context, including relevant clinical observations and findings."
          />
        </div>
      </Modal>
    </div>
  );
}
