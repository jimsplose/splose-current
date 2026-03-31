import type { Meta, StoryObj } from "@storybook/react";
import Badge, { statusVariant } from "../Badge";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Badge> = {
  title: "Data Display/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["green", "red", "blue", "yellow", "orange", "gray", "purple"],
      description: "Color variant of the badge",
    },
    children: {
      control: "text",
      description: "Badge label text",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

/** All controls wired — use this to experiment with every prop. */
export const Playground: Story = {
  args: {
    variant: "green",
    children: "Active",
  },
};

/* ================================================================== */
/*  2. FEATURE STORIES — one per variant                               */
/* ================================================================== */

export const Green: Story = {
  args: { variant: "green", children: "Active" },
};

export const Red: Story = {
  args: { variant: "red", children: "Overdue" },
};

export const Blue: Story = {
  args: { variant: "blue", children: "Draft" },
};

export const Yellow: Story = {
  args: { variant: "yellow", children: "Pending" },
};

export const Orange: Story = {
  args: { variant: "orange", children: "Archived" },
};

export const Gray: Story = {
  args: { variant: "gray", children: "Unknown" },
};

export const Purple: Story = {
  args: { variant: "purple", children: "Premium" },
};

/* ------------------------------------------------------------------ */
/*  All Variants side-by-side                                          */
/* ------------------------------------------------------------------ */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      <Badge variant="green">Active</Badge>
      <Badge variant="red">Overdue</Badge>
      <Badge variant="blue">Draft</Badge>
      <Badge variant="yellow">Pending</Badge>
      <Badge variant="orange">Archived</Badge>
      <Badge variant="gray">Unknown</Badge>
      <Badge variant="purple">Premium</Badge>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  StatusVariantHelper                                                */
/*  Demonstrates the statusVariant() utility that maps status strings  */
/*  to the correct color variant automatically.                        */
/* ------------------------------------------------------------------ */

export const StatusVariantHelper: Story = {
  render: () => {
    const statuses = [
      "Active", "Paid", "Delivered", "Final", "Completed", "Upcoming", "Scheduled", "In progress",
      "Draft", "Sent",
      "Outstanding", "Pending", "No Show",
      "Overdue", "Failed", "Cancelled", "Expired",
      "Archived",
      "Do not invoice",
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p className="text-label-lg text-text-secondary">
          <code>statusVariant(status)</code> maps status strings to badge colors:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          {statuses.map((s) => (
            <Badge key={s} variant={statusVariant(s)}>
              {s}
            </Badge>
          ))}
        </div>
      </div>
    );
  },
  parameters: { layout: "padded" },
};

/* ================================================================== */
/*  3. RECIPE STORIES — real patterns from the Splose codebase         */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  InvoiceStatusRow                                                   */
/*  Pattern: Status badges in an invoice list table row                */
/*  Source: /invoices page — Paid/Overdue/Draft/Sent statuses          */
/* ------------------------------------------------------------------ */

export const InvoiceStatusRow: Story = {
  render: () => (
    <div style={{ width: 600 }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr className="border-border bg-table-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Invoice</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Client</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right' }}>Amount</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Status</th>
            <th className="text-label-lg text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left' }}>Delivery</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr >
            <td className="text-body-md text-primary" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>INV-006312</td>
            <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Sarah Mitchell</td>
            <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right' }}>$185.00</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Paid")}>Paid</Badge></td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Sent")}>Sent</Badge></td>
          </tr>
          <tr >
            <td className="text-body-md text-primary" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>INV-006311</td>
            <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>James Park</td>
            <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right' }}>$95.50</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Overdue")}>Overdue</Badge></td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Sent")}>Sent</Badge></td>
          </tr>
          <tr >
            <td className="text-body-md text-primary" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>INV-006310</td>
            <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Lisa Wang</td>
            <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right' }}>$220.00</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Draft")}>Draft</Badge></td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }} />
          </tr>
          <tr >
            <td className="text-body-md text-primary" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>INV-006309</td>
            <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>Mark Thompson</td>
            <td className="text-body-md text-text" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right' }}>$150.00</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Outstanding")}>Outstanding</Badge></td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Sent")}>Sent</Badge></td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  AppointmentBadges                                                  */
/*  Pattern: Appointment status badges as seen in calendar/client tabs */
/*  Source: /calendar, /clients/[id]/appointments                      */
/* ------------------------------------------------------------------ */

export const AppointmentBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p className="text-label-lg text-text-secondary">Appointment status badges:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <Badge variant={statusVariant("Scheduled")}>Scheduled</Badge>
        <Badge variant={statusVariant("Completed")}>Completed</Badge>
        <Badge variant={statusVariant("Cancelled")}>Cancelled</Badge>
        <Badge variant={statusVariant("No Show")}>No Show</Badge>
        <Badge variant={statusVariant("In progress")}>In progress</Badge>
      </div>
      <p className="text-label-lg text-text-secondary" style={{ marginTop: 24 }}>Note/progress note status badges:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <Badge variant={statusVariant("Draft")}>Draft</Badge>
        <Badge variant={statusVariant("Final")}>Final</Badge>
        <Badge variant={statusVariant("Delivered")}>Delivered</Badge>
      </div>
      <p className="text-label-lg text-text-secondary" style={{ marginTop: 24 }}>Invoice lifecycle badges:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <Badge variant={statusVariant("Draft")}>Draft</Badge>
        <Badge variant={statusVariant("Sent")}>Sent</Badge>
        <Badge variant={statusVariant("Outstanding")}>Outstanding</Badge>
        <Badge variant={statusVariant("Paid")}>Paid</Badge>
        <Badge variant={statusVariant("Overdue")}>Overdue</Badge>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};
