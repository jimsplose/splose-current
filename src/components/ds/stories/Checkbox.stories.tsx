"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Checkbox from "../Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["extended"],
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  parameters: {
    appPages: [
      { label: "Waitlist — New", vercel: "https://splose-current.vercel.app/waitlist/new", localhost: "http://localhost:3000/waitlist/new", production: "https://acme.splose.com/waitlist/new" },
      { label: "Login", vercel: "https://splose-current.vercel.app/login", localhost: "http://localhost:3000/login", production: "https://acme.splose.com/login" },
      { label: "Settings — SMS settings", vercel: "https://splose-current.vercel.app/settings/sms-settings", localhost: "http://localhost:3000/settings/sms-settings", production: "https://acme.splose.com/settings/sms-settings" },
      { label: "Products", vercel: "https://splose-current.vercel.app/products", localhost: "http://localhost:3000/products", production: "https://acme.splose.com/products" },
    ],
    referenceUrl: "https://ant.design/components/checkbox",
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
    <div style={{ maxWidth: 384, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>login</code> — Remember me checkbox
        alongside forgot password link.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Checkbox
          label="Remember me"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <a href="#" style={{ fontSize: 12, color: 'var(--color-primary)' }}>
          Forgot password?
        </a>
      </div>
    </div>
  );
}

function ApplyToAllRecipe() {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ maxWidth: 448, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings (details)</code> — Apply to
        all clients checkbox below a contact preference selector.
      </p>
      <div>
        <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
          Default contact preference
        </label>
        <select style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
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
    <div style={{ maxWidth: 448, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings/data-export</code> — Include
        archived checkbox in the data export form.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16 }}>
        <div style={{ width: 192 }}>
          <label style={{ marginBottom: 4, display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Export</label>
          <select style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
            <option>Appointments</option>
            <option>Clients</option>
            <option>Contacts</option>
            <option>Invoices</option>
            <option>Payments</option>
            <option>Waitlist</option>
          </select>
        </div>
        <button style={{ borderRadius: 4, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, color: '#fff', fontSize: 14, lineHeight: 1.57 }}>
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
