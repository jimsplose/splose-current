"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Plus, GripVertical, MoreHorizontal, Check } from "lucide-react";
import {
  Button,
  FormInput,
  FormSelect,
  Toggle,
  Navbar,
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
      // Replace the target block with the library block
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
    <div>
      <Navbar
        backHref="/settings/progress-notes"
        title={title || "Edit progress note template"}
        children={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => router.push("/settings/progress-notes")}>Cancel</Button>
            <Button variant="primary" onClick={() => router.push("/settings/progress-notes")}>Save</Button>
          </div>
        }
      />

      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <FormInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <Toggle label="Enable AI-assisted documentation" checked={hasAi} onChange={setHasAi} />

        {hasAi && (
          <div className="space-y-3">
            <h3 className="text-heading-md text-text">AI blocks</h3>
            {blocks.map((block) => (
              <Card key={block.id} padding="none">
                <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-4 py-2">
                  <GripVertical className="h-4 w-4 cursor-grab text-text-secondary" />
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="flex-1 text-label-lg text-text">{block.name}</span>
                  {savedBlockId === block.id && (
                    <span className="flex items-center gap-1 text-caption-md text-emerald-600">
                      <Check className="h-3.5 w-3.5" /> Saved
                    </span>
                  )}
                  <Dropdown
                    trigger={
                      <button className="rounded p-1 text-text-secondary hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    }
                    items={blockDropdownItems}
                    onSelect={(value) => handleBlockAction(block.id, value)}
                    align="right"
                  />
                </div>
                <div className="px-4 py-3">
                  <textarea
                    className="w-full rounded border border-border px-3 py-2 text-body-md text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
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
              <Plus className="h-4 w-4" /> Add an AI block
            </Button>
          </div>
        )}

        <div>
          <label className="mb-1 block text-label-lg text-text-secondary">Free text section</label>
          <RichTextEditor value={freeText} onChange={setFreeText} rows={6} />
        </div>
      </div>

      <Modal
        open={showLibrary}
        onClose={() => {
          setShowLibrary(false);
          setLibraryTargetBlockId(null);
        }}
        title="AI block library"
        maxWidth="md"
      >
        <div className="space-y-3">
          <FormSelect
            label="Filter by tag"
            options={tagFilterOptions}
            value={tagFilter}
            onChange={(value) => setTagFilter(value as TagFilter)}
          />
          <div className="space-y-2">
            {filteredLibraryBlocks.length === 0 ? (
              <p className="py-4 text-center text-body-md text-text-secondary">No blocks match this filter.</p>
            ) : (
              filteredLibraryBlocks.map((block) => (
                <button
                  key={block.id}
                  onClick={() => addBlock(block)}
                  className="flex w-full items-center gap-3 rounded-lg border border-border px-4 py-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <div className="text-label-lg text-text">{block.name}</div>
                    <div className="text-caption-md text-text-secondary">{block.prompt}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
