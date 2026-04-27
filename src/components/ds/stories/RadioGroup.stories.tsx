"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import RadioGroup from "../RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  tags: ["extended"],
  parameters: {
    appPages: [
      {
        label: "Settings: Online bookings (booking option selection)",
        vercel: "https://splose-current.vercel.app/settings/online-bookings/cmngtw7n9005eycwg4e67506h",
        production: "https://acme.splose.com/settings/online-bookings/1",
      },
      {
        label: "Settings: Edit service (radio options)",
        vercel: "https://splose-current.vercel.app/settings/services/edit/cmngtwrue007kycwg65dgipx3",
        production: "https://acme.splose.com/settings/services/edit/1",
      },
      {
        label: "Calendar (recurring appointment apply/delete radios)",
        vercel: "https://splose-current.vercel.app/calendar",
        production: "https://acme.splose.com/calendar/week/25/3/2026",
      },
    ],
    referenceUrl: "https://ant.design/components/radio",
  },
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
    <div style={{ maxWidth: 448, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>calendar</code> edit modal — when
        editing a recurring appointment, choose which occurrences to update.
      </p>
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)', marginBottom: 16 }}>Edit Appointment</h3>

        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' }}>Service</label>
            <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#f9fafb', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
              Initial Consultation — 60 min
            </div>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' }}>Date</label>
            <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#f9fafb', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
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

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button style={{ borderRadius: 4, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
            Cancel
          </button>
          <button style={{ borderRadius: 4, paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: '#fff', backgroundColor: 'var(--color-primary)' }}>
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
    <div style={{ maxWidth: 448, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>calendar</code> — delete confirmation
        for a recurring appointment, choosing scope of deletion.
      </p>
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,.05)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)', marginBottom: 8 }}>Delete Appointment</h3>
        <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
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

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button style={{ borderRadius: 4, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>
            Cancel
          </button>
          <button style={{ borderRadius: 4, backgroundColor: '#dc2626', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: '#fff' }}>
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
    <div style={{ maxWidth: 512, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings/forms/[id]</code> — boolean
        fields in clinical forms rendered as Yes/No radio groups.
      </p>
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text)' }}>Client Intake Form</h3>

        <RadioGroup
          name="consent"
          label="Do you consent to treatment? *"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          value={consent}
          onChange={setConsent}
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
        />

        {medication === "yes" && (
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginBottom: 4, display: 'block' }}>Please list your medications</label>
            <textarea
              style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}
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
    <div style={{ maxWidth: 448, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
        From <code style={{ fontSize: 11 }}>settings</code> — appointment
        communication preference selection.
      </p>
      <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
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

        <div style={{ marginTop: 16, borderRadius: 4, border: '1px solid var(--color-border)', backgroundColor: '#f9fafb', padding: 12 }}>
          <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
            Selected: <strong style={{ color: 'var(--color-text)' }}>{preference === "sms-email" ? "SMS & Email" : preference === "sms" ? "SMS only" : preference === "email" ? "Email only" : "None"}</strong>
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
