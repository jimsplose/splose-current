import type { Meta, StoryObj } from "@storybook/react";
import Toggle from "../Toggle";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Toggle> = {
  title: "Forms/Toggle",
  component: Toggle,
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the toggle is on or off",
    },
    label: {
      control: "text",
      description: "Optional label displayed next to the switch",
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and reduces opacity",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    checked: true,
    label: "Enable feature",
    disabled: false,
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const On: Story = {
  args: { checked: true },
};

export const Off: Story = {
  args: { checked: false },
};

export const WithLabel: Story = {
  args: { checked: true, label: "Enable voice-to-text" },
};

export const Disabled: Story = {
  args: { checked: false, disabled: true, label: "Disabled toggle" },
};

export const DisabledOn: Story = {
  args: { checked: true, disabled: true, label: "Locked on" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  SettingsToggle                                                     */
/*  Pattern: Label on left, toggle on right — settings pages           */
/*  Source: /settings/ai page                                          */
/* ------------------------------------------------------------------ */

export const SettingsToggle: Story = {
  render: () => (
    <div className="w-[480px] space-y-4 rounded-lg border border-border bg-white p-6">
      <h4 className="text-heading-lg text-text">splose AI - voice</h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-body-md text-text">Enable voice to text and ask splose AI</span>
          <Toggle checked={true} onChange={() => {}} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-body-md text-text">Save recording to client file</span>
          <Toggle checked={false} onChange={() => {}} />
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  CalendarRepeatToggle                                               */
/*  Pattern: Stacked toggles with labels in a create/edit modal        */
/*  Source: /calendar CalendarView create appointment modal             */
/* ------------------------------------------------------------------ */

export const CalendarRepeatToggle: Story = {
  render: () => (
    <div className="w-[360px] space-y-3 rounded-lg border border-border bg-white p-6">
      <Toggle checked={true} onChange={() => {}} label="Provider travel" />
      <Toggle checked={false} onChange={() => {}} label="Provider Travel - Non-Labour Costs" />
      <Toggle checked={false} onChange={() => {}} label="Activity Based Transport" />
      <Toggle checked={true} onChange={() => {}} label="Repeat" />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  SMSOptOut                                                          */
/*  Pattern: Toggle pair for SMS/Email notification channels           */
/*  Source: /settings/appointment-templates modal                      */
/* ------------------------------------------------------------------ */

export const SMSOptOut: Story = {
  render: () => (
    <div className="w-[360px] space-y-3 rounded-lg border border-border bg-white p-6">
      <h4 className="text-heading-sm text-text">Notifications</h4>
      <Toggle label="SMS" checked={true} onChange={() => {}} />
      <Toggle label="Email" checked={true} onChange={() => {}} />
    </div>
  ),
  parameters: { layout: "padded" },
};
