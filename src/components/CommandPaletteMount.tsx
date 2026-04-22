"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CommandPalette } from "@/components/ds";
import type { CommandEntry } from "@/components/ds/CommandPalette";
import { globalCommandDefs, buildCommands } from "@/commands";
import { CommandRegistryCtx } from "@/hooks/useRegisterCommands";

/**
 * Mounts the CommandPalette once at the root layout.
 * - Owns open/close state
 * - Provides CommandRegistryCtx so per-route hooks can push commands in
 * - Cmd+K / Ctrl+K binding is handled inside <CommandPalette triggerOnShortcut>
 */
export default function CommandPaletteMount() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [routeCommands, setRouteCommands] = useState<CommandEntry[]>([]);

  const navigate = useCallback((href: string) => {
    setOpen(false);
    router.push(href);
  }, [router]);

  const register = useCallback((commands: CommandEntry[]) => {
    setRouteCommands((prev) => {
      const ids = new Set(commands.map((c) => c.id));
      return [...prev.filter((c) => !ids.has(c.id)), ...commands];
    });
  }, []);

  const unregister = useCallback((ids: string[]) => {
    const set = new Set(ids);
    setRouteCommands((prev) => prev.filter((c) => !set.has(c.id)));
  }, []);

  const commands = useMemo(
    () => buildCommands(globalCommandDefs, navigate, routeCommands),
    [navigate, routeCommands],
  );

  return (
    <CommandRegistryCtx.Provider value={{ register, unregister }}>
      <CommandPalette
        commands={commands}
        open={open}
        onOpenChange={setOpen}
        triggerOnShortcut
        placeholder="Search commands, navigate, create…"
        emptyMessage="No commands found"
      />
    </CommandRegistryCtx.Provider>
  );
}
