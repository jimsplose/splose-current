import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Dropdown, { DropdownTriggerButton } from "../Dropdown";
import type { DropdownItem } from "../Dropdown";
import Button from "../Button";

const meta: Meta<typeof Dropdown> = {
  title: "Overlays/Dropdown",
  component: Dropdown,
  argTypes: {
    align: {
      control: "radio",
      options: ["left", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

const playgroundItems: DropdownItem[] = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Change log", value: "change-log" },
  { label: "", value: "divider-1", divider: true },
  { label: "Archive", value: "archive", danger: true },
];

export const Playground: Story = {
  args: {
    trigger: <Button variant="secondary">Actions</Button>,
    items: playgroundItems,
    align: "left",
    onSelect: fn(),
  },
};

// ---------------------------------------------------------------------------
// Feature stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    trigger: <Button variant="secondary">Actions</Button>,
    items: [
      { label: "Edit", value: "edit" },
      { label: "Duplicate", value: "duplicate" },
    ],
    onSelect: fn(),
  },
};

export const AlignRight: Story = {
  args: {
    trigger: <Button variant="secondary">Menu</Button>,
    items: [
      { label: "View", value: "view" },
      { label: "Edit", value: "edit" },
    ],
    align: "right",
    onSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex justify-end">
        <Story />
      </div>
    ),
  ],
};

export const WithDangerItem: Story = {
  args: {
    trigger: <Button variant="secondary">Manage</Button>,
    items: [
      { label: "Edit", value: "edit" },
      { label: "Duplicate", value: "duplicate" },
      { label: "", value: "divider-1", divider: true },
      { label: "Delete", value: "delete", danger: true },
    ],
    onSelect: fn(),
  },
};

export const WithDivider: Story = {
  args: {
    trigger: <Button variant="secondary">Options</Button>,
    items: [
      { label: "Edit", value: "edit" },
      { label: "Duplicate", value: "duplicate" },
      { label: "Enable online booking", value: "online-booking" },
      { label: "Change log", value: "change-log" },
      { label: "", value: "divider-1", divider: true },
      { label: "Archive", value: "archive", danger: true },
    ],
    onSelect: fn(),
  },
};

export const CustomTrigger: Story = {
  args: {
    trigger: (
      <button className="rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-text hover:bg-gray-50">
        Calendar <span className="text-text-secondary">&#9662;</span>
      </button>
    ),
    items: [
      { label: "Calendar", value: "Calendar" },
      { label: "Rooms/resources", value: "Rooms/resources" },
    ],
    align: "right",
    onSelect: fn(),
  },
};

// ---------------------------------------------------------------------------
// Recipes — real patterns from the codebase
// ---------------------------------------------------------------------------

/**
 * Settings pages (services, email templates, appointment templates, etc.)
 * use Edit / Duplicate / Change log / --- / Archive.
 * Matches `STANDARD_SETTINGS` from `src/lib/dropdown-presets.ts`.
 */
export const SettingsActionsMenu: Story = {
  name: "Recipe: Settings Actions Menu",
  args: {
    trigger: <DropdownTriggerButton />,
    align: "right",
    items: [
      { label: "Edit", value: "edit" },
      { label: "Duplicate", value: "duplicate" },
      { label: "Change log", value: "change-log" },
      { label: "", value: "divider-1", divider: true },
      { label: "Archive", value: "archive", danger: true },
    ],
    onSelect: fn(),
  },
};

/**
 * Users page shows admin actions: Deactivate / Reset password / Log out / Change log.
 * Matches `USER_ADMIN` from `src/lib/dropdown-presets.ts`.
 */
export const UserActionsMenu: Story = {
  name: "Recipe: User Actions Menu",
  args: {
    trigger: <DropdownTriggerButton />,
    align: "right",
    items: [
      { label: "Deactivate", value: "deactivate", danger: true },
      { label: "Reset password", value: "reset-password" },
      { label: "Log out everywhere", value: "logout-everywhere" },
      { label: "Change log", value: "change-log" },
    ],
    onSelect: fn(),
  },
};

/**
 * Invoice row actions — Edit / Duplicate / Send / --- / Archive.
 * Hypothetical but follows the established settings pattern.
 */
export const InvoiceActionsMenu: Story = {
  name: "Recipe: Invoice Actions Menu",
  args: {
    trigger: <DropdownTriggerButton />,
    align: "right",
    items: [
      { label: "Edit", value: "edit" },
      { label: "Duplicate", value: "duplicate" },
      { label: "Send", value: "send" },
      { label: "", value: "divider-1", divider: true },
      { label: "Archive", value: "archive", danger: true },
    ],
    onSelect: fn(),
  },
};

/**
 * The "..." trigger in table rows — the most common pattern in the app.
 * Used on products, services, busy-times, rooms, tax-rates, and more.
 * The DropdownTriggerButton renders a MoreHorizontal icon.
 */
export const TableRowActions: Story = {
  name: "Recipe: Table Row Actions",
  render: () => (
    <div className="flex items-center justify-end rounded border border-border bg-white p-3">
      <Dropdown
        trigger={<DropdownTriggerButton />}
        align="right"
        items={[
          { label: "Edit", value: "edit" },
          { label: "Duplicate", value: "duplicate" },
          { label: "", value: "divider-1", divider: true },
          { label: "Archive", value: "archive", danger: true },
        ]}
        onSelect={() => {}}
      />
    </div>
  ),
};
