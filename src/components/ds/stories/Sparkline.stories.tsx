import type { Meta, StoryObj } from "@storybook/react";
import Sparkline from "../Sparkline";

const meta: Meta<typeof Sparkline> = {
  title: "Data Display/Sparkline",
  component: Sparkline,
  argTypes: {
    tone: { control: "select", options: ["primary", "success", "danger", "warning", "neutral"] },
    shape: { control: "radio", options: ["line", "area", "bar"] },
    showDots: { control: "boolean" },
    markLast: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Tiny inline trend chart for Stat compositions and dashboard metric tiles.",
      whatToUseInstead:
        "Full-size Highcharts embeds for what should be glanceable trend shapes.",
      referenceLibrary: "first-party",
      plan: "docs/ds-plans/Sparkline.md",
      source: "src/components/ds/Sparkline.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Sparkline>;

const up = [10, 12, 11, 14, 15, 16, 18, 20, 22, 24, 26, 28];
const down = [28, 26, 27, 23, 24, 20, 19, 18, 15, 14, 12, 10];
const flat = [14, 15, 14, 15, 14, 15, 14, 15, 14];
const volatile = [10, 28, 14, 22, 8, 30, 18, 24, 12, 26, 14, 22];

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: {
    data: up,
    "aria-label": "Sparkline trending up",
    width: 96,
    height: 24,
    shape: "line",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Line: Story = {
  name: "Feature: Line",
  args: { data: up, shape: "line", "aria-label": "Line sparkline" },
};

export const Area: Story = {
  name: "Feature: Area",
  args: { data: up, shape: "area", "aria-label": "Area sparkline" },
};

export const Bar: Story = {
  name: "Feature: Bar",
  args: { data: volatile, shape: "bar", "aria-label": "Bar sparkline" },
};

export const TonesAutoInferred: Story = {
  name: "Feature: Tones (auto-inferred)",
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 12, color: "#6E6E64" }}>Up (success)</div>
        <Sparkline data={up} aria-label="Trending up" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#6E6E64" }}>Down (danger)</div>
        <Sparkline data={down} aria-label="Trending down" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#6E6E64" }}>Flat (neutral)</div>
        <Sparkline data={flat} aria-label="Flat" />
      </div>
    </div>
  ),
};

export const WithDots: Story = {
  name: "Feature: With Dots",
  args: { data: up, showDots: true, "aria-label": "Sparkline with dots" },
};

export const WithLastDotOnly: Story = {
  name: "Feature: With Last Dot Only",
  args: { data: up, markLast: true, "aria-label": "Sparkline with last-dot only" },
};

export const WithBaseline: Story = {
  name: "Feature: With Baseline",
  args: { data: up, baseline: 15, "aria-label": "Sparkline with baseline" },
};

export const EdgeCases: Story = {
  name: "Feature: Edge Cases",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, auto)", gap: 16, alignItems: "center" }}>
      <span style={{ fontSize: 12, color: "#6E6E64" }}>Empty</span>
      <Sparkline data={[]} aria-label="Empty sparkline" />
      <span style={{ fontSize: 12, color: "#6E6E64" }}>Single</span>
      <Sparkline data={[12]} aria-label="Single-point sparkline" />
      <span style={{ fontSize: 12, color: "#6E6E64" }}>All zero</span>
      <Sparkline data={[0, 0, 0, 0, 0]} aria-label="All-zero sparkline" />
      <span style={{ fontSize: 12, color: "#6E6E64" }}>All same</span>
      <Sparkline data={[5, 5, 5, 5, 5]} aria-label="Flat sparkline" />
    </div>
  ),
};

export const Sizes: Story = {
  name: "Feature: Sizes",
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <Sparkline data={up} width={60} height={16} aria-label="Tiny" />
      <Sparkline data={up} width={96} height={24} aria-label="Default" />
      <Sparkline data={up} width={160} height={40} aria-label="Large" />
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const DashboardRevenueTile: Story = {
  name: "Recipe: Dashboard Revenue Tile",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: 16,
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        width: 240,
      }}
    >
      <div style={{ fontSize: 12, color: "#6E6E64" }}>Revenue — last 30 days</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>$12,430</div>
        <Sparkline data={up} shape="area" aria-label="Revenue trending up" width={120} height={32} />
      </div>
      <div style={{ fontSize: 12, color: "#24a148" }}>↗ +12% vs previous 30 days</div>
    </div>
  ),
};

export const AgedDebtorsTrend: Story = {
  name: "Recipe: Aged Debtors Trend",
  render: () => (
    <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
          <th style={{ textAlign: "left", padding: "8px 12px" }}>Client</th>
          <th style={{ textAlign: "right", padding: "8px 12px" }}>Outstanding</th>
          <th style={{ padding: "8px 12px" }}>Trend</th>
        </tr>
      </thead>
      <tbody>
        {[
          { name: "Harry Nguyen", amount: "$840", data: up },
          { name: "Mira Chen", amount: "$420", data: down },
          { name: "Jamie Lee", amount: "$180", data: flat },
        ].map((r) => (
          <tr key={r.name} style={{ borderBottom: "1px solid #f0f0f0" }}>
            <td style={{ padding: "8px 12px" }}>{r.name}</td>
            <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600 }}>{r.amount}</td>
            <td style={{ padding: "8px 12px" }}>
              <Sparkline data={r.data} aria-label={`${r.name} outstanding trend`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const PatientNotesFrequency: Story = {
  name: "Recipe: Patient Notes Frequency",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 16, fontWeight: 500 }}>12 notes this quarter</div>
      <Sparkline data={[2, 1, 3, 0, 4, 2]} shape="bar" aria-label="Note frequency by month" width={80} height={24} />
    </div>
  ),
};
