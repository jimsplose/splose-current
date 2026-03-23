"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Plus, GripVertical, Trash2 } from "lucide-react";
import {
  Button,
  FormInput,
  Toggle,
  Navbar,
  RichTextEditor,
  Card,
  Modal,
} from "@/components/ds";

interface AIBlock {
  id: number;
  name: string;
  prompt: string;
}

const libraryBlocks: AIBlock[] = [
  { id: 1, name: "Subjective", prompt: "Summarise the client's subjective experience from the session." },
  { id: 2, name: "Objective", prompt: "Document objective observations from the session." },
  { id: 3, name: "Assessment", prompt: "Provide clinical assessment based on session findings." },
  { id: 4, name: "Plan", prompt: "Outline the treatment plan and next steps." },
  { id: 5, name: "Goals", prompt: "List current therapy goals and progress." },
  { id: 6, name: "Risk Assessment", prompt: "Assess current risk factors and safety concerns." },
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

  function addBlock(block: AIBlock) {
    setBlocks((prev) => [...prev, { ...block, id: Date.now() }]);
    setShowLibrary(false);
  }

  function removeBlock(id: number) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

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
                  <button onClick={() => removeBlock(block.id)} className="rounded p-1 text-text-secondary hover:bg-gray-100 hover:text-danger">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
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
        onClose={() => setShowLibrary(false)}
        title="AI block library"
        maxWidth="md"
      >
        <div className="space-y-2">
          {libraryBlocks.map((block) => (
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
          ))}
        </div>
      </Modal>
    </div>
  );
}
