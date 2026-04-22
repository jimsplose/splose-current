import type { Meta, StoryObj } from "@storybook/react";
import {
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
  StopOutlined,
} from "@ant-design/icons";
import ContextMenu from "../ContextMenu";
import type { ContextMenuItem } from "../ContextMenu";

const meta: Meta<typeof ContextMenu> = {
  title: "Overlay/ContextMenu",
  component: ContextMenu,
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Right-click menu for contextual actions on calendar slots, DataTable rows, and notes.",
      whatToUseInstead:
        "No current equivalent — previously handled only by click-triggered Dropdown menus.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/ContextMenu.md",
      source: "src/components/ds/ContextMenu.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof ContextMenu>;

const targetStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 320,
  height: 100,
  border: "1px dashed var(--color-border, #e5e5e5)",
  borderRadius: 8,
  color: "var(--color-text-secondary, #6E6E64)",
  fontSize: 13,
  userSelect: "none",
};

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: {
    items: [
      { id: "edit", label: "Edit", icon: <EditOutlined />, onSelect: () => {} },
      { id: "duplicate", label: "Duplicate", icon: <CopyOutlined />, onSelect: () => {} },
      {
        id: "delete",
        label: "Delete",
        icon: <DeleteOutlined />,
        tone: "danger",
        onSelect: () => {},
      },
    ] satisfies ContextMenuItem[],
  },
  render: (args) => (
    <ContextMenu {...args}>
      <div style={targetStyle}>Right-click me</div>
    </ContextMenu>
  ),
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Basic: Story = {
  name: "Feature: Basic",
  render: () => (
    <ContextMenu
      items={[
        { id: "a", label: "Open", onSelect: () => {} },
        { id: "b", label: "Rename", onSelect: () => {} },
        { id: "c", label: "Delete", onSelect: () => {} },
      ]}
    >
      <div style={targetStyle}>Right-click me</div>
    </ContextMenu>
  ),
};

export const WithIcons: Story = {
  name: "Feature: With Icons",
  render: () => (
    <ContextMenu
      items={[
        { id: "edit", label: "Edit", icon: <EditOutlined />, onSelect: () => {} },
        { id: "duplicate", label: "Duplicate", icon: <CopyOutlined />, onSelect: () => {} },
        { id: "delete", label: "Delete", icon: <DeleteOutlined />, tone: "danger", onSelect: () => {} },
      ]}
    >
      <div style={targetStyle}>Right-click me</div>
    </ContextMenu>
  ),
};

export const WithShortcuts: Story = {
  name: "Feature: With Shortcuts",
  render: () => (
    <ContextMenu
      items={[
        { id: "edit", label: "Edit", icon: <EditOutlined />, shortcut: ["⌘", "E"], onSelect: () => {} },
        { id: "duplicate", label: "Duplicate", icon: <CopyOutlined />, shortcut: ["⌘", "D"], onSelect: () => {} },
        { id: "delete", label: "Delete", icon: <DeleteOutlined />, shortcut: ["⌫"], tone: "danger", onSelect: () => {} },
      ]}
    >
      <div style={targetStyle}>Right-click me (with shortcuts)</div>
    </ContextMenu>
  ),
};

export const WithDanger: Story = {
  name: "Feature: With Danger",
  render: () => (
    <ContextMenu
      items={[
        { id: "open", label: "Open", onSelect: () => {} },
        { id: "duplicate", label: "Duplicate", divider: true, onSelect: () => {} },
        { id: "archive", label: "Archive", tone: "danger", onSelect: () => {} },
        { id: "delete", label: "Delete", tone: "danger", onSelect: () => {} },
      ]}
    >
      <div style={targetStyle}>Right-click me (danger)</div>
    </ContextMenu>
  ),
};

export const WithSubmenu: Story = {
  name: "Feature: With Submenu",
  render: () => (
    <ContextMenu
      items={[
        { id: "open", label: "Open", onSelect: () => {} },
        {
          id: "move",
          label: "Move to…",
          submenu: [
            { id: "m1", label: "Inbox", onSelect: () => {} },
            { id: "m2", label: "Archive", onSelect: () => {} },
            { id: "m3", label: "Trash", onSelect: () => {} },
          ],
        },
      ]}
    >
      <div style={targetStyle}>Right-click me (submenu)</div>
    </ContextMenu>
  ),
};

export const Disabled: Story = {
  name: "Feature: Disabled item",
  render: () => (
    <ContextMenu
      items={[
        { id: "a", label: "Open", onSelect: () => {} },
        { id: "b", label: "Edit (disabled)", disabled: true, onSelect: () => {} },
        { id: "c", label: "Delete", tone: "danger", onSelect: () => {} },
      ]}
    >
      <div style={targetStyle}>Right-click me</div>
    </ContextMenu>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const CalendarSlotContextMenu: Story = {
  name: "Recipe: Calendar Slot",
  render: () => (
    <ContextMenu
      items={[
        { id: "appt", label: "New appointment", icon: <PlusOutlined />, onSelect: () => {} },
        { id: "busy", label: "New busy time", icon: <StopOutlined />, onSelect: () => {} },
        { id: "support", label: "New support activity", icon: <CalendarOutlined />, onSelect: () => {} },
      ]}
    >
      <div
        style={{
          ...targetStyle,
          background:
            "repeating-linear-gradient(135deg, #f9f9f9, #f9f9f9 10px, #f2f2f2 10px, #f2f2f2 20px)",
        }}
      >
        Calendar slot — right-click to create
      </div>
    </ContextMenu>
  ),
};

export const CalendarAppointmentContextMenu: Story = {
  name: "Recipe: Calendar Appointment",
  render: () => (
    <ContextMenu
      items={[
        { id: "edit", label: "Edit", icon: <EditOutlined />, onSelect: () => {} },
        { id: "duplicate", label: "Duplicate", icon: <CopyOutlined />, divider: true, onSelect: () => {} },
        { id: "reschedule", label: "Reschedule…", onSelect: () => {} },
        { id: "cancel", label: "Cancel appointment", tone: "danger", onSelect: () => {} },
      ]}
    >
      <div
        style={{
          ...targetStyle,
          background: "#5578FF",
          color: "#fff",
          fontWeight: 500,
        }}
      >
        10:00 — Harry Nguyen
      </div>
    </ContextMenu>
  ),
};

export const DataTableRowContextMenu: Story = {
  name: "Recipe: DataTable Row",
  render: () => (
    <ContextMenu
      items={[
        { id: "view", label: "View", onSelect: () => {} },
        { id: "edit", label: "Edit", icon: <EditOutlined />, onSelect: () => {} },
        { id: "invoices", label: "View invoices", divider: true, onSelect: () => {} },
        { id: "archive", label: "Archive", tone: "danger", onSelect: () => {} },
      ]}
    >
      <div style={{ ...targetStyle, textAlign: "left", justifyContent: "flex-start", paddingLeft: 16 }}>
        Harry Nguyen · 0412 345 678 · #446604
      </div>
    </ContextMenu>
  ),
};
