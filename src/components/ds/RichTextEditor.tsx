"use client";

import { useRef, useCallback, useState } from "react";
import { Bold, Italic, Underline, Strikethrough, Link, List, ListOrdered, Heading1, Heading2, Image, ChevronDown, Undo2, Redo2, Minus } from "lucide-react";
import Dropdown from "./Dropdown";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  rows?: number;
  variables?: string[];
}

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  rows = 8,
  variables,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const execCommand = useCallback((command: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    updateActiveFormats();
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    if (document.queryCommandState("strikeThrough")) formats.add("strikeThrough");
    setActiveFormats(formats);
  }, []);

  const handleInput = useCallback(() => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  const handleLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) execCommand("createLink", url);
  }, [execCommand]);

  const insertVariable = useCallback((variable: string) => {
    editorRef.current?.focus();
    document.execCommand("insertText", false, `{${variable}}`);
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const ToolbarButton = ({ command, icon: Icon, active }: { command: string; icon: React.ComponentType<{ className?: string }>; active?: boolean }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); execCommand(command); }}
      className={`rounded p-1.5 transition-colors ${active ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-gray-100 hover:text-text"}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-gray-50/50 px-2 py-1.5">
        <ToolbarButton command="bold" icon={Bold} active={activeFormats.has("bold")} />
        <ToolbarButton command="italic" icon={Italic} active={activeFormats.has("italic")} />
        <ToolbarButton command="underline" icon={Underline} active={activeFormats.has("underline")} />
        <ToolbarButton command="strikeThrough" icon={Strikethrough} active={activeFormats.has("strikeThrough")} />

        <span className="mx-1 h-5 w-px bg-border" />

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand("formatBlock", "h1"); }}
          className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand("formatBlock", "h2"); }}
          className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton command="insertUnorderedList" icon={List} />
        <ToolbarButton command="insertOrderedList" icon={ListOrdered} />

        <span className="mx-1 h-5 w-px bg-border" />

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
          className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text"
        >
          <Link className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded p-1.5 text-text-secondary hover:bg-gray-100 hover:text-text"
        >
          <Image className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded px-1.5 py-1 text-[11px] font-semibold text-text-secondary hover:bg-gray-100 hover:text-text"
        >
          GIF
        </button>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton command="insertHorizontalRule" icon={Minus} />

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton command="undo" icon={Undo2} />
        <ToolbarButton command="redo" icon={Redo2} />

        {variables && variables.length > 0 && (
          <>
            <span className="mx-1 h-5 w-px bg-border" />
            <Dropdown
              trigger={
                <button type="button" className="flex items-center gap-1 rounded px-2 py-1 text-caption-md text-primary hover:bg-primary/5">
                  Insert variable <ChevronDown className="h-3 w-3" />
                </button>
              }
              items={variables.map((v) => ({ label: `{${v}}`, value: v }))}
              onSelect={insertVariable}
              align="left"
            />
          </>
        )}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        className="prose prose-sm max-w-none px-4 py-3 text-body-md text-text outline-none"
        style={{ minHeight: `${rows * 24}px` }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
