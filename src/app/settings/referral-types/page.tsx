"use client";

import { useState } from "react";
import { SettingsListPage, FormInput, Toggle, OnOffBadge } from "@/components/ds";
import { SIMPLE_CRUD } from "@/lib/dropdown-presets";

interface ReferralType {
  [key: string]: unknown;
  name: string;
  defaultType: boolean;
}

const initialTypes: ReferralType[] = [
  { name: "Client", defaultType: true },
  { name: "Contact", defaultType: true },
  { name: "Other", defaultType: true },
  { name: "Facebook", defaultType: false },
  { name: "Google", defaultType: false },
  { name: "Doctor", defaultType: false },
  { name: "GP", defaultType: false },
];

export default function ReferralTypesPage() {
  const [types, setTypes] = useState(initialTypes);

  return (
    <SettingsListPage<ReferralType, { name: string; defaultType: boolean }>
      title="Referral types"
      items={types}
      columns={[
        { key: "name", label: "Name" },
        {
          key: "defaultType",
          label: "Default type",
          render: (item) => (
            <OnOffBadge value={item.defaultType} onLabel="Yes" offLabel="No" />
          ),
        },
      ]}
      dropdownItems={SIMPLE_CRUD}
      showDropdown={(item) => !item.defaultType}
      primaryButtonLabel="+ Add referral type"
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
        editing ? "Edit referral type" : "New referral type"
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
