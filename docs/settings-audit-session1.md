# Settings Audit — Session 1

**Date:** 2026-04-09
**Viewport:** 1440x900 (set via resize_window; actual capture sizes 1568x721 / 1568x673)
**Pages audited:** Settings Sidebar/Layout, Settings Details, Settings Integrations

---

## Page 1: Settings Sidebar / Layout

**Page:** Settings layout sidebar (visible on all `/settings/*` routes)
**Template type:** Custom (SideNav DS component)
**Viewport:** 1440x900

### Flow 1: Screenshot Overlay
- Production screenshot: taken (ss_9306xqvwc)
- Localhost screenshot: taken (ss_10361ta5g)
- Differences found: 4

1. **Sidebar active item** — Production: transparent bg with bold text. Localhost: subtle gray bg `rgba(0,0,0,0.04)` with bold text. Minor visual diff.
2. **"Online bookings" badge** — Production: pill-shaped `borderRadius: 24px`. Localhost: rounded rect `borderRadius: 4px`. Shape mismatch.
3. **"Client data" menu item** — Production: present under Data section (28 items total). Localhost: missing (27 items).
4. **Layout scrolling** — Production: sidebar scrolls internally within a clipped parent. Localhost: sidebar pushes full document height, causing broken window scrolling with dead white space.

### Flow 2: Structural Checklist

**Navigation (sidebar)**
- [x] Item count — **FAIL**: Production 28, Localhost 27 (missing "Client data")
- [x] Item labels — PASS for shared 27 items (exact text match)
- [x] Item order — PASS
- [x] Active item — PASS (Details highlighted on both)
- [x] Active style — fontWeight 600, color rgb(0,0,0) — PASS
- [x] Active bg — **FAIL**: Production transparent, Localhost rgba(0,0,0,0.04)
- [x] Section count — PASS (7 sections on both: Workspace, Automation, Business, Team, Templates, Finances, Data)
- [x] Section labels — PASS (exact text match)
- [x] Width — PASS: Production 228px, Localhost 229px (within 2px)

**Badges**
- [x] "New" badge on Online bookings — Present on both ✓
- [x] Badge bg — PASS: both rgb(130,80,255)
- [x] Badge text color — PASS: both rgb(255,255,255)
- [x] Badge fontSize — **FAIL**: Production 12px, Localhost 11px
- [x] Badge borderRadius — **FAIL**: Production 24px (pill), Localhost 4px (rounded rect)
- [x] Badge padding — Production 1px 8px, Localhost needs check

### Flow 3: CSS Measurement

| Element | Property | Production | Localhost | Delta | Pass? |
|---|---|---|---|---|---|
| Sidebar | width | 228px | 229px | +1px | PASS |
| Sidebar | bg | rgb(255,255,255) | rgb(255,255,255) | 0 | PASS |
| Sidebar | borderRight | 1px solid rgba(5,5,5,0.06) | 1px solid rgb(231,232,232) | different encoding | PASS (visual) |
| Sidebar | paddingTop | 0px | 15px | +15px | **FAIL** |
| Section header | fontSize | 14px | 14px | 0 | PASS |
| Section header | fontWeight | 600 | 600 | 0 | PASS |
| Section header | color | rgb(0,0,0) | rgb(65,69,73) | different | **FAIL** |
| Section header | padding | 8px 16px | 8px 16px | 0 | PASS |
| Section header | lineHeight | 22px | 22px | 0 | PASS |
| Menu item | fontSize | 14px | 14px | 0 | PASS |
| Menu item | fontWeight | 400 | 400 | 0 | PASS |
| Menu item | color | rgb(65,69,73) | rgb(65,69,73) | 0 | PASS |
| Menu item | height | 38px | 38px | 0 | PASS |
| Menu item | padding | 0px 16px 0px 24px | 0px 16px 0px 24px | 0 | PASS |
| Menu item | borderRadius | 8px | 8px | 0 | PASS |
| Menu item | lineHeight | 38px | 38px | 0 | PASS |
| Active item | fontWeight | 600 | 600 | 0 | PASS |
| Active item | color | rgb(0,0,0) | rgb(0,0,0) | 0 | PASS |
| Active item | bg | transparent | rgba(0,0,0,0.04) | subtle diff | **FAIL** |
| Badge "New" | fontSize | 12px | 11px | -1px | **FAIL** |
| Badge "New" | borderRadius | 24px | 4px | -20px | **FAIL** |
| Badge "New" | bg | rgb(130,80,255) | rgb(130,80,255) | 0 | PASS |

