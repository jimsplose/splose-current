"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Flex } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { Button, FormInput, FormTextarea, FormSelect, Tab, Toggle, DataTable, TableHead, Th, TableBody, Tr, Td, Pagination, Dropdown, Modal, EmptyState, Badge, Alert, PageHeader, Divider } from "@/components/ds";

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
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <PageHeader title="splose AI">
          <Button variant="secondary">Learn</Button>
          <Button variant="primary">Save</Button>
        </PageHeader>

        {/* Tabs */}
        <Tab
          items={[
            { label: "Preferences", value: "preferences" },
            { label: "Saved prompts", value: "saved-prompts" },
            { label: "AI block library", value: "ai-block-library", badge: "New" },
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
      <h3 style={{ fontSize: 28, fontWeight: 700, lineHeight: '44px', marginBottom: 8 }} className="text-text">splose AI settings: More control, your way</h3>

      {/* Two-column layout: description (left) + video preview (right) */}
      <div style={{ display: 'flex', gap: 60 }}>
        {/* Left column — preferences */}
        <div style={{ flex: '1 1 0' }}>
          <Divider variant="primary" spacing="sm" />
          <h4 style={{ fontSize: 14, fontWeight: 400, color: 'rgb(65, 69, 73)', marginBottom: 10 }}>Preferences</h4>

          {/* Card container */}
          <div style={{ border: '1px solid rgb(217, 217, 217)', borderRadius: 8, padding: 20, backgroundColor: '#fff', boxShadow: 'rgba(193, 167, 255, 0.1) 0px 2px 4px 0px' }}>
            {/* Progress notes */}
            <h4 style={{ fontSize: 28, fontWeight: 700, marginBottom: 30 }} className="text-text">splose AI - progress notes</h4>
            <Flex vertical gap={16}>
              <Flex align="center" justify="space-between">
                <span className="text-body-md text-text">Enable voice to text and ask splose AI</span>
                <Toggle checked={voiceToText} onChange={setVoiceToText} />
              </Flex>
              <Flex align="center" justify="space-between">
                <span className="text-body-md text-text">Save recording to client file</span>
                <Toggle checked={saveRecording} onChange={setSaveRecording} />
              </Flex>
            </Flex>

            <Divider variant="primary" spacing="sm" style={{ margin: '0 0 12px' }} />

            {/* Email */}
            <h4 style={{ fontSize: 28, fontWeight: 700, marginBottom: 30 }} className="text-text">splose AI - email</h4>
            <Flex align="center" justify="space-between">
              <span className="text-body-md text-text">Enable splose AI email assistant</span>
              <Toggle checked={emailAssistant} onChange={setEmailAssistant} />
            </Flex>

            <Divider variant="primary" spacing="sm" style={{ margin: '0 0 12px' }} />

            {/* Calendar */}
            <h4 style={{ fontSize: 28, fontWeight: 700, marginBottom: 30 }} className="text-text">splose AI - calendar</h4>
            <Flex vertical gap={16}>
              <Flex align="center" justify="space-between">
                <span className="text-body-md text-text">Enable splose AI for calendar</span>
                <Toggle checked={calendarAI} onChange={setCalendarAI} />
              </Flex>
              <Flex align="center" justify="space-between">
                <span className="text-body-md text-text">Include cancelled appointment slots in splose AI for calendar</span>
                <Toggle checked={cancelledSlots} onChange={setCancelledSlots} />
              </Flex>
            </Flex>
          </div>
        </div>

        {/* Right column — Wistia video preview */}
        <div style={{ flexShrink: 0, width: 383 }}>
          <div style={{ width: 383, height: 383 }}>
            <iframe
              src="https://fast.wistia.net/embed/iframe/xpxc3cl0j7"
              title="splose AI preview"
              allow="autoplay; fullscreen"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(aiPrompts.length / pageSize);
  const pagedPrompts = aiPrompts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleEdit = (name: string) => {
    setEditName(name);
    const prompt = aiPrompts.find((p) => p.name === name);
    setEditGroup(prompt?.userGroup || "Any user");
    setEditPrompt(name);
  };

  return (
    <div>
      <Flex justify="space-between" align="center" className="mb-4">
        <h2 className="text-heading-lg text-text">AI prompts</h2>
        <Button variant="secondary">+ New prompt</Button>
      </Flex>

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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={aiPrompts.length}
        itemsPerPage={pageSize}
        onPageChange={setCurrentPage}
      />

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
        <Flex vertical gap={16}>
          <FormInput label="Prompt name" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <FormSelect
            label="User group"
            value={editGroup}
            onChange={setEditGroup}
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
        </Flex>
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
      <Alert variant="warning" icon={<WarningOutlined style={{ fontSize: 16 }} />} className="mb-4">
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={8}>
            <Badge variant="yellow">BETA</Badge>
            <span className="text-body-md text-text">We need your feedback on AI blocks</span>
          </Flex>
          <Flex align="center" gap={8} className="text-body-md">
            <span className="text-text-secondary">Fill a</span>
            <span className="cursor-pointer underline text-primary">short survey</span>
            <span className="text-text-secondary">or</span>
            <span className="cursor-pointer underline text-primary">book a time</span>
            <span className="text-text-secondary">to chat</span>
            <Button variant="ghost" size="sm" className="ml-2 text-text-secondary">&times;</Button>
          </Flex>
        </Flex>
      </Alert>

      <p className="mb-4 text-body-md text-text-secondary">
        Spend less time writing prompts with your saved library of AI blocks, organised by{" "}
        <span className="cursor-pointer underline text-primary">tags</span>. AI blocks are reusable, customisable and
        adjust to your client&apos;s context. Insert them into a template or progress note.{" "}
        <span className="cursor-pointer underline text-primary">Learn more</span>.
      </p>

      {/* Search and new button */}
      <Flex align="center" gap={8} className="mb-4">
        <div style={{ flex: 1, position: 'relative' }}>
          <FormInput placeholder="Search" style={{ height: 40, paddingLeft: 16, paddingRight: 16 }} />
        </div>
        <Button variant="primary" size="sm" style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 8, paddingBottom: 8 }}>
          <svg style={{ height: 20, width: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </Button>
        <Button variant="secondary">+ New AI block</Button>
      </Flex>

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
        <Flex vertical gap={16}>
          <FormInput label="Block name" value={editBlockName} onChange={(e) => setEditBlockName(e.target.value)} />
          <FormInput label="Tag" value={editBlockTag} onChange={(e) => setEditBlockTag(e.target.value)} />
          <FormTextarea
            label="Prompt"
            rows={6}
            defaultValue="Generate a detailed {block_name} section based on the session context, including relevant clinical observations and findings."
          />
        </Flex>
      </Modal>
    </div>
  );
}
