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
    <div style={{ width: 600, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>
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
    <div style={{ width: 500, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>General details</h2>
        <List
          items={[
            { label: "Date of birth:", value: "10 Jun 2001 (24)" },
            { label: "Sex:", value: "Not specified" },
          ]}
        />
      </section>

      <hr className="border-border" />

      <section>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Client contact details</h2>
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

/* ------------------------------------------------------------------ */
/*  MedicareAndNDIS                                                    */
/*  Pattern: Medicare and NDIS detail sections, each showing           */
/*  scheme-specific fields in separate headed sections with dividers   */
/*  Source: src/app/clients/[id]/ClientDetailClient.tsx — Medicare      */
/*  details and NDIS details sections                                  */
/* ------------------------------------------------------------------ */

export const MedicareAndNDIS: Story = {
  name: "Recipe: Medicare & NDIS Details",
  render: () => (
    <div style={{ width: 500, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Medicare details</h2>
        <List
          items={[
            { label: "Card number:", value: "2123 45670 1" },
          ]}
        />
      </section>

      <hr className="border-border" />

      <section>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>NDIS details</h2>
        <List
          items={[
            { label: "NDIS number:", value: "4312789456" },
          ]}
        />
      </section>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  MedicationsAndAllergies                                            */
/*  Pattern: Medications, allergies & intolerances section from the    */
/*  client detail page — three related fields in one List              */
/*  Source: src/app/clients/[id]/ClientDetailClient.tsx — Medications,  */
/*  allergies & intolerances section                                   */
/* ------------------------------------------------------------------ */

export const MedicationsAndAllergies: Story = {
  name: "Recipe: Medications & Allergies",
  render: () => (
    <div style={{ width: 500 }}>
      <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>
        Medications, allergies &amp; intolerances
      </h2>
      <List
        items={[
          { label: "Medications:", value: "None" },
          { label: "Allergies:", value: "None" },
          { label: "Intolerances:", value: "None" },
        ]}
      />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  CustomFieldsAndInvoicing                                           */
/*  Pattern: Custom fields and invoicing preference sections from the  */
/*  client detail page — mixed value types in a compact List           */
/*  Source: src/app/clients/[id]/ClientDetailClient.tsx — Custom        */
/*  fields and Invoicing sections                                      */
/* ------------------------------------------------------------------ */

export const CustomFieldsAndInvoicing: Story = {
  name: "Recipe: Custom Fields & Invoicing",
  render: () => (
    <div style={{ width: 500, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Custom fields</h2>
        <List
          items={[
            { label: "Date since surgery:", value: "25/09/2025" },
            { label: "Note:", value: "Note short text check" },
          ]}
        />
      </section>

      <hr className="border-border" />

      <section>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Invoicing</h2>
        <List
          items={[
            { label: "Invoice reminder preference:", value: "On" },
          ]}
        />
      </section>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  FullClientDetailPage                                               */
/*  Pattern: Complete client detail view showing all List sections      */
/*  stacked with dividers — the full scrollable detail layout          */
/*  Source: src/app/clients/[id]/ClientDetailClient.tsx — full page     */
/* ------------------------------------------------------------------ */

export const FullClientDetailPage: Story = {
  name: "Recipe: Full Client Detail Page",
  render: () => (
    <div style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 32, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="text-display-md text-text">Details</h1>
        <button className="border-border text-body-md text-text-secondary" style={{ borderRadius: 4, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6 }}>
          Edit
        </button>
      </div>

      <section>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>General details</h2>
        <List
          items={[
            { label: "Date of birth:", value: "10 Jun 2001 (24 years old)" },
            { label: "Sex:", value: "Not specified" },
          ]}
        />
      </section>

      <hr className="border-border" />

      <section>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Client contact details</h2>
        <List
          items={[
            { label: "Email:", value: <span className="text-primary">noah.campbell@email.com</span> },
            { label: "Phone numbers:", value: <span className="text-primary">0409 999 000</span> },
            { label: "Preference:", value: "None" },
            { label: "Address:", value: "123 Main St, Adelaide SA 5000" },
            { label: "Timezone:", value: "GMT+10:30 - Australia/Adelaide" },
          ]}
        />
      </section>

      <hr className="border-border" />

      <section>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Medicare details</h2>
        <List items={[{ label: "Card number:", value: "2123 45670 1" }]} />
      </section>

      <hr className="border-border" />

      <section>
        <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Custom fields</h2>
        <List
          items={[
            { label: "Date since surgery:", value: "25/09/2025" },
            { label: "Note:", value: "Note short text check" },
          ]}
        />
      </section>
    </div>
  ),
  parameters: { layout: "padded" },
};
