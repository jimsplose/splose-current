"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import SettingsListPage from "../SettingsListPage";
import { FormInput, Toggle, OnOffBadge, ColorDot, FormColorPicker, FormSelect } from "@/components/ds";
import { SIMPLE_CRUD, STANDARD_SETTINGS } from "@/lib/dropdown-presets";

const meta: Meta<typeof SettingsListPage> = {
  title: "Templates/SettingsListPage",
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
      className="p-2"
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
      className="p-2"
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
            <div className="flex items-center gap-2">
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
