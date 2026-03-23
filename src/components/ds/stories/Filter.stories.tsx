"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { LayoutGrid, Columns2, Calendar, Clock, List as ListIcon } from "lucide-react";
import Filter from "../Filter";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Filter> = {
  title: "Layout/Filter",
  component: Filter,
  argTypes: {
    value: {
      control: "text",
      description: "Currently selected value",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Filter>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  render: function PlaygroundStory() {
    const [value, setValue] = useState("all");
    return (
      <Filter
        items={[
          { label: "All", value: "all" },
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
          { label: "Archived", value: "archived" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = useState("all");
    return (
      <Filter
        items={[
          { label: "All", value: "all" },
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
          { label: "Archived", value: "archived" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const WithIcons: Story = {
  render: function WithIconsStory() {
    const [value, setValue] = useState("single");
    return (
      <Filter
        items={[
          { label: <LayoutGrid className="h-4 w-4" />, value: "single" },
          { label: <Columns2 className="h-4 w-4" />, value: "split" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const TwoOptions: Story = {
  render: function TwoOptionsStory() {
    const [value, setValue] = useState("single");
    return (
      <Filter
        items={[
          { label: "Single", value: "single" },
          { label: "Split", value: "split" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  NoteViewToggle                                                     */
/*  Pattern: Grid/split view toggle in the notes editor toolbar.       */
/*  Uses icon-only labels for LayoutGrid and Columns2 icons.           */
/*  Source: /notes/[id]/edit — Filter in the Navbar for toggling       */
/*  between single editor view and split (editor + preview) view       */
/* ------------------------------------------------------------------ */

export const NoteViewToggle: Story = {
  name: "Recipe: Note View Toggle",
  render: function NoteViewToggleStory() {
    const [viewMode, setViewMode] = useState("single");
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-2">
        <span className="text-label-lg text-text">View:</span>
        <Filter
          items={[
            { label: <LayoutGrid className="h-4 w-4" />, value: "single" },
            { label: <Columns2 className="h-4 w-4" />, value: "split" },
          ]}
          value={viewMode}
          onChange={setViewMode}
        />
        <span className="text-caption-md text-text-secondary">
          {viewMode === "single" ? "Editor only" : "Editor + Preview"}
        </span>
      </div>
    );
  },
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  CalendarViewFilter                                                 */
/*  Pattern: Calendar view mode selector — day/week/month options.     */
/*  Uses text labels in a segmented control style.                     */
/*  Source: /calendar — view mode toggle in the calendar toolbar        */
/* ------------------------------------------------------------------ */

export const CalendarViewFilter: Story = {
  name: "Recipe: Calendar View Filter",
  render: function CalendarViewFilterStory() {
    const [view, setView] = useState("week");
    return (
      <div className="flex items-center gap-4 rounded-lg border border-border bg-white px-4 py-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-text-secondary" />
          <span className="text-label-lg text-text">March 2026</span>
        </div>
        <Filter
          items={[
            { label: "Day", value: "day" },
            { label: "Week", value: "week" },
            { label: "Month", value: "month" },
          ]}
          value={view}
          onChange={setView}
        />
      </div>
    );
  },
  parameters: { layout: "padded" },
};
