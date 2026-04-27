import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import List from "../List";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof List> = {
  title: "Data Display/List",
  component: List,
  tags: ["extended"],
  argTypes: {
    labelWidth: {
      control: "text",
      description: "Tailwind width class for the label column (default: w-28)",
    },
  },
  parameters: {
    layout: "centered",
    splose: {
      status: "beta",
      summary:
        "Label/value attribute list rendering <dl>/<dt>/<dd>. Hints, editable rows, divider, tight, semantic-opt-out.",
      whatToUseInstead:
        "Inline <div> label/value rows on patient, contact, and invoice detail blocks.",
      referenceLibrary: "first-party",
      plan: "docs/ds-plans/ListEnhancement.md",
      source: "src/components/ds/List.tsx",
    },
    appPages: [
      {
        label: "Client detail",
        vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h",
        production: "https://acme.splose.com/patients/446604/details",
      },
      {
        label: "Note detail",
        vercel: "https://splose-current.vercel.app/notes/1",
        production: "https://acme.splose.com/notes/1/view",
      },
      {
        label: "Waitlist",
        vercel: "https://splose-current.vercel.app/waitlist",
        production: "https://acme.splose.com/waitlist",
      },
      {
        label: "Contact detail",
        vercel: "https://splose-current.vercel.app/contacts/1",
        production: "https://acme.splose.com/contacts/1",
      },
    ],
    referenceUrl: "https://ant.design/components/list",
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
        value: <span style={{ color: 'var(--color-primary)' }}>sarah@example.com</span>,
      },
      {
        label: "Phone numbers:",
        value: <span style={{ color: 'var(--color-primary)' }}>0412 345 678</span>,
      },
      { label: "Preference:", value: "SMS & Email" },
    ],
  },
};

