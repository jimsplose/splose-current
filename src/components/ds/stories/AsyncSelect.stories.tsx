"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import AsyncSelect from "../AsyncSelect";

const meta: Meta<typeof AsyncSelect> = {
  title: "Forms/AsyncSelect",
  component: AsyncSelect,
  tags: ["extended"],
  argTypes: {
    url: { control: "text" },
    value: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    className: { control: "text" },
  },
  parameters: {
    // No call sites in src/app/ yet
    appPages: [],
    referenceUrl: null,
  },
};

export default meta;
type Story = StoryObj<typeof AsyncSelect>;

/* ── Helper: stable mapOption ───────────────────────────────────────────── */

const mapUser = (item: Record<string, unknown>) => ({
  value: String(item.id),
  label: String(item.name),
});

/* ── Playground ─────────────────────────────────────────────────────────── */

function PlaygroundDemo() {
  const [value, setValue] = useState("");

  return (
    <div style={{ maxWidth: 384 }}>
      <AsyncSelect
        url="https://jsonplaceholder.typicode.com/users"
        mapOption={mapUser}
        value={value}
        onChange={setValue}
        label="User"
        placeholder="Select a user..."
      />
      {value && (
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginTop: 8 }}>Selected ID: {value}</p>
      )}
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundDemo />,
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

