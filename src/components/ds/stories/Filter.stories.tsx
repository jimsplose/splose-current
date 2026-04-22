"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AppstoreOutlined, SplitCellsOutlined, CalendarOutlined, ClockCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import Filter from "../Filter";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Filter> = {
  title: "Forms/Filter",
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
          { label: <AppstoreOutlined style={{ fontSize: 16 }} />, value: "single" },
          { label: <SplitCellsOutlined style={{ fontSize: 16 }} />, value: "split" },
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>View:</span>
        <Filter
          items={[
            { label: <AppstoreOutlined style={{ fontSize: 16 }} />, value: "single" },
            { label: <SplitCellsOutlined style={{ fontSize: 16 }} />, value: "split" },
          ]}
          value={viewMode}
          onChange={setViewMode}
        />
        <span style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarOutlined style={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>March 2026</span>
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

/* ------------------------------------------------------------------ */
/*  NoteEditorToolbarToggle                                            */
/*  Pattern: View toggle in the note editor navbar, switching between  */
/*  single (full editor) and split (editor + reference panel) views.   */
/*  Source: /notes/[id]/edit — Filter in Navbar with LayoutGrid and    */
/*  Columns2 icons, used alongside + button and lock/save actions      */
/* ------------------------------------------------------------------ */

export const NoteEditorToolbarToggle: Story = {
  name: "Recipe: Note Editor Toolbar Toggle",
  render: function NoteEditorToolbarToggleStory() {
    const [viewMode, setViewMode] = useState("single");
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-secondary)', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>
        {/* Add new note button */}
        <button style={{ display: 'flex', height: 28, width: 28, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#22c55e', lineHeight: 1, color: '#fff', fontSize: 18, fontWeight: 700 }}>
          +
        </button>
        {/* View toggle */}
        <Filter
          items={[
            { label: <AppstoreOutlined style={{ fontSize: 16 }} />, value: "single" },
            { label: <SplitCellsOutlined style={{ fontSize: 16 }} />, value: "split" },
          ]}
          value={viewMode}
          onChange={setViewMode}
        />
        <span style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)', marginLeft: 8 }}>
          {viewMode === "single" ? "Full editor" : "Editor + reference"}
        </span>
      </div>
    );
  },
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  TimeViewFilter                                                     */
/*  Pattern: Time-based view toggling with icon labels. Shows how      */
/*  Filter can use clock/calendar/list icons for different views.      */
/*  Source: conceptual pattern based on calendar/schedule pages         */
/* ------------------------------------------------------------------ */

export const TimeViewFilter: Story = {
  name: "Recipe: Time View Filter",
  render: function TimeViewFilterStory() {
    const [view, setView] = useState("calendar");
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>View as:</span>
        <Filter
          items={[
            { label: <CalendarOutlined style={{ fontSize: 16 }} />, value: "calendar" },
            { label: <ClockCircleOutlined style={{ fontSize: 16 }} />, value: "timeline" },
            { label: <UnorderedListOutlined style={{ fontSize: 16 }} />, value: "list" },
          ]}
          value={view}
          onChange={setView}
        />
        <span style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
          {view === "calendar" ? "Calendar view" : view === "timeline" ? "Timeline view" : "List view"}
        </span>
      </div>
    );
  },
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  StatusFilter                                                       */
/*  Pattern: Text-based status filter for filtering table rows. Uses   */
/*  multiple text options for filtering by status category.            */
/*  Source: conceptual pattern based on /invoices, /clients pages      */
/* ------------------------------------------------------------------ */

export const StatusFilter: Story = {
  name: "Recipe: Status Filter",
  render: function StatusFilterStory() {
    const [status, setStatus] = useState("all");
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Status:</span>
          <Filter
            items={[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Archived", value: "archived" },
            ]}
            value={status}
            onChange={setStatus}
          />
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
          Showing <strong>{status === "all" ? "all" : status}</strong> records
        </p>
      </div>
    );
  },
  parameters: { layout: "padded" },
};
