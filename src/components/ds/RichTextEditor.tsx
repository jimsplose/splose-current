"use client";

import { useRef, useCallback, useState } from "react";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  LinkOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  FontSizeOutlined,
  PictureOutlined,
  UndoOutlined,
  RedoOutlined,
  MinusOutlined,
  DownOutlined,
} from "@ant-design/icons";
import Dropdown from "./Dropdown";
import styles from "./RichTextEditor.module.css";

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

  const ToolbarButton = ({ command, icon, active }: { command: string; icon: React.ReactNode; active?: boolean }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); execCommand(command); }}
      className={`${styles.toolbarButton} ${active ? styles.toolbarButtonActive : ""}`}
    >
      {icon}
    </button>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <ToolbarButton command="bold" icon={<BoldOutlined />} active={activeFormats.has("bold")} />
        <ToolbarButton command="italic" icon={<ItalicOutlined />} active={activeFormats.has("italic")} />
        <ToolbarButton command="underline" icon={<UnderlineOutlined />} active={activeFormats.has("underline")} />
        <ToolbarButton command="strikeThrough" icon={<StrikethroughOutlined />} active={activeFormats.has("strikeThrough")} />

        <span className={styles.divider} />

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand("formatBlock", "h1"); }}
          className={styles.toolbarButton}
        >
          <FontSizeOutlined />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); execCommand("formatBlock", "h2"); }}
          className={styles.toolbarButton}
          style={{ fontSize: 12 }}
        >
          <FontSizeOutlined />
        </button>

        <span className={styles.divider} />

        <ToolbarButton command="insertUnorderedList" icon={<UnorderedListOutlined />} />
        <ToolbarButton command="insertOrderedList" icon={<OrderedListOutlined />} />

        <span className={styles.divider} />

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
          className={styles.toolbarButton}
        >
          <LinkOutlined />
        </button>
        <button type="button" className={styles.toolbarButton}>
          <PictureOutlined />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          style={{ width: "auto", padding: "0 6px", fontSize: 11, fontWeight: 600 }}
        >
          GIF
        </button>

        <span className={styles.divider} />

        <ToolbarButton command="insertHorizontalRule" icon={<MinusOutlined />} />

        <span className={styles.divider} />

        <ToolbarButton command="undo" icon={<UndoOutlined />} />
        <ToolbarButton command="redo" icon={<RedoOutlined />} />

        {variables && variables.length > 0 && (
          <>
            <span className={styles.divider} />
            <Dropdown
              trigger={
                <button type="button" style={{ display: "flex", alignItems: "center", gap: 4, borderRadius: 4, padding: "4px 8px", fontSize: 12, color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}>
                  Insert variable <DownOutlined style={{ fontSize: 10 }} />
                </button>
              }
              items={variables.map((v) => ({ label: `{${v}}`, value: v }))}
              onSelect={insertVariable}
              align="left"
            />
          </>
        )}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        className={styles.editor}
        style={{ minHeight: `${rows * 24}px` }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
