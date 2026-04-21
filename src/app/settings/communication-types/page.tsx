"use client";

import { useState } from "react";
import { SettingsListPage, FormInput, Toggle, Text } from "@/components/ds";
import { SIMPLE_CRUD } from "@/lib/dropdown-presets";

interface CommType {
  [key: string]: unknown;
  name: string;
  defaultType: boolean;
}

const initialTypes: CommType[] = [
  { name: "SMS", defaultType: true },
  { name: "Email", defaultType: true },
  { name: "Phone call", defaultType: false },
  { name: "In-person", defaultType: false },
  { name: "fax", defaultType: false },
  { name: "Admin Notes", defaultType: false },
];

export default function CommunicationTypesPage() {
  const [types, setTypes] = useState(initialTypes);

  return (
    <SettingsListPage<CommType, { name: string; defaultType: boolean }>
      title="Communication types"
      items={types}
      columns={[
        { key: "name", label: "Name" },
        {
          key: "defaultType",
          label: "Default type",
          render: (item) => (
            <Text variant="body/md" color={item.defaultType ? "success" : "danger"}>{item.defaultType ? "Yes" : "No"}</Text>
          ),
        },
      ]}
      dropdownItems={SIMPLE_CRUD}
      showDropdown={(item) => !item.defaultType}
      primaryButtonLabel="+ Add communication type"
      formDefaults={{ name: "", defaultType: false }}
      onSave={(values, index) => {
        if (index !== null) {
          setTypes((prev) =>
            prev.map((t, i) =>
              i === index
                ? { name: values.name, defaultType: values.defaultType }
                : t,
            ),
          );
        } else {
          setTypes((prev) => [
            ...prev,
            { name: values.name, defaultType: values.defaultType },
          ]);
        }
      }}
      modalTitle={(editing) =>
        editing ? "Edit communication type" : "New communication type"
      }
      renderForm={(form, setField) => (
        <>
          <FormInput
            label="Name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
          />
          <Toggle
            label="Default type"
            checked={form.defaultType}
            onChange={(v) => setField("defaultType", v)}
          />
        </>
      )}
    />
  );
}
