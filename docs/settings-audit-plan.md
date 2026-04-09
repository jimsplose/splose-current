# Settings Pages Exhaustive Audit Plan

Multi-session plan to audit every settings page through the full 4-flow verification workflow (Screenshot Overlay, Structural Checklist, CSS Measurement, DS Audit). Estimated 8-10 sessions.

## Scope

- **27 top-level settings pages** + **~10 sub-pages** (edit, new, detail views)
- **4 flows per page** per `docs/compare-pages-workflow.md`
- **2-3 pages per batch**, 1 batch per session
- **Viewport:** 1440x900 (canonical)

## Current State

All settings catalog entries currently show "yes" but these are from **visual-only audits in March 2026**. None have been through the full 4-flow verification. This audit will either confirm them or downgrade to "partial"/"no" with specific action items.

## Complexity Tiers

Pages are categorized to balance session workload:

| Tier | Description | Pages |
|------|-------------|-------|
| **Simple** | SettingsListPage template, useFormModal — same structure | Communication Types, Busy Times, Cancellation Reasons, Referral Types, User Groups, Rooms/Resources, Body Charts, Tax Rates |
| **Medium** | List page + edit/new sub-pages | Locations, Services, Forms, Appointment Templates, Email Templates, Progress Notes, Letter Templates |
| **Complex** | Multi-section forms, multi-tab pages | Details, AI (3 tabs), Online Bookings (list + 3-tab editor), Users (list + 3-tab detail), Payment Settings, Invoice Settings |
| **Standalone** | Simple single-view pages | Integrations, SMS Settings, Custom Fields, Data Export, Data Import, Landing Page |

## Session Plan

Each session audits 2-3 page groups. Sessions are ordered to start with complex/high-value pages and end with simpler ones, so that early sessions surface the most impactful issues.

---

### Session 1: Settings Layout + Workspace

**Pages:** Settings sidebar/layout, Details, Integrations, SMS Settings
**Complexity:** 1 complex + 2 standalone = moderate
**Sub-pages:** None

| # | Page | Localhost Route | Production Route | Template | Complexity |
|---|------|----------------|------------------|----------|------------|
| 1 | Settings Layout/Sidebar | `/settings` | `/settings` | Custom (SideNav) | Complex |
| 2 | Details | `/settings/details` | `/settings/details` | Custom form | Complex |
| 3 | Integrations | `/settings/integrations` | `/settings/integrations` | Custom list | Standalone |

**Notes:**
- Layout audit covers the sidebar navigation (8 sections, 27 items) — verified once, applies everywhere
- SMS Settings deferred to session 2 to keep batch at 3 pages
- Details page has business info, notification toggles, history — multi-section form

**Pre-session checklist:**
- [ ] Dev server running on localhost:3000
- [ ] Chrome MCP available
- [ ] Production auth confirmed (acme.splose.com loads dashboard)
- [ ] Viewport set to 1440x900

---

### Session 2: Workspace (cont.) + Automation

**Pages:** SMS Settings, Forms (list + view + settings sub-pages), AI
**Complexity:** 1 standalone + 1 medium + 1 complex = high
**Sub-pages:** Forms has 3 sub-pages (list, [id] view/edit, [id] settings tab)

| # | Page | Localhost Route | Production Route | Template | Complexity |
|---|------|----------------|------------------|----------|------------|
| 1 | SMS Settings | `/settings/sms-settings` | `/settings/smsSettings` | Custom form | Standalone |
| 2 | Forms (list) | `/settings/forms` | `/settings/templates/forms` | SettingsListPage | Simple |
| 2a | Form View | `/settings/forms/[id]` | `/settings/templates/forms/:id/view` | Custom (form builder) | Medium |
| 3 | AI | `/settings/ai` | `/settings/ai` | Custom (3 tabs) | Complex |

**Notes:**
- Forms sub-page has a form builder UI with drag handles, field types — complex layout
- AI page has 3 tabs: Preferences, Saved Prompts, AI Block Library
- Route difference: production uses `/settings/templates/forms`, localhost uses `/settings/forms`

