import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { alertDialog } from "../AlertDialog";
import { Button } from "antd";

const meta: Meta = {
  title: "Overlays/AlertDialog",
  tags: ["extended"],
  parameters: {
    layout: "padded",
    // No direct call sites found yet (alertDialog.confirm not used in src/app/).
    appPages: [],
    referenceUrl: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
    splose: {
      status: "beta",
      summary:
        "Imperative confirmation overlay for destructive or consequential actions.",
      whatToUseInstead:
        "AntD Modal.confirm() calls and ad-hoc confirmation modals inline in components.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/AlertDialog.md",
      source: "src/components/ds/AlertDialog.tsx",
    },
  },
};
export default meta;
type Story = StoryObj;

function useLastResult() {
  const [log, setLog] = useState<string>("—");
  return { log, setLog };
}

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  render: () => {
    const { log, setLog } = useLastResult();
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Button
          variant="primary"
          onClick={async () => {
            const ok = await alertDialog.confirm({
              title: "Confirm action?",
              description: "Short description about what happens next.",
            });
            setLog(ok ? "Confirmed" : "Cancelled");
          }}
        >
          Open confirm
        </Button>
        <div style={{ fontSize: 12, color: "#6E6E64" }}>Last result: {log}</div>
      </div>
    );
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const Primary: Story = {
  name: "Feature: Primary tone",
  render: () => (
    <Button
      onClick={() =>
        alertDialog.confirm({
          title: "Send note to patient?",
          description: "The patient will receive a copy immediately.",
          confirmLabel: "Send",
          tone: "primary",
        })
      }
    >
      Primary confirm
    </Button>
  ),
};

export const Danger: Story = {
  name: "Feature: Danger tone",
  render: () => (
    <Button
      variant="danger"
      onClick={() =>
        alertDialog.confirm({
          title: "Delete Harry Nguyen?",
          description:
            "This client and their notes, invoices, and files will be permanently deleted. This can't be undone.",
          confirmLabel: "Delete",
          tone: "danger",
        })
      }
    >
      Delete client…
    </Button>
  ),
};

export const Warning: Story = {
  name: "Feature: Warning tone",
  render: () => (
    <Button
      onClick={() =>
        alertDialog.confirm({
          title: "Backup is overdue",
          description: "Continue without a fresh backup?",
          confirmLabel: "Continue anyway",
          tone: "warning",
        })
      }
    >
      Warning confirm
    </Button>
  ),
};

export const LongDescription: Story = {
  name: "Feature: Long Description",
  render: () => (
    <Button
      onClick={() =>
        alertDialog.confirm({
          title: "Archive 124 invoices?",
          description:
            "Archiving will remove these invoices from the main list. They stay accessible under Settings > Archived invoices and can be restored at any time. Archived invoices no longer count toward monthly reporting totals. Recurring invoices attached to these records will pause until the archive is reverted.",
          confirmLabel: "Archive",
          tone: "warning",
        })
      }
    >
      Archive 124 invoices…
    </Button>
  ),
};

export const Imperative: Story = {
  name: "Feature: Imperative (awaited)",
  render: () => {
    const { log, setLog } = useLastResult();
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Button
          onClick={async () => {
            const ok = await alertDialog.confirm({
              title: "Delete service?",
              description: "This service will be removed from all price lists.",
              confirmLabel: "Delete",
              tone: "danger",
            });
            setLog(ok ? "Service deleted" : "Delete cancelled");
          }}
        >
          Delete service
        </Button>
        <div style={{ fontSize: 12, color: "#6E6E64" }}>Last result: {log}</div>
      </div>
    );
  },
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const DeleteClient: Story = {
  name: "Recipe: Delete client",
  render: () => (
    <Button
      variant="danger"
      onClick={() =>
        alertDialog.confirm({
          title: "Delete Harry Nguyen?",
          description:
            "This client, their appointments, notes, and invoices will be permanently deleted.",
          confirmLabel: "Delete",
          tone: "danger",
        })
      }
    >
      Delete client
    </Button>
  ),
};

export const CancelInvoice: Story = {
  name: "Recipe: Cancel invoice",
  render: () => (
    <Button
      onClick={() =>
        alertDialog.confirm({
          title: "Cancel invoice INV-14130707?",
          description: "The client will be notified and the invoice marked void.",
          confirmLabel: "Cancel invoice",
          cancelLabel: "Keep open",
          tone: "warning",
        })
      }
    >
      Cancel invoice
    </Button>
  ),
};

export const DiscardChanges: Story = {
  name: "Recipe: Discard unsaved changes",
  render: () => (
    <Button
      onClick={() =>
        alertDialog.confirm({
          title: "Discard unsaved changes?",
          description: "You have unsaved edits to this note.",
          confirmLabel: "Discard",
          cancelLabel: "Keep editing",
          tone: "danger",
        })
      }
    >
      Leave editor
    </Button>
  ),
};
