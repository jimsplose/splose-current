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
