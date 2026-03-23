"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Checkbox from "../Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox",
  component: Checkbox,
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

/* ── Playground ─────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    label: "I agree to the terms and conditions",
    disabled: false,
    defaultChecked: false,
  },
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: "I agree to the terms and conditions" },
};

export const Checked: Story = {
  args: { label: "Email notifications", defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: "Cannot change this", disabled: true, defaultChecked: true },
};

/* ── Recipes ────────────────────────────────────────────────────────────── */

function RememberMeRecipe() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="max-w-sm space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">login</code> — Remember me checkbox
        alongside forgot password link.
      </p>
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <a href="#" className="text-sm text-primary hover:underline">
          Forgot password?
        </a>
      </div>
    </div>
  );
}

function ApplyToAllRecipe() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="max-w-md space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings (details)</code> — Apply to
        all clients checkbox below a contact preference selector.
      </p>
      <div>
        <label className="mb-1 block text-label-lg text-text-secondary">
          Default contact preference
        </label>
        <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text">
          <option>SMS & Email</option>
          <option>SMS only</option>
          <option>Email only</option>
          <option>None</option>
        </select>
      </div>
      <Checkbox
        label="Apply to all existing clients and override the current contact preferences"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </div>
  );
}

function IncludeArchivedRecipe() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="max-w-md space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/data-export</code> — Include
        archived checkbox in the data export form.
      </p>
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-48">
          <label className="mb-1 block text-label-lg text-text-secondary">Export</label>
          <select className="w-full rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text">
            <option>Appointments</option>
            <option>Clients</option>
            <option>Contacts</option>
            <option>Invoices</option>
            <option>Payments</option>
            <option>Waitlist</option>
          </select>
        </div>
        <button className="rounded bg-primary px-3 py-2 text-body-md text-white">
          Export
        </button>
      </div>
      <Checkbox
        label="Include archived"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </div>
  );
}

export const RememberMe: Story = {
  name: "Recipe: Remember Me (login)",
  render: () => <RememberMeRecipe />,
};

export const ApplyToAll: Story = {
  name: "Recipe: Apply to All (settings)",
  render: () => <ApplyToAllRecipe />,
};

export const IncludeArchived: Story = {
  name: "Recipe: Include Archived (data-export)",
  render: () => <IncludeArchivedRecipe />,
};
