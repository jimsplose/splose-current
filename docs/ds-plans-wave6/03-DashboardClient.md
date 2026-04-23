# Wave 6 · Plan 03 — DashboardClient deep-clean

**Status:** Done
**Estimated effort:** 40 min
**Model:** Opus
**Thinking:** think hard
**Must run after:** Plans 00, 01

## Current state

`src/app/DashboardClient.tsx`: **84 inline styles**

## Inline style categories (from audit)

After plan 01 removes icon inlines, expect ~75 remaining. Categories:

1. **Chart/tooltip art** (~25): Custom tooltip div, chart bar gradients, legend dots, sparkline positioning. These are unique decorative visuals — **keep inline with `// ds-exempt: decorative chart art` comment**.

2. **Message card layout** (~15): Message preview flex layout, image placeholder. Some can move to `DashboardClient.module.css`.

3. **Spacing on DS components** (~20): `<Text ... style={{ marginBottom: 6 }}>`, `<Flex ... style={{ marginTop: 6 }}>`. After plan 00's `mb`/`mt` props land, migrate these.

4. **Structural page shell** (~10): The outer `<div style={{ ... }}>` wrappers. Move to CSS module.

5. **Dynamic/computed** (~5): Things with JS variables inline. Keep.

## Target: ≤ 30 inline styles (down from 84)

## Changes

### A. CSS module (DashboardClient.module.css already exists)

Add classes:
```css
.messageCard {
  cursor: pointer;
  border-radius: 8px;
  padding: 4px;
  transition: background-color 0.2s;
}

.messageCardBody {
  flex: 1;
  min-width: 0;
}

.messageImage {
  height: 144px;
  width: 192px;
  overflow: hidden;
  border-radius: 8px;
}

.messageAudioCard {
  height: 160px;
  width: 160px;
  border-radius: 8px;
}

.tooltipContainer {
  pointer-events: none;
  position: absolute;
  top: -56px;
  left: 50%;
  z-index: 10;
  transform: translateX(-50%);
  white-space: nowrap;
}

.tooltipBubble {
  border-radius: 4px;
  background-color: #1f2937;
  padding: 6px 10px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  font-size: 11px;
  color: #fff;
}

.tooltipArrow {
  position: absolute;
  bottom: -4px;
  left: 50%;
  height: 8px;
  width: 8px;
  transform: translateX(-50%) rotate(45deg);
  background-color: #1f2937;
}
```

### B. Text mb/mt props (from plan 00)

```tsx
// Before
<Text variant="caption/sm" as="span" color="text" style={{ fontSize: '9.8px' }}>
// After (fontSize 9.8px is a unique override — keep inline on Text)
<Text variant="caption/sm" as="span" color="text" style={{ fontSize: '9.8px' }}>

// Before
<Text variant="body/md" as="span" color="secondary" style={{ marginLeft: 'auto' }}>
// After — marginLeft is layout, keep inline
<Text variant="body/md" as="span" color="secondary" style={{ marginLeft: 'auto' }}>

// Before
<Text variant="body/md" color="secondary" style={{ marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// After — non-standard spacing + ellipsis, keep inline (unique)
```

### C. Chart art — mark as exempt

The bar chart, tooltip, and legend dot inlines should get `/* ds-exempt: decorative chart art */` comments but stay inline. This makes intent explicit and prevents future sessions from trying to move them.

### D. Icon migration (after plan 01 runs first)

Any remaining `<XxxOutlined style={{...}}>` after plan 01 should be caught here.

## Chrome MCP verification

Visit `/` (dashboard). Verify:
- Message card hover works (cursor: pointer, background transition)
- Chart bars render with correct heights and colors
- Tooltip appears on hover (JS state)
- Message timestamps at 9.8px

## Acceptance criteria

- [ ] `grep -c 'style={{' src/app/DashboardClient.tsx` ≤ 30
- [ ] All remaining inlines are either: dynamic JS values, unique one-offs, or marked with `// ds-exempt` comment
- [ ] `DashboardClient.module.css` has structural layout classes
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] Chrome MCP: message cards, chart, tooltip all verified

## Open questions

- The `9.8px` fontSize for timestamps — this is a non-DS size. Acceptable as a one-off? Yes, it matches production. Keep inline.
