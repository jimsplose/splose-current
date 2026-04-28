import type { Meta, StoryObj } from "@storybook/react";
import PaymentStatusBadge from "../PaymentStatusBadge";
import type { PaymentStatus } from "../PaymentStatusBadge";

const meta: Meta<typeof PaymentStatusBadge> = {
  title: "Data Display/PaymentStatusBadge",
  component: PaymentStatusBadge,
  tags: ["custom"],
  argTypes: {
    status: {
      control: "select",
      options: [
        "paid",
        "outstanding",
        "overdue",
        "partial",
        "refunded",
        "failed",
        "draft",
        "void",
      ] satisfies PaymentStatus[],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    solid: { control: "boolean" },
  },
  parameters: {
    layout: "padded",
    splose: {
      status: "beta",
      summary:
        "Purpose-built badge for invoice payment status (Paid, Outstanding, Overdue, Partial, Refunded, Failed, Draft, Void).",
      whatToUseInstead:
        "<Badge variant=...> + statusVariant() lookup tables duplicated per caller.",
      referenceLibrary: "first-party",
      plan: "docs/ds-plans/PaymentStatusBadge.md",
      source: "src/components/ds/PaymentStatusBadge.tsx",
    },
    appPages: [
      {
        label: "Invoices list",
        vercel: "https://splose-current.vercel.app/invoices",
        localhost: "http://localhost:3000/invoices",
        production: "https://acme.splose.com/invoices",
      },
      {
        label: "Invoice detail",
        vercel: "https://splose-current.vercel.app/invoices/1",
        localhost: "http://localhost:3000/invoices/1",
        production: "https://acme.splose.com/invoices/1/view",
      },
      {
        label: "Client invoices",
        vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h/invoices",
        localhost: "http://localhost:3000/clients/cmngtw7n9005eycwg4e67506h/invoices",
        production: "https://acme.splose.com/patients/446604/invoices",
      },
    ],
    referenceUrl: null,
  },
};
export default meta;
type Story = StoryObj<typeof PaymentStatusBadge>;

const allStatuses: PaymentStatus[] = [
  "paid",
  "outstanding",
  "overdue",
  "partial",
  "refunded",
  "failed",
  "draft",
  "void",
];

/* ================================================================== */
/*  1. PLAYGROUND                                                      */
/* ================================================================== */

export const Playground: Story = {
  args: { status: "paid", size: "sm", solid: true },
};

/* ================================================================== */
/*  2. FEATURE STORIES                                                 */
/* ================================================================== */

export const AllStatuses: Story = {
  name: "Feature: All Statuses",
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {allStatuses.map((s) => (
        <PaymentStatusBadge key={s} status={s} size="md" />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: "Feature: Sizes",
  render: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <PaymentStatusBadge status="paid" size="sm" />
      <PaymentStatusBadge status="paid" size="md" />
      <PaymentStatusBadge status="paid" size="lg" />
    </div>
  ),
};

export const Outlined: Story = {
  name: "Feature: Outlined (solid=false)",
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {allStatuses.map((s) => (
        <PaymentStatusBadge key={s} status={s} size="md" solid={false} />
      ))}
    </div>
  ),
};

/* ================================================================== */
/*  3. RECIPE STORIES                                                  */
/* ================================================================== */

export const InvoiceListStatusColumn: Story = {
  name: "Recipe: Invoice List Status Column",
  render: () => (
    <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
          <th style={{ textAlign: "left", padding: "8px 12px" }}>Invoice</th>
          <th style={{ textAlign: "left", padding: "8px 12px" }}>Client</th>
          <th style={{ textAlign: "left", padding: "8px 12px" }}>Amount</th>
          <th style={{ textAlign: "left", padding: "8px 12px" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {[
          { id: "INV-0001", client: "Harry Nguyen", amount: "$450", status: "paid" as PaymentStatus },
          { id: "INV-0002", client: "Mira Chen", amount: "$120", status: "outstanding" as PaymentStatus },
          { id: "INV-0003", client: "Jamie Lee", amount: "$840", status: "overdue" as PaymentStatus },
          { id: "INV-0004", client: "Alex Park", amount: "$60", status: "draft" as PaymentStatus },
        ].map((r) => (
          <tr key={r.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
            <td style={{ padding: "8px 12px" }}>{r.id}</td>
            <td style={{ padding: "8px 12px" }}>{r.client}</td>
            <td style={{ padding: "8px 12px" }}>{r.amount}</td>
            <td style={{ padding: "8px 12px" }}><PaymentStatusBadge status={r.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const AgedDebtorsRow: Story = {
  name: "Recipe: Aged Debtors Row",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, maxWidth: 420 }}>
      <span style={{ flex: 1 }}>Harry Nguyen</span>
      <span style={{ fontWeight: 600 }}>$840</span>
      <PaymentStatusBadge status="overdue" />
    </div>
  ),
};

export const PatientInvoicesTab: Story = {
  name: "Recipe: Patient Invoices Tab",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
      {[
        { id: "INV-14130707", date: "22/04/2026", amount: "$120", status: "paid" as PaymentStatus },
        { id: "INV-14130712", date: "25/03/2026", amount: "$240", status: "outstanding" as PaymentStatus },
        { id: "INV-14130801", date: "01/03/2026", amount: "$180", status: "overdue" as PaymentStatus },
      ].map((i) => (
        <div
          key={i.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 0",
            borderBottom: "1px solid #f0f0f0",
            fontSize: 13,
          }}
        >
          <span style={{ flex: 1 }}>{i.id}</span>
          <span style={{ color: "#6E6E64" }}>{i.date}</span>
          <span style={{ width: 70, textAlign: "right", fontWeight: 600 }}>{i.amount}</span>
          <PaymentStatusBadge status={i.status} />
        </div>
      ))}
    </div>
  ),
};

export const InvoiceHeaderBadge: Story = {
  name: "Recipe: Invoice Header Badge",
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 20, fontWeight: 600 }}>Invoice INV-14130707</span>
      <PaymentStatusBadge status="paid" size="md" />
    </div>
  ),
};
