"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import AsyncSelect from "../AsyncSelect";

const meta: Meta<typeof AsyncSelect> = {
  title: "Forms/AsyncSelect",
  component: AsyncSelect,
  argTypes: {
    url: { control: "text" },
    value: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    className: { control: "text" },
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
    <div className="max-w-sm">
      <AsyncSelect
        url="https://jsonplaceholder.typicode.com/users"
        mapOption={mapUser}
        value={value}
        onChange={setValue}
        label="User"
        placeholder="Select a user..."
      />
      {value && (
        <p className="mt-2 text-body-sm text-text-secondary">Selected ID: {value}</p>
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
    <div className="max-w-sm">
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
    <div className="max-w-sm space-y-2">
      <p className="text-body-sm text-text-secondary">
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
    <div className="max-w-sm space-y-4">
      <p className="text-body-sm text-text-secondary">
        Demonstrates an async client selector that fetches options from an
        API. In production this would hit{" "}
        <code className="text-xs">/api/clients</code>.
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
        <p className="text-body-md text-text">
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
    <div className="max-w-md space-y-4">
      <h3 className="text-heading-md text-text">Assign practitioner</h3>
      <p className="text-body-sm text-text-secondary">
        Fetches the practitioner list from an API. In production this would hit{" "}
        <code className="text-xs">/api/practitioners</code>.
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
        <p className="text-body-md text-text">
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
    <div className="max-w-lg space-y-4 rounded-lg border border-border bg-white p-6">
      <h3 className="text-heading-md text-text">New payment</h3>
      <AsyncSelect
        url="https://jsonplaceholder.typicode.com/users"
        mapOption={mapClient}
        value={client}
        onChange={setClient}
        label="Client *"
        placeholder="Select client..."
      />
      {client && (
        <div className="space-y-2">
          <p className="text-label-lg text-text">Outstanding invoices</p>
          {mockInvoices.map((inv) => (
            <div key={inv.number} className="flex items-center justify-between rounded border border-border px-3 py-2">
              <span className="text-body-md text-primary">{inv.number}</span>
              <span className="text-body-md text-text">{inv.due}</span>
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
    <div className="max-w-lg space-y-4 rounded-lg border border-border bg-white p-6">
      <h3 className="text-heading-md text-text">New appointment</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-label-lg text-text">Date</label>
          <div className="rounded-lg border border-border bg-gray-50 px-3 py-2 text-body-md text-text">{date}</div>
        </div>
        <div>
          <label className="mb-1 block text-label-lg text-text">Time</label>
          <div className="rounded-lg border border-border bg-gray-50 px-3 py-2 text-body-md text-text">{time}</div>
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
