"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  stateRegistry,
  flattenRegistry,
  getVariantUrl,
  countVariants,
} from "@/lib/state-registry";
import type { PageEntry, StateVariant } from "@/lib/state-registry";
import { ChevronRight, ChevronDown, Search, X } from "lucide-react";

export default function DevNavigator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Hide completely if ?devnav=0
  if (searchParams.get("devnav") === "0") return null;

  // Don't render on login page
  if (pathname === "/login") return null;

  const { pages, variants } = countVariants();

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "N") {
        e.preventDefault();
        setExpanded((prev) => !prev);
      }
      if (e.key === "Escape" && expanded) {
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expanded]);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  // Group pages by their group field
  const groups = useMemo(() => {
    const map = new Map<string, PageEntry[]>();
    for (const entry of stateRegistry) {
      const group = entry.group || "Other";
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(entry);
    }
    return map;
  }, []);

  // Filter by search
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    const filtered = new Map<string, PageEntry[]>();
    for (const [group, entries] of groups) {
      const matching = entries.filter((e) => {
        const flat = [e, ...flattenRegistry(e.children || [])];
        return flat.some(
          (p) =>
            p.label.toLowerCase().includes(q) ||
            p.path.toLowerCase().includes(q) ||
            p.variants.some((v) => v.label.toLowerCase().includes(q))
        );
      });
      if (matching.length > 0) filtered.set(group, matching);
    }
    return filtered;
  }, [search, groups]);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-gray-900/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg hover:bg-gray-900 backdrop-blur-sm transition-all"
        title="Dev Navigator (Ctrl+Shift+N)"
      >
        &#9670; Nav
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-[70vh] rounded-lg bg-gray-900/95 text-white shadow-2xl backdrop-blur-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Dev Navigator</span>
          <span className="rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-medium">
            {pages} pages / {variants} variants
          </span>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="rounded p-1 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-white/10">
        <div className="flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1.5">
          <Search className="h-3.5 w-3.5 text-white/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-white/40 outline-none"
            autoFocus
          />
        </div>
      </div>

      {/* Page tree */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {Array.from(filteredGroups).map(([group, entries]) => (
          <div key={group} className="mb-1">
            <button
              onClick={() => toggleGroup(group)}
              className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white/50 hover:text-white/80 hover:bg-white/5"
            >
              {expandedGroups.has(group) ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              {group}
              <span className="text-[9px] font-normal text-white/30 ml-auto">
                {entries.length}
              </span>
            </button>

            {expandedGroups.has(group) && (
              <div className="ml-2 space-y-0.5">
                {entries.map((entry) => (
                  <PageNode
                    key={entry.path}
                    entry={entry}
                    pathname={pathname}
                    depth={0}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-2">
        <span className="text-[10px] text-white/40">
          {pages} pages, {variants} variants
        </span>
        <button
          onClick={() => setExpanded(false)}
          className="text-[10px] text-white/50 hover:text-white"
        >
          Hide
        </button>
      </div>
    </div>
  );
}

function PageNode({
  entry,
  pathname,
  depth,
}: {
  entry: PageEntry;
  pathname: string;
  depth: number;
}) {
  const [open, setOpen] = useState(false);
  const resolvedPath = entry.resolvedPath || entry.path;
  const isCurrentPage =
    pathname === resolvedPath ||
    pathname.startsWith(resolvedPath + "/");
  const hasChildren =
    (entry.children && entry.children.length > 0) ||
    entry.variants.length > 1;

  return (
    <div style={{ marginLeft: depth * 8 }}>
      <div className="flex items-center gap-1">
        {hasChildren ? (
          <button
            onClick={() => setOpen(!open)}
            className="rounded p-0.5 hover:bg-white/10"
          >
            {open ? (
              <ChevronDown className="h-3 w-3 text-white/40" />
            ) : (
              <ChevronRight className="h-3 w-3 text-white/40" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <Link
          href={resolvedPath}
          className={`flex-1 rounded px-1.5 py-0.5 text-xs transition-colors ${
            isCurrentPage
              ? "bg-primary/30 text-primary-light font-medium"
              : "text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          {entry.label}
        </Link>
      </div>

      {open && (
        <div className="ml-4 mt-0.5 space-y-0.5">
          {/* Variants */}
          {entry.variants.length > 1 &&
            entry.variants.map((v) => (
              <VariantLink
                key={v.id}
                page={entry}
                variant={v}
                pathname={pathname}
              />
            ))}

          {/* Children */}
          {entry.children?.map((child) => (
            <PageNode
              key={child.path}
              entry={child}
              pathname={pathname}
              depth={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VariantLink({
  page,
  variant,
  pathname,
}: {
  page: PageEntry;
  variant: StateVariant;
  pathname: string;
}) {
  const url = getVariantUrl(page, variant);
  const isActive = pathname === url || pathname + "?state=" + variant.id === url;

  const matchDot = variant.match
    ? {
        yes: "bg-green-400",
        partial: "bg-yellow-400",
        no: "bg-red-400",
        unknown: "bg-gray-400",
      }[variant.match]
    : null;

  return (
    <Link
      href={url}
      className={`flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] transition-colors ${
        isActive
          ? "bg-primary/20 text-primary-light"
          : "text-white/50 hover:text-white/80 hover:bg-white/5"
      }`}
    >
      {matchDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${matchDot}`} />
      )}
      {variant.label}
    </Link>
  );
}
