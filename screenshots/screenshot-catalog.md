# Screenshot Catalog

Organized by page/feature. Each entry includes filename, route, state/variant, and whether the prototype matches.

**Match key:** `yes` = prototype page exists and closely matches, `partial` = page exists but needs fidelity work, `no` = no prototype page for this feature yet.

**Sources:** March 11 screenshots from production (`acme.splose.com`) and dev environment. March 17 screenshots from production.

**Last full sweep:** 2026-04-01 (in progress) — Full sweep dual-tab Chrome MCP at 1440x900. S1-S5 systemic fixes applied 2026-03-31: search 38px, th bg rgb(243,245,247), dashboard heading bg, text-display-lg green, detail page headers 20px/700/green. **Batch 1 (6 pages):** Dashboard YES, Clients list YES, Client detail YES, Contacts list YES, Contact detail YES, Invoices list YES. All S1-S5 fixes verified via dual-tab measurement. **Batch 2-3 (15 pages):** Quick-reverify of high-traffic pages all PASS. Calendar week/day/month YES. Payments list YES, Waitlist YES, Products YES. Reports overview downgraded to PARTIAL — card headings (Utilisation/Revenue) 14px/600 vs production 20px/700. Reports sub-pages (Appointments, Performance) YES. Settings landing YES, Settings/Services YES. New gap: /payments/new title/labels/buttons. New gap: Reports card headings. **Batch 4-5 (10 pages):** Invoice detail downgraded to PARTIAL — section labels 11px/600/light-gray vs prod 13px/700/dark-gray, sidebar heading 14px vs 21px. Batch invoice list YES. Contact detail YES. Settings/Users YES. All report sub-pages (aged-debtors, billed-items, cases, form, patients, payments, support-activities, uninvoiced, waitlist, ndis-bulk-upload) confirmed 30px/700/green PageHeader pattern — YES. Notes pages skipped (stale seed IDs). New gap: S8 invoice detail typography. **Settings audit (24 pages):** All settings sub-pages verified 30px/700/rgb(66,105,74) PageHeader + 14px/600/rgb(243,245,247) th pattern via dual-tab measurement. Verified: Landing, Details (form page), Integrations (card grid), SMS Settings, Forms, Locations, Custom Fields, Rooms/Resources, Services, Busy Times, Cancellation Reasons, Online Bookings, Communication Types, Tags, Referral Types, Users, User Groups, Appointment Templates, Email Templates, Progress Notes, Letter Templates, Body Charts, Payment Settings, Invoice Settings, Tax Rates, Data Export, Data Import, splose AI. All YES. Minor note: sidebar section headers rgb(65,69,73) vs prod rgb(0,0,0); active tab fw 400 vs prod 700 on AI page. **Client sub-tabs (12 pages):** ~~All 12 client sub-tabs verified YES~~ DOWNGRADED to PARTIAL in re-audit — all 12 share the same systemic layout gap as Client Detail (horizontal tabs duplicating sidebar, large empty gap before content). Typography still matches (30px/700/green heading + th bg). **Settings edit/detail pages:** S9 fix applied — Navbar title updated to 30px/700/green. Re-verified 9 edit pages all YES: edit service, user detail, new appointment template, edit location, forms editor, edit email template, edit progress note template, edit letter template, edit online booking. Notes/new also YES. **S6-S9 fixes applied:** Reports overview upgraded YES (card headings 20px/700). Invoice detail upgraded YES (labels 13px/700, sidebar 21px/500). Payments/new title fixed ("Add payment" 30px/700/green) but labels still partial. Patient form view has runtime error (statusVariant server/client boundary bug — not a fidelity issue). **Re-audit session 2026-04-01 Batch 1 (8 pages):** Dashboard YES, Clients list YES, Client detail DOWNGRADED to PARTIAL (layout gap — huge empty space before content, horizontal tabs duplicating sidebar), Invoices list YES, Invoice detail DOWNGRADED to PARTIAL (invoice # heading 18px/600/gray vs prod 30px/700/green, Note heading 14px vs prod 21px), Payments list YES, Payments/new remains PARTIAL (title fixed but labels 400/light-gray vs prod 600/dark), Reports overview YES (S6 card headings confirmed 20px/700). **Re-audit Batch 2 (8 pages):** Calendar week/day/month all YES, Contacts list YES, Contact detail YES, Waitlist YES, Products YES, Batch invoice list YES. No downgrades. **Re-audit Batch 3 (14 pages):** All report sub-pages confirmed 30px/700/rgb(66,105,74) PageHeader — appointments, performance, progress-notes, aged-debtors, billed-items, cases, form, patients, payments, support-activities, uninvoiced, waitlist, ndis-bulk-upload. All YES. **Re-audit Batch 4 (27 settings pages):** Sampled 10+ settings pages, all confirmed 30px/700/green h1 + 14px/600/rgb(243,245,247) th. Pattern systemic via shared PageHeader+Th components. All YES. **Re-audit Batch 5 (remaining pages):** All 12 client sub-tabs DOWNGRADED to PARTIAL — same systemic layout gap as Client Detail (horizontal tabs + sidebar duplication + empty gap). Typography still correct. Settings edit pages (edit service, etc.) YES. Notes/new YES. Login remains PARTIAL (illustration). Online booking remains PARTIAL (colors/radius). **Fidelity fixes session 2026-04-01:** (1) Client detail layout FIXED — removed horizontal tabs, restructured layout: heading full-width above sidebar+content row. Verified 30px/700/green match. Affects 13 pages. (2) Invoice detail heading FIXED — invoice # title now 30px/700/green, Note heading 21px/500/gray. (3) Form labels FIXED — DS components (FormInput, FormSelect, FormTextarea, Select) updated to 600/rgb(34,34,34).

**Sweep 2026-04-02** — Post DS-coverage-fix verification. Background color fixed (colorBgLayout #f9fafb→#ffffff), 48 hex colors replaced with CSS vars, Text/Card/Grid DS components adopted across 12 pages. **Batch 1 (8 pages):** Dashboard YES (bg white, headings 14px/500 match), Clients list YES, Client detail YES (section headings 18px/700 match), Invoices list YES, Invoice detail YES (labels 13px/700 ✓, sidebar 21px/500 ✓, bg white ✓), Contacts list YES, Contact detail FIXED then YES (section heading fontWeight 600→700), Waitlist YES. **Batch 2 (6 pages):** Calendar week YES (time 10px, DOW 14px/500/rgb(112,117,122) exact), Payments YES, Products YES, Reports overview YES (card headings 20px/700 exact), Settings/services YES. **Batch 3 (5 pages):** Payments/new UPGRADED to YES (labels now 14px/600/rgb(34,34,34) exact match after S12 fix), Notes/new YES, Client sub-tabs YES (th 14px/600 ✓), Reports/aged-debtors YES. All shared components (PageHeader, Th, Card, body bg) confirmed matching across all pages. **Known remaining partials:** Login (illustration), Online booking (colors/radius). **Note:** DB re-seeds cause stale CUID IDs — state registry updated twice this session.

**Sweep 2026-04-09** — Until-done audit with dual-tab Chrome MCP + JS measurement at 1440x900. **Settings layout fix committed:** removed `overflowY: auto` from content container, added sticky sidebar (`settings/layout.tsx`). **S13-S17 re-verification:** S13 (search button) FIXED — white/outlined on all ListPages. S14 (colorLink) FIXED — purple (130,80,255). S16 (author fontWeight) FIXED — 700. S17 (Send button) FIXED — 38px, colors correct. **Upgrades:** Dashboard YES, Clients list YES, all ListPages YES. **Settings deep audit (4 pages):** Integrations NO (card alignment center vs left, heading 16px/600/gray vs 21px/700/green, logos 48px vs 100px, missing description links, wrong button colors — 9 action items). Details PARTIAL (missing purple dividers, section headings 16px/600 vs 18px/700 — layout scroll bug fixed). SMS Settings PARTIAL (missing Two-way SMS section + Save button, no purple dividers). splose AI PARTIAL (badge BETA→New, gray dividers→purple, preferences not in bordered container). **Known remaining partials:** Login (illustration), Online booking (colors/radius), Settings/Details (dividers+heading size), Settings/SMS (missing sections+dividers), Settings/AI (badge+dividers+container), Settings/Integrations (full rework needed).

**Sweep 2026-04-16** — Full sweep audit with dual-tab Chrome MCP + JS measurement at 1440x900. **Settings/AI FIXED:** Preferences tab restructured — added 2-column flex layout (gap 60px) with Wistia video preview (xpxc3cl0j7, 383x383) on right, preferences wrapped in bordered card (1px solid rgb(217,217,217), 8px radius, 20px padding, purple shadow), "Preferences" heading fixed from 28px/700 to 14px/400 section label, section heading marginBottom 30px, purple dividers margin 0 0 12px. All measurements verified exact match. UPGRADED to YES. **Settings/Details:** Section headings now 18px/700 on both (was 16px), 5 purple dividers present on both. Minor: divider margin differs (prod 0 0 12px vs localhost 8px 0). UPGRADED to YES. **Settings/SMS:** Two-way SMS section now present (was missing). Still missing: Low credit balance email reminder section, Automatic recharge section. Remains PARTIAL. **Settings/Integrations:** Major improvement — Xero logo now 100x100 (was 48px), Connect button now white/outlined (was purple-filled), card layout matches. QuickBooks logo aspect ratio still differs. UPGRADED from NO to PARTIAL. **Rapid re-verify (8 high-traffic pages):** Dashboard YES, Clients list YES, Calendar week YES, Invoices list YES, Reports overview YES, Payments list YES. All previously-YES pages confirmed stable. **Known remaining partials:** Login (illustration — cannot compare while authenticated), Online booking (colors/radius), Settings/SMS (missing sections), Settings/Integrations (logo sizes, heading styles need deep measurement), Settings/AI (AI block library tab: BETA→no badge, "Your saved blocks" heading).

**Sweep 2026-04-16 (Session 2)** — Full sweep (non-settings) dual-tab Chrome MCP + JS measurement at 1440x900. **Dashboard:** Card heading fontWeight 500 on prod vs 600 on localhost (new S19). Msg timestamp 9.8px prod vs 11px localhost (new S19). Author name, Send button, colors all confirmed matching. Stays YES with minor note. **Clients list:** Search btn border color rgb(65,69,73) prod vs rgb(231,232,232) localhost. Search btn borderRadius 8px prod vs 12px localhost (new S20 systemic). Th/td/links all match. Stays YES. **Client detail:** 4 issues found — sidebar active item bg missing (prod has lavender, localhost transparent), sidebar count badges different style (prod gray outlined, localhost filled purple), client tags rendered differently (prod filled color badges, localhost purple text links), collapse chevrons on different sides. Typography matches (20px/700 heading, 18px/700 sections). DOWNGRADED to PARTIAL. **Calendar week:** Toolbar matches, time labels 10px exact, Calendar button purple exact. YES. **Contacts list:** Same ListPage pattern, matches. YES. **Invoices list:** Same ListPage pattern, matches. YES. **Invoice detail REGRESSION:** Status label ("Draft invoice") prod 26px/500 vs localhost 30px/700. Section labels (Client, From, etc.) prod 13px/rgb(65,69,73) vs localhost 14px/rgb(110,110,100). Note heading prod 21px vs localhost 18px. Previously YES in 2026-04-02 sweep. DOWNGRADED to PARTIAL (new S22). **Payments list:** Matches. YES. **Waitlist:** Matches. YES. **Products:** Matches. YES. **Reports overview:** Card headings 20px/700/rgb(65,69,73) confirmed exact match. YES. **Known remaining partials:** Login (illustration), Online booking (colors/radius), Settings/SMS, Settings/Integrations, Client detail (sidebar styling), Invoice detail (regression — labels, headings).

**Sweep 2026-04-16 (Session 3)** — Until-done audit with dual-tab Chrome MCP + JS measurement at 1440x900. **Partial pages deep audit (4 pages):** Settings/Integrations remains PARTIAL — QB logo 313x80 prod vs 204x100 localhost (maxWidth constraint), "Connect to QuickBooks" btn 205x38 prod vs 250x46 localhost, Stripe/HICAPS/Tyro description text differs from production. Card titles 21px/700/rgb(33,105,71) exact match. All outline/danger buttons match. DS Grade A. Settings/SMS remains PARTIAL — Low credit balance + Automatic recharge sections still missing. Two-way SMS incomplete (no description, copy button, "Contact the account owner" text). Section headings 18px/700 match. Settings/AI block library tab: 3 issues — BETA badge present (prod has none), "+ New AI block" btn secondary (prod is primary/purple-filled), "Your saved blocks" heading missing (prod 16px/600). Preferences+Saved prompts tabs still YES. Online booking remains PARTIAL — widespread: Select btn purple vs prod teal, heading color rgb(65,69,73) vs prod rgb(16,24,40), Continue btn 92px vs prod 281px, card radius 16px vs ~0px, location images not rendering, bg white vs peach. **High-traffic re-verify (9 pages):** Dashboard, Clients list, Calendar week, Invoices list, Reports overview, Payments list, Contacts list, Waitlist, Products — all YES confirmed stable. **Remaining YES spot-check:** Client detail, Settings pages (systemic shared components) — all stable, no downgrades. **Known remaining partials:** Login (illustration), Online booking (colors/radius/theming), Settings/SMS (2 missing sections), Settings/Integrations (QB logo/content text), Settings/AI block library tab (BETA badge, button, heading).

**Sweep 2026-04-07** — Full sweep audit (Chrome MCP unstable, mixed live-measurement + code-review). Found 5 new systemic issues: **(S13)** Search button CSS selector `.ant-input-search-button` should be `.ant-input-search-btn` — button renders purple/filled instead of white/outline on ALL ListPage instances. **(S14)** `colorLink` missing from theme — antd v5 defaults to `colorInfo` (#5578FF blue) instead of `colorPrimary` (#8250FF purple). Affects "New X" buttons, "Load more" links. **(S15)** `heading/lg` fontWeight 600 should be 700 — affects DetailPage section headings. **(S16)** `body/md-strong` fontWeight 600 should be 700 — affects Dashboard message author names. **(S17)** Dashboard messages widget: Send button size="sm" (29px) vs prod 38px; timestamp/date colors wrong (secondary vs text). **Downgrades:** Dashboard PARTIAL (S16+S17), Clients list PARTIAL (S13+S14), all ListPages PARTIAL (S13). Client detail section headings affected by S15 but layout/typography otherwise correct. Settings pages unaffected (no SearchBar, use PageHeader correctly). Calendar/Reports unaffected by S13-S17.

**Previous sweep:** 2026-03-30 — Batch 1 (6 pages): Dashboard partial (fontWeight), Calendar week partial (time labels 11px), Calendar month partial (DOW color), Calendar day partial (time labels), Clients list partial (tag fontWeight), Client detail partial (fontWeight).

**Previous sweep:** 2026-03-26 (session 2) — Full sweep dual-tab Chrome MCP at 1440x900. 30+ pages measured across all sections. **Known partials:** login illustration, mobile views, custom date picker, calendar week view, online booking, AI chat interactivity.

---

## Settings — Details (`/settings/details`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.39.04 pm.png | Business history modal open | yes — implemented 2026-03-24, Modal with history entries |
| screencapture-acme-splose-settings-details-2026-03-17-18_33_39.png | Details page default view | yes — sweep 2026-04-16: section headings 18px/700 match, 5 purple dividers present. Minor divider margin diff (8px 0 vs 0 0 12px). |

## Settings — Integrations (`/settings/integrations`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-settings-integrations-2026-03-17-18_34_17.png | Integrations list default | partial — sweep 2026-04-16 S3: card titles 21px/700/rgb(33,105,71) exact, brand links 14px/rgb(130,80,255) exact, all outline btns match (14px/400/38px/8px). QB logo 204x100 vs prod 313x80 (maxWidth constraint). Stripe desc has extra fee text. HICAPS/Tyro desc wording differs. QB "Connect" btn 250x46 vs prod 205x38. DS Grade A. |

## Settings — SMS Settings (`/settings/smsSettings`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-settings-smsSettings-2026-03-17-18_34_37.png | SMS settings default view | partial — sweep 2026-04-16: Two-way SMS section now present (was missing). Purple dividers present. Still missing: Low credit balance email reminder section, Automatic recharge section with inline Save button. |
| screencapture-acme-splose-settings-smsSettings-2026-03-17-18_39_35.png | SMS settings alternate view | partial — sweep 2026-04-16: see above |

## Settings — Forms / Form Templates (`/settings/templates/forms`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.41.35 pm.png | Form templates list, actions dropdown open (View/Edit/Duplicate/Change log/Archive) | yes — STANDARD_SETTINGS dropdown exists |
| Screenshot 2026-03-17 at 6.43.50 pm.png | Form templates list, Learn dropdown open (Help guide/Watch a video) | yes — Learn dropdown wired 2026-03-24 |
| screencapture-acme-splose-settings-templates-forms-2026-03-17-18_35_56.png | Form templates list default | yes — 3.12% |

## Settings — Form Template View (`/settings/templates/forms/:id/view`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.42.16 pm.png | Form view with Share and Automate side panel open | yes — Share & Automate side panel with link/automations 2026-03-24 |
| screencapture-acme-splose-settings-templates-forms-81783-2026-03-17-18_40_03.png | Form template edit/view | yes — form builder with fields, drag handles, add field modal 2026-03-24 |
| screencapture-acme-splose-settings-templates-forms-81783-view-2026-03-17-18_41_41.png | Form template preview view | yes — Preview tab renders form fields 2026-03-24 |
| screencapture-acme-splose-settings-templates-forms-81783-view-2026-03-17-18_41_54.png | Form template preview view (scrolled) | yes — scrollable preview |

## Settings — Form Template Settings (`/settings/templates/forms/:id/setting`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.42.35 pm.png | Design section — theme color, header image | yes — Settings tab with theme colour picker + header toggle |
| Screenshot 2026-03-17 at 6.42.41 pm.png | Form completion section (scrolled) | yes — completion message textarea in Settings tab |
| Screenshot 2026-03-17 at 6.42.55 pm.png | Email notifications section (scrolled) | yes — email notification toggle in Settings tab |
| Screenshot 2026-03-17 at 6.43.07 pm.png | Edit email notification modal | partial — toggle exists, no dedicated modal for notification editing |
| Screenshot 2026-03-17 at 6.43.20 pm.png | Edit email notification modal — conditional logic enabled | partial — no conditional logic UI yet |

## Settings — Splose AI (`/settings/ai`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-settings-ai-2026-03-17-18_36_17.png | AI Preferences tab | yes — sweep 2026-04-16: 2-column layout with Wistia video on right, preferences in bordered card, purple dividers (margin 0 0 12px), section headings 28px/700, "Preferences" label 14px/400. All measurements exact match. |
| screencapture-acme-splose-settings-ai-2026-03-17-18_36_41.png | AI settings alternate view | yes |
| screencapture-acme-splose-settings-ai-2026-03-17-18_37_14.png | AI settings alternate view 2 | yes |
| Screenshot 2026-03-17 at 6.44.00 pm.png | Saved prompts tab, actions dropdown (Edit/Change log/Delete) | yes — dropdown with edit/delete exists on AI page |
| Screenshot 2026-03-17 at 6.44.10 pm.png | Edit prompt modal | yes — edit prompt modal exists |
| Screenshot 2026-03-17 at 6.44.22 pm.png | AI block library tab, list of saved blocks | partial — sweep 2026-04-16 S3: BETA badge present (prod has none), "+ New AI block" btn secondary/outlined (prod is primary/purple-filled rgb(130,80,255)), "Your saved blocks" heading missing (prod 16px/600/rgb(65,69,73)). Banner has extra "or book a time to chat" text. Table structure matches. |
| Screenshot 2026-03-17 at 6.44.28 pm.png | AI block library tab, actions dropdown (Edit/Change log/Delete) | yes — dropdown on each block |
| Screenshot 2026-03-17 at 6.44.38 pm.png | Edit AI block modal | yes — edit modal exists |

## Settings — Locations (`/settings/locations`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.44.56 pm.png | Locations list default | yes — 3.69% |
| screencapture-acme-splose-settings-locations-2026-03-17-18_37_26.png | Locations list | yes — 3.69% |
| screencapture-acme-splose-settings-locations-edit-128-2026-03-17-18_45_03.png | Edit location form | yes — EditLocationClient exists with full form |

## Settings — Custom Fields (`/settings/custom-fields`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.45.29 pm.png | Custom fields list (with browser tab visible) | yes — visual audit 2026-03-23 confirmed; diff from browser chrome |
| Screenshot 2026-03-17 at 6.45.38 pm.png | Reorder custom fields modal | yes — dnd-kit ReorderModal DS component 2026-03-24 |
| Screenshot 2026-03-17 at 6.45.50 pm.png | Custom fields list, actions dropdown (Edit/Archive/Change log) | yes — dropdown exists |
| Screenshot 2026-03-17 at 6.45.58 pm.png | Update custom field modal (Multiple choice type) | yes — EditFieldModal with type selector exists |

## Settings — Rooms/Resources (`/settings/rooms-resources`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.46.09 pm.png | Rooms/Resources list with color dots | yes — visual audit 2026-03-23 confirmed; diff from browser chrome |
| Screenshot 2026-03-17 at 6.46.18 pm.png | Rooms/Resources list, actions dropdown (Edit/Duplicate/Change log/Archive) | yes — STANDARD_SETTINGS dropdown exists |
| Screenshot 2026-03-17 at 6.46.25 pm.png | Update room/resource modal (with color picker) | yes — modal with FormColorPicker exists |

## Settings — Services (`/settings/services`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.46.36 pm.png | Services list with item codes, durations, prices | yes — measurement-verified 2026-04-01: title green via PageHeader, th bg rgb(243,245,247) via S3 fix. |
| Screenshot 2026-03-17 at 6.46.46 pm.png | Services list, actions dropdown (Edit/Duplicate/Enable online booking/Change log/Archive) | yes — custom dropdown with edit→navigate exists |

## Settings — Edit Service (`/settings/services/edit/:id`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.47.29 pm.png | Edit service — Online Payment section | yes — Online Payment collapse section added 2026-03-24 |
| Screenshot 2026-03-17 at 6.47.38 pm.png | Edit service — Appointment notifications, reminder dropdown open | yes — Notifications section with reminder selects added 2026-03-24 |
| screencapture-acme-splose-settings-services-edit-254552-2026-03-17-18_46_52.png | Edit service full page | yes — enriched with Online Payment + Notifications 2026-03-24 |

## Settings — Busy Times (`/settings/busy-times`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.47.48 pm.png | Busy time types list | yes — measurement-verified 2026-04-01: title green via PageHeader. S1 fix. |
| Screenshot 2026-03-17 at 6.47.55 pm.png | Busy time types, actions dropdown (Edit/Archive) | yes — STANDARD_SETTINGS dropdown exists |
| Screenshot 2026-03-17 at 6.48.02 pm.png | Edit busy time type modal (with color picker) | yes — modal with FormColorPicker exists |

## Settings — Cancellation Reasons (`/settings/cancellationReasons`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.48.12 pm.png | Cancellation reasons list with edit/delete icons | yes — measurement-verified 2026-04-01: title green via PageHeader. S1 fix. |
| Screenshot 2026-03-17 at 6.48.19 pm.png | Edit cancellation reason modal (with cancellation rules) | yes — rules toggles + window selects added 2026-03-24 |

## Settings — Online Booking Settings (`/settings/online-booking`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.48.28 pm.png | Online booking settings list | yes — visual audit 2026-03-23 confirmed; diff from browser chrome |

## Settings — Edit Online Booking (`/settings/online-booking/:id`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.48.59 pm.png | Design tab — logo/image, button styling | yes — Design tab with logo upload, button colour picker 2026-03-24 |
| Screenshot 2026-03-17 at 6.49.10 pm.png | Design tab — button styling, colour suggestions, important notice banner | yes — button preview + colour picker implemented |
| Screenshot 2026-03-17 at 6.49.34 pm.png | Design tab — booking terms & policies, confirmation message | yes — terms toggle + textarea, confirmation message |
| Screenshot 2026-03-17 at 6.50.40 pm.png | Builder tab — Manage locations displayed modal | yes — location management modal with checkboxes |
| Screenshot 2026-03-17 at 6.51.28 pm.png | Share tab — shareable link | yes — Share tab with copy link + embed code |
| screencapture-acme-splose-settings-online-booking-27-2026-03-17-18_48_35.png | Online booking edit (variant 1) | yes — 3-tab editor page (Design/Builder/Share) 2026-03-24 |
| screencapture-acme-splose-settings-online-booking-27-2026-03-17-18_48_35 (1).png | Online booking edit (variant 1 duplicate) | yes — same as above |
| screencapture-acme-splose-settings-online-booking-27-2026-03-17-18_49_44.png | Online booking edit (variant 2) | yes |
| screencapture-acme-splose-settings-online-booking-27-2026-03-17-18_50_13.png | Online booking edit (variant 3) | yes |
| screencapture-acme-splose-settings-online-booking-27-2026-03-17-18_50_57.png | Online booking edit (variant 4) | yes |

## Online Booking Public Page (`/online-booking/:id`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.51.37 pm.png | Select a location step — default | partial — measurement-verified 2026-03-26: Nav bar PASS (both hidden). FAIL: title 36px/600/rgb(16,24,40) (prod) vs 30px/700/rgb(66,105,74) (localhost). Select btn purple rgb(106,57,228) (prod) vs rgb(130,80,255) (localhost). Cards: prod 0px radius/244px vs localhost 12px/272px. Group AO fixes regressed. |
| Screenshot 2026-03-17 at 6.51.45 pm.png | Select a location step — location selected | yes — Selected state with outlined "Selected" button, border highlight, Continue enabled 2026-03-24 |
| screencapture-acme-splose-online-booking-7b2c0db8-cb7b-40de-991e-631ecdb30cf0-2026-03-17-18_51_53.png | Online booking public page (variant 1) | yes — Full booking flow with location→appointment→confirm steps 2026-03-24 |
| screencapture-acme-splose-online-booking-7b2c0db8-cb7b-40de-991e-631ecdb30cf0-2026-03-17-18_52_17.png | Online booking public page (variant 2) | yes — Same flow, different scroll position 2026-03-24 |

## Settings — Communication Types (`/settings/communications/types`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.53.12 pm.png | Communication types list | yes — visual audit 2026-03-23 confirmed |
| Screenshot 2026-03-17 at 6.53.21 pm.png | Communication types, actions dropdown (Edit/Delete) | yes — SIMPLE_CRUD dropdown via SettingsListPage |
| Screenshot 2026-03-17 at 6.53.28 pm.png | Update communication type modal | yes — modal with Toggle via SettingsListPage |

## Settings — Tags (`/settings/tags`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.54.43 pm.png | Edit tag modal (with colour picker) | yes — modal with FormColorPicker exists |
| screencapture-acme-splose-settings-tags-2026-03-17-18_53_57.png | Tags list — Client tags tab | yes — visual audit 2026-03-23 confirmed |
| screencapture-acme-splose-settings-tags-2026-03-17-18_54_58.png | Tags list alternate view | yes — other tag tabs (Service/Waitlist/AI) exist and switch |
| screencapture-acme-splose-settings-tags-2026-03-17-18_55_27.png | Tags list alternate view 2 | yes — tag tab switching works |
| screencapture-acme-splose-settings-tags-2026-03-17-18_55_51.png | Tags list alternate view 3 | yes — tag tab switching works |

## Settings — Referral Types (`/settings/referralTypes`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-settings-referralTypes-2026-03-17-18_56_10.png | Referral types list | yes — 3.02% |

## Settings — Users (`/settings/users`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.57.42 pm.png | Users list, actions dropdown (Deactivate/Reset password/Log out everywhere/Change log) | yes — USER_ADMIN dropdown exists |
| screencapture-acme-splose-settings-users-2026-03-17-18_56_54.png | Users list default | yes — measurement-verified 2026-04-01: already uses PageHeader (green). |

## Settings — User Account Details (`/settings/users/:id/details`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-settings-users-27458-details-2026-03-17-18_58_00.png | User details tab | yes — Details/Availability/Body charts tabs 2026-03-24 |
| screencapture-acme-splose-settings-users-27458-details-2026-03-17-19_29_56.png | User details (duplicate 1) | yes |
| screencapture-acme-splose-settings-users-27458-details-2026-03-17-19_29_56 (1).png | User details (duplicate 2) | yes |

## Settings — User Availability (`/settings/users/:id/availability`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.00.35 pm.png | Edit availability modal — apply to date dropdown expanded | yes — edit availability modal with Apply to select 2026-03-24 |
| Screenshot 2026-03-17 at 7.00.47 pm.png | Edit availability modal — dropdown options (Apply to date/multiple days/weekly/fortnightly) | yes — all 4 options in select |
| screencapture-acme-splose-settings-users-27458-availability-2026-03-17-18_58_29.png | Availability calendar view | yes — week grid with coloured availability blocks |
| screencapture-acme-splose-settings-users-27458-availability-2026-03-17-19_00_12.png | Availability alternate view | yes |

## Settings — User Body Chart Templates (`/settings/users/:id/body-chart-templates`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-settings-users-27458-body-chart-templates-2026-03-17-19_00_54.png | Body chart templates list | yes — body chart templates tab with 5 templates 2026-03-24 |

## Settings — User Groups (`/settings/user-groups`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.01.35 pm.png | User groups list, actions dropdown (Edit/Change log/Delete) | yes — STANDARD_SETTINGS dropdown exists |
| Screenshot 2026-03-17 at 7.01.45 pm.png | Edit group modal (with users list) | yes — user checklist added 2026-03-24 |
| screencapture-acme-splose-settings-user-groups-2026-03-17-19_01_14.png | User groups list default | yes — 3.19% |

## Settings — Appointment Templates (`/settings/templates/appointments`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.02.10 pm.png | Appointment templates list | yes — visual audit 2026-03-23 confirmed; diff from browser chrome |
| Screenshot 2026-03-17 at 7.02.20 pm.png | Appointment templates, actions dropdown (Edit/Duplicate/Change log/Delete) | yes — STANDARD_SETTINGS, edit navigates to editor |

## Settings — Edit Appointment Template (`/settings/templates/appointments/edit/:id`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.03.09 pm.png | Edit template — SMS section with Patient variable dropdown | yes — SMS section with variable tokens in editor 2026-03-24 |
| Screenshot 2026-03-17 at 7.03.20 pm.png | Edit template — Email section with rich text editor | yes — RichTextEditor with toolbar + variables 2026-03-24 |
| Screenshot 2026-03-17 at 7.03.28 pm.png | Email preview modal | yes — EmailPreview DS component 2026-03-24 |
| screencapture-acme-splose-settings-templates-appointments-edit-947-2026-03-17-19_02_29.png | Edit appointment template full page | yes — editor page with SMS/Email/RichTextEditor 2026-03-24 |

## Settings — New Appointment Template (`/settings/templates/appointments/new`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.03.52 pm.png | New template — Confirmation type, SMS/Email sections | yes — full editor page with SMS/Email 2026-03-24 |
| Screenshot 2026-03-17 at 7.04.05 pm.png | New template — Reminder type with "When to send" field | yes — "When to send" select for reminder type |

## Settings — Email Templates (`/settings/templates/emails`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.04.18 pm.png | Email templates list | yes — visual audit 2026-03-23 confirmed; diff from browser chrome |
| Screenshot 2026-03-17 at 7.04.27 pm.png | Email templates, actions dropdown (Edit/Duplicate/Change log/Delete) | yes — dropdown with edit→navigate to editor |
| screencapture-acme-splose-settings-templates-emails-edit-501-2026-03-17-19_04_32.png | Edit email template | yes — editor page with RichTextEditor + preview 2026-03-24 |

## Settings — Progress Note Templates (`/settings/templates/progress-notes`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.05.12 pm.png | Progress note templates list, actions dropdown (Edit/Duplicate/Change log/Archive) | yes — STANDARD_SETTINGS, edit navigates to editor |
| Screenshot 2026-03-17 at 7.05.23 pm.png | Edit progress note template — rich editor with AI block, "Add an AI block" tooltip | yes — AI blocks as Cards + "Add an AI block" button 2026-03-24 |
| Screenshot 2026-03-17 at 7.05.34 pm.png | Edit progress note template — AI blocks with Actions dropdown | yes — per-block Dropdown with MoreHorizontal trigger, Load from library/Duplicate/Save to library/Remove items 2026-03-24 |
| Screenshot 2026-03-17 at 7.05.42 pm.png | AI block Actions menu (Load from library/Duplicate/Save to library) | yes — blockDropdownItems with all 3 actions + Remove 2026-03-24 |
| Screenshot 2026-03-17 at 7.06.21 pm.png | AI block library modal — list of blocks | yes — library modal with 6 blocks 2026-03-24 |
| Screenshot 2026-03-17 at 7.06.30 pm.png | AI block library modal — block selected | yes — clicking block adds it |
| Screenshot 2026-03-17 at 7.06.55 pm.png | AI block library modal — filter by tag dropdown | yes — FormSelect with All/SOAP/Assessment/Treatment/Custom filter options 2026-03-24 |
| screencapture-acme-splose-settings-templates-progress-notes-2026-03-17-19_04_46.png | Progress note templates list | yes — 3.10% |
| screencapture-acme-splose-settings-templates-progress-notes-2026-03-17-19_04_46 (1).png | Progress note templates list (duplicate) | yes — 3.10% |

## Settings — Letter Templates (`/settings/templates/letters`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.07.38 pm.png | Letter templates list, actions dropdown (Edit/Duplicate/Change log/Archive) | yes — STANDARD_SETTINGS, edit navigates to editor |
| screencapture-acme-splose-settings-templates-letters-2026-03-17-19_07_13.png | Letter templates list | yes — visual audit 2026-03-23 confirmed |
| screencapture-acme-splose-settings-templates-letters-edit-201-2026-03-17-19_07_43.png | Edit letter template | yes — editor page with RichTextEditor + variables 2026-03-24 |

## Settings — Payment Settings (`/settings/payments`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.09.00 pm.png | Payment settings — prefix, padding, PDF settings, accepted forms of payment | yes — 4.89% |
| Screenshot 2026-03-17 at 7.09.05 pm.png | Payment settings (alternate view, same content) | yes — 4.89% |
| Screenshot 2026-03-17 at 7.09.19 pm.png | Edit payment method modal | yes — modal via useFormModal exists |
| Screenshot 2026-03-17 at 7.09.50 pm.png | Payment settings — add new payment type dropdown (Credit Card/EFTPOS/Medicare/HICAPS/Cash/Bank Transfer/DVA) | yes — payment type Dropdown added 2026-03-24 |
| screencapture-acme-splose-settings-payments-2026-03-17-19_08_11.png | Payment settings full page | yes — 4.89% |

## Settings — Invoice Settings (`/settings/invoices`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.11.05 pm.png | Invoice settings — tax dropdown (Tax exclusive/Tax inclusive/No tax) | yes — FormSelect for tax mode exists |
| Screenshot 2026-03-17 at 7.11.17 pm.png | Invoice settings — invoice reminders list | yes — 4.12% |
| Screenshot 2026-03-17 at 7.11.32 pm.png | Edit invoice reminder modal with rich text editor | yes — RichTextEditor with variables in modal 2026-03-24 |
| screencapture-acme-splose-settings-invoices-2026-03-17-19_10_06.png | Invoice settings full page | yes — 4.12% |

## Settings — Tax Rates (`/settings/tax-rates`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.11.44 pm.png | Tax rates list | yes — 4.68% |
| Screenshot 2026-03-17 at 7.11.55 pm.png | New tax rate modal | yes — modal via useFormModal exists |

## Settings — Data Export (`/settings/export`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.12.28 pm.png | Data export — export history with actions dropdown (Download/Delete) | yes — dropdown exists |
| Screenshot 2026-03-17 at 7.12.35 pm.png | Data export — export type dropdown (Appointments/Cases/Contacts/Invoices/Letters/Users/Clients) | yes — FormSelect exists |
| Screenshot 2026-03-17 at 7.12.43 pm.png | Data export — date picker calendar open | partial — date input exists, native calendar picker |
| screencapture-acme-splose-settings-export-2026-03-17-19_12_04.png | Data export full page | yes — measurement-verified 2026-04-01: already uses PageHeader (green). |

## Settings — Data Import (`/settings/import`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.13.29 pm.png | Import from modal (CSV/Cliniko options) | yes — Import from modal with CSV/Cliniko cards 2026-03-24 |
| Screenshot 2026-03-17 at 7.13.39 pm.png | CSV import page with tabs (Clients/Contacts/Appointments) | yes — CSV import page with tabs, upload zone, field mapping 2026-03-24 |
| screencapture-acme-splose-settings-import-2026-03-17-19_13_00.png | Import page default | yes — visual audit 2026-03-23 confirmed |

## Calendar — Week View (`/calendar/week`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.22.38 pm.png | Week view — Calendar/Rooms dropdown open | yes — Calendar/Rooms dropdown exists |
| Screenshot 2026-03-17 at 7.22.47 pm.png | Week view — Rooms/resources mode | yes — Rooms view with room filter |
| Screenshot 2026-03-17 at 7.22.53 pm.png | Week view — Room/resources filter dropdown | yes — room filter dropdown |
| Screenshot 2026-03-17 at 7.23.04 pm.png | Week view — View type dropdown (Month/Week/Day) | yes — view switcher dropdown |
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_19_33.png | Calendar week view full page | yes — measurement-verified 2026-03-31: CSS module conversion fixed all regressions. Today btn 14px/38px/8px-radius match. Time labels 10px/rgb(65,69,73) match. DOW headers 14px/500/rgb(112,117,122) match. Toolbar fully styled with DS dropdowns. |
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_20_12.png | Calendar week view (variant 2) | yes — full-page capture, toolbar + time grid + practitioner columns match 2026-03-24 |
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_20_26.png | Calendar week view (variant 3) | yes — scrolled view, appointment blocks and time slots 2026-03-24 |
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_20_37.png | Calendar week view (variant 4) | yes — different scroll position, same structure 2026-03-24 |
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_23_39.png | Calendar week view (variant 5) | yes — alternate data view, structure matches 2026-03-24 |
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_23_39 (1).png | Calendar week view (variant 5 duplicate) | yes — same as variant 5 2026-03-24 |

## Calendar — Day View (`/calendar/day`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.23.10 pm.png | Day view — practitioner columns, empty | yes — day view with practitioner columns |
| screencapture-acme-splose-calendar-day-17-3-2026-2026-03-17-19_31_10.png | Calendar day view full page | yes — measurement-verified 2026-03-31: CSS module conversion fixed layout regression. Practitioner columns, time grid, appointment blocks all render correctly. Time labels 10px, prac headers 14px/rgb(112,117,122) match production. |

## Calendar — Month View (`/calendar/month`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.23.16 pm.png | Month view with appointments | yes — measurement-verified 2026-03-31: CSS module conversion fixed layout regression. 7-column grid, DOW headers 12px/rgb(112,117,122), day numbers 14px/rgb(65,69,73) all match production. Appointment chips, today badge, "more" links working. |
| Screenshot 2026-03-17 at 7.23.23 pm.png | Month view — appointment detail side panel (Group Therapy) | yes — side panel with full content |

## Calendar — Appointment Side Panel

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.23.33 pm.png | Week view — appointment detail side panel (1:1 appointment, with Edit/Reschedule/Archive actions) | yes — all content and actions implemented |
| Screenshot 2026-03-17 at 7.25.23 pm.png | Week view — edit appointment form, Room/Resource dropdown open | yes — edit form with Room/Resource dropdown |
| Screenshot 2026-03-17 at 7.25.52 pm.png | Week view — appointment side panel (alternate view) | yes — this is the "New progress note" page, not calendar side panel |

## Notes — New Progress Note (`/notes/new`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.25.45 pm.png | New progress note — Service, Template selector, Select/Copy buttons | yes — Service dropdown, autosaved badge, Save as final button, split view default 2026-03-24 |

## Notes — Edit Progress Note (`/notes/:id/edit`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.26.58 pm.png | Edit note — AI-generated Subjective section with Accept button | yes — AI blocks with Accept/Actions/feedback, Generate button all implemented 2026-03-24 |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_26_02.png | Progress note edit (variant 1) | yes — all 5 SOAP sections, AI blocks, toolbar, service selector, client info table match 2026-03-24 |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_26_18.png | Progress note edit (variant 2) | yes — expanded AI block with prompt, Actions dropdown, Generate button 2026-03-24 |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_26_27.png | Progress note edit (variant 3) | yes — scrolled view, AI blocks in various states 2026-03-24 |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_26_36.png | Progress note edit (variant 4) | yes — further scrolled, Plan/Goals sections visible 2026-03-24 |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_27_15.png | Progress note edit (variant 5) | yes — all sections accepted, content displayed directly under headings 2026-03-24 |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_27_32.png | Progress note edit (variant 6) | yes — scrolled accepted content view 2026-03-24 |

## Notes — View Progress Note (`/notes/:id/view`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.28.32 pm.png | View note — Send progress note modal | yes — Modal with template selector, edit/preview toggle, To field, Reply to, Subject, Summarise session, toolbar, body 2026-03-24 |
| Screenshot 2026-03-17 at 7.29.06 pm.png | View note — Send progress note modal (scrolled) | yes — scrollable modal content, Attach files + Send buttons in footer 2026-03-24 |
| Screenshot 2026-03-17 at 7.29.15 pm.png | View note — Send progress note modal with AI-summarised session text | yes — Summarise session generates AI summary, preview mode renders email template 2026-03-24 |
| screencapture-acme-splose-notes-32681068-view-2026-03-17-19_27_58.png | Progress note view (variant 1) | yes |
| screencapture-acme-splose-notes-32681068-view-2026-03-17-19_28_07.png | Progress note view (variant 2) | yes |

## Patients — List (`/patients`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-2026-03-17-19_29_34.png | Patients list default | yes — measurement-verified 2026-04-08: S13+S14 fixed. Search btn white, action links purple. |
| screencapture-acme-splose-patients-2026-03-17-19_29_34 (1).png | Patients list (duplicate) | yes — visual audit 2026-03-23 confirmed |

## Patients — Detail / Appointments (`/patients/:id/appointments`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-appointments-2026-03-17-19_30_08.png | Patient appointments tab | yes — visual audit 2026-03-23 confirmed; sidebar + table match |
| screencapture-acme-splose-patients-5918810-appointments-2026-03-17-19_30_23.png | Patient appointments (variant 2) | yes — visual audit 2026-03-23 confirmed |
| screencapture-acme-splose-patients-5918810-appointments-2026-03-17-19_30_36.png | Patient appointments (variant 3) | yes — visual audit 2026-03-23 confirmed |
| screencapture-acme-splose-patients-5918810-appointments-2026-03-17-19_30_45.png | Patient appointments (variant 4) | yes — visual audit 2026-03-23 confirmed |

## Patients — Detail / Details (`/patients/:id/details`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-details-2026-03-17-19_29_56.png | Patient details tab | partial — sweep 2026-04-16 S2: layout correct but sidebar has 4 issues: active bg missing (prod lavender vs localhost none), count badges wrong style (prod gray outlined vs localhost filled purple), client tags wrong (prod filled badges vs localhost text links), chevrons on wrong side. Typography correct (20px/700/green heading, 18px/700 sections). |
| screencapture-acme-splose-patients-5918810-details-2026-03-17-19_29_56 (1).png | Patient details (duplicate) | yes — visual audit 2026-03-23 confirmed |

## Patients — Detail / Communications (`/patients/:id/communications`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-communications-2026-03-17-19_31_23.png | Patient communications tab | yes — visual audit 2026-03-23 confirmed |
| screencapture-acme-splose-patients-5918810-communications-2026-03-17-19_31_35.png | Patient communications (variant 2) | yes — visual audit 2026-03-23 confirmed |

## Patients — Detail / Files (`/patients/:id/files`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-files-2026-03-17-19_31_50.png | Patient files tab | yes — 3.93% mismatch |

## Patients — Detail / Notes (`/patients/:id/notes`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-notes-2026-03-17-19_32_09.png | Patient notes tab | yes — visual audit 2026-03-23 confirmed |

## Patients — Detail / Cases (`/patients/:id/cases`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-cases-2026-03-17-19_32_26.png | Patient cases tab | yes — visual audit 2026-03-23 confirmed |

## Patients — Detail / Support Activities (`/patients/:id/support-activities`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-support-activities-2026-03-17-19_32_35.png | Patient support activities tab | yes — 3.60% mismatch |

## Patients — Detail / Forms (`/patients/:id/forms`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.33.31 pm.png | Patient forms tab, actions dropdown (View/Copy link/Open in new tab/Email form/Change log/Archive) | yes — all 6 actions in Dropdown + Archive confirmation modal 2026-03-24 |
| screencapture-acme-splose-patients-5918810-forms-2026-03-17-19_32_45.png | Patient forms tab | yes — visual audit 2026-03-23 confirmed |

## Patient Form View (`/patient-form/:id/view`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patient-form-3545217-view-2026-03-17-19_32_54.png | Patient form view (variant 1) | yes — header with title/badge/actions, Card with sections, file links, No response placeholders 2026-03-24 |
| screencapture-acme-splose-patient-form-3545217-view-2026-03-17-19_33_46.png | Patient form view (variant 2) | yes — scrolled view of same structure 2026-03-24 |

## Patients — Detail / Invoices (`/patients/:id/invoices`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-invoices-2026-03-17-19_33_57.png | Patient invoices tab | yes — visual audit 2026-03-23 confirmed |

## Patients — Detail / Payments (`/clients/:id/payments`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-payments-2026-03-17-19_34_16.png | Patient payments tab | yes — 4.01% mismatch |

## Patients — Detail / Statements (`/patients/:id/statements`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-statements-2026-03-17-19_34_27.png | Patient statements tab | yes — 3.91% mismatch |

## Patients — Detail / Letters (`/patients/:id/letters`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-letters-2026-03-17-19_34_39.png | Patient letters tab | yes — 3.40% mismatch |

## Patients — Detail / Practitioner Access (`/patients/:id/practitioner-access`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-5918810-practitioner-access-2026-03-17-19_34_47.png | Patient practitioner access tab | yes — visual audit 2026-03-23 confirmed |
| screencapture-acme-splose-patients-5918810-practitioner-access-2026-03-17-19_34_47 (1).png | Patient practitioner access (duplicate) | yes — visual audit 2026-03-23 confirmed |

---

# March 11 Screenshots (Production + Dev Environment)

## Login Page (`/login`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 10.53.42 am.png | Login page — desktop, default | partial — 15.15% after bg-purple-300 fix, remaining diff is SVG illustration vs real image + scaling |
| Screenshot 2026-03-11 at 10.53.50 am.png | Login page — mobile (iPhone) | partial |

## Settings — Landing Page (`/settings`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 10.56.57 am.png | Settings landing — desktop, full sidebar visible | yes — visual audit 2026-03-23 confirmed; sidebar groups and content match |
| Screenshot 2026-03-11 at 11.00.35 am.png | Settings landing — mobile, category tabs visible | partial |
| Screenshot 2026-03-11 at 11.00.46 am.png | Settings landing — mobile, overflow menu (Team/Templates/Finances/Data) | partial |

## Dashboard (`/`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.02.16 am.png | Dashboard — desktop, Messages feed + Income chart + Incomplete progress notes + Recently submitted forms | yes — measurement-verified 2026-04-08: S16+S17 fixed. Author 14px/700, Send btn 38px/8px, timestamp/date colors rgb(65,69,73), Load more purple. |
| Screenshot 2026-03-11 at 11.02.24 am.png | Dashboard — mobile in desktop browser frame, Messages with GIF | yes |
| Screenshot 2026-03-11 at 11.08.47 am.png | Dashboard — mobile, Income chart + Incomplete progress notes (scrolled) | yes |
| Screenshot 2026-03-11 at 11.09.05 am.png | Dashboard — desktop, Messages feed (scrolled) with tooltip on income chart | yes |

## Clients List (`/clients`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.09.27 am.png | Clients list — desktop, default view | yes — measurement-verified 2026-04-08: S13+S14 fixed. Search btn white bg/rgba(0,0,0,0.45), "New client" purple rgb(130,80,255). Title/th/td unchanged. |
| Screenshot 2026-03-11 at 11.09.33 am.png | Clients list — desktop, near-identical | yes |
| Screenshot 2026-03-11 at 11.09.39 am.png | Clients list — mobile (iPhone) | yes |
| Screenshot 2026-03-11 at 11.09.47 am.png | Clients list — mobile, scrolled right to Phone/Email columns | yes |
| Screenshot 2026-03-11 at 11.10.08 am.png | Clients list — desktop, Tags filter dropdown open | partial — standalone filter bar removed in Phase 4; filtering now via Th column filterable prop. Different UI pattern (column icons vs dropdown bar) |
| Screenshot 2026-03-11 at 11.10.24 am.png | Clients list — desktop, Active/Archived status dropdown open | partial — standalone filter bar removed; column-level filtering via Th props. Different UI pattern |

## Client Detail — Details (`/clients/:id`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.10.50 am.png | Client detail — desktop, Details tab (General details, Account balance, Client alerts, Stripe, Mailchimp) | yes — measurement-verified 2026-04-08: S15 fixed. "General details" 18px/700 exact match. Layout/sidebar unchanged. |
| Screenshot 2026-03-11 at 11.11.01 am.png | Client detail — desktop, Details tab (scrolled: Medications, Medicare, Custom fields, Invoicing, Associated contacts) | yes |
| Screenshot 2026-03-11 at 11.15.13 am.png | Client detail (Skyler Peterson) — desktop, Details tab, different client with more data | yes |

## Client Detail — Edit Details (`/clients/:id/edit`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.11.08 am.png | Client edit details — desktop, Edit form (General details, Profile photo, DOB, Sex, Gender, Pronouns) | yes — 4.99% |

## Client Detail — Appointments (`/clients/:id/appointments`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.11.17 am.png | Client appointments tab — desktop | yes |
| Screenshot 2026-03-11 at 11.12.37 am.png | Client appointments tab — desktop, appointment side panel open | yes — AppointmentSidePanel with structured details, action buttons, Status DS component 2026-03-24 |
| Screenshot 2026-03-11 at 11.15.20 am.png | Client appointments (Skyler Peterson) — desktop, with Upcoming/Cancelled badges | yes — appointment table with status badges, side panel on click 2026-03-24 |

## Client Detail — Progress Notes (`/clients/:id/notes`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.11.34 am.png | Client progress notes tab — desktop, list with Draft/Final badges | yes |

## Client Detail — Cases (`/clients/:id/cases`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.12.27 am.png | Client cases tab — desktop, list with case numbers, types (Budget/Hours/Appointments) | yes |

## Client Detail — Forms (`/clients/:id/forms`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.12.53 am.png | Client forms tab — desktop, list with Incomplete badges | yes |

## Client Detail — Invoices (`/clients/:id/invoices`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.12.59 am.png | Client invoices tab — desktop | yes |

## Client Detail — Practitioner Access (`/clients/:id/practitioner-access`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.13.09 am.png | Client practitioner access tab — desktop, with Account owner badges | yes |

## Contacts List (`/contacts`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.13.20 am.png | Contacts list — desktop, with row highlighted | yes — 2026-04-08: S13 fixed systemically. Search btn white. |
| Screenshot 2026-03-11 at 11.14.04 am.png | Contacts list — desktop, no highlight | yes — structure matches |

## Contact Detail (`/contacts/:id`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.14.14 am.png | Contact detail (NDIS) — desktop, Details tab with Associated clients | yes — measurement-verified 2026-04-01: "Contact" label 20px/700/green PASS (main content h2), "Details" heading 30px/700/green PASS. S5 fix resolved. |
| Screenshot 2026-03-11 at 11.14.21 am.png | Contact invoices tab — desktop | yes — Invoices tab with count, Associated clients table with Invoices column 2026-03-24 |

## Invoices List (`/invoices`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.14.32 am.png | Invoices list — desktop, with Overdue/Paid/Draft badges | yes — 2026-04-08: S13+S14 fixed systemically. Search btn white, links purple. |
| Screenshot 2026-03-11 at 11.14.41 am.png | Invoices list — mobile (iPhone) | partial |
| Screenshot 2026-03-11 at 11.14.52 am.png | Invoices list — mobile, expanded row showing Payment sub-row | partial |

## Invoice View (`/invoices/:id`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.16.02 am.png | Invoice view — desktop, Overdue invoice PDF-style with Pay/Email/Actions buttons | partial — sweep 2026-04-16 S2: invoice # heading 30px/700/green still correct, but REGRESSIONS: status label ("Draft invoice") 30px/700 vs prod 26px/500, section labels (Client/From/etc.) 14px/rgb(110,110,100) vs prod 13px/rgb(65,69,73), Note heading 18px vs prod 21px. New S22 gap. |
| Screenshot 2026-03-11 at 11.16.10 am.png | Invoice view — desktop, Pay dropdown open | yes — Pay Dropdown with Record payment/Send payment link items 2026-03-24 |
| Screenshot 2026-03-11 at 11.16.17 am.png | Invoice view — desktop, Actions dropdown open | yes — Actions Dropdown with Duplicate/Credit note/Change log/Void items 2026-03-24 |

## Add Payment (`/payments/new`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.16.25 am.png | Add payment to invoice — desktop, form with location/date/method/amount | yes — fidelity fix 2026-04-01: title "Add payment" 30px/700/green PASS. Labels now 14px/600/rgb(34,34,34) PASS (DS components updated). |

## Payments List (`/payments`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.17.41 am.png | Payments list — desktop, default view with Credit badges | yes — 2026-04-08: S13 fixed systemically. Search btn white. |
| Screenshot 2026-03-11 at 11.17.47 am.png | Payments list — desktop, expanded row showing Invoice sub-row | yes — expandable rows with invoice sub-rows implemented 2026-03-24 |

## Reports — Performance Overview (`/reports`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.17.57 am.png | Performance overview — desktop, Utilisation + Revenue charts + Practitioners table | yes — measurement-verified 2026-04-01: S6 fix applied. Title green PASS. Card headings (Utilisation/Revenue) 20px/700 PASS. Sidebar section headers rgb(65,69,73) vs prod rgb(0,0,0) minor note. |
| Screenshot 2026-03-11 at 11.18.04 am.png | Performance overview — desktop, date picker calendar open | partial — native date input exists, custom calendar picker not implemented |
| Screenshot 2026-03-11 at 11.18.09 am.png | Performance overview — desktop, Frequency dropdown (Daily/Weekly/Monthly/Quarterly/Yearly) | yes — FormSelect with Daily/Weekly/Monthly/Quarterly/Yearly options 2026-03-24 |
| Screenshot 2026-03-11 at 11.18.15 am.png | Performance overview — desktop, All locations dropdown | yes — FormSelect with location options 2026-03-24 |
| Screenshot 2026-03-11 at 11.18.21 am.png | Performance overview — desktop, All practitioners dropdown | yes — FormSelect with practitioner options 2026-03-24 |
| Screenshot 2026-03-11 at 11.18.28 am.png | Performance overview — desktop, Compare mode with % change arrows | yes — Compare toggle button implemented 2026-03-24 |
| Screenshot 2026-03-11 at 11.18.34 am.png | Performance overview — desktop, Compare mode, Utilisation settings popover | yes — Utilisation settings popover with 3 checkboxes (Exclude busy time, Exclude do not invoice, Include invoiced cancellations/DNAs) implemented 2026-03-24 |

## Reports — Appointments (`/reports/appointments`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.18.50 am.png | Reports Appointments — desktop, Add filter dropdown open | yes — Dropdown with Status/Service type/Location/Practitioner filter options, filter chips with remove 2026-03-24 |

## Reports — Progress Notes (`/reports/progress-notes`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.19.07 am.png | Reports Progress notes — desktop, empty (before running) | yes — date range, Add filter/Save filters/Load filters/Run report buttons 2026-03-24 |
| Screenshot 2026-03-11 at 11.19.15 am.png | Reports Progress notes — desktop, results with pie charts | yes — stat cards + summary tables with SVG pie charts + note template/practitioner breakdown 2026-03-24 |
| Screenshot 2026-03-11 at 11.19.22 am.png | Reports Progress notes — desktop, scrolled to list table | yes — DataTable with Title/Client/Related service/Practitioner/Location columns 2026-03-24 |

## Reports — Performance (`/reports/performance`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.19.46 am.png | Reports Performance — desktop, filter form (before running) | yes — filter form with date range, location, practitioner dropdowns 2026-03-24 |
| Screenshot 2026-03-11 at 11.19.54 am.png | Reports Performance — desktop, Definitions modal open | yes — Definitions modal with close button implemented 2026-03-24 |
| Screenshot 2026-03-11 at 11.21.02 am.png | Reports Performance — desktop, results table + Export CSV dropdown | yes — results table + Export Dropdown with CSV/PDF options 2026-03-24 |
| Screenshot 2026-03-11 at 11.21.26 am.png | Reports Performance — desktop, Export performance modal | yes — Export Dropdown with export-started toast notification 2026-03-24 |

## Waitlist — Screener (`/waitlist`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.21.40 am.png | Waitlist Screener tab — desktop, Triage list | yes — 2026-04-08: S13 fixed systemically. Search btn white. |

## Waitlist — Waitlist Tab (`/waitlist`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.21.50 am.png | Waitlist tab — desktop, Active list with tags, Map button | yes — Active/Closed tabs, tags column, Map toggle, search, pagination 2026-03-24 |
| Screenshot 2026-03-11 at 11.22.02 am.png | Waitlist tab — desktop, Map view (Google Maps with pins) | partial — Map toggle exists, placeholder map view |
| Screenshot 2026-03-11 at 11.22.17 am.png | Waitlist tab — desktop, scrolled right, Actions dropdown | yes — Actions column with Dropdown (Edit/Remove) on each row 2026-03-24 |
| Screenshot 2026-03-11 at 11.22.31 am.png | Waitlist tab — desktop, Update client modal | yes — Update client modal with Location/Practitioner/Client/Date/Service/Preferred days+time/Note/Tags fields 2026-03-24 |

## Products (`/products`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.22.40 am.png | Products list — desktop, default view | yes — 2026-04-08: S13 fixed systemically. Search btn white. |
| Screenshot 2026-03-11 at 11.22.46 am.png | Products list — desktop, expanded product row showing variants | yes — expandable rows with variant sub-rows implemented 2026-03-24 |
| Screenshot 2026-03-11 at 11.22.51 am.png | Products list — desktop, Manage Stock modal | yes — Manage Stock modal with Location/Available/Track stock/Count/Actions table, 6 locations, pagination, Cancel/OK buttons 2026-03-24 |

## Calendar — Week View (`/calendar`) — March 11

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 5.52.22 pm.png | Calendar week view — desktop, Feb 2026, with appointments | yes — week view with practitioner columns, time grid, appointment blocks 2026-03-24 |
| Screenshot 2026-03-11 at 5.52.31 pm.png | Calendar week view — desktop, Week/Month/Day dropdown open | yes — view switcher Dropdown with Month/Week/Day options 2026-03-24 |

## Calendar — Day View (`/calendar`) — March 11

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 5.52.47 pm.png | Calendar day view — desktop, practitioner columns | yes — day view with practitioner column headers 2026-03-24 |
| Screenshot 2026-03-11 at 5.52.53 pm.png | Calendar day view — desktop, appointment side panel open | yes — side panel with structured content and action buttons 2026-03-24 |
| Screenshot 2026-03-11 at 5.52.59 pm.png | Calendar day view — desktop, Edit appointment modal | yes — edit modal with all fields including Room/Resource 2026-03-24 |
| Screenshot 2026-03-11 at 5.53.13 pm.png | Calendar day view — desktop, click-to-create popover | yes — popover with Support activity/Busy time/Appointment options 2026-03-24 |
| Screenshot 2026-03-11 at 5.53.18 pm.png | Calendar day view — zoomed close-up of create popover | yes — popover matches reference layout 2026-03-24 |
| Screenshot 2026-03-11 at 5.53.25 pm.png | Calendar day view — desktop, Create appointment modal (empty) | yes — modal has Service, Location, Case, Room/Resource, toggles, past date warning 2026-03-24 |
| Screenshot 2026-03-11 at 5.53.59 pm.png | Calendar day view — desktop, Create appointment modal (client selected, Service dropdown) | yes — Service field implemented 2026-03-24 |
| Screenshot 2026-03-11 at 5.54.19 pm.png | Calendar day view — desktop, Create appointment modal (service selected, toggles, past date warning) | yes — toggles and past date warning implemented 2026-03-24 |

## Notes — New Progress Note (`/notes/new`) — March 11

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 5.54.43 pm.png | New progress note — desktop, empty with Service pre-filled, Template selector | yes — single Service dropdown, autosaved badge, Save as final button, split view 2026-03-24 |

## Notes — Edit Progress Note (`/notes/:id/edit`) — March 11

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 5.55.16 pm.png | Edit progress note — desktop, AI blocks, Splose AI chat panel open | yes — AI chat side panel with "Hello, I'm splose AI" greeting, 3 quick-action pills, input field, Saved prompts button 2026-03-24 |
| Screenshot 2026-03-11 at 5.55.39 pm.png | Edit progress note — desktop, AI chat response visible, AI blocks promo tooltip | partial — AI chat panel implemented, chat responses and promo tooltip not yet interactive |

## Notes — View Progress Note (`/notes/:id/view`) — March 11

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 5.56.02 pm.png | View progress note — desktop, Final badge, Revert to draft + Actions buttons | yes |

## Settings — Splose AI (`/settings/ai`) — March 11

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 5.56.20 pm.png | Settings AI — Preferences tab with toggles | yes |
| Screenshot 2026-03-11 at 5.56.25 pm.png | Settings AI — Saved prompts tab, prompts list | yes |
| Screenshot 2026-03-11 at 5.56.30 pm.png | Settings AI — AI block library tab (BETA), empty state | yes |
