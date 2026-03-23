import type { Meta, StoryObj } from "@storybook/react";
import ColorDot from "../ColorDot";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof ColorDot> = {
  title: "Data Display/ColorDot",
  component: ColorDot,
  argTypes: {
    color: {
      control: "color",
      description: "CSS color value (hex, rgb, etc.)",
    },
    size: {
      control: "radio",
      options: ["xs", "sm", "md", "lg"],
      description: "xs=8px, sm=12px, md=16px, lg=20px",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ColorDot>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    color: "#7c3aed",
    size: "sm",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES — one per size                                  */
/* ================================================================== */

export const ExtraSmall: Story = {
  args: { color: "#ef4444", size: "xs" },
};

export const Small: Story = {
  args: { color: "#ef4444", size: "sm" },
};

export const Medium: Story = {
  args: { color: "#3b82f6", size: "md" },
};

export const Large: Story = {
  args: { color: "#22c55e", size: "lg" },
};

/* ------------------------------------------------------------------ */
/*  All Sizes side-by-side                                             */
/* ------------------------------------------------------------------ */

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <ColorDot color="#7c3aed" size={s} />
          <span className="text-xs text-text-secondary">{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Color palette                                                      */
/* ------------------------------------------------------------------ */

export const AllColors: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <ColorDot color="#ef4444" />
      <ColorDot color="#f59e0b" />
      <ColorDot color="#22c55e" />
      <ColorDot color="#3b82f6" />
      <ColorDot color="#8b5cf6" />
      <ColorDot color="#6b7280" />
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  ChartLegend                                                        */
/*  Pattern: Small color dots with labels used as chart legends         */
/*  Source: /page.tsx (Dashboard) — income chart with Invoices/Payments */
/*  legend items using xs dots with CSS variable colors                 */
/* ------------------------------------------------------------------ */

export const ChartLegend: Story = {
  name: "Recipe: Chart Legend",
  render: () => (
    <div className="w-96 rounded-lg border border-border bg-white p-4">
      <p className="mb-3 text-label-lg text-text">Income</p>
      {/* Simulated bar chart placeholder */}
      <div className="mb-3 flex h-32 items-end gap-2">
        {[60, 80, 45, 70, 90, 55, 75, 65, 85, 50, 95, 70].map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-stretch gap-0.5">
            <div className="rounded-sm bg-[#bef264]" style={{ height: `${h * 0.6}%` }} />
            <div className="rounded-sm bg-[#c084fc]" style={{ height: `${h * 0.4}%` }} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 text-caption-md text-text-secondary">
        <span className="flex items-center gap-1.5">
          <ColorDot color="#bef264" size="xs" /> Invoices
        </span>
        <span className="flex items-center gap-1.5">
          <ColorDot color="#c084fc" size="xs" /> Payments
        </span>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  PractitionerIndicator                                              */
/*  Pattern: Colored dot + practitioner first name as calendar headers  */
/*  Source: /calendar — CalendarView.tsx practitioner column headers     */
/* ------------------------------------------------------------------ */

export const PractitionerIndicator: Story = {
  name: "Recipe: Practitioner Indicator",
  render: () => (
    <div className="flex gap-6 border-b border-border pb-3">
      {[
        { name: "Joseph Go", color: "#f59e0b" },
        { name: "Hao Wang", color: "#16a34a" },
        { name: "Meghna Damodaran", color: "#ec4899" },
        { name: "Sarah Johnson", color: "#3b82f6" },
      ].map((p) => (
        <div key={p.name} className="flex items-center gap-1">
          <ColorDot color={p.color} size="xs" />
          <span className="truncate text-label-md text-text">
            {p.name.split(" ")[0]} {p.name.split(" ")[1]?.[0]}.
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: "padded" },
};