export const StackedLayout: Story = {
  name: "Stacked Layout (definitions)",
  args: {
    layout: "stacked",
    items: [
      {
        label: "Available hours",
        value: "The total number of hours a practitioner has marked as available in their schedule during the selected date range, excluding blocked time and leave.",
      },
      {
        label: "Booked hours",
        value: "The total number of hours occupied by confirmed client appointments during the selected date range.",
      },
      {
        label: "Utilisation %",
        value: "The percentage of available hours that were booked with client appointments. Calculated as (Booked hours / Available hours) × 100.",
      },
    ],
  },
  parameters: { layout: "padded" },
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
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>General details</h2>
        <List
          items={[
            { label: "Date of birth:", value: "10 Jun 2001 (24)" },
            { label: "Sex:", value: "Not specified" },
          ]}
        />
      </section>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>Client contact details</h2>
        <List
          items={[
            {
              label: "Email:",
              value: <span style={{ color: 'var(--color-primary)' }}>noah.campbell@email.com</span>,
            },
            {
              label: "Phone numbers:",
              value: <span style={{ color: 'var(--color-primary)' }}>0409 999 000</span>,
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
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>Medicare details</h2>
        <List
          items={[
            { label: "Card number:", value: "2123 45670 1" },
          ]}
        />
      </section>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>NDIS details</h2>
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
      <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>
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
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>Custom fields</h2>
        <List
          items={[
            { label: "Date since surgery:", value: "25/09/2025" },
            { label: "Note:", value: "Note short text check" },
          ]}
        />
      </section>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>Invoicing</h2>
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
        <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.3, color: 'var(--color-text)' }}>Details</h1>
        <button style={{ borderRadius: 4, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
          Edit
        </button>
      </div>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>General details</h2>
        <List
          items={[
            { label: "Date of birth:", value: "10 Jun 2001 (24 years old)" },
            { label: "Sex:", value: "Not specified" },
          ]}
        />
      </section>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>Client contact details</h2>
        <List
          items={[
            { label: "Email:", value: <span style={{ color: 'var(--color-primary)' }}>noah.campbell@email.com</span> },
            { label: "Phone numbers:", value: <span style={{ color: 'var(--color-primary)' }}>0409 999 000</span> },
            { label: "Preference:", value: "None" },
            { label: "Address:", value: "123 Main St, Adelaide SA 5000" },
            { label: "Timezone:", value: "GMT+10:30 - Australia/Adelaide" },
          ]}
        />
      </section>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>Medicare details</h2>
        <List items={[{ label: "Card number:", value: "2123 45670 1" }]} />
      </section>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--color-text)', marginBottom: 16 }}>Custom fields</h2>
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

/* ================================================================== */
/*  Enhancement stories (ListEnhancement plan — divider, tight, hints,  */
/*  editable, semantic="div", patient/invoice/contact recipes)         */
/* ================================================================== */

export const WithDivider: Story = {
  name: "Feature: With Divider",
  args: {
    divider: true,
    items: [
      { label: "Mobile", value: "0412 345 678" },
      { label: "Email", value: "harry@example.com" },
      { label: "Address", value: "12 Park St, Melbourne VIC 3000" },
    ],
  },
  parameters: { layout: "padded" },
};

export const Tight: Story = {
  name: "Feature: Tight",
  args: {
    tight: true,
    divider: true,
    items: [
      { label: "DOB", value: "14/05/1988" },
      { label: "Gender", value: "Male" },
      { label: "Medicare", value: "1234 56789 0" },
      { label: "NDIS", value: "432100000" },
    ],
  },
  parameters: { layout: "padded" },
};

export const WithHints: Story = {
  name: "Feature: With Hints",
  args: {
    items: [
      {
        label: "Gap fee",
        hint: "Amount the patient pays out-of-pocket after Medicare rebate.",
        value: "$35.00",
      },
      {
        label: "HICAPS",
        hint: "Health Industry Claims and Payments Service.",
        value: "Enabled",
      },
    ],
  },
  parameters: { layout: "padded" },
};

export const Editable: Story = {
  name: "Feature: Editable",
  render: () => {
    const Inner = () => {
      const [log, setLog] = useState<string>("—");
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <List
            divider
            items={[
              { label: "Name", value: "Harry Nguyen", editable: true, onEdit: () => setLog("Name edit clicked") },
              { label: "Email", value: "harry@example.com", editable: true, onEdit: () => setLog("Email edit clicked") },
              { label: "Phone", value: "0412 345 678" },
            ]}
          />
          <div style={{ fontSize: 12, color: "#6E6E64" }}>Last action: {log}</div>
        </div>
      );
    };
    return <Inner />;
  },
  parameters: { layout: "padded" },
};

export const DivSemantic: Story = {
  name: "Feature: div semantic (opt-out)",
  args: {
    semantic: "div",
    items: [
      { label: "Revenue", value: "$12,430" },
      { label: "Invoices paid", value: "84" },
      { label: "No-shows", value: "3%" },
    ],
  },
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  Recipe: PatientContactBlock                                        */
/*  Source: acme.splose.com/patients/446604/details                    */
/* ------------------------------------------------------------------ */
export const PatientContactBlock: Story = {
  name: "Recipe: Patient Contact Block",
  render: () => (
    <div style={{ padding: 16, maxWidth: 420, background: "#fff", border: "1px solid #e5e5e5", borderRadius: 8 }}>
      <h3 style={{ fontSize: 13, color: "#6E6E64", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.3 }}>
        Contact
      </h3>
      <List
        divider
        tight
        labelWidth={104}
        items={[
          { label: "Mobile", value: "0412 345 678", editable: true, onEdit: () => {} },
          { label: "Email", value: "harry.n@example.com", editable: true, onEdit: () => {} },
          { label: "Address", value: "12 Park St, Melbourne VIC 3000", editable: true, onEdit: () => {} },
          { label: "Referred by", value: "Dr Sarah Kim", hint: "Treating physician who referred this patient." },
        ]}
      />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  Recipe: InvoiceHeaderStacked                                       */
/*  Source: acme.splose.com/invoices/14130707/view                     */
/* ------------------------------------------------------------------ */
export const InvoiceHeaderStacked: Story = {
  name: "Recipe: Invoice Header (stacked)",
  render: () => (
    <div style={{ padding: 16, maxWidth: 360, background: "#fff", border: "1px solid #e5e5e5", borderRadius: 8 }}>
      <List
        layout="stacked"
        items={[
          { label: "Issued to", value: "Harry Nguyen" },
          { label: "Invoice #", value: "INV-14130707" },
          { label: "Date", value: "22/04/2026" },
          { label: "Due", value: "06/05/2026" },
        ]}
      />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  Recipe: ContactBillingBlock                                        */
/*  Source: acme.splose.com/contacts/416008/details                    */
/* ------------------------------------------------------------------ */
export const ContactBillingBlock: Story = {
  name: "Recipe: Contact Billing Block",
  render: () => (
    <div style={{ padding: 16, maxWidth: 420, background: "#fff", border: "1px solid #e5e5e5", borderRadius: 8 }}>
      <h3 style={{ fontSize: 13, color: "#6E6E64", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.3 }}>
        Billing
      </h3>
      <List
        divider
        labelWidth={120}
        items={[
          { label: "Payment method", value: "Stripe — Visa •••• 4242" },
          { label: "Billing address", value: "—" },
          { label: "GST", value: "Applied", hint: "10% Australian GST added to invoices." },
          { label: "Tax ID", value: "ABN 12 345 678 901", editable: true, onEdit: () => {} },
        ]}
      />
    </div>
  ),
  parameters: { layout: "padded" },
};
