import type { Meta, StoryObj } from "@storybook/react";
import { Toaster, toast } from "../Toast";
import { Button } from "antd";

const meta: Meta = {
  title: "Feedback/Toast",
  tags: ["extended"],
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <Toaster />
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "padded",
    appPages: [
      {
        label: "Invoice detail",
        vercel: "https://splose-current.vercel.app/invoices/1",
        localhost: "http://localhost:3000/invoices/1",
        production: "https://acme.splose.com/invoices/1/view",
      },
      {
        label: "Reports — Performance",
        vercel: "https://splose-current.vercel.app/reports/performance",
        localhost: "http://localhost:3000/reports/performance",
        production: "https://acme.splose.com/reports/performance",
      },
    ],
    referenceUrl: "https://sonner.emilkowal.ski",
    splose: {
      status: "beta",
      summary:
        "Short, auto-dismissing notification pinned to the bottom-right for success/error confirmations.",
      whatToUseInstead:
        "AntD message.success / notification.info calls scattered across pages.",
      referenceLibrary: "sonner",
      plan: "docs/ds-plans/Toast.md",
      source: "src/components/ds/Toast.tsx",
    },
  },
};
export default meta;
type Story = StoryObj;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button onClick={() => toast("Playground toast")}>Default</Button>
      <Button
        onClick={() =>
          toast("With description", {
            description: "This is a secondary line of context.",
          })
        }
      >
        With description
      </Button>
      <Button
        onClick={() =>
          toast("Pinned toast", { duration: Infinity, id: "pinned" })
        }
      >
        Pinned (dedupe id)
      </Button>
      <Button onClick={() => toast.dismiss()}>Dismiss all</Button>
    </div>
  ),
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Success: Story = {
  name: "Feature: Success",
  render: () => (
    <Button onClick={() => toast.success("Invoice saved")}>
      Fire success toast
    </Button>
  ),
};

export const Error: Story = {
  name: "Feature: Error",
  render: () => (
    <Button
      variant="danger"
      onClick={() =>
        toast.error("Couldn't reach Stripe", {
          description: "Retrying in 5 seconds.",
          duration: 6000,
        })
      }
    >
      Fire error toast
    </Button>
  ),
};

export const Warning: Story = {
  name: "Feature: Warning",
  render: () => (
    <Button
      onClick={() =>
        toast.warning("Backup is overdue", {
          description: "Last successful run: 48h ago.",
        })
      }
    >
      Fire warning toast
    </Button>
  ),
};

export const Info: Story = {
  name: "Feature: Info",
  render: () => (
    <Button onClick={() => toast.info("Preview generated")}>
      Fire info toast
    </Button>
  ),
};

export const Loading: Story = {
  name: "Feature: Loading",
  render: () => (
    <Button
      onClick={() =>
        toast.loading("Saving invoice...", { id: "loading-demo" })
      }
    >
      Fire loading toast
    </Button>
  ),
};

export const WithAction: Story = {
  name: "Feature: With Action",
  render: () => (
    <Button
      onClick={() =>
        toast("Client archived", {
          action: {
            label: "Undo",
            onClick: () => toast.success("Archive reverted"),
          },
        })
      }
    >
      Archive client
    </Button>
  ),
};

export const Promise: Story = {
  name: "Feature: Promise",
  render: () => (
    <Button
      onClick={() =>
        toast.promise(
          new Promise<{ id: string }>((resolve) =>
            setTimeout(() => resolve({ id: "INV-0123" }), 1500),
          ),
          {
            loading: "Saving invoice...",
            success: (data) => `Invoice ${data.id} saved`,
            error: (err: Error) => `Couldn't save: ${err.message}`,
          },
        )
      }
    >
      Save invoice (promise)
    </Button>
  ),
};

export const Dedupe: Story = {
  name: "Feature: Dedupe (same id)",
  render: () => (
    <Button
      onClick={() => {
        toast("Only one shows", { id: "dedupe-key" });
        toast("Only one shows", { id: "dedupe-key" });
        toast("Only one shows", { id: "dedupe-key" });
      }}
    >
      Fire 3× same id
    </Button>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const SaveConfirmation: Story = {
  name: "Recipe: Save Confirmation",
  render: () => (
    <Button
      variant="primary"
      onClick={() => toast.success("Settings saved")}
    >
      Save settings
    </Button>
  ),
};

export const FailedActionWithRetry: Story = {
  name: "Recipe: Failed Action with Retry",
  render: () => (
    <Button
      variant="primary"
      onClick={() =>
        toast.error("Couldn't save invoice", {
          description: "Network request failed.",
          duration: 10000,
          action: {
            label: "Retry",
            onClick: () => toast.success("Invoice saved on retry"),
          },
        })
      }
    >
      Save invoice (will fail)
    </Button>
  ),
};
