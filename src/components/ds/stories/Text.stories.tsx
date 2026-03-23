import type { Meta, StoryObj } from "@storybook/react";
import Text from "../Text";
import type { TextVariant } from "../Text";

const ALL_VARIANTS: TextVariant[] = [
  "display/lg", "display/md", "display/sm",
  "heading/lg", "heading/md", "heading/sm",
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
  <div className="flex items-baseline gap-6 border-b border-gray-100 py-3">
    <code className="w-44 shrink-0 text-xs text-gray-400">{label}</code>
    <Text variant={variant}>{sampleText(variant)}</Text>
    <span className="ml-auto shrink-0 text-xs text-gray-400">{specs}</span>
  </div>
);

function sampleText(variant: TextVariant): string {
  if (variant.startsWith("metric/")) return "$12,450.00";
  if (variant.startsWith("display/")) return "Page Title";
  if (variant.startsWith("heading/")) return "Section Heading";
  if (variant.startsWith("label/")) return "Field Label";
  if (variant.startsWith("caption/")) return "Helper text or timestamp";
  return "The quick brown fox jumps over the lazy dog.";
}

export const AllStyles: Story = {
  render: () => (
    <div className="max-w-3xl space-y-8">
      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          Display — Sprig Sans, Bold
        </h3>
        <StyleRow variant="display/lg" label="display/lg" specs="30px / 700 / 1.2" />
        <StyleRow variant="display/md" label="display/md" specs="24px / 700 / 1.33" />
        <StyleRow variant="display/sm" label="display/sm" specs="18px / 700 / 1.33" />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          Heading — Inter, SemiBold
        </h3>
        <StyleRow variant="heading/lg" label="heading/lg" specs="18px / 600 / 1.33" />
        <StyleRow variant="heading/md" label="heading/md" specs="16px / 600 / 1.375" />
        <StyleRow variant="heading/sm" label="heading/sm" specs="14px / 600 / 1.43" />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          Body — Inter, Regular & Bold
        </h3>
        <StyleRow variant="body/lg" label="body/lg" specs="16px / 400 / 1.375" />
        <StyleRow variant="body/md" label="body/md" specs="14px / 400 / 1.43" />
        <StyleRow variant="body/sm" label="body/sm" specs="12px / 400 / 1.33" />
        <StyleRow variant="body/lg-strong" label="body/lg-strong" specs="16px / 700 / 1.375" />
        <StyleRow variant="body/md-strong" label="body/md-strong" specs="14px / 700 / 1.43" />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          Label — Inter, Medium
        </h3>
        <StyleRow variant="label/lg" label="label/lg" specs="14px / 500 / 1.43" />
        <StyleRow variant="label/md" label="label/md" specs="12px / 500 / 1.33" />
        <StyleRow variant="label/sm" label="label/sm" specs="11px / 500 / 1.45 wide" />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          Caption — Inter, Regular
        </h3>
        <StyleRow variant="caption/md" label="caption/md" specs="12px / 400 / 1.33" />
        <StyleRow variant="caption/sm" label="caption/sm" specs="11px / 400 / 1.27" />
      </section>

      <section>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          Metric — Inter, Bold, tabular figures
        </h3>
        <StyleRow variant="metric/lg" label="metric/lg" specs="30px / 700 / 1.2 tnum" />
        <StyleRow variant="metric/md" label="metric/md" specs="24px / 700 / 1.33 tnum" />
      </section>
    </div>
  ),
};

export const WithColorOverride: Story = {
  render: () => (
    <div className="space-y-2">
      <Text variant="body/md">Default color (text)</Text>
      <Text variant="body/md" color="text-text-secondary">Secondary color</Text>
      <Text variant="body/md" color="text-primary">Primary color</Text>
      <Text variant="body/md" color="text-danger">Danger color</Text>
    </div>
  ),
};

export const WithElementOverride: Story = {
  render: () => (
    <div className="space-y-2">
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
      { variant: "display/lg", css: "text-display-lg", font: "Sprig Sans 30/700" },
      { variant: "display/md", css: "text-display-md", font: "Sprig Sans 24/700" },
      { variant: "display/sm", css: "text-display-sm", font: "Sprig Sans 18/700" },
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
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4 font-medium">Variant</th>
            <th className="py-2 pr-4 font-medium">CSS Class</th>
            <th className="py-2 pr-4 font-medium">Font / Size / Weight</th>
            <th className="py-2 font-medium">Preview</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.variant} className="border-b border-gray-100">
              <td className="py-2 pr-4">
                <code className="text-xs">{r.variant}</code>
              </td>
              <td className="py-2 pr-4">
                <code className="text-xs text-gray-500">{r.css}</code>
              </td>
              <td className="py-2 pr-4 text-xs text-gray-500">{r.font}</td>
              <td className="py-2">
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
    <div className="max-w-2xl space-y-6 rounded-lg border border-border bg-white p-8">
      <p className="text-body-sm text-text-secondary">
        How display, heading, body, label, caption, and metric are used
        together on a typical Splose page.
      </p>

      <hr className="border-border" />

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
      <div className="grid grid-cols-3 gap-6 rounded-lg border border-border p-4">
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
      <div className="space-y-2">
        <div className="flex gap-4">
          <Text variant="label/lg" color="text-text-secondary" className="w-32">Email</Text>
          <Text variant="body/md">sarah.johnson@example.com</Text>
        </div>
        <div className="flex gap-4">
          <Text variant="label/lg" color="text-text-secondary" className="w-32">Phone</Text>
          <Text variant="body/md">0412 345 678</Text>
        </div>
        <div className="flex gap-4">
          <Text variant="label/lg" color="text-text-secondary" className="w-32">Medicare</Text>
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
