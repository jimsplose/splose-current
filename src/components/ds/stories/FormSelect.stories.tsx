import type { Meta, StoryObj } from "@storybook/react";
import FormSelect from "../FormSelect";
import FormInput from "../FormInput";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof FormSelect> = {
  title: "Forms/FormSelect",
  component: FormSelect,
  argTypes: {
    label: {
      control: "text",
      description: "Label shown above the select",
    },
    options: {
      control: "object",
      description: "Array of { value, label } option objects",
    },
    value: {
      control: "text",
      description: "Currently selected value (controlled mode)",
    },
    disabled: {
      control: "boolean",
      description: "Disables the select",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof FormSelect>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    label: "Country",
    options: [
      { value: "au", label: "Australia" },
      { value: "nz", label: "New Zealand" },
      { value: "uk", label: "United Kingdom" },
      { value: "us", label: "United States" },
    ],
    disabled: false,
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

const sampleOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
];

export const Default: Story = {
  args: { options: sampleOptions },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const WithLabel: Story = {
  args: { label: "Status", options: sampleOptions },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const WithPlaceholder: Story = {
  args: {
    label: "Service",
    options: [
      { value: "", label: "Select a service" },
      { value: "initial", label: "Initial Consultation" },
      { value: "followup", label: "Follow-up" },
      { value: "review", label: "Plan Review" },
    ],
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const Disabled: Story = {
  args: { label: "Locked field", options: sampleOptions, disabled: true },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

/* ------------------------------------------------------------------ */
/*  All States side-by-side                                            */
/* ------------------------------------------------------------------ */

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', maxWidth: 448, flexDirection: 'column', gap: 16 }}>
      <FormSelect label="Normal" options={sampleOptions} />
      <FormSelect
        label="With placeholder"
        options={[{ value: "", label: "Choose..." }, ...sampleOptions]}
      />
      <FormSelect label="Disabled" options={sampleOptions} disabled />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  LocationSelect                                                     */
/*  Pattern: Location dropdown in appointment creation modal           */
/*  Source: /calendar — create appointment → Location field             */
/* ------------------------------------------------------------------ */

export const LocationSelect: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <FormSelect
        label="Location"
        options={[
          { value: "east", label: "Hands Together Therapy (East)" },
          { value: "west", label: "Hands Together Therapy (West)" },
        ]}
      />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  StatusFilter                                                       */
/*  Pattern: Active/Archived filter select on list pages               */
/*  Source: /clients — status filter dropdown                           */
/* ------------------------------------------------------------------ */

export const StatusFilter: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <FormSelect
        label="Status"
        options={[
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived" },
        ]}
      />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  TemplateSelect                                                     */
/*  Pattern: Note template selection on new note creation               */
/*  Source: /notes/new — Template * field                               */
/* ------------------------------------------------------------------ */

export const TemplateSelect: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <FormSelect
        label="Template *"
        options={[
          { value: "", label: "Select template" },
          { value: "progress-note", label: "Progress Note" },
          { value: "initial-assessment", label: "Initial Assessment" },
          { value: "discharge-summary", label: "Discharge Summary" },
          { value: "soap-note", label: "SOAP Note" },
          { value: "treatment-plan", label: "Treatment Plan" },
        ]}
      />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  SettingsFormSelects                                                 */
/*  Pattern: Practice settings with terminology, country, currency     */
/*  Source: /settings — general settings grid                           */
/* ------------------------------------------------------------------ */

export const SettingsFormSelects: Story = {
  render: () => (
    <div style={{ maxWidth: 512, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.4, color: 'var(--color-text)' }}>Practice settings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <FormSelect
          label="Patient terminology"
          options={[
            { value: "Client", label: "Client" },
            { value: "Patient", label: "Patient" },
            { value: "Participant", label: "Participant" },
          ]}
        />
        <FormInput label="Currency code" type="text" defaultValue="AUD" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <FormSelect
          label="Country"
          options={[
            { value: "Australia", label: "Australia" },
            { value: "New Zealand", label: "New Zealand" },
            { value: "United Kingdom", label: "United Kingdom" },
          ]}
        />
        <FormInput label="Currency symbol" type="text" defaultValue="$" />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
