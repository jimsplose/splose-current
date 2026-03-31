"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import SettingsListPage from "../SettingsListPage";
import { FormInput, Toggle, OnOffBadge, ColorDot, FormColorPicker, FormSelect } from "@/components/ds";
import { SIMPLE_CRUD, STANDARD_SETTINGS } from "@/lib/dropdown-presets";

const meta: Meta<typeof SettingsListPage> = {
  title: "Patterns/SettingsListPage",
  component: SettingsListPage,
};
export default meta;

/* ── Default: Cancellation Reasons ──────────────────────────────────────── */

interface Reason {
  [key: string]: unknown;
  name: string;
  code: string;
}

function CancellationReasonsDemo() {
  const [items, setItems] = useState<Reason[]>([
    { name: "Condition better", code: "" },
    { name: "Condition worse", code: "TEST" },
    { name: "Sick", code: "500" },
    { name: "No show due to health reason", code: "NSDH" },
  ]);

  return (
    <SettingsListPage<Reason, { name: string; code: string }>
      title="Cancellation reasons"
      items={items}
      columns={[
        { key: "name", label: "Name" },
        { key: "code", label: "Code" },
      ]}
      dropdownItems={SIMPLE_CRUD}
      primaryButtonLabel="+ New reason"
      formDefaults={{ name: "", code: "" }}
      onSave={(values, index) => {
        if (index !== null) {
          setItems((prev) => prev.map((r, i) => (i === index ? { ...values } : r)));
        } else {
          setItems((prev) => [...prev, { ...values }]);
        }
      }}
      modalTitle={(editing) => (editing ? "Edit reason" : "New reason")}
      renderForm={(form, setField) => (
        <>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormInput label="Code" value={form.code} onChange={(e) => setField("code", e.target.value)} placeholder="Optional" />
        </>
      )}
    />
  );
}

export const Default: StoryObj = {
  render: () => <CancellationReasonsDemo />,
};

/* ── Recipe: Communication Types ─────────────────────────────────────── */

interface CommType {
  [key: string]: unknown;
  name: string;
  defaultType: boolean;
}

function CommunicationTypesDemo() {
  const [types, setTypes] = useState<CommType[]>([
    { name: "SMS", defaultType: true },
    { name: "Email", defaultType: true },
    { name: "Phone call", defaultType: false },
    { name: "In-person", defaultType: false },
    { name: "fax", defaultType: false },
    { name: "Admin Notes", defaultType: false },
  ]);

  return (
    <SettingsListPage<CommType, { name: string; defaultType: boolean }>
      title="Communication types"
      items={types}
      columns={[
        { key: "name", label: "Name" },
        {
          key: "defaultType",
          label: "Default type",
          render: (item) => <OnOffBadge value={item.defaultType} onLabel="Yes" offLabel="No" />,
        },
      ]}
      dropdownItems={SIMPLE_CRUD}
      showDropdown={(item) => !item.defaultType}
      primaryButtonLabel="+ Add communication type"
      formDefaults={{ name: "", defaultType: false }}
      onSave={(values, index) => {
        if (index !== null) {
          setTypes((prev) => prev.map((t, i) => (i === index ? { name: values.name, defaultType: values.defaultType } : t)));
        } else {
          setTypes((prev) => [...prev, { name: values.name, defaultType: values.defaultType }]);
        }
      }}
      modalTitle={(editing) => (editing ? "Edit communication type" : "New communication type")}
      renderForm={(form, setField) => (
        <>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <Toggle label="Default type" checked={form.defaultType} onChange={(v) => setField("defaultType", v)} />
        </>
      )}
      style={{ padding: 8 }}
    />
  );
}

export const CommunicationTypes: StoryObj = {
  name: "Recipe: Communication Types",
  render: () => <CommunicationTypesDemo />,
};

/* ── Recipe: Referral Types ──────────────────────────────────────────── */

interface ReferralType {
  [key: string]: unknown;
  name: string;
  defaultType: boolean;
}

