# Wave 6 DS Migration Plans

**Goal:** Reduce raw `style={{}}` count from **1,797** to ≤ **1,000** across `src/app` + `src/components` (excl. DS, DevNavigator, stories).

**Approach — NO Tailwind:**
- CSS Modules (`.module.css`) for repeated layout patterns within a file
- DS component extensions (add props to existing components)
- New DS components for cross-file patterns (FormLabel, InlineLink)
- Inline `style={{}}` only for truly unique one-offs (dynamic user colors, `calc()`, chart art)

**Why not Tailwind?** The codebase doesn't have a Tailwind build pipeline — the globals.css utilities added in session 26b are hand-written CSS, not JIT-generated. Continuing down that path means hand-maintaining an ever-growing utility set. CSS Modules give the same co-location benefit with proper scoping and no maintenance burden.

---

## Phase ordering

```
00 → 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08
```

- **00** must run first — it adds the Text `mb` prop and page-level CSS module infrastructure patterns that later plans depend on.
- **01–06** can run in any order once 00 is done. Recommended order: 01 (biggest bang — 150 icon inlines), then 02 (FormLabel new component), then files by count descending.
- **07** sweeps remaining mid-count files (20–40 inlines each), after 01–06 clean the top tier.
- **08** re-runs the pass1 audit and closes the backlog. Must run last.

---

## Remaining inline style inventory (as of 2026-04-23)

| Category | Count | Strategy |
|---|---|---|
| AntD icon inlines (`<XxxOutlined style={{...}}>`) | ~150 | → `<Icon as={X} size="..." tone="...">` |
| `<label style={{...}}>` | ~27 | → new `<FormLabel>` DS component |
| `<Text ... style={{ marginBottom/marginTop: N }}>` | ~126 | → add `mb` / `mt` props to Text; CSS module classes for page-level spacing |
| `<span/p style={{ color: var(--color-text-secondary) }}>` | ~20 | → `<Text color="secondary">` |
| Page structural layout (page wrapper, section shells) | ~200 | → CSS modules per file |
| Decorative / chart art / dynamic user colors | ~300 | → legitimately stays inline |
| Unique one-offs (calc(), gradient, box-shadow) | ~200 | → legitimately stays inline |
| **Total** | **1,797** | **Target: ≤1,000** |

---

## Utility-class ESLint (post-Wave-5)

The `no-restricted-syntax` rule is now at **error** severity. Any new `className="mb-4"` on page files causes a build error. Plans 00–07 must produce 0 ESLint errors.

---

## Plans

| Plan | Title | Est. effort | Surfaces | Key DS work |
|---|---|---|---|---|
| 00 | **Infra: Text mb/mt props + CSS module patterns** | 20 min | DS Text component, 6 existing module files | Extend Text; establish pattern |
| 01 | **Icon sweep: remaining 150 AntD icon inlines** | 45 min | 15 files (waitlist, online-booking, contacts, invoices, payments, …) | Use `<Icon>` DS |
| 02 | **FormLabel: new DS component + 27 callers** | 30 min | settings/details, forms/[id], online-bookings, custom-fields | New FormLabel DS |
| 03 | **DashboardClient deep-clean** | 40 min | DashboardClient.tsx (84 inlines) | CSS module + Text + Icon |
| 04 | **Invoice pages deep-clean** | 45 min | invoices/[id]/page.tsx (67) + InvoiceDetailClient.tsx (55) | CSS module + Text |
| 05 | **Settings high-count pages** | 45 min | data-import (59) + online-bookings/[id] (57) + settings/details (52) | CSS module + FormLabel + Icon |
| 06 | **Notes + Waitlist deep-clean** | 40 min | notes/[id]/edit (47) + waitlist (53) + forms/[id] (45) | CSS module + Icon |
| 07 | **Mid-count sweep (20–44 inline files)** | 45 min | UserDetailClient, ai, reports, progress-notes, SendNoteModal, payments/new, … | Icon + Text + CSS module |
| 08 | **Verify: re-run pass1 + close backlog** | 20 min | Audit docs only | — |

---

## Per-plan status (run `grep -H "^\*\*Status:"` to check)

```bash
grep -H "^\*\*Status:\*\*" docs/ds-plans-wave6/*.md
```

---

## CSS Module pattern (canonical)

When converting page-level structural layout to a CSS module, use this pattern:

```css
/* ExamplePage.module.css */
.shell {
  min-height: calc(100vh - 3rem);
  background: var(--color-bg-layout);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  background: white;
  padding: 12px 24px;
}

.body {
  padding: 32px;
  max-width: 896px;
  margin: 0 auto;
}
```

Usage:
```tsx
import styles from './ExamplePage.module.css';
// ...
<div className={styles.shell}>
  <div className={styles.header}>...</div>
  <div className={styles.body}>...</div>
</div>
```

**Rule:** Only create CSS module classes for patterns that appear ≥2 times in the same file, OR that define the structural shell of the page. Single-use one-offs stay inline.

---

## DS component extensions needed (before or during plans)

| Component | Extension | Needed by plan |
|---|---|---|
| `Text` | Add `mb?: number` and `mt?: number` props (applied as `style.marginBottom/Top`) | 00 |
| (new) `FormLabel` | `label: string`, `required?: boolean`, `hint?: string`, `as?: "label" \| "div"` | 02 |
| `Icon` | Already complete — just migrate callers | 01 |
| `Button` | Nothing new needed | — |

---

## Commit discipline

One commit per plan. Within a plan, one commit per "surface" (one file or tightly related file group). Exception: plan 01 (icon sweep) may batch by file group (waitlist + online-booking in one commit, payments files in another).

---

## Supersedes

This wave extends the audit backlog cleanup started in Wave 5. The session 27 raw-count target (≤600) is not the target here — that target was set before the class→inline conversion inflated the count. The Wave 6 target is ≤1,000, which is achievable by removing the structural patterns above while leaving decorative/dynamic inlines in place.
