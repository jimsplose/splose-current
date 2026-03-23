import type { Meta, StoryObj } from "@storybook/react";
import Stat from "../Stat";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Stat> = {
  title: "Data Display/Stat",
  component: Stat,
  argTypes: {
    value: {
      control: "text",
      description: "The metric value (number or string)",
    },
    label: {
      control: "text",
      description: "Label text below the value",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Stat>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    value: 42,
    label: "Appointments",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: { value: 42, label: "Appointments" },
};

export const LargeNumber: Story = {
  args: { value: 1284, label: "Total Sessions" },
};

export const Zero: Story = {
  args: { value: 0, label: "Overdue" },
};

export const StringValue: Story = {
  args: { value: "$12,450", label: "Revenue" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  PractitionerStats                                                  */
/*  Pattern: Appointment + Notes stats at the bottom of practitioner   */
/*  cards with a top border separator.                                 */
/*  Source: /practitioners page — Stat pair in each practitioner card   */
/* ------------------------------------------------------------------ */

export const PractitionerStats: Story = {
  name: "Recipe: Practitioner Stats",
  render: () => (
    <div className="w-80">
      {[
        { name: "Joseph Go", appts: 24, notes: 18 },
        { name: "Hao Wang", appts: 12, notes: 8 },
        { name: "Meghna Damodaran", appts: 36, notes: 30 },
      ].map((p) => (
        <div key={p.name} className="mb-4 rounded-lg border border-border bg-white p-6">
          <h3 className="mb-2 font-semibold text-text">{p.name}</h3>
          <p className="mb-4 text-sm text-text-secondary">Occupational Therapist</p>
          <div className="flex gap-4 border-t border-border pt-4">
            <Stat value={p.appts} label="Appointments" />
            <Stat value={p.notes} label="Notes" />
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ReportMetrics                                                      */
/*  Pattern: Key metric stats for reports — utilisation rate, revenue, */
/*  appointment count displayed as a horizontal row of Stats.          */
/*  Source: /reports page — summary metrics at the top of reports       */
/* ------------------------------------------------------------------ */

export const ReportMetrics: Story = {
  name: "Recipe: Report Metrics",
  render: () => (
    <div className="rounded-lg border border-border bg-white p-6">
      <p className="mb-4 text-label-lg text-text-secondary">Dashboard Summary</p>
      <div className="flex gap-8">
        <Stat value="87%" label="Utilisation" />
        <Stat value="$24,580" label="Revenue" />
        <Stat value={142} label="Appointments" />
        <Stat value={38} label="New Clients" />
        <Stat value={12} label="Unsigned Notes" />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
