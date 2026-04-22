# Wave 5 · Plan 08 — globals.css cleanup + regression sweep + backlog close-out

**Status:** In progress
**Estimated effort:** M (~1–1.5h including Chrome MCP sweep)
**Recommended model:** Opus 4.7 (final regression check needs judgment on any delta)
**Thinking budget:** think hard
**Must run after:** Plans 00–07 all `Done`

## Why this plan exists

This is the final gate on the whole Wave 5 effort. By the time this plan runs:

- Every TSX file under `src/app/` + `src/components/` should be utility-class free (checked per-plan).
- Every `.stories.tsx` file should be utility-class free (Plan 07).
- `AiChatPanel.module.css` owns the `ai-*` styles (00-Prep).
- `ClientsPageClient.module.css` owns `hover-underline-on-row-hover` (03-Patient).

This plan:

1. Deletes the utility blocks from `globals.css`.
2. Runs the full Chrome MCP regression sweep across 18+ routes.
3. Promotes the utility-class ESLint rule from `warn` to `error`.
4. Closes audit backlog sessions 27 (Pass 1 re-run) and 28 (ESLint rule flip for inline styles) where the numbers now allow.
5. Flips audit session 29 to `done` if not already flipped during Plan 01.

## Tasks

### 1. Pre-deletion gate — all zero-checks must pass

Run the comprehensive pre-deletion grep. **Must return 0 lines**:

```bash
# 1. JSX className attribute references (page code + DS components)
grep -rn \
  'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-\|className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-text-tertiary\|className=.*text-text-inverted\|className=.*text-primary\b\|className=.*text-danger\b\|className=.*text-success\b\|className=.*text-warning\b\|className=.*border-border\|className=.*border-primary\|className=.*divide-border\|className=.*bg-primary\|className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bpt-[0-9]\|className=.*\bpb-[0-9]\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b\|className=.*\bmax-w-2xl\b\|className=.*\boverflow-hidden\b\|className=.*\boverflow-y-auto\b\|className=.*\bborder-b\b\|row-hover\|hover-underline-on-row-hover\|ai-typing-dot\|ai-chat-button-reset\|ai-chat-input-reset' \
  src/app src/components --include='*.tsx'

# 2. JS string references in DS component internals (e.g. colorPresets map in Text.tsx)
grep -rn \
  '"text-text-secondary"\|"text-text-tertiary"\|"text-text-inverted"\|"text-primary"\|"text-danger"\|"text-text"\b\|"text-body-\|"text-heading-\|"text-label-\|"text-caption-\|"text-display-' \
  src/components/ds --include='*.tsx' | grep -v stories | grep -v '\.stories\.'
```

**If ANY lines return from either grep, stop.** Go back to the appropriate Wave 5 plan and migrate the stragglers before continuing.

> **Note (2026-04-22):** The two non-className DS usages (`Text.tsx` colorPresets, `Stat.tsx` description paragraph) were fixed as part of the revised Plan 04 scope. The second grep above validates those remain clean.

### 2. Remove utility blocks from globals.css

Edit `src/app/globals.css`. Delete these sections entirely:

- `/* ── Typography utility classes ── */` block (all `.text-display-*` through `.text-metric-*`)
- `/* ── Color utility classes ── */` block (`.text-text`, `.text-text-*`, `.text-primary`, `.text-danger`, `.border-border`, `.border-primary`, `.divide-border`, `.bg-primary`)
- `/* ── Layout utility classes ── */` block (`.mb-*`, `.mt-*`, `.p-*`, `.pt-*`, `.pb-*`, `.flex-1`, `.shrink-0`, `.w-full`, `.max-w-2xl`, `.overflow-hidden`, `.overflow-y-auto`, `.border-b`, including the `!important` cascade fixes added in audit session 26b)
- `/* ── Structural utilities ── */` section (`.hover-underline-on-row-hover`, `tr.row-hover:hover`, any responsive replacement classes, `.overflow-x-auto-util`, `.ai-typing-dot`, `.ai-chat-button-reset`, `.ai-chat-input-reset`)

