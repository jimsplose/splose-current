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
