# Section 4 — DS consolidation opportunities

Near-duplicate DS components that could collapse. All four candidates below are **low-risk** (zero or very low consumer counts). Priority proportional to (consumers_A + consumers_B) × overlap %.

Details come from Pass 3's full inventory at `docs/ds-audit/pass3-consolidation.md` — this section is the condensed report view.

---

## 4a — True component-pair consolidations

### Consolidation-1: `Section` → `Card` — **High priority**

**Shared primitive:** AntD Card (Section *wraps* Card internally).

**Prop overlap:** ~80% — Section adds `description` and renders a wider title style; Card has `title` + `headerBar` + `padding` + `shadow`.

**Render shape:**
- `Section`: renders `<Card>` with a custom header block using `<Text variant="label/lg" as="h3">` and an optional description
- `Card`: renders `<AntCard>` with AntD's default title or a custom headerBar

**Proposed merge:** absorb Section into Card by adding `description?: string`. When both `title` and `description` are present, render the Section-style header block.

```tsx
// After merge — Card picks up description:
<Card title="Business details" description="Configure location and currency." padding="md" shadow>
  …
</Card>
```

**Consumer counts:**
- `Card`: 25 (app) + several internal — unchanged
- `Section`: 0 (direct) + 0 (internal) — zero consumers

**Migration risk:** **Low** — no consumers to migrate. Delete Section.

**Priority:** **High** — zero-cost cleanup, reduces component count by one.

---

### Consolidation-2: `Status` → `ColorDot` — **High priority**

**Shared primitive:** visually equivalent (small coloured circle). Status uses AntD Badge for the dot, ColorDot uses a plain span.

**Prop overlap:** ~60% — both take a color; Status has semantic color enum (green/red/yellow/…) and an optional label.

**Render shape:**
- `Status`: `<Flex>` with dot + optional label
- `ColorDot`: standalone dot

**Proposed merge:** absorb Status into ColorDot by adding `label?: string`. Wrap in Flex when label present.

```tsx
// After merge — ColorDot picks up label:
<ColorDot color="green" label="Active" size="md" />
<ColorDot color="#b4eb64" size="sm" />
```

**Consumer counts:**
- `ColorDot`: 4 (app) — unchanged
- `Status`: 0 (app) — zero consumers

**Migration risk:** **Low** — no Status consumers. Delete Status.

**Priority:** **High** — zero-cost cleanup.

---

### Consolidation-3: `OnOffBadge` → `Text` — **Medium priority**

**Shared primitive:** both render coloured text.

**Prop overlap:** ~30% — OnOffBadge is essentially `<Text color={success|danger}>`. Text already has `color="success"` and `color="danger"` as first-class values.

**Render shape:**
- `OnOffBadge`: `<span style={{ color: success|error }}>{On|Off}</span>`
- `Text`: class-based color presets

**Proposed merge:** migrate OnOffBadge consumers to `<Text>` and delete OnOffBadge.

```tsx
// Before:
<OnOffBadge value={user.active} />

// After:
<Text as="span" variant="body/md" color={user.active ? "success" : "danger"}>
  {user.active ? "On" : "Off"}
</Text>
```

**Consumer counts:**
- `Text`: 16 direct app imports + heavy internal usage — unchanged
- `OnOffBadge`: 2 — migrate

**Migration risk:** **Low** — 2 callers, both trivial replacements.

**Priority:** **Medium** — two fewer components after cleanup.

---

### Consolidation-4: `IconText` — delete (dead code) — **High priority**

**Status:** 0 direct consumers, 0 internal consumers.

**What it does:** renders `<Flex align="center" gap={8} style={{ fontSize: 14, color: "var(--color-text-secondary)" }}><icon/><children/></Flex>`. Hard-coded to secondary tone + 14px.

**Recommendation:** **Delete** — if the icon+text row pattern returns, extract from a real use site rather than reviving this file.

**Migration risk:** none.

**Priority:** **High** — one fewer file.

---

## 4b — DS templates bypassing their own tokens (NEW FINDING, surfaced in Pass 2b)

This isn't strictly a component-pair consolidation, but it belongs in Section 4 because it's about **DS-internal consistency** — the templates themselves currently hard-code styles rather than flowing through DS components.

### `DetailPage` and `Navbar` hard-code a 30px / 700 / "Sprig Sans" / `rgb(66, 105, 74)` page title

**Sites:**
- `src/components/ds/DetailPage.tsx:45`
- `src/components/ds/Navbar.tsx:41`

**Current code:**
```tsx
<h1 style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Sprig Sans', 'Inter', sans-serif", lineHeight: 1.2, color: "rgb(66, 105, 74)" }}>
  {title}
</h1>
```

**Why it belongs here:** this *is* the canonical page title style. It should live in `<Text variant="page-title">` (see Section 3 Extend-2) and every page template should consume that variant. Currently both templates hard-code it, which means:
- Changing the page-title font/colour requires editing two DS files (not just Text)
- The `rgb(66, 105, 74)` green isn't a DS token — it's a literal in two places. If the token system ever picks up this colour, the templates will still drift.
- The `'Sprig Sans'` family should be a CSS variable, not inline.

**Recommended fix sequence:**
1. Add `heading/xl` and `page-title` variants to `Text` (Section 3 Extend-2)
2. Introduce a DS token for the green (e.g. `--color-page-title`) or confirm one already exists
3. Replace both DS templates' inline `<h1 style=…>` with `<Text variant="page-title">{title}</Text>`

**Priority:** **High** — structurally important even though the raw count is small. Unlocks coherent page-title handling across every DetailPage/Navbar consumer.

---

## Other observations (not consolidation candidates, but documented for the record)

From Pass 3 non-duplicate pairs:

- **`Navbar` vs `TopNav`** — naming collision only; different responsibilities. Consider renaming TopNav → `SiteHeader` in a future cleanup.
- **`Alert` vs `AlertCallout`** — similar purpose but different implementations (AntD wrapper vs custom div). Could unify long-term; not in scope for this audit.
- **`Modal` + `ReorderModal`** — ReorderModal depends on Modal; keep.
- **`Filter`, `DateRangeFilter`, `Dropdown`** — different widgets, different UX. Keep.
- **`SettingsListPage` + `ListPage`** — different levels of specialisation. Could refactor SettingsListPage to compose ListPage, but not urgent.

---

## Summary

| # | Action | Components | Priority |
|---|---|---|---|
| 1 | Fold Section into Card (add `description`) | Section → Card | **High** |
| 2 | Fold Status into ColorDot (add `label`) | Status → ColorDot | **High** |
| 3 | Migrate OnOffBadge usages to Text | OnOffBadge → Text | Medium |
| 4 | Delete dead IconText | IconText | **High** |
| 5 | Replace DS template hard-coded `<h1>` with `<Text variant="page-title">` | DetailPage + Navbar | **High** |

**Net: 49 → 45 DS components**, plus a major consistency win via item 5.

All items are low-risk (zero or very low consumer counts).
