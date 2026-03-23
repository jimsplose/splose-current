import type { Meta, StoryObj } from "@storybook/react";
import Collapse from "../Collapse";
import Badge from "../Badge";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Collapse> = {
  title: "Layout/Collapse",
  component: Collapse,
  argTypes: {
    title: {
      control: "text",
      description: "Section heading displayed in the clickable bar",
    },
    defaultOpen: {
      control: "boolean",
      description: "Whether the section starts expanded",
    },
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Collapse>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    title: "Section title",
    defaultOpen: false,
    children: (
      <p className="text-body-md text-text-secondary">
        Content that is revealed when the section is expanded.
      </p>
    ),
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Default: Story = {
  args: {
    title: "Client alerts",
    children: <p className="text-body-md text-text-secondary">No alerts configured.</p>,
  },
};

export const InitiallyOpen: Story = {
  args: {
    title: "Stripe integration",
    defaultOpen: true,
    children: <p className="text-body-md text-text-secondary">Connected to Stripe account.</p>,
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="w-[400px]">
      <Collapse title="General" defaultOpen>
        <p className="text-body-md text-text-secondary">General settings content.</p>
      </Collapse>
      <Collapse title="Pricing" defaultOpen>
        <p className="text-body-md text-text-secondary">Pricing configuration.</p>
      </Collapse>
      <Collapse title="Online booking">
        <p className="text-body-md text-text-secondary">Online booking options.</p>
      </Collapse>
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  ClientSidebarSections                                              */
/*  Pattern: Client detail sidebar with alerts, integrations, etc.     */
/*  Source: /clients/[id] ClientDetailClient sidebar                   */
/* ------------------------------------------------------------------ */

export const ClientSidebarSections: Story = {
  render: () => (
    <aside className="w-[320px] space-y-0 rounded-lg border border-border bg-white p-4">
      <Collapse title="Client alerts" defaultOpen>
        <span className="text-body-md text-text">Include KM</span>
      </Collapse>

      <Collapse title="Stripe" defaultOpen>
        <p className="text-body-sm text-text-secondary">
          Connect with Stripe and save a credit card for clients and use for future use.
        </p>
      </Collapse>

      <Collapse title="Mailchimp" defaultOpen>
        <div className="space-y-1 text-body-sm">
          <div className="flex items-center gap-1">
            <span className="text-primary">rakesh.splose@gmail.com</span>
            <Badge variant="orange" className="text-caption-sm">ARCHIVED</Badge>
          </div>
        </div>
      </Collapse>

      <Collapse title="QuickBooks">
        <p className="text-body-sm text-text-secondary">No QuickBooks connection.</p>
      </Collapse>
    </aside>
  ),
};
