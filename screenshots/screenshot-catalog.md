# Screenshot Catalog

Organized by page/feature. Each entry includes filename, route, state/variant, and whether the prototype matches.

**Match key:** `yes` = prototype page exists and closely matches, `partial` = page exists but needs fidelity work, `no` = no prototype page for this feature yet.

**Sources:** March 11 screenshots from production (`acme.splose.com`) and dev environment. March 17 screenshots from production.

---

## Settings — Details (`/settings/details`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.39.04 pm.png | Business history modal open | yes — implemented 2026-03-24, Modal with history entries |
| screencapture-acme-splose-settings-details-2026-03-17-18_33_39.png | Details page default view | yes — visual audit 2026-03-23 confirmed structural match; pixel diff from viewport vs full-page scroll |

## Settings — Integrations (`/settings/integrations`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-settings-integrations-2026-03-17-18_34_17.png | Integrations list default | yes — visual audit 2026-03-23 confirmed structural match; pixel diff from viewport scroll |

## Settings — SMS Settings (`/settings/smsSettings`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-settings-smsSettings-2026-03-17-18_34_37.png | SMS settings default view | yes — visual audit 2026-03-23 confirmed structural match |
| screencapture-acme-splose-settings-smsSettings-2026-03-17-18_39_35.png | SMS settings alternate view | yes — visual audit 2026-03-23 confirmed |

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
| screencapture-acme-splose-settings-ai-2026-03-17-18_36_17.png | AI Preferences tab | yes |
| screencapture-acme-splose-settings-ai-2026-03-17-18_36_41.png | AI settings alternate view | yes |
| screencapture-acme-splose-settings-ai-2026-03-17-18_37_14.png | AI settings alternate view 2 | yes |
| Screenshot 2026-03-17 at 6.44.00 pm.png | Saved prompts tab, actions dropdown (Edit/Change log/Delete) | yes — dropdown with edit/delete exists on AI page |
| Screenshot 2026-03-17 at 6.44.10 pm.png | Edit prompt modal | yes — edit prompt modal exists |
| Screenshot 2026-03-17 at 6.44.22 pm.png | AI block library tab, list of saved blocks | yes — AI block library tab with block list |
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
| Screenshot 2026-03-17 at 6.46.36 pm.png | Services list with item codes, durations, prices | yes — visual audit 2026-03-23 confirmed; diff from browser chrome |
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
| Screenshot 2026-03-17 at 6.47.48 pm.png | Busy time types list | yes — visual audit 2026-03-23 confirmed; diff from browser chrome |
| Screenshot 2026-03-17 at 6.47.55 pm.png | Busy time types, actions dropdown (Edit/Archive) | yes — STANDARD_SETTINGS dropdown exists |
| Screenshot 2026-03-17 at 6.48.02 pm.png | Edit busy time type modal (with color picker) | yes — modal with FormColorPicker exists |

## Settings — Cancellation Reasons (`/settings/cancellationReasons`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 6.48.12 pm.png | Cancellation reasons list with edit/delete icons | yes — visual audit 2026-03-23 confirmed |
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
| Screenshot 2026-03-17 at 6.51.37 pm.png | Select a location step — default | partial |
| Screenshot 2026-03-17 at 6.51.45 pm.png | Select a location step — location selected | partial |
| screencapture-acme-splose-online-booking-7b2c0db8-cb7b-40de-991e-631ecdb30cf0-2026-03-17-18_51_53.png | Online booking public page (variant 1) | partial |
| screencapture-acme-splose-online-booking-7b2c0db8-cb7b-40de-991e-631ecdb30cf0-2026-03-17-18_52_17.png | Online booking public page (variant 2) | partial |

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
| screencapture-acme-splose-settings-users-2026-03-17-18_56_54.png | Users list default | yes — visual audit 2026-03-23 confirmed; Th sortable/filterable added |

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
| Screenshot 2026-03-17 at 7.05.34 pm.png | Edit progress note template — AI blocks with Actions dropdown | partial — blocks have remove button, no per-block actions dropdown |
| Screenshot 2026-03-17 at 7.05.42 pm.png | AI block Actions menu (Load from library/Duplicate/Save to library) | partial — library modal exists, per-block actions menu not yet |
| Screenshot 2026-03-17 at 7.06.21 pm.png | AI block library modal — list of blocks | yes — library modal with 6 blocks 2026-03-24 |
| Screenshot 2026-03-17 at 7.06.30 pm.png | AI block library modal — block selected | yes — clicking block adds it |
| Screenshot 2026-03-17 at 7.06.55 pm.png | AI block library modal — filter by tag dropdown | partial — library exists but no tag filter |
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
| screencapture-acme-splose-settings-export-2026-03-17-19_12_04.png | Data export full page | yes — visual audit 2026-03-23 confirmed |

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
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_19_33.png | Calendar week view full page | yes — visual audit 2026-03-23 confirmed; toolbar, time grid, practitioner columns match |
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_20_12.png | Calendar week view (variant 2) | partial |
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_20_26.png | Calendar week view (variant 3) | partial |
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_20_37.png | Calendar week view (variant 4) | partial |
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_23_39.png | Calendar week view (variant 5) | partial |
| screencapture-acme-splose-calendar-week-17-3-2026-2026-03-17-19_23_39 (1).png | Calendar week view (variant 5 duplicate) | partial |

