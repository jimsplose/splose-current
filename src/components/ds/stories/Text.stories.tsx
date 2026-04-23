import type { Meta, StoryObj } from "@storybook/react";
import Text from "../Text";
import type { TextVariant } from "../Text";

const ALL_VARIANTS: TextVariant[] = [
  "page-title",
  "display/lg", "display/md", "display/sm",
  "heading/xl", "heading/lg", "heading/md", "heading/sm",
  "body/lg", "body/md", "body/sm", "body/md-strong", "body/lg-strong",
  "label/lg", "label/md", "label/sm",
  "caption/md", "caption/sm",
  "metric/lg", "metric/md",
];

const meta: Meta<typeof Text> = {
  title: "Typography/Text",
  component: Text,
  argTypes: {
    variant: {
      control: "select",
      options: ALL_VARIANTS,
    },
    as: {
      control: "text",
      description: "HTML element override",
    },
    color: {
      control: "text",
      description: "Tailwind color class (e.g. text-text-secondary)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

/* ── Playground ─────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    variant: "body/md",
    children: "The quick brown fox jumps over the lazy dog",
  },
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

const StyleRow = ({
  variant,
  label,
  specs,
}: {
  variant: TextVariant;
  label: string;
  specs: string;
}) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, borderBottom: '1px solid var(--color-border)', borderColor: '#f3f4f6', paddingTop: 12, paddingBottom: 12 }}>
    <code style={{ width: 176, flexShrink: 0, fontSize: 11, color: '#9ca3af' }}>{label}</code>
    <Text variant={variant}>{sampleText(variant)}</Text>
    <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 11, color: '#9ca3af' }}>{specs}</span>
  </div>
);

function sampleText(variant: TextVariant): string {
  if (variant === "page-title") return "Client Overview";
  if (variant.startsWith("metric/")) return "$12,450.00";
  if (variant.startsWith("display/")) return "Page Title";
  if (variant.startsWith("heading/")) return "Section Heading";
  if (variant.startsWith("label/")) return "Field Label";
  if (variant.startsWith("caption/")) return "Helper text or timestamp";
  return "The quick brown fox jumps over the lazy dog.";
}

export const AllStyles: Story = {
  render: () => (
    <div style={{ maxWidth: 768, display: 'flex', flexDirection: 'column', gap: 32 }}>
      <section>
        <h3 style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
          Page Title — Sprig Sans, Bold, Green
        </h3>
        <StyleRow variant="page-title" label="page-title" specs="30px / 700 / 1.2 / green" />
      </section>

      <section>
        <h3 style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
          Display — Sprig Sans, Bold
        </h3>
        <StyleRow variant="display/lg" label="display/lg" specs="30px / 700 / 1.2" />
        <StyleRow variant="display/md" label="display/md" specs="24px / 700 / 1.33" />
        <StyleRow variant="display/sm" label="display/sm" specs="18px / 700 / 1.33" />
      </section>

      <section>
        <h3 style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
          Heading — Inter/Sprig Sans, Bold
        </h3>
        <StyleRow variant="heading/xl" label="heading/xl" specs="28px / 700 / 1.2" />
        <StyleRow variant="heading/lg" label="heading/lg" specs="18px / 600 / 1.33" />
        <StyleRow variant="heading/md" label="heading/md" specs="16px / 600 / 1.375" />
        <StyleRow variant="heading/sm" label="heading/sm" specs="14px / 600 / 1.43" />
      </section>

      <section>
        <h3 style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
          Body — Inter, Regular & Bold
        </h3>
        <StyleRow variant="body/lg" label="body/lg" specs="16px / 400 / 1.375" />
        <StyleRow variant="body/md" label="body/md" specs="14px / 400 / 1.43" />
        <StyleRow variant="body/sm" label="body/sm" specs="12px / 400 / 1.33" />
        <StyleRow variant="body/lg-strong" label="body/lg-strong" specs="16px / 700 / 1.375" />
        <StyleRow variant="body/md-strong" label="body/md-strong" specs="14px / 700 / 1.43" />
      </section>

      <section>
        <h3 style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
          Label — Inter, Medium
        </h3>
        <StyleRow variant="label/lg" label="label/lg" specs="14px / 500 / 1.43" />
        <StyleRow variant="label/md" label="label/md" specs="12px / 500 / 1.33" />
        <StyleRow variant="label/sm" label="label/sm" specs="11px / 500 / 1.45 wide" />
      </section>

      <section>
        <h3 style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
          Caption — Inter, Regular
        </h3>
        <StyleRow variant="caption/md" label="caption/md" specs="12px / 400 / 1.33" />
        <StyleRow variant="caption/sm" label="caption/sm" specs="11px / 400 / 1.27" />
      </section>

      <section>
        <h3 style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>
          Metric — Inter, Bold, tabular figures
        </h3>
        <StyleRow variant="metric/lg" label="metric/lg" specs="30px / 700 / 1.2 tnum" />
        <StyleRow variant="metric/md" label="metric/md" specs="24px / 700 / 1.33 tnum" />
      </section>
    </div>
  ),
};

export const WeightOverride: Story = {
  name: "Weight Override",
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text variant="body/md" weight="regular">body/md weight=regular (400) — same as default</Text>
      <Text variant="body/md" weight="medium">body/md weight=medium (500)</Text>
      <Text variant="body/md" weight="bold">body/md weight=bold (700)</Text>
      <Text variant="body/sm" weight="bold">body/sm weight=bold — invoice label style</Text>
      <Text variant="caption/md" weight="medium">caption/md weight=medium</Text>
    </div>
  ),
};

export const WithColorOverride: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text variant="body/md">Default color (text)</Text>
      <Text variant="body/md" color="secondary">Secondary color</Text>
      <Text variant="body/md" color="primary">Primary color</Text>
      <Text variant="body/md" color="danger">Danger color</Text>
      <Text variant="body/md" color="success">Success color</Text>
      <Text variant="body/md" color="warning">Warning color</Text>
      <div style={{ backgroundColor: 'var(--color-primary)', borderRadius: 8, padding: 12 }}>
        <Text variant="body/md" color="inverted">Inverted — white text for use on dark/colored backgrounds</Text>
        <Text variant="label/lg" color="inverted">Label inverted (account balance heading)</Text>
      </div>
    </div>
  ),
};

export const WithElementOverride: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text variant="display/lg">Default renders as h1</Text>
      <Text variant="display/lg" as="span">Same style but renders as span</Text>
      <Text variant="body/md" as="label">Body text as a label element</Text>
    </div>
  ),
};

export const QuickReference: Story = {
  name: "Quick Reference Table",
  render: () => {
    const rows: { variant: TextVariant; css: string; font: string }[] = [
      { variant: "page-title", css: "(component only)", font: "Sprig Sans 30/700 green" },
      { variant: "display/lg", css: "text-display-lg", font: "Sprig Sans 30/700" },
      { variant: "display/md", css: "text-display-md", font: "Sprig Sans 24/700" },
      { variant: "display/sm", css: "text-display-sm", font: "Sprig Sans 18/700" },
      { variant: "heading/xl", css: "(component only)", font: "Inter 28/700" },
      { variant: "heading/lg", css: "text-heading-lg", font: "Inter 18/600" },
      { variant: "heading/md", css: "text-heading-md", font: "Inter 16/600" },
      { variant: "heading/sm", css: "text-heading-sm", font: "Inter 14/600" },
      { variant: "body/lg", css: "text-body-lg", font: "Inter 16/400" },
      { variant: "body/md", css: "text-body-md", font: "Inter 14/400" },
      { variant: "body/sm", css: "text-body-sm", font: "Inter 12/400" },
      { variant: "body/lg-strong", css: "text-body-lg-strong", font: "Inter 16/700" },
      { variant: "body/md-strong", css: "text-body-md-strong", font: "Inter 14/700" },
      { variant: "label/lg", css: "text-label-lg", font: "Inter 14/500" },
      { variant: "label/md", css: "text-label-md", font: "Inter 12/500" },
      { variant: "label/sm", css: "text-label-sm", font: "Inter 11/500" },
      { variant: "caption/md", css: "text-caption-md", font: "Inter 12/400" },
      { variant: "caption/sm", css: "text-caption-sm", font: "Inter 11/400" },
      { variant: "metric/lg", css: "text-metric-lg", font: "Inter 30/700 tnum" },
      { variant: "metric/md", css: "text-metric-md", font: "Inter 24/700 tnum" },
    ];
    return (
      <table style={{ width: '100%', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
            <th style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 16, fontWeight: 500 }}>Variant</th>
            <th style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 16, fontWeight: 500 }}>CSS Class</th>
            <th style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 16, fontWeight: 500 }}>Font / Size / Weight</th>
            <th style={{ paddingTop: 8, paddingBottom: 8, fontWeight: 500 }}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.variant} style={{ borderBottom: '1px solid var(--color-border)', borderColor: '#f3f4f6' }}>
              <td style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 16 }}>
                <code style={{ fontSize: 11 }}>{r.variant}</code>
              </td>
              <td style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 16 }}>
                <code style={{ fontSize: 11, color: '#6b7280' }}>{r.css}</code>
              </td>
              <td style={{ paddingTop: 8, paddingBottom: 8, paddingRight: 16, fontSize: 11, color: '#6b7280' }}>{r.font}</td>
              <td style={{ paddingTop: 8, paddingBottom: 8 }}>
                <Text variant={r.variant}>{sampleText(r.variant)}</Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

/* ── Recipe: Page Typography Stack ──────────────────────────────────────── */

export const PageTypographyStack: Story = {
  name: "Recipe: Page Typography Stack",
  render: () => (
    <div style={{ maxWidth: 672, display: 'flex', flexDirection: 'column', gap: 24, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 32 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        How display, heading, body, label, caption, and metric are used
        together on a typical Splose page.
      </p>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      {/* Page title */}
      <Text variant="display/lg">Client Overview</Text>

      {/* Section heading */}
      <Text variant="heading/lg">Upcoming Appointments</Text>

      {/* Body text */}
      <Text variant="body/md" color="text-text-secondary">
        Sarah Johnson has 3 upcoming appointments scheduled this week. The
        next appointment is a follow-up consultation on Monday at 10:00 AM.
      </Text>

      {/* Metric row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, borderRadius: 8, border: '1px solid var(--color-border)', padding: 16 }}>
        <div>
          <Text variant="label/md" color="text-text-secondary">Total Invoiced</Text>
          <Text variant="metric/lg">$12,450.00</Text>
        </div>
        <div>
          <Text variant="label/md" color="text-text-secondary">Outstanding</Text>
          <Text variant="metric/md" color="text-danger">$1,280.00</Text>
        </div>
        <div>
          <Text variant="label/md" color="text-text-secondary">Sessions</Text>
          <Text variant="metric/md">24</Text>
        </div>
      </div>

      {/* Sub-section */}
      <Text variant="heading/md">Contact Details</Text>

      {/* Label/value pairs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Text variant="label/lg" color="text-text-secondary" style={{ width: 128 }}>Email</Text>
          <Text variant="body/md">sarah.johnson@example.com</Text>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Text variant="label/lg" color="text-text-secondary" style={{ width: 128 }}>Phone</Text>
          <Text variant="body/md">0412 345 678</Text>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Text variant="label/lg" color="text-text-secondary" style={{ width: 128 }}>Medicare</Text>
          <Text variant="body/md">2123 45670 1</Text>
        </div>
      </div>

      {/* Caption / timestamp */}
      <Text variant="caption/md" color="text-text-secondary">
        Last updated 23 Mar 2026 at 2:15 PM
      </Text>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  ReportsDashboardMetrics                                            */
/*  Pattern: Report metrics with metric/lg values, caption dates, and  */
/*  heading/sm titles — the performance overview dashboard card layout  */
/*  Source: src/app/reports/page.tsx — Utilisation and Revenue cards    */
/* ------------------------------------------------------------------ */

export const ReportsDashboardMetrics: Story = {
  name: "Recipe: Reports Dashboard Metrics",
  render: () => (
    <div style={{ display: 'grid', maxWidth: 672, gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
        <Text variant="heading/sm">Utilisation</Text>
        <Text variant="caption/md" color="text-text-secondary" style={{ marginTop: 4 }}>
          Percentage of available time utilised
        </Text>
        <Text variant="metric/lg" style={{ marginTop: 8 }}>0.85%</Text>
        <Text variant="caption/md" color="text-text-secondary" style={{ marginTop: 4 }}>
          17 Mar 2026 - 23 Mar 2026
        </Text>
      </div>
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
        <Text variant="heading/sm">Revenue</Text>
        <Text variant="caption/md" color="text-text-secondary" style={{ marginTop: 4 }}>
          Total invoiced revenue (tax exclusive)
        </Text>
        <Text variant="metric/lg" style={{ marginTop: 8 }}>$1.09K</Text>
        <Text variant="caption/md" color="text-text-secondary" style={{ marginTop: 4 }}>
          17 Mar 2026 - 23 Mar 2026
        </Text>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  SettingsPageHeader                                                 */
/*  Pattern: Settings page title using display/lg with action buttons  */
/*  — the standard heading + save/learn button row                     */
/*  Source: src/app/settings/ai/page.tsx — "splose AI" heading row     */
/* ------------------------------------------------------------------ */

export const SettingsPageHeader: Story = {
  name: "Recipe: Settings Page Header",
  render: () => (
    <div style={{ maxWidth: 672, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="display/lg">splose AI</Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ borderRadius: 4, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}>
            Learn
          </button>
          <button style={{ borderRadius: 4, paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, color: '#fff', fontSize: 14, lineHeight: 1.57 }}>
            Save
          </button>
        </div>
      </div>
      <hr style={{ borderColor: 'var(--color-border)', marginTop: 16, marginBottom: 16 }} />
      <Text variant="heading/lg">splose AI settings: More control, your way</Text>
      <Text variant="display/md" style={{ marginTop: 16 }}>Preferences</Text>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  CalendarDateDisplay                                                */
/*  Pattern: Calendar header with display/md for the current date      */
/*  and caption/md for supporting context                              */
/*  Source: src/app/calendar/CalendarView.tsx — toolbar date label      */
/* ------------------------------------------------------------------ */

export const CalendarDateDisplay: Story = {
  name: "Recipe: Calendar Date Display",
  render: () => (
    <div style={{ display: 'flex', maxWidth: 448, alignItems: 'center', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
      <div>
        <Text variant="display/md">March 2026</Text>
        <Text variant="caption/md" color="text-text-secondary">
          Week of 23 Mar - 29 Mar
        </Text>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button style={{ borderRadius: 4, border: '1px solid var(--color-border)', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}>
          &larr;
        </button>
        <button style={{ borderRadius: 4, border: '1px solid var(--color-border)', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}>
          &rarr;
        </button>
        <button style={{ borderRadius: 4, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 4, paddingBottom: 4, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}>
          Today
        </button>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  SectionHeadingHierarchy                                            */
/*  Pattern: Nested heading hierarchy used across settings and client  */
/*  detail pages — display for page title, heading/lg for sections,    */
/*  heading/sm for sub-sections                                        */
/*  Source: src/app/settings/ai/page.tsx and                            */
/*  src/app/clients/[id]/ClientDetailClient.tsx — heading hierarchy    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  PageTitleVariant                                                   */
/*  New variant: page-title (30px/700/Sprig Sans/green)               */
/*  Used by DetailPage and Navbar headers. Session 03.                 */
/* ------------------------------------------------------------------ */

export const PageTitleVariant: Story = {
  name: "New: Page Title Variant",
  render: () => (
    <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <div>
        <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>variant=&quot;page-title&quot; — Sprig Sans, 30px, 700, rgb(66,105,74)</p>
        <Text variant="page-title">Client Overview</Text>
      </div>
      <div>
        <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>variant=&quot;heading/xl&quot; — Inter, 28px, 700</p>
        <Text variant="heading/xl">Section Heading XL</Text>
      </div>
      <div>
        <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>Typical detail page header pattern</p>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <Text variant="page-title">Sarah Johnson</Text>
          <Text variant="body/md" color="secondary" style={{ marginTop: 4 }}>sarah@example.com · 0412 345 678</Text>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  Spacing: mb / mt props                                             */
/*  Pattern: Use mb/mt to add spacing to Text without an inline style  */
/*  object — eliminates the most common style={{ marginBottom: N }}    */
/*  pattern across Wave 6 migration targets.                           */
/* ------------------------------------------------------------------ */

export const Spacing: Story = {
  name: "New: mb/mt Spacing Props",
  render: () => (
    <div style={{ maxWidth: 512, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 16 }}>
        mb/mt props apply marginBottom/Top in px — no style prop needed.
      </p>
      <div style={{ backgroundColor: '#f9fafb', borderRadius: 4, padding: 16 }}>
        <Text variant="heading/lg" mb={4}>Section heading (mb=4)</Text>
        <Text variant="body/md" color="secondary" mb={16}>Supporting description for the section. Notice the 4px gap above and 16px gap below.</Text>
        <Text variant="heading/md" mb={8}>Sub-section (mb=8)</Text>
        <Text variant="body/md" mt={4}>Body text with mt=4. Use mt for spacing from a previous element without touching it.</Text>
        <Text variant="caption/sm" color="secondary" mt={12} mb={0}>Caption with mt=12 mb=0</Text>
      </div>
      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 16 }}>
        Before: <code>{'<Text style={{ marginBottom: 16 }}>'}</code><br />
        After: <code>{'<Text mb={16}>'}</code>
      </p>
    </div>
  ),
  parameters: { layout: "padded" },
};

export const SectionHeadingHierarchy: Story = {
  name: "Recipe: Section Heading Hierarchy",
  render: () => (
    <div style={{ maxWidth: 512, display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <Text variant="display/lg">Page Title (display/lg)</Text>
      <Text variant="body/md" color="text-text-secondary">
        Introductory paragraph for the page.
      </Text>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      <Text variant="heading/lg">Section Heading (heading/lg)</Text>
      <Text variant="heading/sm">Sub-section (heading/sm)</Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text variant="body/md">Toggle setting label</Text>
          <div style={{ height: 20, width: 40, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text variant="body/md">Another setting label</Text>
          <div style={{ height: 20, width: 40, borderRadius: '50%', backgroundColor: '#d1d5db' }} />
        </div>
      </div>

      <Text variant="caption/md" color="text-text-secondary">
        Last saved 24 Mar 2026
      </Text>
    </div>
  ),
  parameters: { layout: "padded" },
};