**Layout Architecture (critical finding):**

| Property | Production | Localhost |
|---|---|---|
| Header position | relative | sticky |
| Sidebar parent overflow | auto (scrolls internally) | visible (pushes document) |
| Sidebar parent height | 723px (viewport-constrained) | 1508px (unconstrained) |
| Document height | 779px (no window scroll) | 1564px (requires window scroll) |

### Flow 4: DS Audit

N/A for sidebar — audited as part of `settings/layout.tsx`.
- Uses `SideNav` from `@/components/ds` ✓
- Layout uses inline styles `style={{ display: 'flex' }}` — should match production's scroll behavior

### Verdict: partial
**Reason:** Sidebar items, labels, and core styling are excellent matches. But missing "Client data" item, badge shape mismatch, section header color mismatch (black vs gray), and critical layout architecture difference (production sidebar scrolls internally, localhost pushes document height).

**Action items:**
1. Add "Client data" menu item under Data section in `settings/layout.tsx`
2. Fix "New" badge shape: change borderRadius to 24px (pill) and fontSize to 12px
3. Fix section header color: rgb(0,0,0) → currently rgb(65,69,73) — update SideNav component
4. Fix sidebar scroll: make sidebar parent container scroll internally (overflow-y: auto, height constrained to viewport) instead of pushing document height
5. Remove sidebar paddingTop: 15px → 0px
6. Fix active item bg: transparent instead of rgba(0,0,0,0.04)

---

## Page 2: Settings Details (`/settings/details`)

**Page:** `/settings/details` vs `https://acme.splose.com/settings/details`
**Template type:** Custom form page
**Viewport:** 1440x900

### Flow 1: Screenshot Overlay
- Production screenshot: taken (ss_9306xqvwc — top), scrolled view with email signature
- Localhost screenshot: taken (ss_10361ta5g — top)
- Differences found: 7

1. **Header/Title zone** — Page title "Details" matches: both 30px/700/rgb(66,105,74) green. PASS.
2. **Save button** — Both purple, right-aligned. PASS.
3. **Business history button** — Localhost has "Business history" link button next to "Business name" label. Production does NOT appear to have this as a separate visible button element in the same position.
4. **File upload area** — Production: shows actual business logo/mascot (full color illustration). Localhost: shows generic upload icon (simple circular SVG). Visual content difference.
5. **Purple dividers** — Production: 5 purple hr separators (`borderTopColor: rgb(130,80,255)`) between form sections. Localhost: NO dividers found — sections flow directly into each other.
6. **Section headings** — Production: h3, 18px, fontWeight 700. Localhost: h2, 16px, fontWeight 600. Both gray.
7. **Scrolling** — Production: content scrolls within clipped layout, header stays visible. Localhost: window scrolls, broken layout with dead white space below content.

### Flow 2: Structural Checklist

**Page Header**
- [x] Title text "Details" — PASS (exact match)
- [x] Title style — PASS: 30px, 700, rgb(66,105,74)
- [x] Button count — PASS: 1 (Save) on both
- [x] Button label "Save" — PASS

**Buttons**
- [x] Save: height 38px — PASS
- [x] Save: bg rgb(130,80,255) — PASS
- [x] Save: color rgb(255,255,255) — PASS
- [x] Save: borderRadius 8px — PASS
- [x] Save: fontSize 14px — PASS

