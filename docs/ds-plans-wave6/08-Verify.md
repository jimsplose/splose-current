# Wave 6 · Plan 08 — Verify: re-run pass1 + update audit docs

**Status:** Planned
**Estimated effort:** 20 min
**Model:** Sonnet
**Thinking:** think
**Must run after:** Plans 00–07

## What this plan does

Re-runs the Pass 1 audit to measure actual inline-style reduction from Wave 6, updates the audit tracking documents, and determines whether a Wave 7 is warranted.

## Steps

### 1. Re-run the raw style={{ count

```bash
find src/app src/components -name '*.tsx' \
  -not -path '*/ds/*' -not -path '*/DevNavigator/*' -not -path '*/stories/*' \
  | xargs grep -c 'style={{' 2>/dev/null \
  | grep -v ':0$' \
  | sort -t: -k2 -rn
```

Record:
- Total count
- Top 20 files
- Count vs Wave 6 baseline (1,797)
- Count vs original audit baseline (1,422)

### 2. Run ESLint to confirm 0 utility-class violations

```bash
npx eslint src/ --max-warnings=0 2>&1 | tail -5
```

Should still be 0.

### 3. Update `docs/ds-audit/pass1-raw-counts-2026-postbacklog.md`

Add a `post-Wave6` column to the totals table and Top 20 table.

### 4. Update `docs/ds-audit-fix-backlog.md`

- Session 27: update status note with new raw count
- Add Wave 6 summary entry

### 5. Append to `docs/ds-audit-session-log.md`

One row per plan (W6-00 through W6-07) following the existing format. Then one W6-VERIFY row.

### 6. Determine Wave 7 threshold

| Result | Action |
|---|---|
| Total ≤ 1,000 | Wave 6 goal met. Stop or plan selective Wave 7 only for files still > 20 inlines. |
| Total 1,000–1,200 | Partial success. Identify remaining high-count files, create targeted follow-up sessions. |
| Total > 1,200 | Review what was skipped in plans 03–07; create Wave 7 for the unfinished surfaces. |

### 7. Categorize remaining inlines as legitimate

Run a grep to count inlines tagged with `// ds-exempt`:

```bash
grep -rn '// ds-exempt' src/app src/components --include='*.tsx' | wc -l
```

The goal: every remaining inline that isn't a simple one-off layout value should have a `// ds-exempt: <reason>` comment. This makes the floor explicit.

## Acceptance criteria

- [ ] `docs/ds-audit/pass1-raw-counts-2026-postbacklog.md` has post-Wave6 column
- [ ] Total raw `style={{` count ≤ 1,000 (Wave 6 goal)
- [ ] ESLint utility-class violations: 0
- [ ] Session log updated with W6-00 through W6-08 entries
- [ ] Decision on Wave 7 documented

## Open questions

- If the total is between 1,000–1,200, what surfaces should Wave 7 prioritize? Use the top-20 file list from this verify run to decide.
