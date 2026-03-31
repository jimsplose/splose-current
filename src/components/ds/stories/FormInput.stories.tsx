import type { Meta, StoryObj } from "@storybook/react";
import { SearchOutlined } from "@ant-design/icons";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import Button from "../Button";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof FormInput> = {
  title: "Forms/FormInput",
  component: FormInput,
  argTypes: {
    label: {
      control: "text",
      description: "Label shown above the input",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "date", "tel", "url"],
      description: "HTML input type",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    error: {
      control: "text",
      description: "Error message shown below the input",
    },
    disabled: {
      control: "boolean",
      description: "Disables the input",
    },
    defaultValue: {
      control: "text",
      description: "Default value for uncontrolled usage",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof FormInput>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    label: "Full name",
    type: "text",
    placeholder: "Enter name...",
    error: "",
    disabled: false,
    defaultValue: "",
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: { placeholder: "Type here..." },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const WithLabel: Story = {
  args: { label: "Email address", placeholder: "you@example.com" },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const WithError: Story = {
  args: { label: "Email", placeholder: "you@example.com", error: "Please enter a valid email" },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const Password: Story = {
  args: { label: "Password", type: "password", placeholder: "Enter password..." },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const Disabled: Story = {
  args: { label: "Locked field", disabled: true, defaultValue: "Cannot edit this" },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const WithPlaceholder: Story = {
  args: { label: "Search clients", placeholder: "Start typing to search..." },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

/* ------------------------------------------------------------------ */
/*  All States side-by-side                                            */
/* ------------------------------------------------------------------ */

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', maxWidth: 448, flexDirection: 'column', gap: 16 }}>
      <FormInput label="Normal" placeholder="Type here..." />
      <FormInput label="With value" defaultValue="hello@splose.com" />
      <FormInput label="With error" error="This field is required" />
      <FormInput label="Disabled" disabled defaultValue="Cannot edit" />
      <FormInput label="Password" type="password" defaultValue="secret123" />
      <FormInput label="Date" type="date" defaultValue="2026-03-23" />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  SettingsFormField                                                   */
/*  Pattern: Stacked label + input fields in a settings section        */
/*  Source: /settings/invoice-settings (prefix, padding, next number)  */
/* ------------------------------------------------------------------ */

export const SettingsFormField: Story = {
  render: () => (
    <div style={{ maxWidth: 448 }}>
      <h2 className="text-heading-lg text-text" style={{ marginBottom: 16 }}>Invoice number</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FormInput label="Prefix" defaultValue="INV" />
        <FormInput label="Padding" defaultValue="6" />
        <FormInput label="Next invoice number" defaultValue="6309" />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  PaymentAmountInput                                                 */
/*  Pattern: Currency input with $ prefix wrapper                      */
/*  Source: /payments/new page — amount field with dollar sign          */
/* ------------------------------------------------------------------ */

export const PaymentAmountInput: Story = {
  render: () => (
    <div style={{ maxWidth: 384 }}>
      <label className="text-label-lg text-text-secondary" style={{ marginBottom: 4, display: 'block' }}>
        Amount <span style={{ color: '#ef4444' }}>*</span>
      </label>
      <div style={{ position: 'relative' }}>
        <span className="text-text-secondary" style={{top: '50%', position: 'absolute', left: 12, zIndex: 10, transform: 'translateY(-50%)', fontSize: 12 }}>$</span>
        <FormInput type="number" step="0.01" min="0" placeholder="0.00" style={{ paddingLeft: 28 }} />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  DateInput                                                          */
/*  Pattern: Date picker field with label                              */
/*  Source: /calendar create appointment modal — Date * field           */
/* ------------------------------------------------------------------ */

export const DateInput: Story = {
  render: () => (
    <div style={{ maxWidth: 384 }}>
      <FormInput label="Date *" type="date" defaultValue="2026-03-23" />
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  SearchInput                                                        */
/*  Pattern: Search input with icon wrapper                            */
/*  Source: /payments/new — search invoices with search icon            */
/* ------------------------------------------------------------------ */

export const SearchInput: Story = {
  render: () => (
    <div style={{ maxWidth: 448 }}>
      <div style={{ position: 'relative' }}>
        <SearchOutlined style={{ fontSize: 16 }} className="text-text-secondary" style={{top: '50%', position: 'absolute', left: 12, zIndex: 10, transform: 'translateY(-50%)' }} />
        <FormInput type="text" placeholder="Search invoices by number or client..." style={{ height: 36, paddingLeft: 40 }} />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  AppointmentForm                                                    */
/*  Pattern: Multiple FormInputs + FormSelects in a modal form         */
/*  Source: /calendar — create appointment modal                       */
/* ------------------------------------------------------------------ */

export const AppointmentForm: Story = {
  render: () => (
    <div style={{ maxWidth: 512, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FormSelect
        label="Location"
        options={[
          { value: "main", label: "Main Clinic" },
          { value: "east", label: "East Clinics" },
        ]}
      />
      <FormSelect
        label="Practitioner *"
        options={[
          { value: "1", label: "Dr Sarah Chen" },
          { value: "2", label: "Tom Wilson" },
        ]}
      />
      <FormInput label="Client *" type="text" placeholder="Start typing to search client..." />
      <FormInput label="Date *" type="date" defaultValue="2026-03-23" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
