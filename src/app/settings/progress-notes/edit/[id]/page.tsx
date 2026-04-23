"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Flex } from "antd";
import { ThunderboltOutlined, PlusOutlined, HolderOutlined, MoreOutlined, CheckOutlined } from "@ant-design/icons";
import Icon from "@/components/ds/Icon";
import {
  Button,
  FormInput,
  FormSelect,
  Toggle,
  FormPage,
  RichTextEditor,
  Card,
  Modal,
  Dropdown,
} from "@/components/ds";
import type { DropdownItem } from "@/components/ds";

interface AIBlock {
  id: number;
  name: string;
  prompt: string;
}

type TagFilter = "all" | "soap" | "assessment" | "treatment" | "custom";

interface LibraryBlock extends AIBlock {
  tag: TagFilter;
}

const libraryBlocks: LibraryBlock[] = [
  { id: 1, name: "Subjective", prompt: "Summarise the client's subjective experience from the session.", tag: "soap" },
  { id: 2, name: "Objective", prompt: "Document objective observations from the session.", tag: "soap" },
  { id: 3, name: "Assessment", prompt: "Provide clinical assessment based on session findings.", tag: "assessment" },
  { id: 4, name: "Plan", prompt: "Outline the treatment plan and next steps.", tag: "soap" },
  { id: 5, name: "Goals", prompt: "List current therapy goals and progress.", tag: "treatment" },
  { id: 6, name: "Risk Assessment", prompt: "Assess current risk factors and safety concerns.", tag: "assessment" },
];

const tagFilterOptions = [
  { value: "all", label: "All" },
  { value: "soap", label: "SOAP" },
  { value: "assessment", label: "Assessment" },
  { value: "treatment", label: "Treatment" },
  { value: "custom", label: "Custom" },
];

const blockDropdownItems: DropdownItem[] = [
  { label: "Load from library", value: "load-library" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Save to library", value: "save-library" },
  { label: "", value: "divider", divider: true },
  { label: "Remove", value: "remove", danger: true },
];

export default function EditProgressNoteTemplatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("BIRP Treatment Note");
  const [hasAi, setHasAi] = useState(true);
  const [blocks, setBlocks] = useState<AIBlock[]>([
    { id: 1, name: "Subjective", prompt: "Summarise the client's subjective experience from the session." },
    { id: 2, name: "Objective", prompt: "Document objective observations from the session." },
    { id: 3, name: "Assessment", prompt: "Provide clinical assessment based on session findings." },
    { id: 4, name: "Plan", prompt: "Outline the treatment plan and next steps." },
  ]);
  const [freeText, setFreeText] = useState("<p>Additional notes can be added here.</p>");
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryTargetBlockId, setLibraryTargetBlockId] = useState<number | null>(null);
  const [savedBlockId, setSavedBlockId] = useState<number | null>(null);
  const [tagFilter, setTagFilter] = useState<TagFilter>("all");

  const filteredLibraryBlocks = tagFilter === "all" ? libraryBlocks : libraryBlocks.filter((b) => b.tag === tagFilter);

  function addBlock(block: AIBlock) {
    if (libraryTargetBlockId !== null) {
      setBlocks((prev) =>
        prev.map((b) => (b.id === libraryTargetBlockId ? { ...block, id: libraryTargetBlockId } : b)),
      );
      setLibraryTargetBlockId(null);
    } else {
      setBlocks((prev) => [...prev, { ...block, id: Date.now() }]);
    }
    setShowLibrary(false);
  }

  function removeBlock(id: number) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  function duplicateBlock(id: number) {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const original = prev[idx];
      const copy = { ...original, id: Date.now(), name: `${original.name} (copy)` };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }

  const handleBlockAction = useCallback(
    (blockId: number, action: string) => {
      switch (action) {
        case "load-library":
          setLibraryTargetBlockId(blockId);
          setShowLibrary(true);
          break;
        case "duplicate":
          duplicateBlock(blockId);
          break;
        case "save-library":
          setSavedBlockId(blockId);
          setTimeout(() => setSavedBlockId(null), 1500);
          break;
        case "remove":
          removeBlock(blockId);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <FormPage
        backHref="/settings/progress-notes"
        title={title || "Edit progress note template"}
        maxWidth={768}
        actions={
          <Flex align="center" gap={8}>
            <Button variant="secondary" onClick={() => router.push("/settings/progress-notes")}>Cancel</Button>
            <Button variant="primary" onClick={() => router.push("/settings/progress-notes")}>Save</Button>
          </Flex>
        }
      >
        <Flex vertical gap={24}>
          <FormInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <Toggle label="Enable AI-assisted documentation" checked={hasAi} onChange={setHasAi} />

          {hasAi && (
            <Flex vertical gap={12}>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>AI blocks</h3>
              {blocks.map((block) => (
                <Card key={block.id} padding="none">
                  <Flex align="center" gap={8} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(var(--color-primary-rgb, 130, 80, 255), 0.05)', padding: '8px 16px' }}>
                    <Icon as={HolderOutlined} style={{ cursor: 'grab' }} tone="secondary" />
                    <Icon as={ThunderboltOutlined} tone="primary" />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{block.name}</span>
                    {savedBlockId === block.id && (
                      <Flex align="center" gap={4} style={{ fontSize: 11, color: '#059669' }}>
                        <Icon as={CheckOutlined} size="md" /> Saved
                      </Flex>
                    )}
                    <Dropdown
                      trigger={
                        <Button variant="ghost" iconOnly style={{ color: 'var(--color-text-secondary)' }}>
                          <Icon as={MoreOutlined} />
                        </Button>
                      }
                      items={blockDropdownItems}
                      onSelect={(value) => handleBlockAction(block.id, value)}
                      align="right"
                    />
                  </Flex>
                  <div style={{ padding: '12px 16px' }}>
                    <textarea
                      style={{ width: '100%', borderRadius: 4, border: '1px solid var(--color-border)', padding: '8px 12px', outline: 'none', fontSize: 14 }}
                      rows={2}
                      value={block.prompt}
                      onChange={(e) =>
                        setBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, prompt: e.target.value } : b)))
                      }
                    />
                  </div>
                </Card>
              ))}
              <Button variant="secondary" onClick={() => setShowLibrary(true)}>
                <Icon as={PlusOutlined} /> Add an AI block
              </Button>
            </Flex>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)' }}>Free text section</label>
            <RichTextEditor value={freeText} onChange={setFreeText} rows={6} />
          </div>
        </Flex>
      </FormPage>

      <Modal
        open={showLibrary}
        onClose={() => {
          setShowLibrary(false);
          setLibraryTargetBlockId(null);
        }}
        title="AI block library"
        maxWidth="md"
      >
        <Flex vertical gap={12}>
          <FormSelect
            label="Filter by tag"
            options={tagFilterOptions}
            value={tagFilter}
            onChange={(value) => setTagFilter(value as TagFilter)}
          />
          <Flex vertical gap={8}>
            {filteredLibraryBlocks.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-text-secondary)', padding: '16px 0' }}>No blocks match this filter.</p>
            ) : (
              filteredLibraryBlocks.map((block) => (
                <Flex
                  component="button"
                  key={block.id}
                  onClick={() => addBlock(block)}
                  align="center"
                  gap={12}
                  style={{ textAlign: 'left', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', padding: '12px 16px', transition: 'all 0.2s', cursor: 'pointer', backgroundColor: 'transparent' }}
                >
                  <Icon as={ThunderboltOutlined} tone="primary" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{block.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{block.prompt}</div>
                  </div>
                </Flex>
              ))
            )}
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
