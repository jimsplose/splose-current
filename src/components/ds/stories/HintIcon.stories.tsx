import type { Meta, StoryObj } from "@storybook/react";
import HintIcon from "../HintIcon";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof HintIcon> = {
  title: "Data Display/HintIcon",
  component: HintIcon,
  argTypes: {
    tooltip: {
      control: "text",
      description: "Tooltip text shown on hover (uses native title attribute)",
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
    <label className="text-label-lg text-text">
      Workspace URL <HintIcon tooltip="Your unique Splose workspace URL" />
    </label>
  ),
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
        <label className="text-label-lg text-text" style={{ marginBottom: 4, display: 'block' }}>
          Workspace URL <HintIcon tooltip="Your unique Splose workspace URL" />
        </label>
        <input
          type="text"
          defaultValue="acme.splose.com"
          className="border-border text-body-md text-text" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}
          readOnly
        />
      </div>

      <div>
        <label className="text-label-lg text-text" style={{ marginBottom: 4, display: 'block' }}>
          Patient terminology <HintIcon tooltip="Choose how you refer to your patients across the platform" />
          <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select className="border-border text-body-md text-text" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}>
          <option>Client</option>
          <option>Patient</option>
          <option>Participant</option>
        </select>
      </div>

      <div>
        <label className="text-label-lg text-text" style={{ marginBottom: 4, display: 'block' }}>
          Default appointment communication preferences{" "}
          <HintIcon tooltip="Set default SMS and email preferences for new appointment templates" />
          <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select className="border-border text-body-md text-text" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}>
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
/*  Source: /clients/[id]/ClientDetailClient.tsx (line 228)            */
/* ------------------------------------------------------------------ */

export const SectionHeadingHint: Story = {
  name: "Recipe: Section Heading Hint",
  render: () => (
    <div style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h2 className="text-heading-lg text-text">
        Associated contacts <HintIcon style={{ marginLeft: 4 }} tooltip="Contacts linked to this client record" />
      </h2>
      <table className="text-body-md" style={{ width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th className="text-label-lg text-text" style={{ paddingBottom: 8, textAlign: 'left' }}>Name</th>
            <th className="text-label-lg text-text" style={{ paddingBottom: 8, textAlign: 'left' }}>Type</th>
            <th className="text-label-lg text-text" style={{ paddingBottom: 8, textAlign: 'left' }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td className="text-primary" style={{ paddingTop: 8, paddingBottom: 8 }}>Test doctor</td>
            <td style={{ paddingTop: 8, paddingBottom: 8 }}>Doctor</td>
            <td style={{ paddingTop: 8, paddingBottom: 8 }}>hello</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td className="text-primary" style={{ paddingTop: 8, paddingBottom: 8 }}>Jo malone</td>
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
/*  Pattern: HintIcon with custom light-on-dark styling inside the     */
/*  client account balance card (white icon on purple background)      */
/*  Source: /clients/[id]/ClientDetailClient.tsx (lines 271, 276)      */
/* ------------------------------------------------------------------ */

export const AccountBalanceHints: Story = {
  name: "Recipe: Account Balance Hints",
  render: () => (
    <div style={{ width: 280 }}>
      <div className="bg-primary" style={{ borderRadius: 8, padding: 16, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 className="text-label-lg">Account balance</h3>
          <HintIcon className="text-white/80" style={{borderColor: 'rgba(255,255,255,0.5)', height: 20, width: 20 }} tooltip="Outstanding balance for this client" />
        </div>
        <div className="text-body-md" style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            They owe
            <HintIcon className="text-white/80" style={{ borderColor: 'rgba(255,255,255,0.4)' }} tooltip="Total of unpaid invoices" />
          </span>
          <span style={{ fontWeight: 600 }}>3,310.56</span>
        </div>
        <div className="text-body-md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        <label className="text-label-lg text-text" style={{ marginBottom: 4, display: 'block' }}>
          Patient terminology{" "}
          <HintIcon tooltip="Choose how you refer to your patients" />
          <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select className="border-border text-body-md text-text" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
          <option>Client</option>
          <option>Patient</option>
          <option>Participant</option>
        </select>
      </div>

      <div>
        <label className="text-label-lg text-text" style={{ marginBottom: 4, display: 'block' }}>
          Business email{" "}
          <HintIcon tooltip="Primary contact email for your business" />
          <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="email"
          defaultValue="hello@example.com"
          className="border-border text-body-md text-text" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}
        />
      </div>

      <div>
        <label className="text-label-lg text-text" style={{ marginBottom: 4, display: 'block' }}>
          Website <HintIcon tooltip="Your public-facing website URL" />
        </label>
        <input
          type="text"
          defaultValue="hands-together-therapy.com"
          className="border-border text-body-md text-text" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, outline: 'none' }}
        />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
