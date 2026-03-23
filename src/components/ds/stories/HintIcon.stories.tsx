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
