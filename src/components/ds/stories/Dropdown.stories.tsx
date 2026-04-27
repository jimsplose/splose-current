import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import Dropdown, { DropdownTriggerButton } from "../Dropdown";
import type { DropdownItem } from "../Dropdown";
import { Button } from "antd";

const meta: Meta<typeof Dropdown> = {
  title: "Overlays/Dropdown",
  component: Dropdown,
  tags: ["extended"],
  argTypes: {
    align: {
      control: "radio",
      options: ["left", "right"],
    },
  },
  parameters: {
    appPages: [
      {
        label: "Client forms (row actions menu)",
        vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h/forms",
        production: "https://acme.splose.com/patients/446604/forms",
      },
      {
        label: "Settings: Online bookings (overflow menu)",
        vercel: "https://splose-current.vercel.app/settings/online-bookings",
        production: "https://acme.splose.com/settings/online-bookings",
      },
      {
        label: "Settings: Forms list (row actions)",
        vercel: "https://splose-current.vercel.app/settings/forms",
        production: "https://acme.splose.com/settings/forms",
      },
      {
        label: "Settings: Data export (action menu)",
        vercel: "https://splose-current.vercel.app/settings/data-export",
        production: "https://acme.splose.com/settings/data-export",
      },
    ],
    referenceUrl: "https://ant.design/components/dropdown",
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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
      <button style={{ borderRadius: 6, border: '1px solid var(--color-border)', backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, fontSize: 12, fontWeight: 500, borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
        Calendar <span style={{ color: 'var(--color-text-secondary)' }}>&#9662;</span>
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderRadius: 4, border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: 12 }}>
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
