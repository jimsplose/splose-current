"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Select from "../Select";

const meta: Meta<typeof Select> = {
  title: "Forms/Select",
  component: Select,
  argTypes: {
    value: { control: "text" },
    placeholder: { control: "text" },
    searchable: { control: "boolean" },
    label: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

/* ── Playground ─────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    options: [
      { label: "Sarah Johnson", value: "1" },
      { label: "Mark Chen", value: "2" },
      { label: "Alice Brown", value: "3" },
      { label: "Bob Wilson", value: "4" },
      { label: "Carol Davis", value: "5" },
    ],
    value: "",
    placeholder: "Select...",
    searchable: false,
    label: "Client",
  },
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

export const Default: Story = {
  args: {
    options: [
      { label: "Sarah Johnson", value: "1" },
      { label: "Mark Chen", value: "2" },
      { label: "Alice Brown", value: "3" },
    ],
    value: "",
    placeholder: "Select client...",
  },
};

export const WithSearch: Story = {
  args: {
    searchable: true,
    label: "Client",
    options: [
      { label: "Sarah Johnson", value: "1" },
      { label: "Mark Chen", value: "2" },
      { label: "Alice Brown", value: "3" },
      { label: "Bob Wilson", value: "4" },
      { label: "Carol Davis", value: "5" },
      { label: "Daniel Lee", value: "6" },
      { label: "Emily Zhang", value: "7" },
    ],
    value: "",
    placeholder: "Search clients...",
  },
};

export const WithPlaceholder: Story = {
  args: {
    options: [
      { label: "Dr. Smith", value: "1" },
      { label: "Dr. Jones", value: "2" },
      { label: "Dr. Patel", value: "3" },
    ],
    value: "",
    placeholder: "Choose a practitioner...",
    label: "Practitioner",
  },
};

/* ── Recipes ────────────────────────────────────────────────────────────── */

function ClientSelectRecipe() {
  const [client, setClient] = useState("");

  const clientOptions = [
    "Skyler Peterson",
    "elsa frozen",
    "A Jr",
    "rakesh soni",
    "A test",
    "Alex Anders",
    "Sarah Johnson",
    "Michael Chen",
  ].map((c) => ({ label: c, value: c }));

  return (
    <div style={{ maxWidth: 384, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="text-body-sm text-text-secondary">
        From <code style={{ fontSize: 11 }}>payments/new</code> — searchable client
        dropdown with real client names.
      </p>
      <Select
        label="Client"
        options={clientOptions}
        value={client}
        onChange={setClient}
        searchable
        placeholder="Search clients..."
      />
      {client && (
        <p className="text-body-md text-text">
          Selected: <strong>{client}</strong>
        </p>
      )}
    </div>
  );
}

export const ClientSelect: Story = {
  name: "Recipe: Client Select (payments/new)",
  render: () => <ClientSelectRecipe />,
};

/* ------------------------------------------------------------------ */
/*  PaymentFormRow                                                     */
/*  Pattern: Select used alongside FormInput fields in a grid layout   */
/*  for the payment creation form                                      */
/*  Source: /payments/new/page.tsx                                      */
/* ------------------------------------------------------------------ */

function PaymentFormRowRecipe() {
  const [client, setClient] = useState("");

  const clientOptions = [
    "Skyler Peterson",
    "elsa frozen",
    "rakesh soni",
    "Sarah Johnson",
    "Michael Chen",
  ].map((c) => ({ label: c, value: c }));

  return (
    <div style={{ maxWidth: 896, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="text-body-sm text-text-secondary">
        From <code style={{ fontSize: 11 }}>payments/new</code> — Select in a
        grid row alongside regular form inputs.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 16 }}>
        <Select
          label="Client / From *"
          options={clientOptions}
          value={client}
          onChange={setClient}
          placeholder="Select client"
          searchable
        />
        <div>
          <label className="text-label-lg text-text-secondary" style={{ marginBottom: 4, display: 'block' }}>Payment date *</label>
          <input
            type="text"
            defaultValue="24/03/2026"
            className="border-border text-body-md text-text" style={{ display: 'flex', height: 40, width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, outline: 'none' }}
          />
        </div>
        <div>
          <label className="text-label-lg text-text-secondary" style={{ marginBottom: 4, display: 'block' }}>Payment method *</label>
          <select className="border-border text-body-md text-text" style={{ display: 'flex', height: 40, width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, outline: 'none' }}>
            <option>Select method</option>
            <option>Cash</option>
            <option>Card</option>
            <option>EFTPOS</option>
            <option>Bank Transfer</option>
          </select>
        </div>
        <div>
          <label className="text-label-lg text-text-secondary" style={{ marginBottom: 4, display: 'block' }}>Amount *</label>
          <div style={{ position: 'relative' }}>
            <span className="text-text-secondary" style={{top: '50%', position: 'absolute', left: 12, zIndex: 10, transform: 'translateY(-50%)', fontSize: 12 }}>$</span>
            <input
              type="number"
              placeholder="0.00"
              className="border-border text-body-md text-text" style={{ display: 'flex', height: 40, width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 28, paddingRight: 12, outline: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const PaymentFormRow: Story = {
  name: "Recipe: Payment Form Row",
  render: () => <PaymentFormRowRecipe />,
};

/* ------------------------------------------------------------------ */
/*  PractitionerSelect                                                 */
/*  Pattern: Non-searchable Select for choosing a practitioner with    */
/*  a small options list                                               */
/*  Source: common pattern across calendar and appointment forms        */
/* ------------------------------------------------------------------ */

function PractitionerSelectRecipe() {
  const [practitioner, setPractitioner] = useState("");

  const practitionerOptions = [
    { label: "Sarah Johnson", value: "sarah" },
    { label: "Mark Chen", value: "mark" },
    { label: "Alice Brown", value: "alice" },
  ];

  return (
    <div style={{ maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="text-body-sm text-text-secondary">
        From <code style={{ fontSize: 11 }}>calendar</code> — practitioner
        selection with a short list, no search needed.
      </p>
      <Select
        label="Practitioner *"
        options={practitionerOptions}
        value={practitioner}
        onChange={setPractitioner}
        placeholder="Choose a practitioner..."
      />
      {practitioner && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8, border: '1px solid var(--color-border)', padding: 12 }}>
          <div className="bg-primary/20 text-label-md text-primary" style={{ display: 'flex', height: 32, width: 32, alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
            {practitionerOptions.find((p) => p.value === practitioner)?.label.charAt(0)}
          </div>
          <span className="text-body-md text-text">
            {practitionerOptions.find((p) => p.value === practitioner)?.label}
          </span>
        </div>
      )}
    </div>
  );
}

export const PractitionerSelect: Story = {
  name: "Recipe: Practitioner Select",
  render: () => <PractitionerSelectRecipe />,
};

/* ------------------------------------------------------------------ */
/*  LongListSearchable                                                 */
/*  Pattern: Searchable Select with a long options list that needs     */
/*  filtering — common for client/service selection                    */
/*  Source: general pattern across payments, calendar, client forms     */
/* ------------------------------------------------------------------ */

function LongListSearchableRecipe() {
  const [service, setService] = useState("");

  const serviceOptions = [
    "Initial Consultation",
    "Follow-up Appointment",
    "Occupational Therapy",
    "Speech Therapy",
    "Physiotherapy Assessment",
    "Psychology Session",
    "Group Therapy",
    "NDIS Plan Review",
    "Telehealth Consultation",
    "Home Visit",
    "School Visit",
    "Report Writing",
    "Supervision",
    "Case Conference",
  ].map((s) => ({ label: s, value: s }));

  return (
    <div style={{ maxWidth: 384, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="text-body-sm text-text-secondary">
        Searchable select for a long list of services — common pattern
        when there are many options to filter through.
      </p>
      <Select
        label="Service *"
        options={serviceOptions}
        value={service}
        onChange={setService}
        searchable
        placeholder="Search services..."
      />
    </div>
  );
}

export const LongListSearchable: Story = {
  name: "Recipe: Long List Searchable",
  render: () => <LongListSearchableRecipe />,
};
