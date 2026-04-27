import type { Meta, StoryObj } from "@storybook/react";
import HintIcon from "../HintIcon";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof HintIcon> = {
  title: "Forms/HintIcon",
  component: HintIcon,
  argTypes: {
    tooltip: {
      control: "text",
      description: "Tooltip text shown on hover",
    },
    tone: {
      control: "radio",
      options: ["default", "inverted"],
      description: "Color tone — use inverted on dark/colored backgrounds",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "Icon size: sm=12px, md=14px (default), lg=20px",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof HintIcon>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    tooltip: "This is a helpful hint",
    tone: "default",
    size: "md",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {};

export const WithTooltip: Story = {
  args: { tooltip: "This is a helpful hint" },
};

export const InLabel: Story = {
  render: () => (
    <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>
      Workspace URL <HintIcon tooltip="Your unique Splose workspace URL" />
    </label>
  ),
};

/** tone="inverted" for use on dark/primary-coloured backgrounds */
export const ToneGrid: Story = {
  name: "Tone Grid",
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>default (md)</span>
        <HintIcon tone="default" size="md" tooltip="Default tone on light bg" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "var(--color-primary)", borderRadius: 8, padding: 12 }}>
        <span style={{ fontSize: 12, lineHeight: 1.67, color: "rgba(255,255,255,0.7)" }}>inverted (md)</span>
        <HintIcon tone="inverted" size="md" tooltip="Inverted tone on dark bg" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "var(--color-primary)", borderRadius: 8, padding: 12 }}>
        <span style={{ fontSize: 12, lineHeight: 1.67, color: "rgba(255,255,255,0.7)" }}>inverted (lg)</span>
        <HintIcon tone="inverted" size="lg" tooltip="Large inverted icon" />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  SettingsFormLabel                                                   */
/*  Pattern: HintIcon inline next to form labels on the settings page  */
/*  Source: /settings — "Workspace URL", "Patient terminology", and     */
/*  "Default appointment communication preferences" all have a small   */
/*  "i" hint icon beside the label text                                */
/* ------------------------------------------------------------------ */

export const SettingsFormLabel: Story = {
  name: "Recipe: Settings Form Label",
  render: () => (
    <div style={{ width: 384, display: 'flex', flexDirection: 'column', gap: 24, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <div>
        <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>
          Workspace URL <HintIcon tooltip="Your unique Splose workspace URL" />
        </label>
        <input
          type="text"
          defaultValue="acme.splose.com"
          style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}
          readOnly
        />
      </div>

      <div>
        <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>
          Patient terminology <HintIcon tooltip="Choose how you refer to your patients across the platform" />
          <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
          <option>Client</option>
          <option>Patient</option>
          <option>Participant</option>
        </select>
      </div>

      <div>
        <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>
          Default appointment communication preferences{" "}
          <HintIcon tooltip="Set default SMS and email preferences for new appointment templates" />
          <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
          <option>SMS &amp; Email</option>
          <option>SMS only</option>
          <option>Email only</option>
          <option>None</option>
        </select>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  SectionHeadingHint                                                 */
/*  Pattern: HintIcon next to a section heading for "Associated        */
/*  contacts" on the client detail page                                */
/*  Source: /clients/[id]/ClientDetailClient.tsx (line 243)            */
/* ------------------------------------------------------------------ */

export const SectionHeadingHint: Story = {
  name: "Recipe: Section Heading Hint",
  render: () => (
    <div style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)' }}>
        Associated contacts <HintIcon tooltip="Contacts linked to this client record" />
      </h2>
      <table style={{ width: '100%', fontSize: 14, lineHeight: 1.57 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', paddingBottom: 8, textAlign: 'left' }}>Name</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', paddingBottom: 8, textAlign: 'left' }}>Type</th>
            <th style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', paddingBottom: 8, textAlign: 'left' }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ color: 'var(--color-primary)', paddingTop: 8, paddingBottom: 8 }}>Test doctor</td>
            <td style={{ paddingTop: 8, paddingBottom: 8 }}>Doctor</td>
            <td style={{ paddingTop: 8, paddingBottom: 8 }}>hello</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ color: 'var(--color-primary)', paddingTop: 8, paddingBottom: 8 }}>Jo malone</td>
            <td style={{ paddingTop: 8, paddingBottom: 8 }}>Standard</td>
            <td style={{ paddingTop: 8, paddingBottom: 8 }}>N/A</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  AccountBalanceHints                                                */
/*  Pattern: HintIcon with tone="inverted" inside the client account   */
/*  balance card (white icon on purple background)                     */
/*  Source: /clients/[id]/ClientDetailClient.tsx (lines 287, 293)      */
/* ------------------------------------------------------------------ */

export const AccountBalanceHints: Story = {
  name: "Recipe: Account Balance Hints",
  render: () => (
    <div style={{ width: 280 }}>
      <div style={{ backgroundColor: 'var(--color-primary)', borderRadius: 8, padding: 16, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57 }}>Account balance</h3>
          <HintIcon tone="inverted" size="lg" tooltip="Outstanding balance for this client" />
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.57, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            They owe
            <HintIcon tone="inverted" tooltip="Total of unpaid invoices" />
          </span>
          <span style={{ fontWeight: 600 }}>3,310.56</span>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.57, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Available credit balance</span>
          <span style={{ fontWeight: 600 }}>0.00</span>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  InlineWithRequired                                                 */
/*  Pattern: HintIcon combined with required asterisk on the same      */
/*  label — common in settings forms where both are present            */
/*  Source: /settings/page.tsx (Patient terminology, Communication)     */
/* ------------------------------------------------------------------ */

export const InlineWithRequired: Story = {
  name: "Recipe: Inline With Required Asterisk",
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 24, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <div>
        <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>
          Patient terminology{" "}
          <HintIcon tooltip="Choose how you refer to your patients" />
          <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
          <option>Client</option>
          <option>Patient</option>
          <option>Participant</option>
        </select>
      </div>

      <div>
        <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>
          Business email{" "}
          <HintIcon tooltip="Primary contact email for your business" />
          <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="email"
          defaultValue="hello@example.com"
          style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}
        />
      </div>

      <div>
        <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>
          Website <HintIcon tooltip="Your public-facing website URL" />
        </label>
        <input
          type="text"
          defaultValue="hands-together-therapy.com"
          style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}
        />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
