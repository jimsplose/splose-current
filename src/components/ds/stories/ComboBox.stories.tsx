import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import ComboBox from "../ComboBox";
import type { ComboBoxOption } from "../ComboBox";
import PatientAvatar from "../PatientAvatar";

const meta: Meta = {
  title: "Forms/ComboBox",
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Filterable text input with dropdown and free-entry support for picker fields.",
      whatToUseInstead:
        "AntD AutoComplete imports with leaking internals and clunky free-entry handling.",
      referenceLibrary: "downshift",
      plan: "docs/ds-plans/ComboBox.md",
      source: "src/components/ds/ComboBox.tsx",
    },
  },
};
export default meta;
type Story = StoryObj;

const services: ComboBoxOption[] = [
  { value: "initial", label: "Initial consult (60 min)" },
  { value: "followup", label: "Follow-up (30 min)" },
  { value: "review", label: "Physio review (45 min)" },
  { value: "assessment", label: "Assessment (90 min)" },
  { value: "telehealth", label: "Telehealth (30 min)" },
  { value: "group", label: "Group session (60 min)" },
];

const practitioners = [
  { value: "sarah", label: "Dr Sarah Kim", color: "#5578FF" },
  { value: "james", label: "Dr James Cho", color: "#24a148" },
  { value: "maria", label: "Dr Maria Lopez", color: "#8250ff" },
];

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  render: () => {
    const Inner = () => {
      const [value, setValue] = useState<string | null>(null);
      return (
        <div style={{ maxWidth: 320 }}>
          <ComboBox
            label="Service"
            options={services}
            value={value}
            onChange={(v) => setValue(v)}
            placeholder="Pick a service…"
          />
          <div style={{ marginTop: 8, fontSize: 12, color: "#6E6E64" }}>
            value: {value ?? "(null)"}
          </div>
        </div>
      );
    };
    return <Inner />;
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Basic: Story = {
  name: "Feature: Basic",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <ComboBox label="Service" options={services} placeholder="Pick…" />
    </div>
  ),
};

export const Empty: Story = {
  name: "Feature: Empty filter",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <ComboBox
        label="Service"
        options={services}
        placeholder="Type 'xxxx' to see empty"
      />
    </div>
  ),
};

export const FreeEntry: Story = {
  name: "Feature: Free Entry",
  render: () => {
    const Inner = () => {
      const [value, setValue] = useState<string | null>(null);
      return (
        <div style={{ maxWidth: 320 }}>
          <ComboBox
            label="Service"
            options={services}
            value={value}
            onChange={setValue}
            allowFreeEntry
            placeholder="Pick or type a new service"
          />
          <div style={{ marginTop: 8, fontSize: 12, color: "#6E6E64" }}>
            value: {value ?? "(null)"}
          </div>
        </div>
      );
    };
    return <Inner />;
  },
};

export const WithCreate: Story = {
  name: "Feature: With Create",
  render: () => {
    const Inner = () => {
      const [created, setCreated] = useState<string[]>([]);
      return (
        <div style={{ maxWidth: 320 }}>
          <ComboBox
            label="Service"
            options={services}
            onCreate={(text) => setCreated((x) => [...x, text])}
            placeholder="Type to create a new service"
          />
          {created.length ? (
            <div style={{ marginTop: 8, fontSize: 12, color: "#6E6E64" }}>
              Created: {created.join(", ")}
            </div>
          ) : null}
        </div>
      );
    };
    return <Inner />;
  },
};

export const CustomRender: Story = {
  name: "Feature: Custom Render",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <ComboBox<(typeof practitioners)[number]>
        label="Practitioner"
        options={practitioners}
        renderOption={(p) => (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: p.color,
              }}
            />
            <span>{p.label}</span>
          </div>
        )}
      />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Feature: Disabled",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <ComboBox label="Service" options={services} disabled placeholder="Disabled" />
    </div>
  ),
};

export const Error: Story = {
  name: "Feature: Error",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <ComboBox
        label="Service"
        options={services}
        required
        error="Pick a service before saving."
      />
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const ServicePicker: Story = {
  name: "Recipe: Service Picker (allows create)",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <ComboBox
        label="Service"
        options={services}
        onCreate={() => {}}
        placeholder="Pick a service or type to create"
      />
    </div>
  ),
};

export const PractitionerPicker: Story = {
  name: "Recipe: Practitioner Picker",
  render: () => {
    const patients = [
      { id: "1", firstName: "Sarah", lastName: "Kim" },
      { id: "2", firstName: "James", lastName: "Cho" },
      { id: "3", firstName: "Maria", lastName: "Lopez" },
    ];
    const options: ComboBoxOption[] = patients.map((p, i) => ({
      value: p.id,
      label: `Dr ${p.firstName} ${p.lastName}`,
      _patient: p,
      _index: i,
    }));
    return (
      <div style={{ maxWidth: 320 }}>
        <ComboBox
          label="Practitioner"
          options={options}
          renderOption={(o) => {
            const p = (o as ComboBoxOption & { _patient: { id: string; firstName?: string; lastName?: string } })._patient;
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PatientAvatar patient={p} size="xs" />
                <span>{o.label}</span>
              </div>
            );
          }}
        />
      </div>
    );
  },
};

export const ReferrerPicker: Story = {
  name: "Recipe: Referrer Picker",
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <ComboBox
        label="Referred by"
        options={[
          { value: "1", label: "Dr Sarah Kim (GP, Carlton)" },
          { value: "2", label: "Harry Nguyen (self)" },
          { value: "3", label: "Mira Chen (family)" },
        ]}
        placeholder="Search contacts…"
        allowFreeEntry
      />
    </div>
  ),
};
