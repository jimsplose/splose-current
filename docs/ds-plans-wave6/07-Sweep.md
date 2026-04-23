# Wave 6 · Plan 07 — Mid-count sweep (20–44 inline files)

**Status:** Planned
**Estimated effort:** 45 min
**Model:** Sonnet
**Thinking:** think
**Must run after:** Plans 00, 01

> **Architecture update (2026-04-23):** DS Button/Icon/Tag/FormLabel/DataTable/PhoneInput wrappers are all removed. Button: `variant="primary"` → `type="primary"` etc. directly on AntD Button. Icon: `style={{fontSize: N, color: token.colorXxx}}` directly. Td/Th deprecated sub-components: migrate to AntD Table `columns[].render()` pattern. Any `<FormLabel>` remaining in sweep files → `<Form.Item label="...">`. The `// ds-exempt` comment system still applies for chart art and decorative inlines.

## Current state (after plans 01+02 run, estimated residuals)

| File | Current | After 01+02 est. | Target |
|---|---|---|---|
| `src/app/settings/users/[id]/page.tsx` | 44 | ~40 | ≤ 15 |
| `src/app/settings/ai/page.tsx` | 43 | ~40 | ≤ 15 |
| `src/app/reports/page.tsx` | 41 | ~38 | ≤ 15 |
| `src/app/reports/progress-notes/page.tsx` | 38 | ~32 | ≤ 12 |
| `src/app/products/page.tsx` | 35 | ~30 | ≤ 10 |
| `src/app/notes/[id]/page.tsx` | 35 | ~32 | ≤ 12 |
| `src/app/notes/[id]/SendNoteModal.tsx` | 35 | ~32 | ≤ 12 |
| `src/app/invoices/new/page.tsx` | 35 | ~30 | ≤ 12 |
| `src/app/clients/[id]/appointments/AppointmentSidePanel.tsx` | 35 | ~30 | ≤ 12 |
| `src/app/payments/new/page.tsx` | 34 | ~30 | ≤ 12 |
| `src/app/settings/invoice-settings/page.tsx` | 31 | ~28 | ≤ 10 |
| `src/app/online-booking/page.tsx` | 31 | ~16 (15 icons!) | ≤ 8 |
| `src/app/contacts/[id]/page.tsx` | 28 | ~23 | ≤ 10 |
| `src/app/reports/ndis-bulk-upload/new/page.tsx` | 27 | ~22 | ≤ 10 |
| `src/components/AiChatPanel.tsx` | 26 | ~22 | ≤ 10 |
| `src/app/settings/sms-settings/page.tsx` | 26 | ~24 | ≤ 10 |
| `src/app/settings/custom-fields/page.tsx` | 26 | ~22 | ≤ 8 |
| `src/app/settings/services/edit/[id]/EditServiceClient.tsx` | 24 | ~22 | ≤ 8 |
| `src/app/settings/data-import/csv/page.tsx` | 21 | ~18 | ≤ 8 |

## Strategy

This is a sweep plan — batch many files using the same three techniques:

1. **Text mb/mt props** — for `<Text style={{ marginBottom/Top: N }}>` (plan 00 added these)
2. **`<Text color="secondary">` for span/p color secondary** — purely mechanical
3. **CSS module for page structural shell** — each file gets a module class for its outermost wrappers

## Files grouped by effort

### Group A — High value, quick wins (mostly icon + Text spacing)

- `online-booking/page.tsx`: After plan 01 removes 15 icons, only ~16 remain. Apply Text mb/mt to get to ≤8.
- `products/page.tsx`: Existing `products.module.css`; add structural classes. Apply Text mb/mt.
- `settings/custom-fields/page.tsx`: After FormLabel (plan 02) removes 2 labels + plan 01 removes 4 icons → ~20 remain. CSS module.

### Group B — Medium effort

- `settings/ai/page.tsx`: Has a unique AI-block layout. Add `ai.module.css` or extend existing. Text mb/mt.
- `reports/page.tsx`: Existing shell layout (already partially done). Reports.module.css. Text mb/mt for section headers.
- `settings/sms-settings/page.tsx`: Form structure. Add `sms-settings.module.css`. Text mb/mt.
- `settings/invoice-settings/page.tsx`: Form structure. CSS module + Text mb/mt.
- `contacts/[id]/page.tsx`: Contact detail layout. CSS module + Text mb/mt.
- `payments/new/page.tsx`: Payment form. CSS module + FormLabel + Text mb/mt.
- `invoices/new/page.tsx`: Already DataTable. Remaining inlines are mostly layout wrappers. CSS module.

### Group C — Complex (defer if over time)

- `settings/users/[id]/page.tsx`: User detail with permissions matrix — complex layout.
- `AppointmentSidePanel.tsx`: Rich appointment editing UI — many dynamic values.
- `notes/[id]/page.tsx`: Note view page — some decorative elements.
- `notes/[id]/SendNoteModal.tsx`: Modal — tight layout constraints.
- `AiChatPanel.tsx` (component, not page): Has CSS module already (AiChatPanel.module.css). Extend it.
- `reports/progress-notes/page.tsx`: Table-heavy page.
- `ndis-bulk-upload/new/page.tsx`: Multi-step form.
- `EditServiceClient.tsx`: Service editing form.
- `settings/data-import/csv/page.tsx`: CSV preview.
- `reports/progress-notes/page.tsx`: Table.

## CSS modules to create

For files without existing modules:
- `src/app/settings/ai/SettingsAi.module.css`
- `src/app/reports/Reports.module.css` (scaffolded in plan 00)
- `src/app/settings/sms-settings/SmsSettings.module.css`
- `src/app/settings/invoice-settings/InvoiceSettings.module.css`
- `src/app/contacts/[id]/ContactDetail.module.css`
- `src/app/payments/new/PaymentsNew.module.css`
- `src/app/invoices/new/InvoicesNew.module.css`
- `src/app/settings/custom-fields/CustomFields.module.css`
- `src/app/notes/[id]/NoteView.module.css`
- `src/app/notes/[id]/SendNoteModal.module.css`

## Chrome MCP verification

Spot-check 5 representative pages (1 from each group):
- `/online-booking` (group A — icon-heavy)
- `/reports` (group B — section headers)
- `/payments/new` (group B — form)
- `/settings/ai` (group B — AI blocks)
- `/contacts/1` (group C)

## Acceptance criteria

- [ ] All 19 files in the sweep have `grep -c 'style={{' <file>` at their target or below
- [ ] New CSS module files created (or existing ones extended) for each file
- [ ] `grep -rn 'Outlined style=\|Filled style=' src/app/ --include='*.tsx'` returns 0 (all icon inlines migrated)
- [ ] `grep -rn 'from.*components/ds.*import.*Button' src/app/ --include='*.tsx'` returns 0 (all DS Button usages removed; using AntD Button directly)
- [ ] `grep -rn '<FormLabel' src/app/ --include='*.tsx'` returns 0 (FormLabel removed; using Form.Item)
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npx next build` → passes
- [ ] Chrome MCP: 5 spot-check pages verified

## Open questions

- `AiChatPanel.tsx`: It has `AiChatPanel.module.css` already. Check current content and extend rather than create.
- `AppointmentSidePanel.tsx`: Many dynamic values (practitioner colors). This may be an irreducible floor — if count doesn't reach ≤12, mark as partial with `// ds-exempt: dynamic practitioner color` comments on remaining inlines.
