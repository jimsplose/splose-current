import type { Meta, StoryObj } from "@storybook/react";
import { HomeOutlined } from "@ant-design/icons";
import Breadcrumbs from "../Breadcrumbs";
import Icon from "../Icon";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Horizontal path indicator for deep detail pages and nested workflows.",
      whatToUseInstead:
        "Raw AntD Breadcrumb imports with per-page separator hacks.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Breadcrumbs.md",
      source: "src/components/ds/Breadcrumbs.tsx",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: {
    items: [
      { label: "Clients", href: "/clients" },
      { label: "Harry Nguyen", href: "/clients/446604" },
      { label: "Notes" },
    ],
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const TwoLevel: Story = {
  name: "Feature: Two-level",
  args: {
    items: [
      { label: "Clients", href: "/clients" },
      { label: "Harry Nguyen" },
    ],
  },
};

export const ThreeLevel: Story = {
  name: "Feature: Three-level",
  args: {
    items: [
      { label: "Settings", href: "/settings" },
      { label: "Templates", href: "/settings/templates" },
      { label: "Emails" },
    ],
  },
};

export const FourLevel: Story = {
  name: "Feature: Four-level",
  args: {
    items: [
      { label: "Invoices", href: "/invoices" },
      { label: "Batch invoice", href: "/invoices/batch-invoice" },
      { label: "#330044", href: "/invoices/batch-invoice/330044" },
      { label: "Preview" },
    ],
  },
};

export const WithHomeIcon: Story = {
  name: "Feature: With Home Icon",
  args: {
    items: [
      { label: "Dashboard", href: "/", icon: <Icon as={HomeOutlined} size="xs" /> },
      { label: "Reports", href: "/reports" },
      { label: "Aged debtors" },
    ],
  },
};

export const Overflow: Story = {
  name: "Feature: Overflow (collapsed)",
  args: {
    maxItems: 4,
    items: [
      { label: "Home", href: "/" },
      { label: "Settings", href: "/settings" },
      { label: "Templates", href: "/settings/templates" },
      { label: "Emails", href: "/settings/templates/emails" },
      { label: "Reminder", href: "/settings/templates/emails/reminder" },
      { label: "Variants", href: "/settings/templates/emails/reminder/variants" },
      { label: "Edit" },
    ],
  },
};

export const AlternativeSeparator: Story = {
  name: "Feature: Alternative Separator",
  args: {
    separator: "/",
    items: [
      { label: "Clients", href: "/clients" },
      { label: "Harry Nguyen", href: "/clients/446604" },
      { label: "Notes" },
    ],
  },
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const SettingsDeepLink: Story = {
  name: "Recipe: Settings Deep Link",
  args: {
    items: [
      { label: "Settings", href: "/settings" },
      { label: "Templates", href: "/settings/templates" },
      { label: "Emails", href: "/settings/templates/emails" },
      { label: "New" },
    ],
  },
};

export const BatchInvoiceFlow: Story = {
  name: "Recipe: Batch Invoice Flow",
  args: {
    items: [
      { label: "Invoices", href: "/invoices" },
      { label: "Batch invoice", href: "/invoices/batch-invoice" },
      { label: "#330044", href: "/invoices/batch-invoice/330044" },
      { label: "Preview" },
    ],
  },
};

export const PatientHierarchy: Story = {
  name: "Recipe: Patient Hierarchy",
  args: {
    items: [
      { label: "Clients", href: "/clients" },
      { label: "Harry Nguyen", href: "/clients/446604" },
      { label: "Notes", href: "/clients/446604/notes" },
      { label: "Session 3 (Draft)" },
    ],
  },
};