**Form Fields**
- [x] Field count — Production: 11 labels, Localhost: 12 labels (extra "Google Tag Manager ID")
- [x] Field labels — PASS for shared fields
- [x] Required indicators — Production: asterisks rendered separately from label text. Localhost: asterisks embedded in label text with red `color="danger"` — visually similar, both show asterisks ✓
- [x] Field layout — Both use 2-column grid for lower fields ✓

**Dividers**
- [x] Count — **FAIL**: Production 5, Localhost 0
- [x] Color — Production: rgb(130,80,255) purple
- [x] Position — Production: between form sections

**Content Sections**
- [x] Section count — PASS: both have Email signature, Calendar lock dates, Google Tag Manager, Cases
- [x] Section headings — **FAIL**: Production h3 18px/700, Localhost h2 16px/600
- [x] Section heading color — PASS: both rgb(65,69,73)

**Rich Text Editor (Email signature)**
- [x] Business/User toggle buttons — Present on both ✓
- [x] Toolbar icons — Production: Froala-style full toolbar (B, I, U, A:, table, link, −, image, align, ¶). Localhost: simplified toolbar (B, I, AI, table, link, +, align, indent)
- [x] Signature content — Both show template variables ({user_fullName}, etc.) ✓
- [x] "splose" watermark — Present on both (large purple text, bottom-right) ✓

**Additional elements**
- [x] "Business settings change log" link — Present on both ✓
- [x] Cases toggle switch — Present on both ✓
- [x] Calendar lock date input — Present on both ✓

### Flow 3: CSS Measurement

| Element | Property | Production | Localhost | Delta | Pass? |
|---|---|---|---|---|---|
| Page title | fontSize | 30px | 30px | 0 | PASS |
| Page title | fontWeight | 700 | 700 | 0 | PASS |
| Page title | color | rgb(66,105,74) | rgb(66,105,74) | 0 | PASS |
| Save button | bg | rgb(130,80,255) | rgb(130,80,255) | 0 | PASS |
| Save button | height | 38px | 38px | 0 | PASS |
| Save button | borderRadius | 8px | 8px | 0 | PASS |
| Form labels | fontSize | 14px | 14px | 0 | PASS |
| Form labels | fontWeight | 400 | 400 | 0 | PASS |
| Form labels | color | rgb(65,69,73) | rgb(65,69,73) | 0 | PASS |
| Section heading | tag | h3 | h2 | different | **FAIL** |
| Section heading | fontSize | 18px | 16px | -2px | **FAIL** |
| Section heading | fontWeight | 700 | 600 | different | **FAIL** |
| Dividers | borderTopColor | rgb(130,80,255) | (none) | missing | **FAIL** |
| Dividers | count | 5 | 0 | -5 | **FAIL** |

### Flow 4: DS Audit

**Source:** `src/app/settings/details/page.tsx` (237 lines)

**DS imports:** Button, Checkbox, FileUpload, FormInput, FormSelect, Toggle, Tab, Modal, Dropdown, HintIcon, PageHeader, Text, Grid, Divider

**DS Component Usage:**
- [x] Buttons use `<Button>` from DS ✓
- [x] Inputs use `<FormInput>` from DS ✓
- [x] Selects use `<FormSelect>` from DS ✓
- [x] Toggle uses `<Toggle>` from DS ✓
- [x] Checkbox uses `<Checkbox>` from DS ✓
- [x] Modal uses `<Modal>` from DS ✓
- [x] Page header uses `<PageHeader>` from DS ✓
- [x] Text uses `<Text>` from DS ✓
- [x] Grid uses `<Grid>` from DS ✓
- [ ] `<Divider>` is imported but NOT used in the template — **dividers are missing from the page**

**Inline style count:** ~25 `style={{` props — target <10 — **OVER BUDGET**
**Raw className patterns:** ~8 `className="text-*"` patterns — should use `<Text>` where possible
**Direct antd imports:** `DownOutlined` from `@ant-design/icons`, `Flex` from `antd` — both allowed

