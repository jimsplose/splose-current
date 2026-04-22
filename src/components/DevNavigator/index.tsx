"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { stateRegistry, flattenRegistry, getVariantUrl, countVariants } from "@/lib/state-registry";
import type { PageEntry, StateVariant } from "@/lib/state-registry";
import { RightOutlined, DownOutlined, SearchOutlined, CloseOutlined } from "@ant-design/icons";
import Bugshot from "./Bugshot";
import styles from "./DevNavigator.module.css";

export default function DevNavigator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [bugshotActive, setBugshotActive] = useState(false);
  const devNavRef = useRef<HTMLDivElement>(null);

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
            p.variants.some((v) => v.label.toLowerCase().includes(q)),
        );
      });
      if (matching.length > 0) filtered.set(group, matching);
    }
    return filtered;
  }, [search, groups]);

  return (
    <div ref={devNavRef}>
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className={styles.toggleBtn}
          style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67 }}
          title="Dev Navigator (Ctrl+Shift+N)"
        >
          &#9670; Nav
        </button>
      ) : (
        <div className={styles.panel}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57 }}>Dev Navigator</span>
              <span className={styles.headerBadge} style={{ fontSize: 11, lineHeight: 1.5 }}>
                {pages} pages / {variants} variants
              </span>
            </div>
            <button onClick={() => setExpanded(false)} className={styles.closeBtn}>
              <CloseOutlined style={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Search */}
          <div className={styles.searchWrapper}>
            <div className={styles.searchBox}>
              <SearchOutlined style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pages..."
                className={styles.searchInput}
                style={{ fontSize: 12, lineHeight: 1.67 }}
                autoFocus
              />
            </div>
          </div>

          {/* Page tree */}
          <div className={styles.pageTree}>
            {Array.from(filteredGroups).map(([group, entries]) => (
              <div key={group} className={styles.groupWrapper}>
                <button
                  onClick={() => toggleGroup(group)}
                  className={styles.groupBtn}
                  style={{ fontSize: 11, lineHeight: 1.5 }}
                >
                  {expandedGroups.has(group) ? <DownOutlined style={{ fontSize: 12 }} /> : <RightOutlined style={{ fontSize: 12 }} />}
                  {group}
                  <span className={styles.groupCount} style={{ fontSize: 11, lineHeight: 1.5 }}>{entries.length}</span>
                </button>

                {expandedGroups.has(group) && (
                  <div className={styles.groupChildren}>
                    {entries.map((entry) => (
                      <PageNode key={entry.path} entry={entry} pathname={pathname} depth={0} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className={styles.quickLinks}>
            <a href="/storybook/index.html" target="_blank" rel="noopener" className={styles.quickLink} style={{ fontSize: 11, lineHeight: 1.5 }}>
              Storybook ↗
            </a>
            <button
              onClick={() => {
                setBugshotActive(true);
                setExpanded(false);
              }}
              className={styles.quickLink}
              style={{ fontSize: 11, lineHeight: 1.5 }}
            >
              Bugshot
            </button>
            <span className={styles.quickLinkCount} style={{ fontSize: 11, lineHeight: 1.5 }}>
              {pages}p / {variants}v
            </span>
            <button onClick={() => setExpanded(false)} className={styles.hideBtn} style={{ fontSize: 11, lineHeight: 1.5 }}>
              Hide
            </button>
          </div>
        </div>
      )}
      {bugshotActive && <Bugshot onClose={() => setBugshotActive(false)} devNavRef={devNavRef} />}
    </div>
  );
}

function PageNode({ entry, pathname, depth }: { entry: PageEntry; pathname: string; depth: number }) {
  const [open, setOpen] = useState(false);
  const resolvedPath = entry.resolvedPath || entry.path;
  const isCurrentPage = pathname === resolvedPath || pathname.startsWith(resolvedPath + "/");
  const hasChildren = (entry.children && entry.children.length > 0) || entry.variants.length > 1;

  return (
    <div style={{ marginLeft: depth * 8 }}>
      <div className={styles.pageNodeRow}>
        {hasChildren ? (
          <button onClick={() => setOpen(!open)} className={styles.expandBtn}>
            {open ? (
              <DownOutlined style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }} />
            ) : (
              <RightOutlined style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }} />
            )}
          </button>
        ) : (
          <span className={styles.spacer} />
        )}
        <Link
          href={resolvedPath}
          className={`${styles.pageLink} ${isCurrentPage ? styles.pageLinkActive : ""}`}
        >
          {entry.label}
        </Link>
      </div>

      {open && (
        <div className={styles.pageNodeChildren}>
          {/* Variants */}
          {entry.variants.length > 1 &&
            entry.variants.map((v) => <VariantLink key={v.id} page={entry} variant={v} pathname={pathname} />)}

          {/* Children */}
          {entry.children?.map((child) => (
            <PageNode key={child.path} entry={child} pathname={pathname} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}

function VariantLink({ page, variant, pathname }: { page: PageEntry; variant: StateVariant; pathname: string }) {
  const url = getVariantUrl(page, variant);
  const isActive = pathname === url || pathname + "?state=" + variant.id === url;

  const matchDotClass = variant.match
    ? {
        yes: styles.matchGreen,
        partial: styles.matchYellow,
        no: styles.matchRed,
        unknown: styles.matchGray,
      }[variant.match]
    : null;

  return (
    <Link
      href={url}
      className={`${styles.variantLink} ${isActive ? styles.variantLinkActive : ""}`}
      style={{ fontSize: 11, lineHeight: 1.5 }}
    >
      {matchDotClass && <span className={`${styles.matchDot} ${matchDotClass}`} />}
      {variant.label}
    </Link>
  );
}
