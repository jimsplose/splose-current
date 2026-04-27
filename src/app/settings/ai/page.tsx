"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Flex, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { InfoCircleOutlined } from "@ant-design/icons";
import { FormInput, FormTextarea, FormSelect, Tab, Toggle, Pagination, Dropdown, Modal, Alert, PageHeader, Divider, Text, Badge } from "@/components/ds";
import styles from "./SettingsAi.module.css";

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
    <div className={styles.shell}>
        <PageHeader title="splose AI">
          <Button>Learn</Button>
          <Button type="primary">Save</Button>
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
          style={{ marginBottom: 24 }}
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
      <Text variant="heading/xl" as="h3" color="text" mb={8} className={styles.heroHeading}>splose AI settings: More control, your way</Text>

      {/* Two-column layout: description (left) + video preview (right) */}
      <div className={styles.twoColumn}>
        {/* Left column — preferences */}
        <div className={styles.leftCol}>
          <Divider variant="primary" spacing="sm" />
          <Text variant="body/md" as="h4" color="text" mb={10}>Preferences</Text>

          {/* Card container */}
          <div className={styles.prefsCard}>
            {/* Progress notes */}
            <Text variant="heading/xl" as="h4" color="text" mb={30}>splose AI - progress notes</Text>
            <Flex vertical gap={16}>
              <Flex align="center" justify="space-between">
                <Text as="span" variant="body/md" className={styles.prefRow}>Enable voice to text and ask splose AI</Text>
                <Toggle checked={voiceToText} onChange={setVoiceToText} />
              </Flex>
              <Flex align="center" justify="space-between">
                <Text as="span" variant="body/md" className={styles.prefRow}>Save recording to client file</Text>
                <Toggle checked={saveRecording} onChange={setSaveRecording} />
              </Flex>
            </Flex>

            <Divider variant="primary" spacing="sm" className={styles.prefsDivider} />

            {/* Email */}
            <Text variant="heading/xl" as="h4" color="text" mb={30}>splose AI - email</Text>
            <Flex align="center" justify="space-between">
              <Text as="span" variant="body/md" className={styles.prefRow}>Enable splose AI email assistant</Text>
              <Toggle checked={emailAssistant} onChange={setEmailAssistant} />
            </Flex>

            <Divider variant="primary" spacing="sm" className={styles.prefsDivider} />

            {/* Calendar */}
            <Text variant="heading/xl" as="h4" color="text" mb={30}>splose AI - calendar</Text>
            <Flex vertical gap={16}>
              <Flex align="center" justify="space-between">
                <Text as="span" variant="body/md" className={styles.prefRow}>Enable splose AI for calendar</Text>
                <Toggle checked={calendarAI} onChange={setCalendarAI} />
              </Flex>
              <Flex align="center" justify="space-between">
                <Text as="span" variant="body/md" className={styles.prefRow}>Include cancelled appointment slots in splose AI for calendar</Text>
                <Toggle checked={cancelledSlots} onChange={setCancelledSlots} />
              </Flex>
            </Flex>
          </div>
        </div>

        {/* Right column — Wistia video preview */}
        <div className={styles.videoCol}>
          <div className={styles.videoFrame}>
            <iframe
              src="https://fast.wistia.net/embed/iframe/xpxc3cl0j7"
              title="splose AI preview"
              allow="autoplay; fullscreen"
              className={styles.videoIframe}
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

  const columns: ColumnsType<typeof aiPrompts[number]> = [
    { key: "name", title: "Prompt", dataIndex: "name" },
    {
      key: "userGroup",
      title: "User group",
      render: (_, row) => <Text color="secondary" as="span">{row.userGroup}</Text>,
    },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, row) => (
        <Dropdown
          trigger={<Button type="text" size="small" className={styles.dropdownTrigger}>...</Button>}
          items={[
            { label: "Edit", value: "edit" },
            { label: "Duplicate", value: "duplicate" },
            { label: "Delete", value: "delete", danger: true },
          ]}
          onSelect={(val) => { if (val === "edit") handleEdit(row.name); }}
          align="right"
        />
      ),
    },
  ];

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <h2 className={styles.savedPromptsHeader}>AI prompts</h2>
        <Button>+ New prompt</Button>
      </Flex>

      <Table columns={columns} dataSource={pagedPrompts} rowKey="name" pagination={false} />
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
            <Button onClick={() => setEditPrompt(null)}>Cancel</Button>
            <Button type="primary" onClick={() => setEditPrompt(null)}>Save</Button>
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

  const columns: ColumnsType<typeof aiBlocks[number]> = [
    {
      key: "name",
      title: <div className={styles.tableHeader}>AI block <span className={styles.sortArrow}>&#8645;</span></div>,
      dataIndex: "name",
    },
    {
      key: "tag",
      title: <div className={styles.tableHeader}>Tag <span className={styles.sortArrow}>&#8645;</span></div>,
      render: (_, row) => <Badge variant="purple">{row.tag}</Badge>,
    },
    {
      key: "createdBy",
      title: <div className={styles.tableHeader}>Created by <span className={styles.sortArrow}>&#9660;</span></div>,
      render: (_, row) => <Text color="secondary" as="span">{row.createdBy}</Text>,
    },
    {
      key: "lastModified",
      title: <div className={styles.tableHeader}>Last modified <span className={styles.sortArrow}>&#8645;</span></div>,
      render: (_, row) => <Text color="secondary" as="span">{row.lastModified}</Text>,
    },
    {
      key: "actions",
      title: "",
      align: "right" as const,
      render: (_, row) => (
        <Dropdown
          trigger={<Button type="text" size="small" className={styles.dropdownTrigger}>...</Button>}
          items={[
            { label: "Edit", value: "edit" },
            { label: "Duplicate", value: "duplicate" },
            { label: "Delete", value: "delete", danger: true },
          ]}
          onSelect={(val) => { if (val === "edit") handleEditBlock(row.name); }}
          align="right"
        />
      ),
    },
  ];

  return (
    <div>
      {/* Beta banner */}
      <Alert variant="info" icon={<InfoCircleOutlined />} style={{ marginBottom: 16 }}>
        <Flex justify="space-between" align="center">
          <Text as="span" variant="body/md">We need your feedback on AI blocks.</Text>
          <Flex align="center" gap={8}>
            <Text as="span" variant="body/md" color="secondary">Fill a</Text>
            <span className={styles.alertRowLink}>short survey.</span>
            <Button type="text" size="small" className={styles.alertCloseBtn}>&times;</Button>
          </Flex>
        </Flex>
      </Alert>

      <Text as="p" variant="body/md" color="secondary" mb={16}>
        Spend less time writing prompts with your saved library of AI blocks, organised by{" "}
        <span className={styles.alertRowLink}>tags</span>. AI blocks are reusable, customisable and
        adjust to your client&apos;s context. Insert them into a template or progress note.{" "}
        <span className={styles.alertRowLink}>Learn more</span>.
      </Text>

      {/* Search and new button */}
      <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <FormInput placeholder="Search" className={styles.searchInput} />
        </div>
        <Button type="primary" size="small" className={styles.searchBtn}>
          <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </Button>
        <Button type="primary">+ New AI block</Button>
      </Flex>

      {/* Saved blocks heading */}
      <Text variant="heading/md" as="h3" color="text" mb={12}>Your saved blocks</Text>

      {/* Table */}
      <Table columns={columns} dataSource={aiBlocks} rowKey="name" pagination={false} />

      <Modal
        open={editBlock !== null}
        onClose={() => setEditBlock(null)}
        title="Edit AI block"
        footer={
          <>
            <Button onClick={() => setEditBlock(null)}>Cancel</Button>
            <Button type="primary" onClick={() => setEditBlock(null)}>Save</Button>
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
