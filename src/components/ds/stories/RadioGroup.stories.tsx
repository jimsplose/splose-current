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

/* ------------------------------------------------------------------ */
/*  CalendarDeleteRecurring                                            */
/*  Pattern: RadioGroup in a confirmation dialog for deleting a        */
/*  recurring appointment — choose which occurrences to remove         */
/*  Source: /calendar/CalendarView.tsx (delete flow)                    */
/* ------------------------------------------------------------------ */

function CalendarDeleteRecurringRecipe() {
  const [deleteScope, setDeleteScope] = useState("this");

  return (
    <div className="max-w-md space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">calendar</code> — delete confirmation
        for a recurring appointment, choosing scope of deletion.
      </p>
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-heading-md text-text">Delete Appointment</h3>
        <p className="mb-4 text-body-md text-text-secondary">
          This is a recurring appointment. Which occurrences would you like to delete?
        </p>

        <RadioGroup
          name="deleteScope"
          options={[
            { value: "this", label: "This occurrence only" },
            { value: "following", label: "This and all following occurrences" },
            { value: "all", label: "All occurrences" },
          ]}
          value={deleteScope}
          onChange={setDeleteScope}
        />

        <div className="mt-6 flex justify-end gap-2">
          <button className="rounded border border-border bg-white px-4 py-2 text-body-md text-text hover:bg-gray-50">
            Cancel
          </button>
          <button className="rounded bg-red-600 px-4 py-2 text-body-md text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export const CalendarDeleteRecurring: Story = {
  name: "Recipe: Calendar Delete Recurring",
  render: () => <CalendarDeleteRecurringRecipe />,
};

/* ------------------------------------------------------------------ */
/*  FormBooleanField                                                   */
/*  Pattern: RadioGroup used as a Yes/No boolean field inside a form   */
/*  — common in clinical forms and intake questionnaires               */
/*  Source: /settings/forms/[id]/page.tsx (boolean form fields)        */
/* ------------------------------------------------------------------ */

function FormBooleanFieldRecipe() {
  const [consent, setConsent] = useState("");
  const [medication, setMedication] = useState("");

  return (
    <div className="max-w-lg space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings/forms/[id]</code> — boolean
        fields in clinical forms rendered as Yes/No radio groups.
      </p>
      <div className="rounded-lg border border-border bg-white p-6 space-y-6">
        <h3 className="text-heading-md text-text">Client Intake Form</h3>

        <RadioGroup
          name="consent"
          label="Do you consent to treatment? *"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          value={consent}
          onChange={setConsent}
          className="[&>div]:flex [&>div]:gap-4 [&>div]:space-y-0"
        />

        <RadioGroup
          name="medication"
          label="Are you currently taking any medication?"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          value={medication}
          onChange={setMedication}
          className="[&>div]:flex [&>div]:gap-4 [&>div]:space-y-0"
        />

        {medication === "yes" && (
          <div>
            <label className="mb-1 block text-label-lg text-text-secondary">Please list your medications</label>
            <textarea
              className="w-full rounded-lg border border-border px-3 py-2 text-body-md text-text"
              rows={3}
              placeholder="Enter medication details..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

export const FormBooleanField: Story = {
  name: "Recipe: Form Boolean Field",
  render: () => <FormBooleanFieldRecipe />,
};

/* ------------------------------------------------------------------ */
/*  NotificationPreference                                             */
/*  Pattern: RadioGroup for selecting notification delivery method      */
/*  — used in settings and appointment template configuration          */
/*  Source: /settings/page.tsx (communication preferences)             */
/* ------------------------------------------------------------------ */

function NotificationPreferenceRecipe() {
  const [preference, setPreference] = useState("sms-email");

  return (
    <div className="max-w-md space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">settings</code> — appointment
        communication preference selection.
      </p>
      <div className="rounded-lg border border-border bg-white p-6">
        <RadioGroup
          name="commPref"
          label="Default appointment communication preferences *"
          options={[
            { value: "sms-email", label: "SMS & Email" },
            { value: "sms", label: "SMS only" },
            { value: "email", label: "Email only" },
            { value: "none", label: "None" },
          ]}
          value={preference}
          onChange={setPreference}
        />

        <div className="mt-4 rounded border border-border bg-gray-50 p-3">
          <p className="text-body-sm text-text-secondary">
            Selected: <strong className="text-text">{preference === "sms-email" ? "SMS & Email" : preference === "sms" ? "SMS only" : preference === "email" ? "Email only" : "None"}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export const NotificationPreference: Story = {
  name: "Recipe: Notification Preference",
  render: () => <NotificationPreferenceRecipe />,
};