function ReferralTypesDemo() {
  const [types, setTypes] = useState<ReferralType[]>([
    { name: "Client", defaultType: true },
    { name: "Contact", defaultType: true },
    { name: "Other", defaultType: true },
    { name: "Facebook", defaultType: false },
    { name: "Google", defaultType: false },
    { name: "Doctor", defaultType: false },
    { name: "GP", defaultType: false },
  ]);

  return (
    <SettingsListPage<ReferralType, { name: string; defaultType: boolean }>
      title="Referral types"
      items={types}
      columns={[
        { key: "name", label: "Name" },
        {
          key: "defaultType",
          label: "Default type",
          render: (item) => <OnOffBadge value={item.defaultType} onLabel="Yes" offLabel="No" />,
        },
      ]}
      dropdownItems={SIMPLE_CRUD}
      showDropdown={(item) => !item.defaultType}
      primaryButtonLabel="+ Add referral type"
      formDefaults={{ name: "", defaultType: false }}
      onSave={(values, index) => {
        if (index !== null) {
          setTypes((prev) => prev.map((t, i) => (i === index ? { name: values.name, defaultType: values.defaultType } : t)));
        } else {
          setTypes((prev) => [...prev, { name: values.name, defaultType: values.defaultType }]);
        }
      }}
      modalTitle={(editing) => (editing ? "Edit referral type" : "New referral type")}
      renderForm={(form, setField) => (
        <>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <Toggle label="Default type" checked={form.defaultType} onChange={(v) => setField("defaultType", v)} />
        </>
      )}
      style={{ padding: 8 }}
    />
  );
}

export const ReferralTypes: StoryObj = {
  name: "Recipe: Referral Types",
  render: () => <ReferralTypesDemo />,
};

/* ── Recipe: Busy Times (manual table — shows SettingsListPage pattern) ── */

interface BusyTime {
  [key: string]: unknown;
  name: string;
  color: string;
  utilisation: string;
  duration: number;
}

function BusyTimesDemo() {
  const [items, setItems] = useState<BusyTime[]>([
    { name: "Leave me alone", color: "#ef4444", utilisation: "Excluded", duration: 15 },
    { name: "OT referral", color: "#f59e0b", utilisation: "Excluded", duration: 30 },
    { name: "Meeting", color: "#1f2937", utilisation: "Excluded", duration: 30 },
    { name: "Lunch", color: "#6366f1", utilisation: "Excluded", duration: 30 },
    { name: "Admin", color: "#a855f7", utilisation: "Included", duration: 30 },
    { name: "CPD", color: "#3b82f6", utilisation: "Excluded", duration: 30 },
    { name: "Travel", color: "#22c55e", utilisation: "Excluded", duration: 30 },
  ]);

  return (
    <SettingsListPage<BusyTime, { name: string; color: string; utilisation: string; duration: string }>
      title="Busy time types"
      description="Use busy time to indicate non-billable events in Practitioner calendars."
      items={items}
      columns={[
        {
          key: "name",
          label: "Name",
          render: (item) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ColorDot color={item.color} />
              {item.name}
            </div>
          ),
        },
        { key: "utilisation", label: "Utilisation" },
        { key: "duration", label: "Duration (mins)" },
      ]}
      dropdownItems={STANDARD_SETTINGS}
      primaryButtonLabel="+ New type"
      formDefaults={{ name: "", color: "#ef4444", utilisation: "Excluded", duration: "30" }}
      onSave={(values, index) => {
        const entry: BusyTime = {
          name: values.name,
          color: values.color,
          utilisation: values.utilisation,
          duration: parseInt(values.duration) || 30,
        };
        if (index !== null) {
          setItems((prev) => prev.map((b, i) => (i === index ? entry : b)));
        } else {
          setItems((prev) => [...prev, entry]);
        }
      }}
      modalTitle={(editing) => (editing ? "Edit busy time" : "New busy time")}
      renderForm={(form, setField) => (
        <>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormColorPicker value={form.color} onChange={(c) => setField("color", c)} />
          <FormSelect
            label="Utilisation"
            value={form.utilisation}
            onChange={(e) => setField("utilisation", e.target.value)}
            options={[
              { value: "Excluded", label: "Excluded" },
              { value: "Included", label: "Included" },
            ]}
          />
          <FormInput
            label="Default duration (mins)"
            type="number"
            value={form.duration}
            onChange={(e) => setField("duration", e.target.value)}
          />
        </>
      )}
    />
  );
}

export const BusyTimes: StoryObj = {
  name: "Recipe: Busy Times",
  render: () => <BusyTimesDemo />,
};

/* ── Recipe: Tags with Toggle Column ──────────────────────────────── */

interface Tag {
  [key: string]: unknown;
  name: string;
  active: boolean;
  category: string;
}

