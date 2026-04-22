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
    <div style={{ width: 480, display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h4 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)' }}>splose AI - voice</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Enable voice to text and ask splose AI</span>
          <Toggle checked={true} onChange={() => {}} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Save recording to client file</span>
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
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 12, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
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
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 12, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Notifications</h4>
      <Toggle label="SMS" checked={true} onChange={() => {}} />
      <Toggle label="Email" checked={true} onChange={() => {}} />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  InvoiceOnlinePayments                                              */
/*  Pattern: Single toggle to enable/disable a major feature on a      */
/*  settings page, with descriptive label text.                        */
/*  Source: /settings/invoice-settings page — Enable online payments    */
/* ------------------------------------------------------------------ */

export const InvoiceOnlinePayments: Story = {
  name: "Recipe: Invoice Online Payments",
  render: () => (
    <div style={{ width: 480, display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h4 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)' }}>Online payments</h4>
      <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
        Enable online payment functionality for invoices sent to clients.
      </p>
      <Toggle
        checked={true}
        onChange={() => {}}
        label="Enable online payments for invoices"
      />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  CustomFieldModalToggles                                            */
/*  Pattern: Toggles in a modal form for creating/editing custom       */
/*  fields. "Display in client details" toggle shows a dynamic         */
/*  Yes/No label, and "Required" toggle has no label.                  */
/*  Source: /settings/custom-fields page — create/edit field modal      */
/* ------------------------------------------------------------------ */

export const CustomFieldModalToggles: Story = {
  name: "Recipe: Custom Field Modal Toggles",
  render: () => (
    <div style={{ width: 400, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h4 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)', marginBottom: 16 }}>New custom field</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Field name</label>
          <input
            style={{ width: '100%', borderRadius: 6, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}
            defaultValue="Medicare number"
          />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Field type</label>
          <select style={{ width: '100%', borderRadius: 6, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
            <option>Text</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Display in client details</span>
          <Toggle checked={true} onChange={() => {}} label="Yes" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Required</span>
          <Toggle checked={false} onChange={() => {}} />
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  OnlineBookingLocationToggles                                       */
/*  Pattern: Toggle for each location in a list — enable/disable       */
/*  online booking per location within a settings form.                */
/*  Source: /settings/online-bookings/[id] page — location toggles     */
/* ------------------------------------------------------------------ */

export const OnlineBookingLocationToggles: Story = {
  name: "Recipe: Online Booking Location Toggles",
  render: () => (
    <div style={{ width: 440, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h4 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)', marginBottom: 16 }}>Location settings</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { name: "East Clinics", enabled: true },
          { name: "West Clinics", enabled: true },
          { name: "North Clinics", enabled: false },
        ].map((loc) => (
          <div
            key={loc.name}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 8, border: '1px solid var(--color-border)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}
          >
            <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>{loc.name}</span>
            <Toggle checked={loc.enabled} onChange={() => {}} />
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ServiceNotificationToggles                                         */
/*  Pattern: Multiple toggles within a Collapse section for service    */
/*  notification settings — SMS/email confirmation toggles.            */
/*  Source: /settings/services/edit/[id] — Appointment notifications    */
/* ------------------------------------------------------------------ */

export const ServiceNotificationToggles: Story = {
  name: "Recipe: Service Notification Toggles",
  render: () => (
    <div style={{ width: 440, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h4 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)', marginBottom: 16 }}>Appointment notifications</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Toggle checked={true} onChange={() => {}} label="Send SMS confirmation" />
        <Toggle checked={true} onChange={() => {}} label="Send email confirmation" />
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>SMS reminder</label>
          <select style={{ width: '100%', borderRadius: 6, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
            <option>24 hours before</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.67, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Email reminder</label>
          <select style={{ width: '100%', borderRadius: 6, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
            <option>48 hours before</option>
          </select>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
