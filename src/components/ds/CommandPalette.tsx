"use client";

import { Command } from "cmdk";
import { useEffect } from "react";
import type { ReactNode } from "react";

export interface CommandEntry {
  id: string;
  label: string;
  /** Section header — commands in the same group render together with a heading. */
  group?: string;
  icon?: ReactNode;
  /** Keyboard chip(s) shown right-aligned, e.g. `["Cmd", "K"]`. */
  shortcut?: string[];
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandPaletteProps {
  commands: CommandEntry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  emptyMessage?: string;
  /** Bind Cmd+K / Ctrl+K globally while this component is mounted. Default `true`. */
  triggerOnShortcut?: boolean;
}

function groupBy(commands: CommandEntry[]): Array<[string | undefined, CommandEntry[]]> {
  const map = new Map<string | undefined, CommandEntry[]>();
  for (const c of commands) {
    const list = map.get(c.group);
    if (list) list.push(c);
    else map.set(c.group, [c]);
  }
  return Array.from(map.entries());
}

/**
 * Keyboard-first launcher (Cmd+K / Ctrl+K). Built on `cmdk` — the
 * accessibility + fuzzy-search + keyboard navigation are baked in.
 * Commands are supplied as a flat array; a `group` on each entry folds
 * them into sectioned lists. For per-route scope, mount one palette at
 * app root and feed it a union of the static app commands and the
 * route-local commands that `useRegisterCommands` can accumulate.
 */
export default function CommandPalette({
  commands,
  open,
  onOpenChange,
  placeholder = "Type a command or search…",
  emptyMessage = "No results",
  triggerOnShortcut = true,
}: CommandPaletteProps) {
  useEffect(() => {
    if (!triggerOnShortcut) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenChange, open, triggerOnShortcut]);

  const grouped = groupBy(commands);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "96px 16px 16px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 12px 32px rgba(0,0,0,0.16)",
          overflow: "hidden",
          maxHeight: "60vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Command.Input
          placeholder={placeholder}
          style={{
            width: "100%",
            height: 48,
            fontSize: 16,
            padding: "0 16px",
            border: "none",
            outline: "none",
            borderBottom: "1px solid var(--color-border, #e5e5e5)",
          }}
        />
        <Command.List
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 0",
          }}
        >
          <Command.Empty
            style={{
              padding: "16px",
              color: "var(--color-text-secondary, #6E6E64)",
              fontSize: 14,
            }}
          >
            {emptyMessage}
          </Command.Empty>
          {grouped.map(([group, entries]) => (
            <Command.Group key={group ?? "_"} heading={group}>
              {entries.map((c) => (
                <Command.Item
                  key={c.id}
                  value={[c.label, ...(c.keywords ?? [])].join(" ")}
                  onSelect={() => {
                    c.onSelect();
                    onOpenChange(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  {c.icon ? <span style={{ display: "inline-flex", width: 20 }}>{c.icon}</span> : null}
                  <span style={{ flex: 1 }}>{c.label}</span>
                  {c.shortcut?.length ? (
                    <span style={{ display: "inline-flex", gap: 4 }}>
                      {c.shortcut.map((k) => (
                        <kbd
                          key={k}
                          style={{
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: "var(--color-fill-secondary, #f4f5f5)",
                            fontSize: 11,
                            fontFamily: "inherit",
                          }}
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  ) : null}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