function DefaultDemo() {
  const [value, setValue] = useState("");

  return (
    <div style={{ maxWidth: 384 }}>
      <AsyncSelect
        url="https://jsonplaceholder.typicode.com/users"
        mapOption={mapUser}
        value={value}
        onChange={setValue}
        label="User"
        placeholder="Select a user..."
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultDemo />,
};

function LoadingDemo() {
  const [value, setValue] = useState("");

  // Use a non-existent endpoint that will take time or fail, showing loading state
  const mapNever = useCallback(
    (item: Record<string, unknown>) => ({
      value: String(item.id),
      label: String(item.name),
    }),
    [],
  );

  return (
    <div style={{ maxWidth: 384, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        Uses a slow endpoint to demonstrate the loading state. The first
        option shows &quot;Loading...&quot; while the fetch is in progress.
      </p>
      <AsyncSelect
        url="https://httpbin.org/delay/10"
        mapOption={mapNever}
        value={value}
        onChange={setValue}
        label="Slow endpoint"
        placeholder="Select..."
      />
    </div>
  );
}

export const Loading: Story = {
  render: () => <LoadingDemo />,
};

/* ── Recipes ────────────────────────────────────────────────────────────── */

function ClientAsyncSelectRecipe() {
  const [value, setValue] = useState("");

  const mapClient = useCallback(
    (item: Record<string, unknown>) => ({
      value: String(item.id),
      label: String(item.name),
    }),
    [],
  );

  return (
    <div style={{ maxWidth: 384, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        Demonstrates an async client selector that fetches options from an
        API. In production this would hit{" "}
        <code style={{ fontSize: 11 }}>/api/clients</code>.
      </p>
      <AsyncSelect
        url="https://jsonplaceholder.typicode.com/users"
        mapOption={mapClient}
        value={value}
        onChange={setValue}
        label="Client"
        placeholder="Select client..."
      />
      {value && (
        <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
          Selected client ID: <strong>{value}</strong>
        </p>
      )}
    </div>
  );
}

export const ClientAsyncSelect: Story = {
  name: "Recipe: Client Async Select",
  render: () => <ClientAsyncSelectRecipe />,
};

/* ------------------------------------------------------------------ */
/*  PractitionerSelector                                               */
/*  Pattern: Async practitioner dropdown on forms where practitioner    */
/*  assignment is needed. Shows label + placeholder styling.            */
/*  Source: /payments/new — Select component used for practitioner,     */
/*  adapted here as AsyncSelect fetching from an API                   */
/* ------------------------------------------------------------------ */

function PractitionerSelectorRecipe() {
  const [value, setValue] = useState("");

  const mapPractitioner = useCallback(
    (item: Record<string, unknown>) => ({
      value: String(item.id),
      label: String(item.name),
    }),
    [],
  );

  return (
    <div style={{ maxWidth: 448, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)' }}>Assign practitioner</h3>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        Fetches the practitioner list from an API. In production this would hit{" "}
        <code style={{ fontSize: 11 }}>/api/practitioners</code>.
      </p>
      <AsyncSelect
        url="https://jsonplaceholder.typicode.com/users"
        mapOption={mapPractitioner}
        value={value}
        onChange={setValue}
        label="Practitioner *"
        placeholder="Select practitioner..."
      />
      {value && (
        <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
          Assigned to practitioner ID: <strong>{value}</strong>
        </p>
      )}
    </div>
  );
}

export const PractitionerSelector: Story = {
  name: "Recipe: Practitioner Selector",
  render: () => <PractitionerSelectorRecipe />,
};

/* ------------------------------------------------------------------ */
/*  PaymentClientSelect                                                */
/*  Pattern: Client selector on the new payment form. The client is    */
/*  selected first, then outstanding invoices are filtered by client.  */
/*  Source: /payments/new — Select component for client picker,        */
/*  adapted here as AsyncSelect                                        */
/* ------------------------------------------------------------------ */

function PaymentClientSelectRecipe() {
  const [client, setClient] = useState("");

  const mapClient = useCallback(
    (item: Record<string, unknown>) => ({
      value: String(item.id),
      label: String(item.name),
    }),
    [],
  );

  const mockInvoices = [
    { number: "TRR-006299", due: "$148.71" },
    { number: "TRR-006295", due: "$110.00" },
    { number: "TRR-006296", due: "$110.00" },
  ];

  return (
    <div style={{ maxWidth: 512, display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)' }}>New payment</h3>
      <AsyncSelect
        url="https://jsonplaceholder.typicode.com/users"
        mapOption={mapClient}
        value={client}
        onChange={setClient}
        label="Client *"
        placeholder="Select client..."
      />
      {client && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Outstanding invoices</p>
          {mockInvoices.map((inv) => (
            <div key={inv.number} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 4, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
              <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-primary)' }}>{inv.number}</span>
              <span style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>{inv.due}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const PaymentClientSelect: Story = {
  name: "Recipe: Payment Client Select",
  render: () => <PaymentClientSelectRecipe />,
};

/* ------------------------------------------------------------------ */
/*  ServiceTypeSelector                                                */
/*  Pattern: Async service type dropdown, used in appointment booking  */
/*  or invoice line item forms. Shows how AsyncSelect fits into a      */
/*  multi-field form layout.                                           */
/*  Source: /calendar appointment forms — service selection pattern     */
/* ------------------------------------------------------------------ */

function ServiceTypeSelectorRecipe() {
  const [service, setService] = useState("");
  const [date] = useState("24 Mar 2026");
  const [time] = useState("10:00 AM");

  const mapService = useCallback(
    (item: Record<string, unknown>) => ({
      value: String(item.id),
      label: String(item.company?.name || item.name),
    }),
    [],
  );

  return (
    <div style={{ maxWidth: 512, display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)' }}>New appointment</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Date</label>
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#f9fafb', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>{date}</div>
        </div>
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4, display: 'block' }}>Time</label>
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', borderColor: 'var(--color-border)', backgroundColor: '#f9fafb', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>{time}</div>
        </div>
      </div>
      <AsyncSelect
        url="https://jsonplaceholder.typicode.com/users"
        mapOption={mapService}
        value={service}
        onChange={setService}
        label="Service type *"
        placeholder="Select service..."
      />
    </div>
  );
}

export const ServiceTypeSelector: Story = {
  name: "Recipe: Service Type Selector",
  render: () => <ServiceTypeSelectorRecipe />,
};