## Calendar — Day View (`/calendar/day`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.23.10 pm.png | Day view — practitioner columns, empty | yes — day view with practitioner columns |
| screencapture-acme-splose-calendar-day-17-3-2026-2026-03-17-19_31_10.png | Calendar day view full page | yes — visual audit 2026-03-23 confirmed; toolbar icons fixed, day layout matches |

## Calendar — Month View (`/calendar/month`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.23.16 pm.png | Month view with appointments | partial — 11.54%, month grid renders correctly, diff is data-driven (different appointments/dates) |
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
| Screenshot 2026-03-17 at 7.26.58 pm.png | Edit note — AI-generated Subjective section with Accept button | partial |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_26_02.png | Progress note edit (variant 1) | partial |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_26_18.png | Progress note edit (variant 2) | partial |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_26_27.png | Progress note edit (variant 3) | partial |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_26_36.png | Progress note edit (variant 4) | partial |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_27_15.png | Progress note edit (variant 5) | partial |
| screencapture-acme-splose-notes-32681068-edit-2026-03-17-19_27_32.png | Progress note edit (variant 6) | partial |

## Notes — View Progress Note (`/notes/:id/view`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-17 at 7.28.32 pm.png | View note — Send progress note modal | partial |
| Screenshot 2026-03-17 at 7.29.06 pm.png | View note — Send progress note modal (scrolled) | partial |
| Screenshot 2026-03-17 at 7.29.15 pm.png | View note — Send progress note modal with AI-summarised session text | partial |
| screencapture-acme-splose-notes-32681068-view-2026-03-17-19_27_58.png | Progress note view (variant 1) | yes |
| screencapture-acme-splose-notes-32681068-view-2026-03-17-19_28_07.png | Progress note view (variant 2) | yes |

## Patients — List (`/patients`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patients-2026-03-17-19_29_34.png | Patients list default | yes — visual audit 2026-03-23 confirmed; columns, layout, search match |
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
| screencapture-acme-splose-patients-5918810-details-2026-03-17-19_29_56.png | Patient details tab | yes — visual audit 2026-03-23 confirmed; sidebar restored, layout matches |
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
| Screenshot 2026-03-17 at 7.33.31 pm.png | Patient forms tab, actions dropdown (View/Copy link/Open in new tab/Email form/Change log/Archive) | partial |
| screencapture-acme-splose-patients-5918810-forms-2026-03-17-19_32_45.png | Patient forms tab | yes — visual audit 2026-03-23 confirmed |

## Patient Form View (`/patient-form/:id/view`)

| Filename | State | Match |
|---|---|---|
| screencapture-acme-splose-patient-form-3545217-view-2026-03-17-19_32_54.png | Patient form view (variant 1) | partial |
| screencapture-acme-splose-patient-form-3545217-view-2026-03-17-19_33_46.png | Patient form view (variant 2) | partial |

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
| Screenshot 2026-03-11 at 11.02.16 am.png | Dashboard — desktop, Messages feed + Income chart + Incomplete progress notes + Recently submitted forms | yes — structural match confirmed, 13.72% pixel diff is data-driven (different messages/chart data) |
| Screenshot 2026-03-11 at 11.02.24 am.png | Dashboard — mobile in desktop browser frame, Messages with GIF | yes |
| Screenshot 2026-03-11 at 11.08.47 am.png | Dashboard — mobile, Income chart + Incomplete progress notes (scrolled) | yes |
| Screenshot 2026-03-11 at 11.09.05 am.png | Dashboard — desktop, Messages feed (scrolled) with tooltip on income chart | yes |

