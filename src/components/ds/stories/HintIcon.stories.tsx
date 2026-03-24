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
    <div className="w-96 space-y-6 rounded-lg border border-border bg-white p-6">
      <div>
        <label className="mb-1 block text-label-lg text-text">
          Workspace URL <HintIcon tooltip="Your unique Splose workspace URL" />
        </label>
        <input
          type="text"
          defaultValue="acme.splose.com"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          readOnly
        />
      </div>

      <div>
        <label className="mb-1 block text-label-lg text-text">
          Patient terminology <HintIcon tooltip="Choose how you refer to your patients across the platform" />
          <span className="text-red-500">*</span>
        </label>
        <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary">
          <option>Client</option>
          <option>Patient</option>
          <option>Participant</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-label-lg text-text">
          Default appointment communication preferences{" "}
          <HintIcon tooltip="Set default SMS and email preferences for new appointment templates" />
          <span className="text-red-500">*</span>
        </label>
        <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary">
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
    <div className="w-[600px] space-y-4 rounded-lg border border-border bg-white p-6">
      <h2 className="text-heading-lg text-text">
        Associated contacts <HintIcon className="ml-1" tooltip="Contacts linked to this client record" />
      </h2>
      <table className="w-full text-body-md">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-2 text-left text-label-lg text-text">Name</th>
            <th className="pb-2 text-left text-label-lg text-text">Type</th>
            <th className="pb-2 text-left text-label-lg text-text">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2 text-primary">Test doctor</td>
            <td className="py-2">Doctor</td>
            <td className="py-2">hello</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2 text-primary">Jo malone</td>
            <td className="py-2">Standard</td>
            <td className="py-2">N/A</td>
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
    <div className="w-[280px]">
      <div className="rounded-lg bg-primary p-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-label-lg">Account balance</h3>
          <HintIcon className="h-5 w-5 border-white/50 text-white/80" tooltip="Outstanding balance for this client" />
        </div>
        <div className="mt-2 flex items-center justify-between text-body-md">
          <span className="flex items-center gap-1">
            They owe
            <HintIcon className="border-white/40 text-white/80" tooltip="Total of unpaid invoices" />
          </span>
          <span className="font-semibold">3,310.56</span>
        </div>
        <div className="flex items-center justify-between text-body-md">
          <span>Available credit balance</span>
          <span className="font-semibold">0.00</span>
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
    <div className="w-80 space-y-6 rounded-lg border border-border bg-white p-6">
      <div>
        <label className="mb-1 block text-label-lg text-text">
          Patient terminology{" "}
          <HintIcon tooltip="Choose how you refer to your patients" />
          <span className="text-red-500">*</span>
        </label>
        <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text">
          <option>Client</option>
          <option>Patient</option>
          <option>Participant</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-label-lg text-text">
          Business email{" "}
          <HintIcon tooltip="Primary contact email for your business" />
          <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          defaultValue="hello@example.com"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-label-lg text-text">
          Website <HintIcon tooltip="Your public-facing website URL" />
        </label>
        <input
          type="text"
          defaultValue="hands-together-therapy.com"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary"
        />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
