import type { Meta, StoryObj } from "@storybook/react";
import Collapse from "../Collapse";
import Badge from "../Badge";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Collapse> = {
  title: "Layout/Collapse",
  component: Collapse,
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
      <p className="text-body-md text-text-secondary">
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
    children: <p className="text-body-md text-text-secondary">No alerts configured.</p>,
  },
};

export const InitiallyOpen: Story = {
  args: {
    title: "Stripe integration",
    defaultOpen: true,
    children: <p className="text-body-md text-text-secondary">Connected to Stripe account.</p>,
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="w-[400px]">
      <Collapse title="General" defaultOpen>
        <p className="text-body-md text-text-secondary">General settings content.</p>
      </Collapse>
      <Collapse title="Pricing" defaultOpen>
        <p className="text-body-md text-text-secondary">Pricing configuration.</p>
      </Collapse>
      <Collapse title="Online booking">
        <p className="text-body-md text-text-secondary">Online booking options.</p>
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
    <aside className="w-[320px] space-y-0 rounded-lg border border-border bg-white p-4">
      <Collapse title="Client alerts" defaultOpen>
        <span className="text-body-md text-text">Include KM</span>
      </Collapse>

      <Collapse title="Stripe" defaultOpen>
        <p className="text-body-sm text-text-secondary">
          Connect with Stripe and save a credit card for clients and use for future use.
        </p>
      </Collapse>

      <Collapse title="Mailchimp" defaultOpen>
        <div className="space-y-1 text-body-sm">
          <div className="flex items-center gap-1">
            <span className="text-primary">rakesh.splose@gmail.com</span>
            <Badge variant="orange" className="text-caption-sm">ARCHIVED</Badge>
          </div>
        </div>
      </Collapse>

      <Collapse title="QuickBooks">
        <p className="text-body-sm text-text-secondary">No QuickBooks connection.</p>
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
    <div className="w-[600px] space-y-0">
      <Collapse title="General" defaultOpen>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Name</label>
            <input className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" defaultValue="Initial Consultation" />
          </div>
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Item code</label>
            <input className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" defaultValue="93010" />
          </div>
        </div>
      </Collapse>

      <Collapse title="Pricing" defaultOpen>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Price</label>
            <input type="number" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" defaultValue="200" />
          </div>
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Duration (minutes)</label>
            <input className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" defaultValue="60" />
          </div>
        </div>
      </Collapse>

      <Collapse title="Online booking" defaultOpen>
        <div className="flex items-center gap-3 py-1">
          <div className="h-5 w-9 rounded-full bg-primary" />
          <span className="text-body-md text-text">Enable online booking</span>
        </div>
      </Collapse>

      <Collapse title="Online payment">
        <p className="text-body-sm text-text-secondary">Configure online payment requirements for this service.</p>
      </Collapse>

      <Collapse title="Appointment notifications">
        <p className="text-body-sm text-text-secondary">Set up SMS and email notifications for appointments using this service.</p>
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
    <div className="w-[600px] space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/appointment-templates/new</code> — collapse sections
        that wrap notification channels with toggle + message editor inside.
      </p>

      <Collapse title="SMS" defaultOpen>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-9 rounded-full bg-primary" />
            <span className="text-body-md text-text">Enable SMS notification</span>
          </div>
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Message</label>
            <textarea
              className="w-full rounded-lg border border-border px-3 py-2 text-body-md text-text"
              rows={3}
              defaultValue="Hi {client_first_name}, this is a reminder about your appointment on {appointment_date} at {appointment_time}."
            />
            <p className="mt-1 text-caption-md text-text-secondary">
              Variables: {"{client_first_name}"}, {"{appointment_date}"}, {"{appointment_time}"}
            </p>
          </div>
        </div>
      </Collapse>

      <Collapse title="Email" defaultOpen>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-9 rounded-full bg-primary" />
            <span className="text-body-md text-text">Enable email notification</span>
          </div>
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Subject</label>
            <input
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text"
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
    <div className="w-[600px] space-y-6">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/users/[id]</code> — user detail page
        with Profile, Role &amp; Access, and Security sections.
      </p>

      <Collapse title="Profile" defaultOpen>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Name</label>
            <input className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" defaultValue="Sarah Johnson" />
          </div>
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Email</label>
            <input className="w-full rounded-lg border border-border bg-gray-50 px-3 py-2 text-body-md text-text-secondary" defaultValue="sarah@example.com" readOnly />
          </div>
        </div>
      </Collapse>

      <Collapse title="Role & Access" defaultOpen>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Role name</label>
            <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text">
              <option>Practitioner</option>
              <option>Admin</option>
              <option>Receptionist</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Role type</label>
            <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text">
              <option>Clinical</option>
              <option>Administrative</option>
            </select>
          </div>
        </div>
      </Collapse>

      <Collapse title="Security" defaultOpen>
        <div className="space-y-3">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-body-md text-text hover:bg-gray-50">Reset password</button>
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-body-md text-text hover:bg-gray-50">Log out everywhere</button>
          <button className="rounded-lg border border-red-200 bg-white px-4 py-2 text-body-md text-red-600 hover:bg-red-50">Deactivate account</button>
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
    <div className="w-[700px] space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/locations/new</code> — location form
        with General, Address, and Online booking sections.
      </p>

      <Collapse title="General" defaultOpen>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-label-lg text-text-secondary">Name</label>
              <input className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" placeholder="e.g. East Clinics" />
            </div>
            <div>
              <label className="mb-1 block text-label-lg text-text-secondary">ABN</label>
              <input className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-label-lg text-text-secondary">Email</label>
              <input type="email" className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" />
            </div>
            <div>
              <label className="mb-1 block text-label-lg text-text-secondary">Phone</label>
              <input className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" />
            </div>
          </div>
        </div>
      </Collapse>

      <Collapse title="Address" defaultOpen>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Address</label>
            <input className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-label-lg text-text-secondary">Suburb</label>
              <input className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" />
            </div>
            <div>
              <label className="mb-1 block text-label-lg text-text-secondary">State</label>
              <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text">
                <option>NSW</option>
                <option>VIC</option>
                <option>QLD</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-label-lg text-text-secondary">Post code</label>
              <input className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text" />
            </div>
          </div>
        </div>
      </Collapse>

      <Collapse title="Online booking">
        <div className="flex items-center gap-3 py-1">
          <div className="h-5 w-9 rounded-full bg-gray-300" />
          <span className="text-body-md text-text">Enable online booking for this location</span>
        </div>
      </Collapse>
    </div>
  ),
};
