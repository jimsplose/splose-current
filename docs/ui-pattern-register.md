# UI Pattern Register

Visual fidelity audit of the Splose prototype against reference screenshots. Documents consistent patterns, inconsistencies in the **original app**, and recommended "golden standard" pages for each pattern.

**Last updated:** 2026-03-21

---

## Golden Standard Pages

These pages represent the **best, most consistent implementation** of each pattern. When in doubt about how a pattern should look, refer to these pages rather than an inconsistent one.

| Pattern | Golden Standard Page | Why |
|---|---|---|
| Settings list page (table) | **Settings > Appointment Templates** | Clean PageHeader + SearchBar + DataTable + Pagination + Modal. No extra complexity. |
| Settings list page (tabs) | **Settings > Tags** | Same as above, plus Tab component for sub-categories. |
| Settings list page (color + search) | **Settings > Rooms/Resources** | Adds ColorDot, sort icons, filter icons, Learn/Show archived buttons. |
| Main list page | **Clients** | PageHeader + SearchBar + filter dropdowns + DataTable + Pagination. |
| Main list page (multi-column) | **Contacts** | Same as Clients, with sort icons on columns. |
| Dashboard | **Dashboard** | Two-column layout: messages feed left, sidebar widgets right. |
| Settings form page | **Settings > Details** | Form-based settings (not table-based). Inputs, selects, toggles. |

---

## Pattern-by-Pattern Analysis

### 1. Page Headers

**Consistent pattern across most pages:**
- Title on the left (Sprig Sans, `text-display-lg`)
- Action buttons on the right (primary purple for main CTA, secondary for Learn/Show archived)

**Inconsistencies in original app:**

| Page | Issue | Recommendation |
|---|---|---|
| Busy times | Uses `h1` + description paragraph, no PageHeader | Use PageHeader. Put description below it. |
| Cancellation reasons | Uses `h1` + buttons, different layout from other settings | Use PageHeader for consistency. |
| Referral types | Uses **secondary** button for "+ Add referral type" | Should be **primary** button (like all other add buttons). **Known original app inconsistency.** |
| Communication types | Uses primary button — correct | ✓ Consistent |
| Payment settings | Different header style (section headings within page) | This is a form page, not a list page — different pattern is expected. |

**Our implementation:** All settings pages use PageHeader DS component. Referral types currently uses secondary button matching the reference — **should we fix this to match the majority pattern (primary)?**

### 2. Tables

**Two distinct patterns in the original app:**

**Pattern A — DataTable (majority):** Column header row with gray background, data rows, hover state, Actions column with "..." dropdown.
- Used by: Tags, Rooms, Services, Busy times, Appointment templates, Email templates, Locations, Users, User groups, Clients, Contacts, Invoices, Waitlist

**Pattern B — Simple bordered list:** No column headers, just rows with name + optional badge + actions.
- Used by: **Cancellation reasons** only

**Inconsistencies:**

| Page | Issue |
|---|---|
| Cancellation reasons | Uses Pattern B (simple list) while all other settings use Pattern A (DataTable). **Known original app inconsistency.** |
| Locations | Rows are clickable (navigate to edit page), no Actions dropdown column. Different from other settings. |
| Payment settings | Actions column uses edit/delete icons instead of "..." dropdown menu. **Known inconsistency.** |

**Our implementation:** Cancellation reasons uses Pattern B (simple list) to match the reference. Other pages use DataTable.

### 3. Buttons

**Consistent patterns:**
- **Primary (purple filled):** Main CTA — "+ New tag", "+ New template", "Save", "Send"
- **Secondary (white + border):** Secondary actions — "Learn", "Show archived", "Cancel", "Search"
- **Danger (red):** Destructive actions — in dropdown menus only

**Inconsistency in original app:**

| Page | Issue |
|---|---|
| Referral types | "+ Add referral type" uses **secondary** button instead of primary. Every other settings add button is primary. |
| Invoices | Has both "Batch invoice" (secondary) and "+ New invoice" (secondary with border) — both look secondary. |

### 4. Search Bar

**Consistent pattern:** Full-width text input + "Search" button on the right.

**Pages with search:** Clients, Contacts, Invoices, Waitlist, Services, Rooms/Resources, Appointment templates, Progress notes, Letter templates, Forms, Online bookings

**Pages without search:** Tags, Busy times, Cancellation reasons, Communication types, Referral types, Locations, Users, User groups, Tax rates

**No inconsistencies** — search presence is content-appropriate.

### 5. Pagination

**Two patterns in original app:**

| Pattern | Where | Details |
|---|---|---|
| Full pagination | Clients, Contacts, Invoices, Referral types | "1-10 of N items < 1 2 3 ... > 10 / page" with page size selector |
| Minimal pagination | Tags, Appointment templates, other settings | "1-N of N items < 1 >" without page size selector |

**Inconsistency:** Whether "10 / page" selector shows varies page to page with no clear rule.

**Our implementation:** Uses the Pagination DS component with `showPageSize` prop. Currently matches reference page-by-page.

### 6. Settings Sidebar

**Consistent pattern (no inconsistencies):**
- Section headers: ALL CAPS, small bold text, with tracking — "WORKSPACE", "AUTOMATION", "BUSINESS", "TEAM", "TEMPLATES", "FINANCES", "DATA"
- Items: Regular weight text, gray color
- Active item: Purple text + left purple border bar
- "Online bookings" has green "New" badge

**Our implementation:** Matches the reference well.

### 7. Colors & Backgrounds

