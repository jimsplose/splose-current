# Splose Typography Naming Convention

**Prepared by:** Jim Yencken (with Claude) | **Date:** 20 March 2026
**Status:** Recommendation for design system pilot
**Audience:** Product Design team, Frontend Engineering, Claude Code (for build matching)

---

## 1. Naming Convention Structure

### Pattern

```
{category}/{size}
```

Where:
- **Category** describes the semantic role (what the text does)
- **Size** uses t-shirt sizing within that category (sm, md, lg)
- Slash separator creates folders in Figma's style picker

### Why this structure

- **Semantic categories over HTML elements:** Using "heading/lg" instead of "h1" prevents the common mistake of designers assuming they must use a specific HTML element. Engineers choose the correct semantic element; the design token describes visual purpose.
- **T-shirt sizes over pixel values:** "body/sm" survives a scale change; "body-12" becomes a lie the moment you adjust sizes.
- **Two levels, not three:** Keeping the hierarchy shallow (category/size) avoids over-nesting that slows down the Figma style picker. Weight variants live within the style definition, not as additional folder levels.
- **No font names in tokens:** The two typefaces (Sprig Sans for display headings, Inter for everything else) are defined separately from style names. If the display typeface changes, zero style names change.

### Categories

| Category | Purpose | Font |
|---|---|---|
| **display** | Hero headings, page titles | Sprig Sans |
| **heading** | Section and card headings | Inter |
| **body** | Running text and default UI content | Inter |
| **label** | Form labels, table headers, nav items, tags | Inter |
| **caption** | Helper text, hints, timestamps, metadata | Inter |
| **metric** | Dashboard KPIs and summary numbers | Inter (tabular figures) |

---

## 2. Primitive Reference

These are the raw values that each style is composed from. Useful for identifying styles when matching against development builds.

### Font family

| Token | Value |
|---|---|
| font-family/display | Sprig Sans |
| font-family/sans | Inter |

### Font size scale

| Token | Value |
|---|---|
| font-size/2xl | 30px |
| font-size/xl | 24px |
| font-size/lg | 18px |
| font-size/md | 16px |
| font-size/base | 14px |
| font-size/sm | 12px |
| font-size/xs | 11px |

### Font weight

| Token | Value | CSS equivalent |
|---|---|---|
| font-weight/regular | Regular | 400 |
| font-weight/medium | Medium | 500 |
| font-weight/semibold | SemiBold | 600 |
| font-weight/bold | Bold | 700 |

### Line height

Line heights use a multiplier of the font size. The multiplier is the conceptual model; the resulting pixel value is what appears in the rendered output.

| Token | Multiplier | Notes |
|---|---|---|
| line-height/tight | 1.2x | Display headings |
| line-height/snug | 1.33x | Headings, small text |
| line-height/normal | 1.43x | Body text, labels |
| line-height/relaxed | 1.5x | Long-form content |

### Letter spacing

| Token | Value | Use |
|---|---|---|
| letter-spacing/tight | -0.02em | Display headings |
| letter-spacing/normal | 0 | Body, headings, labels |
| letter-spacing/wide | 0.02em | Uppercase labels, overlines |

---

## 3. Style Definitions and Where They Appear

### display/ -- Page-level titles (Sprig Sans)

Large, bold titles that establish the primary context of a page or major section. These are the most visually prominent text on screen.

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **display/lg** | 30px | Bold (700) | 1.2x (36px) | tight |
| **display/md** | 24px | Bold (700) | 1.33x (32px) | tight |
| **display/sm** | 18px | Bold (700) | 1.33x (24px) | normal |

**Where display/lg appears:**
- Page titles on primary content pages -- "Progress note templates" on the templates listing page, "Details" on the business settings page, "Practitioner access" on the client detail page
- Any top-level heading that uses the Sprig Sans display font
- The largest text element on a page, typically appearing once near the top of the main content area

**Where display/md appears:**
- Modal and dialog titles when they need strong visual weight
- Section hero headings within pages that contain multiple major regions
- Online booking page headings like "Select a location" on the public-facing booking flow

**Where display/sm appears:**
- Card group headings where a display-weight title is needed at a smaller size
- Widget titles on dashboard cards
- Subsection titles within modals or drawers

---

### heading/ -- Section and card headings (Inter)

Medium-weight headings used to break content into scannable sections. Always Inter, always SemiBold. These create the structural hierarchy below display text.

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **heading/lg** | 18px | SemiBold (600) | 1.33x (24px) | normal |
| **heading/md** | 16px | SemiBold (600) | 1.375x (22px) | normal |
| **heading/sm** | 14px | SemiBold (600) | 1.43x (20px) | normal |

