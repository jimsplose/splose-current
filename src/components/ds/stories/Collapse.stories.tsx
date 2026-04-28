import type { Meta, StoryObj } from "@storybook/react";
import Collapse from "../Collapse";
import Badge from "../Badge";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Collapse> = {
  title: "Layout/Collapse",
  component: Collapse,
  tags: ["extended"],
  argTypes: {
    title: {
      control: "text",
      description: "Section heading displayed in the clickable bar",
    },
    defaultOpen: {
      control: "boolean",
      description: "Whether the section starts expanded",
    },
  },
  parameters: {
    layout: "padded",
    appPages: [
      { label: "Patient details", vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h", localhost: "http://localhost:3000/clients/cmngtw7n9005eycwg4e67506h", production: "https://acme.splose.com/patients/446604/details" },
      { label: "Settings — Locations (edit)", vercel: "https://splose-current.vercel.app/settings/locations/edit/1", localhost: "http://localhost:3000/settings/locations/edit/1", production: "https://acme.splose.com/settings/locations" },
      { label: "Settings — Appointment templates (new)", vercel: "https://splose-current.vercel.app/settings/appointment-templates/new", localhost: "http://localhost:3000/settings/appointment-templates/new", production: "https://acme.splose.com/settings/appointment-templates" },
    ],
    referenceUrl: "https://ant.design/components/collapse",
  },
};

export default meta;
type Story = StoryObj<typeof Collapse>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    title: "Section title",
    defaultOpen: false,
    children: (
      <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
        Content that is revealed when the section is expanded.
      </p>
    ),
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: {
    title: "Client alerts",
    children: <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>No alerts configured.</p>,
  },
};

export const InitiallyOpen: Story = {
  args: {
    title: "Stripe integration",
    defaultOpen: true,
    children: <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Connected to Stripe account.</p>,
  },
};

export const Multiple: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Collapse title="General" defaultOpen>
        <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>General settings content.</p>
      </Collapse>
      <Collapse title="Pricing" defaultOpen>
        <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Pricing configuration.</p>
      </Collapse>
      <Collapse title="Online booking">
        <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Online booking options.</p>
      </Collapse>
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  ClientSidebarSections                                              */
/*  Pattern: Client detail sidebar with alerts, integrations, etc.     */
/*  Source: /clients/[id] ClientDetailClient sidebar                   */
/* ------------------------------------------------------------------ */

export const ClientSidebarSections: Story = {
  render: () => (
    <aside style={{ width: 320, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
      <Collapse title="Client alerts" defaultOpen>
        <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Include KM</span>
      </Collapse>

      <Collapse title="Stripe" defaultOpen>
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
          Connect with Stripe and save a credit card for clients and use for future use.
        </p>
      </Collapse>

      <Collapse title="Mailchimp" defaultOpen>
        <div style={{ fontSize: 12, lineHeight: 1.67, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--color-primary)' }}>rakesh.splose@gmail.com</span>
            <Badge variant="orange">ARCHIVED</Badge>
          </div>
        </div>
      </Collapse>

      <Collapse title="QuickBooks">
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>No QuickBooks connection.</p>
      </Collapse>
    </aside>
  ),
};

/* ------------------------------------------------------------------ */
/*  ServiceEditSections                                                */
/*  Pattern: Stacked collapse sections for editing a service with      */
/*  forms, toggles, and conditional fields inside each section         */
/*  Source: /settings/services/edit/[id]/EditServiceClient.tsx          */
/* ------------------------------------------------------------------ */

export const ServiceEditSections: Story = {
  render: () => (
    <div style={{ width: 600 }}>
      <Collapse title="General" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Name</label>
            <input style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} defaultValue="Initial Consultation" />
          </div>
          <div>
            <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Item code</label>
            <input style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} defaultValue="93010" />
          </div>
        </div>
      </Collapse>

      <Collapse title="Pricing" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Price</label>
            <input type="number" style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} defaultValue="200" />
          </div>
          <div>
            <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Duration (minutes)</label>
            <input style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} defaultValue="60" />
          </div>
        </div>
      </Collapse>

      <Collapse title="Online booking" defaultOpen>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 4, paddingBottom: 4 }}>
          <div style={{ height: 20, width: 36, borderRadius: 9999, backgroundColor: 'var(--color-primary)' }} />
          <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Enable online booking</span>
        </div>
      </Collapse>

      <Collapse title="Online payment">
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>Configure online payment requirements for this service.</p>
      </Collapse>

      <Collapse title="Appointment notifications">
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>Set up SMS and email notifications for appointments using this service.</p>
      </Collapse>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  AppointmentTemplateSections                                        */