---

### Session 3: Business — Locations, Custom Fields, Rooms/Resources

**Pages:** Locations (list + edit), Custom Fields, Rooms/Resources
**Complexity:** 1 medium + 2 standalone/simple = moderate
**Sub-pages:** Locations edit (`/settings/locations/edit/[id]`)

| # | Page | Localhost Route | Production Route | Template | Complexity |
|---|------|----------------|------------------|----------|------------|
| 1 | Locations (list) | `/settings/locations` | `/settings/locations` | SettingsListPage | Simple |
| 1a | Location Edit | `/settings/locations/edit/[id]` | `/settings/locations/edit/:id` | Custom form | Medium |
| 2 | Custom Fields | `/settings/custom-fields` | `/settings/custom-fields` | Custom list | Standalone |
| 3 | Rooms/Resources | `/settings/rooms-resources` | `/settings/rooms-resources` | SettingsListPage | Simple |

**Notes:**
- Locations edit is a full form page (address, phone, business hours)
- Custom Fields may have a unique layout (field type configuration)
- Rooms/Resources uses SettingsListPage with STANDARD_SETTINGS dropdown

---

### Session 4: Business — Services, Busy Times, Cancellation Reasons

**Pages:** Services (list + edit), Busy Times, Cancellation Reasons
**Complexity:** 1 medium + 2 simple = moderate
**Sub-pages:** Services edit (`/settings/services/edit/[id]`)

| # | Page | Localhost Route | Production Route | Template | Complexity |
|---|------|----------------|------------------|----------|------------|
| 1 | Services (list) | `/settings/services` | `/settings/services` | SettingsListPage | Simple |
| 1a | Service Edit | `/settings/services/edit/[id]` | `/settings/services/edit/:id` | Custom form | Medium |
| 2 | Busy Times | `/settings/busy-times` | `/settings/busy-times` | SettingsListPage | Simple |
| 3 | Cancellation Reasons | `/settings/cancellation-reasons` | `/settings/cancellationReasons` | SettingsListPage | Simple |

**Notes:**
- Service Edit has Online Payment + Notifications sections (enriched 2026-03-24)
- Route difference: production uses `/settings/cancellationReasons` (camelCase)
- All three list pages use SettingsListPage template — good for pattern comparison

---

### Session 5: Business — Online Bookings, Communication Types, Tags

**Pages:** Online Bookings (list + edit), Communication Types, Tags
**Complexity:** 1 complex + 2 simple = high (Online Bookings edit is the most complex settings sub-page)
**Sub-pages:** Online Bookings edit (`/settings/online-bookings/[id]`) — 3-tab editor

| # | Page | Localhost Route | Production Route | Template | Complexity |
|---|------|----------------|------------------|----------|------------|
| 1 | Online Bookings (list) | `/settings/online-bookings` | `/settings/online-booking` | SettingsListPage | Simple |
| 1a | Online Booking Edit | `/settings/online-bookings/[id]` | `/settings/online-booking/:id` | Custom (3-tab) | Complex |
| 2 | Communication Types | `/settings/communication-types` | `/settings/communications/types` | SettingsListPage | Simple |
| 3 | Tags | `/settings/tags` | `/settings/tags` | SettingsListPage (4 tabs) | Simple |

**Notes:**
- Online Booking Edit has Design/Builder/Share tabs with logo upload, color picker, live preview
- Route differences: production `/settings/online-booking` (singular), `/settings/communications/types` (nested)
- Tags has 4 tabs: Client, Service, Waitlist, AI — each tab needs verification
- 5 production screenshots exist for Online Booking Edit variants

---

### Session 6: Business (cont.) + Team

**Pages:** Referral Types, Users (list + details/availability/body-charts), User Groups
**Complexity:** 1 simple + 1 complex + 1 simple = moderate-high
**Sub-pages:** User details (`/settings/users/[id]`) — 3 tabs

