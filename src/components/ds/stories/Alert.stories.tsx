import type { Meta, StoryObj } from "@storybook/react";
import { AlertTriangle, Info, CheckCircle, XCircle, Zap } from "lucide-react";
import Alert from "../Alert";
import Badge from "../Badge";
import Button from "../Button";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "success", "error"],
      description: "Visual style / severity of the alert",
    },
    icon: {
      control: false,
      description: "Optional icon element shown at the start",
    },
    children: {
      control: "text",
      description: "Alert message content",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    variant: "info",
    icon: <Info className="h-4 w-4" />,
    children: "This is an informational alert. Change the variant and content using the controls.",
  },
  decorators: [(Story) => <div className="w-[480px]">{Story()}</div>],
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const InfoAlert: Story = {
  args: {
    variant: "info",
    icon: <Info className="h-4 w-4" />,
    children: "Client won't be notified of changes.",
  },
  decorators: [(Story) => <div className="w-[480px]">{Story()}</div>],
};

export const WarningAlert: Story = {
  args: {
    variant: "warning",
    icon: <AlertTriangle className="h-4 w-4" />,
    children: "This appointment is in the past.",
  },
  decorators: [(Story) => <div className="w-[480px]">{Story()}</div>],
};

export const SuccessAlert: Story = {
  args: {
    variant: "success",
    icon: <CheckCircle className="h-4 w-4" />,
    children: "Changes saved successfully.",
  },
  decorators: [(Story) => <div className="w-[480px]">{Story()}</div>],
};

export const ErrorAlert: Story = {
  args: {
    variant: "error",
    icon: <XCircle className="h-4 w-4" />,
    children: "Failed to save changes. Please try again.",
  },
  decorators: [(Story) => <div className="w-[480px]">{Story()}</div>],
};

export const WithoutIcon: Story = {
  args: {
    variant: "info",
    children: "This alert has no icon, just text content.",
  },
  decorators: [(Story) => <div className="w-[480px]">{Story()}</div>],
};

/* ------------------------------------------------------------------ */
/*  All Variants stacked                                               */
/* ------------------------------------------------------------------ */

export const AllVariants: Story = {
  render: () => (
    <div className="w-[480px] space-y-3">
      <Alert variant="info" icon={<Info className="h-4 w-4" />}>
        Informational message — neutral context or guidance.
      </Alert>
      <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
        Warning message — action may have unintended consequences.
      </Alert>
      <Alert variant="success" icon={<CheckCircle className="h-4 w-4" />}>
        Success message — operation completed as expected.
      </Alert>
      <Alert variant="error" icon={<XCircle className="h-4 w-4" />}>
        Error message — something went wrong and needs attention.
      </Alert>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  PastDateWarning                                                    */
/*  Pattern: Warning alert inside the create appointment modal         */
/*  Source: /calendar CalendarView — past date check                   */
/* ------------------------------------------------------------------ */

export const PastDateWarning: Story = {
  render: () => (
    <div className="w-[480px]">
      <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4 text-yellow-600" />}>
        This appointment is in the past. Are you sure you want to create it?
      </Alert>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  StripeConnectionBanner                                             */
/*  Pattern: Info alert used in invoice/payment settings               */
/*  Source: /settings/invoice-settings — Stripe connection status      */
/* ------------------------------------------------------------------ */

export const StripeConnectionBanner: Story = {
  render: () => (
    <div className="w-[560px]">
      <Alert variant="info" icon={<Info className="h-4 w-4 text-blue-600" />}>
        <div className="flex items-center justify-between">
          <span className="text-body-md">
            Connect your Stripe account to accept online payments from clients.
          </span>
          <Button variant="primary" size="sm" className="ml-4 shrink-0">
            Connect Stripe
          </Button>
        </div>
      </Alert>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  BetaFeatureBanner                                                  */
/*  Pattern: Warning alert with badge for beta/experimental features   */
/*  Source: /settings/ai — AI blocks beta banner                       */
/* ------------------------------------------------------------------ */

export const BetaFeatureBanner: Story = {
  render: () => (
    <div className="w-[560px]">
      <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="yellow">BETA</Badge>
            <span className="text-body-md text-text">We need your feedback on AI blocks</span>
          </div>
          <Button variant="link" size="sm" className="shrink-0">
            <Zap className="h-3.5 w-3.5" />
            Give feedback
          </Button>
        </div>
      </Alert>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  EditModalInfoBanner                                                */
/*  Pattern: Info alert at top of edit appointment modal               */
/*  Source: /calendar CalendarView — edit appointment modal             */
/* ------------------------------------------------------------------ */

export const EditModalInfoBanner: Story = {
  render: () => (
    <div className="w-[480px]">
      <Alert variant="info" icon={<Info className="h-4 w-4 text-blue-600" />}>
        Client won&apos;t be notified of changes. To do this, use Reschedule.
      </Alert>
    </div>
  ),
  parameters: { layout: "padded" },
};