/*  Pattern: SMS and Email collapse sections with toggles that         */
/*  conditionally show message editing content inside                  */
/*  Source: /settings/appointment-templates/new/page.tsx                */
/* ------------------------------------------------------------------ */

export const AppointmentTemplateSections: Story = {
  render: () => (
    <div style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings/appointment-templates/new</code> — collapse sections
        that wrap notification channels with toggle + message editor inside.
      </p>

      <Collapse title="SMS" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ height: 20, width: 36, borderRadius: 9999, backgroundColor: 'var(--color-primary)' }} />
            <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Enable SMS notification</span>
          </div>
          <div>
            <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Message</label>
            <textarea
              style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}
              rows={3}
              defaultValue="Hi {client_first_name}, this is a reminder about your appointment on {appointment_date} at {appointment_time}."
            />
            <p style={{ marginTop: 4, fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
              Variables: {"{client_first_name}"}, {"{appointment_date}"}, {"{appointment_time}"}
            </p>
          </div>
        </div>
      </Collapse>

      <Collapse title="Email" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ height: 20, width: 36, borderRadius: 9999, backgroundColor: 'var(--color-primary)' }} />
            <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Enable email notification</span>
          </div>
          <div>
            <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Subject</label>
            <input
              style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}
              defaultValue="Your upcoming appointment"
            />
          </div>
        </div>
      </Collapse>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  UserDetailSections                                                 */
/*  Pattern: Profile / Role & Access / Security collapse sections      */
/*  for user settings detail page                                      */
/*  Source: /settings/users/[id]/UserDetailClient.tsx                   */
/* ------------------------------------------------------------------ */

export const UserDetailSections: Story = {
  render: () => (
    <div style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings/users/[id]</code> — user detail page
        with Profile, Role &amp; Access, and Security sections.
      </p>

      <Collapse title="Profile" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Name</label>
            <input style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} defaultValue="Sarah Johnson" />
          </div>
          <div>
            <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Email</label>
            <input style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#f9fafb', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} defaultValue="sarah@example.com" readOnly />
          </div>
        </div>
      </Collapse>

      <Collapse title="Role & Access" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Role name</label>
            <select style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
              <option>Practitioner</option>
              <option>Admin</option>
              <option>Receptionist</option>
            </select>
          </div>
          <div>
            <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Role type</label>
            <select style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
              <option>Clinical</option>
              <option>Administrative</option>
            </select>
          </div>
        </div>
      </Collapse>

      <Collapse title="Security" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>Reset password</button>
          <button style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>Log out everywhere</button>
          <button style={{ fontSize: 14, lineHeight: 1.57, borderRadius: 8, border: '1px solid #fecaca', backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, color: '#dc2626' }}>Deactivate account</button>
        </div>
      </Collapse>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  LocationFormSections                                               */
/*  Pattern: Location new/edit form with General, Address, and         */
/*  Online booking collapse sections with grid layouts inside          */
/*  Source: /settings/locations/new/page.tsx                            */
/* ------------------------------------------------------------------ */

export const LocationFormSections: Story = {
  render: () => (
    <div style={{ width: 700, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings/locations/new</code> — location form
        with General, Address, and Online booking sections.
      </p>

      <Collapse title="General" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div>
              <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Name</label>
              <input style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} placeholder="e.g. East Clinics" />
            </div>
            <div>
              <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>ABN</label>
              <input style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div>
              <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Email</label>
              <input type="email" style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} />
            </div>
            <div>
              <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Phone</label>
              <input style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} />
            </div>
          </div>
        </div>
      </Collapse>

      <Collapse title="Address" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Address</label>
            <input style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div>
              <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Suburb</label>
              <input style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} />
            </div>
            <div>
              <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>State</label>
              <select style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
                <option>NSW</option>
                <option>VIC</option>
                <option>QLD</option>
              </select>
            </div>
            <div>
              <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Post code</label>
              <input style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }} />
            </div>
          </div>
        </div>
      </Collapse>

      <Collapse title="Online booking">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 4, paddingBottom: 4 }}>
          <div style={{ height: 20, width: 36, borderRadius: 9999, backgroundColor: '#d1d5db' }} />
          <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Enable online booking for this location</span>
        </div>
      </Collapse>
    </div>
  ),
};
