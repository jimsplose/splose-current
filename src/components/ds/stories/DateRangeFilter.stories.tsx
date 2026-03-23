"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DateRangeFilter from "../DateRangeFilter";

const meta: Meta<typeof DateRangeFilter> = {
  title: "Layout/DateRangeFilter",
  component: DateRangeFilter,
  argTypes: {
    startDate: { control: "text" },
    endDate: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangeFilter>;

/* ── Playground ─────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    startDate: "2026-03-01",
    endDate: "2026-03-23",
  },
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

export const Default: Story = {
  args: {
    startDate: "2026-03-01",
    endDate: "2026-03-19",
  },
};

function CustomRangeDemo() {
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState("2026-03-31");

  return (
    <div className="space-y-4">
      <DateRangeFilter
        startDate={start}
        endDate={end}
        onStartChange={setStart}
        onEndChange={setEnd}
      />
      <p className="text-body-sm text-text-secondary">
        Range: {start} to {end}
      </p>
    </div>
  );
}

export const CustomRange: Story = {
  name: "Custom Range (interactive)",
  render: () => <CustomRangeDemo />,
};

/* ── Recipes ────────────────────────────────────────────────────────────── */

function ReportsDateRangeRecipe() {
  const [start, setStart] = useState("2026-03-11");
  const [end, setEnd] = useState("2026-03-11");

  return (
    <div className="space-y-4">
      <p className="text-body-sm text-text-secondary">
        From <code className="text-xs">reports/appointments</code> — date range
        filter with label, used alongside report filters.
      </p>
      <div>
        <label className="mb-1 flex items-center gap-1 text-sm text-text-secondary">
          Date range *
        </label>
        <DateRangeFilter
          startDate={start}
          endDate={end}
          onStartChange={setStart}
          onEndChange={setEnd}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className="rounded border border-border bg-white px-3 py-1.5 text-body-md text-text hover:bg-gray-50">
          Add filter
        </button>
        <button className="rounded border border-border bg-white px-3 py-1.5 text-body-md text-text hover:bg-gray-50">
          Save filters
        </button>
        <button className="rounded border border-border bg-white px-3 py-1.5 text-body-md text-text hover:bg-gray-50">
          Load filters
        </button>
        <button className="rounded bg-primary px-3 py-1.5 text-body-md text-white hover:bg-primary/90">
          Run report
        </button>
      </div>
    </div>
  );
}

export const ReportsDateRange: Story = {
  name: "Recipe: Reports Date Range",
  render: () => <ReportsDateRangeRecipe />,
};