## Clients List (`/clients`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.09.27 am.png | Clients list — desktop, default view | yes |
| Screenshot 2026-03-11 at 11.09.33 am.png | Clients list — desktop, near-identical | yes |
| Screenshot 2026-03-11 at 11.09.39 am.png | Clients list — mobile (iPhone) | yes |
| Screenshot 2026-03-11 at 11.09.47 am.png | Clients list — mobile, scrolled right to Phone/Email columns | yes |
| Screenshot 2026-03-11 at 11.10.08 am.png | Clients list — desktop, Tags filter dropdown open | partial — standalone filter bar removed in Phase 4; filtering now via Th column icons |
| Screenshot 2026-03-11 at 11.10.24 am.png | Clients list — desktop, Active/Archived status dropdown open | partial — standalone filter bar removed; column-level filtering via Th props |

## Client Detail — Details (`/clients/:id`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.10.50 am.png | Client detail — desktop, Details tab (General details, Account balance, Client alerts, Stripe, Mailchimp) | yes |
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
| Screenshot 2026-03-11 at 11.12.37 am.png | Client appointments tab — desktop, appointment side panel open | partial — side panel implemented with full content |
| Screenshot 2026-03-11 at 11.15.20 am.png | Client appointments (Skyler Peterson) — desktop, with Upcoming/Cancelled badges | partial |

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
| Screenshot 2026-03-11 at 11.13.20 am.png | Contacts list — desktop, with row highlighted | yes — 4.23% mismatch, structure matches |
| Screenshot 2026-03-11 at 11.14.04 am.png | Contacts list — desktop, no highlight | yes — structure matches |

## Contact Detail (`/contacts/:id`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.14.14 am.png | Contact detail (NDIS) — desktop, Details tab with Associated clients | yes — 4.48% mismatch, layout matches |
| Screenshot 2026-03-11 at 11.14.21 am.png | Contact invoices tab — desktop | partial — not pixel-diffed |

## Invoices List (`/invoices`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.14.32 am.png | Invoices list — desktop, with Overdue/Paid/Draft badges | yes — visual audit 2026-03-23 confirmed; migrated to DS DataTable/Th; format differs by design (INV-0XX vs TRR-00XXXX) |
| Screenshot 2026-03-11 at 11.14.41 am.png | Invoices list — mobile (iPhone) | partial |
| Screenshot 2026-03-11 at 11.14.52 am.png | Invoices list — mobile, expanded row showing Payment sub-row | partial |

## Invoice View (`/invoices/:id`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.16.02 am.png | Invoice view — desktop, Overdue invoice PDF-style with Pay/Email/Actions buttons | partial |
| Screenshot 2026-03-11 at 11.16.10 am.png | Invoice view — desktop, Pay dropdown open | partial |
| Screenshot 2026-03-11 at 11.16.17 am.png | Invoice view — desktop, Actions dropdown open | partial |

## Add Payment (`/payments/new`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.16.25 am.png | Add payment to invoice — desktop, form with location/date/method/amount | yes — 3.92% mismatch |

## Payments List (`/payments`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.17.41 am.png | Payments list — desktop, default view with Credit badges | yes — visual audit 2026-03-23 confirmed |
| Screenshot 2026-03-11 at 11.17.47 am.png | Payments list — desktop, expanded row showing Invoice sub-row | partial |

## Reports — Performance Overview (`/reports`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.17.57 am.png | Performance overview — desktop, Utilisation + Revenue charts + Practitioners table | yes — visual audit 2026-03-23 confirmed |
| Screenshot 2026-03-11 at 11.18.04 am.png | Performance overview — desktop, date picker calendar open | partial |
| Screenshot 2026-03-11 at 11.18.09 am.png | Performance overview — desktop, Frequency dropdown (Daily/Weekly/Monthly/Quarterly/Yearly) | partial |
| Screenshot 2026-03-11 at 11.18.15 am.png | Performance overview — desktop, All locations dropdown | partial |
| Screenshot 2026-03-11 at 11.18.21 am.png | Performance overview — desktop, All practitioners dropdown | partial |
| Screenshot 2026-03-11 at 11.18.28 am.png | Performance overview — desktop, Compare mode with % change arrows | partial |
| Screenshot 2026-03-11 at 11.18.34 am.png | Performance overview — desktop, Compare mode, Utilisation settings popover | partial |

## Reports — Appointments (`/reports/appointments`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.18.50 am.png | Reports Appointments — desktop, Add filter dropdown open | partial |

