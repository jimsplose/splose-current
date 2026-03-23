import type { Meta, StoryObj } from "@storybook/react";
import List from "../List";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof List> = {
  title: "Data Display/List",
  component: List,
  argTypes: {
    labelWidth: {
      control: "text",
      description: "Tailwind width class for the label column (default: w-28)",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof List>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    items: [
      { label: "Name", value: "Sarah Johnson" },
      { label: "Email", value: "sarah@example.com" },
      { label: "Phone", value: "0412 345 678" },
      { label: "DOB", value: "15 Mar 1990" },
    ],
    labelWidth: "w-28",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: {
    items: [
      { label: "Name", value: "Sarah Johnson" },
      { label: "Email", value: "sarah@example.com" },
      { label: "Phone", value: "0412 345 678" },
      { label: "DOB", value: "15 Mar 1990" },
    ],
  },
};

export const WithLinks: Story = {
  args: {
    items: [
      {
        label: "Email:",
        value: <span className="text-primary">sarah@example.com</span>,
      },
      {
        label: "Phone numbers:",
        value: <span className="text-primary">0412 345 678</span>,
      },
      { label: "Preference:", value: "SMS & Email" },
    ],
  },
};

export const WideLabel: Story = {
  args: {
    labelWidth: "w-40",
    items: [
      { label: "Medicare number", value: "1234 56789 0" },
      { label: "Reference number", value: "1" },
      { label: "Expiry date", value: "01/2027" },
    ],
  },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  ClientInfoTable                                                    */
/*  Pattern: Client session info at the top of a progress note         */
/*  document. Uses a wider label and a bordered container.             */
/*  Source: /notes/[id] — List inside a bordered card showing          */
/*  Client Name, Date, Time, Organisation, Location, Therapist         */
/* ------------------------------------------------------------------ */

export const ClientInfoTable: Story = {
  name: "Recipe: Client Info Table",
  render: () => (
    <div className="w-[600px] rounded-lg border border-border bg-white px-4 py-2">
      <List
        labelWidth="w-40"
        items={[
          { label: "Client Name", value: "Skyler Peterson" },
          { label: "Date of Session", value: "11 Mar 2026" },
          { label: "Time", value: "10:30 am" },
          { label: "Organisation", value: "Hands Together Therapies" },
          { label: "Location", value: "4 Williamstown Rd" },
          { label: "Therapist", value: "Joseph Go" },
        ]}
      />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ContactDetails                                                     */
/*  Pattern: General details section on the client detail page.        */
/*  Includes linked email/phone values and plain text fields.          */
/*  Source: /clients/[id] — ClientDetailClient.tsx General details      */
/*  and Client contact details sections                                */
/* ------------------------------------------------------------------ */

export const ContactDetails: Story = {
  name: "Recipe: Contact Details",
  render: () => (
    <div className="w-[500px] space-y-6">
      <section>
        <h2 className="mb-4 text-heading-lg text-text">General details</h2>
        <List
          items={[
            { label: "Date of birth:", value: "10 Jun 2001 (24)" },
            { label: "Sex:", value: "Not specified" },
          ]}
        />
      </section>

      <hr className="border-border" />

      <section>
        <h2 className="mb-4 text-heading-lg text-text">Client contact details</h2>
        <List
          items={[
            {
              label: "Email:",
              value: <span className="text-primary">noah.campbell@email.com</span>,
            },
            {
              label: "Phone numbers:",
              value: <span className="text-primary">0409 999 000</span>,
            },
            { label: "Preference:", value: "None" },
            { label: "Address:", value: "123 Main St, Adelaide SA 5000" },
            { label: "Timezone:", value: "GMT+10:30 - Australia/Adelaide" },
          ]}
        />
      </section>
    </div>
  ),
  parameters: { layout: "padded" },
};
