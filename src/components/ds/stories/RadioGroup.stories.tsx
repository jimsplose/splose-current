"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import RadioGroup from "../RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  argTypes: {
    name: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

/* ── Playground ─────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    name: "demo",
    label: "Choose an option",
    options: [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B" },
      { value: "c", label: "Option C" },
    ],
    value: "a",
  },
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

export const Default: Story = {
  args: {
    name: "frequency",
    label: "Reminder frequency",
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
    ],
  },
};

export const WithValue: Story = {
  args: {
    name: "status",
    label: "Appointment status",
    options: [
      { value: "confirmed", label: "Confirmed" },
      { value: "pending", label: "Pending" },
      { value: "cancelled", label: "Cancelled" },
    ],
    value: "confirmed",
  },
};

export const Horizontal: Story = {
  args: {
    name: "view",
    label: "Calendar view",
    options: [
      { value: "day", label: "Day" },
      { value: "week", label: "Week" },
      { value: "month", label: "Month" },
    ],
    value: "week",
    className: "[&>div]:flex [&>div]:gap-4 [&>div]:space-y-0",
  },
};

/* ── Recipes ────────────────────────────────────────────────────────────── */

function CalendarApplyChangesRecipe() {
  const [applyTo, setApplyTo] = useState("this");

  return (
    <div className="max-w-md space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">calendar</code> edit modal — when
        editing a recurring appointment, choose which occurrences to update.
      </p>
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-heading-md text-text">Edit Appointment</h3>

        <div className="mb-4 space-y-3">
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Service</label>
            <div className="rounded-lg border border-border bg-gray-50 px-3 py-2 text-body-md text-text">
              Initial Consultation — 60 min
            </div>
          </div>
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Date</label>
            <div className="rounded-lg border border-border bg-gray-50 px-3 py-2 text-body-md text-text">
              Monday, 24 Mar 2026
            </div>
          </div>
        </div>

        <RadioGroup
          name="applyTo"
          label="Apply to:"
          options={[
            { value: "this", label: "This occurrence" },
            { value: "following", label: "This and all following occurrences" },
            { value: "all", label: "All occurrences" },
          ]}
          value={applyTo}
          onChange={setApplyTo}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded border border-border bg-white px-4 py-2 text-body-md text-text hover:bg-gray-50">
            Cancel
          </button>
          <button className="rounded bg-primary px-4 py-2 text-body-md text-white hover:bg-primary/90">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export const CalendarApplyChanges: Story = {
  name: "Recipe: Calendar Apply Changes",
  render: () => <CalendarApplyChangesRecipe />,
};
