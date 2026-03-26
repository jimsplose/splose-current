import type { Meta, StoryObj } from "@storybook/react";
const fn = () => () => {};
import Chip from "../Chip";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Chip> = {
  title: "Data Display/Chip",
  component: Chip,
  argTypes: {
    variant: {
      control: "select",
      options: ["green", "purple", "yellow", "blue", "red", "gray"],
      description: "Color variant of the chip",
    },
    children: {
      control: "text",
      description: "Chip label text",
    },
    onRemove: {
      description: "Callback when the remove button is clicked. Shows the X button when provided.",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    variant: "green",
    children: "East Clinics",
    onRemove: undefined,
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES — one per variant                               */
/* ================================================================== */

export const Green: Story = {
  args: { variant: "green", children: "East Clinics" },
};

export const Purple: Story = {
  args: { variant: "purple", children: "Physio" },
};

export const Yellow: Story = {
  args: { variant: "yellow", children: "Booking for Jim" },
};

export const Blue: Story = {
  args: { variant: "blue", children: "Telehealth" },
};

export const Red: Story = {
  args: { variant: "red", children: "Urgent" },
};

export const Gray: Story = {
  args: { variant: "gray", children: "Unassigned" },
};

export const WithRemove: Story = {
  args: { variant: "yellow", children: "Filter tag", onRemove: fn() },
};

/* ------------------------------------------------------------------ */
/*  All Variants side-by-side                                          */
/* ------------------------------------------------------------------ */

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip variant="green">Green</Chip>
      <Chip variant="purple">Purple</Chip>
      <Chip variant="yellow">Yellow</Chip>
      <Chip variant="blue">Blue</Chip>
      <Chip variant="red">Red</Chip>
      <Chip variant="gray">Gray</Chip>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  CalendarFilterPills                                                 */
/*  Pattern: Active filter chips in the calendar toolbar                */
/*  Source: /calendar — location/discipline/booking-for filter pills    */
/* ------------------------------------------------------------------ */

export const CalendarFilterPills: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip variant="green">East Clinics</Chip>
      <Chip variant="purple">Physio</Chip>
      <Chip variant="yellow" onRemove={fn()}>
        Booking for <strong>Sarah Mitchell</strong>
      </Chip>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  ReportsDateRange                                                   */
/*  Pattern: Date range chips used in the reports header                */
/*  Source: /reports — purple date chips with arrow separator           */
/* ------------------------------------------------------------------ */

export const ReportsDateRange: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Chip variant="purple" className="border-primary text-body-md text-primary">
        1 Mar 2026
      </Chip>
      <span className="text-text-secondary">&rarr;</span>
      <Chip variant="purple" className="border-primary text-body-md text-primary">
        23 Mar 2026
      </Chip>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  TagFilters                                                         */
/*  Pattern: Removable tag chips for filtering lists                   */
/*  Source: /clients — applied tag filters with remove buttons          */
/* ------------------------------------------------------------------ */

export const TagFilters: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-label-lg text-text-secondary">Active filters:</p>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="blue" onRemove={fn()}>
          NDIS Participant
        </Chip>
        <Chip variant="green" onRemove={fn()}>
          Regular
        </Chip>
        <Chip variant="purple" onRemove={fn()}>
          Paediatric
        </Chip>
        <Chip variant="gray" onRemove={fn()}>
          Waitlist
        </Chip>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