**Violations:**
1. Divider imported but not used — 5 purple dividers missing from form sections
2. Labels use manual `className="text-label-lg text-text"` instead of FormInput's `label` prop
3. ~25 inline style props (high for a settings form)
4. Rich text editor is custom HTML (expected — no DS wrapper for this)
5. Email signature toolbar buttons use `variant="toolbar"` — good DS usage ✓

**DS Grade: B (60-90% DS)**
Most UI uses DS components. Inline style count is over budget. Divider component is imported but unused.

### Verdict: partial
**Reason:** Title, save button, form fields, and DS component usage are strong. But missing 5 purple dividers between form sections, section heading size/weight mismatch (18px/700 vs 16px/600), and the layout scrolling issue from the sidebar affects this page's below-fold content visibility.

**Action items:**
1. **Add 5 purple `<Divider>` components** between form sections to match production's `rgb(130,80,255)` separators
2. **Fix section headings**: change from `variant="heading/md"` (16px/600) to match production's 18px/700 — likely needs `variant="heading/lg"` or custom size
3. **Refactor manual labels**: use `FormInput`'s built-in `label` prop where possible instead of manual `<label className="text-label-lg">` to reduce inline styles
4. **Rich text toolbar**: localhost has simplified toolbar vs production's Froala editor — structural difference, low priority
5. **File upload**: shows generic SVG icon vs production's actual logo — data difference, not a code issue

---

## Page 3: Settings Integrations (`/settings/integrations`)

**Page:** `/settings/integrations` vs `https://acme.splose.com/settings/integrations`
**Template type:** Custom (card grid)
**Viewport:** 1440x900

### Flow 1: Screenshot Overlay
- Production screenshot: taken (ss_1184bqd87)
- Localhost screenshot: taken (ss_1673al2u1)
- Differences found: 6

1. **Card text alignment** — Production: all text LEFT-aligned. Localhost: all text CENTER-aligned. Major visual difference.
2. **Card heading style** — Production: 21px/700/rgb(33,105,71) green, left-aligned. Localhost: 16px/600/rgb(65,69,73) gray, center-aligned.
3. **Integration name links** — Production: names (Xero, QuickBooks, etc.) appear as purple links `rgb(130,80,255)` within descriptions. Localhost: no inline links, just headings.
4. **Card dimensions** — Production: 420x419px, border 0.5px. Localhost: 454x349px, border 1px. Different widths and heights.
5. **Connection states** — Production: Xero disconnected ("Connect"). Localhost: Xero connected ("Settings"/"Disconnect"). Data state difference.
6. **Stripe buttons** — Production: "Complete your profile in Stripe" + "Disconnect". Localhost: "View your profile in Stripe" link + "Settings". Different label and layout.

### Flow 2: Structural Checklist

**Page Header**
- [x] Title text "Integrations" — PASS
- [x] Title style 30px/700/rgb(66,105,74) — PASS

**Cards**
- [x] Card count — PASS: both show 6 visible cards (3x2 grid), production has more below fold
- [x] Card order — PASS: Xero, QuickBooks, Stripe, Mailchimp, HICAPS, Tyro Health
- [x] Card border — **FAIL**: Production 0.5px solid rgb(217,217,217), Localhost 1px solid rgb(231,232,232)
- [x] Card borderRadius — PASS: both 8px
- [x] Card width — **FAIL**: Production 420px, Localhost 454px
- [x] Card text alignment — **FAIL**: Production left, Localhost center
- [x] Card heading fontSize — **FAIL**: Production 21px, Localhost 16px
- [x] Card heading fontWeight — **FAIL**: Production 700, Localhost 600
- [x] Card heading color — **FAIL**: Production rgb(33,105,71) green, Localhost rgb(65,69,73) gray
- [x] Integration count (total) — Production: 8 (Xero, QB, Stripe, Mailchimp, HICAPS, Tyro, Zoom, Physitrack). Localhost: 8 (same list) ✓

