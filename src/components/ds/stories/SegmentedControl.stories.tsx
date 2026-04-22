import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  CalendarOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import SegmentedControl from "../SegmentedControl";
import Icon from "../Icon";

const meta: Meta = {
  title: "Forms/SegmentedControl",
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Mutually-exclusive option group for 2-4 labelled choices (Week/Day/Month view switcher, All/Active/Archived filter).",
      whatToUseInstead:
        "Raw AntD Segmented imports and custom pill-button groups.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/SegmentedControl.md",
      source: "src/components/ds/SegmentedControl.tsx",
    },
  },
};
export default meta;
type Story = StoryObj;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  render: () => {
    const Inner = () => {
      const [value, setValue] = useState<"week" | "day" | "month">("week");
      return (
        <SegmentedControl<"week" | "day" | "month">
          options={[
            { value: "week", label: "Week" },
            { value: "day", label: "Day" },
            { value: "month", label: "Month" },
          ]}
          value={value}
          onChange={setValue}
          aria-label="Calendar view"
        />
      );
    };
    return <Inner />;
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

function Controlled<T extends string>({
  options,
  defaultValue,
  label,
  ...rest
}: {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  defaultValue: T;
  label: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
}) {
  const [value, setValue] = useState<T>(defaultValue);
  return (
    <SegmentedControl<T>
      options={options}
      value={value}
      onChange={setValue}
      aria-label={label}
      {...rest}
    />
  );
}

export const TwoOption: Story = {
  name: "Feature: Two options",
  render: () => (
    <Controlled
      label="List or grid"
      defaultValue="list"
      options={[
        { value: "list", label: "List" },
        { value: "grid", label: "Grid" },
      ]}
    />
  ),
};

export const ThreeOption: Story = {
  name: "Feature: Three options",
  render: () => (
    <Controlled
      label="Time range"
      defaultValue="month"
      options={[
        { value: "week", label: "This week" },
        { value: "month", label: "Month" },
        { value: "quarter", label: "Quarter" },
      ]}
    />
  ),
};

export const FourOption: Story = {
  name: "Feature: Four options",
  render: () => (
    <Controlled
      label="Status filter"
      defaultValue="all"
      options={[
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "paused", label: "Paused" },
        { value: "archived", label: "Archived" },
      ]}
    />
  ),
};

export const IconOnly: Story = {
  name: "Feature: Icon only",
  render: () => (
    <Controlled
      label="Layout"
      defaultValue="list"
      options={[
        { value: "list", label: "", icon: <Icon as={UnorderedListOutlined} size="md" /> },
        { value: "grid", label: "", icon: <Icon as={AppstoreOutlined} size="md" /> },
        { value: "calendar", label: "", icon: <Icon as={CalendarOutlined} size="md" /> },
      ]}
    />
  ),
};

export const IconPlusLabel: Story = {
  name: "Feature: Icon + label",
  render: () => (
    <Controlled
      label="Layout"
      defaultValue="list"
      options={[
        { value: "list", label: "List", icon: <Icon as={UnorderedListOutlined} size="sm" /> },
        { value: "grid", label: "Grid", icon: <Icon as={AppstoreOutlined} size="sm" /> },
        { value: "calendar", label: "Calendar", icon: <Icon as={CalendarOutlined} size="sm" /> },
      ]}
    />
  ),
};

export const FullWidth: Story = {
  name: "Feature: Full width",
  render: () => (
    <div style={{ width: 560 }}>
      <Controlled
        label="Filter"
        defaultValue="all"
        fullWidth
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived" },
        ]}
      />
    </div>
  ),
};

export const Disabled: Story = {
  name: "Feature: Disabled",
  render: () => (
    <Controlled
      label="View"
      defaultValue="week"
      disabled
      options={[
        { value: "week", label: "Week" },
        { value: "day", label: "Day" },
        { value: "month", label: "Month" },
      ]}
    />
  ),
};

export const Sizes: Story = {
  name: "Feature: Sizes",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <Controlled
        label="Small"
        defaultValue="a"
        size="sm"
        options={[
          { value: "a", label: "Small" },
          { value: "b", label: "Size" },
        ]}
      />
      <Controlled
        label="Medium"
        defaultValue="a"
        size="md"
        options={[
          { value: "a", label: "Medium" },
          { value: "b", label: "Size" },
        ]}
      />
      <Controlled
        label="Large"
        defaultValue="a"
        size="lg"
        options={[
          { value: "a", label: "Large" },
          { value: "b", label: "Size" },
        ]}
      />
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const CalendarViewSwitcher: Story = {
  name: "Recipe: Calendar View Switcher",
  render: () => (
    <Controlled
      label="Calendar view"
      defaultValue="week"
      options={[
        { value: "week", label: "Week" },
        { value: "day", label: "Day" },
        { value: "month", label: "Month" },
      ]}
    />
  ),
};

export const CalendarResourceToggle: Story = {
  name: "Recipe: Calendar Resource Toggle",
  render: () => (
    <Controlled
      label="Calendar or Rooms view"
      defaultValue="calendar"
      options={[
        { value: "calendar", label: "Calendar", icon: <Icon as={CalendarOutlined} size="sm" /> },
        { value: "rooms", label: "Rooms", icon: <Icon as={AppstoreAddOutlined} size="sm" /> },
      ]}
    />
  ),
};

export const WaitlistStatusFilter: Story = {
  name: "Recipe: Waitlist Status Filter",
  render: () => (
    <Controlled
      label="Waitlist status"
      defaultValue="active"
      options={[
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "archived", label: "Archived" },
      ]}
    />
  ),
};
