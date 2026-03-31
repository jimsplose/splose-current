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
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <OnOffBadge value={true} />
        <p className="text-text-secondary" style={{ marginTop: 4, fontSize: 11 }}>Default on</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <OnOffBadge value={false} />
        <p className="text-text-secondary" style={{ marginTop: 4, fontSize: 11 }}>Default off</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <OnOffBadge value={true} onLabel="Yes" offLabel="No" />
        <p className="text-text-secondary" style={{ marginTop: 4, fontSize: 11 }}>Yes/No</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <OnOffBadge value={false} onLabel="Enabled" offLabel="Disabled" />
        <p className="text-text-secondary" style={{ marginTop: 4, fontSize: 11 }}>Enabled/Disabled</p>
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
    <div style={{ width: 700 }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr className="border-border bg-table-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Name</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Type</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>SMS</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Email</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Last modified</th>
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
            <tr key={t.name} >
              <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{t.name}</td>
              <td className="text-body-md text-text-secondary" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{t.type}</td>
              <td className="text-body-md" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
                <OnOffBadge value={t.sms} />
              </td>
              <td className="text-body-md" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
                <OnOffBadge value={t.email} />
              </td>
              <td className="text-body-md text-text-secondary" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{t.modified}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ReferralTypeDefaultColumn                                          */
/*  Pattern: Yes/No OnOffBadge in a "Default type" column alongside    */
/*  the name column. Rows with defaultType=true show "Yes" in green,   */
/*  others show "No" in red.                                           */
/*  Source: /settings/referral-types page — Default type column         */
/* ------------------------------------------------------------------ */

export const ReferralTypeDefaultColumn: Story = {
  name: "Recipe: Referral Type Default Column",
  render: () => (
    <div style={{ width: 500 }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr className="border-border bg-table-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Name</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Default type</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            { name: "Client", isDefault: true },
            { name: "Contact", isDefault: true },
            { name: "Other", isDefault: true },
            { name: "Facebook", isDefault: false },
            { name: "Google", isDefault: false },
            { name: "Doctor", isDefault: false },
            { name: "GP", isDefault: false },
          ].map((r) => (
            <tr key={r.name} >
              <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{r.name}</td>
              <td className="text-body-md" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
                <OnOffBadge value={r.isDefault} onLabel="Yes" offLabel="No" />
              </td>
              <td className="text-body-md text-text-secondary" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right' }}>
                {r.isDefault ? "-" : "..."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  CommunicationTypesList                                             */
/*  Pattern: Communication types settings page showing On/Off status   */
/*  with custom Yes/No labels. Default types (SMS, Email) cannot be    */
/*  edited and show a dash instead of an actions dropdown.             */
/*  Source: /settings/communication-types page — OnOffBadge in column  */
/* ------------------------------------------------------------------ */

export const CommunicationTypesList: Story = {
  name: "Recipe: Communication Types List",
  render: () => (
    <div style={{ width: 500 }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr className="border-border bg-table-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Name</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Default type</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            { name: "SMS", isDefault: true },
            { name: "Email", isDefault: true },
            { name: "Phone call", isDefault: false },
            { name: "In-person", isDefault: false },
            { name: "Fax", isDefault: false },
            { name: "Admin Notes", isDefault: false },
          ].map((c) => (
            <tr key={c.name} >
              <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{c.name}</td>
              <td className="text-body-md" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
                <OnOffBadge value={c.isDefault} onLabel="Yes" offLabel="No" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  InlineStatus                                                       */
/*  Pattern: OnOffBadge used inline within a description list or       */
/*  settings summary to show feature on/off status at a glance.        */
/*  Source: /settings/appointment-templates — SMS/Email status per row  */
/* ------------------------------------------------------------------ */

export const InlineStatus: Story = {
  name: "Recipe: Inline Status Summary",
  render: () => (
    <div style={{ width: 320, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
      <h4 className="text-heading-sm text-text" style={{ marginBottom: 12 }}>Notification Settings</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: "SMS confirmations", enabled: true },
          { label: "Email confirmations", enabled: true },
          { label: "SMS reminders", enabled: false },
          { label: "Email reminders", enabled: true },
          { label: "Cancellation notices", enabled: false },
        ].map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="text-body-md text-text">{s.label}</span>
            <OnOffBadge value={s.enabled} />
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