| # | Page | Localhost Route | Production Route | Template | Complexity |
|---|------|----------------|------------------|----------|------------|
| 1 | Referral Types | `/settings/referral-types` | `/settings/referralTypes` | SettingsListPage | Simple |
| 2 | Users (list) | `/settings/users` | `/settings/users` | Custom list | Medium |
| 2a | User Details | `/settings/users/[id]` | `/settings/users/:id/details` | Custom (3 tabs) | Complex |
| 3 | User Groups | `/settings/user-groups` | `/settings/user-groups` | SettingsListPage | Simple |

**Notes:**
- User Details has Details/Availability/Body Charts tabs
- Availability tab has a week calendar grid with coloured blocks — complex layout
- Route difference: production uses `/settings/referralTypes` (camelCase)
- User list page already uses PageHeader (measurement-verified 2026-04-01)

---

### Session 7: Templates — Appointments, Emails, Progress Notes

**Pages:** Appointment Templates (list + edit + new), Email Templates (list + edit), Progress Notes (list + edit)
**Complexity:** 3 medium = moderate-high
**Sub-pages:** 5 total (edit/new views for each template type)

| # | Page | Localhost Route | Production Route | Template | Complexity |
|---|------|----------------|------------------|----------|------------|
| 1 | Appointment Templates (list) | `/settings/appointment-templates` | `/settings/templates/appointments` | SettingsListPage | Simple |
| 1a | Appt Template Edit | `/settings/appointment-templates/edit/[id]` | `/settings/templates/appointments/edit/:id` | Custom (RichTextEditor) | Medium |
| 2 | Email Templates (list) | `/settings/email-templates` | `/settings/templates/emails` | SettingsListPage | Simple |
| 2a | Email Template Edit | `/settings/email-templates/edit/[id]` | `/settings/templates/emails/edit/:id` | Custom (RichTextEditor) | Medium |
| 3 | Progress Notes (list) | `/settings/progress-notes` | `/settings/templates/progress-notes` | SettingsListPage | Simple |
| 3a | Progress Note Edit | `/settings/progress-notes/edit/[id]` | `/settings/templates/progress-notes/edit/:id` | Custom (AI blocks) | Medium |

**Notes:**
- All three list pages use SettingsListPage with STANDARD_SETTINGS dropdown
- Edit pages all have RichTextEditor — good for cross-page consistency check
- Route difference: production uses `/settings/templates/` prefix for all template routes
- Appointment Template Edit has SMS + Email sections
- Progress Note Edit has AI blocks with Sparkles icons

---

### Session 8: Templates (cont.) + Finances

**Pages:** Letter Templates (list + edit), Body Charts, Payment Settings, Invoice Settings
**Complexity:** 1 medium + 1 simple + 2 complex = high
**Sub-pages:** Letter Templates edit

| # | Page | Localhost Route | Production Route | Template | Complexity |
|---|------|----------------|------------------|----------|------------|
| 1 | Letter Templates (list) | `/settings/letter-templates` | `/settings/templates/letters` | SettingsListPage | Simple |
| 1a | Letter Template Edit | `/settings/letter-templates/edit/[id]` | `/settings/templates/letters/edit/:id` | Custom (RichTextEditor) | Medium |
| 2 | Body Charts | `/settings/body-charts` | `/settings/templates/body-charts` | SettingsListPage | Simple |
| 3 | Payment Settings | `/settings/payment-settings` | `/settings/payments` | Custom form | Complex |

**Notes:**
- Payment Settings has multi-section layout: payment types, prefix/padding, PDF settings
- Grade C inline style count (needs DS audit focus)
- Letter Template Edit has recipient fields + clinical variable insertion
- Route differences: production `/settings/templates/letters`, `/settings/payments`

---

### Session 9: Finances (cont.) + Data

**Pages:** Invoice Settings, Tax Rates, Data Export, Data Import
**Complexity:** 1 complex + 1 simple + 2 standalone = moderate
**Sub-pages:** None