**Where heading/lg appears:**
- Section headings within detail pages -- "General details", "Client contact details", "Privacy policy consent" on the Client details page
- "Email signature" and "Secure PDF email attachments" on the business settings page
- "Archived online booking notice" on the online booking settings page
- Any bold 18px Inter heading that introduces a content section with a horizontal rule or spacing above it

**Where heading/md appears:**
- Panel and popover titles -- "Chiropractic (Chiropractic)" at the top of the calendar appointment detail popover
- Card titles within settings pages
- Subsection headings within forms -- "Banner styling" on the online booking design tab

**Where heading/sm appears:**
- Deeply nested headings where heading/md would be too large
- Accordion item headings
- Inline section labels that need more weight than a label but less prominence than a full heading
- Sidebar category groupings like "Workspace", "Automation", "Business", "Team", "Templates", "Finances" in the settings sidebar

---

### body/ -- Running text and default content (Inter)

The workhorse of the type system. Regular-weight text used for paragraphs, table cell content, input field values, and general UI copy. This is the default -- if text doesn't fit another category, it's probably body.

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **body/lg** | 16px | Regular (400) | 1.375x (22px) | normal |
| **body/md** | 14px | Regular (400) | 1.43x (20px) | normal |
| **body/sm** | 12px | Regular (400) | 1.33x (16px) | normal |
| **body/md-strong** | 14px | Bold (700) | 1.43x (20px) | normal |
| **body/lg-strong** | 16px | Bold (700) | 1.375x (22px) | normal |

**Where body/lg appears:**
- Page descriptions and instructional paragraphs -- "Create templates for any appointment type to save time and keep documentation consistent..." on the progress note templates page
- "You can link practitioners to clients via creating an appointment or support activity in the calendar tab." on the practitioner access page
- "Connect with Stripe to store client payment methods and process future payments." in the account balance sidebar
- Long-form descriptive text, helper paragraphs, and onboarding content
- Any 16px regular-weight text block

**Where body/md appears:**
- Default text for most UI content -- table cell values, form input text, dropdown values
- Table row content on the practitioner access table (names, role types, status values)
- Sidebar navigation items with counts -- "Appointments 4", "Communications 16", "Files 21", "Progress notes 9" on the client detail sidebar
- Appointment detail field values in the calendar popover -- "Julian Austin", "1:15 pm, 10 Mar 2026 for 45 minutes", "Room 2"
- Input field values like "Hands Together Therapy", "acme.splose.com" in business settings forms
- The 14px base reading size across the application

**Where body/sm appears:**
- Calendar event card text -- client name, time, service type, and notes within calendar day/week view event blocks
- Compact text within dense UI areas
- Pagination text -- "1-3 of 3 items", "10 / page"
- Small metadata in tight spaces

**Where body/md-strong appears:**
- Bold inline emphasis within body text -- drawing attention to key terms without adding heading semantics
- Bold field labels in the calendar appointment detail popover
- Inline bold text within paragraphs

**Where body/lg-strong appears:**
- Bold emphasis at 16px within descriptive or instructional text
- Prominent inline callouts in longer text blocks

---

### label/ -- Form labels, table headers, navigation, tags (Inter)

Medium-weight text used for interactive and structural elements that identify or categorise content. Visually distinct from body text through the medium weight, creating a subtle emphasis that signals "this names something" rather than "this is content".

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **label/lg** | 14px | Medium (500) | 1.43x (20px) | normal |
| **label/md** | 12px | Medium (500) | 1.33x (16px) | normal |
| **label/sm** | 11px | Medium (500) | 1.45x (16px) | wide |

**Where label/lg appears:**
- Table column headers -- "Name", "Role name", "Role type", "Group", "Status", "Actions" on the practitioner access table; "Title", "Created at", "Actions" on the progress note templates table
- Form field labels -- "Business name*", "Workspace URL", "Website", "Business email*", "Patient terminology", "Currency code*" on the business settings page
- Primary navigation items in the top nav bar -- "Dashboard", "Calendar", "Clients", "Contacts", "Waitlist", "Invoices", "Payments", "Reports", "Products", "ACC"
- Settings sidebar navigation items -- "Forms", "splose AI", "Locations", "Custom fields", "Rooms/Resources", "Services"
- Button text -- "New SMS", "New email", "Cancel", "Preview", "Save", "Edit", "Reschedule", "Archive"
- Any 14px medium-weight text that names or labels something

**Where label/md appears:**
- Badge and tag text -- "Account owner" badge on the practitioner access table, "New" badge next to "Online bookings" in the settings sidebar, "Design" / "Settings" / "Builder" / "Share" tab labels on the online booking editor
- Breadcrumb text
- Filter and sort indicator text
- Small navigation items in dense sidebars
- Character count indicators -- "74 / 80", "27 / 150" on text inputs in the online booking design tab

**Where label/sm appears:**
- Overline and eyebrow text above sections
- Category labels in uppercase
- Fine-print field labels in compact form layouts
- Very small structural labels in data-dense views

