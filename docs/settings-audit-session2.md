# Settings Audit — Session 2

**Date:** 2026-04-09
**Viewport:** 1440x900
**Pages audited:** SMS Settings, Forms (list), splose AI

---

## Page 1: SMS Settings (`/settings/sms-settings`)

**Page:** `/settings/sms-settings` vs `https://acme.splose.com/settings/smsSettings`
**Template type:** Custom form page
**Viewport:** 1440x900

### Flow 1: Screenshot Overlay
- Production screenshot: taken (ss_6646tsbbr)
- Localhost screenshot: taken (ss_7079f6960)
- Differences found: 5

1. **Section order** — Production: Recharge credits → SMS pricing → Two-way SMS. Localhost: Recharge credits → Message preview → SMS pricing. Different order, localhost has extra section, missing "Two-way SMS".
2. **"Message preview" section** — Localhost has SMS message textarea + phone mockup preview with character/segment counter. Production does NOT have this section.
3. **"Two-way SMS" section** — Production has this section (with Save button at y=1116). Localhost is MISSING it.
4. **Purple dividers** — Production has purple dividers (rgb(130,80,255)) between sections. Localhost has NO dividers.
5. **Section heading fontWeight** — Production: h3, 18px, fontWeight 700. Localhost: h2, 18px, fontWeight 600.

### Flow 2: Structural Checklist

**Page Header**
- [x] Title "SMS settings" — PASS: 30px/700/rgb(66,105,74) on both
- [x] Learn button — Present on both ✓
- [x] Save button — Production: present. Localhost: NOT present (**FAIL**)

**Credit Balance Card**
- [x] Present on both ✓ (data values differ — expected)
- [x] Layout — both inline bordered card with label + large number ✓

**Recharge Credits**
- [x] 4 credit options (200/500/1000/2500) — PASS
- [x] Prices match — PASS
- [x] Selected state highlight — both use purple border ✓
- [x] "Recharge" button — PASS (purple, both present)

**Content Sections**
- [x] SMS pricing text — Present on both ✓, content matches
- [x] "billing history" link — Present on both ✓
- [x] "Two-way SMS" — **FAIL**: Production has it, localhost missing
- [x] Message preview — **FAIL**: Localhost has it, production doesn't

### Flow 3: CSS Measurement

| Element | Property | Production | Localhost | Delta | Pass? |
|---|---|---|---|---|---|
| Title | fontSize/color | 30px/rgb(66,105,74) | 30px/rgb(66,105,74) | 0 | PASS |
| Section heading | tag | h3 | h2 | different | minor |
| Section heading | fontWeight | 700 | 600 | different | **FAIL** |
| Section heading | fontSize | 18px | 18px | 0 | PASS |
| Dividers | color | rgb(130,80,255) | (none) | missing | **FAIL** |

### Flow 4: DS Audit

**Source:** `src/app/settings/sms-settings/page.tsx` (168 lines)
**DS imports:** Button, PageHeader, Modal, Card
**Missing:** Text not imported, raw textarea used, labels manual
**Inline style count:** ~15
**DS Grade: B**

### Verdict: partial
**Reason:** Credit balance, recharge, and pricing sections match well. But missing "Two-way SMS" section, missing Save button, no purple dividers, section heading fontWeight wrong, and localhost has extra "Message preview" not on production.

**Action items:**
1. Add "Two-way SMS" section with toggles and Save button
2. Add purple dividers between sections
3. Fix section heading fontWeight: 600 → 700
4. Add Save button to page header (production has it)
5. Consider removing or relocating "Message preview" (not on production)

---

## Page 2: Forms / Form Templates (`/settings/forms`)

**Page:** `/settings/forms` vs `https://acme.splose.com/settings/templates/forms`
**Template type:** SettingsListPage
**Viewport:** 1440x900

### Flow 1: Screenshot Overlay
- Production screenshot: taken (ss_8855f7m1i)
- Localhost screenshot: taken (ss_9264trbkg)
- Differences found: 2

1. **Table header background** — Production: rgb(243,245,247). Localhost: rgb(234,237,241). Slightly darker on localhost.
2. **"Learn" button icon** — Production: lightbulb icon. Localhost: appears to have a dropdown chevron. Minor.

### Flow 2: Structural Checklist

**Page Header**
- [x] Title "Form templates" — PASS
- [x] Buttons: Learn, Show archived, + New template — PASS (all 3 present on both)

**Search Bar**
- [x] Placeholder "Search for title" — PASS
- [x] Search button — PASS

**Data Table**
- [x] Column count — PASS: 5 (Title, Form type, Created at, Updated at, Actions)
- [x] Column headers text — PASS (exact match)
- [x] Header fontSize 14px/fontWeight 600 — PASS
- [x] Header color rgb(65,69,73) — PASS
- [x] Header height — PASS: 55px (prod) vs 54px (localhost) — within threshold
- [x] "Published" badge — Present on both ✓
- [x] Actions "..." — Present on both ✓

### Flow 3: CSS Measurement

