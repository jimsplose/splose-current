"use client";

import { useEffect, useContext, createContext, useCallback } from "react";
import type { CommandEntry } from "@/components/ds/CommandPalette";

/**
 * Context shape exposed to `useRegisterCommands` consumers.
 * Populated by CommandPaletteMount.
 */
export interface CommandRegistryContext {
  register: (commands: CommandEntry[]) => void;
  unregister: (ids: string[]) => void;
}

export const CommandRegistryCtx = createContext<CommandRegistryContext>({
  register: () => {},
  unregister: () => {},
});

/**
 * Per-route hook: push commands into the global palette while the route is
 * mounted and remove them on unmount.
 *
 * @example
 * useRegisterCommands([
 *   { id: "client-new-note", label: "New note", group: "Actions", onSelect: () => router.push("/notes/new") },
 * ]);
 */
export function useRegisterCommands(commands: CommandEntry[]) {
  const { register, unregister } = useContext(CommandRegistryCtx);

  // Stable serialised key so the effect only fires when commands actually change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ids = commands.map((c) => c.id);

  const stableRegister = useCallback(() => register(commands), [register, ...ids]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    stableRegister();
    return () => unregister(ids);
  }, [stableRegister, unregister, ...ids]); // eslint-disable-line react-hooks/exhaustive-deps
}