**Consistent patterns:**
- Page background: **white** (`#ffffff`)
- Table header row: **light gray** (`#f9fafb`)
- Table row hover: **very light gray** (`#f9fafb`)
- Text primary: **dark gray** (`#1f2937`)
- Text secondary: **medium gray** (`#6b7280`)
- Primary brand: **purple** (`#7c3aed`)
- Links: **purple** (`#7c3aed`)
- Phone numbers: **purple** links
- Client/contact names in tables: **purple** links (Contacts, Invoices) or **black** text (Clients)
- Borders: **light gray** (`#e5e7eb`)

**Inconsistency in original app:**

| Element | Issue |
|---|---|
| Client names in tables | Clients page shows names as **black text**. Contacts and Invoices show names as **purple links**. |
| Form labels | Some pages use gray labels above inputs. Payment settings uses a slightly different label weight. |

### 8. Color Indicators

**Three different patterns in the original app for showing colors:**

| Pattern | Pages | Visual |
|---|---|---|
| Color bar (wide rectangle) | Tags | `80px × 16px` rounded rectangle filled with the color |
| Color dot (small circle before name) | Rooms/Resources, Busy times | `12px` circle inline with text |
| Tailwind class dot | Services | `10px` circle, uses Tailwind bg classes (not hex) |

**Known original app inconsistency:** Tags shows a wide color bar while Rooms and Busy times show a small dot. There's no UX reason for this difference.

**Our implementation:** Tags uses a color bar (matches reference), Rooms/Busy times use ColorDot DS component (matches reference). Preserves the original inconsistency.

### 9. Boolean/Status Indicators

**Three different patterns in the original app:**

| Pattern | Pages | Visual |
|---|---|---|
| Colored text "On"/"Off" | Appointment templates (SMS/Email columns) | Green "On", red "Off" — plain text |
| Colored text "Yes"/"No" | Communication types, Referral types | Green "Yes", red "No" — plain text |
| Badge pill "Active" | Payment settings | Green rounded pill badge |

**Known inconsistency:** All three represent the same concept (boolean state) with different visuals.

**Our implementation:** Uses OnOffBadge DS component (matches reference per-page).

### 10. Shadows & Elevation

**Consistent pattern (no shadows in the original app):**
- Tables: **no box shadow** — just border
- Cards: **no box shadow** — just border (used in Dashboard widgets, Reports)
- Modals: **drop shadow** on the modal overlay
- Dropdowns: **drop shadow** on the dropdown menu

**Our implementation:** Matches — no unnecessary shadows.

### 11. Typography

**Consistent patterns:**
- Page titles: Sprig Sans Bold, ~30px (`text-display-lg`)
- Table headers: Inter, ~14px, medium weight (`text-label-lg`)
- Body text: Inter, ~14px, regular weight (`text-body-md`)
- Secondary text: Inter, ~14px, gray (`text-body-md text-text-secondary`)
- Sidebar section headers: Inter, ~12px, bold, uppercase, tracking (`text-body-sm font-bold tracking-wider`)

**Inconsistency in original app:**

| Area | Issue |
|---|---|
| Settings description text | Busy times has a description paragraph below the title. Most other settings pages don't. Not really inconsistent — content-driven. |
| Form section headings | Payment settings uses `h3` bold headings for sub-sections. Other settings don't have sub-sections. Expected variation. |

### 12. Table Row Borders

**Two patterns in original app:**

| Pattern | Pages |
|---|---|
| Full border around table + between rows | Tags, Rooms, Services, Appointment templates, most settings |
| Divider lines only (no outer border) | Cancellation reasons (simple list), some settings |

**Our implementation:** Uses DataTable DS component which adds both outer border and row dividers (matches majority pattern).

### 13. Form Inputs

**Consistent pattern in original app:**
- Label above input (gray, small)
- Full-width input with rounded border
- Focus state: purple border ring
- Selects: same styling with dropdown chevron

**No significant inconsistencies** in form styling.

---

## Summary of Original App Inconsistencies

### Worth fixing (deviations from majority pattern):

| # | Issue | Our current state | Suggested action |
|---|---|---|---|
| 1 | Referral types uses secondary button for add action | Matches reference (secondary) | **Ask Jim:** Fix to primary for consistency? |
| 2 | Cancellation reasons uses simple list instead of DataTable | Matches reference (simple list) | **Ask Jim:** Convert to DataTable for consistency? |
| 3 | Payment settings uses edit/delete icons instead of "..." dropdown | Matches reference (icons) | **Ask Jim:** Convert to dropdown for consistency? |
| 4 | Client names are black text on Clients page but purple links on Contacts/Invoices | Matches reference per-page | **Ask Jim:** Standardize to purple links everywhere? |

### Acceptable variation (content-driven or expected):

| # | Issue | Why it's OK |
|---|---|---|
| 5 | Search bar present on some settings pages but not others | Pages with few items don't need search |
| 6 | Pagination "10/page" selector shown on some pages but not others | Minor UX variation, not visually jarring |
| 7 | Color indicators: bar vs dot vs class-based dot | Each page shows colors differently by design (Tags shows larger swatches) |
| 8 | Busy times has description text below title | Content-driven — explains the feature purpose |
| 9 | Payment/Invoice settings have sub-sections with headings | Complex pages need more structure |
| 10 | Locations rows are clickable (no dropdown) | Navigate-to-edit pattern is valid for this page |

---

## Recommended Comparison Strategy

When auditing a page visually, compare against the appropriate golden standard:

1. **Settings table pages** → Compare header/search/table/pagination against **Appointment Templates**
2. **Settings table pages with tabs** → Compare tab styling against **Tags**
3. **Settings pages with color** → Compare color display against **Rooms/Resources**
4. **Main list pages** → Compare against **Clients** or **Contacts**
5. **Settings form pages** → Compare against **Settings > Details**

Do NOT compare across categories — e.g., don't judge a settings table page by the Dashboard layout.
