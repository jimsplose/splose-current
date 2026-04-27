import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DatePicker from "../DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Forms/DatePicker",
  component: DatePicker,
  tags: ["extended"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    clearable: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Single-date input with calendar popover for forms and filters.",
      whatToUseInstead: "Raw AntD DatePicker imports with bespoke styling per page.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/DatePicker.md",
      source: "src/components/ds/DatePicker.tsx",
    },
    // No call sites in src/app/ yet
    appPages: [],
    referenceUrl: "https://ant.design/components/date-picker",
  },
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

const today = new Date();
const dob = new Date(1988, 4, 14);

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: {
    label: "Date",
    defaultValue: today,
    placeholder: "DD/MM/YYYY",
    size: "md",
    clearable: true,
  },
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <DatePicker {...args} />
    </div>
  ),
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Empty: Story = {
  name: "Feature: Empty",
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <DatePicker label="Appointment date" />
    </div>
  ),
};

export const Filled: Story = {
  name: "Feature: Filled",
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <DatePicker label="Appointment date" defaultValue={today} />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Feature: Disabled",
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <DatePicker label="Appointment date" defaultValue={today} disabled />
    </div>
  ),
};

export const Error: Story = {
  name: "Feature: Error",
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <DatePicker
        label="Appointment date"
        required
        error="Date is required"
      />
    </div>
  ),
};

export const WithMinMax: Story = {
  name: "Feature: With Min/Max (DOB past only)",
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <DatePicker
        label="Date of birth"
        maxDate={today}
        placeholder="DD/MM/YYYY"
        hint="Must be in the past"
      />
    </div>
  ),
};

export const WithDisabledDates: Story = {
  name: "Feature: With Disabled Dates (weekends)",
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <DatePicker
        label="Next appointment"
        disabledDates={(d) => d.getDay() === 0 || d.getDay() === 6}
        hint="Weekends unavailable"
      />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Feature: Sizes",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
      <div style={{ width: 220 }}>
        <DatePicker label="Small" size="sm" defaultValue={today} />
      </div>
      <div style={{ width: 220 }}>
        <DatePicker label="Medium" size="md" defaultValue={today} />
      </div>
      <div style={{ width: 220 }}>
        <DatePicker label="Large" size="lg" defaultValue={today} />
      </div>
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const PatientDOB: Story = {
  name: "Recipe: Patient DOB",
  render: () => {
    const Inner = () => {
      const [value, setValue] = useState<Date | null>(dob);
      return (
        <div style={{ maxWidth: 280 }}>
          <DatePicker
            label="Date of birth"
            value={value}
            onChange={setValue}
            maxDate={today}
            required
          />
        </div>
      );
    };
    return <Inner />;
  },
};

export const ReportDateFilter: Story = {
  name: "Recipe: Report Date Filter",
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ fontSize: 13, color: "#6E6E64", minWidth: 80 }}>As of</div>
      <div style={{ width: 200 }}>
        <DatePicker defaultValue={today} />
      </div>
    </div>
  ),
};

export const InvoiceDueDate: Story = {
  name: "Recipe: Invoice Due Date",
  render: () => {
    const due = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    return (
      <div style={{ maxWidth: 280 }}>
        <DatePicker
          label="Due date"
          defaultValue={due}
          minDate={today}
          hint="Net 14 default"
        />
      </div>
    );
  },
};
