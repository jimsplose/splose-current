import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import TimePicker from "../TimePicker";
import DatePicker from "../DatePicker";

const meta: Meta<typeof TimePicker> = {
  title: "Forms/TimePicker",
  component: TimePicker,
  tags: ["extended"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    format: { control: "radio", options: ["12h", "24h"] },
    step: { control: "select", options: [5, 10, 15, 30, 60] },
    disabled: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Time-of-day input with popover for appointment forms, opening hours, and reminders.",
      whatToUseInstead:
        "Raw AntD TimePicker imports with bespoke format handling per page.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/TimePicker.md",
      source: "src/components/ds/TimePicker.tsx",
    },
    // No live call sites yet — component is staged for upcoming appointment,
    // busy-time, and clinic-hours form migrations.
    appPages: [],
    referenceUrl: "https://ant.design/components/time-picker",
  },
};
export default meta;
type Story = StoryObj<typeof TimePicker>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  render: () => {
    const Inner = () => {
      const [value, setValue] = useState<string | null>("10:00");
      return (
        <div style={{ maxWidth: 280 }}>
          <TimePicker label="Start time" value={value} onChange={setValue} />
          <div style={{ marginTop: 8, fontSize: 12, color: "#6E6E64" }}>
            HH:mm: {value ?? "(empty)"}
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

export const TwelveHour: Story = {
  name: "Feature: 12 hour",
  render: () => (
    <div style={{ maxWidth: 240 }}>
      <TimePicker label="Start" format="12h" defaultValue="14:30" />
    </div>
  ),
};

export const TwentyFourHour: Story = {
  name: "Feature: 24 hour",
  render: () => (
    <div style={{ maxWidth: 240 }}>
      <TimePicker label="Start" format="24h" defaultValue="14:30" />
    </div>
  ),
};

export const WithMinMax: Story = {
  name: "Feature: With Min/Max (clinic hours)",
  render: () => (
    <div style={{ maxWidth: 240 }}>
      <TimePicker
        label="Appointment time"
        minTime="09:00"
        maxTime="17:00"
        hint="Clinic open 9–5."
      />
    </div>
  ),
};

export const SteppedMinutes: Story = {
  name: "Feature: Stepped minutes (15)",
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ width: 200 }}>
        <TimePicker label="step=5" step={5} />
      </div>
      <div style={{ width: 200 }}>
        <TimePicker label="step=15" step={15} />
      </div>
      <div style={{ width: 200 }}>
        <TimePicker label="step=30" step={30} />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  name: "Feature: Sizes",
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
      <div style={{ width: 200 }}>
        <TimePicker label="Small" size="sm" defaultValue="14:30" />
      </div>
      <div style={{ width: 200 }}>
        <TimePicker label="Medium" size="md" defaultValue="14:30" />
      </div>
      <div style={{ width: 200 }}>
        <TimePicker label="Large" size="lg" defaultValue="14:30" />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  name: "Feature: Disabled",
  render: () => (
    <div style={{ maxWidth: 240 }}>
      <TimePicker label="Start" defaultValue="10:00" disabled />
    </div>
  ),
};

export const Error: Story = {
  name: "Feature: Error",
  render: () => (
    <div style={{ maxWidth: 240 }}>
      <TimePicker label="Start" required error="Start time is required." />
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const AppointmentStartTime: Story = {
  name: "Recipe: Appointment Start & End",
  render: () => {
    const Inner = () => {
      const [start, setStart] = useState<string | null>("10:00");
      const [end, setEnd] = useState<string | null>("10:30");
      return (
        <div style={{ display: "flex", gap: 12, maxWidth: 420 }}>
          <div style={{ flex: 1 }}>
            <TimePicker label="Start" value={start} onChange={setStart} />
          </div>
          <div style={{ flex: 1 }}>
            <TimePicker label="End" value={end} onChange={setEnd} minTime={start ?? undefined} />
          </div>
        </div>
      );
    };
    return <Inner />;
  },
};

export const ClinicOpeningHours: Story = {
  name: "Recipe: Clinic Opening Hours",
  render: () => (
    <div style={{ display: "flex", gap: 12, maxWidth: 420 }}>
      <div style={{ flex: 1 }}>
        <TimePicker label="Opens" defaultValue="08:00" step={30} />
      </div>
      <div style={{ flex: 1 }}>
        <TimePicker label="Closes" defaultValue="18:00" step={30} minTime="08:00" />
      </div>
    </div>
  ),
};

export const BusyTimeStartEnd: Story = {
  name: "Recipe: Busy Time Start & End (with date)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      <DatePicker label="Date" defaultValue={new Date()} />
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <TimePicker label="From" defaultValue="12:00" />
        </div>
        <div style={{ flex: 1 }}>
          <TimePicker label="To" defaultValue="13:00" />
        </div>
      </div>
    </div>
  ),
};