| # | Page | Localhost Route | Production Route | Template | Complexity |
|---|------|----------------|------------------|----------|------------|
| 1 | Invoice Settings | `/settings/invoice-settings` | `/settings/invoices` | Custom form | Complex |
| 2 | Tax Rates | `/settings/tax-rates` | `/settings/tax-rates` | SettingsListPage | Simple |
| 3 | Data Export | `/settings/data-export` | `/settings/export` | Custom | Standalone |
| 4 | Data Import | `/settings/data-import` | `/settings/import` | Custom | Standalone |

**Notes:**
- Invoice Settings has tax dropdown, reminder list, template sections — multi-section form
- Grade C inline style count on Invoice Settings (needs DS audit focus)
- Data Export already uses PageHeader (measurement-verified 2026-04-01)
- Route differences: production `/settings/invoices`, `/settings/export`, `/settings/import`

---

### Session 10: Landing Page + Re-verification Sweep

**Pages:** Settings Landing Page + any pages downgraded in sessions 1-9
**Complexity:** Variable — depends on re-check volume

| # | Page | Localhost Route | Production Route | Template | Complexity |
|---|------|----------------|------------------|----------|------------|
| 1 | Settings Landing | `/settings` | `/settings` | Custom (EmptyState) | Standalone |
| 2-3 | Re-checks | TBD | TBD | TBD | TBD |

**Notes:**
- Landing page has 2 mobile screenshots marked "partial" in catalog
- Re-verify any pages downgraded to "partial" or "no" during sessions 1-9
- Consolidate all fidelity gaps into prioritized fix list
- Write final summary report

---

## Per-Session Protocol

Every session follows this exact sequence:

```
1. Sync: git fetch origin main && git merge origin/main --no-edit
2. Prerequisites: dev server, Chrome MCP, production auth, viewport 1440x900
3. Pick batch from this plan (next incomplete session)
4. For each page in batch:
   a. Set up dual tabs (production + localhost)
   b. Flow 1: Screenshot Overlay
   c. Flow 2: Structural Checklist
   d. Flow 3: CSS Measurement (10-15 elements)
   e. Flow 4: DS Audit (read source, grade A/B/C)
   f. Write verification log
5. Update screenshot-catalog.md (Match column)
6. Update/create fidelity-gaps.md entries
7. Commit catalog + gap updates
8. Report: pages compared, verdicts, action item count
```

## Tracking

After each session, update this table:

| Session | Status | Pages Audited | Verdicts | Action Items | Date |
|---------|--------|---------------|----------|--------------|------|
| 1 | **done** | Sidebar, Details, Integrations | partial, partial, no | 17 | 2026-04-09 |
| 2 | pending | — | — | — | — |
| 3 | pending | — | — | — | — |
| 4 | pending | — | — | — | — |
| 5 | pending | — | — | — | — |
| 6 | pending | — | — | — | — |
| 7 | pending | — | — | — | — |
| 8 | pending | — | — | — | — |
| 9 | pending | — | — | — | — |
| 10 | pending | — | — | — | — |

## Known Issues to Watch For

These were flagged in prior work and should get extra scrutiny:

1. **Grade C pages** (high inline style count): Details (62), Data Import (52), Online Bookings Edit (51), Forms Edit (43) — DS Audit (Flow 4) is critical for these
2. **Mobile screenshots** marked "partial": Settings Landing (2 entries) — desktop-only scope but note the gap
3. **Route naming mismatches**: Several pages have camelCase (production) vs kebab-case (localhost) — ensure both resolve correctly
4. **SettingsListPage consistency**: 17+ pages share this template — issues found on one likely affect all

## Estimated Total Coverage

| Metric | Count |
|--------|-------|
| Top-level pages | 27 |
| Sub-pages (edit/new/detail) | ~10 |
| Total page views to audit | ~37 |
| Flows per page | 4 |
| Total flow executions | ~148 |
| Sessions | 8-10 |
| Pages per session | 3-4 (including sub-pages) |
