# Wave 6 · Plan 04 — Invoice pages deep-clean

**Status:** Planned
**Estimated effort:** 45 min
**Model:** Opus
**Thinking:** think hard
**Must run after:** Plans 00, 01

> **Architecture update (2026-04-23):** Button, Icon, DataTable/Td wrappers are removed in favour of direct AntD. Where this plan references `<Td color="secondary">`, use `<Text color="secondary" as="span">` inside the AntD Table column `render()` instead. Icon inlines are already handled by Plan 01.

## Current state

- `src/app/invoices/[id]/page.tsx`: **67 inline styles**
- `src/app/invoices/[id]/InvoiceDetailClient.tsx`: **55 inline styles**

Combined: **122 inline styles** → target **≤ 40 combined**

## Analysis

### invoices/[id]/page.tsx (67)

After plan 01 icon migration, expect ~60 remaining. Categories:

1. **Invoice page shell** (~15): `minHeight`, `background`, `padding`, `borderBottom`, `border`, `borderRadius`, `boxShadow`. → CSS module `InvoicePage.module.css`
2. **Spacing on Text/Grid** (~20): `style={{ marginBottom: 40 }}`, `style={{ marginTop: 2 }}` etc. → `mb`/`mt` props (plan 00)
3. **Address block layout** (~8): From/To/Client address flex blocks. → CSS module `.addressBlock`, `.addressLine`
4. **Invoice accent stripe** (~3): The colored stripe at top of invoice card (`height: 15, borderRadius: '8px 8px 0 0', background: 'rgb(134, 157, 252)'`). → unique decorative, **keep inline + `// ds-exempt: invoice accent`**
5. **Payment/tax totals** (~8): `fontWeight`, `borderTop`, `padding` on the totals section. → some to CSS module, some stay (dynamic)
6. **Branding one-offs** (~6): Stripe/HICAPS logo containers. → **keep inline** (unique branding)

### InvoiceDetailClient.tsx (55)

After plan 01 icon migration, expect ~48 remaining. Categories:

1. **Page shell** (~8): `minHeight`, `border`, `padding`, `maxWidth`. → CSS module
2. **Invoice gradient stripe** (~3): `background: 'linear-gradient(to right, ...)'`. → **keep inline + `// ds-exempt: invoice gradient`**
3. **Italic logo** (~3): `fontSize: 36, fontStyle: 'italic', color: 'var(--color-accent)'`. → unique, keep inline
4. **Grid/address layout** (~12): `marginBottom: 32`, `fontSize: 12` on Grid. → `mb` prop; CSS module for address
5. **Line items table** (~10): Already DataTable (migrating to AntD Table directly); remaining `style` overrides on cells. → use AntD Table `columns` with `render: (val) => <Text color="secondary" as="span">{val}</Text>` where secondary colour is needed. Do **not** use `<Td color="secondary">` (deprecated sub-component).
6. **Payment widget** (~8): HICAPS/Stripe branding. → keep inline
7. **Discount/total row** (~4): Dynamic values. → keep inline

## CSS module additions

Create `InvoicePage.module.css` and `InvoiceDetailClient.module.css` (scaffolded in plan 00):

```css
/* InvoicePage.module.css */
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
  display: flex;
  gap: 24px;
  padding: 32px;
}

.invoiceCard {
  flex: 1;
  min-width: 0;
}

.invoiceCardInner {
  border-radius: 0 0 8px 8px;
  border: 1px solid var(--color-border);
  border-top: none;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 40px;
}

.addressBlock {
  flex-shrink: 0;
}

.addressLine {
  margin-top: 2px;
}
```

## Migration table

| Before | After |
|---|---|
| `<div style={{ minHeight: 'calc(100vh - 3rem)', background: '...' }}>` | `<div className={styles.shell}>` |
| `<Flex align="center" justify="space-between" style={{ borderBottom: ..., padding: '12px 24px' }}>` | `<div className={styles.header}>` (switch from Flex to div with CSS module) |
| `<Text variant="body/md-strong" as="h3" style={{ marginBottom: 8, fontSize: 13, color: '...' }}>` | `<Text variant="body/md-strong" as="h3" mb={8} style={{ fontSize: 13, color: '...' }}>` |
| `<Text variant="body/md" as="p" color="secondary" style={{ marginTop: 2 }}>` | `<Text variant="body/md" as="p" color="secondary" mt={2}>` |

## Chrome MCP verification

Visit `/invoices/1` (or any invoice) on both tabs:
- Invoice card renders with accent stripe ✓
- Address blocks lay out correctly ✓
- Line items table columns align ✓
- Totals section formatting matches production ✓

## Acceptance criteria

- [ ] `grep -c 'style={{' src/app/invoices/[id]/page.tsx` ≤ 20
- [ ] `grep -c 'style={{' src/app/invoices/[id]/InvoiceDetailClient.tsx` ≤ 20
- [ ] `InvoicePage.module.css` has shell/header/body/invoiceCard classes
- [ ] `InvoiceDetailClient.module.css` has shell/header/body classes
- [ ] All remaining inlines are: dynamic values, decorative art with `// ds-exempt`, or unique one-offs
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] Chrome MCP: invoice page layout verified both tabs

## Open questions

- `fontSize: 13` on From/To/Client headings — this is a non-DS size (13px). It's a deliberate design choice (secondary header in invoice). Keep as one-off inline.
- `color: 'var(--color-accent)'` — accent token. Is it in :root? If not, add it alongside --color-danger. Check globals.css.