**Buttons**
- [x] Connect buttons — present on both for disconnected integrations ✓
- [x] Button variant matching — needs deeper comparison per card

### Flow 3: CSS Measurement

| Element | Property | Production | Localhost | Delta | Pass? |
|---|---|---|---|---|---|
| Page title | fontSize | 30px | 30px | 0 | PASS |
| Page title | color | rgb(66,105,74) | rgb(66,105,74) | 0 | PASS |
| Card container | layout | flex-wrap | grid 3-col | different | **FAIL** |
| Card container | gap | 20px | 20px | 0 | PASS |
| Card | width | 420px | 454px | +34px | **FAIL** |
| Card | height | 419px | 349px | -70px | **FAIL** |
| Card | border | 0.5px rgb(217,217,217) | 1px rgb(231,232,232) | different | **FAIL** |
| Card heading | fontSize | 21px | 16px | -5px | **FAIL** |
| Card heading | fontWeight | 700 | 600 | different | **FAIL** |
| Card heading | color | rgb(33,105,71) | rgb(65,69,73) | different | **FAIL** |
| Card heading | textAlign | left | center | different | **FAIL** |
| Card description | textAlign | left (start) | center | different | **FAIL** |

### Flow 4: DS Audit

**Source:** `src/app/settings/integrations/page.tsx` (149 lines)

**DS imports:** Button, PageHeader

**DS Component Usage:**
- [x] Buttons use `<Button>` from DS ✓
- [x] Page header uses `<PageHeader>` from DS ✓
- [ ] Card headings use `<h2 className="text-heading-md">` — should use `<Text variant="heading/md">`
- [ ] Description uses `<p className="text-body-md">` — should use `<Text variant="body/md">`
- [ ] No Card DS component used — cards are manually styled divs
- [ ] No Grid DS component used — grid is inline style

**Inline style count:** ~12 `style={{` props
**Raw className patterns:** 4 `className="text-*"` patterns
**Direct antd imports:** None

**Violations:**
1. Manual grid layout with inline styles (should use Grid DS component)
2. Cards are manually styled divs (should use Card DS component if available)
3. `<h2 className="text-heading-md">` should use `<Text>` component
4. `<p className="text-body-md">` should use `<Text>` component
5. Center alignment should be LEFT to match production

**DS Grade: B (60-90% DS)**
Uses Button and PageHeader. Cards/grid/text are manual.

### Verdict: no
**Reason:** Card text alignment (center vs left) and card heading style (16px/600/gray vs 21px/700/green) are significant visual mismatches that affect the entire page appearance. Card dimensions, border weight, and container layout type also differ.

**Action items:**
1. **Fix text alignment**: remove `textAlign: 'center'` and `alignItems: 'center'` from card inner div (line 104) — use left alignment
2. **Fix card heading**: change from `text-heading-md` (16px/600) to ~21px/700 with green color `rgb(33,105,71)` to match production
3. **Add integration name links**: wrap names in purple links within description text to match production style
4. **Fix card width**: adjust grid columns to produce ~420px cards (production uses flex-wrap with max-width per card)
5. **Fix card border**: change to 0.5px solid rgb(217,217,217) to match production
6. **Fix card height**: cards are shorter on localhost (349px vs 419px) — likely resolves when text left-aligns (takes more vertical space)

---

## Session 1 Summary

| Page | Verdict | Action Items |
|---|---|---|
| Settings Sidebar | partial | 6 items |
| Settings Details | partial | 5 items |
| Settings Integrations | no | 6 items |

**Total action items: 17**

**Critical cross-cutting issues:**
1. **Sidebar layout architecture**: Production sidebar scrolls internally, localhost pushes document height — affects ALL settings pages
2. **Section header color**: SideNav section headers are rgb(65,69,73) on localhost vs rgb(0,0,0) on production
3. **Missing "Client data"** menu item
4. **Integrations text alignment**: Center (localhost) vs Left (production) — fundamental visual mismatch
