import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import PageHeader from "../PageHeader";
import Button from "../Button";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof PageHeader> = {
  title: "Layout/PageHeader",
  component: PageHeader,
  argTypes: {
    title: {
      control: "text",
      description: "Page title shown as an h1",
    },
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    title: "Page title",
    children: <Button variant="primary">Action</Button>,
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: { title: "Clients" },
};

export const WithActions: Story = {
  render: () => (
    <PageHeader title="Invoices">
      <Button variant="secondary">Export</Button>
      <Button variant="primary">
        <Plus className="h-4 w-4" />
        New Invoice
      </Button>
    </PageHeader>
  ),
};

export const WithMultipleActions: Story = {
  render: () => (
    <PageHeader title="Online booking settings">
      <Button variant="secondary">Show archived</Button>
      <Button variant="primary">+ New booking page</Button>
    </PageHeader>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  ClientsPageHeader                                                  */
/*  Pattern: Title + single primary "New client" button                */
/*  Source: /clients ClientsPageClient                                 */
/* ------------------------------------------------------------------ */

export const ClientsPageHeader: Story = {
  render: () => (
    <PageHeader title="Clients">
      <Button>
        <Plus className="h-4 w-4" />
        New client
      </Button>
    </PageHeader>
  ),
};

/* ------------------------------------------------------------------ */
/*  InvoicesPageHeader                                                 */
/*  Pattern: Title + Batch invoice (secondary) + New invoice           */
/*  Source: /invoices page                                             */
/* ------------------------------------------------------------------ */

export const InvoicesPageHeader: Story = {
  render: () => (
    <PageHeader title="Invoices">
      <Button variant="secondary">Batch invoice</Button>
      <Button variant="secondary">
        <Plus className="h-4 w-4" />
        New invoice
      </Button>
    </PageHeader>
  ),
};

/* ------------------------------------------------------------------ */
/*  SettingsPageHeader                                                 */
/*  Pattern: Title + Save button on a settings form page               */
/*  Source: /settings/online-bookings page                             */
/* ------------------------------------------------------------------ */

export const SettingsPageHeader: Story = {
  render: () => (
    <PageHeader title="Online booking settings">
      <Button variant="secondary">Show archived</Button>
      <Button variant="primary">+ New booking page</Button>
    </PageHeader>
  ),
};
