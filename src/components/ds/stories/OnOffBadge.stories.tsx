import type { Meta, StoryObj } from "@storybook/react";
import OnOffBadge from "../OnOffBadge";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof OnOffBadge> = {
  title: "Data Display/OnOffBadge",
  component: OnOffBadge,
  argTypes: {
    value: {
      control: "boolean",
      description: "Whether the badge shows the on or off state",
    },
    onLabel: {
      control: "text",
      description: 'Text when on (default: "On")',
    },
    offLabel: {
      control: "text",
      description: 'Text when off (default: "Off")',
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof OnOffBadge>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    value: true,
    onLabel: "On",
    offLabel: "Off",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const On: Story = {
  args: { value: true },
};

export const Off: Story = {
  args: { value: false },
};

export const CustomLabels: Story = {
  args: { value: true, onLabel: "Yes", offLabel: "No" },
};

export const CustomLabelsOff: Story = {
  args: { value: false, onLabel: "Active", offLabel: "Inactive" },
};

/* ------------------------------------------------------------------ */
/*  Side-by-side comparison                                            */
/* ------------------------------------------------------------------ */

export const Comparison: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <OnOffBadge value={true} />
        <p className="mt-1 text-xs text-text-secondary">Default on</p>
      </div>
      <div className="text-center">
        <OnOffBadge value={false} />
        <p className="mt-1 text-xs text-text-secondary">Default off</p>
      </div>
      <div className="text-center">
        <OnOffBadge value={true} onLabel="Yes" offLabel="No" />
        <p className="mt-1 text-xs text-text-secondary">Yes/No</p>
      </div>
      <div className="text-center">
        <OnOffBadge value={false} onLabel="Enabled" offLabel="Disabled" />
        <p className="mt-1 text-xs text-text-secondary">Enabled/Disabled</p>
      </div>
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  SettingsTemplateRow                                                 */
/*  Pattern: SMS and Email On/Off columns in appointment templates     */
/*  table. Each template row shows green "On" or red "Off" for both    */
/*  SMS and Email notification settings.                               */
/*  Source: /settings/appointment-templates — OnOffBadge in SMS/Email   */
/*  columns of the template DataTable                                  */
/* ------------------------------------------------------------------ */

export const SettingsTemplateRow: Story = {
  name: "Recipe: Settings Template Row",
  render: () => (
    <div className="w-[700px]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-purple-50">
            <th className="px-4 py-3 text-left text-label-lg text-text">Name</th>
            <th className="px-4 py-3 text-left text-label-lg text-text">Type</th>
            <th className="px-4 py-3 text-left text-label-lg text-text">SMS</th>
            <th className="px-4 py-3 text-left text-label-lg text-text">Email</th>
            <th className="px-4 py-3 text-left text-label-lg text-text">Last modified</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            { name: "Initial Assessment", type: "Appointment", sms: true, email: true, modified: "15 Mar 2026, 2:30 pm" },
            { name: "Follow Up - Standard", type: "Appointment", sms: true, email: false, modified: "12 Mar 2026, 10:00 am" },
            { name: "Cancellation Notice", type: "Cancellation", sms: false, email: true, modified: "10 Mar 2026, 9:15 am" },
            { name: "Reminder - 24 Hours", type: "Reminder", sms: true, email: true, modified: "8 Mar 2026, 4:00 pm" },
            { name: "No Show Follow Up", type: "No Show", sms: false, email: false, modified: "5 Mar 2026, 11:30 am" },
          ].map((t) => (
            <tr key={t.name} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-body-md text-text">{t.name}</td>
              <td className="px-4 py-3 text-body-md text-text-secondary">{t.type}</td>
              <td className="px-4 py-3 text-body-md">
                <OnOffBadge value={t.sms} />
              </td>
              <td className="px-4 py-3 text-body-md">
                <OnOffBadge value={t.email} />
              </td>
              <td className="px-4 py-3 text-body-md text-text-secondary">{t.modified}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};