function TagsDemo() {
  const [items, setItems] = useState<Tag[]>([
    { name: "NDIS", active: true, category: "Funding" },
    { name: "Medicare", active: true, category: "Funding" },
    { name: "Private", active: true, category: "Funding" },
    { name: "DVA", active: false, category: "Funding" },
    { name: "Paediatric", active: true, category: "Clinical" },
    { name: "Adult", active: true, category: "Clinical" },
    { name: "Aged Care", active: false, category: "Clinical" },
  ]);

  return (
    <SettingsListPage<Tag, { name: string; active: boolean; category: string }>
      title="Tags"
      description="Manage tags used to categorise clients, appointments and invoices."
      items={items}
      columns={[
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
        {
          key: "active",
          label: "Active",
          render: (item) => (
            <Toggle checked={item.active} onChange={() => {}} />
          ),
        },
      ]}
      dropdownItems={SIMPLE_CRUD}
      primaryButtonLabel="+ New tag"
      hasSearch
      searchPlaceholder="Search tags..."
      searchFilter={(item, q) => item.name.toLowerCase().includes(q.toLowerCase())}
      formDefaults={{ name: "", active: true, category: "Funding" }}
      onSave={(values, index) => {
        if (index !== null) {
          setItems((prev) => prev.map((t, i) => (i === index ? { ...values } : t)));
        } else {
          setItems((prev) => [...prev, { ...values }]);
        }
      }}
      modalTitle={(editing) => (editing ? "Edit tag" : "New tag")}
      renderForm={(form, setField) => (
        <>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormSelect
            label="Category"
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            options={[
              { value: "Funding", label: "Funding" },
              { value: "Clinical", label: "Clinical" },
            ]}
          />
          <Toggle label="Active" checked={form.active} onChange={(v) => setField("active", v)} />
        </>
      )}
    />
  );
}

export const TagsWithToggle: StoryObj = {
  name: "Recipe: Tags with Toggle Column",
  render: () => <TagsDemo />,
};

/* ── Recipe: Appointment Types with ColorDot + OnOffBadge ──────────── */

interface ApptType {
  [key: string]: unknown;
  name: string;
  color: string;
  duration: number;
  onlineBooking: boolean;
}

function AppointmentTypesDemo() {
  const [items, setItems] = useState<ApptType[]>([
    { name: "Initial Assessment", color: "#7c3aed", duration: 60, onlineBooking: true },
    { name: "Follow Up", color: "#3b82f6", duration: 30, onlineBooking: true },
    { name: "Group Session", color: "#22c55e", duration: 90, onlineBooking: false },
    { name: "Phone Consult", color: "#f59e0b", duration: 15, onlineBooking: false },
    { name: "Home Visit", color: "#ef4444", duration: 60, onlineBooking: false },
    { name: "Review", color: "#6366f1", duration: 45, onlineBooking: true },
  ]);

  return (
    <SettingsListPage<ApptType, { name: string; color: string; duration: string; onlineBooking: boolean }>
      title="Appointment types"
      items={items}
      columns={[
        {
          key: "name",
          label: "Name",
          render: (item) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ColorDot color={item.color} />
              {item.name}
            </div>
          ),
        },
        { key: "duration", label: "Duration (mins)" },
        {
          key: "onlineBooking",
          label: "Online booking",
          render: (item) => <OnOffBadge value={item.onlineBooking} />,
        },
      ]}
      dropdownItems={STANDARD_SETTINGS}
      primaryButtonLabel="+ New type"
      formDefaults={{ name: "", color: "#7c3aed", duration: "30", onlineBooking: false }}
      onSave={(values, index) => {
        const entry: ApptType = {
          name: values.name,
          color: values.color,
          duration: parseInt(values.duration) || 30,
          onlineBooking: values.onlineBooking,
        };
        if (index !== null) {
          setItems((prev) => prev.map((a, i) => (i === index ? entry : a)));
        } else {
          setItems((prev) => [...prev, entry]);
        }
      }}
      modalTitle={(editing) => (editing ? "Edit appointment type" : "New appointment type")}
      renderForm={(form, setField) => (
        <>
          <FormInput label="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
          <FormColorPicker value={form.color} onChange={(c) => setField("color", c)} />
          <FormInput
            label="Duration (mins)"
            type="number"
            value={form.duration}
            onChange={(e) => setField("duration", e.target.value)}
          />
          <Toggle label="Enable online booking" checked={form.onlineBooking} onChange={(v) => setField("onlineBooking", v)} />
        </>
      )}
    />
  );
}

export const AppointmentTypes: StoryObj = {
  name: "Recipe: Appointment Types (ColorDot + OnOffBadge)",
  render: () => <AppointmentTypesDemo />,
};