**Do NOT delete:**

- Font-face declarations (Sprig Sans)
- `:root {}` block with CSS variable tokens
- `body {}` reset and `*, *::before, *::after { box-sizing }` reset
- AntD-specific overrides (`.ant-table-thead`, `.ds-search-bar`, `.ant-tabs-tab`, etc.)

Verify globals.css is clean:

```bash
grep -n "\.text-body\|\.text-heading\|\.text-label\|\.mb-[0-9]\|\.mt-[0-9]\|\.p-[0-9]\|\.flex-1\|\.shrink-0\|\.w-full\|\.row-hover\|\.ai-typing-dot" \
  src/app/globals.css
```

Expected: 0 lines.

### 3. Build gate

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -10
```

Expected: build passes with no errors.

### 4. Chrome MCP full visual verification sweep

At 1440×900 on both tabs (`acme.splose.com` vs `localhost:3000`). Use the measurement snippets in [README.md § "Utility-class replacement reference"](README.md#utility-class-replacement-reference).

**Typography check — 6 routes:**

- `/` (dashboard)
- `/clients/[id]/details`
- `/invoices/[id]/view`
- `/settings/details`
- `/notes/[id]/edit`
- `/reports`

Thresholds: fontSize exact, fontWeight exact, color exact RGB, lineHeight ±1px.

**Spacing check — 4 routes:**

- `/`
- `/clients/[id]`
- `/settings/forms/[id]`
- `/notes/[id]/edit`

Threshold: ±2px on every margin / padding / gap.

**Color check — 3 routes:**

- `/clients/[id]/invoices` (table with secondary-text cells)
- `/invoices/[id]` (status colors)
- `/reports` (metric colors)

Threshold: exact RGB.

**Structural behaviour — 2 routes:**

- `/clients` — hover a table row, confirm background `rgb(249, 250, 251)` + client name underlines
- AI chat panel — open the assistant, confirm typing dots render as 8×8 grey circles (via `AiChatPanel.module.css`)

**Screenshot comparison — remaining routes:**

- `/calendar/week/22/4/2026`
- `/clients/[id]/appointments`
- `/invoices/new`
- `/invoices/batch-invoice/[id]`
- `/waitlist`
- `/products`
- `/payments/new`
- `/settings/data-import`
- `/settings/online-bookings/[id]`
- `/online-booking`
- `/contacts/[id]`

Full-page screenshot pair on each; note "Match" or list discrepancies.

**Record `.verification-evidence`:**

```
Phase: Wave 5 Plan 08 — full regression sweep post utility-class removal
Date: <date>
Viewport: 1440x900
Environment: localhost:3000 vs acme.splose.com

Typography check (6 routes): PASS / <list failures>
Spacing check (4 routes): PASS / <list failures>
Color check (3 routes): PASS / <list failures>
Structural behaviour (2 routes): PASS / <list failures>
Screenshot comparison (11 routes): PASS / <list discrepancies>

Total elements measured: <N>
Total properties compared: <N>
Failures resolved: <N>
Final verdict: PASS
```

### 5. Promote utility-class ESLint rule from warn to error

In `eslint.config.mjs`, flip the severity of the 3 utility-class rule entries added in 00-Prep from `"warn"` to `"error"`.

Verify:

```bash
npx eslint src/app src/components --ext .tsx --no-ignore 2>/dev/null \
  | grep -E "Use <Text\b|Replace spacing|Use <Text color" | wc -l
