import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import Badge, { statusVariant } from "../Badge";

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof Badge> = {
  title: "Typography/Badge",
  component: Badge,
  tags: ["custom"],
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
    shape: {
      control: "select",
      options: ["rounded", "pill"],
      description: "Shape of the badge — pill for filter chips",
    },
    onRemove: {
      action: "remove",
      description: "Callback when close icon is clicked",
    },
  },
  parameters: {
    layout: "centered",
    appPages: [
      {
        label: "Waitlist (status pills, service tags)",
        vercel: "https://splose-current.vercel.app/waitlist",
        production: "https://acme.splose.com/waitlist",
      },
      {
        label: "Client > Notes tab (note status badges)",
        vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h/notes",
        production: "https://acme.splose.com/patients/446604/notes",
      },
      {
        label: "Client > Cases tab (case state badges)",
        vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h/cases",
        production: "https://acme.splose.com/patients/446604/cases",
      },
      {
        label: "Settings: Data import (import status badges)",
        vercel: "https://splose-current.vercel.app/settings/data-import",
        production: "https://acme.splose.com/settings/data-import",
      },
    ],
    referenceUrl: null,
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
        <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
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
          <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-table-header)' }}>
            <th style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Invoice</th>
            <th style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Client</th>
            <th style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Amount</th>
            <th style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Status</th>
            <th style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'left', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)' }}>Delivery</th>
          </tr>
        </thead>
        <tbody>
          <tr >
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, lineHeight: 1.57, color: 'var(--color-primary)' }}>INV-006312</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Sarah Mitchell</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>$185.00</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Paid")}>Paid</Badge></td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Sent")}>Sent</Badge></td>
          </tr>
          <tr >
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, lineHeight: 1.57, color: 'var(--color-primary)' }}>INV-006311</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>James Park</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>$95.50</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Overdue")}>Overdue</Badge></td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Sent")}>Sent</Badge></td>
          </tr>
          <tr >
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, lineHeight: 1.57, color: 'var(--color-primary)' }}>INV-006310</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Lisa Wang</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>$220.00</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}><Badge variant={statusVariant("Draft")}>Draft</Badge></td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }} />
          </tr>
          <tr >
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, lineHeight: 1.57, color: 'var(--color-primary)' }}>INV-006309</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>Mark Thompson</td>
            <td style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, textAlign: 'right', fontSize: 14, lineHeight: 1.57, color: 'var(--color-text)' }}>$150.00</td>
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
      <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>Appointment status badges:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <Badge variant={statusVariant("Scheduled")}>Scheduled</Badge>
        <Badge variant={statusVariant("Completed")}>Completed</Badge>
        <Badge variant={statusVariant("Cancelled")}>Cancelled</Badge>
        <Badge variant={statusVariant("No Show")}>No Show</Badge>
        <Badge variant={statusVariant("In progress")}>In progress</Badge>
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginTop: 24 }}>Note/progress note status badges:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <Badge variant={statusVariant("Draft")}>Draft</Badge>
        <Badge variant={statusVariant("Final")}>Final</Badge>
        <Badge variant={statusVariant("Delivered")}>Delivered</Badge>
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text-secondary)', marginTop: 24 }}>Invoice lifecycle badges:</p>
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

/* ================================================================== */
/*  4. PILL SHAPE (formerly Chip)                                      */
/* ================================================================== */

/** Pill-shaped badges for filter chips and tags. */
export const PillShape: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      <Badge variant="green" shape="pill">East Clinics</Badge>
      <Badge variant="purple" shape="pill">Physio</Badge>
      <Badge variant="yellow" shape="pill">Pending Review</Badge>
      <Badge variant="blue" shape="pill">11 Mar 2026 – 11 Mar 2026</Badge>
    </div>
  ),
  parameters: { layout: "padded" },
};

/* ------------------------------------------------------------------ */
/*  Removable filter chips                                             */
/*  Source: /invoices, /calendar — active filter indicators             */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Sizes — sm / md / lg                                               */
/*  sm: service/tag chips (waitlist page)                               */
/*  md: default (table status badges, filter pills)                    */
/*  lg: credit-balance / label-style badges (invoice detail)           */
/* ------------------------------------------------------------------ */

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 32, fontSize: 11, color: 'var(--color-text-secondary)' }}>sm</span>
        <Badge variant="blue" size="sm">Physiotherapy</Badge>
        <Badge variant="green" size="sm">Active</Badge>
        <Badge variant="gray" size="sm">Archived</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 32, fontSize: 11, color: 'var(--color-text-secondary)' }}>md</span>
        <Badge variant="blue">Physiotherapy</Badge>
        <Badge variant="green">Active</Badge>
        <Badge variant="gray">Archived</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 32, fontSize: 11, color: 'var(--color-text-secondary)' }}>lg</span>
        <Badge variant="green" size="lg">Credit balance: $680.00</Badge>
        <Badge variant="blue" size="lg">Outstanding</Badge>
      </div>
    </div>
  ),
  parameters: { layout: "padded" },
};

export const RemovableFilterChips: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      <Badge variant="blue" shape="pill" onRemove={fn()}>
        Location: East Clinics
      </Badge>
      <Badge variant="green" shape="pill" onRemove={fn()}>
        Practitioner: Dr. Smith
      </Badge>
      <Badge variant="purple" shape="pill" onRemove={fn()}>
        Status: Active
      </Badge>
      <Badge variant="gray" shape="pill" onRemove={fn()}>
        user@example.com
      </Badge>
    </div>
  ),
  parameters: { layout: "padded" },
};
