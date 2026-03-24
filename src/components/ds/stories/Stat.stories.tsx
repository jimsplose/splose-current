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

/* ------------------------------------------------------------------ */
/*  DashboardIncomeCard                                                */
/*  Pattern: Key metrics shown at top of dashboard income/revenue      */
/*  cards with a heading, a large metric value, and a date range       */
/*  subtitle — a Stat-like layout but with extra context.              */
/*  Source: /reports page.tsx — Utilisation + Revenue metric cards      */
/* ------------------------------------------------------------------ */

export const DashboardIncomeCard: Story = {
  name: "Recipe: Dashboard Income Card",
  render: () => (
    <div className="flex gap-6">
      <div className="w-72 rounded-lg border border-border bg-white p-4">
        <h3 className="text-heading-sm text-text">Utilisation</h3>
        <p className="mb-2 text-caption-md text-text-secondary">Percentage of available time utilised</p>
        <Stat value="0.85%" label="01 Mar - 24 Mar" />
      </div>
      <div className="w-72 rounded-lg border border-border bg-white p-4">
        <h3 className="text-heading-sm text-text">Revenue</h3>
        <p className="mb-2 text-caption-md text-text-secondary">Total invoiced revenue (tax exclusive)</p>
        <Stat value="$1.09K" label="01 Mar - 24 Mar" />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ClientOverviewStats                                                */
/*  Pattern: Multiple Stats in a horizontal row inside a client detail */
/*  overview card, showing appointment history, balance, and notes.    */
/*  Source: /clients/[id] page — summary metrics for individual client */
/* ------------------------------------------------------------------ */

export const ClientOverviewStats: Story = {
  name: "Recipe: Client Overview Stats",
  render: () => (
    <div className="w-96 rounded-lg border border-border bg-white p-6">
      <h3 className="mb-1 text-heading-md text-text">Sarah Johnson</h3>
      <p className="mb-4 text-caption-md text-text-secondary">Client since 15 Jan 2025</p>
      <div className="grid grid-cols-4 gap-4 border-t border-border pt-4">
        <Stat value={18} label="Total Appts" />
        <Stat value={3} label="Upcoming" />
        <Stat value="$240" label="Balance" />
        <Stat value={2} label="Unsigned" />
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  PractitionerTableRow                                               */
/*  Pattern: Stat values used inline within a data table row to show   */
/*  per-practitioner metrics in the reports dashboard table.           */
/*  Source: /reports page.tsx — Practitioners table breakdown           */
/* ------------------------------------------------------------------ */

export const PractitionerTableRow: Story = {
  name: "Recipe: Practitioner Table Row",
  render: () => (
    <div className="w-[600px] rounded-lg border border-border bg-white">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-heading-sm text-text">Practitioners</h3>
        <p className="text-caption-md text-text-secondary">Breakdown of performance by individual practitioner</p>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-table-header">
            <th className="px-4 py-3 text-left text-label-lg text-text">Name</th>
            <th className="px-4 py-3 text-center text-label-lg text-text">Appointments</th>
            <th className="px-4 py-3 text-center text-label-lg text-text">Revenue</th>
            <th className="px-4 py-3 text-center text-label-lg text-text">Utilisation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            { name: "Joseph Go", appts: 24, revenue: "$4,200", util: "92%" },
            { name: "Hao Wang", appts: 18, revenue: "$3,100", util: "78%" },
            { name: "Meghna D.", appts: 31, revenue: "$5,800", util: "95%" },
          ].map((p) => (
            <tr key={p.name} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-body-md text-text">{p.name}</td>
              <td className="px-4 py-3"><Stat value={p.appts} label="" /></td>
              <td className="px-4 py-3"><Stat value={p.revenue} label="" /></td>
              <td className="px-4 py-3"><Stat value={p.util} label="" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};
