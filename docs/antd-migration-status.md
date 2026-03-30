# Ant Design Migration — Status Tracker

**Last updated:** 2026-03-30
**Branch:** `antd-migration`
**Safety net:** `tailwind-archive`

---

## Phase Overview

| Phase | Plan | Status | Tasks | Notes |
|-------|------|--------|-------|-------|
| 1. Foundation | `docs/superpowers/plans/2026-03-30-antd-migration-phase1-foundation.md` | **Done** | 8/8 | Install antd, theme, ThemeProvider, ESLint |
| 2. DS Components | `docs/superpowers/plans/2026-03-30-antd-migration-phase2-ds-components.md` | **Done** | 31/31 | Rewrite 43 components |
| 3. Page Migration | `docs/superpowers/plans/2026-03-30-antd-migration-phase3-page-migration.md` | Not started | 0/19 | Migrate 96 pages, icons, Tailwind removal |
| 4. Cleanup | `docs/superpowers/plans/2026-03-30-antd-migration-phase4-cleanup.md` | Not started | 0/10 | Uninstall Tailwind/Lucide, final audit |

## Current Phase Detail

### Phase 1: Foundation — COMPLETE

**Started:** 2026-03-30
**Completed:** 2026-03-30

| Task | Status | Notes |
|------|--------|-------|
| 1. Create branches | Done | `tailwind-archive` + `antd-migration` created |
| 2. Install dependencies | Done | antd, @ant-design/icons, @ant-design/nextjs-registry |
| 3. Create theme.ts | Done | All confirmed colour tokens from reference doc |
| 4. Create ThemeProvider.tsx | Done | Wraps ConfigProvider, exported from ds/ |
| 5. Wire into layout.tsx | Done | AntdRegistry > ThemeProvider > app content |
| 6. ESLint no-restricted-imports | Done | Bans direct antd imports outside ds/ |
| 7. Storybook ThemeProvider | Done | preview.tsx with ConfigProvider decorator |
| 8. Verify + push | Done | tsc clean, build passes, pushed |

**Next up:** Phase 3 — Page Migration (19 tasks, 96 pages)

### Phase 2: DS Components — COMPLETE

**Started:** 2026-03-30
**Completed:** 2026-03-30

| Task | Status | Notes |
|------|--------|-------|
| 1. Simple wrappers (Spinner, Avatar, Checkbox, RadioGroup, Collapse) | Done | AntD Spin, Avatar, Checkbox, Radio.Group, Collapse |
| 2. Button | Done | 7-variant mapping to AntD Button types |
| 3. Badge → AntD Tag | Done | statusVariant() preserved |
| 4. Alert | Done | AntD Alert wrapper |
| 5. Card | Done | AntD Card with headerBar support |
| 6. Toggle → AntD Switch | Done | |
| 7. Modal → AntD Modal | Done | maxWidth → width mapping |
| 8-10. Form components | Done | FormInput, FormSelect (breaking onChange), FormTextarea |
| 11-12. Select, AsyncSelect | Done | AntD Select with search/async |
| 13. Dropdown | Done | AntD Dropdown, DropdownTriggerButton→EllipsisOutlined |
| 14. Tab → AntD Tabs | Done | Link mode + controlled mode |
| 15-16. SearchBar, Pagination | Done | Input.Search, AntD Pagination |
| 17-18. List, Stat | Done | AntD List, Statistic |
| 19-20. DateRangeFilter, Filter | Done | RangePicker, Segmented |
| 21. DataTable (major) | Done | Dual-mode: legacy children + new columns API |
| 22. Text | Done | CSS Modules, Sprig Sans for display/metric |
| 23. Custom display (7 components) | Done | ColorDot, Chip, OnOffBadge, Status, HintIcon, IconText, EmptyState |
| 24. Custom form (2 components) | Done | FileUpload, FormColorPicker with AntD ColorPicker |
| 25. Layout (5 components) | Done | PageHeader, Navbar, TopNav, SideNav, SettingsListPage — CSS Modules |
| 26. Modal components | Done | EmailPreview, ReorderModal with HolderOutlined |
| 27. RichTextEditor | Done | All icons → @ant-design/icons, CSS Module |
| 28. Cleanup | Done | portable/ deleted, usePagination deprecated |
| 29. Barrel export | Done | DataTableColumn, DataTableProps types added |
| 30. Storybook stories | Done | All 11 story files migrated from lucide-react |
| 31. Build verification | Done | tsc clean, build passes, zero lucide in DS |

## Key References

| Doc | Purpose |
|-----|---------|
| `docs/superpowers/specs/2026-03-30-antd-migration-design.md` | Design spec (decisions, architecture, component mapping) |
| `docs/superpowers/specs/2026-03-30-colour-tokens-reference.md` | Canonical colour values — supersedes design spec colours |

## Session Log

<!-- Each session that works on the migration adds a line here -->

| Date | Session | Phase | Work done |
|------|---------|-------|-----------|
| 2026-03-30 | Brainstorming | — | Design spec, colour tokens, all 4 phase plans written |
| 2026-03-30 | Phase 1 execution | 1 | All 8 tasks complete — antd installed, theme.ts, ThemeProvider, layout wired, ESLint, Storybook |
| 2026-03-30 | Phase 2 execution | 2 | All 31 tasks complete — 43 DS components rewritten to AntD, zero lucide-react in ds/, build passes |

## Instructions for Sessions

1. Read this file first to know where things stand
2. Read the plan for the current phase
3. Update this file when you complete tasks or finish a session
4. Update the Phase Overview table task counts as you go
5. Add a row to the Session Log before signing off