```

Expected: 0.

### 6. Audit backlog close-out

**Session 27 (Pass 1 re-run):**

Re-run the Pass 1 broadened-scope raw-style counts:

```bash
grep -rn 'style={{' src/app src/components --include='*.tsx' | grep -v stories | wc -l
```

Plan 08 completion should bring this total well below the session 27 target of 600. Re-check every Top-10 file from the 2026-04-22 baseline:

- DashboardClient.tsx
- invoices/[id]/page.tsx
- waitlist/page.tsx
- calendar/CalendarView.tsx
- notes/[id]/edit/page.tsx
- settings/online-bookings/[id]/page.tsx
- settings/details/page.tsx
- settings/forms/[id]/page.tsx
- settings/data-import/page.tsx
- reports/page.tsx
- InvoiceDetailClient.tsx

Target: each file drops ≥90% from baseline. Update `docs/ds-audit/pass1-raw-counts-2026-postbacklog.md` with the new counts. Flip session 27 `partial` → `done` if targets hit.

**Session 28 (ESLint `no-restricted-syntax` inline-style rule flip):**

The audit-28 rule is separate from the Wave 5 utility-class rule (audit-28 targets inline `style={{}}` patterns; Wave 5 targets utility classes). Re-count audit-28 warnings:

```bash
npx eslint src/app src/components --ext .tsx --no-ignore 2>/dev/null \
  | grep "no-restricted-syntax" | wc -l
```

If warnings <50, promote audit-28's rule from `warn` to `error` per that session's brief. Add per-file `eslint-disable-next-line no-restricted-syntax` with reason comments for legitimate exceptions (dynamic user colour, decorative gradient). Flip session 28 `blocked` → `done`.

If warnings still ≥50, flip to `partial` and note the residual count in the session log.

**Session 29 (scope-gap cleanup):**

If Plan 01 closed this already, confirm. Otherwise re-verify:

```bash
grep -c 'style={{' src/app/calendar/CalendarView.tsx
```

Target ≤15. If met, flip session 29 `partial` → `done`.

### 7. Commit

```bash
git add src/app/globals.css eslint.config.mjs docs/ds-audit-fix-backlog.md docs/ds-audit-session-log.md docs/ds-audit/pass1-raw-counts-2026-postbacklog.md .verification-evidence
git commit -m "ds-wave5(08): delete globals.css utility blocks + regression sweep + ESLint promote + audit backlog close-out

Utility classes removed from globals.css (typography/color/layout/structural).
Chrome MCP regression sweep passed across 18+ routes.
ESLint utility-class rules promoted warn → error.
Audit backlog sessions 27, 28, 29 flipped to done (or partial with residual noted)."
```

### 8. Status flip + session log

- Flip Plan 08 `Status:` to `Done`.
- Append one-line entry to `docs/ds-audit-session-log.md` summarising the regression sweep results + audit backlog state changes.

## Acceptance criteria

- [ ] Pre-deletion grep returns 0 lines.
- [ ] `globals.css` utility blocks deleted; grep on `globals.css` for utility-class selectors = 0.
- [ ] tsc 0 errors, `npx next build` passes.
- [ ] Chrome MCP sweep: 0 typography regressions (exact), 0 color regressions (exact RGB), 0 spacing regressions (±2px), 0 structural differences across 18+ routes.
- [ ] `.verification-evidence` written + auto-cleaned by post-commit hook.
- [ ] ESLint utility-class rules at severity=error with 0 violations.
- [ ] Audit session 27 flipped to `done` OR `partial` with explicit residual count.
- [ ] Audit session 28 flipped to `done` OR `partial` with explicit residual count.
- [ ] Audit session 29 flipped to `done` (should already have happened in Plan 01).
- [ ] Session log entry appended.

## Known pitfalls

- Don't delete CSS variable declarations (`:root { --color-* }`). Those are the tokens the replacement inline styles reference.
- AntD-specific overrides in globals.css are NOT utility classes — keep them all.
- If the Chrome MCP sweep finds ANY regression, fix it before committing the evidence. Fail fast here — don't ship a "passes mostly" plan.
- The layout cascade fix (`!important` on margin/padding utilities added in session 26b) becomes dead code after utility deletion — confirm it's inside one of the deleted blocks, not a standalone rule.

## Open questions

1. **Font-face declarations for Sprig Sans** — confirm these are still loaded correctly after `globals.css` shrinks. Visual regression would catch it (titles on detail pages use Sprig Sans via `page-title` variant).
2. **ESLint promotion of the Wave 5 rules and audit-28 rule on the same config edit** — clean if done together; slightly messy if done separately. Recommended: commit ESLint config changes as one atomic edit.
