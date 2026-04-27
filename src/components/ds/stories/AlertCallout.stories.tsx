import type { Meta, StoryObj } from "@storybook/react";
import AlertCallout from "../AlertCallout";
import Text from "../Text";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof AlertCallout> = {
  title: "Feedback/AlertCallout",
  component: AlertCallout,
  tags: ["custom"],
  argTypes: {
    variant: {
      control: "select",
      options: ["warning", "danger", "info"],
      description: "Colour of the left stripe",
    },
    children: {
      control: "text",
      description: "Callout content",
    },
  },
  parameters: {
    layout: "padded",
    appPages: [
      {
        label: "Client detail",
        vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h",
        production: "https://acme.splose.com/patients/446604/details",
      },
    ],
    referenceUrl: null,
  },
};

export default meta;
type Story = StoryObj<typeof AlertCallout>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: {
    variant: "warning",
    children: (
      <Text variant="body/md" as="span">
        Include KM
      </Text>
    ),
  },
  decorators: [(Story) => <div style={{ width: 360 }}>{Story()}</div>],
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Warning: Story = {
  args: {
    variant: "warning",
    children: (
      <Text variant="body/md" as="span">
        Include KM
      </Text>
    ),
  },
  decorators: [(Story) => <div style={{ width: 360 }}>{Story()}</div>],
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: (
      <Text variant="body/md" as="span">
        This client has overdue invoices.
      </Text>
    ),
  },
  decorators: [(Story) => <div style={{ width: 360 }}>{Story()}</div>],
};

export const Info: Story = {
  args: {
    variant: "info",
    children: (
      <Text variant="body/md" as="span">
        New funding rules apply from July.
      </Text>
    ),
  },
  decorators: [(Story) => <div style={{ width: 360 }}>{Story()}</div>],
};

/* ------------------------------------------------------------------ */
/*  All Variants stacked                                               */
/* ------------------------------------------------------------------ */

export const AllVariants: Story = {
  render: () => (
    <div style={{ width: 360, display: "flex", flexDirection: "column", gap: 12 }}>
      <AlertCallout variant="warning">
        <Text variant="body/md" as="span">
          Include KM
        </Text>
      </AlertCallout>
      <AlertCallout variant="danger">
        <Text variant="body/md" as="span">
          This client has overdue invoices.
        </Text>
      </AlertCallout>
      <AlertCallout variant="info">
        <Text variant="body/md" as="span">
          New funding rules apply from July.
        </Text>
      </AlertCallout>
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  ClientAlertsCallout                                                */
/*  Pattern: Warning callout in Client alerts sidebar section          */
/*  Source: /clients/[id] ClientDetailClient — Client alerts           */
/* ------------------------------------------------------------------ */

export const ClientAlertsCallout: Story = {
  render: () => (
    <div style={{ width: 300 }}>
      <AlertCallout variant="warning">
        <Text variant="body/md" as="span">
          Include KM
        </Text>
      </AlertCallout>
    </div>
  ),
};