---

### caption/ -- Helper text, hints, timestamps, metadata (Inter)

Regular-weight small text that provides supporting context without competing for attention. Visually subordinate to everything else on the page. The distinction between caption and body/sm is semantic: captions support or annotate; body/sm is primary content that happens to be small.

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **caption/md** | 12px | Regular (400) | 1.33x (16px) | normal |
| **caption/sm** | 11px | Regular (400) | 1.27x (14px) | normal |

**Where caption/md appears:**
- Helper text beneath form fields explaining expected input
- Timestamps on table rows -- "2:43 pm, 2 Aug 2024", "10:57 pm, 26 Aug 2024" in the progress note templates table
- "This notice message will display if you archive this online booking page" on the online booking settings page
- Secondary metadata in lists and tables
- Status text like "Linked" in the practitioner access table

**Where caption/sm appears:**
- Fine-print legal text
- Footnotes and disclaimers
- Very small timestamps or metadata in dense layouts
- Hover tooltip content

---

### metric/ -- Dashboard numbers (Inter with tabular figures)

Bold, large numbers used for key performance indicators and financial summaries. Always use Inter with the OpenType `tnum` (tabular figures) feature enabled so numbers align vertically in columns and dashboards.

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **metric/lg** | 30px | Bold (700) | 1.2x (36px) | tight |
| **metric/md** | 24px | Bold (700) | 1.33x (32px) | tight |

**Where metric/lg appears:**
- Hero KPI values on the dashboard -- total revenue, total appointments, key business metrics
- Large summary numbers at the top of reports pages

**Where metric/md appears:**
- Secondary dashboard metrics and summary statistics
- Financial values in the account balance sidebar -- "25.00", "0.00" next to "They owe" and "Available credit balance" on the client detail page
- Summary counts or totals within cards and widgets

---

## 4. How to Use This Document with Claude Code

This document is designed to be fed to Claude Code alongside development build screenshots for comparison. When matching styles:

1. **Identify the text's role first, then match to a category.** Is it a page title (display), section heading (heading), running content (body), something that names or labels a UI element (label), supporting metadata (caption), or a prominent number (metric)?

2. **Check the font.** If it's the display/brand typeface (Sprig Sans), it's a display/ style. Everything else is Inter.

3. **Check the size and weight.** Match against the tables above. The combination of size + weight uniquely identifies each style.

4. **Verify line height.** Multiply the font size by the listed multiplier. Allow a tolerance of +/- 1px for rounding differences between design and development. Note that line height in CSS may be expressed as a unitless multiplier (e.g. `1.43`), pixels (e.g. `20px`), or rem (e.g. `1.25rem`).

5. **Watch for line heights that include component padding.** If a measured line height is significantly larger than expected (e.g. 38px for 14px text), the extra space is likely component padding, not the text style's line height. The text style itself should match the multiplier values in this document.

### Quick identification table

| If you see... | Size | Weight | It's probably... |
|---|---|---|---|
| Sprig Sans, 30px, Bold | 30 | 700 | display/lg |
| Sprig Sans, 24px, Bold | 24 | 700 | display/md |
| Sprig Sans, 18px, Bold | 18 | 700 | display/sm |
| Inter, 18px, SemiBold | 18 | 600 | heading/lg |
| Inter, 16px, SemiBold | 16 | 600 | heading/md |
| Inter, 14px, SemiBold | 14 | 600 | heading/sm |
| Inter, 16px, Regular | 16 | 400 | body/lg |
| Inter, 14px, Regular | 14 | 400 | body/md |
| Inter, 12px, Regular | 12 | 400 | body/sm or caption/md |
| Inter, 14px, Bold | 14 | 700 | body/md-strong |
| Inter, 16px, Bold | 16 | 700 | body/lg-strong |
| Inter, 14px, Medium | 14 | 500 | label/lg |
| Inter, 12px, Medium | 12 | 500 | label/md |
| Inter, 11px, Medium | 11 | 500 | label/sm |
| Inter, 11px, Regular | 11 | 400 | caption/sm |
| Inter, 30px, Bold (tabular figs) | 30 | 700 | metric/lg |
| Inter, 24px, Bold (tabular figs) | 24 | 700 | metric/md |

**Distinguishing body/sm from caption/md:** Both are Inter 12px Regular. Differentiate by role: if the text is primary content (table data, event details), it's body/sm. If it's supporting metadata (timestamps, helper text, fine print), it's caption/md. In code, they may share the same CSS values but should use different class names or tokens for future independence.

**Distinguishing display/ from metric/:** Both use Bold 700 at the same sizes. Display uses Sprig Sans; metric uses Inter with tabular figures. If the text is a heading or title, it's display. If it's a number or financial value, it's metric.