## Reports — Progress Notes (`/reports/progress-notes`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.19.07 am.png | Reports Progress notes — desktop, empty (before running) | partial |
| Screenshot 2026-03-11 at 11.19.15 am.png | Reports Progress notes — desktop, results with pie charts | partial |
| Screenshot 2026-03-11 at 11.19.22 am.png | Reports Progress notes — desktop, scrolled to list table | partial |

## Reports — Performance (`/reports/performance`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.19.46 am.png | Reports Performance — desktop, filter form (before running) | partial |
| Screenshot 2026-03-11 at 11.19.54 am.png | Reports Performance — desktop, Definitions modal open | partial |
| Screenshot 2026-03-11 at 11.21.02 am.png | Reports Performance — desktop, results table + Export CSV dropdown | partial |
| Screenshot 2026-03-11 at 11.21.26 am.png | Reports Performance — desktop, Export performance modal | partial |

## Waitlist — Screener (`/waitlist`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.21.40 am.png | Waitlist Screener tab — desktop, Triage list | yes — visual audit 2026-03-23 confirmed |

## Waitlist — Waitlist Tab (`/waitlist`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.21.50 am.png | Waitlist tab — desktop, Active list with tags, Map button | partial |
| Screenshot 2026-03-11 at 11.22.02 am.png | Waitlist tab — desktop, Map view (Google Maps with pins) | partial |
| Screenshot 2026-03-11 at 11.22.17 am.png | Waitlist tab — desktop, scrolled right, Actions dropdown | partial |
| Screenshot 2026-03-11 at 11.22.31 am.png | Waitlist tab — desktop, Update client modal | partial |

## Products (`/products`)

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 11.22.40 am.png | Products list — desktop, default view | yes — 3.14% mismatch |
| Screenshot 2026-03-11 at 11.22.46 am.png | Products list — desktop, expanded product row showing variants | partial |
| Screenshot 2026-03-11 at 11.22.51 am.png | Products list — desktop, Manage Stock modal | partial |

## Calendar — Week View (`/calendar`) — March 11

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 5.52.22 pm.png | Calendar week view — desktop, Feb 2026, with appointments | partial |
| Screenshot 2026-03-11 at 5.52.31 pm.png | Calendar week view — desktop, Week/Month/Day dropdown open | partial |

## Calendar — Day View (`/calendar`) — March 11

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 5.52.47 pm.png | Calendar day view — desktop, practitioner columns | partial |
| Screenshot 2026-03-11 at 5.52.53 pm.png | Calendar day view — desktop, appointment side panel open | partial — side panel implemented with full structured content and action buttons |
| Screenshot 2026-03-11 at 5.52.59 pm.png | Calendar day view — desktop, Edit appointment modal | partial — edit modal implemented with all fields including Room/Resource |
| Screenshot 2026-03-11 at 5.53.13 pm.png | Calendar day view — desktop, click-to-create popover | partial — popover implemented with Support activity/Busy time/Appointment options |
| Screenshot 2026-03-11 at 5.53.18 pm.png | Calendar day view — zoomed close-up of create popover | partial — popover matches reference layout |
| Screenshot 2026-03-11 at 5.53.25 pm.png | Calendar day view — desktop, Create appointment modal (empty) | partial — modal has Service, Location, Case, Room/Resource, toggles, past date warning |
| Screenshot 2026-03-11 at 5.53.59 pm.png | Calendar day view — desktop, Create appointment modal (client selected, Service dropdown) | partial — Service field now used instead of Appointment Type |
| Screenshot 2026-03-11 at 5.54.19 pm.png | Calendar day view — desktop, Create appointment modal (service selected, toggles, past date warning) | partial — Provider Travel/Non-Labour/Transport/Repeat toggles and past date warning implemented |

## Notes — New Progress Note (`/notes/new`) — March 11

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 5.54.43 pm.png | New progress note — desktop, empty with Service pre-filled, Template selector | yes — single Service dropdown, autosaved badge, Save as final button, split view 2026-03-24 |

## Notes — Edit Progress Note (`/notes/:id/edit`) — March 11

| Filename | State | Match |
|---|---|---|
| Screenshot 2026-03-11 at 5.55.16 pm.png | Edit progress note — desktop, AI blocks, Splose AI chat panel open | partial |
| Screenshot 2026-03-11 at 5.55.39 pm.png | Edit progress note — desktop, AI chat response visible, AI blocks promo tooltip | partial |

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