| Element | Property | Production | Localhost | Delta | Pass? |
|---|---|---|---|---|---|
| Title | fontSize/color | 30px/rgb(66,105,74) | 30px/rgb(66,105,74) | 0 | PASS |
| Table header | bg | rgb(243,245,247) | rgb(234,237,241) | slightly darker | minor |
| Table header | fontSize | 14px | 14px | 0 | PASS |
| Table header | fontWeight | 600 | 600 | 0 | PASS |
| Table header | height | 55px | 54px | -1px | PASS |

### Flow 4: DS Audit

Uses SettingsListPage template — DS compliance inherited from template. Good.

### Verdict: yes
**Reason:** All structural elements match. Table headers, columns, buttons, search, badges all correct. Only minor bg color difference on table header (9px RGB delta — barely visible). This is a strong match.

**Action items:** None significant. Minor table header bg color adjustment if desired.

---

## Page 3: splose AI (`/settings/ai`)

**Page:** `/settings/ai` vs `https://acme.splose.com/settings/ai`
**Template type:** Custom (tabbed page)
**Viewport:** 1440x900

### Flow 1: Screenshot Overlay
- Production screenshot: taken (ss_7622j65ri)
- Localhost screenshot: taken (ss_7962vnspf)
- Differences found: 5

1. **Tab badge** — Production: "New" badge (purple, rgb(130,80,255)). Localhost: "BETA" badge (green). Different text and color.
2. **Divider color** — Production: purple dividers (rgb(130,80,255)) between subsections. Localhost: gray/default dividers.
3. **Preferences container** — Production: preferences grouped inside a bordered card/panel. Localhost: preferences not in a bordered container, span full width.
4. **Section heading size** — Production: "splose AI - progress notes" appears larger (~21px). Localhost: appears smaller (~16-18px).
5. **"splose AI settings" tagline** — Both have it. Production appears larger/bolder. Localhost smaller.

### Flow 2: Structural Checklist

**Page Header**
- [x] Title "splose AI" — PASS: 30px/rgb(66,105,74) on both
- [x] Learn button — PASS
- [x] Save button — PASS

**Tabs**
- [x] Tab count — PASS: 3 tabs on both (Preferences, Saved prompts, AI block library)
- [x] Tab labels — PASS (same text)
- [x] Active tab "Preferences" — PASS
- [x] Badge text — **FAIL**: Production "New" (purple), Localhost "BETA" (green)

**Preferences Content**
- [x] "splose AI - progress notes" section — Present on both ✓
- [x] Toggle: "Enable voice to text and ask splose AI" — PASS
- [x] Toggle: "Save recording to client file" — PASS
- [x] "splose AI - email" section — Present on both ✓
- [x] Toggle: "Enable splose AI email assistant" — PASS
- [x] "splose AI - calendar" section — Present on both ✓
- [x] Toggle: "Enable splose AI for calendar" — PASS
- [x] Toggle: "Include cancelled appointment slots" — Present on localhost ✓

**Dividers**
- [x] Count — Production: 3 purple dividers. Localhost: gray dividers (count may differ)
- [x] Color — **FAIL**: Production rgb(130,80,255) purple. Localhost default gray.

### Flow 3: CSS Measurement

| Element | Property | Production | Localhost | Delta | Pass? |
|---|---|---|---|---|---|
| Title | fontSize/color | 30px/rgb(66,105,74) | 30px/rgb(66,105,74) | 0 | PASS |
| Badge | text | "New" | "BETA" | different | **FAIL** |
| Badge | bg | rgb(130,80,255) | green | different | **FAIL** |
| Dividers | color | rgb(130,80,255) | gray | different | **FAIL** |
| Pref container | border | 1px solid (bordered) | none | missing | **FAIL** |

### Flow 4: DS Audit

Source uses Tab, Toggle, PageHeader, Button, Card from DS — good usage. Uses Text component for headings. Grade: A-B.

### Verdict: partial
**Reason:** Tab structure, toggle items, and overall layout match well. But badge text/color wrong, dividers not purple, preferences not in bordered container, and minor heading size differences.

**Action items:**
1. Change "BETA" badge to "New" with purple bg (rgb(130,80,255))
2. Change divider colors to purple (rgb(130,80,255))
3. Wrap preferences in a bordered Card container to match production
4. Verify section heading sizes match production (~21px for subsection titles)

---

## Session 2 Summary

| Page | Verdict | Action Items |
|---|---|---|
| SMS Settings | partial | 5 items |
| Forms (list) | **yes** | 0 items |
| splose AI | partial | 4 items |

**Total action items: 9**

**Cross-cutting themes from Session 2:**
1. **Purple dividers missing** (again) — same issue as Session 1. Production uses purple hr elements between form sections. Pattern: every settings page with sections needs purple dividers.
2. **Section heading fontWeight** — Production consistently uses 700, localhost uses 600 (heading/lg variant)
3. **Badge inconsistency** — "New" vs "BETA" text on AI block library tab
