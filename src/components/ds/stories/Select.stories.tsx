"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Select from "../Select";

const meta: Meta<typeof Select> = {
  title: "Overlays/Select",
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
    <div className="max-w-sm space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">payments/new</code> — searchable client
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
    <div className="max-w-4xl space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">payments/new</code> — Select in a
        grid row alongside regular form inputs.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Client / From *"
          options={clientOptions}
          value={client}
          onChange={setClient}
          placeholder="Select client"
          searchable
        />
        <div>
          <label className="mb-1 block text-label-lg text-text-secondary">Payment date *</label>
          <input
            type="text"
            defaultValue="24/03/2026"
            className="flex h-10 w-full rounded-lg border border-border bg-white px-3 text-body-md text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-label-lg text-text-secondary">Payment method *</label>
          <select className="flex h-10 w-full rounded-lg border border-border bg-white px-3 text-body-md text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
            <option>Select method</option>
            <option>Cash</option>
            <option>Card</option>
            <option>EFTPOS</option>
            <option>Bank Transfer</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-label-lg text-text-secondary">Amount *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-text-secondary">$</span>
            <input
              type="number"
              placeholder="0.00"
              className="flex h-10 w-full rounded-lg border border-border bg-white pl-7 pr-3 text-body-md text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
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
    <div className="max-w-xs space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">calendar</code> — practitioner
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
        <div className="flex items-center gap-2 rounded-lg border border-border p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-label-md text-primary">
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
    <div className="max-w-sm space-y-4">
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
