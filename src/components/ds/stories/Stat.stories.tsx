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
    description: {
      control: "text",
      description: "Subtitle text below the label",
    },
    align: {
      control: "radio",
      options: ["left", "center"],
      description: "Text alignment (default: left)",
    },
    color: {
      control: "color",
      description: "Color applied to the value text",
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

export const LeftAligned: Story = {
  args: { value: 42, label: "Appointments", align: "left" },
};

export const CenterAligned: Story = {
  args: { value: 42, label: "Appointments", align: "center" },
};

export const WithDescription: Story = {
  args: { value: "87%", label: "Utilisation", description: "Percentage of available time utilised" },
};

export const WithColor: Story = {
  args: { value: "$12,450", label: "Revenue", color: "#52c41a" },
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
    <div style={{ width: 320 }}>
      {[
        { name: "Joseph Go", appts: 24, notes: 18 },
        { name: "Hao Wang", appts: 12, notes: 8 },
        { name: "Meghna Damodaran", appts: 36, notes: 30 },
      ].map((p) => (
        <div key={p.name} style={{ marginBottom: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
          <h3 className="text-text" style={{ marginBottom: 8, fontWeight: 600 }}>{p.name}</h3>
          <p className="text-text-secondary" style={{ marginBottom: 16, fontSize: 12 }}>Occupational Therapist</p>
          <div style={{ display: 'flex', gap: 16, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
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
    <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <p className="text-label-lg text-text-secondary" style={{ marginBottom: 16 }}>Dashboard Summary</p>
      <div style={{ display: 'flex', gap: 32 }}>
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
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ width: 288, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
        <h3 className="text-heading-sm text-text">Utilisation</h3>
        <p className="text-caption-md text-text-secondary" style={{ marginBottom: 8 }}>Percentage of available time utilised</p>
        <Stat value="0.85%" label="01 Mar - 24 Mar" />
      </div>
      <div style={{ width: 288, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 16 }}>
        <h3 className="text-heading-sm text-text">Revenue</h3>
        <p className="text-caption-md text-text-secondary" style={{ marginBottom: 8 }}>Total invoiced revenue (tax exclusive)</p>
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
    <div style={{ width: 384, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 24 }}>
      <h3 className="text-heading-md text-text" style={{ marginBottom: 4 }}>Sarah Johnson</h3>
      <p className="text-caption-md text-text-secondary" style={{ marginBottom: 16 }}>Client since 15 Jan 2025</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
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
    <div style={{ width: 600, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
      <div style={{ borderBottom: '1px solid var(--color-border)', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>
        <h3 className="text-heading-sm text-text">Practitioners</h3>
        <p className="text-caption-md text-text-secondary">Breakdown of performance by individual practitioner</p>
      </div>
      <table style={{ width: '100%' }}>
        <thead>
          <tr className="border-border bg-table-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Name</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'center' }}>Appointments</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'center' }}>Revenue</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'center' }}>Utilisation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            { name: "Joseph Go", appts: 24, revenue: "$4,200", util: "92%" },
            { name: "Hao Wang", appts: 18, revenue: "$3,100", util: "78%" },
            { name: "Meghna D.", appts: 31, revenue: "$5,800", util: "95%" },
          ].map((p) => (
            <tr key={p.name} >
              <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>{p.name}</td>
              <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Stat value={p.appts} label="" /></td>
              <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Stat value={p.revenue} label="" /></td>
              <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Stat value={p.util} label="" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};
