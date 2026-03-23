"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import SettingsListPage from "../SettingsListPage";
import { FormInput } from "@/components/ds";
import { SIMPLE_CRUD } from "@/lib/dropdown-presets";

const meta: Meta<typeof SettingsListPage> = {
  title: "Design System/SettingsListPage",
  component: SettingsListPage,
};
export default meta;

interface Reason {
  name: string;
  code: string;
}

function Demo() {
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
  render: () => <Demo />,
};
